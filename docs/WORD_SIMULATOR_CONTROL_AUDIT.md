# Đối chiếu nút Word — Quick Access, Clipboard, Font

Ngày: 15/10/2026. Nguồn hình: ảnh người dùng cung cấp, gồm Clipboard và Font trong Word desktop. Bảng này là **kiểm tra mã/hành vi dự kiến và kiểm thử tự động**, không phải kết quả đã trực tiếp bấm từng nút trong trình duyệt.

## Quick Access / Window

| Thành phần | Kiểm tra trước sửa | Sau sửa / hành vi |
|---|---|---|
| Save | Chưa có trên thanh trên | Lưu localStorage ngay, hiển thị trạng thái |
| Undo / Redo | Chỉ nằm trong Home phiên bản cũ; gọi execCommand | QAT nối trực tiếp lệnh Undo/Redo, trả thông báo khi không còn lịch sử |
| Mũi tên Quick Access | Chưa có | Menu Save / New / Print, thao tác tương ứng |
| Tên Document1 | Ở mép phải thanh tab | Ở giữa cửa sổ, chỉnh tên được |
| Minimize / Maximize | Không có | Hai icon trang trí, không gây hành vi giả |
| Close X | Không có | Lưu nháp tức thì rồi trở về /cong-cu |

## Clipboard

| Nút | Trước sửa | Sau sửa / hành vi |
|---|---|---|
| Paste | Đọc clipboard bất đồng bộ có thể làm mất vùng chọn | Giữ Range, đọc clipboard, fallback Ctrl+V khi bị chặn |
| Cut | execCommand và luôn markChanged dù thất bại | Chỉ khả dụng khi chọn chữ; ưu tiên execCommand; fallback writeText+delete khi được phép; chỉ markChanged nếu cắt thành công |
| Copy | execCommand rồi đánh dấu chỉnh sửa dù không đổi văn bản | Chỉ khả dụng khi chọn chữ; execCommand hoặc clipboard.writeText; không markChanged |
| Format Painter | Không chặn khi chưa chọn chữ | Chỉ khả dụng khi chọn chữ; bật trạng thái chọn vùng đích, áp dụng font, màu, đậm, nghiêng |

## Font

| Nút | Hành vi được kiểm tra |
|---|---|
| Font family (Aptos) | Chọn font rồi execCommand fontName trên vùng chọn |
| Font size (12) | 1–7 mapping theo rich text editor (3 tương đương 12pt gần đúng), không nhận là kích cỡ Word hoàn toàn chuẩn |
| Grow / Shrink Font | Tăng/giảm số mức font và áp dụng |
| Change Case (Aa) | Đổi chữ hoa/thường trong vùng chọn |
| Clear Formatting (A + eraser) | removeFormat |
| Bold B | bold |
| Italic I | italic |
| Underline U ▾ | underline (mũi tên trang trí, chưa có nhiều loại gạch chân) |
| Strikethrough | strikeThrough |
| Subscript x₂ | subscript |
| Superscript x² | superscript |
| Text Effects A | Không có engine đúng; biểu tượng mờ không tương tác, **không ánh xạ giả sang Bold** |
| Text Highlight Color | color picker > hiliteColor |
| Font Color | color picker > foreColor |

## Trạng thái kiểm chứng

- Kiểm thử tự động: kiểm tra sự tồn tại và mapping của các handler, trạng thái vùng chọn, CSS/khả năng responsive, typecheck, production build và smoke route.
- **Chưa kiểm thử E2E trên browser thật:** cần xác nhận Copy/Cut/Paste với quyền clipboard, giữ selection khi mở color picker, Undo/Redo trên từng trình duyệt, Format Painter với chữ đang có nhiều kiểu và kiểm tra pixel theo ảnh.
- Các chức năng vẫn dựa trên `document.execCommand` đã deprecated; không tuyên bố tương đương Microsoft Word bản chính thức.
