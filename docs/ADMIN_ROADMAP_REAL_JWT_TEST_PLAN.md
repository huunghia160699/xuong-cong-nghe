# Kiểm thử RLS Admin Roadmap bằng JWT thật

**Ngày:** 2026-10-27  
**Trạng thái:** Chuẩn bị công cụ; **CHƯA CÓ tài khoản thử nghiệm hoặc kết quả JWT thật**.  
**Dự án production:** `bpxwpfmjoojrgqlfkqgz`.

> Mục tiêu: xác minh phân quyền qua đăng nhập Supabase Auth thật. Không giả mạo JWT bằng `set_config('request.jwt.claims')`, không chèn trực tiếp vào `auth.users`, không dùng `service_role` hay secret key để thực hiện truy vấn RLS.
>
> **Không cấu hình Vercel, không bật Live** trước khi có đủ bằng chứng cho phép/không cho phép.

## 1. Các tiền điều kiện đã kiểm tra trực tiếp (read-only)

- [x] Migration `20261026163500_admin_roadmap` đã có trong lịch sử Supabase.
- [x] `public.admin_roadmap` tồn tại và bật RLS.
- [x] Có 3 policy `SELECT`, `INSERT`, `UPDATE` dựa trên `profiles.role='admin'`.
- [x] `anon` không có `SELECT`; `authenticated` có `SELECT,INSERT,UPDATE` nhưng không có `DELETE,TRUNCATE`.
- [x] `authenticated` không có `UPDATE` trên `profiles.role`.
- [x] `auth.users=0`, `public.profiles=0`, `admin_roadmap=0` ở thời điểm kiểm tra.
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
- [ ] Admin SELECT hợp lệ, nhận **0 dòng** vì bảng chưa có dữ liệu.
- [ ] Student SELECT hợp lệ nhưng RLS lọc ra **0 dòng**.
- [ ] Kết quả cuối `READ-ONLY PASS`, không thêm hoặc sửa Roadmap.

**Lưu ý:** Vì bảng đang trống, chỉ đọc 0 dòng **không chứng minh đầy đủ** Student bị RLS chặn. Muốn chứng minh SELECT/UPDATE/INSERT với dữ liệu thực phải làm phần 5 trên DB thử nghiệm.

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

**Kết luận hiện tại:** Bảng và policy đã triển khai, nhưng **không được đánh dấu "RLS bằng JWT thật: PASS"** cho đến khi hai tài khoản tồn tại và script chạy với token đăng nhập thật.
