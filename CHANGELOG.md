# Changelog

## 2026-10-15 — Icon Indent còn bốn dòng

- Đơn giản hóa Decrease/Increase Indent: mỗi icon chỉ có bốn đường kẻ ngang, hai dòng giữa nhường chỗ cho mũi tên xanh, dễ nhìn hơn.
- Giữ nguyên thao tác tăng/giảm thụt lề và các công cụ Word khác.


## 2026-10-15 — Icon tăng cỡ chữ và Paragraph gần Word hơn

- Mũi tên tăng/giảm cỡ chữ chuyển sang dạng tam giác nằm trên đầu phía bên phải chữ A.
- Multilevel List hiển thị ba cấp thụt dần 1/a/i; hai icon Indent là dòng văn bản và mũi tên xanh trái/phải.
- Giãn dòng hiển thị hai đầu mũi tên chung một trục dọc; Sort có A xanh/Z đậm ở trái và mũi tên xuống bên phải.
- Chỉ thay SVG/CSS và không đổi chức năng, vị trí Ribbon, hành vi disabled.


## 2026-10-15 — Hoàn thiện nhóm Paragraph Word

- Thiết kế lại nhóm Paragraph thành hai hàng icon nhỏ chuẩn kiểu Word, giãn đều từ trái sang phải và có các vạch phân nhóm.
- Làm mới icon danh sách, thụt lề, sắp xếp, dấu ¶, căn đoạn, giãn dòng, tô nền và đường viền.
- Multilevel List chèn danh sách lồng nhau, Shading tô nền cả đoạn; giữ nguyên hành vi các lệnh đúng trước đó.
- CSS nhóm Paragraph riêng, import cuối để tránh xung đột nhóm Font.


## 2026-10-15 — Sửa hàng trên Font dàn đều đúng thực tế

- Khắc phục khai báo `justify-content: start` vô tình ghi đè `space-between`, khiến hàng trên Font vẫn dồn trái.
- Hàng trên hiện được CSS dàn đều khoảng trống hai bên tương tự hàng dưới; giữ nguyên nút, đường phân cách, cỡ chữ và chức năng.
- Thêm kiểm thử hồi quy để ngăn xung đột cùng thuộc tính CSS trong nhóm Font.


## 2026-10-15 — Căn hàng trên và các vạch ngăn nhóm Font

- Dàn đều các công cụ hàng trên của nhóm Font từ trái sang phải tương tự hàng dưới.
- Thêm hai vạch dọc xám mảnh bao quanh nút **Aa** và một vạch bên phải **x²**.
- Thay biểu tượng Clear Formatting bằng hình cục tẩy nguyên vẹn; giữ nguyên thao tác xóa định dạng và toàn bộ các nút khác.


## 2026-10-15 — Căn chỉnh các biểu tượng nhóm Font

- Thay phông **B** và **U** bằng chữ không chân (Arial/Segoe UI).
- Hai chữ **A** lớn/nhỏ của nút tăng/giảm cỡ chữ cùng đường chân, dù khác kích thước; mũi tên không làm xê dịch biểu tượng.
- Các công cụ của hàng thứ hai nhóm Font được giãn đều toàn bộ chiều ngang thay vì dồn về bên trái.
- Giữ nguyên thứ tự các nút, thao tác thật và quy tắc disabled không hover.


## 2026-10-15 — Nhóm Font Word tinh chỉnh theo ảnh tham khảo

- Thiết kế lại nhóm Font thành hai hàng thẳng hàng, cỡ chữ, viền và khoảng cách thống nhất; ô chọn phông chữ và cỡ chữ có mũi tên đúng vị trí.
- Làm lại từng ký hiệu A tăng/giảm cỡ, Aa, Clear Formatting, B/I/U, gạch ngang, x₂/x² và các công cụ màu cho gần Word desktop.
- Text Effects chưa hỗ trợ vẫn mờ và không có hover/tooltip; hai thanh màu cập nhật theo màu thực tế đã chọn.
- CSS nhóm Font được quản lý riêng nhằm tránh xung đột các quy tắc Ribbon cũ; giữ nguyên các nhóm khác và thao tác hiện có.


## 2026-10-15 — Nút disabled trong Ribbon Word

- Nút chưa thể sử dụng vẫn hiển thị trạng thái mờ nhưng dùng con trỏ mũi tên bình thường, không xuất hiện biểu tượng cấm màu đỏ.
- Không có hiệu ứng hover hay tooltip trên nút disabled; nút đang khả dụng hoạt động và hiển thị hover như trước.
- Không thay đổi điều kiện bật/tắt hoặc hành vi các chức năng Word.


## 2026-10-15 — Quick Access Toolbar và Clipboard/Font sát ảnh Word

