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

> **STAGING ĐÃ TẠO — JWT/CRUD THẬT CHƯA NGHIỆM THU.** Project staging `ordiksbvpewwgrnvzrud` tách Production; mọi thao tác và migration dưới đây chỉ áp vào staging. Chưa có tài khoản Auth QA; không có dữ liệu cá nhân thật.

### Trạng thái staging đã cấp (30/10/2026)

- Supabase Production ref: `bpxwpfmjoojrgqlfkqgz` — không dùng làm staging hoặc chạy `--write`.
- Tổ chức đang kết nối: `huunghia160699's Org` (ID `dgqktlsjiuaeyhkbcdtx`), tại thời điểm kiểm tra thuộc gói Free.
- Supabase báo phí **branch $0,01344 mỗi giờ**, tương đương khoảng $9,68/30 ngày chạy liên tục (30 × 24 giờ), và **project mới $0/tháng** theo báo giá tài khoản hiện tại. Cả hai giá phụ thuộc hạn mức/gói, cần kiểm tra lại khi tạo.
- **Đã tạo mới** `Xuong-Cong-Nghe Staging QA` tại [Supabase Dashboard](https://supabase.com/dashboard/project/ordiksbvpewwgrnvzrud), ref `ordiksbvpewwgrnvzrud`, vùng `ap-southeast-1`, trạng thái `ACTIVE_HEALTHY`. Chủ dự án đã xác nhận org và báo giá **$0/tháng**. Hai project cũ được giữ nguyên.
- **7 migration gốc đã áp** theo thứ tự: `initial_schema`, `secure_quiz_grants`, `auth_and_secure_quiz_rpc`, `harden_internal_trigger_grants`, `private_document_storage`, `admin_roadmap`, `admin_roadmap_change_events`. Lưu ý migration harden được điều chỉnh **chỉ trên staging**: bỏ một lệnh REVOKE đối với `public.rls_auto_enable()` vì hàm tùy chọn này không tồn tại trên project mới; KHÔNG sửa file migration gốc đã áp trên Production.
- **Dữ liệu seed giả lập:** 3 courses, 9 lessons, 1 quiz, 6 questions, 24 options. Không sao chép `auth.users` hoặc dữ liệu Production; `auth.users` staging = 0, `admin_roadmap` = 0.
- **8th staging-only hardening migration:** `deny_public_truncate_staging_qa` thu hồi quyền `TRUNCATE` với role `anon`/`authenticated` trên bảng public. Kiểm tra sau: **14/14 bảng RLS ON, 0/14 bảng còn cấp TRUNCATE hai role**. Production chưa thay đổi và chưa tự áp migration này lên Production.
- **SQL hardening staging-only đã áp (không tự chạy trên Production):**
  ```sql
  revoke truncate on all tables in schema public from public, anon, authenticated;
  ```
  **Trước khi áp Production:** tạo migration chính thức theo quy trình, kiểm thử hai JWT Auth và các thao tác đăng nhập, hồ sơ, quiz/tiến độ, chỉ sau đó mới xét release riêng. Test preflight:
  ```sql
  select count(*) filter (where c.relrowsecurity) as rls_on,
         count(*) filter (where has_table_privilege('anon',c.oid,'TRUNCATE')
                        or has_table_privilege('authenticated',c.oid,'TRUNCATE'))
                as unsafe_truncate
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind='r';
  ```
- **Security linter:** `public.is_admin()` vẫn là SECURITY DEFINER có cảnh báo EXECUTE với `anon` và `authenticated`; `submit_quiz`/`get_quiz_result` cũng được cảnh báo. Chưa thay đổi RPC khi chưa kiểm JWT end-to-end.
- **Đã xác nhận giá $0 và tạo đúng project được chọn.** Không thay đổi, tạm dừng hoặc xóa hai project cũ. Nếu cần đổi gói/branch có phí, phải lấy chấp thuận mới.

### Những bước còn lại để nghiệm thu trên staging

1. Xác minh ref staging **khác Production**, môi trường Active/Healthy. Kiểm tra migrations trên staging với `list_migrations` và schema/RLS; chỉ thêm migration bị thiếu trên staging sau khi đối chiếu lịch sử (không chạy lại cả SQL nếu khác version runtime).
2. **CHƯA THỰC HIỆN — tạo hai tài khoản QA Auth:** Trên [Authentication → Users của staging](https://supabase.com/dashboard/project/ordiksbvpewwgrnvzrud/auth/users), dùng **Add user → Create new user** bằng hai địa chỉ kiểm thử do chủ dự án kiểm soát. Có thể xác minh qua email thật hoặc dùng chức năng xác nhận của Dashboard **chỉ trong staging**; ghi rõ nếu do quản trị tự xác nhận thay vì xác minh hộp thư. Không tạo trực tiếp hàng trong `auth.users` bằng SQL. Trigger mới tạo `profiles.role=student` cho cả hai; sau đó trên **SQL Editor staging** mới nâng riêng tài khoản QA Admin thành `admin` (dùng UUID của đúng Auth user trên staging), Student giữ `student`. Không dùng tài khoản Production; không gửi mật khẩu, JWT, secret keys qua Chat/GitHub. Công cụ kết nối hiện tại không hỗ trợ Auth Admin API tạo user nên bước này cần thao tác trên Dashboard.
3. Lưu biến kiểm thử **chỉ trong máy local/runner được kiểm soát**, không commit `.env`, token, key secret, JWT, password hay file backup. Chỉ dùng **publishable/anon key**, không dùng `service_role`:
   ```bash
   export RLS_SUPABASE_URL="https://ordiksbvpewwgrnvzrud.supabase.co"
   export RLS_SUPABASE_PUBLISHABLE_KEY="<publishable-staging-key>"
   export RLS_TEST_PROJECT_REF="ordiksbvpewwgrnvzrud"
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
| Tách môi trường | Ref staging khác Production, chi phí được phê duyệt, migrations đối chiếu | **ĐÃ ĐẠT**: project ref mới, 7 migration gốc, 1 hardening staging-only, 14/14 RLS |
| JWT thật | Hai user khác nhau, email xác minh, role chính xác, 403/401 đúng | **BLOCKED**: 0 Auth users, cần 2 user QA trên staging |
| RLS dữ liệu | Anon/Student không đọc/ghi roadmap, Admin đọc/ghi, mạo danh bị chặn | GRANT/RLS metadata đạt; **JWT thật chưa chạy** |
| CRUD/Roadmap | Thêm/sửa/xóa/khôi phục nội dung, GET readback, stale 409, sự kiện version | MỚI CÓ SCRIPT, CHƯA CHẠY STAGING |
| Backup | Lưu bản trước test, restore không ghi đè thay đổi khác phiên | MỚI CÓ SCRIPT, CHƯA CHẠY STAGING |
| Next.js Preview E2E | 11 route Admin + Student, tải lại, UI lỗi/empty, responsive, mất mạng | CHƯA CHẠY |
| Teacher Studio | Chỉ bắt đầu sau khi các mục P0 được nghiệm thu | CHƯA BẮT ĐẦU |

**Quan trọng:** `verify-roadmap-staging.mjs` đã được **khóa cứng ref `ordiksbvpewwgrnvzrud`**, từ chối mọi project khác trước thao tác ghi. Bộ kiểm thử này kiểm đường Data API/Supabase JWT thật sau khi có tài khoản QA; nó **không thay thế** kiểm thử browser Next.js Preview, backup download route riêng hay xác nhận email thật.
