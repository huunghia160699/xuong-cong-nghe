# Tiêu chuẩn công cụ mô phỏng Word — Xưởng Công Nghệ

Ngày: 15/10/2026. Đường dẫn: `/cong-cu/mo-phong-word`.

## Mục tiêu
- Đây là công cụ độc lập, không phải slide và **không phải phần mềm Word của Microsoft**.
- Giao diện mô phỏng Word desktop trên Windows (thanh tiêu đề, Ribbon, trang A4, thước, zoom, status bar).
- Các nút hiển thị phải có tác dụng thực tế; không được tạo một giao diện trông có thể sử dụng nhưng chỉ chứa nút giả.
- Không sao chép icon/logo/tài sản hoặc mã nguồn độc quyền Microsoft. Màu Word là dấu hiệu chuyên môn, các tương tác chính dùng bộ màu Xưởng Công Nghệ.
- Đây là bản thử riêng, không mở Word Lab hoàn chỉnh trong roadmap đang bị giới hạn bằng feature flag.

## Chức năng trong bản đầu
- File: tạo tài liệu, mở HTML/TXT, xuất HTML/TXT, in hoặc lưu PDF qua hộp thoại trình duyệt.
- Home: gõ và chọn văn bản, copy/cut/paste, undo/redo, font, size, bold/italic/underline/strike, màu chữ, căn đoạn, danh sách, heading.
- Insert: bảng đơn giản, ảnh PNG/JPEG/WebP/GIF, link, đường kẻ, ngắt trang ở mức minh họa.
- Layout: trang A4 dọc/ngang, lề thông thường/hẹp.
- Review: kiểm tra chính tả từ trình duyệt, tìm văn bản cơ bản, đếm từ/ký tự.
- View: hiển thị thước, zoom, toàn màn hình.
- Bản nháp tự lưu 750 ms trong localStorage theo trình duyệt, **không đồng bộ giữa các máy**, không lưu trên máy chủ.
- Nhập tệp HTML/TXT tối đa 1 MB, ảnh tối đa 2 MB, lọc HTML nguy hiểm, dán text thuần. Không nhập dữ liệu bí mật trong bản thử.

## Giới hạn bắt buộc công bố
- **Chưa thể mở hoặc xuất DOCX thật**, không được giả DOCX bằng cách đổi đuôi tệp HTML.
- `contentEditable` + `document.execCommand` là nền tảng chức năng cơ bản trong nhiều trình duyệt, nhưng API execCommand đã deprecated. Nâng lên ProseMirror/Tiptap khi mở rộng.
- Chưa có pagination Word chuẩn, Track Changes, Comment, mục lục tự động, Header/Footer, SmartArt, floating objects, layout Word chính xác, hay cộng tác trực tuyến.
- Tệp PDF và định dạng in phụ thuộc trình duyệt/người dùng; page break chỉ là mô phỏng.

## Giai đoạn kế tiếp
1. Engine editor có cấu trúc document model và điều khiển selection/undo ổn định.
2. OOXML/DOCX round-trip thực, pagination và các trang A4 chuẩn.
3. Nội dung thực hành có thể đánh giá kết quả, tài khoản và đồng bộ khi backend hoàn thiện.
4. Kiểm thử browser: bàn phím, selection, clipboard, hành vi mobile 360/768/1280, import HTML, bảo mật và in.

## Checklist
- [ ] Lệnh có tác dụng, không chỉ vẽ icon.
- [ ] Gõ, chọn, định dạng, undo/redo, thêm bảng/ảnh.
- [ ] Tạo/mở/lưu cục bộ, xuất HTML/TXT, Print/PDF.
- [ ] Responsive, keyboard focus, đủ tương phản.
- [ ] Không quảng cáo DOCX khi chưa có engine thật.
- [ ] Kiểm thử typecheck/build/test và URL sau triển khai.
- [ ] Ghi nhật ký Markdown và xác nhận Vercel READY/SHA.

## 15/10/2026 — Ribbon Word Desktop theo ảnh người dùng

