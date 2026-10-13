# Supabase — tình trạng thực tế ngày 13/10/2026

Project: `bpxwpfmjoojrgqlfkqgz` — `huunghia160699's Xuong-Cong-Nghe`.
Region: `ap-southeast-1`.

## Đã thực hiện

- Kết nối được Supabase trực tiếp; trước đó trạng thái `INACTIVE`, đã khôi phục và thấy `ACTIVE_HEALTHY`.
- Trước khi triển khai: `public` không có bảng, lịch sử migration trống.
- Đã áp qua Supabase API bốn migration (tên trên lịch sử quản trị):
  - `initial_schema_20260819`
  - `secure_quiz_grants_20261012`
  - `auth_secure_quiz_rpc_20261012`
  - `harden_internal_trigger_function_grants_20261013`
- Bản kiểm tra: 12 bảng public với RLS bật.
- Đã nạp bộ `supabase/seed.sql`: 3 khóa, 3 chương, 9 bài, 1 quiz, 6 câu, 24 phương án và 6 đáp án đúng.
- Tại thời điểm kiểm tra: `auth.users = 0`, chưa có dữ liệu người học thực tế.
- Security advisor phát hiện public EXECUTE trên một số SECURITY DEFINER functions: đã thu hồi EXECUTE cho `create_new_student_profile()` và `rls_auto_enable()`. `is_admin()` vẫn được các RLS policy public sử dụng; `submit_quiz` và `get_quiz_result` được cấp EXECUTE cho authenticated có chủ ý.

## Việc **chưa** thực hiện

- Chưa cấu hình và build website với env Supabase thật; không có deploy live.
- Chưa tạo hoặc đăng nhập tài khoản thử, chưa kiểm thử hành trình end-to-end live và RLS giữa hai tài khoản học viên.
- Chưa xác minh chính sách đăng ký email, SMTP, reset mật khẩu, rate limit và phụ thuộc deployment.
- Chưa đóng toàn bộ cảnh báo bảo mật Advisor; xem kết quả mới nhất trên dashboard, kiểm tra riêng `is_admin()`.

## Lưu ý migration history

Bốn migration được áp bằng Supabase Management API nên version do Supabase cấp theo thời gian thực, không tương ứng chính xác với timestamp trong tên các file repo. Khi dùng `supabase db push` / CLI trong tương lai, phải **đối chiếu/reconcile lịch sử migration** trước; không áp lại các migration cũ một cách máy móc.
