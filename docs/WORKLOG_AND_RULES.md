# Xưởng Công Nghệ — Quy tắc và nhật ký thay đổi

> **Bắt buộc:** đọc trước khi triển khai một yêu cầu mới; ghi thêm mục sau khi hoàn thành. Giữ nguyên lịch sử cũ, không ghi đè. Bổ sung kết quả triển khai thực tế sau khi xác minh.

## I. Quy tắc cố định

1. **Màu nhận diện:** navy `#04122D` (chữ/nền tối), blue `#005BFD` (CTA), cyan `#00E9FD` (điểm nhấn trên navy), ice `#F0F6FD` (nền phụ), white `#FFFFFF` (neutral). Không dùng lime.
2. **Tương phản:** blue phải đi với chữ trắng; cyan dùng chữ navy hoặc làm chữ trên navy; không dùng cyan làm chữ trên trắng. Màu đỏ/xanh lá chỉ dùng cho ý nghĩa trạng thái.
3. **Bố cục:** tối giản; responsive theo nội dung và `clamp()`, `xcn-container` thống nhất; không scroll-snap trang chủ. Hệ trình chiếu có layout fullscreen riêng.
4. **Phạm vi:** chỉ sửa chức năng được yêu cầu; không đụng dữ liệu, Auth hoặc Supabase ngoài phạm vi. Không sao chép trang tham khảo.
5. **Kiểm thử:** kiểm tra 360px/768px/1280px, keyboard focus, `pnpm test`, `pnpm typecheck`, `pnpm build`; nếu chưa chạy, ghi rõ chưa xác minh.
6. **Release:** Repo `huunghia160699/xuong-cong-nghe`, branch `main`. Khi được yêu cầu triển khai, đưa commit chính xác lên Vercel Production project `xuong-cong-nghe`; chỉ thông báo online khi `READY`, domain chính được gán và SHA bằng GitHub.
7. **Nhật ký sau mỗi nhiệm vụ:** ghi ngày, mục tiêu, file đã sửa, quyết định/quy tắc, kiểm thử, commit, tình trạng Vercel, các vấn đề còn lại; cập nhật `CHANGELOG.md` khi có đổi UI hoặc hành vi.

## II. Mẫu ghi mục mới

### YYYY-MM-DD — Tiêu đề nhiệm vụ
- **Mục tiêu:**
- **Thay đổi và file:**
- **Quyết định / tiêu chuẩn:**
- **Kiểm thử:**
- **GitHub commit:**
- **Vercel Production:** READY / PENDING / FAILED; URL & SHA
- **Tồn đọng:**

## III. Lịch sử

### 2026-10-27 — Chuẩn bị kiểm thử RLS bằng JWT thật cho Admin và Student
- **Preflight read-only production:** migration `20261026163500_admin_roadmap` đã áp; bảng `admin_roadmap` tồn tại, bật RLS, ba policy Admin đúng cấu trúc, bảng có 0 hàng; Auth có 0 user và profiles có 0 hàng; anon không SELECT; authenticated SELECT/INSERT/UPDATE nhưng không DELETE/TRUNCATE; tài khoản thông thường không thể UPDATE `profiles.role`.
- **Công cụ kiểm thử:** `scripts/verify-roadmap-rls.mjs` dùng hai client độc lập, đăng nhập Supabase Auth bằng mật khẩu và xác nhận phiên JWT thật, kiểm tra role, anon và khả năng đọc của hai vai trò. Chế độ mặc định chỉ đọc. `--write` **chặn project production** và đòi hai cờ xác nhận trên DB thử nghiệm riêng.
- **Tài liệu vận hành:** `docs/ADMIN_ROADMAP_REAL_JWT_TEST_PLAN.md` hướng dẫn tạo hai tài khoản qua Authentication, xác minh email, cấp quyền Admin chỉ qua SQL chủ dự án, chạy suite cục bộ mà không chia sẻ mật khẩu/token.
- **Test:** `tests/admin-roadmap-real-jwt-harness.test.mjs` kiểm tra cấu hình, cấm service_role, guard production write, role-verified mock flow và fail-closed. Mock/CI test KHÔNG được xem là bằng chứng RLS JWT thật.
- **Giới hạn công cụ:** Supabase connector trong phiên hiện hỗ trợ SQL/schema nhưng **không có action quản trị Auth user**; chưa tạo hai tài khoản, chưa chạy test JWT thật. Không chèn trực tiếp `auth.users`, không thay đổi quyền production, không cấu hình Vercel, không bật Live.

### 2026-10-27 — Rà soát migration Admin Roadmap trước production
- **Mục tiêu:** Kiểm tra schema, quyền truy cập và RLS của `supabase/migrations/20261026163500_admin_roadmap.sql`, KHÔNG áp DB production.
- **Đối chiếu PostgreSQL thực:** kết nối SQL ổn định, `public.profiles` đã bật RLS; `profiles.role` là enum có student/teacher/admin; `authenticated` đọc được profiles nhưng không có quyền UPDATE `profiles.role`; `admin_roadmap` chưa tồn tại; Supabase Auth chưa có tài khoản thật.
- **Sửa file SQL trên nhánh review:** `CREATE TABLE` không bỏ qua sự khác biệt schema; `CHECK` giới hạn đúng một tài liệu `global-master-roadmap`; ràng buộc JSON mảng/version dương; thu hẹp GRANT và bật RLS; SELECT/INSERT/UPDATE chỉ cho authenticated có role admin, yêu cầu `updated_by=auth.uid()` khi ghi; không thêm DELETE policy hoặc SECURITY DEFINER.
- **Security Advisor:** `public.is_admin()` hiện được public/anon gọi dưới SECURITY DEFINER và đã bị Supabase cảnh báo. Hàm đang được bảng profiles dùng; không tự thay đổi trong đợt này. Đã ghi nguy cơ cần review riêng.
- **Tài liệu:** `docs/ADMIN_ROADMAP_MIGRATION_SECURITY_REVIEW.md`, kiểm tra read-only và checklist bắt buộc trước khi áp production; cập nhật liên kết trong README/ROADMAP.
- **Kiểm thử:** `tests/admin-roadmap-migration-security.test.mjs` kiểm tra hợp đồng SQL tĩnh; chạy CI để xác minh. Chưa chạy migration trên staging và chưa kiểm thử bằng JWT Admin/student thật; tuyệt đối không báo RLS Live đã đạt.
- **GitHub:** nhánh `security/review-admin-roadmap-migration-20261027`. Pull Request và CI cập nhật sau.
- **Production/Vercel:** KHÔNG chạy migration, KHÔNG thay đổi env, KHÔNG bật Live, không chỉnh hồ sơ người dùng.

### 2026-10-26 — Đầu việc tiếp theo P0: sao lưu & khôi phục Roadmap Admin
- **Lựa chọn theo Roadmap:** trước Teacher Studio/Live Quiz, tiếp tục `admin-center` với lưu an toàn, kiểm soát thay đổi và hồi phục khi mất dữ liệu.
- **Đã bổ sung mã:** `src/features/admin/roadmap-history.ts` giữ tối đa 6 snapshot cục bộ hợp lệ, tổng tối đa 1,6 MB; `roadmap-history-panel.tsx` giao diện danh sách + tạo/khôi phục/tải JSON/xóa; `roadmap-board.tsx` tạo checkpoint trước khi xóa mốc/nhập JSON/khôi phục bản nháp; điều chỉnh thao tác Demo không được nhận là thành công nếu localStorage thất bại; CSS responsive.
- **Đã bổ sung test:** `tests/admin-roadmap-history.test.mjs` bao phủ dữ liệu copy bất biến, dedup, giới hạn và xóa vòng tròn, reject dữ liệu hỏng/trùng, các hành động trên giao diện. CI xác minh riêng sau khi tạo PR.
- **Sự cố Supabase xác định lại:** project `bpxwpfmjoojrgqlfkqgz` phản hồi ACTIVE_HEALTHY nhưng `list_tables` thất bại `28P01 password authentication failed for supabase_read_only_user`, `list_migrations` thất bại cùng lỗi cho `postgres`. **Không thay đổi mật khẩu production**, không chạy migration khi xác thực đang hỏng, không bật Live. Cần kiểm tra credential của kết nối DB trong Supabase dashboard và làm mới tích hợp quản trị; chỉ xác nhận hoàn thành khi query, migration, RLS và hai tài khoản khác vai trò đều đạt.
- **Giới hạn:** snapshot chỉ là bản sao lưu trên trình duyệt, không thay cho sao lưu DB/đa thiết bị. Không mở rộng sang module giáo dục mới.
- **GitHub:** nhánh `feat/admin-roadmap-backup-history-20261026`; commit/deploy cập nhật theo CI.

### 2026-10-26 — Sửa header xuống dòng
- **Yêu cầu:** Header của Xưởng Công Nghệ phải cao một hàng, tên website không xuống dòng.
- **Thay đổi:** `brand.tsx` cấm wrap wordmark và icon không bị co; `public-header.tsx` bổ sung menu `details/summary` khi hẹp; `globals.css` bỏ quy tắc biến navigation thành hàng thứ hai và đặt responsive breakpoint 1120px/440px.
- **Kiểm thử:** `tests/public-header-single-row.test.mjs` xác minh không wrap, chuyển menu, và nút đăng nhập/đăng ký trong mobile. CI build/typecheck/smoke theo nhánh.
- **Phạm vi:** Không sửa Word/Excel, Admin/Roadmap hoặc thay logic định tuyến.

### 2026-10-26 — Củng cố đầy đủ cơ chế lưu và kiểm thử Admin Roadmap (PR #47)
- **Mục tiêu:** Tiếp tục hoàn thiện Admin/Roadmap, không mở thêm phân hệ giáo dục mới. Thử lại kết nối Supabase và kiểm thử nhiều tình huống lỗi.
- **Cập nhật:** `roadmap-validation.ts` làm bộ kiểm tra dữ liệu chung cho frontend/API; `roadmap-draft.ts` lưu bản nháp v3 có baseVersion/pending, có thể đọc dữ liệu v2. `roadmap-board.tsx` phân biệt bản mới trên máy chủ với thay đổi chưa đồng bộ, hiển thị lựa chọn khôi phục/bỏ bản nháp, ghi lại trạng thái chưa đồng bộ và sửa nhật ký; thêm hạn dự kiến và người phụ trách cho mốc lớn; duy trì trạng thái Done đúng với checklist và xử lý roadmap trống.
- **Kiểm thử:** Bổ sung test validate/import/draft recovery và API mô phỏng cho Demo, 401, 403, CAS 409, 400 invalid, 413 quá dung lượng, tạo/đọc/cập nhật. GitHub Actions được kiểm tra trên từng commit; chạy lại sau khi xử lý TypeScript/Test. Không coi test giả lập là bằng chứng RLS production.
- **Tình trạng kết nối:** Supabase project báo ACTIVE_HEALTHY, nhưng các lời gọi `list_tables`, `list_migrations`, `execute_sql select 1` vẫn bị connection timeout, giống đợt trước. Vercel production chưa bật Live và thiếu cấu hình công khai cho Supabase. **Migration/RLS và đồng bộ đa thiết bị chưa được kiểm chứng trực tiếp**; tuyệt đối không bật Live trước kiểm thử thật.
- **Phạm vi:** Không tạo phòng quiz, bài học, bảng giáo viên hoặc học sinh; không thay đổi dữ liệu người dùng; chỉ sửa Admin/Roadmap, kiểm thử và tài liệu.
- **GitHub:** PR #47, nhánh `fix/admin-roadmap-reliability-20261026`; mã commit sản phẩm và Vercel ghi lại khi hợp nhất xong.
- **Việc còn lại:** Cần Supabase hoạt động và kiểm thử admin/non-admin + demo/live; kiểm thử trực quan click thực tế qua browser trên 360/768/1280 và nhiều tab.

### 2026-10-26 — Admin toàn hệ thống, Sitemap và Roadmap tương tác theo timeline
- **Mục tiêu:** Chỉ tập trung hoàn thiện trung tâm Admin và Roadmap trước khi mở rộng các phân hệ khác; chuyển master plan ưu tiên Tin học thành checklist quản trị thực tế.
- **Thay đổi:** `src/app/admin/page.tsx` và `src/features/admin/components/admin-overview.tsx` tạo trung tâm điều hành; `/admin/roadmap` và `roadmap-board.tsx` có timeline đường chấm, mốc lớn, việc nhỏ, ghi chú thay đổi, tìm kiếm/lọc/sắp xếp và xuất/import; `/admin/sitemap`, `admin-sitemap.ts` phân biệt các route hiện hữu/dự kiến; `admin.css` thiết kế responsive; sidebar sử dụng các route có thật.
- **Tài liệu:** `docs/XCN_SITEMAP_2026_2028.md` (Mermaid và route matrix), `docs/XCN_FUNCTION_ROADMAP_CHECKLIST.md` (20 mốc, 115 việc nhỏ), liên kết trong `docs/ROADMAP.md` và README.
- **Quyết định dữ liệu:** Demo dùng localStorage cục bộ và xuất/nhập backup; Live API `/api/admin/roadmap` kiểm tra session + `profiles.role='admin'`, dùng bảng `admin_roadmap` với RLS và optimistic version để chống ghi đè. Khi Supabase lỗi, giao diện nêu rõ chưa đồng bộ và lưu bản nháp cục bộ, không hứa ghi DB.
- **Supabase:** project đã được xác định, nhưng kết nối SQL từ công cụ quản trị liên tục timeout, kể cả `apply_migration`; SQL `supabase/migrations/20261026163500_admin_roadmap.sql` **đã commit nhưng chưa xác nhận áp dụng**. Không được đánh dấu Live persistence hoàn tất khi chưa chạy migration và kiểm thử admin/non-admin.
- **Kiểm thử:** `tests/admin-roadmap.test.mjs` kiểm tra dữ liệu roadmap, cấu trúc UI, schema RLS, API và sitemap; GitHub Actions đang kiểm tra toàn repo (test/typecheck/build/smoke). Chưa đo thiết bị mobile thực tế hoặc test E2E bằng trình duyệt.
- **GitHub:** PR #46, nhánh `feat/admin-roadmap-sitemap-20261026`. Commit cuối và trạng thái CI/Production cập nhật theo thực tế khi hoàn tất.
- **Phạm vi:** Không xây Teacher Studio, quiz real-time, Python/SQL hay thay đổi chức năng Word hiện có trong đợt này.

