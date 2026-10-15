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

## 15/10/2026 — Chuẩn thị giác nhóm Font theo ảnh Word

- Font được tách stylesheet riêng `src/features/word-simulator/word-font-ribbon.css`, import **sau** các stylesheet Word cũ để tránh xung đột quy tắc độ rộng, grid/flex hoặc media query.
- Giữ đúng **hai hàng**: hàng 1 gồm tên phông, cỡ chữ, Grow Font, Shrink Font, Change Case, Clear Formatting; hàng 2 gồm Bold, Italic, Underline, Strikethrough, Subscript, Superscript, Text Effects (disabled), Text Highlight Color và Font Color.
- Ô chọn phông/cỡ chữ cao 25px, viền mảnh trung tính, mũi tên đồng nhất; các icon ở dạng nét chữ B/I/U, x₂, x², chữ Aa với vị trí và khoảng cách gần ảnh Word desktop; tên nhóm Font ở chân Ribbon.
- Nút gạch chân có mũi tên nhỏ nằm **trong cùng nút**, không tạo menu không hoạt động. Text Effects vẫn hiển thị mờ, không hover, không tooltip; không ánh xạ giả sang Bold.
- Hai bộ chọn màu hiện gạch màu sát dưới biểu tượng; gạch màu luôn phản ánh `value` của color picker. Khi chọn màu mới, chuyển lệnh thực sự vào editor với `hiliteColor` / `foreColor`.
- Ribbon vẫn cuộn ngang trên màn nhỏ; không thu nhỏ Font thành các thẻ tùy ý. Chức năng và thứ tự các nhóm Clipboard/Paragraph/Styles/Editing giữ nguyên.
- Bắt buộc chạy kiểm thử hồi quy và build. Chưa được tuyên bố ảnh mới giống Word chính xác từng pixel khi chưa kiểm tra bằng trình duyệt thật.

## 15/10/2026 — Căn baseline và phân bố hàng dưới của Font

- **B (Bold) và U (Underline)** phải dùng phông sans-serif (Arial/Segoe UI) giống giao diện Word desktop, không dùng Georgia hoặc font có chân.
- **Grow Font / Shrink Font:** hai chữ A phải có cùng **đường chân** dù một chữ lớn và một chữ nhỏ. Render glyph A trên cùng một điểm neo đáy, thu nhỏ chữ thứ hai bằng `transform: scale(.77)` với `transform-origin: left bottom`; mũi tên tăng/giảm đặt độc lập phía trên, không làm lệch chân chữ.
- **Hàng dưới Font** chiếm đủ chiều ngang nhóm: `justify-content: space-between`; các nút B/I/U/Strike/Sub/Super, hiệu ứng disabled và hai picker màu giãn **đều** thay vì bị dồn sang trái. Không thay đổi thứ tự nút hoặc kích thước nhóm Font.
- Giữ nguyên lệnh trên từng nút, phản hồi keyboard focus và quy tắc disabled không hover, con trỏ bình thường.

## 15/10/2026 — Khoảng cách hàng trên và vạch phân nhóm trong Font

- **Hàng trên Font:** giãn đều không gian giữa các thành phần như hàng dưới, bằng CSS grid cố định bề rộng ô chọn phông và cỡ chữ, cộng `justify-content: space-between` trên toàn chiều ngang nhóm; không đẩy các nút về trái.
- **Hai vạch đứng nhỏ** ngay trước và sau Change Case (**Aa**), và **một vạch đứng nhỏ** ngay sau Superscript (**x²**) ở hàng dưới. Vạch mảnh 1px × 18px, màu xám nhạt, `aria-hidden`, không tạo nút giả, không hover và không cản chọn công cụ.
- **Clear All Formatting:** dùng trực tiếp icon **Eraser** rõ ràng thay cho chữ A chồng cục tẩy; chức năng vẫn gọi `removeFormat`.
- Giữ nhóm Font hai hàng, các nút disabled, thao tác thật của công cụ, cỡ chữ và vị trí các nhóm Ribbon khác. Tại màn nhỏ Ribbon tiếp tục cuộn ngang.

## 15/10/2026 — Sửa xung đột CSS khiến hàng trên Font không giãn đều

