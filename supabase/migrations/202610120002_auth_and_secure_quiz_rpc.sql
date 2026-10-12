begin;

-- Every Auth user gets a student profile. Never trust requested roles in metadata.
create or replace function public.create_new_student_profile()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(new.email, ''), '@', 1), 'Học viên'), 100),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users for each row execute function public.create_new_student_profile();

-- Existing users registered before the trigger also need a profile.
insert into public.profiles (id, display_name, role)
select u.id, left(coalesce(nullif(trim(u.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(u.email, ''), '@', 1), 'Học viên'), 100), 'student'
from auth.users u
on conflict (id) do nothing;

-- Notes are private even to admins. A security-definer function is required for explicit audit needs.
drop policy if exists "users manage own notes" on public.notes;
create policy "users manage private notes" on public.notes
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- A learner may enroll only in published courses at MVP; paid entitlements are a separate future feature.
drop policy if exists "users manage own enrollments" on public.enrollments;
create policy "users read own enrollments" on public.enrollments
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());
create policy "users enroll in published free courses" on public.enrollments
  for insert to authenticated
  with check (
    user_id = (select auth.uid()) and
    exists (select 1 from public.courses c where c.id = course_id and c.status = 'published')
  );
-- Future premium courses MUST have an access-level/entitlement check before enabling paid content.

-- Do not leak answer explanations and correct flags to the browser before submission.
revoke select on public.questions from anon, authenticated;
grant select (id, quiz_id, prompt, position, points) on public.questions to anon, authenticated;
revoke select on public.question_options from anon, authenticated;
grant select (id, question_id, label, position) on public.question_options to anon, authenticated;

-- MVP single-choice quizzes have exactly one correct option per question.
create unique index if not exists question_options_one_correct_per_question
  on public.question_options (question_id) where is_correct = true;

-- Only authenticated accounts may invoke the scoring function.
create or replace function public.submit_quiz(p_quiz_slug text, p_answers jsonb)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_quiz_id uuid;
  v_attempt_id uuid;
  v_q record;
  v_option_id uuid;
  v_is_correct boolean;
  v_points_total numeric := 0;
  v_points_earned numeric := 0;
  v_answer_id text;
  v_score numeric;
begin
  if v_user is null then raise exception 'Authentication required' using errcode = '28000'; end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' or octet_length(p_answers::text) > 20000 then
    raise exception 'Invalid answers' using errcode = '22023';
  end if;
  select id into v_quiz_id from public.quizzes
    where slug = p_quiz_slug and status = 'published';
  if v_quiz_id is null then raise exception 'Quiz not available' using errcode = '22023'; end if;

  if exists (
    select 1 from jsonb_object_keys(p_answers) as answer_id
    where not exists (
      select 1 from public.questions q where q.quiz_id = v_quiz_id and q.id::text = answer_id
    )
  ) then
    raise exception 'Question does not belong to quiz' using errcode = '22023';
  end if;

  insert into public.quiz_attempts(quiz_id, user_id, score, submitted_at)
    values (v_quiz_id, v_user, null, now()) returning id into v_attempt_id;

  for v_q in select id, points from public.questions where quiz_id = v_quiz_id order by position loop
    v_points_total := v_points_total + v_q.points;
    v_answer_id := p_answers ->> v_q.id::text;
    if v_answer_id is not null then
      begin
        v_option_id := v_answer_id::uuid;
      exception when invalid_text_representation then
        raise exception 'Invalid option ID' using errcode = '22023';
      end;
      select o.is_correct into v_is_correct from public.question_options o
        where o.id = v_option_id and o.question_id = v_q.id;
      if not found then raise exception 'Option does not belong to question' using errcode = '22023'; end if;
      if v_is_correct then v_points_earned := v_points_earned + v_q.points; end if;
      insert into public.quiz_answers(attempt_id, question_id, option_id, is_correct)
        values (v_attempt_id, v_q.id, v_option_id, v_is_correct);
    end if;
  end loop;

  v_score := case when v_points_total = 0 then 0
    else round(100 * v_points_earned / v_points_total, 2) end;
  update public.quiz_attempts set score = v_score where id = v_attempt_id;

  return jsonb_build_object('attemptId', v_attempt_id, 'score', v_score);
end;
$$;
revoke all on function public.submit_quiz(text, jsonb) from public, anon;
grant execute on function public.submit_quiz(text, jsonb) to authenticated;

-- Only the owner may review answers; correct answer and explanations are returned AFTER submission.
create or replace function public.get_quiz_result(p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_attempt public.quiz_attempts%rowtype;
  v_details jsonb;
  v_total integer;
  v_correct integer;
begin
  if v_user is null then raise exception 'Authentication required' using errcode = '28000'; end if;
  select * into v_attempt from public.quiz_attempts
    where id = p_attempt_id and user_id = v_user and submitted_at is not null;
  if not found then raise exception 'Result not found' using errcode = '22023'; end if;

  select count(*)::integer into v_total from public.questions where quiz_id = v_attempt.quiz_id;
  select count(*)::integer into v_correct from public.quiz_answers
    where attempt_id = v_attempt.id and is_correct = true;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', q.id,
      'question', q.prompt,
      'selected', selected_option.label,
      'correctAnswer', correct_option.label,
      'explanation', q.explanation,
      'isCorrect', coalesce(a.is_correct, false)
    ) order by q.position
  ), '[]'::jsonb) into v_details
  from public.questions q
  left join public.quiz_answers a on a.question_id = q.id and a.attempt_id = v_attempt.id
  left join public.question_options selected_option on selected_option.id = a.option_id
  left join public.question_options correct_option on correct_option.question_id = q.id and correct_option.is_correct = true
  where q.quiz_id = v_attempt.quiz_id;

  return jsonb_build_object(
    'attemptId', v_attempt.id, 'score', v_attempt.score,
    'submittedAt', v_attempt.submitted_at, 'correct', v_correct,
    'total', v_total, 'questions', v_details
  );
end;
$$;
revoke all on function public.get_quiz_result(uuid) from public, anon;
grant execute on function public.get_quiz_result(uuid) to authenticated;

commit;
