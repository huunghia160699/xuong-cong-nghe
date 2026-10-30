# Báo cáo lịch sử: bảo mật và đồng bộ giai đoạn 00

> Giữ nguyên nội dung 6 báo cáo theo thời điểm lập. **Không dùng các câu “chưa áp migration”, “Demo” hoặc “chưa có tài khoản” ở đây để suy ra trạng thái hiện tại.** Trạng thái kiểm toán mới nhất: [SYSTEM_AUDIT_2026-10-30.md](../SYSTEM_AUDIT_2026-10-30.md).

## Nguyên bản: docs/ADMIN_PHASE_00_RECONCILIATION_QA_OPERATIONS_20261027.md

---

# Giai đoạn 00 — Kiểm kê Admin, dữ liệu Roadmap, môi trường và nghiệm thu

**Kiểm tra:** 27/10/2026 · Repository `huunghia160699/xuong-cong-nghe` · Production `xuong-cong-nghe.vercel.app`.

## 1. Roadmap: nguồn dữ liệu và phát hiện sai lệch

**Ưu tiên nguồn:** Supabase production (khi Admin đăng nhập Live) → bản nháp thiết bị (chỉ để đối chiếu/khôi phục) → checklist `docs/XCN_FUNCTION_ROADMAP_CHECKLIST.md` và dữ liệu gốc `roadmap-data.ts` (mẫu tham chiếu). Không ghi đè Supabase bằng seed.

Kết quả truy vấn production trước đợt sửa (read-only):
- Roadmap `global-master-roadmap`: **1 bản, version 4, 20 việc lớn**, lịch sử **4 lần lưu**.
- Mốc `admin-center`: **12/13** việc được tích, 8 ghi chú. GitHub và dữ liệu mẫu chỉ tích **10/13**.
- Ở thời điểm khảo sát, hai dấu tích khác nhau: (11) lưu/sao lưu và (12) xác minh Admin/RLS/đa tài khoản. **Sau kiểm tra:** đánh dấu nguồn GitHub/seed mục (11) vì đã có lưu v4 và sao lưu được kiểm thử; còn **mục (12) chưa nghiệm thu** và vẫn khác với bản Supabase.
- Tài khoản Admin đã xác minh và có role Admin; tài khoản Student **chưa xác minh** nên **không thể coi mục JWT kiểm thử đa tài khoản là hoàn thành**.
- Trong `system-architecture` hiện còn **0/6**, `design-system` **0/5**. Chưa thay trạng thái chỉ nhờ đọc mã nguồn.
- Không mất lịch sử: 4 bản thay đổi nằm trong `admin_roadmap_events`; 20 mốc và ghi chú giữ nguyên.

**Cơ chế mới:** `roadmap-reconcile.ts` so sánh ID của mốc/checklist/ghi chú, tách khác biệt trạng thái, thiếu nội dung và nội dung bổ sung; `RoadmapReconcilePanel` hiển thị báo cáo để người quản trị đối chiếu từ nguồn GitHub/draft/server. **Gộp an toàn** chỉ đưa vào mốc/checklist/ghi chú có ID chưa tồn tại; không thay trạng thái Done, text, thứ tự hay nhật ký của mục đã có. Trước khi gộp tạo checkpoint; cập nhật phải đi qua API version-CAS/RLS. Không tự đặt các đầu việc "đã nghiệm thu".

**Quy tắc hoàn tất việc #12:** phải có bằng chứng kiểm thử JWT Admin và Student đã xác minh, quyền bị chặn với Student và dữ liệu chỉ Admin thấy. Có mã nguồn migration và test mock không thay cho nghiệm thu.

## 2. Kiểm kê route/module (có giao diện không đồng nghĩa hoàn thiện)

