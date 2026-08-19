# Database v1.0

## Nhóm bảng

- Identity: `profiles`
- Learning content: `courses`, `chapters`, `lessons`
- Learning state: `enrollments`, `lesson_progress`
- Practice: `quizzes`, `questions`, `question_options`, `quiz_attempts`, `quiz_answers`
- Personal: `notes`

## Quy ước

- Primary key UUID, dùng `gen_random_uuid()`.
- Timestamp dùng `timestamptz`; mọi bảng mutable có `updated_at`.
- Slug duy nhất cho tài nguyên public.
- Enum Postgres cho role/status ổn định.
- Xóa nội dung ưu tiên soft delete/status; dữ liệu học tập không cascade ngoài ý muốn.

## RLS

Nội dung published đọc công khai. Student chỉ quản lý enrollment, progress, attempt và note của chính mình. Admin toàn quyền thông qua `profiles.role = 'admin'`. Service role chỉ dùng ở server kín.

Migration mẫu: `supabase/migrations/202608190001_initial_schema.sql`.
