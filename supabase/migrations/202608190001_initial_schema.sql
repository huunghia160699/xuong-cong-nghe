create extension if not exists pgcrypto;

create type public.user_role as enum ('student', 'teacher', 'admin');
create type public.content_status as enum ('draft', 'published', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  description text not null default '',
  category text not null,
  level text not null default 'Cơ bản',
  status public.content_status not null default 'draft',
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position integer not null check (position >= 0),
  created_at timestamptz not null default now(),
  unique(course_id, position)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  slug text not null,
  title text not null,
  summary text not null default '',
  content jsonb not null default '{}'::jsonb,
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  position integer not null check (position >= 0),
  is_preview boolean not null default false,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(chapter_id, slug), unique(chapter_id, position)
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(user_id, course_id)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  last_viewed_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(user_id, lesson_id)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  course_id uuid references public.courses(id) on delete set null,
  lesson_id uuid references public.lessons(id) on delete set null,
  duration_minutes integer,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  prompt text not null,
  explanation text not null default '',
  position integer not null,
  points numeric(6,2) not null default 1,
  unique(quiz_id, position)
);

create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  label text not null,
  is_correct boolean not null default false,
  position integer not null,
  unique(question_id, position)
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  score numeric(6,2),
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create table public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  option_id uuid references public.question_options(id) on delete set null,
  is_correct boolean,
  answered_at timestamptz not null default now(),
  unique(attempt_id, question_id)
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  lesson_id uuid references public.lessons(id) on delete set null,
  title text not null,
  body text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.chapters enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.notes enable row level security;

create policy "public reads profiles minimally" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "published courses are public" on public.courses for select using (status = 'published' or public.is_admin());
create policy "published chapters are public" on public.chapters for select using (exists(select 1 from public.courses c where c.id = course_id and c.status = 'published') or public.is_admin());
create policy "published lessons are public" on public.lessons for select using (status = 'published' or is_preview or public.is_admin());
create policy "published quizzes are public" on public.quizzes for select using (status = 'published' or public.is_admin());
create policy "published quiz questions are public" on public.questions for select using (exists(select 1 from public.quizzes q where q.id = quiz_id and q.status = 'published') or public.is_admin());
create policy "published options are public" on public.question_options for select using (exists(select 1 from public.questions qu join public.quizzes q on q.id = qu.quiz_id where qu.id = question_id and q.status = 'published') or public.is_admin());

create policy "users manage own enrollments" on public.enrollments for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "users manage own progress" on public.lesson_progress for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "users manage own attempts" on public.quiz_attempts for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "users manage answers of own attempts" on public.quiz_answers for all using (exists(select 1 from public.quiz_attempts a where a.id = attempt_id and (a.user_id = auth.uid() or public.is_admin()))) with check (exists(select 1 from public.quiz_attempts a where a.id = attempt_id and (a.user_id = auth.uid() or public.is_admin())));
create policy "users manage own notes" on public.notes for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

create policy "admins manage courses" on public.courses for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage chapters" on public.chapters for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage lessons" on public.lessons for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage quizzes" on public.quizzes for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage questions" on public.questions for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage options" on public.question_options for all using (public.is_admin()) with check (public.is_admin());
