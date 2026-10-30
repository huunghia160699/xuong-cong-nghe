# Supabase Storage — kho tài liệu Xưởng Công Nghệ

## Đã cấu hình
- Bucket: `xcn-private-documents` (**private**, không có public URL).
- Giới hạn tại bucket: **20 MiB mỗi tệp**, MIME cho PDF, ảnh, Word, Excel, PowerPoint, TXT.
- RLS trên `storage.objects`: chỉ tài khoản đã đăng nhập, có `profiles.role = 'admin'`, được SELECT/INSERT/DELETE đối tượng trong thư mục `admin/`. Không có quyền UPDATE/upsert.
- Giao diện Admin: `/admin/kho-tai-lieu`, liệt kê 50 tệp/trang, tải lên, lấy signed URL 90 giây, xóa có xác nhận.
- Không cần thẻ Cloudflare, không dùng R2 hoặc khóa dịch vụ Supabase đặc quyền trong website.

## Kiểm thử và bật live
1. **Hướng dẫn tại thời điểm lập tài liệu đã lỗi thời:** Production đã bật Supabase Live. Trước thao tác hiện tại phải đối chiếu environment và Auth/redirect; tuyệt đối không tự chuyển sang Demo để kiểm thử quyền.
2. Trong Vercel: điền `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_USE_MOCK_DATA=false` và `NEXT_PUBLIC_APP_URL`. Đây là **publishable/anon key**, tuyệt đối không dùng `service_role`.
3. Supabase Auth → URL Configuration: thêm URL chính của Vercel và callback `/auth/callback`. Kiểm tra email confirmation / SMTP trước khi cho đăng ký thực.
4. Tạo một tài khoản đã xác minh; chỉ cấp Admin bằng SQL Editor do chủ dự án quản lý. Không có API tự cấp role.
5. Đăng nhập Admin, tải lên một PDF nhỏ, tải xuống và xóa. Tài khoản Student/anonymous phải bị từ chối (RLS).
6. Kiểm tra hạn mức dung lượng và băng thông trong Supabase Dashboard. Free plan có hạn mức tổng dung lượng khác giới hạn 20 MiB/tệp ở bucket.

## Hướng thay thế: Cloudflare R2 (chưa được triển khai)

> Đây là ý tưởng tùy chọn, không phải storage Production. Không cấu hình R2, mua gói, cấp token hoặc chuyển dữ liệu khi chưa có yêu cầu.

<details>
<summary>Tài liệu thiết kế và thử nghiệm R2 nguyên bản (mở khi cần)</summary>

### Kế hoạch Cloudflare R2 — chưa triển khai

## Tình trạng
Đã chuẩn bị backend tạo URL upload/download có chữ ký AWS SigV4 và trang Admin thử nghiệm.
**Chưa kết nối tài khoản Cloudflare, chưa có bucket hoặc API token được cấu hình trong Vercel.**
Chế độ demo của website **không** cho phép upload vào R2.

## Cấu hình tài khoản Cloudflare

