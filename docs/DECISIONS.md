# Quyết định phát triển

## 2026-10-12 — Hoàn thiện vòng học mẫu trước backend

- Giữ stack đang chạy: Next.js 15 / React 19 / Tailwind 3 trong giai đoạn này.
- Tạo luồng học thử Excel với 9 bài và 6 câu quiz; không thêm thư viện ngoài.
- Dùng `localStorage` để giữ tiến độ, bài làm và điểm trên cùng một trình duyệt. Đây là storage **demo, không xác thực**, dễ xóa và không đồng bộ giữa máy.
- Không được dùng `correctIndex` gửi sang trình duyệt hay chấm điểm client khi có tài khoản thật. Chuyển scoring sang server trước Supabase integration.
- Migration mới hạn chế quyền xem `question_options.is_correct`, tự sửa `quiz_attempts.score`, `quiz_answers.is_correct` và tự nâng `profiles.role`.
- Trang admin hiện chỉ là mô phỏng, **chưa có route guard**; không nhập dữ liệu thật, không đưa vào môi trường công khai như admin vận hành.
- Tạo CI typecheck và build; chưa coi hoàn thành đến khi pipeline chạy thành công và có kiểm thử browser.

## Quyết định chưa đóng

- Tên thương hiệu, logo, domain và triển khai production.
- Cách thiết kế endpoint nộp quiz và hệ thống entitlement.
- Thư viện mô phỏng spreadsheet cho Excel Lab.
- Teacher Workspace, thanh toán, AI Tutor và Coding Lab nằm sau MVP.