### 2026-10-26 — Tái lập kế hoạch hệ sinh thái giáo dục Xưởng Công Nghệ
- **Yêu cầu:** Nghiên cứu mô hình dethiso.vn/teacher/dashboard và lập kế hoạch chi tiết hơn cho Xưởng Công Nghệ theo hướng nền tảng giáo dục lớn.
- **Nguồn tham khảo:** Trang chủ và tài liệu công khai dethiso.vn (soạn đề Word, quản lý lớp, thi online, đấu trường, ngân hàng câu hỏi, báo cáo); dashboard bên trong tài khoản không truy cập được từ nguồn công khai, nên không nhận là đã kiểm thử UI riêng tư.
- **Thay đổi và file:** Tạo `docs/XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md` làm master plan đề xuất (15 chương, 4 sản phẩm, 12 nhóm module, IA, quy trình, kiến trúc, bảo mật, backlog, mốc MVP/KPI, 7 chặng); liên kết tài liệu trong `docs/ROADMAP.md`.
- **Quyết định:** Teacher Studio + Student Hub + School Manager + Content Library trên một nền chung; tái sử dụng nền Word/Excel/slide/quiz hiện có. Giải pháp đầu tiên là lớp + question bank + exam/assignment + live quiz học sinh dùng điện thoại; game phức tạp, AI và marketplace làm sau, không phát triển đồng thời.
- **Kiểm thử:** Đọc mã nguồn cấu trúc và xác nhận GitHub lưu tài liệu; không chạy `pnpm test`, `pnpm typecheck`, `pnpm build` vì không sửa mã runtime. Các thông số chất lượng mới là mục tiêu kế hoạch, chưa đo.
- **GitHub:** master plan `7ecf9168184a233fb9d411dd84d0e8cee71aa43e`; roadmap link `f1d57f9a70e57d4d5aad50744359c0db397efe7b`.
- **Vercel Production:** Không triển khai phiên bản ứng dụng mới cho nhiệm vụ tài liệu.
- **Tồn đọng:** Cần kiểm toán môi trường Supabase/production, xác định nguồn lực thực tế, chốt wireframe và pilot giáo viên trước khi triển khai các module mới.

### 2026-10-26 — Ghi nhận tính năng Live Quiz chờ làm; nghiên cứu dethiso.vn
- **Mục tiêu:** Theo yêu cầu, chỉ ghi tính năng GV tạo phòng, HS tham gia bằng mã và trả lời trên điện thoại vào file Markdown để thực hiện sau; nghiên cứu dethiso.vn làm tham khảo.
- **Thay đổi và file:** Bổ sung backlog giai đoạn 1 và 2, tiêu chí nghiệm thu, an toàn, đường dẫn tài liệu tham khảo vào `docs/ROADMAP.md`. Không chỉnh sửa mã ứng dụng, không tạo database hay phòng thi thật.
- **Quyết định:** Ưu tiên Live Quiz do giáo viên điều khiển; thiết bị học sinh trả lời trực tiếp thay vì quét thẻ giấy. Tham khảo quy trình phòng chờ, mã PIN, trả lời và báo cáo từ tài liệu công khai của dethiso.vn; không sao chép giao diện/mã nguồn hoặc coi số liệu marketing là kiểm chứng.
- **Kiểm thử:** Chỉ chỉnh sửa tài liệu, xác nhận cập nhật GitHub; chưa chạy `pnpm test/typecheck/build` vì không sửa runtime.
- **GitHub commit:** `56576881c9c6d003c2a0c9cabdf694ad192b8d1e` (Roadmap).
- **Vercel Production:** Không triển khai ứng dụng vì chỉ thêm yêu cầu chờ làm.
- **Tồn đọng:** Chưa thiết kế kỹ thuật chi tiết, chưa triển khai và chưa kiểm tra với lớp học.

### 2026-10-26 — Menu Line Spacing giống ảnh Word
- **Yêu cầu:** Menu Line Spacing giống Microsoft Word: sáu hệ số giãn dòng, Options..., lệnh thêm/bỏ cách đoạn; không dùng dropdown native.
- **Thực hiện:** `word-split-button.tsx` bổ sung variant popup menu HTML 264px, mục đã chọn, đường phân cách và keyboard; `word-split-ribbon.css` điều chỉnh menu/đối thoại; `word-home-ribbon.tsx` chứa icon, nhãn ngữ cảnh và liên kết lệnh; `word-line-spacing-dialog.tsx` là dialog tự dựng; `word-simulator.tsx` đồng bộ style, cho giãn dòng 2.5/3.0, thêm/bỏ khoảng cách và áp dụng đồng thời giãn dòng/đoạn.
- **Kiểm thử:** `tests/word-line-spacing-menu.test.mjs` và các test ribbon/paragraph hiện có; chờ CI kiểm tra typecheck/build trước khi merge.
- **Phạm vi:** Không thay logic phân trang, dấu ¶, Ctrl+Enter, Font, căn lề. Chưa xác minh thao tác trực quan trên Windows/UniKey.
- **GitHub:** PR #45 — `feat/word-line-spacing-menu-20261026`.
- **Production:** chỉ triển khai sau khi CI thành công.

### 2026-10-19 — Chuẩn hóa giãn dòng và giãn đoạn Word
- **Triệu chứng:** Một lần Enter tạo khoảng cách dọc gần 38px vì editor 16px × 1.55 line-height + 13px margin-bottom, trong khi đổi Line Spacing chỉ áp dụng được một đoạn.
- **Sửa:** `word-simulator.css` đặt mặc định 1.15 line-height, 8px cách sau đoạn; `word-simulator.tsx` áp dụng line spacing và before/after spacing cho tất cả đoạn giao vùng bôi chọn, với fallback đoạn tại con trỏ; `word-home-ribbon.tsx` thêm tùy chọn trước/sau đoạn 0/6/12/18px trong menu giãn dòng và hộp thoại Paragraph.
- **Tính bền vững:** Bộ lọc `sanitize` cho phép `margin-top` theo danh sách giá trị số px an toàn như `margin-bottom`, vì vậy định dạng giãn đoạn không mất khi lưu/khôi phục. Không sửa DOM dấu ¶ hoặc các wrapper phân trang.
- **Kiểm thử:** Bổ sung kiểm thử mặc định CSS, selection nhiều đoạn, cách trước/sau và lưu định dạng; cập nhật các kiểm thử source contract liên quan. GitHub CI được kiểm tra trước khi nhập nhánh vào main. Chưa kiểm tra thủ công Chrome Windows/UniKey.
- **GitHub:** nhánh `fix/word-line-paragraph-spacing-20261019`, PR #44.
- **Vercel Production:** chưa triển khai trước khi merge.

### 2026-10-19 — Đồng bộ dấu ¶ với kích cỡ chữ và con trỏ; lề chọn dòng dùng mũi tên
- **Ảnh phản hồi:** dấu ¶ của đoạn rỗng và đoạn có chữ có cỡ nhỏ cố định, thay đổi vị trí theo nội dung; người dùng yêu cầu ¶ ở đúng cuối dòng và cùng cỡ với chữ/con trỏ nháy. Lề chọn dòng không được đổi sang bàn tay `pointer` hoặc tô nền hover.
- **Nguyên nhân:** `word-home-ribbon.css` dùng `font:12px Georgia` áp vào pseudo `p::after` bất kể cỡ chữ thực tế; đoạn rỗng `p:has(>br:only-child)::after` dùng `left:3px;top:2px` cố định, không tỉ lệ với cỡ chữ. Khi chữ cuối nằm trong thẻ inline có `font-size` khác phần tử p, pseudo không kế thừa trực tiếp cỡ chữ. CSS `.wsl-word-selection-gutter` vẫn `cursor:pointer` (bàn tay).
- **Sửa hiển thị:** `word-home-ribbon.css` cho dấu ¶ dùng font-size `var(--wsl-paragraph-mark-size,1em)`, font family kế thừa, theo baseline chữ cuối. Đoạn rỗng vẫn giữ <br> làm chỗ đứng caret, nhưng dấu ¶ là pseudo absolute `top:50%; transform:translateY(-50%); inset-inline-start:.3em` trên cùng line box, không can thiệp DOM/con trỏ. Các heading h1/h2 dùng quy tắc chung.
- **Sửa đồng bộ cỡ chữ:** Thêm `word-paragraph-marks.ts` lấy cỡ chữ qua computed style của text node cuối trong p/h1/h2, kể cả span định dạng đang chờ nhập với ZWSP, cập nhật một CSS custom property chỉ khi thay đổi; gọi sau phân trang, khi bật/tắt ¶, gõ chữ và đổi Font Size. Không tạo caret giả: caret native vẫn đứng bên trong span mang font-size thực (logic `createPendingFontFormat`) và tự tăng/giảm theo chữ.
- **Chọn dòng:** Đổi `.wsl-word-selection-gutter` từ `cursor:pointer` sang `cursor:default` (mũi tên), giữ `background:transparent`, bỏ hover và giữ pointer capture để nhấp/kéo chọn dòng.
- **Kiểm thử:** `word-paragraph-marks.test.mjs` kiểm tra cỡ 8,10,12,14,18,24,36pt, đoạn trống, span định dạng chờ 36pt, heading và không sửa DOM; `word-pagination.test.mjs`, `word-line-selection.test.mjs` xác nhận pseudo baseline, không còn fixed 12px/3px/2px, lề default arrow. Chạy 4 bước CI và Vercel Production READY cùng SHA.
- **Giới hạn:** Chưa có kiểm tra gõ thực tế bằng Windows/UniKey và cỡ chữ hỗn hợp trên trình duyệt; không khẳng định đã nghiệm thu trực quan.

### 2026-10-19 — Sửa con trỏ rơi ra ngoài lề trái trang A4 sau ngắt trang
- **Ảnh lỗi người dùng:** con trỏ đen ở x≈150 ngay sát biên trái của tờ A4, trong khi dấu ¶ ở x≈244 theo lề soạn thảo; gõ vào vị trí này có nguy cơ tạo nội dung nằm bên ngoài các `.wsl-document-page`.
- **Nguyên nhân:** Mô hình một `contentEditable` chứa nhiều block wrapper `.wsl-document-page` cho phép Chrome đặt collapsed Range tại chính editor root hoặc page wrapper, không phải trong một `<p>`. `restorePageSelection` có thể giữ nguyên Range root (offset vẫn hợp lệ) khi phân trang, dẫn tới caret nằm ngoài padding A4. Các lần sửa CSS ¶/Page Break trước không giải quyết được lỗi Range này.
- **Sửa:** `word-pagination.ts` thêm `ensureWordCaretInsideParagraph(root,preferred?)`: nếu vùng chọn collapsed ở root hoặc page wrapper thì tạo Range trong đoạn văn tương ứng (hoặc đoạn đầu hợp lệ), nhưng **không can thiệp** selection có chữ đã bôi chọn hoặc caret hợp lệ trong `p/h1.../li/td`. Chạy bảo vệ trước và sau auto pagination, cả nhánh fast-path một trang; trước ngắt trang thủ công. `word-simulator.tsx` thêm bảo vệ khi focus, trước input/keyDown và khi nhấn Ctrl+Enter/Insert Ngắt trang. Không thêm `p` và không sửa CSS/margin A4, giữ nguyên ký hiệu ¶ và kiểu Page Break.
- **Kiểm thử:** `tests/word-pagination.test.mjs` thêm mô phỏng collapsed selection ở root/page wrapper, yêu cầu chuyển vào đúng `<p>` và offset 0, bỏ qua caret hợp lệ/vùng bôi chọn, xác nhận hook trong input/pagination/shortcut. Chạy CI Unit, Typecheck, Build, Smoke; Vercel Production READY trùng main SHA mới báo.
- **Giới hạn:** Chưa có E2E Chrome Windows thực tế, chưa khẳng định mọi hành vi contentEditable/phân trang ổn định. Đặc biệt cần kiểm tra trực quan sau Ctrl+Enter và sau gõ nhiều dòng.

### 2026-10-19 — Hiện đường Page Break như Microsoft Word và tự cuộn khi chuyển trang
- **Yêu cầu (ảnh mẫu):** Ctrl+Enter tạo dấu ngắt trang có một đường chấm ngang, dòng chữ `Page Break` nằm giữa và `¶` lớn ở mép phải. Sau khi chuyển trang phải tự cuộn vùng soạn thảo đến đầu trang mới, con trỏ có sẵn để gõ tiếp.
- **Nguyên nhân chưa đạt:** `word-simulator.css` trước đó đặt `.wsl-document-page [data-wsl-manual-break]{display:none!important}` nên dấu ngắt đã tồn tại dưới dạng `<hr data-wsl-manual-break>` nhưng không hiển thị. Sau `insertManualWordPageBreak`, editor chỉ gọi `markChanged()`; effect phân trang không di chuyển scroll container đến trang chứa caret.
- **Sửa:** `word-simulator.css` trình bày marker HR bằng repeating-linear-gradient chấm 1px với chữ `Page Break` chính giữa, ¶ tại đầu cuối bên phải. Chỉ hiển thị khi chỉnh sửa, ẩn đường kẻ/¶ khi in vì trang đã có page-break CSS. `word-pagination.ts` phục hồi contentEditable=false cho marker đã khôi phục từ bản nháp và thêm `scrollWordPageIntoView(scroller,page)` dùng DOM rectangles đã tính cả zoom, giới hạn scrollTop trong viewport. `word-simulator.tsx` thêm ref vùng scroll, ref target đoạn ngay sau Ctrl+Enter, resolve trang mới **sau** `paginateWordEditor` rồi scroll mượt trong `.wsl-page-scroll`. Khi nội dung tự chảy sang trang tiếp theo trong lúc editor đang có focus cũng tự cuộn; cập nhật `Trang hiện tại / Tổng trang`. Nút Insert → Ngắt trang và Ctrl+Enter cùng sử dụng cơ chế.
- **Kiểm thử:** `tests/word-pagination.test.mjs` kiểm tra marker dotted, nhãn chính giữa, ¶ phía phải, không in marker, thuộc tính HR noneditable, Ctrl+Enter, Insert command, effect repagination rồi cuộn, scroll zoom 60–200% và giới hạn scrollTop. Chạy Unit tests, Typecheck, Production build, Smoke test, triển khai Vercel READY đúng SHA.
- **Giới hạn:** Chưa thao tác E2E trên Chromium Windows để xác nhận hình thức đúng từng pixel và khả năng cuộn khi browser dùng IME/zoom; không nói đã trực quan nghiệm thu nếu chưa kiểm tra.

