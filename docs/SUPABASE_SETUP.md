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


## Lịch sử 13/10/2026 và yêu cầu hiện hành

- Các migration trước đây đã áp qua Supabase Management API với version runtime khác tên file; **không chạy lại** toàn bộ migration bằng CLI nếu chưa reconcile lịch sử.
- Snapshot 13/10/2026 đã được giữ nguyên trong [archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md](archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md).
- **Cập nhật kiểm toán 30/10/2026:** Supabase Production đã chạy Live, có 14 bảng public bật RLS; Auth Admin/Student có dữ liệu thực, nhưng chưa có Supabase staging branch để kiểm JWT và CRUD được cách ly.
- Đừng suy ra trạng thái mới chỉ từ các hướng dẫn dated cũ. Đọc [ARCHITECTURE_AND_SECURITY.md](ARCHITECTURE_AND_SECURITY.md) và [SYSTEM_AUDIT_2026-10-30.md](SYSTEM_AUDIT_2026-10-30.md) trước khi thay đổi DB.

## Quy trình staging RLS & Roadmap (bổ sung 30/10/2026)

> **Chưa tạo môi trường, chưa chạy JWT thật.** Nội dung dưới đây là hướng dẫn và tiêu chí nghiệm thu, không phải xác nhận quyền đã đạt. Chỉ chạy trên project/branch **tách biệt hoàn toàn** Production và không có dữ liệu cá nhân thật.

### Chốt trước khi cấp staging

- Supabase Production ref: `bpxwpfmjoojrgqlfkqgz` — không dùng làm staging hoặc chạy `--write`.
- Tổ chức đang kết nối: `huunghia160699's Org` (ID `dgqktlsjiuaeyhkbcdtx`), tại thời điểm kiểm tra thuộc gói Free.
- Supabase báo phí **branch $0,01344 mỗi giờ**, tương đương khoảng $9,81/30 ngày chạy liên tục (30 × 24 giờ), và **project mới $0/tháng** theo báo giá tài khoản hiện tại. Cả hai giá phụ thuộc hạn mức/gói, cần kiểm tra lại khi tạo.
- Tổ chức đã có 2 project (1 Production Xưởng Công Nghệ, 1 project của ứng dụng khác). Không tự dừng/xóa hoặc chuyển đổi project khác để mở chỗ.
- **Phải có lựa chọn tổ chức của chủ dự án và xác nhận chi phí nếu phát sinh** trước khi khởi tạo resource. Không tạo nhánh có phí bằng việc suy đoán đồng ý.

### Sau khi staging được cấp

1. Xác minh ref staging **khác Production**, môi trường Active/Healthy. Kiểm tra migrations trên staging với `list_migrations` và schema/RLS; chỉ thêm migration bị thiếu trên staging sau khi đối chiếu lịch sử (không chạy lại cả SQL nếu khác version runtime).
2. **Không clone dữ liệu Auth/Student thật** từ Production. Tạo hai tài khoản kiểm thử giả khác nhau trong Auth (ví dụ `qa-admin@...`, `qa-student@...`) và xác minh email bằng quy trình kiểm thử riêng. Chỉ cấp `profiles.role=admin` cho user QA Admin qua Supabase Dashboard/SQL Editor **đúng project staging**; user QA Student giữ role student. Không cho phép tự chọn role phía trình duyệt.
3. Lưu biến kiểm thử **chỉ trong máy local/runner được kiểm soát**, không commit `.env`, token, key secret, JWT, password hay file backup. Chỉ dùng **publishable/anon key**, không dùng `service_role`:
   ```bash
   export RLS_SUPABASE_URL="https://<staging-ref>.supabase.co"
   export RLS_SUPABASE_PUBLISHABLE_KEY="<publishable-staging-key>"
   export RLS_TEST_PROJECT_REF="<staging-ref>"
   export RLS_ADMIN_EMAIL="<qa-admin-email>"
   export RLS_ADMIN_PASSWORD="<qa-admin-password>"
   export RLS_STUDENT_EMAIL="<qa-student-email>"
   export RLS_STUDENT_PASSWORD="<qa-student-password>"
   ```
   Dùng `read -rs` hoặc secret manager khi được hỗ trợ; không đặt mật khẩu thực vào lịch sử lệnh của shell.
