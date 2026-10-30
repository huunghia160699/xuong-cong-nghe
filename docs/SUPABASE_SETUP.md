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

### Kết quả nghiệm thu đã chốt — 31/10/2026

**Trạng thái hiện tại: `STAGING ACCEPTANCE PASS` đối với JWT Admin/Student và Roadmap.** Chủ dự án đã chạy hai script từ máy local với bí mật không đưa lên Git/chat; `READ-ONLY PASS` và `STAGING ACCEPTANCE PASS`. Admin được đọc/ghi Roadmap, Student bị RLS chặn, version conflict, backup/restore và audit trail PASS.

**Đối chiếu độc lập bằng SQL read-only:** tại ref `ordiksbvpewwgrnvzrud`, `global-master-roadmap.version=8`, `jsonb_array_length(items)=0`, và 8 sự kiện đúng chuỗi phiên bản `1,2,3,4,5,6,7,8`. Version 8 là thao tác dọn dữ liệu thử cuối cùng. Không có bằng chứng từ test này cho RLS của bảng lớp/giáo viên chưa được xây.

**KHÔNG chạy lại `verify-roadmap-staging.mjs` trên project này:** hiện đã có singleton version 8 nên script từ chối kiểm thử ghi khởi tạo từ rỗng; không xóa singleton/audit events chỉ để test lại. Nếu cần nghiệm thu mới, lập kịch bản non-destructive/fixture riêng trên staging với checkpoint trước.

**Quyết định cổng:** `P0_STAGING_AUTH_ROADMAP=PASS`; cho phép **thiết kế + phát triển Teacher Studio trên staging qua PR riêng**. Chưa cấp phép deploy chức năng Teacher ra Production. Còn thiếu Next.js Preview/E2E 11 trang Admin và đánh giá quyền `teacher`, bảng lớp/assignment, RLS ownership, Security Advisor trước khi phát hành.

> Các hướng dẫn chạy lần đầu bên dưới được giữ làm **runbook lịch sử cho môi trường staging mới, trống**; không hiểu câu “Roadmap phải chưa có” như trạng thái hiện tại của project ref trên.

> **Lưu ý lịch sử 30/10/2026:** thời điểm viết phần hướng dẫn bên dưới, tài khoản QA mới được xác minh qua SQL và JWT chưa chạy. **Trạng thái 31/10/2026 là PASS**, được ghi ở mục trên. Không đưa mật khẩu/JWT hay API secret vào chat/Git.

### Trạng thái staging đã cấp (30/10/2026)