### 2026-10-18 — Fix ký hiệu ¶ nhảy xuống dòng dưới con trỏ ở đoạn trống
- **Ảnh người dùng:** con trỏ đứng ở dòng thứ nhất, ký hiệu ¶ xuất hiện ở dòng thứ hai; ngay khi gõ chữ, ¶ nhảy ngược lên cạnh chữ, không giống Word. Đây là lỗi *render ký hiệu paragraph mark*, không phải bằng chứng có thêm một đoạn trống thật.
- **Nguyên nhân gốc:** CSS `word-home-ribbon.css` sử dụng `.wsl-editor.show-paragraph-marks p:after{content:" ¶"}`; đoạn rỗng có DOM `<p><br></p>`, ký tự BR chiếm dòng hiện tại nên ::after là nội dung sau BR và bị đẩy xuống dòng mới. Khi nhập chữ, Chromium loại BR nên ký hiệu ¶ bất ngờ lên cùng dòng.
- **Sửa có phạm vi hẹp:** Giữ ::after inline cho đoạn có chữ. Với `p:has(>br:only-child)` đặt `position:relative` lên đoạn và `::after{content:"¶";position:absolute;left:3px;top:2px;pointer-events:none}` để ký hiệu ¶ của đoạn trống luôn nằm cạnh caret trên cùng một dòng. Không xóa BR (để tránh mất caret), không chèn/kéo node, không can thiệp auto pagination/Enter hay nhúng keyboard handler.
- **Kiểm thử:** `tests/word-pagination.test.mjs` bổ sung regression xác nhận ký hiệu đoạn không rỗng vẫn inline, đoạn `<p><br></p>` sử dụng pseudo tuyệt đối trên dòng đầu, con trỏ không bị pseudo chặn; giữ nguyên tất cả test phân trang. Chạy CI bốn bước và Vercel Production READY trùng GitHub main SHA.
- **Giới hạn:** Đây là sửa CSS dựa trên ảnh và DOM source, chưa chụp nghiệm thu trực tiếp trong Windows Chromium; các đoạn trống đã lưu hoặc tạo bởi nội dung khác `<p><br></p>` cần kiểm tra thêm nếu tái hiện.

### 2026-10-18 — Sửa hai dấu ¶ tự phát sinh và con trỏ nhảy dòng trong Word phân trang
- **Triệu chứng do người dùng chụp:** Với trang trống, xuất hiện hai dấu kết thúc đoạn ¶ (trông như Enter thừa). Khi đặt con trỏ và gõ chữ, dấu ¶ ở dưới bị đẩy lên hoặc vị trí nhập không còn cố định.
- **Nguyên nhân 1:** `paginateWordEditor` kiểm tra `!root.textContent?.length` rồi tự chèn `<p><br></p>` ngay cả khi editor đã chứa đoạn rỗng hợp lệ `<p><br></p>`. Vì `BR` không đóng góp `textContent`, mỗi lần phân trang lại thêm một đoạn dư.
- **Nguyên nhân 2:** Snapshot caret chỉ lưu offset bằng số ký tự; các đoạn rỗng cùng cho offset 0 nên khi dựng lại DOM, caret bị phục hồi nhầm sang đoạn/trang khác, kéo theo Paragraph Marks thay đổi vị trí.
- **Nguyên nhân 3:** Toàn bộ DOM gốc bị tháo, chèn lại dù người dùng mới nhập một chữ trên trang chưa đầy; điều đó làm mất tính ổn định native caret/undo trong `contentEditable`.
- **Sửa:** `src/features/word-simulator/word-pagination.ts` chỉ thêm đoạn mặc định khi `children.length===0`, không dùng `textContent`; `WordPageSelection` lưu tham chiếu `startNode/endNode` và offset để restore trực tiếp nếu DOM nodes vẫn còn; chỉ dùng phép đếm ký tự khi cấu trúc đã cắt/split node. Thêm fast-path trang đơn còn chỗ trống để bỏ qua repagination và không chạm DOM/con trỏ khi nhập chữ bình thường. Giữ lại Ctrl+Enter, trộn định dạng inline, các trang A4.
- **Kiểm thử hồi quy:** `tests/word-pagination.test.mjs` mới dùng vm mô phỏng phân trang tài liệu đúng một `<p><br></p>`, bảo đảm không tạo thêm đoạn trống qua 2 lần phân trang và không tháo DOM ở lần thứ hai; mô phỏng hai đoạn rỗng có cùng text offset 0, vẫn giữ con trỏ tại đoạn thứ hai. Chạy toàn bộ Unit tests, Typecheck, Build, Smoke.
- **Giới hạn:** Chưa trực tiếp nghiệm thu trong browser Windows/UniKey; dữ liệu bản nháp đã lưu từ phiên bản lỗi có thể chứa Enter thừa thật, không được tự động xóa vì tránh làm mất đoạn trống người dùng chủ động tạo.
- **Triển khai:** Chỉ xác nhận thành công khi GitHub CI và Vercel Production READY cùng SHA main.

### 2026-10-18 — Bỏ nền hover ở lề trái chọn dòng Word
- **Theo ảnh:** Khi rê chuột vào vùng lề trái để chọn dòng, phần lề bị tô xanh nhạt thành một cột lớn, gây mất thẩm mỹ.
- **Sửa:** Xóa duy nhất quy tắc `.wsl-word-selection-gutter:hover{background:rgba(0,91,253,.035)}` trong `src/features/word-simulator/word-simulator.css`. Vùng chọn tiếp tục có `background:transparent`, `cursor:pointer`, `touch-action:none` và xử lý nhấp/kéo để chọn dòng.
- **Kiểm thử:** Mở rộng `tests/word-line-selection.test.mjs` xác nhận gutter trong suốt, không có lớp nền hover, các pointer event vẫn hoạt động. Chạy Unit tests, Typecheck, Production build, Smoke routes trước khi deploy.
- **Giới hạn:** Chưa nghiệm thu trực quan với trình duyệt của người dùng.

### 2026-10-18 — Hotfix trang A4 chồng lên trang trắng sau khi phân trang
- **Triệu chứng có ảnh xác nhận:** Tờ giấy trắng nằm sau tại góc (x≈43, y≈20); tờ có nội dung bị đẩy sang phải và xuống khoảng 87×86px, xuất hiện hai trang giấy chồng nhau.
- **Nguyên nhân:** `src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx` nạp `word-page-rulers.css` SAU `word-simulator.css`. Dù stylesheet phân trang mới đã reset `.wsl-paper`, luật cũ trong `word-page-rulers.css` cùng specificity ghi đè và tái tạo padding 86/87px, nền trắng, viền, min-height A4 của chính wrapper `.wsl-paper` — trong khi mỗi trang con `.wsl-document-page` cũng có nền, kích thước và padding riêng.
- **Sửa tại nguồn override:** Reset cuối của `.wsl-word-layout .wsl-paper` và biến thể .is-landscape/.is-narrow trong `word-page-rulers.css`: `position:relative; display:block; width:var(--wsl-paper-width); height:auto; min-height:0; padding:0; margin:0; background:transparent; border:0; box-shadow:none`. Chỉ các `.wsl-document-page` mới có kích thước A4, lề, nền trắng, đường viền và khoảng cách trang.
- **Kiểm thử:** Thêm regression test `tests/word-pagination.test.mjs` xác minh THỨ TỰ import CSS, không còn padding/background/border ở wrapper trong file tải sau, và nội dung chỉ mang A4 box bên trong. Chạy CI Unit tests, Typecheck, Build, Smoke; Vercel READY trùng SHA mới được báo hoàn tất.
- **Giới hạn:** Chưa nghiệm thu trực quan trong trình duyệt Windows của người dùng; không xác nhận screenshot đã ổn nếu chưa có browser QA thực tế. Hạn chế sửa đổi trong hotfix chỉ CSS và test để tránh thay logic nhập liệu.

### 2026-10-18 — Phân trang A4 thật cho trình soạn thảo Word và Ctrl+Enter
- **Yêu cầu:** Không còn một tờ giấy dài vô hạn. Nội dung tự chuyển sang các trang A4 độc lập khi tới cuối diện tích soạn thảo; Ctrl+Enter tạo ngắt trang thủ công. Nút Ngắt trang ở tab Insert phải dùng cùng lệnh.
- **Kiến trúc:** Giữ **một** `contentEditable` chung để không phá hoàn toàn các lệnh Font/Paragraph, selection và kiểu chữ. Module mới `word-pagination.ts` phân phối các block DOM gốc vào `.wsl-document-page` cao đúng A4, rộng đúng A4, cùng lề, khoảng cách 24px, số trang bằng pseudo-element. Dòng/đoạn dài hơn chiều cao vùng nhập được cắt thành các block kế tiếp bằng DOM `Range.extractContents` giữ thẻ inline. Quá trình tự phân trang theo `requestAnimationFrame` sau khi thay đổi, tránh can thiệp giữa lúc IME gõ tiếng Việt; dùng logic lưu/khôi phục vùng chọn bằng vị trí ký tự.
- **Ngắt trang thủ công:** `Ctrl+Enter` / `Cmd+Enter` và nút Insert → Ngắt trang dùng `insertManualWordPageBreak`: tách nội dung tại con trỏ, tạo `<hr data-wsl-manual-break="true">` làm mốc ngắt, rồi đưa con trỏ tới đoạn đầu trang mới. Mốc được giữ khi sanitize/lưu nháp/xuất HTML và khi mở lại. Các `.wsl-document-page`/gutter chỉ là lớp trình bày, loại khỏi HTML lưu. Thanh trạng thái hiển thị Trang đang chọn / Tổng trang.
- **Thước & chọn dòng:** Thước ngang/dọc đo theo tờ A4 **đầu tiên** chứ không theo tổng chiều cao tài liệu; vùng chọn dòng lề trái tạo riêng cho mỗi trang và đi theo trang sau khi phân trang. Giữ zoom, hướng giấy, lề bình thường/hẹp, in nhiều trang.
- **Files:** `src/features/word-simulator/word-pagination.ts` (mới), `word-simulator.tsx`, `word-simulator.css`, `word-page-rulers.tsx`, tests cập nhật `word-line-selection.test.mjs`, `word-home-qa.test.mjs`, `presentation-basics.test.mjs`, thêm `tests/word-pagination.test.mjs`.
- **Lưu ý kỹ thuật:** Reflow DOM và cắt khối dài có thể ảnh hưởng undo/redo, composition phức tạp, bảng dài và các tài liệu rất lớn. Cần nghiệm thu trên Chromium/Windows/UniKey thực tế với 2–4 trang, undo/redo, Ctrl+Enter, định dạng hỗn hợp, copy-paste. Kiểm thử source/unit và CI không thay thế E2E. Không tuyên bố hoàn hảo khi chưa có bằng chứng.
- **Triển khai:** Chỉ deploy khi GitHub CI Unit tests, Typecheck, Production build, Smoke test thành công và Vercel READY trùng SHA main.

### 2026-10-18 — Chọn nguyên dòng bằng lề trái Word và kéo để chọn nhiều dòng
- **Yêu cầu:** Di chuột ra mép trái của vùng nhập, trong phần lề trắng trên tờ A4, nhấp chọn nguyên một dòng đang hiển thị; kéo chuột theo chiều dọc chọn toàn bộ các dòng tương ứng, giống selection margin của Word.
- **Thiết kế:** Trong `word-simulator.tsx`, thêm `div.wsl-word-selection-gutter` làm sibling nằm trước `div.wsl-editor[contentEditable]` trong `wsl-paper`. CSS position absolute đặt đúng phần padding bên trái trang, theo `--wsl-paper-top-margin` và `--wsl-paper-side-margin`, hiển thị nhẹ khi hover, cursor pointer, ẩn khi in, không đè lên nội dung nhập.
- **Tương tác:** PointerDown lấy danh sách dòng thực tế bằng `collectWordVisualLines` (sử dụng DOM Range.getBoundingClientRect cho từng ký tự, hỗ trợ đoạn xuống dòng tự động và các đoạn có định dạng nội tuyến), focus editor nhưng không cuộn rồi đặt selection trọn dòng. PointerMove theo y dưới pointer capture mở rộng/thu hẹp vùng chọn giữa anchor và dòng hiện tại theo cả hai hướng; PointerUp/Cancel giải phóng capture và lưu selection để nút BIU, Sup/Sub, Paragraph tiếp tục hoạt động. Không sửa HTML, không gọi input events, không thay thước.
- **Files:** `src/features/word-simulator/word-line-selection.ts` mới chứa bộ nhận diện/chọn dòng; `word-simulator.tsx` tích hợp sự kiện; `word-simulator.css` thêm gutter; `tests/word-line-selection.test.mjs` kiểm thử mô phỏng click một dòng, đoạn wrap nhiều dòng, inline SUP, kéo lên/xuống 10 lần, phần tử độc lập với editor, pointer capture và CSS.
- **Giới hạn:** Kiểm thử mô phỏng DOM và CI; chưa click-kéo nghiệm thu với trình duyệt Windows thật. Với tài liệu quá dài, vòng đo từng ký tự có thể gây chậm khi bắt đầu kéo, cần kiểm thử thực tế các tài liệu lớn.
- **Phát hành:** Chạy Unit tests, Typecheck, Build, Smoke. Chỉ triển khai khi CI thành công, xác minh Vercel Production READY + main SHA.

