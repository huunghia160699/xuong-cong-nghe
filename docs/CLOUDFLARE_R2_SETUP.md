# Cloudflare R2 — kho lưu trữ Xưởng Công Nghệ

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
