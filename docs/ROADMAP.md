# Roadmap — Xưởng Công Nghệ

> **Ưu tiên hiện tại (khóa phạm vi): Admin + Sitemap + Roadmap trước mọi module khác.**
> **Kiểm kê 27/10/2026:** Production đã bật Live, có 1 Roadmap Supabase phiên bản 4 (20 mốc) và 4 sự kiện; Admin đã xác minh, Student chưa. Hai dấu tích trên Supabase khác checklist GitHub; mục JWT đa tài khoản chưa được nghiệm thu. Báo cáo: [ADMIN_PHASE_00_RECONCILIATION_QA_OPERATIONS_20261027.md](ADMIN_PHASE_00_RECONCILIATION_QA_OPERATIONS_20261027.md).
> **Roadmap đồng bộ thực:** Với Admin JWT hợp lệ và Live đang bật, mỗi chỉnh sửa được tự lưu lên Supabase và tạo sự kiện DB tại `admin_roadmap_events`; kiểm tra xung đột phiên bản trước khi ghi. PR #54. JWT hai vai trò còn chờ nghiệm thu; bản nháp Demo không phải dữ liệu chính.
> Checklist đầy đủ: [XCN_FUNCTION_ROADMAP_CHECKLIST.md](XCN_FUNCTION_ROADMAP_CHECKLIST.md).
> Sơ đồ toàn website: [XCN_SITEMAP_2026_2028.md](XCN_SITEMAP_2026_2028.md).
> Trang quản trị: `/admin` · Timeline: `/admin/roadmap` · Sitemap: `/admin/sitemap`.
> Tiến độ lưu cục bộ trong Demo; migration RLS `20261026163500_admin_roadmap.sql` **đã áp dụng** lên Supabase production (kiểm chứng trực tiếp 27/10/2026), nhưng **chưa bật Live** vì chưa có tài khoản và chưa kiểm thử bằng JWT thật.
> **Rà soát bảo mật:** [ADMIN_ROADMAP_MIGRATION_SECURITY_REVIEW.md](ADMIN_ROADMAP_MIGRATION_SECURITY_REVIEW.md) — ghi nhận tại thời điểm review trước áp migration.
> **Bước tiếp theo:** [ADMIN_ROADMAP_REAL_JWT_TEST_PLAN.md](ADMIN_ROADMAP_REAL_JWT_TEST_PLAN.md) — tạo tài khoản thử nghiệm đã xác minh và kiểm thử phân quyền thực tế; chưa ghi nhận PASS.


> **Kế hoạch tái cấu trúc tổng thể (đề xuất 2026–2028):** [XƯỞNG CÔNG NGHỆ — MASTER PLAN](XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md).  
> Các mục MVP bên dưới là ghi nhận theo những giai đoạn trước; một số ghi chú triển khai có thể không còn phản ánh môi trường production hiện tại. Phải audit môi trường thật và đối chiếu code trước khi cập nhật trạng thái. Tính năng trong Master Plan chưa được xem là đã triển khai.

## MVP 0.1 — Nền và vòng học thử
- [x] Homepage, Course Detail, Student Dashboard, Lesson, Quiz, Result
- [x] Nội dung Excel 9 bài + 6 câu hỏi
- [x] Local demo progress + kết quả
- [x] Unit test, typecheck, build và smoke test demo

## MVP 0.2 — Auth và dữ liệu thật (mã nguồn đã có, cần cấu hình triển khai)
- [x] Supabase SSR client và middleware làm mới session
- [x] Đăng nhập, đăng ký học viên, khôi phục/đổi mật khẩu, đăng xuất
- [x] Kiểm tra quyền student/admin ở middleware và Server Layout
- [x] Tự tạo profiles.role=student bằng trigger
- [x] Lưu tiến độ bài học thật trong bảng lesson_progress (code)
- [x] RPC submit_quiz/get_quiz_result chấm điểm và xem kết quả theo tài khoản (code)
- [x] Quiz API không trả đáp án đúng trước khi nộp
- [x] Live Student Dashboard hiển thị tiến độ và bài nộp theo tài khoản
- [x] Live Admin Dashboard dữ liệu thật + tạo/đổi trạng thái khóa học
- [x] Seed Supabase 9 lessons + 6 quiz questions
- [ ] **Chưa áp migrations/seed vào Supabase project thực**
- [ ] **Chưa kiểm thử Auth, RLS, RPC với nhiều tài khoản trong môi trường thật**
- [ ] **Chưa có deploy chính thức**
- [ ] Editor CRUD chương/bài/câu hỏi và autosave quiz đang làm dở

## MVP 0.3 — Thực hành chuyên sâu
- Excel Lab tương tác và tự chấm
- Word Lab, Notes, Tools, Resources
- Teacher Workspace, AI Tutor, thương mại ở giai đoạn sau


## Backlog — Phòng trắc nghiệm tương tác trực tiếp (chờ triển khai)