### 2026-10-18 — Kéo khối chữ nhật dưới Left Indent lên sát thân trên
- **Yêu cầu:** Ảnh người dùng cho thấy thanh chữ nhật dưới Left Indent cách phần thân phía trên khoảng 1px, cần kéo sát lên.
- **Sửa:** `src/features/word-simulator/word-page-rulers.tsx` dời nền và viền ba cạnh của khối dưới lên từ `y=9.5` đến `y=8.5`; tăng chiều cao nền từ 4px lên 5px để mép dưới vẫn ở `y=13.5`. Viền vẫn chỉ có 3 cạnh (`M.5 8.5V13.5H11.5V8.5`), không thêm border-top; không đổi viewBox 12x14, CSS, cursor pointer hoặc pointer event.
- **Kiểm thử:** Cập nhật `tests/presentation-basics.test.mjs` và `tests/word-home-qa.test.mjs` để xác nhận tọa độ liền kề, không có stroke trên `rect` hoặc đường viền trên, giữ các bài test kéo thước; CI đủ Unit tests, Typecheck, Production build, Smoke test. Triển khai Vercel đúng GitHub main SHA khi CI thành công.
- **Giới hạn:** Chưa nghiệm thu trực quan bằng trình duyệt Windows.

### 2026-10-18 — Bỏ viền trên của thanh chữ nhật dưới Left Indent
- **Yêu cầu:** Khối chữ nhật bổ sung phía dưới Left Indent không có border top; giữ nguyên ba cạnh trái, phải, dưới, hình dáng các dấu còn lại và con trỏ hover pointer.
- **Sửa:** `src/features/word-simulator/word-page-rulers.tsx` thay `<rect>` có stroke toàn bộ 4 cạnh bằng `<rect>` nền trắng không stroke và `<path d="M.5 9.5V13.5H11.5V9.5">` kẻ riêng đúng 3 cạnh. Không thay hình học SVG, các vị trí/kích thước, CSS, xử lý pointer-capture và việc dịch chuyển đoạn văn.
- **Kiểm thử:** Cập nhật `tests/presentation-basics.test.mjs` và `tests/word-home-qa.test.mjs` xác nhận không còn stroke viền trên, chỉ có đường kẻ 3 cạnh. Chạy đủ Unit tests, Typecheck, Production build, Smoke test; xác nhận SHA Production READY mới thông báo.
- **Giới hạn:** Chưa chụp/kiểm tra trực quan bằng browser Windows tại nhiều độ phân giải.

### 2026-10-18 — Thiết kế lại ba dấu trên thước, giữ pointer khi hover và kéo
- **Yêu cầu xác nhận:** Left Indent phải có cùng đầu nhọn/chữ nhật như Right Indent, cộng một khối chữ nhật ngay phía dưới. First Line Indent và Right Indent giảm chiều cao phần chữ nhật. Khi hover giữ con trỏ CSS `cursor:pointer`, vẫn kéo độc lập được.
- **Triển khai:** Trong `word-page-rulers.tsx`, First Line Indent đổi chữ nhật cao 6px thành 4px, giữ mũi nhọn hướng xuống; Right Indent đổi chữ nhật cao 6px thành 4px, mũi nhọn hướng lên; Left Indent dùng cùng thân của Right với một `<rect>` riêng cao 4px đặt dưới, SVG/viewBox cao 14px (các dấu khác cao 10px), đồng nhất chiều rộng 12px và nét 1px. CSS `word-page-rulers.css` giữ top/bottom anchors, riêng Left cao 14px; cursor chuyển từ `ew-resize` sang `pointer`, giữ `touch-action:none`, `pointer-events:auto`.
- **Chức năng:** Không thay đổi thuật toán `onPointerDown`/`Move`/`Up`, pointer capture, snap 0,25cm, đồng bộ Left/FirstLine/Right với đoạn văn. Không động đến các nhóm Ribbon khác.
- **Kiểm thử:** Cập nhật `presentation-basics.test.mjs`, `word-home-qa.test.mjs`, `word-paragraph-interactions.test.mjs` để xác nhận SVG path, chiều cao các lớp, cursor:pointer, tính kéo ở 60–160% và toàn bộ unit/typecheck/build/smoke. Chưa nghiệm thu hover/kéo bằng browser Windows thực tế.
- **Triển khai:** Sau CI thành công mới deploy main SHA và xác nhận Vercel READY, alias production.

### 2026-10-18 — Active cho bốn nút căn đoạn văn Left, Center, Right, Justify
- **Phản hồi:** Trong Word mô phỏng, bốn nút L/C/R/J không có trạng thái active khi đặt con trỏ hoặc chọn đoạn văn đã được căn.
- **Nguyên nhân:** `WordHomeRibbon` trước đó chỉ có `run("justifyLeft/Center/Right/Full")`, không nhận `paragraphAlignment` và không truyền `active` cho bốn nút, mặc dù lớp CSS `.is-active` đã có.
- **Sửa:** Khai báo `WordParagraphAlignment` (`left|center|right|justify`). `word-simulator.tsx` thêm state riêng và `syncParagraphAlignment()` đọc `window.getComputedStyle(currentBlock()).textAlign` từ đoạn tại con trỏ; mặc định `left` khi CSS là `start`/trống; đồng bộ khi `selectionchange`, `rememberSelection`, sau `execCommand`; reset state khi tạo/mở lại tài liệu. Truyền trạng thái xuống Home Ribbon, mỗi nút chỉ active khi kiểu căn tương ứng. Giữ toàn bộ hành vi căn văn bản và CSS nút hiện tại.
- **Kiểm thử:** `tests/word-paragraph-interactions.test.mjs` thêm 2 nhóm test 10 vòng: chuyển caret giữa các đoạn Left, Center, Right, Justify và không định dạng; kiểm tra CSS active/ARIA, nhấn lần lượt 4 lệnh, xác nhận trạng thái cập nhật ngay; không làm sai các nút Paragraph và thước.
- **Giới hạn:** CI kiểm tra logic/mô phỏng; chưa xác minh trực quan browser Windows với bôi chọn thực tế. Đẩy Vercel Production sau CI thành công, đối chiếu READY + alias và main SHA.
- **Phạm vi:** Chỉ trạng thái active L/C/R/J trong Word mô phỏng, không chỉnh các tác vụ khác.

### 2026-10-18 — Tổng kiểm thử Paragraph và kéo thước Left Indent đồng bộ đoạn văn
- **Yêu cầu:** Kiểm thử lại đầy đủ 14 công cụ nhóm Paragraph (bullets, numbering, multilevel, tăng/giảm indent, sort, ¶, 4 kiểu căn hàng, line spacing, shading, borders), và thước ngang dọc. Kéo Left Indent phải làm cả dòng đầu lẫn các dòng còn lại của đoạn đi theo.
- **Phân tích lỗi:** `word-page-rulers.tsx` trước đây thay `left` trong state nhưng giữ nguyên `firstLine`; `word-simulator.tsx` tính `text-indent = firstLine - left`, nên dòng đầu đứng nguyên khi kéo mốc lề trái bên dưới. Increase/Decrease Indent qua `execCommand("indent"/"outdent")` có thể tạo cấu trúc không tương thích `marginLeft` của ruler. Hàm `currentBlock` ưu tiên savedSelection trước lựa chọn thực, dễ nhắm nhầm đoạn.
- **Sửa:** Lower Left Indent làm dịch cả `left` và `firstLine` theo cùng delta, giữ độ lệch first-line/hanging hiện có; handle trên vẫn độc lập, handle phải điều chỉnh marginRight. Ràng buộc kéo theo chiều rộng vùng soạn thảo, bước 0.25 cm và zoom. Bỏ `aria-hidden` của thước ngang vì các mốc là nút có thể tương tác. Current block ưu tiên selection thực. Nút Increase/Decrease Indent dùng cùng marginLeft/textIndent/ruler state (bước 1.25 cm), đồng bộ ngược về ruler sau thay đổi, không phụ thuộc `execCommand` tạo blockquote.
- **Kiểm thử bổ sung:** `tests/word-paragraph-interactions.test.mjs` kiểm tra 14 công cụ ×10 vòng, ba mốc thước ×10 vòng ×60/100/160% zoom; Left Indent đi cùng dòng đầu, thụt lề từng dòng, lề phải; CSS marginLeft, marginRight và textIndent cập nhật theo tọa độ; Increase/Decrease ×10 lần và các tùy chọn line spacing, shading, borders ×10 lần. Sửa assertion cũ `tests/presentation-basics.test.mjs`.
- **Giới hạn:** Không dùng máy Windows/Chromium để tự kéo chuột nghiệm thu trực quan; CI là mô phỏng logic/event, không thay thế E2E thực tế. Không thay đổi các tính năng khác của Word hoặc bài giảng.
- **Phát hành:** Cần Unit tests, Typecheck, Build, Smoke và Vercel Production READY cùng GitHub SHA.

### 2026-10-18 — Sửa Space mất dấu cách và font tự trở về khi không bôi chọn
- **Lỗi:** Nhấn Space trong vùng Word không tạo khoảng trắng; khi chỉ đặt con trỏ rồi đổi font (không bôi chọn), dropdown lập tức trở về font ban đầu. Có liên quan cả font size.
- **Nguyên nhân:** `cleanScriptExitAnchor()` trước đó duyệt *toàn bộ* text node, xóa mọi `U+00A0`. Chromium dùng U+00A0 để biểu diễn nhiều lần nhấn Space trong `contentEditable` nên người dùng mất khoảng trắng. `fontName`/`fontSize` qua `execCommand` ở Range thu gọn chưa đảm bảo có DOM mang định dạng; `syncFontControls()` đọc lại font cũ và reset dropdown.
- **Sửa:** Chỉ dọn duy nhất text node marker do logic thoát Sup/Sub tự tạo, được giữ trong `typingScriptExitAnchorRef`, tuyệt đối không duyệt/xóa khoảng trắng bình thường; vẫn giữ Telex boundary. Với Range thu gọn tạo `span` có font-family hoặc font-size + marker ZWSP, giữ caret trong span để lần gõ tiếp theo nhận định dạng; nếu chưa gõ mà chọn lại font/cỡ thì tái sử dụng span. OnBeforeInput/OnKeyDown xử lý ký tự đầu và Space trong span; onInput dọn marker khi native IME nhập.
- **Kiểm thử:** Regression tests: U+00A0 bình thường không bị xóa; chỉ dọn NBSP marker được theo dõi; chọn Georgia và cỡ 18 không bôi chọn, nhập Space ở caret; giữ test Telex/Sup/Sub/Change Case. CI đầy đủ Unit tests/Typecheck/Build/Smoke; xác nhận Production READY với main SHA.
- **Phạm vi:** Chỉ công cụ Word mô phỏng, không chỉnh các ribbon control, slide hoặc các môn khác. Chưa kiểm thử trực quan bằng thao tác UniKey và Space thực tế trong Chromium.

### 2026-10-18 — Hoàn thiện năm chức năng Change Case cho Word mô phỏng
- **Mục tiêu:** Bổ sung chức năng thực tế cho nút Change Case (Aa) trong Ribbon Home như Word, không chỉ trình bày menu.
- **Nút/mode:** `Viết hoa đầu câu` (có nhận dấu câu .!? và qua các thẻ chữ khác nhau), `chữ thường`, `CHỮ HOA`, `Viết Hoa Từng Từ` (nhận ranh giới từ, gạch nối, dấu câu và tiếng Việt), `đẢO hOA/tHƯỜNG` (đảo từng ký tự). Nút Aa chính thực hiện đảo từng ký tự; menu đủ năm lựa chọn.
- **File:** `src/features/word-simulator/word-home-ribbon.tsx` bổ sung chế độ toggle và sắp menu theo Word; `src/features/word-simulator/word-simulator.tsx` bổ sung dispatcher, đổi chữ theo codepoint trong selected DOM fragment, nhận câu mới sau dấu .!? và sau chuyển paragraph; `tests/presentation-basics.test.mjs` kiểm thử năm mode, tiếng Việt, đa câu, gạch nối, hỗn hợp nhiều thẻ định dạng, giữ selection; `CHANGELOG.md` và nhật ký này.
- **Bảo toàn:** Không tái tạo HTML làm mất `<b>`, `<i>`, `<u>`, `<sup>`, `<sub>`, link/màu. Giữ nguyên chọn chữ sau chuyển đổi và chức năng Word khác. Không có vùng chọn sẽ hiển thị yêu cầu bôi chọn trước.
- **Kiểm thử:** GitHub CI Unit tests, Typecheck, Production build, Smoke test; Vercel Production phải READY trùng main SHA mới xác nhận phát hành. Chưa có nghiệm thu giao diện bằng điều khiển trình duyệt thực tế.

### 2026-10-18 — Sửa trạng thái active khi chọn chữ đã Sup/Sub
- **Triệu chứng:** Bôi chọn chữ đã có `<sup>`/`<sub>` nhưng hai nút Sup/Sub không sáng như Bold/Italic/Underline.
- **Nguyên nhân xác nhận:** DOM Range dùng `START_TO_END` để so sánh end của selection với start của textRange và `END_TO_START` để so sánh start của selection với end của textRange. Phiên bản cũ đảo ngược constants nên bộ phát hiện nội dung định dạng hầu như luôn trả false.
- **Sửa:** Đổi chính xác hai constants trong `rangeHasScript`; không thay các logic khác, tránh hồi quy. Test `presentation-basics.test.mjs` bổ sung các trường hợp vùng chọn chỉ Sup, chỉ Sub, thường, hỗn hợp; `word-home-qa.test.mjs` đồng bộ assertions.
- **Kiểm thử/triển khai:** Chạy CI Unit tests, Typecheck, Build, Smoke; Vercel Production READY cùng SHA GitHub main mới xác nhận hoàn tất. Chưa kiểm thử trực quan bằng UniKey/Chromium trên Windows.

