# Xưởng Công Nghệ — Kiểm toán đồng bộ Roadmap và các chốt bảo mật (2026-10-29)

## Giới hạn và trạng thái
Đợt này chỉ đọc dữ liệu Production. **Không thực hiện INSERT/UPDATE/DELETE**, không thay đổi role, RLS, Auth, trigger hay migrations trên Supabase Production. Mục tiêu của PR là tăng độ an toàn của mã ứng dụng và bộ kiểm thử.

### Supabase Production — đối chiếu read-only
- Project: `bpxwpfmjoojrgqlfkqgz` — ACTIVE_HEALTHY.
- `admin_roadmap`: một tài liệu `global-master-roadmap`, **version 4**, 20 việc lớn; snapshot gần nhất 2026-10-27 UTC. Dùng SHA/digest tại thời điểm đối chiếu để phát hiện thay đổi về sau, không đưa toàn bộ nội dung riêng tư vào GitHub.
- `admin_roadmap_events`: 4 sự kiện, phiên bản 1 đến 4; sự kiện cuối khớp phiên bản tài liệu.
- Auth: 2 tài khoản, 2 tài khoản đã xác minh email; hồ sơ gồm 1 Admin, 1 Student. Kiểm tra cơ sở dữ liệu **không tương đương** test truy cập với hai JWT thật.
- 14 bảng public đã bật RLS. `admin_roadmap` chỉ cấp SELECT/INSERT/UPDATE cho authenticated, có policy tương ứng; `admin_roadmap_events` chỉ cấp SELECT cho authenticated, RLS chỉ Admin đọc. Các quyền này cần tiếp tục được kiểm tra bằng JWT.
- Chưa có Supabase branch thử nghiệm riêng, do đó **không thử ghi trực tiếp** để xác minh RLS hoặc CRUD trên Production.

### Các rủi ro và giải pháp trong mã nguồn
1. **Bản nháp giả khác biệt:** thay `JSON.stringify` trực tiếp bằng so sánh dữ liệu đã chuẩn hóa thứ tự khóa. Version cũ nhưng nội dung giống nhau không còn kích hoạt phục hồi sai; bản khác thật vẫn được giữ.
2. **Thành công chưa được kiểm chứng:** sau PUT, GET lại Roadmap và đối chiếu đầy đủ version + nội dung; chỉ báo “Đã lưu và đọc lại thành công” nếu đạt. Nếu GET lỗi/mismatch, giữ bản nháp và ngừng tự ghi; không retry PUT mù.
3. **Tải lại làm mất chỉnh sửa cục bộ:** trước khi thay bản đang sửa bằng dữ liệu máy chủ, tạo checkpoint cục bộ; nếu không sao lưu được thì dừng.
4. **Ngăn kiểm thử ghi trên Production:** `scripts/verify-roadmap-rls.mjs --write` đòi `RLS_TEST_PROJECT_REF` và URL chính thức trùng ref không phải Production, cùng hai cờ xác nhận, để không dùng custom domain né chặn.

### Security Advisor (chưa áp dụng thay đổi quyền)
- `anon_security_definer_function_executable`: `public.is_admin()` callable từ anon. Cần đánh giá liên quan policy trước khi thu hồi EXECUTE. [Tham khảo](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable)
- `authenticated_security_definer_function_executable`: `public.get_quiz_result()`, `public.is_admin()`, `public.submit_quiz()`. Kiểm tra mục đích từng RPC và phép kiểm tra quyền ở trong hàm. [Tham khảo](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable)
- `auth_leaked_password_protection`: bảo vệ mật khẩu lộ lọt đang tắt. [Tham khảo](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

### Quy trình nghiệm thu còn thiếu — **không đánh dấu đạt**
1. Trong phiên Admin Live trên trình duyệt: tải file **Sao lưu từ Supabase** (gồm revision/event digest); lưu riêng trên thiết bị, không commit vào repository. Tải tiếp **Sao lưu JSON** để bảo vệ bản đang xem. Xem khác biệt giữa server và bản nháp, không bấm Khôi phục khi chưa quyết định.
2. Trên Supabase **branch/project thử nghiệm cách ly**, có ít nhất 2 Auth user đã xác minh và phân vai riêng: chạy `scripts/verify-roadmap-rls.mjs` (read-only), rồi mới `--write` với ba biến `RLS_TEST_PROJECT_REF`, `RLS_TEST_ISOLATED=YES`, `RLS_WRITE_ACK=I_UNDERSTAND`. KHÔNG nhập mật khẩu/token vào GitHub/Chat.
3. Đăng nhập Admin Live và kiểm thử tạo, chỉnh sửa, xóa **đối tượng thử nghiệm trên môi trường thử nghiệm**; sau mỗi thao tác reload/xem lại phiên bản, đối chiếu lịch sử; thử hai tab xung đột 409, ngắt mạng, và thử phục hồi từ checkpoint.
4. Nghiệm thu 11 trang Admin trên mobile/tablet/desktop **trong phiên đăng nhập thật**: tính đúng dữ liệu, loading/error/empty, quyền không cho Student truy cập, điều khiển bàn phím, khả năng mất mạng, và khả năng khôi phục. CI Chromium hiện chỉ chạy trong Demo; QA đã đăng nhập Production chưa hoàn thành.
5. Chỉ bắt đầu Teacher Studio sau khi các mục kiểm thử trên đạt và chức năng sao lưu/khôi phục được xác nhận. Giai đoạn đầu: quản lý lớp, môn/năm học, nhập danh sách học sinh, lời mời và RLS sở hữu lớp; thiết kế schema/UX trên branch trước khi áp DB.

## Phạm vi phát hành
Chỉ triển khai code thay đổi đồng bộ và test. Ghi rõ status CI, commit và Vercel Production theo thực tế sau khi nghiệm thu; không ghi “đã kiểm thử JWT thật” khi chưa chạy.
