# Giai đoạn 00 — Kiểm kê Admin, dữ liệu Roadmap, môi trường và nghiệm thu

**Kiểm tra:** 27/10/2026 · Repository `huunghia160699/xuong-cong-nghe` · Production `xuong-cong-nghe.vercel.app`.

## 1. Roadmap: nguồn dữ liệu và phát hiện sai lệch

**Ưu tiên nguồn:** Supabase production (khi Admin đăng nhập Live) → bản nháp thiết bị (chỉ để đối chiếu/khôi phục) → checklist `docs/XCN_FUNCTION_ROADMAP_CHECKLIST.md` và dữ liệu gốc `roadmap-data.ts` (mẫu tham chiếu). Không ghi đè Supabase bằng seed.

Kết quả truy vấn production trước đợt sửa (read-only):
- Roadmap `global-master-roadmap`: **1 bản, version 4, 20 việc lớn**, lịch sử **4 lần lưu**.
- Mốc `admin-center`: **12/13** việc được tích, 8 ghi chú. GitHub và dữ liệu mẫu chỉ tích **10/13**.
- Hai dấu tích khác nhau: (11) lưu Roadmap và sao lưu; (12) xác minh quyền Admin/RLS/đa tài khoản.
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