### 2026-10-18 — Tổng kiểm tra Sup/Sub: vùng chọn, bật/tắt, đổi chế độ
- **Lỗi phát sinh sau lần sửa Telex:** Bôi chọn chữ (đặc biệt đang ở trong `<sup>/<sub>`) rồi bấm Sup/Sub bị mất vùng chọn; không thể tắt định dạng hoặc chuyển sang chế độ đối lập. Có thể kéo chọn qua dấu ngăn IME không được.
- **Nguyên nhân:** `toggleScriptFormat` gọi nhánh thoát chỉ số qua `liveScript` trước khi kiểm tra `!range.collapsed`, biến một selection thực thành thao tác tại caret; bộ phát hiện `rangeHasScript` dùng `Range.compareBoundaryPoints` với dấu/biên bị đảo; và dấu phân cách `contentEditable=false` cản kéo chọn.
- **Sửa:** Ưu tiên thao tác selection thật trước mọi nhánh typing; sửa `Range.END_TO_START >0` và `Range.START_TO_END <0` để nhận biết nút đang bật; không đặt `contentEditable=false` lên mốc IME (vẫn ẩn và được loại bỏ khi lưu); không chọn và tắt một thẻ `<sup>/<sub>` khác vô tình bằng `querySelector`; trường hợp đổi kiểu tại caret thoát chế độ cũ rồi khởi tạo kiểu mới. Bảo toàn xử lý Telex trước đó.
- **Kiểm thử:** Bổ sung VM test sáu trường hợp chọn chữ: thường→Sup, Sup→thường, Sup→Sub, Sub→Sup, thường→Sub, Sub→thường; sửa harness mô phỏng so sánh Range theo chuẩn DOM; giữ test Telex. Chạy GitHub Actions Unit tests, Typecheck, Production build, Smoke test; cần thực nghiệm trên trình duyệt và UniKey Windows trước khi khẳng định mọi tương tác đúng.
- **Triển khai:** GitHub main → Vercel Production chỉ khi CI thành công và deployment READY; commit cụ thể trong lịch sử GitHub.

### 2026-10-17 — Sửa Telex ghép nhầm chữ khi tắt Superscript/Subscript
- **Lỗi thực tế:** Trong Word mô phỏng, bật Sup, gõ `aaaaa`, tắt Sup rồi gõ `a` thì bộ gõ tiếng Việt Telex vẫn biến ký tự `a` cuối nằm trong Sup thành `â`, đồng thời toolbar hiển thị Sup đang bật lại.
- **Nguyên nhân:** Ribbon giữ selection khi `mousedown`; logic thoát Sup cũ chưa kết thúc phiên IME, đặt caret ngay sau thẻ `<sup>`, dọn ký tự mốc quá sớm, khiến Telex tiếp tục xử lý ký tự cũ và DOM selection nhảy vào thẻ định dạng.
- **Sửa:** Trong `src/features/word-simulator/word-simulator.tsx` bổ sung `exitScriptIntoPlainCaret`: chủ động blur để IME kết thúc, tạo vùng nhập span thường ở ngoài `<sub>/<sup>`, ranh giới từ NBSP không cho chỉnh sửa và được ẩn về hình thức, đặt caret vào span thường rồi focus lại. Áp dụng trên các nhánh thoát chỉ số đang có chữ; xóa chế độ pending/exit và đồng bộ toolbar. Không xóa ranh giới IME trong mỗi `input`; loại bỏ nó và ký tự vô hình khi lưu/xuất HTML.
- **Kiểm thử:** Thêm regression test VM cho trường hợp `aaaaa` Sup → tắt → `a`/Telex `â` bên ngoài Sup, đảm bảo `<sup>` không bị sửa và toolbar không tái bật; chạy CI Unit tests, Typecheck, Build, Smoke routes.
- **Phạm vi:** Chỉ hành vi gõ chỉ số trong công cụ Word mô phỏng, không thay Ribbon Home, dữ liệu slide, Excel, UI ngoài.
- **Giới hạn:** Chưa xác minh tương tác thực tế qua Windows Vietnamese Telex/Unikey trong trình duyệt; cần kiểm tra bằng bàn phím/IME thực tế.

### 2026-10-17 — Sửa lỗi slide Word 01 bị kéo giãn, tràn trang và co hẹp hai cột
- **Phản hồi thực tế:** Ảnh người dùng cho thấy slide nhập tiếng Việt có một thẻ kéo dài gần hết màn hình và thẻ thứ hai bị đẩy ra ngoài, tiêu đề bị cắt; slide 2 có hai khối quá hẹp, chữ bị xuống dòng, còn khoảng trắng lớn.
- **Nguyên nhân trong CSS:** Tập hợp các override liên tiếp dùng `flex:1 0 auto` cho vùng nội dung, `grid-auto-rows:minmax(min-content,1fr)` và `height:100%` cho từng thẻ, khiến lưới phóng chiều cao không theo nội dung; phần khung nhiều quy tắc chồng nhau. Không phải lỗi dữ liệu bài giảng.
- **Cách sửa:** Xóa chuỗi override chồng nhau ở cuối `src/features/presentations/word-lesson-slide.css`, thay một bộ quy tắc bố cục có chủ đích: slide theo luồng block, nội dung và hàng grid cao tự nhiên, ba bước dọc là ba thẻ gọn có mũi tên 40px cách nhau, không có 1fr kéo dọc; slide 2 là hai cột chia đều trên khung tối đa 1180px, mỗi thẻ rộng theo khung và cao theo chữ; các card ba ý có hàng theo nội dung và một hàng ngang khi đủ không gian. Mobile chuyển thành một cột.
- **Kiểm thử:** Cập nhật `tests/word-slide-live-editor.test.mjs` để ngăn hồi quy với `flex:1 0 auto`, `grid-auto-rows:minmax(min-content,1fr)` và thẻ chiều cao kéo dài; chạy đầy đủ CI. Cần chụp lại sản phẩm ở 360/768/1280/1920 trước khi xác nhận chất lượng thị giác.
- **Phạm vi:** Chỉ CSS Word 01 và kiểm thử/tài liệu; không sửa nội dung, dữ liệu slide, toolbar Word, chức năng iframe hoặc môn khác.
- **GitHub / Vercel:** Xác nhận commit main + Production READY sau khi CI thành công.

### 2026-10-17 — Đồng bộ kích thước khối, căn chữ và cân đối slide 2 Word 01
- **Yêu cầu:** Bỏ chi tiết trang trí thừa được phản ánh trên ảnh; các khối cùng loại có cùng kích thước dù độ dài văn bản khác nhau; slide 2 hai thẻ giãn ngang cân đối nhưng không quá cao/rỗng; chữ trong card không chìm xuống đáy.
- **Thực hiện:** `word-lesson-slide.tsx` bỏ các dấu trang trí 3 vạch cạnh tiêu đề và chữ/hình ký hiệu trang trí lớn trong hai khối slide 2; `word-lesson-slide.css` loại bỏ CSS tương ứng. Các khối kiến thức ba mục dùng ba cột bằng nhau trên màn rộng, một cột trên tablet/điện thoại; CSS Grid chia đều kích thước thẻ theo hàng, bỏ card đầu chiếm hai hàng và căn dưới. Tất cả chữ/số trong card và thẻ bước căn đầu trên; bước dọc có các hàng cao bằng nhau theo nội dung dài nhất. Hai khối slide 2 dùng khung cân đối, chiếm ngang tối đa 1480px, bỏ min-height dư thừa và các khoảng trống giữa tiêu đề/nội dung.
- **Giới hạn:** Chỉ chỉnh giao diện Word 01; không thay dữ liệu, ghi chú, Word Home Ribbon, iframe Word và trình phát các môn khác. Giữ việc bỏ tiến độ/nút Word thừa ở chân slide của commit trước.
- **Kiểm thử:** CI kiểm tra Unit tests, Typecheck, Production build, Smoke test; cần nghiệm thu screenshot 360, 768, 1280, 1920px bằng trình duyệt. Vercel Production chỉ công bố khi đúng SHA GitHub `main`, READY và domain chính.
- **GitHub / Vercel:** Ghi SHA theo commit triển khai.

### 2026-10-17 — Bỏ thanh tiến độ và nút Word lặp lại trong slide Word 01
- **Yêu cầu:** Theo ảnh người dùng gửi, xóa hai thành phần ở chân tất cả slide: chỉ số/đường tiến độ dạng `02 — 31` và nút xanh `Mở Word thực hành`.
- **Thay đổi:** Xóa `w01-bottom` (thanh số + nút) khỏi `src/features/presentations/components/word-lesson-slide.tsx` trên tất cả slide, bỏ nút Word trùng cả ở slide bìa; loại bỏ `OpenWord` và CSS liên quan trong `src/features/presentations/word-lesson-slide.css`. Đơn giản hóa props renderer trong `src/features/presentations/components/player.tsx`. Thêm kiểm thử trong `tests/word-slide-live-editor.test.mjs`.
- **Phạm vi / quyết định:** Bỏ hai thành phần **bên trong slide Word 01**, không xóa điều khiển chuyển slide hoặc nút `Word` trong toolbar chung của trình chiếu. Công cụ Word iframe vẫn mở bình thường và giữ nội dung khi thay slide. Không ảnh hưởng slide Word chủ đề khác, Excel, File Explorer, Home Ribbon, nội dung hoặc ghi chú giảng viên.
- **Kiểm thử:** GitHub CI Unit tests, Typecheck, Production build và Smoke test; xác nhận Vercel READY/alias đúng GitHub `main`. Kiểm thử giao diện trực quan bằng browser cần thực hiện riêng.
- **Commit/triển khai:** Xem commit `main` của yêu cầu này, Vercel Production cùng SHA được xác nhận sau release.

### 2026-10-17 — Sửa tiêu đề và các bước dọc Word 01, tăng mũi tên và giảm thẻ
- **Yêu cầu:** Tiêu đề tất cả slide Word 01 chỉ một dòng; ba bước dọc không được đè lên tiêu đề; mũi tên lớn, rõ; khối chữ nhật vừa đủ nội dung thay vì cao/rộng quá mức.
- **Thay đổi:** `word-lesson-slide.tsx` thêm `SingleLineTitle` tự đo bề ngang và điều chỉnh cỡ bằng ResizeObserver (chữ dài quá sẽ cuộn ngang thay vì xuống dòng); mũi tên bước ngang 42px, bước dọc 40px, mũi tên đường dẫn lệnh 23px. `word-lesson-slide.css` cho nội dung flex mở theo chiều cao thực (bỏ căn giữa gây tràn ngược), dùng khoảng cách giữa các bước cho mũi tên, giảm min-height/padding của thẻ, responsive và màn hình thấp. Thêm regression tests trong `word-slide-live-editor.test.mjs`, cập nhật quy chuẩn slide, changelog và nhật ký.
- **Phạm vi:** Chỉ Word 01; không chỉnh nội dung/ghi chú, trình soạn thảo Word, Ribbon, Excel hoặc các bài trình chiếu khác. Giữ nút mở Word tích hợp và các hiệu ứng có hỗ trợ giảm chuyển động.
- **Kiểm thử:** Chạy GitHub CI (Unit tests, Typecheck, Production build, Smoke test), kiểm tra READY + SHA cùng GitHub main; chưa có nghiệm thu thị giác bằng browser ở 360/768/1280/1920.
- **GitHub / Vercel:** Xác nhận SHA release theo trạng thái CI và Vercel sau commit.
- **Lưu ý:** Trên màn hình quá hẹp, tiêu đề rất dài sẽ cuộn ngang tại cỡ chữ tối thiểu để tránh chữ quá nhỏ, luôn một dòng và không cắt nội dung.

### 2026-10-17 — Toàn bộ slide Word 01: layout đa dạng và hiện đủ bước
- **Mục tiêu:** Làm mới toàn bộ slide Word 01 gọn, trực quan, đẹp, có animation/transition; không phải nhấn để hiện các bước, không trùng cửa sổ Word minh họa.
- **Thay đổi:** `word-lesson-slide.tsx`, `word-lesson-slide.css`, `player.tsx`, import CSS ở route trình chiếu, kiểm thử `word-slide-live-editor.test.mjs`, tài liệu slide, changelog và nhật ký.
- **Thiết kế:** Renderer riêng cho `word-lam-quen` gồm cover chữ lớn, cặp so sánh, luồng thao tác ngang/dọc/xếp tầng, khối ý chính, keycap, ví dụ văn bản, quiz. Tất cả bước và đường dẫn lệnh luôn hiển thị. Bỏ minh họa Chrome/Ribbon giả ở các slide, giữ công cụ Word iframe thực hành thực tế. Giữ dữ liệu, thứ tự, số slide, ghi chú và bộ Word Home đã duyệt; không thay bài Word khác, Excel hay Explorer.
- **Chuyển động:** CSS stagger ngắn, hover/focus rõ, hỗ trợ reduced-motion và màn hình nhỏ/thấp không cắt nội dung.
- **Kiểm thử:** CI sẽ chạy Unit tests, typecheck, build, smoke route; vẫn cần kiểm thử trực quan 360/768/1280/1920px.
- **GitHub:** Commit của tác vụ này trên main.
- **Vercel:** Chưa xác nhận READY/SHA tại thời điểm soạn nhật ký.
- **Tồn đọng:** Nghiệm thu thị giác thực tế và hiệu năng hiển thị tại các độ phân giải máy chiếu.

