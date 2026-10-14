# Trình chiếu — Thiết kế native Xưởng Công Nghệ

## Nguyên tắc
Dựa trên **ý tưởng** từ repo PPT: bài giảng dưới dạng dữ liệu, 15 layout, thành phần tái sử dụng và bài giảng dùng chung cho nhiều lớp. Toàn bộ UI được làm lại bằng Next.js + React theo phong cách Xưởng Công Nghệ (màu ink, trắng/xám, điểm nhấn lime, typography và bố cục chung). Không sử dụng iframe, CSS hoặc engine HTML cũ.

## Kiến trúc
- `src/features/presentations/data/`: nội dung 29 slide File Explorer và 15 slide mẫu.
- `src/features/presentations/types.ts`: schema slide, block, 15 layout tái sử dụng.
- `src/features/presentations/catalog.ts`: môn học / phần nội dung; tên lớp nhập khi bắt đầu trình chiếu.
- `src/features/presentations/components/blocks.tsx`: các khối trình chiếu dạng React, câu hỏi, mô phỏng, bảng, tài liệu.
- `src/features/presentations/components/player.tsx`: slide canvas, thanh tiến độ, điều hướng, chọn đáp án, mô phỏng, phím tắt, ghi chú, fullscreen.
- `src/features/presentations/presentation.css`: lưới 15 layout và responsive.

## Đường dẫn
- `/cong-cu`: danh mục công cụ.
- `/cong-cu/trinh-chieu`: danh mục các phần nội dung.
- `/cong-cu/trinh-chieu/quan-ly-tep-va-thu-muc`: mở phần Quản lý tệp và thư mục, **nhập tên lớp ngay khi mở**.
- `/cong-cu/trinh-chieu/layout-gallery`: các layout mẫu.
- URL HTML cũ ở `/apps/ppt/index.html` và `/apps/ppt/slides.html` được chuyển hướng về trang mới.

## Mở rộng
Thêm phần nội dung/môn học mới bằng cách tạo dữ liệu theo schema rồi đăng ký trong catalog; **không cần HTML/CSS riêng cho từng bài**. Về sau có thể thêm editor, lưu nội dung trong Supabase và phân quyền tác giả mà không phải thay trình chiếu. Hai tệp dữ liệu gốc tạm dùng `@ts-nocheck`, nhưng toàn bộ renderer và logic UI mới được typecheck.

## Phạm vi hiện tại
Có 29 slide học tập, 5 câu hỏi, hai mô phỏng Copy/Move, File Explorer, ghi chú và fullscreen. Chưa có công cụ biên tập, xuất .pptx, điểm số Supabase hay quyền truy cập riêng.
Source nội dung từ `huunghia160699/dev-Ppt_Website`, commit `e81104f08ddaa853bd4c331d4a106be8ce9a4be8`. Không thay đổi repo gốc.

## Kiểm thử
`node --experimental-strip-types scripts/validate-ppt.mjs`, `pnpm test`, `pnpm typecheck`, `pnpm build`.

## Nguyên tắc học theo phần

Cấu trúc: **Môn Tin học cơ bản → Quản lý tệp và thư mục → Các slide/chủ đề tương tác**. Không cố định thời lượng mỗi phần theo Buổi 1/Buổi 2 hoặc Bài 01. Khi phát triển các nội dung Word, Excel sau này, thêm phần chủ đề mới vào catalog, không đặt tên theo lịch dạy.

Đường dẫn cũ `/cong-cu/trinh-chieu/buoi-01-file-explorer` được chuyển hướng **308** sang `/cong-cu/trinh-chieu/quan-ly-tep-va-thu-muc`; liên kết lớp `?class=hl-26-27` được giữ nguyên.

## Tên lớp và thanh điều khiển

Thư viện không hiển thị danh sách lớp có sẵn. Khi vào trình chiếu của một chủ đề, ứng dụng yêu cầu nhập tên lớp (tối đa 40 ký tự). Tên lớp chỉ tồn tại trong trạng thái trình duyệt của phiên trình chiếu, không được ghi Supabase hay cấu hình cứng trong catalog. URL cũ có `?class=hl-26-27` được dùng để gợi ý điền sẵn, có thể thay đổi. Thư viện 15 bố cục là chế độ xem trước, không yêu cầu lớp.

Viên thuốc góc trái chỉ hiển thị `Tên lớp | Tên môn`; mọi điều khiển được đặt ở viên thuốc phải theo thứ tự **quay lại → làm lại → ghi chú → đổi lớp → trước → số trang → sau → toàn màn hình**. Trên màn hình hẹp, nhóm công cụ phụ thu gọn trong nút Tùy chọn thuộc chính viên thuốc phải.
