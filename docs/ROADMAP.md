# Roadmap triển khai — Xưởng Công Nghệ

> **Bản công việc ở repository, cập nhật nguồn tra cứu ngày 30/10/2026.**
> Điểm vào: [INDEX.md](INDEX.md). Mối quan hệ code: [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md).
> **Dữ liệu Roadmap chính thức trong Admin Production là Supabase**; checklist này không tự đồng bộ với Supabase hoặc ngược lại. Không tick các mục chỉ vì tài liệu nêu dự kiến.
> Chi tiết từng việc: [XCN_FUNCTION_ROADMAP_CHECKLIST.md](XCN_FUNCTION_ROADMAP_CHECKLIST.md); Master Plan: [XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md](XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md).
> Kiểm toán 30/10/2026: [SYSTEM_AUDIT_2026-10-30.md](SYSTEM_AUDIT_2026-10-30.md). Các báo cáo bảo mật/sync cũ giữ nguyên tại [archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md](archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md).

## Ưu tiên hiện hành (bám theo kiểm toán, chưa đánh dấu hoàn tất)

### Quyết định 31/10/2026 — mở cổng Teacher Studio ở mức thiết kế

- **PASS `P0_STAGING_AUTH_ROADMAP`:** người dùng chạy local `READ-ONLY PASS` và `STAGING ACCEPTANCE PASS` với hai JWT Admin/Student thực; quyền trên Roadmap, CRUD, conflict, backup/restore và audit đạt. Đối chiếu SQL riêng xác nhận **singleton version 8, 0 items, 8 events (1–8)**. Không thu thập mật khẩu/JWT.
- **ĐƯỢC PHÉP:** phân tích yêu cầu, thiết kế hợp đồng lớp–thành viên–bài giao, tạo migration và RLS **trên staging**, viết test bằng user thử nghiệm và PR riêng, không sửa dữ liệu Production.
- **CHƯA ĐƯỢC PHÉP:** coi hệ thống đã nghiệm thu toàn diện, bật Teacher Studio Production, mở quyền lớp/bài nộp khi chưa có E2E và RLS ownership riêng của Teacher/Student.
- **CÒN CHẶN PRODUCTION:** nghiệm thu 11 trang Admin trên browser login thật/Preview, API 401/403/409, mạng yếu, quyền teacher test account + ownership/cross-class isolation, xử lý cảnh báo SECURITY DEFINER và bảo vệ mật khẩu phù hợp trước release.
- **Chi tiết bằng chứng và runbook:** [WORKLOG_AND_RULES.md](WORKLOG_AND_RULES.md) và [SUPABASE_SETUP.md](SUPABASE_SETUP.md). Không tự đồng bộ checklist Roadmap Production từ Markdown.

> *Lịch sử 30/10/2026:* staging đã được tạo và tài khoản QA xác minh bằng SQL; bài test JWT trên máy local lúc đó còn chờ. **Trạng thái 31/10 được cập nhật ở quyết định phía trên.**

> *Lịch sử đầu giai đoạn 30/10/2026:* bản kiểm thử đã được chuẩn bị trước khi khởi tạo staging. **Không áp dụng nội dung 'chưa tạo staging' cho hiện tại.**

1. **P0 — Auth/Admin/Roadmap:** **đã nghiệm thu JWT + Data API CRUD/conflict/backup/restore trên staging**. **Chưa nghiệm thu Next.js browser refresh/API/11 trang Admin trong Preview thực**.
2. **P0 — Security:** đánh giá SECURITY DEFINER, password protection, quyền RLS/GRANT trên staging trước khi áp Production.
3. **P1 — Nghiệm thu Admin:** 11 trang sau đăng nhập Live, màn hình 360/768/1280, error/loading, keyboard và mạng yếu.
4. **P1 — Contracts:** một luồng dùng chung nội dung/câu hỏi/bài học cho Quiz/Slides/Teacher/Labs, schema và quyền rõ.
5. **P2 — Teacher Studio:** **mở thiết kế và phát triển staging** cho quản lý lớp, thành viên, giao bài; chỉ bật Production sau test role `teacher` và RLS ownership/cross-class, E2E và phê duyệt phát hành.
6. **P2–P3 — Live Quiz, Excel/Coding Labs, AI/trò chơi:** triển khai từng module, không mở nhiều công cụ khi data model chưa ổn.

## Public Website — kế hoạch thiết kế lại 5 trang (31/10/2026)

> **D0/D1 đã hoàn thành; D2–D4 code/CI/Chromium PASS trên nhánh GitHub PR #73, CHƯA merge/deploy Vercel. D5–D6 đã code UI trên PR #73 (chưa CMS/đầu nhận); D7 QA/Release đang kiểm, chưa Production.** Nguồn chi tiết duy nhất: [PUBLIC_WEBSITE_DESIGN_SPEC.md](PUBLIC_WEBSITE_DESIGN_SPEC.md). Đây là kế hoạch trong Git, **không tự tick hoặc ghi đè Roadmap Supabase Production**.