### 2026-10-17 — Tích hợp công cụ soạn thảo Word trực tiếp trong slide Word 01
- **Mục tiêu:** Không phải rời bài trình chiếu hoặc phát clip khi minh họa Word; giữ trình soạn thảo Home Ribbon đúng giao diện đã duyệt.
- **Thay đổi và file:** `player.tsx` tích hợp iframe Word mô phỏng vào panel nội bộ, chỉ cho bài `word-lam-quen`, giữ iframe tồn tại khi đổi slide; `blocks.tsx` và `word-workspace.tsx` bổ sung nút thực hành bên cạnh quy trình; `word-live-lab.css` bổ sung giao diện slide, thẻ nội dung, responsive và giảm hiệu ứng chuyển động; import trong trang trình chiếu; thêm `tests/word-slide-live-editor.test.mjs`.
- **Quyết định / tiêu chuẩn:** Tái sử dụng đúng route `/cong-cu/mo-phong-word` trong iframe cùng nguồn để giữ bộ Ribbon, thước và giấy A4; không sao chép lại công cụ, không sửa CSS hay logic Home Ribbon. Giữ nguyên slide và dữ liệu học tập, nội dung mock vẫn dùng để hướng dẫn từng bước.
- **Kiểm thử:** Có kiểm thử hồi quy tĩnh bằng Node; cần CI thực thi `pnpm test`, `pnpm typecheck`, `pnpm build` và xem thực tế ở 360/768/1280px trước khi xác nhận.
- **GitHub commit:** Xem commit của lần chỉnh sửa này trên branch `main`.
- **Vercel Production:** Chưa xác nhận READY và SHA tại thời điểm ghi nhật ký.
- **Tồn đọng:** Kiểm tra thực tế hiệu năng iframe, bàn phím khi thao tác và điều hướng trong các slide tại production. Nút X của cửa sổ Word khi ở iframe lưu nháp rồi gửi `postMessage` cùng nguồn ở sự kiện capture; giữ nguyên `onClick={onClose}` cũ để không đổi hành vi khi Word mở độc lập. Đã sửa kiểm thử iframe có `ref`.

### 2026-10-15 — Chuẩn hóa căn giữa và chiều cao nhóm Font, khoảng A-mũi tên 3px
- **Yêu cầu:** chevron trên A sát hơn để cách khoảng 3px; hai ô chọn Font/Size cùng chiều cao với nút tăng/giảm, hai hàng đều căn giữa các nút, vạch đứng mảnh cùng kích thước.
- **File:** `src/features/word-simulator/word-home-ribbon.tsx`, `word-font-ribbon.css`, `word-paragraph-ribbon.css`, `tests/presentation-basics.test.mjs`, `docs/WORD_SIMULATOR_STANDARD.md`, `docs/WORKLOG_AND_RULES.md`, `CHANGELOG.md`.
- **Quyết định:** đưa SVG mũi tên vào cùng span chữ A để đặt cách mép A chính xác 3px bằng CSS `left:calc(100% + 3px)`; dùng chung chiều cao line box và căn giữa cả cặp, A nhỏ font 15.4px thay vì transform scale; tất cả khung Font = 27px, dropdown được căn giữa theo chiều dọc, picker swatch/chữ căn đều. Vạch phân cách Font và Paragraph cùng 1×18px, cùng #c9ced6.
- **Kiểm thử:** GitHub CI gồm tests, typecheck, production build, route smoke; đối chiếu screenshot/browser thực tế ở 360/768/1280 vẫn cần thực hiện nếu không có browser.
- **GitHub:** PR `fix/word-font-uniform-27px-alignment`, SHA squash merge xác nhận sau CI.
- **Vercel:** chỉ báo READY khi đúng SHA main và alias `xuong-cong-nghe.vercel.app`.


### 2026-10-15 — Đưa hai chevron Font Size sát chữ A thêm một nửa
- **Yêu cầu:** đưa mũi tên xanh của cả hai nút tăng/giảm Font Size gần chữ A hơn khoảng một nửa khoảng trống hiện tại, không đổi kích thước.
- **File:** `src/features/word-simulator/word-font-ribbon.css`, `tests/presentation-basics.test.mjs`, `docs/WORD_SIMULATOR_STANDARD.md`, `docs/WORKLOG_AND_RULES.md`, `CHANGELOG.md`.
- **Quyết định:** di chuyển vào trong thêm 1,25px: Grow `right:2px → 3.25px`, Shrink `right:5px → 6.25px`. Giữ `top:6px`, size `5×4px`, khoảng chênh 3px giữa hai nút và handlers.
- **Kiểm thử:** test CSS tọa độ/kích thước/handler, GitHub CI typecheck/build/smoke; không có đo khoảng trống bằng browser screenshot.
- **GitHub:** PR `style/word-caret-gap-halved-again`, SHA xem lịch sử sau merge.
- **Vercel:** Production deploy SHA mới, xác nhận READY + alias domain chính + SHA main.


### 2026-10-15 — Thu nhỏ và căn ngang hai mũi tên tăng/giảm Font Size
- **Yêu cầu:** hai mũi tên xanh trên A vẫn thấy khoảng cách không đều vì cỡ chữ A khác nhau; giảm mỗi mũi tên còn khoảng nửa size và đặt absolute ngang đầu A nhỏ.
- **File:** `src/features/word-simulator/word-font-ribbon.css`, `tests/presentation-basics.test.mjs`, `docs/WORD_SIMULATOR_STANDARD.md`, `docs/WORKLOG_AND_RULES.md`, `CHANGELOG.md`.
- **Chỉnh sửa:** SVG giữ nguyên hướng và các lệnh; CSS render từ 9×8 về 5×4, cùng `top:6px`; Grow `right:2px`, Shrink `right:5px` bù chiều rộng chữ A nhỏ để hai khoảng trống ngang cân đối. Không thay đổi chức năng hoặc các nhóm còn lại.
- **Kiểm thử:** regression về kích thước, tọa độ, baseline và handler; CI tests/typecheck/build/route smoke (kết quả theo PR). Không coi kiểm thử tĩnh là visual QA trên Production.
- **GitHub:** PR `style/word-size-chevron-half-aligned`, SHA merge xem lịch sử sau hợp nhất.
- **Vercel:** xác nhận READY, commit trùng GitHub main và alias chính trước khi thông báo.


### 2026-10-15 — Khắc phục icon vẫn giống cũ do CSS ghi đè và chưa khớp ảnh
- **Phản hồi:** người dùng không thấy thay đổi trên icon Font Size và Indent dù các PR trước báo triển khai thành công.
- **Nguyên nhân xác nhận từ mã:** `word-window-bar.css` đặt màu SVG bằng selector có specificity lớn hơn `word-font-ribbon.css`, ghi đè chevron màu xanh thành xám. Đồng thời icon Indent vẽ bốn dòng trong khi ảnh tham chiếu cuối chỉ có ba dòng.
- **Sửa trong:** `src/features/word-simulator/word-window-bar.css`, `word-font-ribbon.css`, `word-home-ribbon.tsx`, `tests/presentation-basics.test.mjs`, `docs/WORD_SIMULATOR_STANDARD.md`, `docs/WORKLOG_AND_RULES.md`, `CHANGELOG.md`.
- **UI:** không cho selector chung ghi đè màu chevron; dùng màu xanh dễ phân biệt. Indent chuyển thành ba nét ngang xám + mũi tên cyan đặc nhỏ, vị trí bám sát ảnh.
- **QA:** test tĩnh về CSS cascade, shapes, commands; CI/typecheck/build/smoke. Có thể render CSS offline để đối chiếu, không thay thế screenshot/kiểm thử trực tiếp Production.
- **Release:** PR `fix/word-visible-caret-indent-fidelity`; squash merge + Vercel Production đúng SHA main, xác nhận READY và alias trước khi công bố.
- **Còn lại:** chưa kiểm tra pixel trên browser dùng website Production thực (môi trường browser không truy cập mạng).


### 2026-10-15 — Làm lại icon Font Size và Indent theo hai ảnh cắt gốc
- **Yêu cầu:** tái hiện đúng hai ảnh tham khảo mới cho nút A lớn/A nhỏ và Decrease/Increase Indent.
- **File:** `src/features/word-simulator/word-home-ribbon.tsx`, `src/features/word-simulator/word-font-ribbon.css`, `docs/WORD_SIMULATOR_STANDARD.md`, `docs/WORKLOG_AND_RULES.md`, `CHANGELOG.md`, `tests/presentation-basics.test.mjs`.
- **Quyết định:** thay tam giác đen đặc thành chevron xanh lam nhạt 9×8px không thân trên góc phải A; giữ baseline chung. Indent giữ 4 đường xám đúng yêu cầu, đổi mũi tên đặc thành mũi tên stroke xanh mảnh ở giữa; không sửa hành vi các nút.
- **Kiểm thử:** xác thực số nét, màu sắc, SVG geometry, mapping handler và CI (test, TypeScript, production build, smoke); chưa QA ảnh render trên browser.
- **GitHub:** PR `style/word-font-indent-image-7-8`, SHA squash merge xác nhận trên main sau CI.
- **Vercel:** kiểm tra READY, Vercel SHA trùng main, domain `xuong-cong-nghe.vercel.app` đã gán trước khi báo hoàn tất.


### 2026-10-15 — Thay caret tăng/giảm Font Size theo ảnh tham khảo
- **Yêu cầu:** thay arrow trong hai nút tăng/giảm cỡ chữ thành tam giác đặc đáy ngang, hơi bo góc như ảnh, đặt ngay đầu bên phải chữ A.
- **File:** `src/features/word-simulator/word-home-ribbon.tsx`, `word-font-ribbon.css`, `docs/WORD_SIMULATOR_STANDARD.md`, `tests/presentation-basics.test.mjs`, `CHANGELOG.md`, `docs/WORKLOG_AND_RULES.md`.
- **Quy tắc:** Increase hướng lên/Decrease hướng xuống, dùng SVG tam giác bo nhẹ không thân và màu #111; hai chữ A chung baseline. Giữ nguyên vị trí và handler đang hoạt động, không sửa chức năng khác.
- **Kiểm thử:** GitHub CI tests/typecheck/build/smoke; chưa chạy pixel comparison trên trình duyệt.
- **GitHub:** PR `style/word-size-caret-reference`, squash commit trong Git history.
- **Vercel:** production deploy commit main khi CI đạt; chỉ xác nhận READY khi trùng SHA và domain chính có alias.


### 2026-10-15 — Giản lược hai icon Indent còn bốn đường kẻ
- **Yêu cầu:** icon Decrease/Increase Indent bị rối, chỉ cần bốn hàng ngang.
- **File:** `src/features/word-simulator/word-home-ribbon.tsx`, `docs/WORD_SIMULATOR_STANDARD.md`, `docs/WORKLOG_AND_RULES.md`, `CHANGELOG.md`, `tests/presentation-basics.test.mjs`.
- **Quyết định:** giảm từ sáu xuống bốn path ngang mỗi icon, hai đường trên/dưới dài, hai đường giữa ngắn để dành không gian cho mũi tên xanh; chỉnh mũi tên gọn tương ứng. Không chỉnh CSS bố cục, sự kiện hoặc nhóm Ribbon khác.
- **Kiểm thử:** unit tests, typecheck, production build và route smoke qua GitHub Actions; chưa kiểm tra E2E trên browser.
- **GitHub:** PR `fix/word-indent-four-lines`, commit xem lịch sử Git sau merge.
- **Vercel:** deploy Production SHA trùng main, chỉ báo hoàn tất nếu READY và alias chính đã gán.


### 2026-10-15 — Tinh chỉnh SVG icon Font/Paragraph gần Word desktop
- **Yêu cầu:** mũi tên tăng cỡ chữ dạng tam giác ở trên bên phải A; Multilevel List, hai nút Indent, Line Spacing, Sort cần sát hình Word hơn. Ưu tiên CSS/giao diện, làm chức năng từng bước sau.
- **File:** `src/features/word-simulator/word-home-ribbon.tsx`, `src/features/word-simulator/word-font-ribbon.css`, `src/features/word-simulator/word-paragraph-ribbon.css`, `docs/WORD_SIMULATOR_STANDARD.md`, `docs/WORKLOG_AND_RULES.md`, `CHANGELOG.md`, `tests/presentation-basics.test.mjs`.
- **Thiết kế:** arrowhead hình tam giác phía trên góc phải của A; multilevel với 3 bậc 1/a/i và đường kẻ thụt dần; indent mũi tên xanh trái/phải trước các dòng văn bản; giãn dòng 2 mũi tên cùng trục đứng; Sort A xanh/Z đậm bên trái và mũi tên xuống bên phải. SVG dùng đường mảnh chống mờ.
- **Phạm vi:** không thay handlers, mapping lệnh, layout nhóm, hay cài thêm menus; các công cụ đang hoạt động giữ nguyên. Responsive Ribbon dạng cuộn ngang và quy tắc disabled giữ nguyên.
- **Kiểm thử:** unit tests, typecheck, production build, route smoke trên GitHub Actions; ghi rõ hạn chế visual/E2E nếu chưa kiểm tra thực tế.
- **GitHub:** PR `style/word-ribbon-icon-fidelity`, squash commit xem lịch sử Git.
- **Vercel:** deploy Production sau CI, chỉ công bố READY nếu main SHA = Vercel SHA và alias `xuong-cong-nghe.vercel.app`.
- **Tồn đọng:** chưa đối chiếu pixel bằng trình duyệt, các menu nâng cao vẫn chưa triển khai.