- **Nguyên nhân gốc:** cùng một khai báo `.wsl-home-font .wsl-font-top` chứa `justify-content: space-between` rồi lại chứa `justify-content: start` ở phía sau; CSS áp dụng giá trị cuối làm tất cả phần tử dồn trái.
- **Quy tắc:** hàng trên chỉ có **một** `justify-content: space-between` để khoảng trống tự chia đều giữa ô tên phông, cỡ chữ, hai nút tăng/giảm, hai vạch phân cách, nút Aa và nút cục tẩy. Nút cuối phải sát mép phải của nội dung nhóm Font; nút đầu sát mép trái.
- Giữ nguyên độ rộng các ô chọn, `grid-template-columns`, ba vạch phân cách, kích thước nhóm Font, hàng dưới, trạng thái nút và chức năng.
- Test hồi quy phải xác nhận `.wsl-font-top` có đúng một khai báo `justify-content` với giá trị `space-between`. Nếu phát sinh thêm khai báo, coi là lỗi.

## 15/10/2026 — Chuẩn nhóm Paragraph từ ảnh Microsoft Word

- Font và Paragraph là hai nhóm riêng, không dùng CSS chồng lên nhau. Stylesheet `word-paragraph-ribbon.css` phải import cuối trong route layout.
- Nhóm Paragraph có hai hàng cao 27px, mỗi hàng `justify-content: space-between` **một lần duy nhất**, phân bố hết chiều ngang 274px, nhãn Paragraph căn giữa ở chân và viền ngăn bên phải.
- Hàng 1: Bullets, Numbering, Multilevel List, vạch ngăn, Decrease/Increase Indent, vạch ngăn, Sort, Show/Hide ¶. Hàng 2: Left, Center, Right, Justify, vạch ngăn, Line Spacing, Paragraph Shading, Borders.
- List icons phải mô phỏng các dòng và dấu đầu dòng/đánh số, các biểu tượng còn lại nét mảnh 17–18px, không dùng ký tự ▦ hoặc ▨ thay icon khi có icon phù hợp.
- **Chức năng thật:** Bullets dùng `insertUnorderedList`, Numbering dùng `insertOrderedList`, Multilevel chèn `ol` lồng `ol` thay vì nút giả tăng thụt lề, căn đoạn giữ nguyên các lệnh `justify*`, Line Spacing bật/tắt 1.0 và 1.5, Shading tô trực tiếp nền đoạn thay vì tô nền chữ, Borders bật/tắt viền dưới đoạn. Hiển thị mũi tên nhỏ trong nút (không giả làm menu chưa triển khai).
- Disabled luôn dùng `cursor: default`, không hiệu ứng hover và không tooltip. Hành vi thực của nút có thể phụ thuộc `document.execCommand` đã deprecated, không tuyên bố giống hoàn toàn Word.
- Test hồi quy số nút, thứ tự, divider và mapping; kiểm thử TypeScript/build/smoke; browser visual ở 360/768/1280 khi có môi trường browser.

## 2026-10-15 — Tinh chỉnh biểu tượng Word Home Ribbon (ưu tiên hình thức)

- **Grow / Shrink Font:** dùng mũi tên dạng tam giác có thân ngắn đặt nổi ở **phía trên bên phải chữ A**; hai chữ A giữ chung đường chân theo quy tắc đã chốt. SVG phải dùng `currentColor` và CSS `top/right` để căn rõ, không dùng ký tự Unicode ↑ hoặc ↓.
- **Multilevel List:** icon đúng cấu trúc ba mức `1.`, `a.`, `i.`; các hàng đường kẻ nằm ở độ sâu tăng dần, không được vẽ ba đường cùng điểm bắt đầu rồi chỉ đổi ký tự số.
- **Increase/Decrease Indent:** biểu tượng gồm **các dòng chữ xám** và **mũi tên xanh nằm ngang** chỉ trái/phải trên một hàng ở trung tâm, không dùng icon Lucide khác hình ảnh tham khảo.
- **Line Spacing:** hai đầu mũi tên lên và xuống phải cùng nằm trên **một trục dọc duy nhất ở bên trái** ba đường kẻ, không dùng `ArrowUpDown` (vốn vẽ mũi tên lệch hai bên).
- **Sort:** chữ `A` màu xanh phía trên, chữ `Z` tối bên dưới, mũi tên đi xuống phía **bên phải**; kích thước tương thích 26px nút Word.
- Chỉ thay UI (SVG/CSS); giữ nguyên props, aria-label, onClick, mapping các lệnh hiện hữu. Không phát triển menu/tính năng khác trong lần chỉnh này. Disabled vẫn mờ, con trỏ thường, không hover.
- Kiểm tra regression về vị trí/glyph SVG và các nút; build/CI cần pass. Không tuyên bố pixel-perfect khi chưa đối chiếu browser thật.

## 2026-10-15 — Giảm số dòng icon Indent xuống đúng 4 hàng

