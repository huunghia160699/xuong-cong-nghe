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