### 2026-10-15 — Hoàn thiện nhóm Paragraph giả lập Word theo ảnh
- **Yêu cầu:** nhóm Paragraph giống Word desktop về số nút, thứ tự, icon và khoảng cách phân bố đều hai bên, đồng thời các nút phải hoạt động đúng.
- **File:** `src/features/word-simulator/word-home-ribbon.tsx`, `word-simulator.tsx`, `word-paragraph-ribbon.css` (mới), `src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx`, `docs/WORD_SIMULATOR_STANDARD.md`, `tests/presentation-basics.test.mjs`, `CHANGELOG.md`, `docs/WORKLOG_AND_RULES.md`.
- **Bố cục:** 274px, 2 hàng 27px, giãn đều `space-between`, vạch ngăn đúng nhóm; list icons tự dựng bằng SVG nét mảnh, nút căn đoạn, spacing, shading, border theo ảnh; không sửa Font/Clipboard/Styles.
- **Chức năng:** Multilevel List giờ chèn danh sách lồng nhau chứ không còn gọi `indent` giả; Shading tô nền toàn đoạn thay vì chỉ chữ, Border toggle viền dưới đoạn; các lệnh còn lại giữ đúng mapping.
- **Kiểm thử:** GitHub CI (tests, typecheck, production build, route smoke); browser E2E/visual chỉ ghi thành công khi thực hiện thật.
- **GitHub:** PR `feat/word-paragraph-ribbon-accurate`; xem squash commit ở lịch sử Git.
- **Vercel Production:** chỉ xác nhận READY khi trùng SHA GitHub main và alias `xuong-cong-nghe.vercel.app`.
- **Giới hạn:** chưa có menus cho kiểu danh sách, khoảng cách hoặc đường viền khác nhau; `execCommand` có thể thay đổi theo trình duyệt.


### 2026-10-15 — Sửa nguyên nhân hàng trên Font vẫn bị dồn trái
- **Yêu cầu:** hàng trên nhóm Font chưa giãn đều hai bên như hàng dưới, dù đã yêu cầu chỉnh.
- **Nguyên nhân:** CSS `src/features/word-simulator/word-font-ribbon.css` có hai `justify-content` trong cùng block `.wsl-font-top`; `start` ở cuối ghi đè `space-between`.
- **File sửa:** `src/features/word-simulator/word-font-ribbon.css`, `tests/presentation-basics.test.mjs`, `docs/WORD_SIMULATOR_STANDARD.md`, `docs/WORKLOG_AND_RULES.md`, `CHANGELOG.md`.
- **Quyết định:** xóa đúng khai báo `justify-content: start` gây xung đột; giữ tất cả kích thước, các nút và vạch ngăn. Bổ sung kiểm thử kiểm tra chính xác chỉ có một `justify-content: space-between`, tránh lỗi tái phát.
- **Kiểm thử:** GitHub Actions validator, unit tests, typecheck, build, route smoke; chưa đo bằng browser thực tế nên không khẳng định pixel-perfect.
- **GitHub commit:** xem PR `fix/word-font-top-space-between-override` và squash commit khi merge.
- **Vercel Production:** chỉ xác nhận khi READY, SHA khớp `main`, domain chính được gán.
- **Giới hạn:** chưa kiểm tra trực quan bằng ảnh sau triển khai.


### 2026-10-15 — Giãn đều hàng trên Font, phân cách Aa/x² và sửa icon Clear Formatting
- **Yêu cầu:** hàng trên nhóm Font phân bố đều như hàng dưới; có hai đường đứng nhỏ trước/sau Aa và một đường sau x²; Clear Formatting dùng hình cục tẩy rõ.
- **File thay đổi:** `src/features/word-simulator/word-home-ribbon.tsx`, `src/features/word-simulator/word-font-ribbon.css`, `docs/WORD_SIMULATOR_STANDARD.md`, `tests/presentation-basics.test.mjs`, `CHANGELOG.md`, `docs/WORKLOG_AND_RULES.md`.
- **Cách làm:** grid hàng trên giữ độ rộng hai ô chọn, dãn 4 nút và ba phân cách bằng `justify-content: space-between`; vạch ngăn mảnh `1px × 18px`, `aria-hidden`, không ăn chuột. Thay icon Clear Formatting từ A đè tẩy sang Eraser nguyên vẹn; lệnh `removeFormat` giữ nguyên.
- **Kiểm thử:** GitHub CI gồm validator, unit tests, TypeScript, production build và route smoke; xem kết quả tại PR.
- **Commit GitHub:** xem squash merge PR `style/word-font-top-spacing-separators`.
- **Vercel Production:** chỉ xác nhận khi READY, SHA trùng `main` và domain chính đã gán.
- **Giới hạn:** không có kiểm thử visual browser/pixel-perfect trong lần này.


### 2026-10-15 — Chỉnh nét chữ B/U, chân chữ A và giãn đều hàng dưới Font
- **Mục tiêu:** làm B và U không chân; sửa biểu tượng tăng/giảm phông để hai chữ A dù khác cỡ vẫn cùng đường chân; dàn đều hàng 2 Font từ trái sang phải.
- **Thay đổi/file:** `src/features/word-simulator/word-home-ribbon.tsx`, `src/features/word-simulator/word-font-ribbon.css`, `docs/WORD_SIMULATOR_STANDARD.md`, `tests/presentation-basics.test.mjs`, `CHANGELOG.md`, `docs/WORKLOG_AND_RULES.md`.
- **Quyết định:** B/U dùng Arial/Segoe UI sans-serif; hai chữ A có wrapper cao bằng nhau, glyph neo sát đáy; thu nhỏ bằng transform từ góc trái dưới, mũi tên tách khỏi glyph; 9 công cụ hàng dưới giãn đều với `justify-content: space-between`. Chỉ sửa giao diện nhóm Font, không đổi handler hay các nhóm khác.
- **Kiểm thử:** GitHub Actions gồm validator, tests, typecheck, build, route smoke; không tuyên bố đã đo baseline bằng browser E2E khi chưa thực hiện.
- **GitHub commit:** PR `style/word-font-baseline-spacing`; xem squash commit sau hợp nhất.
- **Vercel Production:** chỉ xác nhận khi READY, SHA trùng main và domain `xuong-cong-nghe.vercel.app` đã gán.
- **Giới hạn:** cần đối chiếu trực quan bằng ảnh chụp trình duyệt thật để kiểm tra từng pixel.


### 2026-10-15 — Thiết kế chuyên sâu lại nhóm Font của Word Simulator
- **Yêu cầu:** nhóm Font trước chưa đẹp, cần chỉnh kỹ cho giống giao diện Word desktop người dùng đã cung cấp.
- **Thay đổi và file:** `src/features/word-simulator/word-home-ribbon.tsx`, thêm `src/features/word-simulator/word-font-ribbon.css`, import tại `src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx`, cập nhật `docs/WORD_SIMULATOR_STANDARD.md`, `tests/presentation-basics.test.mjs`, `CHANGELOG.md` và nhật ký này.
- **Quyết định:** cô lập CSS nhóm Font tránh xung đột style cũ; căn 2 hàng chuẩn gồm font, cỡ chữ, 4 nút hàng trên và 9 vị trí hàng dưới; dùng glyph tùy biến B/I/U, Aa, x₂, x² và mũi tên nhỏ, giữ Color Picker hoạt động và swatch đồng bộ giá trị màu; Text Effects vẫn disabled không hover và không tooltip. Không sửa các nhóm Ribbon khác.
- **Kiểm thử:** GitHub Actions chạy validator, unit, typecheck, production build và route smoke. Chưa có browser visual/E2E nên kết quả pixel-perfect cần đối chiếu trực tiếp.
- **GitHub commit:** xem PR `style/word-font-group-refinement` và squash commit sau merge.
- **Vercel Production:** chỉ xác nhận khi READY, trùng SHA `main` và alias `xuong-cong-nghe.vercel.app`.
- **Tồn đọng:** engine Word thật, phép hiển thị font và bảng màu phụ thuộc trình duyệt; cần kiểm tra giao diện thực tế trên máy học viên.


### 2026-10-15 — Chuẩn hóa trạng thái disabled của nút công cụ Word
- **Yêu cầu:** nút vô hiệu hóa không hiện con trỏ cấm (đỏ), không có hiệu ứng hover, giữ mũi tên chuột bình thường.
- **Thay đổi và file:** `src/features/word-simulator/word-home-ribbon.css`, `word-window-bar.css`, `word-simulator.css`, `word-home-ribbon.tsx`, `docs/WORD_SIMULATOR_STANDARD.md`, `tests/presentation-basics.test.mjs`, `CHANGELOG.md` và nhật ký này.
- **Quyết định:** giữ native `disabled` để nút không chạy lệnh, `cursor: default` thay cho `not-allowed`; chỉ áp dụng hover cho nút khả dụng; ẩn thuộc tính title của nút disabled và bỏ tooltip của biểu tượng Text Effects không hoạt động.
- **Kiểm thử:** GitHub Actions validator, unit tests, TypeScript, production build và route smoke; kết quả kiểm thử thực tế xem PR/CI.
- **GitHub commit:** xem squash commit PR `fix/word-disabled-cursor-hover`.
- **Vercel Production:** chỉ xác nhận sau khi READY, SHA bằng GitHub main, alias `xuong-cong-nghe.vercel.app` đã gán.
- **Giới hạn:** chưa kiểm tra hover bằng trình duyệt thật trên nhiều hệ điều hành.


### 2026-10-15 — Thanh Quick Access và bố cục Clipboard/Font theo ảnh Word
- **Mục tiêu:** thêm thanh cửa sổ xám nhạt có Quick Access Toolbar trái, Document1 - Word giữa, 3 nút cửa sổ phải (chỉ X thoát); thiết kế lại Clipboard và Font sát ảnh cắt Word người dùng cung cấp.
- **Phạm vi file:** `src/features/word-simulator/word-window-bar.tsx`, `word-window-bar.css`, `word-simulator.tsx`, `word-home-ribbon.tsx`, `word-home-ribbon.css`, route layout, `docs/WORD_SIMULATOR_STANDARD.md`, `docs/WORD_SIMULATOR_CONTROL_AUDIT.md`, tests, CHANGELOG và WORKLOG.
- **Kiểm tra trước khi sửa:** đối chiếu từng nút với handler thật: Paste quyền clipboard, Cut/Copy vùng chọn, Format Painter, Font family/size, size+/−, Change Case, Clear Format, Bold/Italic/Underline/Strike, sub/superscript, highlight/text color. Nhận diện lỗi Copy làm thay đổi revision và Paste mất vùng chọn.
- **Thực hiện:** Quick Save lưu localStorage tức thời; Undo/Redo gọi trình biên tập và không báo sửa khi không có lịch sử; tên tài liệu chỉnh trong thanh giữa; X lưu rồi chuyển về Công cụ; Min/Max chỉ biểu tượng; Clipboard disable theo selection, xử lý quyền clipboard; Font chỉnh icon, ngắt dòng, khoảng cách và không làm giả hiệu ứng chưa hỗ trợ.
- **Kiểm thử:** GitHub CI validator, unit tests, typecheck, build, smoke; đối chiếu mã/hành vi của từng nút tại `docs/WORD_SIMULATOR_CONTROL_AUDIT.md`. Chưa chạy browser E2E.
- **GitHub:** theo PR `feat/word-window-qat-and-clipboard-font`, SHA cuối sau squash merge ở lịch sử Git.
- **Vercel Production:** xác nhận chỉ khi READY, commit SHA trùng main và alias `xuong-cong-nghe.vercel.app`.
- **Giới hạn:** clipboard phụ thuộc quyền trình duyệt; `execCommand` deprecated và vẫn chưa có DOCX engine/pagination thật.


### 2026-10-15 — Chỉnh thanh Ribbon giả lập Word giống bản Windows được cung cấp
- **Yêu cầu:** bỏ phần trên màu xanh, giữ đủ các tab Ribbon như ảnh, ưu tiên giống nhất các nhóm chức năng Home.
- **File thay đổi:** `src/features/word-simulator/word-simulator.tsx`, `word-home-ribbon.tsx`, `word-home-ribbon.css`, `word-simulator.css`, route layout, `docs/WORD_SIMULATOR_STANDARD.md`, `tests/presentation-basics.test.mjs`, CHANGELOG và nhật ký.
- **UI:** dải tab trắng đủ File/Home/Insert/Design/Layout/References/Mailings/Review/View/Help; Home Ribbon các nhóm Clipboard, Font, Paragraph, Styles, Editing; thứ tự và mật độ công cụ gần ảnh; không có AutoSave, Dictate, Editor, Add-ins, Comments, Share, Sign in.
- **Quyết định:** các lệnh có phản ứng đúng nội dung, tab nâng cao chưa có chỉ rõ chưa hỗ trợ, không tạo nút giả. Bổ sung Change Case, font size +/−, chỉ số trên/dưới, format painter mức cơ bản, styles, tìm/thay thế, giãn dòng và thước đứng.
- **Kiểm thử:** GitHub Actions validator, unit, typecheck, build và route smoke; cần kiểm tra trực quan trên trình duyệt với màn 360/768/1280 và một số trình duyệt.
- **GitHub:** theo PR `feat/word-ribbon-home-fidelity` và commit sau squash merge.
- **Vercel:** chỉ công bố khi READY, cùng SHA GitHub main và alias chính `xuong-cong-nghe.vercel.app`.
- **Giới hạn:** `execCommand` deprecated; DOCX/pagination chuẩn chưa hỗ trợ.


### 2026-10-15 — Công cụ mô phỏng Word độc lập với slide
- **Yêu cầu:** thiết kế công cụ giống bố cục Microsoft Word bản Windows, dùng trực tiếp trên website Xưởng Công Nghệ.
- **Thay đổi:** `src/features/word-simulator/word-simulator.tsx`, `word-simulator.css`, route `/cong-cu/mo-phong-word`, thẻ trang Công cụ, `docs/WORD_SIMULATOR_STANDARD.md`, AGENTS, tests, CHANGELOG.
- **Tương tác:** Ribbon File/Home/Insert/Layout/Review/View, trình soạn thảo thật với A4 và thước, font/bold/italic/list/align, bảng/ảnh, tìm, in/PDF, lưu localStorage và HTML/TXT. Không sử dụng Supabase.
- **Giới hạn:** chỉ là bản thử; chưa hỗ trợ `.docx` nhập/xuất, Word pagination hay đồng tác giả. Dùng `contentEditable` + `execCommand` (deprecated), cần engine chuyên dụng ở giai đoạn sau. Word Lab roadmap giữ riêng sau feature flag.
- **Quy tắc:** lệnh phải có tác dụng, không giả DOCX, tránh tài sản Microsoft, ghi chú đúng tính năng.
- **Kiểm thử:** GitHub CI gồm unit/typecheck/build/route smoke; trình duyệt thật cần được kiểm thử bổ sung.
- **Commit:** xem PR theo tiêu đề `feat(word): standalone desktop Word simulator`.
- **Vercel:** chỉ báo khi READY, SHA trùng main và domain được gán.
- **Tồn đọng:** engine editor, DOCX, pagination, browser E2E.


