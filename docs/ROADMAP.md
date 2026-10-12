# Roadmap — Xưởng Công Nghệ

## MVP 0.1 — Nền và vòng học thử
- [x] Homepage, Course Detail, Student Dashboard, Lesson, Quiz, Result
- [x] Nội dung Excel 9 bài + 6 câu hỏi
- [x] Local demo progress + kết quả
- [x] Unit test, typecheck, build và smoke test demo

## MVP 0.2 — Auth và dữ liệu thật (mã nguồn đã có, cần cấu hình triển khai)
- [x] Supabase SSR client và middleware làm mới session
- [x] Đăng nhập, đăng ký học viên, khôi phục/đổi mật khẩu, đăng xuất
- [x] Kiểm tra quyền student/admin ở middleware và Server Layout
- [x] Tự tạo profiles.role=student bằng trigger
- [x] Lưu tiến độ bài học thật trong bảng lesson_progress (code)
- [x] RPC submit_quiz/get_quiz_result chấm điểm và xem kết quả theo tài khoản (code)
- [x] Quiz API không trả đáp án đúng trước khi nộp
- [x] Live Student Dashboard hiển thị tiến độ và bài nộp theo tài khoản
- [x] Live Admin Dashboard dữ liệu thật + tạo/đổi trạng thái khóa học
- [x] Seed Supabase 9 lessons + 6 quiz questions
- [ ] **Chưa áp migrations/seed vào Supabase project thực**
- [ ] **Chưa kiểm thử Auth, RLS, RPC với nhiều tài khoản trong môi trường thật**
- [ ] **Chưa có deploy chính thức**
- [ ] Editor CRUD chương/bài/câu hỏi và autosave quiz đang làm dở

## MVP 0.3 — Thực hành chuyên sâu
- Excel Lab tương tác và tự chấm
- Word Lab, Notes, Tools, Resources
- Teacher Workspace, AI Tutor, thương mại ở giai đoạn sau

Chi tiết cấu hình: `docs/SUPABASE_SETUP.md`.