- Thêm thanh cửa sổ sáng: Quick Access Save/Undo/Redo/menu bên trái, tên tài liệu giữa, 3 biểu tượng cửa sổ phải với nút X thoát về Công cụ.
- Căn lại nhóm Clipboard (Paste lớn, Cut/Copy/Format Painter dọc) và Font (hai hàng, font/cỡ, các icon 25–30px); thêm icon Text Effects mờ khi chưa hỗ trợ.
- Kiểm tra và sửa clipboard: Copy không thay đổi bản nháp, Cut/Copy/Format Painter chỉ hoạt động khi có vùng chọn, Paste giữ selection với fallback Ctrl+V, Undo/Redo không báo lưu khi thất bại.
- Giữ trang A4, các tab/nhóm khác, không thêm tính năng cloud.


## 2026-10-15 — Ribbon Home tương tự Word trên Windows

- Bỏ thanh xanh phía trên; tất cả tab Ribbon Word desktop hiển thị ở hàng đầu tiên.
- Thiết kế lại Home thật gọn theo các nhóm Clipboard, Font, Paragraph, Styles, Editing; bố cục icon hai hàng và gallery Styles sát ảnh.
- Giữ lệnh tương tác và bổ sung font size tăng/giảm, định dạng, giãn dòng, Styles, Replace/Select; thêm thước dọc.
- Bỏ chức năng không liên quan như AutoSave, Dictate, Editor, Add-ins, Comments, Share, Sign in. Tab nâng cao chưa hỗ trợ không tạo chức năng giả.


## 2026-10-15 — Công cụ mô phỏng Microsoft Word

- Bổ sung đường dẫn `/cong-cu/mo-phong-word` với Ribbon và trình soạn thảo A4 để thực hành Word trên web.
- Có thao tác định dạng, căn lề, danh sách, heading, bảng, ảnh, tìm kiếm, zoom, in/PDF, tự lưu localStorage và xuất HTML/TXT.
- Thêm thẻ công cụ trên trang Công cụ; giữ nguyên slide Word/Excel và Word Lab đang lên kế hoạch.
- Chưa hỗ trợ định dạng DOCX thật hoặc dàn trang tương đương Word.


## 2026-10-15 — Slide Word gọn và tập trung nội dung giảng dạy

- Bỏ dòng “Chọn một chức năng để xem sự thay đổi...”, chú thích kỹ thuật về CSS, lời dẫn thừa và phần tóm tắt lặp lại ở slide 02.
- Giữ hai chế độ tương tác Soạn thảo / Trình bày; cùng một nội dung Word thực tế được trình bày theo hai kiểu để học viên thấy khác biệt.
- Gỡ nhãn “HƯỚNG DẪN THAO TÁC”, chú thích CSS/React và tip của người dạy khỏi 49 slide mô phỏng Word; giữ điều khiển và thao tác có giá trị học tập.
- Cập nhật tiêu chuẩn slide, AGENTS và kiểm thử để tránh lặp lại lỗi thiết kế này.


## 2026-10-15 — Slide 02 Word thiết kế tương tác độc lập

- Thay bố cục hai thẻ lý thuyết ở slide số 2 của bài **Làm quen Word** bằng màn trình chiếu tùy biến, không sử dụng grid mẫu.
- Hai lựa chọn **Soạn thảo** và **Trình bày** tương tác với bản mô phỏng Word bằng CSS; chữ lớn, tương phản rõ và bố cục responsive.
- Giữ nguyên kiến thức, ghi chú giáo viên, điều hướng slide, tổng số slide Word/Excel; bổ sung chuẩn slide và kiểm thử.


## 2026-10-15 — Loại bỏ các nhãn thừa trên tiêu đề slide

- Ẩn các dòng như **KIẾN THỨC**, **THAO TÁC**, **THỰC HÀNH**, **CÂU HỎI ÔN TẬP**, **BÀI GIẢNG** phía trên tiêu đề tất cả slide nội dung.
- Gỡ nhãn phụ không cần thiết ở bìa File Explorer và thẻ khái niệm; giữ nguyên tiêu đề, nội dung, tương tác, nhãn chuyên môn cần thiết và nhận diện môn ở bìa Word.
- Thêm tài liệu quy tắc **`docs/SLIDE_STANDARD.md`**, tham chiếu bắt buộc trong `AGENTS.md` và chuẩn trình chiếu; có test ngăn nhãn thừa quay lại.


## 2026-10-15 — Chữ lớn hơn trên slide mở đầu Word

- Chỉ giữ tiêu đề **Làm quen với Microsoft Word**, làm lớn đáng kể typography phần Hero, nút và thẻ mục tiêu.
- Bỏ dòng **qua thực hành.** khỏi tiêu đề và bỏ dòng **Nhập liệu · Chỉnh sửa · Lưu văn bản** cạnh nút.
- Thay số lớn nét viền **01** bằng chữ **WORD**, giữ nền navy kẻ ô, hình Word CSS và điều hướng bài học.


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
