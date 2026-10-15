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