- **Bỏ toàn bộ thanh tiêu đề nền xanh** của công cụ. Hàng đầu tiên là dải tab màu trắng, cùng nút quay lại Công cụ.
- Hiển thị đầy đủ: File, Home, Insert, Design, Layout, References, Mailings, Review, View, Help. Những tab chưa được phát triển chỉ hiển thị trạng thái chưa hỗ trợ, không có nút giả.
- Home gần ảnh tham khảo: Clipboard (Paste lớn bên trái, Cut/Copy/Format Painter bên phải); Font (hai hàng, chọn phông và size); Paragraph (hai hàng icon); Styles (gallery ngang); Editing (Find, Replace, Select).
- Nhãn nhóm đặt nhỏ và căn giữa chân Ribbon; phân cách các nhóm bằng viền dọc mảnh, không dùng thẻ/card lớn cho từng nút.
- Không có AutoSave, Dictate, Editor, Add-ins, Comments, Share, Sign in. Không biến tác vụ nâng cao thành một tác vụ khác chỉ để bấm được.
- Lệnh Home cần tương tác thật: format, size, tăng/giảm size, Change Case, clear format, sub/superscript, list/indent, align, line-spacing, border, shading, gallery style, Find/Replace/Select.
- Giữ vùng soạn thảo giấy A4 với thước ngang và dọc, thanh trạng thái, zoom, tự lưu cục bộ. Màn nhỏ cuộn ngang Ribbon khi cần.
- Vẫn chưa có engine DOCX, dàn trang nhiều trang Word chuẩn, và nhiều thao tác nâng cao; không được giới thiệu là Word Microsoft chính thức.

## 15/10/2026 — Quick Access Toolbar, cửa sổ và Clipboard/Font chuẩn Word

- Theo ảnh chụp người dùng cung cấp, thanh trên có nền **xám rất nhạt** (không quay lại nền xanh), Quick Access Toolbar bên trái (Save, Undo, Redo, mở menu), tên tài liệu giữa dạng `Document1 - Word`, bên phải đủ 3 biểu tượng Minimize, Maximize, Close. Chỉ **Close (X)** có tương tác thoát về `/cong-cu`; hai biểu tượng còn lại là trang trí, không giả lập khả năng điều khiển cửa sổ trình duyệt.
- Save trong Quick Access **lưu dữ liệu localStorage ngay**; Undo/Redo thao tác trên rich-text editor; menu mũi tên nhỏ có Save/New/Print thực, không gắn một handler không liên quan.
- **Clipboard:** Paste là nút lớn; Cut/Copy/Format Painter xếp dọc. Cut/Copy/Format Painter không hoạt động khi chưa chọn chữ. Copy không làm tăng revision/lưu giả; Cut chỉ cập nhật khi cắt thành công; Paste đọc clipboard với fallback Ctrl+V khi browser chặn; Format Painter chụp định dạng nguồn và áp dụng lên vùng đích.
- **Font:** chọn phông và cỡ, tăng/giảm cỡ, Change Case, Clear Formatting, Bold/Italic/Underline/Strike, Subscript/Superscript, highlight color và font color. Icons được căn vị trí/thang 25–30px giống ảnh. Text Effects (không có triển khai đúng) chỉ là biểu tượng mờ không tương tác, không được gán giả thành Bold.
- Bổ sung kiểm thử chống hồi quy cho vị trí thanh, chức năng lưu, sự kiện Cut/Copy/Paste và không làm sai định dạng. Kiểm tra browser tương tác thực tế vẫn phải được làm riêng (không được gọi kiểm thử tĩnh là test E2E).

## 15/10/2026 — Trạng thái nút vô hiệu hóa trong Ribbon

- Nút `disabled` vẫn hiện diện, giảm độ đậm như Word và **không chạy lệnh**.
- Con trỏ di qua nút vô hiệu hóa là **mũi tên bình thường** (`cursor: default`), tuyệt đối không dùng `cursor: not-allowed` hoặc biểu tượng cấm màu đỏ.
- Không tạo hiệu ứng `hover` (màu nền, viền, bóng, đổi trạng thái) và không hiển thị tooltip hướng dẫn của nút khi bị vô hiệu hóa.
- Nút đang khả dụng vẫn giữ hiệu ứng hover/focus bình thường. Áp dụng nhất quán cho Home Ribbon và các nút lệnh Ribbon còn lại. Không thay đổi điều kiện hoạt động Cut/Copy/Format Painter hay các thao tác tài liệu.
