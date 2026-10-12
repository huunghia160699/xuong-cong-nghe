# Cấu hình Supabase Dev — Xưởng Công Nghệ

## Chuẩn bị
1. Tạo hoặc khôi phục một Supabase project dành riêng cho môi trường **development**. Không dùng dữ liệu học viên thật trong giai đoạn kiểm thử.
2. Sao chép `.env.example` thành `.env.local`, điền:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon/publishable key.
   - `NEXT_PUBLIC_APP_URL` — URL đầy đủ của ứng dụng.
   - `NEXT_PUBLIC_USE_MOCK_DATA=false`.
3. Thiết lập các biến `NEXT_PUBLIC_*` **trước khi build** (chúng được nhúng vào bundle khi build). Khi thay đổi chế độ Demo/Live, hãy build lại ứng dụng. Chạy migrations theo thứ tự trong `supabase/migrations/`, sau đó chạy `supabase/seed.sql`. Không sửa các migration đã áp dụng.
4. Supabase Authentication → URL Configuration: cấu hình Site URL và Redirect URLs phù hợp, gồm `http://localhost:3000/auth/callback` cho development và URL callback của preview/production khi sử dụng.
5. Bật email confirmation tùy chính sách; cấu hình SMTP trước khi mở đăng ký công khai.

## Kiểm tra
- Người chưa đăng nhập vào `/student` hoặc `/admin` phải chuyển tới `/dang-nhap`.
- Người đăng ký mới được tạo `profiles.role='student'`; không có chức năng chọn role tại client.
- Học viên vào `/admin` bị từ chối. Muốn cấp admin, chỉ dùng thao tác SQL quản trị riêng; KHÔNG qua client.
- `/student/khoa-hoc/excel-can-ban/giao-dien-va-vung-lam-viec`: hoàn thành bài và xác nhận tiến độ lưu qua tài khoản sau khi tải lại trang.
- `/student/quiz`: 6 câu lấy từ Supabase; API không có `is_correct`/giải thích trước nộp.
- Nộp bài: RPC `submit_quiz` chấm ở PostgreSQL; `get_quiz_result` chỉ cho chính người nộp xem kết quả.
- Hai tài khoản học viên không được đọc bài nộp/tiến độ của nhau.
- Kiểm tra trực tiếp Data API: client không thể UPDATE `profiles.role`, UPDATE `quiz_attempts.score` hoặc SELECT `question_options.is_correct`.

## Giới hạn giai đoạn
- Quiz thật được chấm phía server; hiện chưa có autosave bài làm vào DB trước nộp.
- Nội dung bài Excel tiếp tục dùng dữ liệu biên soạn từ mã nguồn; tiến độ và lịch sử chấm điểm dùng Supabase.
- Không có quản trị người dùng / CMS đầy đủ. Chỉ mở quyền admin cho người quản trị được xác minh.
- Nếu thiếu biến cấu hình trong live mode: ứng dụng không được tự động chuyển sang demo.
- Không đưa service-role key vào frontend hoặc GitHub; luồng đang dùng SSR client + RLS + RPC.
- Bản demo mặc định vẫn chạy không cần Supabase khi `NEXT_PUBLIC_USE_MOCK_DATA=true`.

## Cảnh báo production
Trước khi xuất bản cho người học thực, cần rà soát RLS toàn bộ bảng, chính sách email confirmation, rate limits, giới hạn đăng ký, policy về premium entitlements và kiểm thử API/RPC bằng tài khoản thực.


## Cấp quyền quản trị lần đầu (thao tác chủ dự án)

Sau khi tài khoản đã đăng ký, chủ dự án có thể chạy SQL trong Supabase SQL Editor với quyền quản trị (thay email theo tài khoản **đã xác minh**):

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'admin@example.com');
```

Đây là thao tác vận hành riêng của chủ dự án. Không tạo endpoint cấp vai trò, không cho người dùng tự truyền `role` khi đăng ký.