- Hai nút **Decrease Indent** và **Increase Indent** sử dụng **chính xác 4 đường ngang** (hai đường đầy đủ trên/dưới, hai đường ngắn ở giữa để chừa chỗ mũi tên), không 5–6 dòng dày đặc.
- Mũi tên xanh nằm ngang ở giữa với kích thước vừa vặn, đầu hướng trái cho Decrease và hướng phải cho Increase. Nét xám `strokeWidth=1.3`; không thay đổi kích thước 22×21px hoặc hành vi của các nút.
- Kiểm tra hồi quy số đường trong SVG; chỉ thay biểu tượng, không thay đổi chức năng nhóm Paragraph.

## 15/10/2026 — Tam giác đặc đầu chữ A trong Increase/Decrease Font Size

- Dùng tam giác **đặc không thân mũi tên**, đáy ngang, góc bo nhẹ theo hình mẫu người dùng gửi; không dùng dạng icon `arrow up/down` thân dài.
- Increase Font Size là tam giác **hướng lên** trên đỉnh bên phải chữ A; Decrease Font Size là tam giác **hướng xuống** cùng vị trí.
- Mũi tên màu `#111111`, SVG `12×11`, cố định `top: -2px; right: -1px` trong `.wsl-font-size-symbol`. Hai chữ A giữ cùng chân, chữ A nhỏ tiếp tục `scale(.77)` từ gốc trái dưới.
- Đây chỉ là cập nhật hình dạng SVG và màu/icon CSS, giữ nguyên nhãn truy cập, `run` tăng/giảm cỡ chữ và mọi phần còn lại của Word Ribbon.

## 2026-10-15 — Đối chiếu chính xác hai ảnh Font Size và Indent

- Ảnh Font Size người dùng gửi cho thấy **A lớn và A nhỏ màu xám đậm, hai đường chân cùng mức**, mũi tên **dạng dấu nhọn (chevron)** nhỏ xíu màu xanh lam sáng đặt trên góc phải chữ A; dấu tăng mở xuống, đỉnh hướng lên; dấu giảm mở lên, đỉnh hướng xuống. **Không dùng tam giác đặc màu đen** trong bản tham khảo mới.
- Mũi tên dùng SVG nét không tô (`fill="none"`, `stroke="currentColor"`), kích thước **9×8px**, màu `#2d9ed8`, ngay phía trên phải, không có thân.
- Ảnh Indent: chỉ **bốn dòng ngang xám đậm**, hai dòng ở giữa bắt đầu sau mũi tên; mũi tên **xanh nhỏ nét mảnh** chỉ trái/phải nằm ở giữa, không phải mũi tên khối đặc; dùng SVG stroke xấp xỉ 2px, không tô.
- Chỉ thay JSX SVG và CSS của hai cặp biểu tượng, **giữ nguyên** toàn bộ trình xử lý Increase/Decrease Font Size, Decrease/Increase Indent; không thay đổi kích thước nút, vị trí Ribbon, các chức năng khác. Quy tắc `disabled` giữ nguyên.
- Với các lần chỉnh icon theo ảnh mới, bản tham khảo mới hơn được ưu tiên trước mô tả cũ trong tài liệu. Thực hiện test tĩnh và CI; không khẳng định đã kiểm tra thị giác pixel-by-pixel trên website khi chưa có browser QA.

## 15/10/2026 — Sửa lỗi hình ảnh không đổi rõ sau lần cập nhật

- **Lỗi phát hiện:** `word-window-bar.css` dùng selector `.wsl-home-font .wsl-font-top .wsl-hb svg {color:#516073}` có độ ưu tiên cao hơn `.wsl-home-font .wsl-font-size-direction`, khiến mũi tên trên A bị xám dù CSS icon khai báo xanh. Selector chung phải loại trừ `.wsl-font-size-direction` bằng `:not(.wsl-font-size-direction)`.
- **Kiểm tra ảnh thực:** ảnh Decrease/Increase Indent mới nhất thực tế có **ba** nét văn bản chính: nét trên đầy đủ, nét giữa ngắn bên phải và nét dưới đầy đủ. Dùng ba nét và mũi tên cyan **dạng khối nhỏ** ở giữa; ảnh này được ưu tiên hơn quy tắc cũ bốn nét.
- **Tương phản:** mũi tên trên A xanh lam `#2197ce`, SVG chevron 9×8; icon indent ba dòng màu xám đậm `#43494e`, mũi tên xanh `#168fca`; nền trắng.
- Test CSS phải xác nhận không có selector ghi đè `.wsl-font-size-direction`; test icon kiểm tra ba nét và 2 mũi tên. Không thay đổi command handler, kích thước nút, trạng thái disabled, hoặc layout.
- Không gọi bản cập nhật là đã so sánh trực quan Production nếu không có screenshot từ trình duyệt chạy domain thật.