- Supabase Production ref: `bpxwpfmjoojrgqlfkqgz` — không dùng làm staging hoặc chạy `--write`.
- Tổ chức đang kết nối: `huunghia160699's Org` (ID `dgqktlsjiuaeyhkbcdtx`), tại thời điểm kiểm tra thuộc gói Free.
- Supabase báo phí **branch $0,01344 mỗi giờ**, tương đương khoảng $9,68/30 ngày chạy liên tục (30 × 24 giờ), và **project mới $0/tháng** theo báo giá tài khoản hiện tại. Cả hai giá phụ thuộc hạn mức/gói, cần kiểm tra lại khi tạo.
- **Đã tạo mới** `Xuong-Cong-Nghe Staging QA` tại [Supabase Dashboard](https://supabase.com/dashboard/project/ordiksbvpewwgrnvzrud), ref `ordiksbvpewwgrnvzrud`, vùng `ap-southeast-1`, trạng thái `ACTIVE_HEALTHY`. Chủ dự án đã xác nhận org và báo giá **$0/tháng**. Hai project cũ được giữ nguyên.
- **7 migration gốc đã áp** theo thứ tự: `initial_schema`, `secure_quiz_grants`, `auth_and_secure_quiz_rpc`, `harden_internal_trigger_grants`, `private_document_storage`, `admin_roadmap`, `admin_roadmap_change_events`. Lưu ý migration harden được điều chỉnh **chỉ trên staging**: bỏ một lệnh REVOKE đối với `public.rls_auto_enable()` vì hàm tùy chọn này không tồn tại trên project mới; KHÔNG sửa file migration gốc đã áp trên Production.
- **Dữ liệu seed giả lập thời điểm khởi tạo:** 3 courses, 9 lessons, 1 quiz, 6 questions, 24 options. Không sao chép dữ liệu Production. *Lịch sử 30/10*: Auth và Roadmap ban đầu đều rỗng; **hiện có hai QA users và Roadmap singleton version 8, items=[]**.
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

### Quy trình đã thực hiện (giữ lại để truy vết, không chạy lại trên singleton v8)

1. Xác minh ref staging **khác Production**, môi trường Active/Healthy. Kiểm tra migrations trên staging với `list_migrations` và schema/RLS; chỉ thêm migration bị thiếu trên staging sau khi đối chiếu lịch sử (không chạy lại cả SQL nếu khác version runtime).
2. **ĐÃ ĐẠT — tài khoản QA:** Trên staging có hai Auth user riêng biệt, đã xác nhận email, không bị khóa, có password hash và `profiles.role` lần lượt là `admin` / `student`; email/UUID khớp với thông tin chủ dự án cung cấp. Kiểm tra này thực hiện bằng SQL **read-only**, không phải đăng nhập bằng JWT thật. Chỉ staging có các tài khoản này, không cần tạo hoặc đổi quyền lần nữa. Không đưa email/UUID/mật khẩu vào báo cáo Git công khai.
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

### Chạy JWT thật bằng mật khẩu lưu riêng trên máy tính

**Không gửi mật khẩu/JWT/token cho ChatGPT hoặc GitHub.** Các phép thử JWT chỉ có thể thực hiện từ máy đã lưu mật khẩu staging. Bộ công cụ hiện kết nối với database ở quyền quản trị, không có quyền truy cập file bí mật trên máy bạn và không thể xác nhận JWT thay bạn.

1. Cập nhật mã nguồn `main` và cài dependencies nếu chưa có. Tại thư mục root dự án, tạo file bí mật **không theo dõi bởi Git**:
   ```bash
   git pull --ff-only
   cp .env.staging.qa.example .env.staging.qa.local
   git check-ignore .env.staging.qa.local
   ```
   Trên **PowerShell**, thay `cp` bằng `Copy-Item` và lệnh `git check-ignore` giữ nguyên. Lệnh cuối phải in `.env.staging.qa.local`; nếu không, **dừng và không điền mật khẩu**.

2. Mở riêng `.env.staging.qa.local` tại máy, điền **publishable/anon key của staging** trong Supabase Dashboard → Project Settings → API Keys và thông tin hai QA account đã tạo. Không dùng service-role/secret key. Không dùng URL/key Production. Trường password có ký tự `#`/khoảng trắng nên đặt trong dấu nháy kép theo cú pháp env file.

3. Chạy phép thử **read-only trước** (Node.js 22+):
   ```bash
   node --env-file=.env.staging.qa.local scripts/verify-roadmap-rls.mjs
   ```
   Chỉ coi là PASS khi script xác minh JWT thực qua `auth.getUser()`, hai vai trò `profiles.role` khớp, anon bị từ chối SELECT, Admin đọc được và Student không đọc được Roadmap. Nếu lỗi đăng nhập, xác nhận password/key/URL **trên máy**, không gửi nội dung file cho bất kỳ ai.

4. Chỉ khi bước 3 PASS **và Roadmap staging vẫn chưa có bản ghi**, bật các dòng `RLS_TEST_ISOLATED=YES`, `RLS_WRITE_ACK=I_UNDERSTAND`, `RLS_STAGING_PURPOSE=ACCEPTANCE_ONLY` trong file local và chạy:
   ```bash
   node --env-file=.env.staging.qa.local scripts/verify-roadmap-staging.mjs
   ```
   Kịch bản này **CÓ GHI** vào staging: thêm/sửa/xóa/khôi phục Roadmap, thử Student bị chặn, conflict version, lưu bản backup cục bộ quyền `0600`, tạo audit events, sau đó đưa nội dung Roadmap về mảng rỗng; **không xóa singleton hoặc lịch sử**. Script dừng nếu URL/ref không đúng staging hoặc đã có Roadmap.

5. Chỉ chia sẻ **kết quả đã lọc thông tin nhạy cảm**, chẳng hạn `READ-ONLY PASS`, `STAGING ACCEPTANCE PASS`, tên bước lỗi hoặc mã lỗi (không copy password/token/env, request header, full logs hoặc đường dẫn file cá nhân). Nếu bài ghi thất bại, **không chạy lại mù**; đọc backup và các phiên bản Roadmap trước, ghi blocker vào [WORKLOG_AND_RULES.md](WORKLOG_AND_RULES.md).

Với **PowerShell**, chạy cùng lệnh `node --env-file=...` trong terminal của dự án; không dùng lệnh `setx` hay đưa mật khẩu vào command line. Nếu `node --env-file` không hỗ trợ, kiểm tra `node --version` và nâng Node trước khi kiểm thử. 

### Bài nghiệm thu tối thiểu trước Teacher Studio

| Test | Điều kiện đạt | Trạng thái 31/10/2026 |
| --- | --- | --- |
| Tách môi trường | Ref staging khác Production, chi phí được phê duyệt, migrations đối chiếu | **ĐÃ ĐẠT**: project ref mới, 7 migration gốc, 1 hardening staging-only, 14/14 RLS |
| JWT thật | Hai user khác nhau, email xác minh, role chính xác, Roadmap chặn đúng | **PASS (người dùng chạy local)**: hai JWT thật được xác minh; Admin truy cập được, Student bị chặn. Chưa kiểm nghiệm mọi route 401/403. |
| RLS dữ liệu | Anon/Student không đọc/ghi Roadmap, Admin đọc/ghi, mạo danh bị chặn | **PASS (người dùng chạy local)** đối với Roadmap, không bao gồm Teacher Studio/RPC khác. |
| CRUD/Roadmap | Thêm/sửa/xóa/khôi phục nội dung, GET readback, stale conflict, audit version | **PASS**: script local hoàn tất; SQL độc lập xác nhận tài liệu version 8, items rỗng và 8 audit events liên tục. |
| Backup | Lưu bản trước test, restore không ghi đè thay đổi khác phiên | **PASS theo kết quả local của người dùng**. File backup giữ tại máy, không đưa lên Git. |
| Next.js Preview E2E | 11 route Admin + Student, tải lại, UI lỗi/empty, responsive, mất mạng | CHƯA CHẠY |
| Teacher Studio | Gate JWT/Roadmap đạt trước khi thiết kế; release phải có RLS riêng của Teacher/lớp | **MỞ THIẾT KẾ / STAGING DEVELOPMENT; CHƯA BẬT PRODUCTION**. |

**Quan trọng:** script đã chạy thành công và **không được chạy lại trên singleton v8**. `verify-roadmap-staging.mjs` đã được **khóa cứng ref `ordiksbvpewwgrnvzrud`**, từ chối mọi project khác trước thao tác ghi. Bộ kiểm thử này kiểm đường Data API/Supabase JWT thật sau khi có tài khoản QA; nó **không thay thế** kiểm thử browser Next.js Preview, backup download route riêng hay xác nhận email thật.