| Nhóm | Đường dẫn tiêu biểu | Kiểm kê mã nguồn | Điều kiện DONE |
| --- | --- | --- | --- |
| Trung tâm Admin | `/admin` | Có dashboard và điều hướng | kiểm thử số liệu thật khi Live, responsive |
| Roadmap | `/admin/roadmap` | Có CRUD, CAS, backup, event DB và reconcile | Admin/Student JWT và kiểm thử thiết bị |
| Sitemap | `/admin/sitemap` | Có phân biệt route có thật/dự kiến | chạy smoke với liên kết |
| Người dùng | `/admin/nguoi-dung` | Live read-only profiles; tìm/lọc/CSV | tài khoản Admin thật + quyền tối thiểu |
| Phân quyền | `/admin/phan-quyen` | Bảng tham chiếu, không tự cấp vai trò | JWT RLS các vai trò |
| Cấu hình | `/admin/cau-hinh` | Bản nháp local, xem trước, JSON | không nhầm bản nháp với site settings thật |
| Nhật ký | `/admin/nhat-ky` | Chỉ log trình duyệt, có export | cần audit server cho hành động bảo mật |
| Giám sát/Báo cáo | `/admin/he-thong`, `/admin/bao-cao` | Có status/module + đếm từ DB khi Live | kiểm tra dữ liệu, lỗi và không bịa số |
| Nội dung | `/admin/khoa-hoc`, `/admin/kho-tai-lieu` | Đã có route | thử CRUD/Storage và quyền |
| Công khai | `/`, `/dang-nhap`, `/student` | Có route | auth + responsive + quyền |
| Tin học | `/cong-cu/mo-phong-word`, `/cong-cu/trinh-chieu` | Công cụ sẵn có | QA độc lập, không tự sửa hồi quy |
| Teacher, Live Quiz, Python/SQL | /giao-vien/*, /thuc-hanh/* | Phần lớn còn planned | cần phụ thuộc Auth + dữ liệu |

Nguồn route: `src/features/admin/admin-sitemap.ts`. Kiểm kê này dựa trên mã nguồn, không giả định tất cả đã được thử trên browser production.

## 3. Quy trình Dev → Preview → Production

| Môi trường | Chế độ kiểm tra ngày 27/10/2026 | Quy tắc |
| --- | --- | --- |
| Development | `NEXT_PUBLIC_USE_MOCK_DATA=true` | Không dùng tài khoản/DB production làm dữ liệu test; dữ liệu thử |
| Preview | `NEXT_PUBLIC_USE_MOCK_DATA=true` | CI + bản build + test responsive 360/768/1280 |
| Production | `NEXT_PUBLIC_USE_MOCK_DATA=false` | JWT qua Supabase; Admin Layout kiểm tra role, API và RLS kiểm tra độc lập |

Production đã có biến Supabase URL và anon/public key trên Vercel; không hiển thị giá trị các khóa trong báo cáo hoặc CI. Đổi `NEXT_PUBLIC_*` phải build lại để bundle nhận giá trị mới.

**Release gate:** unit test, typecheck, build, smoke test, visual QA và screenshot 3 viewport. Kế tiếp mới thử JWT thật, phân quyền Admin/Student và quy trình recovery. Không công bố kiểm thử trực quan thành công nếu browser/CI chưa đạt.

## 4. Sao lưu, khôi phục và nhật ký

- **Sao lưu trình duyệt:** `xcn-admin-roadmap-history-v1`, tối đa 6 snapshot, 1,6MB; export JSON. Chỉ dùng khi phục hồi thay đổi tại một trình duyệt, **không** thay bản DB.
- **Roadmap trên Supabase:** `admin_roadmap` chỉ có một row `global-master-roadmap`, version CAS; lịch sử thay đổi tại `admin_roadmap_events` ghi bằng trigger theo transaction. Sự kiện audit không phải bản snapshot toàn nội dung, không thể một mình phục hồi mọi phiên bản.
- **Trước thao tác nguy hiểm:** tải bản chính từ Supabase, sao lưu JSON, tạo checkpoint, đối chiếu diff, xác nhận, ghi qua API với version hiện tại. Nếu 409 phải tải mới và gộp cẩn thận, không tự ép ghi đè.
- **Trước migration DB:** xác minh tên file trùng version Supabase, đánh giá RLS/GRANT/trigger, kiểm tra cách rollback và backup quản trị Supabase. Không dùng `DROP TABLE` hoặc `DELETE` trên production để test.
- **Thử khôi phục:** ở môi trường test cách ly, nhập JSON backup và đối chiếu count/IDs/checkmarks/ghi chú; thử xung đột hai cửa sổ và mất mạng. Trên production chỉ thực hiện sau khi có backup có thể xác minh.
- **Giám sát:** `/admin/he-thong` và Supabase/Vercel logs; audit trình duyệt **không** phải audit bảo mật bất biến.

## 5. Cổng bảo mật và tài khoản

- Admin thử nghiệm: email đã xác minh, role `admin` và từng đăng nhập.
- Student thử nghiệm: profile `student`, **email chưa xác minh**. Không tạo thêm user, không mời lại và không tự xác minh hộ.
- Vẫn thiếu: test JWT thật của cả hai vai trò với đúng tài khoản, bao gồm truy cập `/admin`, SELECT Roadmap dưới Student (phải bị RLS chặn), thử ghi và xác minh event khi Admin lưu.
- `public.is_admin()` (SECURITY DEFINER, callable từ anon trước đây) là cảnh báo độc lập đã được audit; không thu hồi EXECUTE khi 17 policy khác phụ thuộc, cần sửa theo migration/test riêng.

**Kết luận:** mốc Admin chưa hoàn thành 100%. Tính năng có thật khác với đã nghiệm thu: không tự sửa dấu Done trên DB khi thiếu bằng chứng; UI reconciliation giúp chủ sở hữu kiểm tra và quyết định, giữ nguyên bản gốc và nhật ký.



## Nguyên bản: docs/ADMIN_ROADMAP_MIGRATION_SECURITY_REVIEW.md

---

# Đánh giá migration bảo mật: Admin Roadmap

**Ngày kiểm tra:** 2026-10-27  
**Trạng thái:** ĐÃ RÀ SOÁT FILE, **CHƯA ÁP MIGRATION LÊN PRODUCTION**  
**File:** `supabase/migrations/20261026163500_admin_roadmap.sql`  
**Database:** `bpxwpfmjoojrgqlfkqgz` (ap-southeast-1), PostgreSQL 17  
**Mục tiêu:** xác nhận mô hình một Roadmap trung tâm, chỉ Admin được đọc và ghi qua Supabase Auth.

## 1. Kết quả kiểm tra read-only trực tiếp trên production

| Kiểm tra | Kết quả |
| --- | --- |
| Kết nối SQL | Thành công |
| Dự án | `ACTIVE_HEALTHY` |
| `public.profiles` | Tồn tại, RLS bật |
| Giá trị `public.user_role` | `student`, `teacher`, `admin` |
| `authenticated` có SELECT trên profiles | Có |
| `authenticated` có UPDATE trên profiles.role | Không |
| `anon` có UPDATE trên profiles.role | Không |
| `authenticated` có CREATE trên schema public | Không |
| `public.is_admin()` — quyền EXECUTE | `PUBLIC=true`, `anon=true`, `authenticated=true` |
| `public.is_admin()` — hành vi khi không có JWT | `auth.uid()` là `NULL`, hàm trả `false` |
| RLS policy đang gọi `is_admin()` | **17 policy trên 11 bảng**; cần bảo vệ tương thích |
| Chính sách profiles SELECT | `id = auth.uid() OR is_admin()` |
| Chính sách profiles UPDATE | `id = auth.uid()` (nhưng role hiện không được GRANT UPDATE) |
| `public.admin_roadmap` | Chưa tồn tại |
| `auth.users` / `profiles` | Đều 0, chưa thể thử Admin JWT thực tế |
| Vercel env | Chưa có `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

**Kết luận:** nguyên lý phân quyền bằng `profiles.role = admin` có thể áp dụng dựa trên trạng thái grant/RLS đã xác minh, nhưng mọi thử nghiệm có tài khoản thật chỉ thực hiện **sau khi có migration và Auth**. Không tự tạo Admin thông qua form công khai.

## 2. Kết quả kiểm toán migration

### Schema
- [x] Dữ liệu một Roadmap duy nhất, `id = 'global-master-roadmap'`, khớp với key trong API.
- [x] `items` là `jsonb NOT NULL`, chỉ chấp nhận mảng.
- [x] `version` là số nguyên dương; API dùng optimistic concurrency để báo `409` khi có bản ghi bị cập nhật ở phiên khác.
- [x] `updated_by` tham chiếu `auth.users.id`, `updated_at` có mặc định.
- [x] Giới hạn payload theo kích thước DB; API còn giới hạn dữ liệu đầu vào 500 KB.
- [x] Sử dụng `CREATE TABLE` có điều kiện thất bại khi bảng đã tồn tại, tránh âm thầm bỏ qua schema không đúng.

### Quyền database và RLS
- [x] Bật RLS ngay trong migration, không mở bảng public trước.
- [x] REVOKE quyền mặc định từ `PUBLIC`, `anon`, `authenticated`.
- [x] Chỉ GRANT `SELECT, INSERT, UPDATE` cho `authenticated`; không GRANT `DELETE`.
- [x] Ba policy tương ứng SELECT, INSERT, UPDATE; chỉ áp dụng với `TO authenticated` **và** `profiles.role = 'admin'`.
- [x] INSERT và UPDATE yêu cầu `updated_by = auth.uid()`, tránh mạo danh người ghi bằng API.
- [x] INSERT/UPDATE chỉ dành cho row có `id = 'global-master-roadmap'`.
- [x] Không dùng `user_metadata` do người dùng tự sửa để cấp quyền.
- [x] Không tạo SECURITY DEFINER function hoặc công khai service-role key.
- [x] API và layout kiểm tra `getUser()` + `profiles.role='admin'`; RLS là tầng bảo vệ độc lập ở DB.

### Các điểm chưa được kiểm nghiệm trực tiếp
- [ ] SQL migration chạy thành công trên staging / test database.
- [ ] Admin Auth JWT có thể SELECT/INSERT/UPDATE; ghi `updated_by` chính xác.
- [ ] Student Auth JWT bị từ chối mọi SELECT/INSERT/UPDATE/DELETE và không thể đổi `profiles.role`.
- [ ] Anonymous không thể đọc hoặc ghi bảng; không thấy dữ liệu Roadmap qua Data API.
- [ ] Tài khoản không có JWT gọi `public.is_admin()` trả `false` qua Data API và không làm rò dữ liệu; rà soát cảnh báo EXECUTE/SECURITY DEFINER độc lập trên 17 policy.
- [ ] Thao tác lưu đồng thời 2 cửa sổ trả về lỗi `409`, không ghi đè bản mới.
- [ ] Sau khi tạo Auth Admin, Vercel env và Live mode vận hành đúng; kiểm tra 360/768/1280px.
- [ ] Dữ liệu Roadmap đã lưu có thể xuất JSON và được sao lưu trước thay đổi.

**Lưu ý:** Server API dùng JWT của người dùng, không dùng service-role. Quyền PostgreSQL của `authenticated` trên bảng không thay thế RLS. `SELECT` policy cần tồn tại để hoạt động UPDATE + SELECT RETURNING.

## 3. Cảnh báo của Supabase Security Advisor (chưa thay đổi)

**Đã xác minh trực tiếp:** `public.is_admin()` có owner `postgres`, thuộc tính `STABLE SECURITY DEFINER`, `search_path='public'`; hàm chỉ thực hiện `EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')`. Quyền `EXECUTE` được cấp cho **PUBLIC, anon và authenticated**. Truy vấn không có JWT trả `auth.uid() IS NULL` và `public.is_admin()=false`. Chưa có tài khoản Auth thật nên chưa thể kết luận bằng JWT học sinh/Admin thực tế.

**Phụ thuộc hiện có:** 17 RLS policy trên 11 bảng (bao gồm `profiles`, `courses`, `chapters`, `quizzes`, `quiz_attempts`...) đang gọi `is_admin()`. Vì vậy, thu hồi `EXECUTE` từ `anon`/`authenticated` hoặc chuyển hàm sang `SECURITY INVOKER` mà không sửa các policy liên quan có thể khiến truy cập bị từ chối hoặc gây đệ quy RLS. **Không triển khai thay đổi này cùng migration Roadmap.**

**Phân loại review:** Cảnh báo **WARN tồn tại từ trước, không do PR #50 tạo ra**. Không có bằng chứng hiện tại cho thấy người chưa đăng nhập nhận được quyền Admin, nhưng bề mặt `SECURITY DEFINER` có thể gọi qua REST vẫn cần xử lý riêng trước khi chốt bảo mật Live toàn hệ thống. Cách xử lý phù hợp là thiết kế helper trong schema không public hoặc tái cấu trúc ACL/policy theo transaction, kiểm thử 17 policy trên staging và dùng JWT thật trước khi thay đổi production.

Tài liệu khắc phục:  
- https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
- https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable

**Không sửa `public.is_admin()` trong migration Roadmap này** để tránh làm gián đoạn phân quyền hiện có. Roadmap policies chủ động dùng điều kiện hồ sơ, không bổ sung dependency lên SECURITY DEFINER mới. Không được chỉ chạy `REVOKE EXECUTE` theo cảnh báo advisor mà chưa rà lại các policy đang phụ thuộc. Tài liệu về quyền function: https://supabase.com/kb/troubleshooting/custom-role-inherits-privileges-that-were-not-explicitly-granted

## 4. Hướng triển khai khi được phê duyệt (CHƯA THỰC HIỆN)

1. Kiểm tra bản sao lưu và trạng thái migration. Xác nhận `admin_roadmap` chưa tồn tại, schema `profiles` và quyền update role còn nguyên.
2. Áp **đúng** migration đã qua review qua quy trình deployment DB có lưu migration history; không chạy lại nếu đã ghi lịch sử.
3. Thực hiện bộ SQL kiểm tra read-only ở mục 5.
4. Đăng ký tài khoản Auth bằng phương pháp bình thường, xác minh email/hồ sơ. Sau khi đối chiếu định danh, cấp role `admin` bằng đường quản trị tin cậy (không thực hiện trong browser và không dựa trên `user_metadata`).
5. Tạo một tài khoản `student` thử nghiệm, xác minh chính sách read/write/deny bằng JWT thực, trước khi bật Live.
6. Bổ sung `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` bằng key công khai phù hợp vào Vercel (không có service-role key ở client). Chỉ bật `NEXT_PUBLIC_USE_MOCK_DATA=false` khi toàn bộ test đạt.
7. Chạy thử Admin Roadmap trên production, reload và 2 phiên đồng thời; xác minh log, sao lưu JSON và khả năng rollback.

**Không có thay đổi production SQL, user role hoặc Vercel env trong giai đoạn rà soát.**

## 5. SQL xác minh chỉ đọc, dùng SAU KHI triển khai

```sql
-- Verify schema and RLS:
select c.relname,c.relrowsecurity
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname='admin_roadmap';

-- Confirm policies and strict role checks:
select policyname,cmd,roles,qual,with_check
from pg_policies where schemaname='public' and tablename='admin_roadmap'
order by policyname;

-- Confirm grants (RLS must still be tested with real JWTs):
select
 has_table_privilege('anon','public.admin_roadmap','SELECT') as anon_select,
 has_table_privilege('authenticated','public.admin_roadmap','SELECT') as auth_select,
 has_table_privilege('authenticated','public.admin_roadmap','INSERT') as auth_insert,
 has_table_privilege('authenticated','public.admin_roadmap','UPDATE') as auth_update,
 has_table_privilege('authenticated','public.admin_roadmap','DELETE') as auth_delete,
 has_column_privilege('authenticated','public.profiles','role','UPDATE') as auth_update_role;

-- Confirm single-document CHECK constraint and source integrity:
select conname,pg_get_constraintdef(oid) as definition
from pg_constraint where conrelid='public.admin_roadmap'::regclass
order by conname;
```

Mong đợi: `relrowsecurity=true`; ba policy cho `authenticated`; `anon_select=false`; `auth_select/insert/update=true`; `auth_delete=false`; `auth_update_role=false`.

**Các xác minh chỉ đọc không thay thế test RLS bằng hai tài khoản thật.**

### SQL rà soát quyền EXECUTE của `public.is_admin()` (read-only)

```sql
select p.proname, p.prosecdef, p.proowner::regrole as owner,
  has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
  has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_execute,
  exists (
    select 1 from aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) acl
    where acl.grantee=0 and acl.privilege_type='EXECUTE'
  ) as public_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname='is_admin';

select count(*) as dependent_policies, count(distinct tablename) as affected_tables
from pg_policies where schemaname='public'
  and (coalesce(qual,'') like '%is_admin%'
    or coalesce(with_check,'') like '%is_admin%');
```

Thực đo trước khi áp migration: `anon_execute=true`, `authenticated_execute=true`, `public_execute=true`, **17 policies / 11 tables**.

## 6. Kết luận review PR #50 và điều kiện merge

- **Đạt review tĩnh:** Schema singleton; 3 policy Admin; `updated_by=auth.uid()` khi ghi; không cấp `DELETE` cho `authenticated`, `anon` hoặc `PUBLIC`; API đọc role từ bảng thật và có kiểm soát phiên bản.
- **Rủi ro còn tồn tại:** `public.is_admin()` callable dưới SECURITY DEFINER từ anon/authenticated; đã xác nhận no-JWT false, không phải lỗ hổng do migration mới. Cần một task hardening riêng cùng regression suite 17 policies; không thay đổi helper trong PR này.
- **Chưa đạt nghiệm thu Live:** migration chưa chạy trong database/staging; RLS chưa test bằng JWT thật; Auth chưa có admin/student và env Live chưa cấu hình. PASS của CI chỉ là kiểm tra mã, không chứng minh quyền production.
- **Quyết định:** PR #50 có thể merge **chỉ như một thay đổi mã nguồn và tài liệu**, vì workflow CI không có thao tác apply migration. **Không áp DB migration, không bật Live hoặc thay đổi Vercel** trong lần review này. Migration chỉ được áp riêng sau các bước preflight đã liệt kê và xác nhận quy trình release.

## 7. Phương án khôi phục an toàn

Chưa có bảng Roadmap trên production ở thời điểm review, nên migration chỉ tạo bảng và quyền mới. Nếu triển khai gặp lỗi: **dừng bật Live, giữ Demo + bản sao JSON trên trình duyệt**; điều tra migration/permission và sửa bằng migration tiếp theo. Không tự `DROP TABLE` khi có dữ liệu, không xóa người dùng để rollback. Kiểm tra sao lưu DB trước mọi quyết định phá hủy dữ liệu.

## Tham khảo chính thức

- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/api/securing-your-api
- https://supabase.com/docs/guides/database/secure-data



## Nguyên bản: docs/ADMIN_ROADMAP_REAL_JWT_TEST_PLAN.md

---

# Kiểm thử RLS Admin Roadmap bằng JWT thật

**Ngày:** 2026-10-27  
**Trạng thái cập nhật 27/10/2026:** Hai tài khoản thử nghiệm đã tồn tại. Admin đã xác minh email và có role `admin`; Student có role `student` nhưng **chưa xác minh**. Chưa có kết quả kiểm thử JWT hai vai trò thật.  
**Dự án production:** `bpxwpfmjoojrgqlfkqgz`.

> Mục tiêu: xác minh phân quyền qua đăng nhập Supabase Auth thật. Không giả mạo JWT bằng `set_config('request.jwt.claims')`, không chèn trực tiếp vào `auth.users`, không dùng `service_role` hay secret key để thực hiện truy vấn RLS.
>
> Production đã có cấu hình Supabase và Live. **Không thay đổi thêm biến Vercel hoặc cấp quyền**, không gửi mật khẩu/token; chưa coi RLS đã nghiệm thu.

## 1. Các tiền điều kiện đã kiểm tra trực tiếp (read-only)

- [x] Migration `20261026163500_admin_roadmap` đã có trong lịch sử Supabase.
- [x] `public.admin_roadmap` tồn tại và bật RLS.
- [x] Có 3 policy `SELECT`, `INSERT`, `UPDATE` dựa trên `profiles.role='admin'`.
- [x] `anon` không có `SELECT`; `authenticated` có `SELECT,INSERT,UPDATE` nhưng không có `DELETE,TRUNCATE`.
- [x] `authenticated` không có `UPDATE` trên `profiles.role`.
- [x] *Lịch sử trước khi mời tài khoản:* cả ba bằng 0. Hiện production có hai Auth user/hồ sơ và một Roadmap phiên bản 4, 20 mốc; không tái khởi tạo.
- [x] Trigger Auth `on_auth_user_created_profile` chạy `create_new_student_profile()`; người dùng mới mặc định là student.

## 2. Tạo tài khoản thử nghiệm đúng luồng Supabase Auth

Cần **hai hộp thư có thật do chủ dự án kiểm soát**, mật khẩu mạnh riêng biệt và email được xác minh:

1. Mở [Authentication → Users](https://supabase.com/dashboard/project/bpxwpfmjoojrgqlfkqgz/auth/users). Dùng **Add user / Invite user** hoặc đăng ký qua Supabase Auth chính thức; làm theo bước xác minh email của từng tài khoản. Không tạo người dùng bằng lệnh `INSERT INTO auth.users`.
2. Tạo 2 tài khoản có email riêng: một dùng để kiểm thử Admin và một dành cho Student. Tránh tài khoản của học sinh thật.
3. Kiểm tra bảng `profiles`: trigger phải tự tạo đúng một hồ sơ cho mỗi tài khoản và cả hai ban đầu có `role='student'`.
4. Đối chiếu email xác minh, sau đó chỉ nâng role cho email Admin thử nghiệm bằng SQL có điều kiện ở mục 3.
5. **Giữ mật khẩu và access token ở máy bạn**, không gửi qua chat, GitHub Issues/PR, Vercel, Slack, screenshot hay email.

> Công cụ Supabase hiện được kết nối trong chat chỉ có các thao tác SQL/schema; **không có API quản trị tạo tài khoản Auth**. Không dùng SQL viết trực tiếp `auth.users` như giải pháp thay thế.

## 3. SQL xác minh và cấp vai trò Admin (chỉ chạy SAU khi có 2 tài khoản)

### 3a. Đọc thông tin xác minh và vai trò

Thay hai email ví dụ bằng địa chỉ thật **trực tiếp trong Supabase SQL Editor**:

```sql
select
  u.id, u.email,
  (u.email_confirmed_at is not null) as email_verified,
  p.role
from auth.users u
left join public.profiles p on p.id = u.id
where lower(u.email) in (
  lower('test-admin@example.com'),
  lower('test-student@example.com')
)
order by u.email;
```

Điều kiện bắt buộc: đúng 2 bản ghi với 2 UUID khác nhau; `email_verified=true`; cả hai có `profiles.role=student`. Nếu thiếu hồ sơ hoặc chưa xác minh, **dừng lại, không tự thêm hồ sơ bỏ qua trigger**.

### 3b. Nâng Admin cho duy nhất email đã xác minh

```sql
-- Thực hiện bằng Supabase SQL Editor của chủ dự án, không chạy từ trình duyệt học sinh.
update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('test-admin@example.com')
  and u.email_confirmed_at is not null
  and p.role = 'student'
returning p.id, p.role;
```

Phải trả về **đúng 1 dòng** có role `admin`. Không cấp quyền Admin bằng `user_metadata`, form tự đăng ký hoặc endpoint công khai.

### 3c. Kiểm tra lại hai vai trò

```sql
select u.id, u.email, p.role
from auth.users u join public.profiles p on p.id=u.id
where lower(u.email) in (
  lower('test-admin@example.com'),
  lower('test-student@example.com')
);
```

Phải có một Admin, một Student.

## 4. Chạy kiểm thử bằng hai JWT thật (mặc định KHÔNG ghi DB)

Dùng công cụ `scripts/verify-roadmap-rls.mjs` từ repository đã `pnpm install --frozen-lockfile`. Các biến sau chỉ đặt **trong phiên terminal cá nhân**, không trong repository hay Vercel:

```bash
export RLS_SUPABASE_URL="https://bpxwpfmjoojrgqlfkqgz.supabase.co"
export RLS_SUPABASE_PUBLISHABLE_KEY="<publishable key lấy từ Supabase Dashboard>"
export RLS_ADMIN_EMAIL="<email-admin>"
export RLS_STUDENT_EMAIL="<email-student>"
read -r -s -p "Admin password: " RLS_ADMIN_PASSWORD; echo
export RLS_ADMIN_PASSWORD
read -r -s -p "Student password: " RLS_STUDENT_PASSWORD; echo
export RLS_STUDENT_PASSWORD

node scripts/verify-roadmap-rls.mjs

unset RLS_ADMIN_PASSWORD RLS_STUDENT_PASSWORD
```

Công cụ dùng **2 client Supabase tách biệt**, `signInWithPassword()` và `getUser()`, xác nhận email đã verify và kiểm tra role từ `profiles`. JWT được gắn tự động khi truy cập Data API. Không in mật khẩu hoặc token.

Kết quả mong đợi (khi bảng `admin_roadmap` vẫn trống):
- [ ] Admin đăng nhập thành công; `profiles.role=admin`.
- [ ] Student đăng nhập thành công; `profiles.role=student`.
- [ ] Client chưa đăng nhập không có quyền SELECT `admin_roadmap` (lỗi quyền).
- [ ] Admin SELECT hợp lệ, nhận đúng **1 dòng** từ Supabase production.
- [ ] Student SELECT hợp lệ nhưng RLS lọc ra **0 dòng**.
- [ ] Kết quả cuối `READ-ONLY PASS`, không thêm hoặc sửa Roadmap.

**Lưu ý:** Bảng hiện đã có 1 Roadmap; Admin SELECT phải thấy đúng 1 row, Student SELECT không thấy row. Phần script read-only hiện cho phép tối đa 1 row và đòi JWT đã xác minh. Muốn chứng minh SELECT/UPDATE/INSERT với dữ liệu thực phải làm phần 5 trên DB thử nghiệm.

## 5. Bài kiểm tra ghi dữ liệu — CHỈ trên Supabase branch/project thử nghiệm

Script có tùy chọn `--write` nhưng chủ động **từ chối kết nối đến project ref production** `bpxwpfmjoojrgqlfkqgz`. Cần sao chép migration và Auth trigger sang một môi trường thử nghiệm cách ly, tạo hai tài khoản thử nghiệm riêng tại đó, và thiết lập:

```bash
export RLS_TEST_ISOLATED=YES
export RLS_WRITE_ACK=I_UNDERSTAND
node scripts/verify-roadmap-rls.mjs --write
```

Bộ kiểm thử trên môi trường cách ly thực hiện:
- [ ] Student **không thể INSERT** Roadmap.
- [ ] Admin có thể INSERT `global-master-roadmap` với `updated_by` bằng chính UID.
- [ ] Student **không thể SELECT** bản ghi đã tồn tại.
- [ ] Student UPDATE không làm thay đổi bản ghi.
- [ ] Admin UPDATE phiên bản từ 1 lên 2 thành công.
- [ ] Admin không thể mạo danh `updated_by` bằng UID Student.
- [ ] Đọc lại bằng Admin cho đúng UID, `version=2` và dữ liệu nguyên vẹn.

**Điều kiện môi trường thử nghiệm phải sạch:** `admin_roadmap` ban đầu có 0 hàng. Bộ kiểm thử để lại 1 bản Roadmap rỗng trên DB thử nghiệm, không tự DELETE và không chạy trên production.

Thử DELETE/TRUNCATE bằng JWT không thực hiện trong script vì nếu có lỗ hổng thì có thể xóa mất dữ liệu; các quyền đó được kiểm qua grant query. Kiểm thử API chống ghi đè `409` là bước riêng sau khi cấu hình app thử nghiệm.

## 6. Tiêu chuẩn đạt trước khi bật Live

- [ ] SQL xác minh đúng 2 Auth user đã xác minh và hồ sơ role.
- [ ] Kiểm thử đọc theo JWT thật PASS ở production.
- [ ] Kiểm thử ghi theo JWT thật PASS trên nhánh/project Supabase cách ly.
- [ ] Không có vấn đề với quyền của `profiles.role`, `updated_by`, `admin_roadmap`.
- [ ] Rà lại Supabase Security Advisor; `public.is_admin()` là cảnh báo có từ trước, xử lý theo đợt riêng.
- [ ] Sau đó mới thẩm định cấu hình Vercel (publishable key, URL, Live flag) và E2E giao diện hai tài khoản.
- [ ] Xóa tài khoản thử nghiệm khi hoàn tất và không còn phiên đăng nhập dùng cho kiểm thử; lưu ý JWT cũ có thể còn hiệu lực cho đến lúc hết hạn.

**Kết luận hiện tại:** Tài khoản Admin đã sẵn sàng để test nhưng tài khoản Student còn thiếu xác minh email. **Không đánh dấu JWT/RLS đa vai trò PASS** trước khi chạy test bằng hai phiên đăng nhập thật; chưa nhờ người dùng cung cấp mật khẩu qua chat.



## Nguyên bản: docs/PHASE_00_SECURITY_AND_RECOVERY_20261027.md

---

# P0 — Kiểm kê quyền, sao lưu và điều kiện nghiệm thu

Ngày kiểm tra: **27/10/2026**. Đây là kết quả đọc production, không phải giấy chứng nhận đã vượt qua kiểm thử xâm nhập hoặc đa tài khoản.

## Hệ thống hiện có

- Next.js 15 / React 19; Vercel production Live, Preview/Development Demo. Supabase quản lý Auth, PostgreSQL, Storage.
- Có các trang Admin: tổng quan, Roadmap, sitemap, người dùng, phân quyền, cấu hình nháp, nhật ký cục bộ, giám sát, báo cáo, khóa học, tài liệu. Các trang học tập, Word và trình chiếu là module riêng; các route tương lai được đánh dấu Planned.
- **Kiểm kê tuyến đường:** `src/features/admin/admin-sitemap.ts`; danh sách điều hướng thực trong `src/config/navigation.ts`; CI smoke HTTP các Admin page.
- Production: **14 bảng trong public, tất cả bật RLS**. `public.user_role` thực tế chỉ có `student`, `teacher`, `admin`. Vai trò khách là truy cập `anon`; vai trò quản trị trường chưa có schema/quyền riêng.
- Hai migration Roadmap đã áp: `20261026163500` và `20261027010815`. Roadmap hiện có một document, version 4, 4 sự kiện (tại lần kiểm tra).
- Có tài khoản Admin email verified; tài khoản Student thử nghiệm chưa verified. **Chưa nghiệm thu JWT hai vai trò**.
- Một số bảng ứng dụng cũ vẫn có `anon INSERT` grant rộng; RLS được bật nhưng **grant khác policy**. `public.is_admin()` là SECURITY DEFINER và cho phép anon gọi, có nhiều policy phụ thuộc. Đây là mục cần review/cắt quyền theo migration có kiểm thử; không tự REVOKE trên production.
- SQL đối soát không ghi dữ liệu: `scripts/sql/audit-supabase-permissions.sql`.

## Phân quyền mong muốn (chưa coi là đã triển khai đầy đủ)

| Hành động | Khách | Học sinh | Giáo viên | Admin nền tảng |
| --- | --- | --- | --- | --- |
| Đọc nội dung đã xuất bản | Có | Có | Có | Có |
| Xem tiến độ/bài nộp cá nhân | Không | Chỉ chính mình | Chỉ khi có quyền lớp (chưa có) | Theo chức năng giám sát |
| Quản trị Roadmap và nhật ký thay đổi | Không | Không | Không | Có, cần JWT + RLS |
| Quản lý lớp/học sinh | Không | Không | Theo lớp (chưa có) | Cần thiết kế |
| Cấp vai trò người dùng | Không | Không | Không | Chỉ quy trình chủ dự án kiểm soát riêng, không có API tự cấp |
| Quản trị trường | Chưa triển khai | Chưa triển khai | Chưa triển khai | Chưa triển khai |

Tài khoản chỉ được cấp role sau khi email verified và owner đối chiếu; không dùng `user_metadata` làm căn cứ bảo mật.

## Sao lưu Roadmap chính thức

- Nút **Sao lưu từ Supabase** (chỉ trong Live) gọi `GET /api/admin/roadmap/backup` với phiên đăng nhập thật.
- Route kiểm tra `auth.getUser()`, `profiles.role='admin'`, và để RLS quyết định việc đọc `admin_roadmap` / `admin_roadmap_events`. Không dùng secret key.
- Bản xuất bao gồm `roadmapVersion`, danh sách `items`, lịch sử sự kiện đầy đủ trong giới hạn 2.000, thời điểm xuất và **SHA-256 của {items,version}**. Nếu không đọc đủ lịch sử, route trả lỗi thay vì tự cắt bớt.
- Dữ liệu bản xuất **không phải database backup đầy đủ**. Chỉ Roadmap là có bản sao JSON; file không sao lưu Supabase Auth, Storage, bảng học tập, cấu hình Vercel.
- Việc kiểm tra mã SHA-256 chỉ xác định dữ liệu thay đổi so với thời điểm export, **không chứng thực nguồn gốc chữ ký số**. Hãy giữ file backup trong kho riêng có quyền hạn; tránh gửi lên kênh công khai.

### Quy trình khôi phục an toàn

1. Đăng nhập Admin trên môi trường cô lập, tải JSON backup, kiểm tra hash và đếm số mốc/checklist/ghi chú; so với dữ liệu server hiện tại.
2. Chỉ nhập `items` sau khi lưu lại bản hiện tại; không nhập lại `events` vào DB vì trigger tự ghi lịch sử theo revision.
3. Thao tác import đi qua nút xác nhận và API CAS theo `version`; HTTP 409 thì dừng, tải bản mới, đối chiếu khác biệt, không ghi đè.
4. Kiểm tra bản ghi sau import, lịch sử audit có revision mới và so khớp UUID/checklist/ghi chú; nếu thất bại, rollback bằng bản gốc có xác nhận.
5. Thử khôi phục trên môi trường cách ly **trước** khi áp trên production, không dùng tài khoản học sinh thật.

## Cổng còn mở

- [ ] JWT Auth/RLS thật bằng Admin và Student verified; kiểm chứng từ chối SELECT, INSERT, UPDATE và không rò rỉ hồ sơ khác.
- [ ] Rà soát grants, SECURITY DEFINER theo từng policy; migration và test tách biệt.
- [ ] Kiểm chứng khả năng phục hồi ngoài Roadmap (DB backups/PITR theo gói Supabase và Storage).
- [ ] Cấu hình cảnh báo và log server cho mọi thay đổi nhạy cảm, không chỉ Roadmap.
- [ ] Thử khôi phục JSON trên Supabase thử nghiệm tách production.
- [ ] Kiểm thử tải/độ trễ thiết bị thật, kiểm tra WCAG cơ bản trên các trang quan trọng.
- [ ] Production đã chuyển sang commit mới và E2E được xác nhận sau CI; giới hạn deploy Vercel có thể làm trễ bước này.

**Quy tắc:** không đánh dấu cả mục “backup, restore, audit logs và giám sát” hoàn thành chỉ vì có nút tải JSON; phải thử khôi phục thực tế và bổ sung backup dữ liệu ngoài Roadmap.



## Nguyên bản: docs/ROADMAP_SYNC_SECURITY_QA_20261029.md

---

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



## Nguyên bản: docs/SUPABASE_STATUS_20261013.md

---

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