1. Vào [Cloudflare R2](https://dash.cloudflare.com/?to=/:account/r2/overview). Nếu tài khoản chưa kích hoạt R2, kiểm tra điều kiện thanh toán trước khi kích hoạt; không tự mua gói khi chưa xác nhận.
2. Tạo bucket **private**, ví dụ `xcn-private` (Storage Class: Standard, tùy chọn location APAC phù hợp). **Không bật public bucket**.
3. R2 → Account Details → API Tokens → Create Account API token, quyền **Object Read & Write** và **chỉ cấp vào bucket này**, không cấp toàn account nếu không cần.
4. Trong Vercel → Project `xuong-cong-nghe` → Settings → Environment Variables, tạo bốn biến **server-only**:
   - `R2_ACCOUNT_ID`: Cloudflare account ID (32 ký tự hex).
   - `R2_BUCKET`: ví dụ `xcn-private`.
   - `R2_ACCESS_KEY_ID`: Access Key ID của R2.
   - `R2_SECRET_ACCESS_KEY`: Secret Access Key của R2.
5. Tạo các biến cho môi trường cần thử và **Redeploy**. Không đặt `NEXT_PUBLIC_` trước tên các biến R2. Không gửi khóa vào chat, GitHub hoặc tài liệu.
6. Để dùng trang Admin `/admin/kho-tai-lieu`, cần bật và **kiểm thử hoàn chỉnh** Supabase Auth trong môi trường live, cấp `profiles.role='admin'` bằng kênh quản trị đáng tin cậy.

### CORS cho PUT từ trình duyệt

Trong bucket R2 → Settings → CORS policy, sử dụng policy tương tự, đổi origin cho đúng miền thực tế:

```json
[
  {
    "AllowedOrigins": ["https://xuong-cong-nghe.vercel.app"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Không dùng AllowedOrigins `*` cho nội dung riêng tư.

## Thiết kế bản thử

- API `POST /api/storage/presign` chỉ cấp URL **PUT** khi xác minh Supabase Auth và `profiles.role='admin'`. Mã tệp ngẫu nhiên bên dưới `private/admin/{userId}/`.
- Chữ ký 5 phút, giới hạn MIME; giao diện thử nghiệm giới hạn file tối đa 25 MB.
- `POST /api/storage/download-link` chỉ tạo URL **GET** 2 phút cho Admin.
- Mã bí mật chỉ đọc ở server. Không mở quyền trực tiếp cho học viên.
- **Giới hạn 25 MB chỉ kiểm tra trong yêu cầu cấp URL và trình duyệt, R2 không tự kiểm tra giới hạn kích thước này theo chữ ký.** Cần backend xác thực hậu-upload qua metadata/HEAD, quota và chống lạm dụng trước khi cho học viên tự upload.
- **Chưa có bảng metadata, danh mục file, phiên bản, antivirus/quét nội dung, multipart upload, quota, xóa file hoặc tích hợp CMS.** Không dùng cho tệp quan trọng / dữ liệu thật ở giai đoạn đầu.
- URL có chữ ký là bearer capability; bất kỳ ai có URL đều thao tác được lên object cụ thể trước khi hết hạn. Tránh lưu URL trong analytics/log.

## Kiểm thử khi đã có cấu hình

1. Xác nhận `NEXT_PUBLIC_USE_MOCK_DATA=false` và Auth/RLS đã kiểm thử; đăng nhập bằng Admin.
2. Vào `/admin/kho-tai-lieu`, tải thử một file PDF nhỏ và lưu object key.
3. Kiểm tra Cloudflare R2 có object mới; thử link tải xuống.
4. Kiểm tra người chưa đăng nhập / user role student nhận 401/403 từ cả hai API.
5. Chặn upload file .exe, file khác định dạng, kiểm thử CORS ở domain thực.
6. Kiểm tra chi phí và quản lý vòng đời object trước khi bật public.

## Tham khảo
- https://developers.cloudflare.com/r2/api/tokens/
- https://developers.cloudflare.com/r2/api/s3/presigned-urls/
- https://developers.cloudflare.com/r2/buckets/cors/


</details>

## Giới hạn hiện tại
- Quản lý tệp **chỉ dành cho Admin**, chưa có thư viện học viên, gắn bài học, quyền tải theo khóa học, metadata nghiệp vụ, thùng rác hoặc phiên bản.
- Với tệp lớn hơn 6 MB, mạng không ổn định có thể gây lỗi; sẽ bổ sung TUS resumable upload khi cần.
- Tệp xóa là xóa thật. Chỉ sử dụng cho nội dung không nhạy cảm và đã có bản sao trong giai đoạn thử nghiệm.
- Signed URL có hiệu lực 90 giây; ai có link trong thời gian đó cũng có thể tải. Không ghi lại link trong log.
- Đã áp migration trên Supabase Management API với version runtime; nếu chạy Supabase CLI sau này, **đối chiếu lịch sử migration trước để tránh áp trùng**.

Nguồn tham khảo: https://supabase.com/docs/guides/storage/security/access-control
