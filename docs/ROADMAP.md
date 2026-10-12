# Roadmap — Xưởng Công Nghệ

## MVP 0.1 — Giao diện và vòng học thử

- [x] Design system và Public/Student/Admin shells
- [x] Các màn hình nền và mock data
- [x] 9 bài Excel căn bản có nội dung và điều hướng
- [x] Đánh dấu hoàn thành bài; lưu cục bộ trên trình duyệt
- [x] Trắc nghiệm 6 câu: lưu lựa chọn, quay lại, nộp, tính điểm
- [x] Quiz Result: giải thích từng câu, ôn tập
- [x] Dashboard hiển thị tiến độ và lịch sử học thử
- [x] Thêm workflow CI typecheck + build (cần xác nhận run xanh)
- [ ] Xác nhận kiểm thử trình duyệt 360px / 768px / 1280px
- [ ] Xác nhận production build và xử lý các lỗi CI nếu có

**Lưu ý:** Đây là bản demo không xác thực. Tiến độ/điểm nằm trong `localStorage` của máy hiện tại, không có đồng bộ đa thiết bị và không được dùng làm điểm chính thức.

## MVP 0.2 — Dữ liệu thật và bảo mật

- [ ] Cấu hình / khôi phục Supabase Dev
- [ ] Áp migration bảo vệ role, correct answer, score và quiz answer
- [ ] Supabase Auth / profiles / route guards cho Student + Admin
- [ ] Đổi mock repository sang Supabase query/action
- [ ] Chấm quiz ở server; autosave câu trả lời có kiểm tra
- [ ] Enrollment, lesson progress, quiz attempt thực
- [ ] CRUD khóa, chương, bài, câu hỏi phía admin
- [ ] Kiểm thử RLS cho learner và admin; không công bố đáp án trước submit

## MVP 0.3 — Luyện tập sâu

- [ ] Excel Lab engine và tự chấm
- [ ] Sổ tay, tài nguyên và báo cáo tiến độ
- [ ] Word Lab
- [ ] CMS bài viết / dự án / thương mại số

## Sau v1.0

Teacher Workspace, lớp học, giao bài, Coding Lab, AI Tutor, chứng nhận và subscription.
