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
