-- Migration bổ sung: không sửa initial_schema đã được ghi vào Git.
-- Chạy migration này trước khi cho tài khoản thật truy cập quiz / admin.
begin;

-- Không để người dùng tự nâng role bằng cập nhật hàng profiles của chính mình.
revoke update on public.profiles from anon, authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;

-- RLS bảo vệ hàng, không bảo vệ cột: cần ẩn đáp án đúng bằng quyền theo cột.
revoke select on public.question_options from anon, authenticated;
grant select (id, question_id, label, position) on public.question_options to anon, authenticated;

-- Điểm và thời điểm nộp phải được chấm/ghi bởi service server đáng tin cậy.
drop policy if exists "users manage own attempts" on public.quiz_attempts;
create policy "users read own attempts" on public.quiz_attempts
  for select using (user_id = (select auth.uid()) or public.is_admin());

create policy "users start unscored attempts" on public.quiz_attempts
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and score is null
    and submitted_at is null
  );

revoke update, delete on public.quiz_attempts from anon, authenticated;
revoke insert on public.quiz_attempts from anon, authenticated;
grant insert (quiz_id, user_id) on public.quiz_attempts to authenticated;

-- Không cho client tự gửi is_correct hay thay đổi các câu trả lời đã chấm.
-- Bước tích hợp Supabase sau sẽ triển khai submit endpoint / RPC được kiểm tra.
drop policy if exists "users manage answers of own attempts" on public.quiz_answers;
create policy "users read own quiz answers" on public.quiz_answers
  for select using (
    exists (
      select 1 from public.quiz_attempts a
      where a.id = attempt_id and (a.user_id = (select auth.uid()) or public.is_admin())
    )
  );
revoke insert, update, delete on public.quiz_answers from anon, authenticated;

commit;
