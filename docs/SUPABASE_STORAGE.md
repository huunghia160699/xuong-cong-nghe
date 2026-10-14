# Supabase Storage — kho tài liệu Xưởng Công Nghệ

## Đã cấu hình
- Bucket: `xcn-private-documents` (**private**, không có public URL).
- Giới hạn tại bucket: **20 MiB mỗi tệp**, MIME cho PDF, ảnh, Word, Excel, PowerPoint, TXT.
- RLS trên `storage.objects`: chỉ tài khoản đã đăng nhập, có `profiles.role = 'admin'`, được SELECT/INSERT/DELETE đối tượng trong thư mục `admin/`. Không có quyền UPDATE/upsert.
- Giao diện Admin: `/admin/kho-tai-lieu`, liệt kê 50 tệp/trang, tải lên, lấy signed URL 90 giây, xóa có xác nhận.
- Không cần thẻ Cloudflare, không dùng R2 hoặc khóa dịch vụ Supabase đặc quyền trong website.

## Kiểm thử và bật live
1. Production trên Vercel vẫn giữ `NEXT_PUBLIC_USE_MOCK_DATA=true` để tránh mở đăng ký khi chưa kiểm thử.
2. Trong Vercel: điền `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_USE_MOCK_DATA=false` và `NEXT_PUBLIC_APP_URL`. Đây là **publishable/anon key**, tuyệt đối không dùng `service_role`.
3. Supabase Auth → URL Configuration: thêm URL chính của Vercel và callback `/auth/callback`. Kiểm tra email confirmation / SMTP trước khi cho đăng ký thực.
4. Tạo một tài khoản đã xác minh; chỉ cấp Admin bằng SQL Editor do chủ dự án quản lý. Không có API tự cấp role.
5. Đăng nhập Admin, tải lên một PDF nhỏ, tải xuống và xóa. Tài khoản Student/anonymous phải bị từ chối (RLS).
6. Kiểm tra hạn mức dung lượng và băng thông trong Supabase Dashboard. Free plan có hạn mức tổng dung lượng khác giới hạn 20 MiB/tệp ở bucket.

## Giới hạn hiện tại
- Quản lý tệp **chỉ dành cho Admin**, chưa có thư viện học viên, gắn bài học, quyền tải theo khóa học, metadata nghiệp vụ, thùng rác hoặc phiên bản.
- Với tệp lớn hơn 6 MB, mạng không ổn định có thể gây lỗi; sẽ bổ sung TUS resumable upload khi cần.
- Tệp xóa là xóa thật. Chỉ sử dụng cho nội dung không nhạy cảm và đã có bản sao trong giai đoạn thử nghiệm.
- Signed URL có hiệu lực 90 giây; ai có link trong thời gian đó cũng có thể tải. Không ghi lại link trong log.
- Đã áp migration trên Supabase Management API với version runtime; nếu chạy Supabase CLI sau này, **đối chiếu lịch sử migration trước để tránh áp trùng**.

Nguồn tham khảo: https://supabase.com/docs/guides/storage/security/access-control