4. Chạy **đọc-only**:
   ```bash
   node scripts/verify-roadmap-rls.mjs
   ```
   Cần PASS: Admin/Student JWT + `email_confirmed_at` đúng, `profiles.role` đúng, anon không SELECT roadmap, Student SELECT 0 hàng, Admin SELECT hợp lệ.
5. Đảm bảo **staging chưa có Roadmap** trước khi thử ghi. Bộ test sẽ không ghi đè bản hiện có. Bật 3 cờ cô lập một cách chủ động:
   ```bash
   export RLS_TEST_ISOLATED=YES
   export RLS_WRITE_ACK=I_UNDERSTAND
   export RLS_STAGING_PURPOSE=ACCEPTANCE_ONLY
   node scripts/verify-roadmap-staging.mjs
   ```
   Script thực hiện đọc/ghi dưới JWT thật, Admin thêm/sửa/xóa epic và checklist, kiểm optimistic lock, Student bị chặn ghi/đọc, backup JSON cục bộ trong thư mục tạm với quyền `0600`, khôi phục từ checkpoint, xác minh audit version và so sánh readback.
6. Sau test thành công, **nội dung Roadmap trở về `[]`**, nhưng singleton được giữ lại với version tăng và các events không bị xóa (phục vụ truy vết). Nếu test lỗi, script chỉ tự restore khi version vẫn khớp; nó sẽ in đường dẫn backup. **Không tự reset nhánh hoặc chạy lại trên DB đã có Roadmap**. Kiểm tra thủ công.
7. Nghiệm thu ứng dụng **Next.js staging/Preview riêng** (không phải Production) với `NEXT_PUBLIC_USE_MOCK_DATA=false`, `NEXT_PUBLIC_SUPABASE_URL`/anon key của staging và `NEXT_PUBLIC_APP_URL` là URL preview. Thêm callback vào Auth Redirect URLs của staging. Đăng nhập hai user để thử `/admin`, `/student`, `/api/admin/roadmap` GET/PUT, `/api/admin/roadmap/backup`, lỗi 401/403/409, refresh và mất kết nối. **Bước này chưa có bằng chứng hoàn thành**.

### Bài nghiệm thu tối thiểu trước Teacher Studio

| Test | Điều kiện đạt | Hiện trạng 30/10 |
| --- | --- | --- |
| Tách môi trường | Ref staging khác Production, chi phí được phê duyệt, migrations đối chiếu | CHƯA CÓ STAGING |
| JWT thật | Hai user khác nhau, email xác minh, role chính xác, 403/401 đúng | CHƯA CHẠY |
| RLS dữ liệu | Anon/Student không đọc/ghi roadmap, Admin đọc/ghi, mạo danh bị chặn | CHƯA CHẠY LIVE |
| CRUD/Roadmap | Thêm/sửa/xóa/khôi phục nội dung, GET readback, stale 409, sự kiện version | MỚI CÓ SCRIPT, CHƯA CHẠY STAGING |
| Backup | Lưu bản trước test, restore không ghi đè thay đổi khác phiên | MỚI CÓ SCRIPT, CHƯA CHẠY STAGING |
| Next.js Preview E2E | 11 route Admin + Student, tải lại, UI lỗi/empty, responsive, mất mạng | CHƯA CHẠY |
| Teacher Studio | Chỉ bắt đầu sau khi các mục P0 được nghiệm thu | CHƯA BẮT ĐẦU |

**Quan trọng:** bài thử `verify-roadmap-staging.mjs` kiểm đường Data API/Supabase JWT thật; nó **không thay thế** kiểm thử browser với Next.js Preview và backup download route riêng.