**Ghi nhận:** 2026-10-26. **Trạng thái:** CHƯA TRIỂN KHAI, chỉ lưu yêu cầu để làm sau.
**Định hướng đã chọn:** GV mở phòng, HS dùng điện thoại/máy tính tham gia bằng mã, chọn đáp án ngay trên thiết bị; ưu tiên hơn phương án quét thẻ giấy. Học hỏi luồng chức năng, không sao chép thiết kế hoặc mã nguồn của Kahoot, Quizizz hay dethiso.vn.

### Giai đoạn 1 — Live Quiz do giáo viên điều khiển (ưu tiên)

- [ ] GV chọn bộ câu hỏi có sẵn trong ngân hàng/công cụ soạn câu hỏi của HuuNghia Studio, tạo phiên trực tiếp gắn với lớp hoặc phiên khách.
- [ ] Sinh mã phòng ngắn, khó trùng (đề xuất PIN 6 chữ số, có thời hạn), liên kết chia sẻ và QR tham gia; phòng chờ hiển thị số lượng và danh sách người tham gia.
- [ ] HS vào phòng từ trình duyệt điện thoại bằng mã/link/QR, nhập tên hoặc chọn đúng hồ sơ HS trong lớp; không bắt buộc đăng ký đối với phiên khách.
- [ ] GV điều khiển bắt đầu/tạm dừng/tiếp tục/chuyển câu/kết thúc; đặt thời lượng cho từng câu và tùy chọn khóa/cho sửa đáp án trước hạn.
- [ ] Màn hình trình chiếu hiển thị câu hỏi, trạng thái nhận đáp án và đồng hồ; giao diện HS tối ưu cho màn hình nhỏ, đáp án A/B/C/D rõ ràng, thao tác chạm thuận tiện.
- [ ] Nhận, lưu, chấm và thống kê câu trả lời theo thời gian thực; đếm HS đã/chưa trả lời. Không gửi đáp án đúng trước khi GV công bố.
- [ ] Sau khi GV công bố: hiển thị biểu đồ phân bổ A/B/C/D, đáp án đúng, lời giải; GV có thể giảng giải trước khi chuyển câu.
- [ ] Cuối phiên: tổng hợp theo HS/câu/lớp, lưu lịch sử hoạt động và xuất CSV/Excel; bảng xếp hạng/điểm thưởng là cấu hình tùy chọn, tránh gây áp lực.
- [ ] Xử lý mất mạng/tải lại trang: tái kết nối bằng token phiên, khôi phục lựa chọn đã gửi, chống ghi trùng hoặc nộp sau hạn; đếm giờ và trạng thái phiên do server xác thực.
- [ ] Quyền và an toàn: chỉ GV chủ phòng được điều khiển, kiểm soát người lạ/tên trùng/spam, giới hạn lượt tham gia, tránh hiển thị thông tin cá nhân HS công khai.
- [ ] Kiểm thử thực tế với 40–50 thiết bị trong một lớp; kiểm tra độ trễ, đồng bộ, reconnect, thao tác trên Android/iOS, màn hình máy chiếu và mạng Wi-Fi yếu.

### Giai đoạn 2 — Mở rộng sau khi Live Quiz ổn định

- [ ] HS làm theo tốc độ riêng, giới hạn thời gian toàn bài, giao bài qua lớp hoặc liên kết và nộp/chấm tự động.
- [ ] Hỗ trợ thêm đúng/sai, nhiều đáp án, điền ngắn và câu hỏi có hình ảnh/công thức; tái sử dụng ngân hàng câu hỏi.
- [ ] Trò chơi thi đấu đội, bảng điểm trực tiếp, hiệu ứng chuyển câu và các mẫu gamification tùy bật/tắt; không ưu tiên hơn tính ổn định của bản đầu.
- [ ] Phân tích độ khó câu hỏi, câu HS sai nhiều, theo dõi tiến bộ và xuất báo cáo phục vụ giáo viên.

### Tài liệu tham khảo và phạm vi

- Trang tham khảo: https://dethiso.vn
- Luồng phòng thi đấu tham khảo: https://dethiso.vn/docs/dau-truong/tao-dau-truong-2-doi
- Luồng giao bài/chấm/khôi phục: https://dethiso.vn/docs/thi-online/giao-bai-cho-lop
- Từ dethiso.vn có thể học luồng tạo PIN, phòng chờ, giáo viên điều khiển, HS trả lời trên điện thoại, bảng điểm; các số giới hạn/khẳng định hiệu năng trên website bên ngoài chưa được kiểm chứng độc lập.
- **Ngoài phạm vi yêu cầu hiện tại:** quét thẻ giấy/Plickers, sửa trực tiếp editor Word, triển khai database hoặc tạo phòng thi thật. Chỉ ghi vào roadmap, không tự xây dựng cho đến khi có yêu cầu.


Chi tiết cấu hình: `docs/SUPABASE_SETUP.md`.