- [x] **D0 — Bản đặc tả:** wireframe/copy 5 trang, 6 link nav marketing, catalog 7 nhóm tính năng, palette “Calm Slate Blue” không gradient, responsive, auth gate và QA criteria. Có nguồn Dribbble/ảnh VniTeach làm cảm hứng, không sao chép.
- [x] **D1 — Public foundation: DONE (PR #71, main `001bbfc`)**. Có palette `xcn-public` không gradient, Navbar role-aware, mega-menu 7 nhóm, Footer, 4 route placeholder trung thực, QA Chromium 360/768/1280/1920; PR CI PASS, Vercel Production READY đúng SHA và alias. Nội dung 4 trang chưa hoàn thiện, để D3–D6. Admin/Word/Slides không đổi.
- [x] **D2 — Trang chủ (CODE + CI/Chromium PASS, PR #73, chưa deploy):** hero hệ sinh thái, catalog có trạng thái available/building/planned, kiến trúc liên kết module, vai trò, showcase, bảng giá và tin tức preview, CTA auth chỉ khi dùng thật.
- [x] **D3 — Giới thiệu (CODE + CI/Chromium PASS, PR #73, chưa deploy):** xây route /gioi-thieu và 7 section minh bạch về sản phẩm, đối tượng, hệ sinh thái và lộ trình.
- [x] **D4 — Bảng giá (CODE + CI/Chromium PASS, PR #73, chưa deploy):** route /bang-gia, ba nhóm Khám phá/Giáo viên/Trường học; so sánh/FAQ/CTA. **Không công bố giá giả hay bật billing khi chưa phê duyệt chính sách.**
- [ ] **D5 — Tin tức (CODE UI, chờ QA & nguồn CMS):** route /tin-tuc, topic filter/search, article cards/empty-state, published-only content; không có bài/dữ liệu giả.
- [ ] **D6 — Liên hệ (CODE UI, chờ QA & kênh tiếp nhận):** route /lien-he, kênh thực đã xác minh; form chỉ khi có backend/anti-spam/privacy đúng và đầu nhận đã được phê duyệt.
- [ ] **D7 — QA / release (đang kiểm, chưa phát hành):** Chrome responsive, keyboard, WCAG AA, auth/permission deep-link, SEO, CI/build, Vercel READY và SHA khớp.
- [ ] **Gates thông tin thực:** trước D4 phê duyệt bảng giá/feature entitlement; trước D5 duyệt nguồn tin; trước D6 xác minh email/social/cơ chế nhận form. Không biến các ý tưởng thành tính năng công bố.

**Quy tắc làm việc:** chỉ đọc [INDEX.md](INDEX.md) → đặc tả PUBLIC-WEB và file code liên quan; ghi DONE/IN PROGRESS/BLOCKED trong [WORKLOG_AND_RULES.md](WORKLOG_AND_RULES.md) sau từng phase.

---

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


## Backlog — Điều hướng sản phẩm và quản lý phòng máy (chỉ ý tưởng, 31/10/2026)

> **TRẠNG THÁI: ĐÃ GHI Ý TƯỞNG, CHƯA THỰC HIỆN.** Không sửa Navbar hiện tại, không đăng ký DNS, không tạo agent, API/DB/role/quyền trên Production hoặc staging. Nguồn chuẩn chi tiết: [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md) mục 2A; nguồn so sánh: [WEBSITE_REFERENCES.md](WEBSITE_REFERENCES.md).

### Hướng tổ chức trang chủ (chưa duyệt UI)

- [ ] Cân nhắc Navbar **Khóa học · Thực hành · Kiểm tra · Công cụ · Tài nguyên · Dự án · Giáo viên**, logo dẫn về Trang chủ; nút phải `Đăng nhập` / `Không gian của tôi` theo role.
- [ ] Gắn submenu rõ ràng theo chức năng, phân biệt link đang có với ứng dụng sắp phát triển, không đặt link chết/đăng sai nhãn hoạt động. Mobile dùng menu thu gọn theo nhóm; desktop không quá dày.
- [ ] Giữ route đang hoạt động `/khoa-hoc`, `/student/quiz`, `/cong-cu`, `/cong-cu/trinh-chieu`, `/cong-cu/mo-phong-word` và các anchor đã tồn tại cho đến khi có UI/SEO migration.
- [ ] Khi thiết kế UI thật, đọc [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md), rà độ rộng/chiều cao 360/768/1280 và phân quyền trước khi sửa `src/config/navigation.ts`.

### Công cụ quản lý phòng máy Tin học (LAB-MANAGER) — P3, chưa phát triển

- [ ] Nghiên cứu nhu cầu của phòng Tin học 30–50 máy; tạm hiểu “NetSP” là **NetSupport School**, xác minh lại tên tham khảo trước giai đoạn thiết kế sâu.
- [ ] Thiết kế sơ đồ phòng, vị trí/chỗ ngồi, trạng thái máy online/offline, ca học và gắn với lớp của Teacher Studio.
- [ ] Nghiên cứu phát màn hình giáo viên, hiển thị thumbnail máy học sinh, gửi URL/file bài tập, thu bài, nhắn tin và hỗ trợ từng máy.
- [ ] Nghiên cứu giới hạn truy cập web/app, khóa màn hình và điều hành thiết bị **chỉ trong môi trường học được phép**, có thông báo/chính sách rõ.
- [ ] Đánh giá mô hình agent cài ở thiết bị (LAN/Windows), đăng ký chứng chỉ thiết bị, phân quyền theo giáo viên-phòng-ca, audit, consent, chống điều khiển trái phép và rủi ro riêng tư học sinh.
- [ ] Khi có yêu cầu phát triển: thí điểm **chỉ sơ đồ phòng và trạng thái máy**, staging riêng; chức năng remote monitoring/control phải qua đánh giá bảo mật/pháp lý và phê duyệt tách biệt. Không tự triển khai chỉ vì ý tưởng đã được ghi.

**Vị trí sản phẩm tương lai:** người khám phá tại `Công cụ → Quản lý phòng máy` (chỉ hiện khi có chức năng thật); giáo viên sử dụng từ `Teacher Studio → Phòng máy`. Tên miền `lab.xuongcongnghe.net` chỉ là ví dụ quy hoạch, chưa xác minh DNS/sở hữu. Không thay thế hay sao chép NetSupport School.

---

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
