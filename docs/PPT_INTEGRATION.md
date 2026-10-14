# Trình chiếu — Thiết kế native Xưởng Công Nghệ

## Nguyên tắc
Dựa trên **ý tưởng** từ repo PPT: bài giảng dưới dạng dữ liệu, 15 layout, thành phần tái sử dụng và bài giảng dùng chung cho nhiều lớp. Toàn bộ UI được làm lại bằng Next.js + React theo phong cách Xưởng Công Nghệ (màu ink, trắng/xám, điểm nhấn lime, typography và bố cục chung). Không sử dụng iframe, CSS hoặc engine HTML cũ.

## Kiến trúc
- `src/features/presentations/data/`: nội dung 29 slide File Explorer và 15 slide mẫu.
- `src/features/presentations/types.ts`: schema slide, block, 15 layout tái sử dụng.
- `src/features/presentations/catalog.ts`: môn học / bài giảng / lớp học.
- `src/features/presentations/components/blocks.tsx`: các khối trình chiếu dạng React, câu hỏi, mô phỏng, bảng, tài liệu.
- `src/features/presentations/components/player.tsx`: slide canvas, thanh tiến độ, điều hướng, chọn đáp án, mô phỏng, phím tắt, ghi chú, fullscreen.
- `src/features/presentations/presentation.css`: lưới 15 layout và responsive.

## Đường dẫn
- `/cong-cu`: danh mục công cụ.
- `/cong-cu/trinh-chieu`: danh mục bài giảng.
- `/cong-cu/trinh-chieu/buoi-01-file-explorer?class=hl-26-27`: bài giảng lớp HL.26-27.
- `/cong-cu/trinh-chieu/layout-gallery`: các layout mẫu.
- URL HTML cũ ở `/apps/ppt/index.html` và `/apps/ppt/slides.html` được chuyển hướng về trang mới.

## Mở rộng
Thêm bài giảng/môn học mới bằng cách tạo dữ liệu theo schema rồi đăng ký trong catalog; **không cần HTML/CSS riêng cho từng bài**. Về sau có thể thêm editor, lưu nội dung trong Supabase và phân quyền tác giả mà không phải thay trình chiếu. Hai tệp dữ liệu gốc tạm dùng `@ts-nocheck`, nhưng toàn bộ renderer và logic UI mới được typecheck.

## Phạm vi hiện tại
Có 29 slide học tập, 5 câu hỏi, hai mô phỏng Copy/Move, File Explorer, ghi chú và fullscreen. Chưa có công cụ biên tập, xuất .pptx, điểm số Supabase hay quyền truy cập riêng.
Source nội dung từ `huunghia160699/dev-Ppt_Website`, commit `e81104f08ddaa853bd4c331d4a106be8ce9a4be8`. Không thay đổi repo gốc.

## Kiểm thử
`node --experimental-strip-types scripts/validate-ppt.mjs`, `pnpm test`, `pnpm typecheck`, `pnpm build`.
