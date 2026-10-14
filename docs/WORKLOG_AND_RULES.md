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