### 2026-10-15 — Loại bỏ lời dẫn, chỉ dẫn và chú thích kỹ thuật thừa trên slide Word
- **Yêu cầu:** bài giảng do giáo viên trực tiếp giảng; không bồi thêm những câu như “Chọn để xem...”, “Hướng dẫn thao tác...” hoặc giải thích kỹ thuật CSS/React không có giá trị đối với người học.
- **Thay đổi/file:** `src/features/presentations/components/word-purpose-slide.tsx`, `word-purpose.css`, `components/word-workspace.tsx`, `docs/SLIDE_STANDARD.md`, `AGENTS.md`, `CHANGELOG.md`, `tests/presentation-basics.test.mjs`.
- **Quyết định:** slide 2 chỉ giữ chủ đề Word dùng để làm gì, hai khái niệm Soạn thảo/Trình bày và tài liệu minh họa thay đổi định dạng; bỏ câu yêu cầu học viên click, mô tả lợi ích trùng lặp và dòng chú thích mô phỏng CSS. Cùng một ví dụ văn bản được giữ nguyên giữa hai lựa chọn; chỉ khác cách trình bày.
- **Trong 49 Word walkthrough:** loại bỏ dòng giới thiệu CSS/React, disclaimer cuối, nhãn HƯỚNG DẪN THAO TÁC và tip dành cho người dạy khỏi màn chiếu; giữ thao tác Word, nút bước, Ribbon và nội dung bài.
- **Quy tắc:** mọi nhận xét sư phạm, lưu ý về công nghệ/giới hạn mô phỏng và lời dẫn nên chuyển sang `notes`, không hiện trên slide.
- **Kiểm thử:** xác nhận kết quả CI cho PR này, gồm validator, tests, typecheck, build, route smoke.
- **GitHub commit:** xem commit tiêu đề `fix(slides): teacher-led Word slides without meta instructions`.
- **Vercel Production:** chỉ xác nhận sau khi READY, cùng commit `main`, alias chính đã gán.
- **Giới hạn:** chưa kiểm tra trực quan trên máy chiếu.


### 2026-10-15 — Thiết kế riêng slide số 2 bài Làm quen Word
- **Yêu cầu:** không dùng bố cục mẫu ở slide 02 của bài Word đầu tiên; làm đẹp và dễ hiểu bằng thiết kế tùy biến.
- **Thay đổi/file:** `src/features/presentations/components/word-purpose-slide.tsx`, `src/features/presentations/word-purpose.css`, `components/player.tsx`, `data/word-basics.ts`, trang trình chiếu [lessonId], validator, tests, `docs/SLIDE_STANDARD.md`, CHANGELOG và WORKLOG.
- **Quyết định và nội dung:** giữ chủ đề **Word dùng để làm gì?**, bao gồm **Soạn thảo** (tạo/sửa nội dung) và **Trình bày** (định dạng để in hoặc chia sẻ). Dựng bố cục độc lập với tiêu đề rất lớn bên trái, hai nút tương tác và mô hình cửa sổ Word/trang giấy CSS bên phải; chuyển chế độ bằng nút, có aria-pressed và phản hồi aria-live. Không hiển thị nhãn slide loại “KIẾN THỨC”.
- **Quy tắc:** một slide có thể có layout riêng nếu kiến thức có giá trị minh họa tương tác; không cưỡng ép 2 card văn bản; kích thước đáp ứng màn chiếu và mobile. Giao diện Word là minh họa chứ không sửa tệp.
- **Phạm vi:** chỉ slide số 2 của chủ đề `word-lam-quen`; giữ slide khác, số lượng Word (124), Excel (96), File Explorer.
- **Kiểm thử:** GitHub CI kiểm tra unit, validator, TypeScript, production build và smoke test, xem kết quả workflow.
- **GitHub commit:** xem commit theo PR `feat: bespoke interactive Word lesson slide two`.
- **Vercel Production:** chỉ xác nhận sau khi READY, cùng SHA GitHub main và domain chính.
- **Giới hạn:** chưa xác nhận trực quan trên máy chiếu thực tế.


### 2026-10-15 — Bỏ nhãn loại slide ở phía trên tiêu đề và chốt chuẩn slide
- **Yêu cầu:** xóa các dòng chung chung như KIẾN THỨC, THAO TÁC, THỰC HÀNH, CÂU HỎI ÔN TẬP… trên tiêu đề của bài giảng; ghi thành quy tắc cố định.
- **Thay đổi/file:** `src/features/presentations/components/player.tsx`, `lesson-opening-cover.tsx`, `blocks.tsx`, `docs/SLIDE_STANDARD.md`, `docs/PRESENTATION_DESIGN_STANDARD.md`, `AGENTS.md`, `tests/presentation-basics.test.mjs`, `CHANGELOG.md`, `docs/WORKLOG_AND_RULES.md`.
- **Quy tắc:** Tiêu đề nội dung là dòng đầu tiên, nổi bật; không có eyebrow/breadcrumb vô nghĩa. Giữ nhận diện môn học có ý nghĩa ở bìa Word và giữ tên lệnh trong mockup/cấu trúc dữ liệu. Không xóa `slide.eyebrow` khỏi nguồn để bảo toàn ghi chú và logic.
- **Kiểm thử:** GitHub Actions chạy validator, unit tests, typecheck, build và smoke test; ghi kết quả thực tế ở workflow/commit.
- **GitHub commit:** xem commit của PR `fix: clean presentation headings and document slide rules`.
- **Vercel Production:** chỉ xác nhận khi READY, trùng SHA GitHub và domain `xuong-cong-nghe.vercel.app` gán thành công.
- **Hạn chế:** chưa thay thế kiểm tra trực quan trên máy chiếu thực tế.


### 2026-10-15 — Phóng lớn chữ và tối giản Hero Word mở đầu
- **Mục tiêu:** tăng đáng kể font chữ cho slide đầu tiên của chủ đề Word; chỉ giữ nhan đề “Làm quen với Microsoft Word”; xóa nhãn phụ cạnh nút và thay số lớn viền “01” bằng “WORD”.
- **Thay đổi và file:** `src/features/presentations/components/word-home-hero.tsx`, `tests/presentation-basics.test.mjs`, `docs/PRESENTATION_DESIGN_STANDARD.md`, `docs/WORKLOG_AND_RULES.md`, `CHANGELOG.md`.
- **Thiết kế:** giữ nền navy kẻ ô, bố cục hai thẻ chồng và màu cyan; tăng cỡ tiêu đề, mô tả, nút, mục tiêu, nhãn trên mô phỏng Word. Giữ khả năng responsive và điều hướng nút Bắt đầu bài học.
- **Phạm vi:** chỉ slide đầu tiên của bài Word thứ nhất; các slide Word và Excel khác không thay đổi.
- **Kiểm thử:** bổ sung kiểm thử kiểm tra văn bản mới và thành phần cần bỏ; GitHub Actions chạy unit, validator, TypeScript, Production build và smoke route.
- **GitHub commit:** xem commit của PR “Increase Word opening hero typography” trong lịch sử.
- **Vercel Production:** chỉ xác nhận sau khi READY, cùng SHA nhánh main và domain chính được gán.
- **Lưu ý:** kiểm thử tự động không thay thế kiểm tra trực quan trên máy chiếu.


### 2026-10-15 — Slide mở đầu bài Word đầu tiên theo Hero trang chủ
- **Mục tiêu:** riêng slide số 01 của chủ đề `word-lam-quen` sử dụng concept Hero phần đầu trang chủ Xưởng Công Nghệ.
- **Thay đổi và file:** `components/word-home-hero.tsx`, `components/player.tsx`, `data/word-basics.ts`, `scripts/validate-ppt.mjs`, `tests/presentation-basics.test.mjs`, `docs/PRESENTATION_DESIGN_STANDARD.md`, `CHANGELOG.md` và nhật ký này.
- **Quyết định:** tái sử dụng `grid-paper`, `xcn-container`, nền navy, tiêu đề ba dòng, cyan, CTA blue và thẻ mô phỏng xếp chồng hai góc như homepage. CTA **Bắt đầu bài học** điều hướng slide tiếp theo qua trình phát; không tạo header/footer website trong slide.
- **Phạm vi:** Word chủ đề đầu tiên, slide đầu tiên; giữ nguyên 123 slide Word còn lại, toàn bộ Excel và File Explorer.
- **Kiểm thử:** chạy validator, unit, TypeScript, build và smoke route qua CI trên PR.
- **GitHub commit:** xem git history theo tiêu đề `feat(word): homepage-inspired opening slide for lesson one`.
- **Vercel Production:** kiểm tra READY và cùng GitHub main SHA khi triển khai.
- **Tồn đọng:** bố cục responsive cần đối chiếu bằng mắt trên máy chiếu thực tế; giao diện Word là minh họa CSS, không phải phần mềm Word thật.


### 2026-10-14 — Nâng cấp chuyên sâu slide Word cơ bản bằng mô phỏng CSS
- **Mục tiêu:** làm bộ Word cơ bản thật chi tiết, chuyên nghiệp; minh họa giao diện Word bằng CSS/React, hướng dẫn từng bước dễ hiểu.
- **Thay đổi và file:** `data/word-visual-guides.ts`, `components/word-workspace.tsx`, `word-workspace.css`, `data/word-basics.ts`, `components/blocks.tsx`, route trình chiếu, kiểm thử, chuẩn trình chiếu và CHANGELOG.
- **Nội dung:** giữ 75 slide Word hiện có, thêm 49 slide Word UI mô phỏng (tổng 124), đủ 4 chủ đề: giao diện/lưu; định dạng; trang/bảng/ảnh/mục lục; rà soát/in/PDF. Mỗi mô phỏng có 3 bước, vị trí lệnh, giải thích, kết quả, lưu ý và ghi chú giảng viên.
- **Quy tắc:** tiếp tục màu navy/blue/cyan/ice; mô phỏng **không** phải ứng dụng Word chạy thật; sử dụng dữ liệu/hình minh họa tự tạo CSS, không sử dụng tài sản thương hiệu của bên thứ ba; Excel không thay đổi.
- **Kiểm thử:** chạy validator, unit tests, typecheck, build và smoke routes trong GitHub Actions; xác nhận bằng kết quả CI tương ứng commit.
- **GitHub commit:** xem commit với tiêu đề `feat(word): immersive step-by-step CSS Word slides` trong Git history.
- **Vercel Production:** chỉ xác nhận khi deployment READY và trùng GitHub main SHA.
- **Giới hạn:** kiểm thử tự động không thay thế review thực tế trên máy chiếu hoặc Microsoft Word các phiên bản khác nhau.


### 2026-10-14 — Bổ sung giáo trình slide Word và Excel cơ bản
- **Mục tiêu:** 2 khóa trình chiếu độc lập Word cơ bản / Excel cơ bản, đủ nền tảng, có ví dụ, thực hành và quiz.
- **Thay đổi và file:** `src/features/presentations/data/basics-builder.ts`, `word-basics.ts`, `excel-basics.ts`, `catalog.ts`, route trình chiếu, trang thư viện, kiểm thử, tài liệu chuẩn trình chiếu.
- **Quyết định:** tổ chức từng môn thành các chủ đề không cố định số buổi; tái sử dụng player và layout hiện tại, giữ File Explorer gốc và 15 mẫu; Word/Excel mô phỏng dữ liệu, không giả làm phần mềm Office tương tác.
- **Kiểm thử:** kiểm tra validate-ppt, `pnpm test`, `pnpm typecheck`, `pnpm build`, smoke route qua GitHub Actions sau commit.
- **GitHub commit:** xem commit trong git history theo tiêu đề `feat: publish Word and Excel basics slide curricula`.
- **Vercel Production:** xác minh theo SHA deployment tương ứng sau khi release.
- **Tồn đọng:** không xuất `.pptx` vì bộ bài sử dụng hệ slide native của website; có thể xây dựng công cụ xuất riêng nếu được yêu cầu.


### 2026-10-14 — Chuẩn hóa palette 4 màu và tài liệu dự án
- **Mục tiêu:** dùng navy / blue / cyan / ice từ ảnh người dùng gửi cho nhận diện toàn website; yêu cầu các lần sửa sau có tài liệu đối chiếu.
- **Thay đổi:** token Tailwind và CSS nền, home, tool, thẻ khóa học, dashboard, CTA, trình chiếu; `AGENTS.md`, `docs/BRAND.md`, `docs/DESIGN_SYSTEM.md`, `docs/DECISIONS.md`, `CHANGELOG.md`, test palette.
- **Quyết định:** blue cho CTA và thanh tiến độ; cyan cho điểm nhấn trên navy; ice cho background phụ. Giữ xanh lá/đỏ semantic và màu biểu tượng file khi cần minh họa.
- **Kiểm thử:** thêm bài kiểm thử token/contrast convention/worklog. Kết quả CI/Vercel xem ở deployment gắn với commit.
- **GitHub commit:** xem lịch sử commit gắn với nội dung tài liệu này.
- **Vercel Production:** xem deployment tương ứng commit sau khi phát hành.
- **Tồn đọng:** không đổi ảnh OG/logo PNG do yêu cầu tập trung vào màu UI.

### 2026-10-14 — Hoàn tác cuộn từng section của trang chủ
- **Mục tiêu:** trở lại cuộn liên tục, không snap hay khóa section theo toàn màn hình.
- **GitHub:** revert commit `6935b346` bằng `0f982b32aca654b023174fb9bf19aa47de05032b`.
- **Vercel:** Production READY tại `https://xuong-cong-nghe.vercel.app` cho commit `0f982b32`, đã xác minh ở lượt làm việc trước.
