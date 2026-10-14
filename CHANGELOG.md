# Changelog

## 2026-10-15 — Hero trang chủ cho slide mở đầu Word

- Thiết kế lại riêng slide mở đầu `Làm quen Microsoft Word` dựa trên Hero trang chủ: navy kẻ ô, tiêu đề lớn điểm nhấn cyan, hai thẻ minh họa xếp chồng và ba mục tiêu.
- Nút **Bắt đầu bài học** chuyển sang slide kế tiếp, có hỗ trợ bàn phím/focus; giữ nguyên 124 slide Word và các chương trình khác.
- Ghi quy tắc bố cục vào chuẩn trình chiếu và nhật ký dự án.

## 2026-10-14 — Word cơ bản chuyên sâu với mô phỏng CSS

- Giữ 75 slide Word có sẵn, thêm 49 slide hướng dẫn thao tác Microsoft Word qua mô phỏng Ribbon, thước, trang giấy, hộp thoại File/Print/Export, bảng và ảnh vẽ bằng CSS/React.
- Mỗi mô phỏng có các bước tương tác, lệnh được tô nổi, kết quả cần kiểm tra và ghi chú giảng viên. Tổng Word tăng lên 124 slide, bốn chủ đề riêng.
- Tăng độ chi tiết thao tác từ tạo/lưu, định dạng, bảng/ảnh, mục lục đến in PDF; responsive theo kích thước trình chiếu.
- Giữ nguyên 96 slide Excel cơ bản, File Explorer và luồng học khác; bổ sung kiểm thử chất lượng.

## 2026-10-14 — Hai bộ slide Word/Excel cơ bản

- Thêm chương trình Word cơ bản (4 chủ đề) và Excel cơ bản (5 chủ đề) thành hai nhóm riêng trong thư viện trình chiếu.
- Bổ sung nhiều slide kiến thức, ví dụ bảng/văn bản, hướng dẫn thực hành, quiz có đáp án và ghi chú giảng viên.
- Tự động tạo route cho các chủ đề trong catalog, giữ nguyên bài Windows/File Explorer và bộ layout demo.
- Cập nhật tài liệu chuẩn slide và nhật ký yêu cầu; không thay đổi chức năng học viên hay dữ liệu Supabase.

## 2026-10-14 — Bảng màu nhận diện và nhật ký bắt buộc

- Áp dụng navy `#04122D`, blue `#005BFD`, cyan `#00E9FD`, ice `#F0F6FD` cho website, khu học tập và công cụ trình chiếu.
- CTA blue chữ trắng; cyan dùng làm điểm nhấn nền tối. Thay màu lime thương hiệu.
- Giữ trang chủ cuộn tự nhiên, không scroll-snap.
- Thêm `docs/WORKLOG_AND_RULES.md` ghi quy tắc và nhật ký bắt buộc sau từng yêu cầu.

## 0.1.0 — 2026-08-19

- Khởi tạo Next.js + TypeScript + Tailwind.
- Thêm public, student và admin app shell.
- Thêm 5 màn hình gốc với dữ liệu mẫu.
- Thêm design system, tài liệu kiến trúc và Supabase schema mẫu.
