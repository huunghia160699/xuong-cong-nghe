# Roadmap triển khai — Xưởng Công Nghệ

> **Bản công việc ở repository, cập nhật nguồn tra cứu ngày 30/10/2026.**
> Điểm vào: [INDEX.md](INDEX.md). Mối quan hệ code: [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md).
> **Dữ liệu Roadmap chính thức trong Admin Production là Supabase**; checklist này không tự đồng bộ với Supabase hoặc ngược lại. Không tick các mục chỉ vì tài liệu nêu dự kiến.
> Chi tiết từng việc: [XCN_FUNCTION_ROADMAP_CHECKLIST.md](XCN_FUNCTION_ROADMAP_CHECKLIST.md); Master Plan: [XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md](XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md).
> Kiểm toán 30/10/2026: [SYSTEM_AUDIT_2026-10-30.md](SYSTEM_AUDIT_2026-10-30.md). Các báo cáo bảo mật/sync cũ giữ nguyên tại [archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md](archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md).

## Ưu tiên hiện hành (bám theo kiểm toán, chưa đánh dấu hoàn tất)

> **Cập nhật 30/10/2026 (sau khi tạo staging):** project `ordiksbvpewwgrnvzrud` ACTIVE_HEALTHY đã có 7 migration, seed giả lập và hardening quyền TRUNCATE riêng trên staging, 14/14 bảng RLS ON. **Chưa có hai tài khoản Auth QA; chưa chạy JWT thật và CRUD/restore thật**. Playbook tại [SUPABASE_SETUP.md](SUPABASE_SETUP.md). P0 vẫn chưa hoàn thành.

> **30/10/2026 — P0 staging:** đã chuẩn bị mã kiểm thử JWT/CRUD/backup/restore và ghi hướng dẫn tại [SUPABASE_SETUP.md](SUPABASE_SETUP.md). **Chưa tạo staging, chưa chạy bài test Live** vì cần xác nhận chi phí/quota/tổ chức. Không chuyển trạng thái P0 sang hoàn thành khi chưa có kết quả.

1. **P0 — Auth/Admin/Roadmap:** staging Supabase riêng, hai JWT thật, thử CRUD + reload + conflict, sao lưu/khôi phục.
2. **P0 — Security:** đánh giá SECURITY DEFINER, password protection, quyền RLS/GRANT trên staging trước khi áp Production.
3. **P1 — Nghiệm thu Admin:** 11 trang sau đăng nhập Live, màn hình 360/768/1280, error/loading, keyboard và mạng yếu.
4. **P1 — Contracts:** một luồng dùng chung nội dung/câu hỏi/bài học cho Quiz/Slides/Teacher/Labs, schema và quyền rõ.
5. **P2 — Teacher Studio:** quản lý lớp, học sinh, giao bài; chỉ mở sau P0 và kiểm thử quyền sở hữu.
6. **P2–P3 — Live Quiz, Excel/Coding Labs, AI/trò chơi:** triển khai từng module, không mở nhiều công cụ khi data model chưa ổn.

## Những mục cũ bên dưới là backlog / lịch sử đã xuất hiện

**Quan trọng:** các checkbox trong phần MVP 0.1/0.2 và ghi chú dated trước 30/10/2026 phản ánh thời điểm viết, không phải trạng thái Production ngày hôm nay. Đặc biệt những câu “chưa áp migrations”, “chưa deploy” có thể đã lỗi thời; luôn kiểm GitHub/Supabase/Vercel thực tế trước khi hành động. Mục chưa có bằng chứng E2E vẫn là chưa nghiệm thu.

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
- [x] **Migrations/seed đã từng được áp trên Supabase theo kiểm toán sau đó; cần đối chiếu migration history hiện tại trước mọi DB push**
- [ ] **Chưa kiểm thử Auth, RLS, RPC với nhiều tài khoản trong môi trường thật**
- [x] **Đã có Vercel Production Live theo kiểm toán sau đó; xác nhận lại SHA trước từng lần phát hành**
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
