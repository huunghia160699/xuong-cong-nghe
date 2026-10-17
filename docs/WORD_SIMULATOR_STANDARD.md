# Tiêu chuẩn công cụ mô phỏng Word — Xưởng Công Nghệ

Ngày: 15/10/2026. Đường dẫn: `/cong-cu/mo-phong-word`.

## Quy trình bắt buộc sau mỗi lần chỉnh sửa mô phỏng Word

**Yêu cầu lâu dài của chủ dự án (16/10/2026):** Sau **mọi lần chỉnh sửa** mô phỏng Word đã được người dùng yêu cầu thực hiện, không dừng ở việc đưa đoạn mã hoặc hướng dẫn thủ công.

1. Sửa **trực tiếp** mã nguồn trong GitHub `huunghia160699/xuong-cong-nghe` (nhánh `main`); không thay đổi các trang không liên quan.
2. Bổ sung hoặc cập nhật **kiểm thử hồi quy** phù hợp, tránh làm mất tính năng đã có.
3. **Cập nhật chính file Markdown này sau mỗi lần sửa**, ghi lại yêu cầu, thông số UI/UX, trạng thái tính năng và các ràng buộc cần giữ.
4. Commit các thay đổi lên GitHub; tạo deployment **Vercel Production** cho chính commit đó, xem log test/build và xác nhận deployment ở trạng thái **READY**.
5. Phản hồi kèm **liên kết Production**, commit SHA và số bài test đạt; nói rõ nếu chưa kiểm tra trực quan trên trình duyệt.
6. Nếu triển khai hoặc kiểm thử thất bại, phải sửa và chạy lại trước khi báo hoàn thành; không khẳng định đã triển khai khi chưa thấy READY.

Áp dụng quy trình này mặc định cho các lần chỉnh sửa tiếp theo. Khi người dùng chỉ yêu cầu **mô tả/phác thảo trước để xác nhận**, không tự sửa hoặc deploy cho đến khi được duyệt.

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

## 2026-10-15 — Đồng bộ khoảng cách hai mũi tên Font Size với đầu chữ A nhỏ

- Hai mũi tên SVG tăng/giảm cỡ chữ được **thu nhỏ khoảng một nửa** kích thước hiển thị, từ `9×8px` còn `5×4px` (SVG `viewBox` và lệnh giữ nguyên). Đường nét, sắc xanh và hướng tăng/giảm không thay đổi.
- Cả hai mũi tên dùng `position: absolute; top: 6px`, cùng một đường ngang tương ứng vị trí đỉnh **A nhỏ**, tránh mũi tên lệch độ cao theo cỡ A.
- Vì chữ A nhỏ hẹp hơn chữ A lớn, chỉnh `right: 5px` riêng cho Shrink so với `right: 2px` của Grow để **khoảng trống thấy được giữa A và mũi tên** cân đối gần tương đương nhau.
- Giữ nguyên baseline hai chữ A, `scale(.77)` trên chữ nhỏ, bố cục Ribbon và onClick. Test hồi quy kiểm tra CSS anchor và size, tránh các khai báo chung làm mất màu/mất vị trí.

## 2026-10-15 — Giảm một nửa khoảng cách chữ A và chevron (lần 2)

- Giữ **nguyên kích thước** mũi tên xanh `5×4px`, không thu nhỏ biểu tượng.
- Dịch ngang cả hai chevron lại sát chữ A thêm **1,25px** để khoảng cách thị giác giảm khoảng một nửa: Grow `right: 3.25px` (từ 2px), Shrink `right: 6.25px` (từ 5px).
- Giữ độ lệch ngang 3px giữa hai nút nhằm cân đối bề ngang chữ A lớn/nhỏ. Vị trí dọc `top: 6px` không đổi, hai mũi tên vẫn cùng hàng ngang.
- Chỉ sửa CSS; không thay JSX, SVG, hành vi nút, hoặc các nhóm khác. Regression test phải khóa `right` mới, size, top và độ lệch giữa hai nút.

## 15/10/2026 — Chuẩn hóa kích thước và căn giữa tất cả nút Font

- Hai ô chọn **phông chữ và cỡ chữ** và toàn bộ nút trong hai hàng Font cùng **cao 27px**, tương ứng chính xác chiều cao mỗi hàng 27px. Tất cả button dùng `align-items:center;justify-content:center`; select là 100% chiều cao trong khung, mũi tên dropdown canh `top:50%;transform:translateY(-50%)`.
- **Khoảng cách chữ A–mũi tên = 3px**: đặt SVG chevron **bên trong phần tử chữ A** và dùng `position:absolute;left:calc(100% + 3px)` nên khoảng cách bám mép ký tự thay vì dò `right` của wrapper. Giữ size chevron 5×4px và hai chiều chữ A 20px/15.4px với line-height chung 21px. Dịch cả cặp trái 4px để tổng cụm A + 3px + chevron nằm giữa ô.
- Đồng bộ các ký hiệu Font (đậm/nghiêng/U/chỉ số trên/dưới), bộ chọn màu và công cụ disabled trong ô cao 27px. Các icon màu được căn lại trên/dưới sao cho cụm icon/swatch cân xứng; hai mũi tên chọn màu nằm giữa ô bằng `top:50%`.
- **Mọi vạch phân cách nhỏ Font/Paragraph:** 1px × 18px, màu `#c9ced6`, `box-sizing:border-box`, cùng vị trí `align-self:center`; chỉ là trang trí, không hover.
- Giữ đúng hai hàng và thứ tự lệnh. Không thay handlers, màu chủ đạo, hoặc trạng thái disabled. Các kiểm thử hồi quy phải kiểm tra chiều cao, anchor/gap và vạch dọc, không dựa vào tọa độ `right` cũ.


## 2026-10-15 — Indent 4 dòng, mũi tên 70%, Line Spacing 3 dòng

- **Decrease Indent** và **Increase Indent** sử dụng đúng bốn đường ngang xám tại các mức `y=3, 8.3, 13.7, 19`; hai đường giữa bắt đầu tại `x=13` để không chồng lên mũi tên. Đây là yêu cầu mới và **thay thế** quy tắc ba đường indent trước đó.
- Thu nhỏ **cả hai** mũi tên Indent xuống `scale(0.7)` quanh tâm hình cũ, giữ nguyên màu `#168fca`, chiều trái/phải và thao tác của nút.
- **Line Spacing** phải hiển thị đúng ba nét ngang riêng biệt tại `y=4, 11, 18`; giữ nguyên mũi tên dọc hai chiều bên trái và lệnh `lineSpacing`.
- Không sửa kích thước hai hàng Ribbon, trạng thái disabled, kiểu hover, thứ tự các nút hoặc nhóm Font.

## 2026-10-15 — Line Spacing 4 dòng

- Thay yêu cầu Line Spacing 3 dòng trước đó bằng **4 đường ngang**, cách đều ở các mức `y=3, 8.3, 13.7, 19` trong SVG hiện tại.
- Giữ mũi tên lên/xuống ở bên trái, màu sắc, kích thước icon, chức năng `lineSpacing` và toàn bộ các nút khác không đổi.
- Kiểm thử hồi quy phải xác nhận đúng thứ tự và số lượng 4 nét ngang.


## 2026-10-15 — Thống nhất kích thước mũi tên mở rộng (chevron)

- Tất cả mũi tên **mở rộng ▼** của Home Ribbon (Clipboard/Paste, chọn phông/cỡ chữ, Change Case, Underline, màu chữ/tô sáng, danh sách, Line Spacing, Shading, Borders và Styles) dùng **13px × 13px**. Quick Access Toolbar cũng ở mức 13px.
- Dùng một hằng `RIBBON_EXPAND_ARROW_SIZE=13` trong `word-home-ribbon.tsx`; các CSS cũ từng ép 8–10px phải được đồng bộ sang 13px để hiển thị đúng.
- Ô **Change Case**, **Underline**, nút màu và các nút danh sách/định dạng đoạn được nới ngang vừa đủ để mũi tên không tràn lên biểu tượng bên cạnh. Hàng Font vẫn cao 27px, nhóm Paragraph vẫn giữ bố cục hai hàng.
- Không tăng hoặc đổi vị trí các mũi tên *thao tác* như tăng/giảm cỡ chữ, thụt lề trái/phải hay mũi tên dọc lên/xuống trong biểu tượng Line Spacing.
- Giữ nguyên command handler, thứ tự công cụ, keyboard focus, màu sắc và trạng thái disabled. Kiểm thử cần bắt cả kích thước JSX lẫn CSS thực tế.


## 2026-10-15 — Split buttons: lệnh chính và mũi tên hoạt động độc lập

- Với các nút Home Ribbon có biểu tượng **và** mũi tên mở rộng, giao diện trở thành `split button`: **bấm biểu tượng/vùng chính** để áp dụng lệnh đang có, **bấm riêng mũi tên 13px** để mở menu tùy chọn. Không chạy lệnh chính chỉ vì người dùng mở menu.
- Áp dụng cho **Paste, Change Case, Underline, Highlight Color, Font Color, Bullets, Numbering, Multilevel List, Line Spacing, Paragraph Shading và Borders**. Mũi tên Styles mở danh sách kiểu và các ô chọn phông/cỡ chữ vẫn hoạt động như hộp chọn thông thường.
- Tùy chọn menu phải có tác dụng thật: chọn kiểu chữ hoa/thường; bật/tắt underline; dán văn bản hoặc dán HTML an toàn khi Clipboard API hỗ trợ; chọn màu hoặc xóa highlight; chuyển kiểu danh sách; chọn giãn dòng 1/1.15/1.5/2; đặt/xóa nền đoạn hoặc viền trên/dưới. Không tạo nút giả.
- Giữ vùng lựa chọn văn bản khi mở/chọn menu. Popup render ngoài Ribbon để không bị cắt bởi cuộn ngang. Menu đóng khi bấm ra ngoài, Escape hoặc cuộn Ribbon; các nút chính và mũi tên có nhãn truy cập tách biệt.
- Không tách mũi tên chức năng (Increase/Decrease Font Size, Increase/Decrease Indent, ký hiệu mũi tên dọc của Line Spacing), vì chúng là một phần của biểu tượng lệnh.
- Các CSS cũ có thể còn ghi nhãn mô phỏng một nút duy nhất; quy tắc mới này có ưu tiên cao hơn, tách chức năng thực nhưng không thay đổi kích thước hàng 27px, thứ tự nhóm hoặc logic disabled.


## 2026-10-16 — Styles dạng gallery Word, Editing sát trái, responsive theo số style

- **Styles** không còn `flex:1` chiếm khoảng trống; cả nhóm Styles và **Editing** nằm sát nhau, căn về bên trái sau Paragraph. Editing giữ ba hành động Find, Replace, Select.
- Khung Styles là **một dải chữ nhật phẳng** viền xám, cao `69px`, chứa bốn lựa chọn trực tiếp `Normal`, `No Spacing`, `Heading 1`, `Heading 2` theo thứ tự trong ảnh tham chiếu, rồi tới một khoang mũi tên xuống `13px` ở mép phải. Không dùng hiệu ứng gradient, glassmorphism hoặc bo góc trang trí.
- Chọn style trực tiếp có `aria-pressed` và dấu chọn viền nhẹ. Mũi tên mở menu bao gồm đủ 6 kiểu (`Normal`, `No Spacing`, `Heading 1`, `Heading 2`, `Title`, `Subtitle`); mỗi lựa chọn gọi `applyStyle` thật.
- Số ô style hiển thị giảm theo độ rộng viewport: **4** (trên 1480px), **3** (đến 1480px), **2** (đến 1350px), **1** (đến 1210px), **0** (từ 1090px trở xuống). Khi không còn ô, chỉ hiển thị nút mũi tên để mở tất cả styles. Ẩn **nguyên ô**; không tạo thanh cuộn ngang riêng hoặc cắt một nửa tên kiểu.
- Không thay đổi kích thước nhóm Font/Paragraph, lệnh Editing, số hàng Ribbon, lệnh lưu/khôi phục nội dung và chế độ disabled của các nút.


## 2026-10-16 — Trạng thái nhập liệu, Clipboard, launcher nhóm, tab active

- **Sáu nút Font:** Bold, Italic, Underline, Strikethrough, Subscript và Superscript phải có trạng thái **active bền** dựa trên `document.queryCommandState` tại vùng chữ/chỗ đặt con trỏ. Nhấn bật định dạng khi con trỏ thu gọn vẫn áp dụng cho ký tự nhập tiếp theo; nhấn lần nữa để tắt. Đồng bộ cả khi thay đổi vùng chọn, gõ chữ hay dịch con trỏ. Underline giữ kiểu nút tách đôi, vùng lệnh chính hiển thị active nhưng mũi tên vẫn mở menu riêng.
- **Văn bản được chọn** trong vùng soạn thảo dùng màu nền xanh nhạt `#eaf2fb`, đồng màu nền hover Ribbon, vẫn giữ chữ tối để đọc.
- **Clipboard stage:** sau khi chọn chữ và bấm Copy hoặc Cut, chính lệnh đó sáng active, hai nút còn lại trong bộ Cut/Copy/Format Painter ẩn; Paste vẫn hiển thị. Cho phép di chuyển con trỏ rồi Paste tại vị trí mới. Lưu bản sao văn bản trong session để dán ngay cả khi trình duyệt hạn chế quyền clipboard; đồng thời cố sử dụng Clipboard API khi có thể. Bấm Escape hủy trạng thái chờ dán hoặc Format Painter; Escape không tự đảo ngược việc Cut đã hoàn tất (Undo xử lý riêng).
- **Mọi nhóm Home Ribbon** (Clipboard, Font, Paragraph, Styles, Editing) có một launcher mũi tên nhỏ ở **góc dưới bên phải**, mở hộp thoại chi tiết với những hành động thật đã được trình soạn thảo hỗ trợ. Hộp thoại đóng bằng Escape, X hoặc bấm ra ngoài; không hiện các tùy chọn không hoạt động.
- **Editing** có nét phân cách dọc cuối nhóm như các nhóm khác, 1px màu `#d8d8dc`.
- **Tab đang chọn:** chữ đậm `font-weight:700` và một gạch chân **3px** rõ ràng, giữ giao diện tối giản, không gradient.


## 2026-10-16 — Thước Word đo theo giấy và giao diện Ribbon nổi

- Thay thước ngang/dọc phân bố nhãn đều giả lập bằng thước thật theo **1cm = 96/2.54 CSS px ở zoom 100%**, vạch nhỏ cách 1/4cm; vạch dài và nhãn số ở mỗi 1cm.
- Giấy A4 mặc định: dọc **794 × 1123px**, ngang **1123 × 794px**. Lề thường ngang 87px và trên/dưới 86px; lề hẹp 48px. Phần trắng trên thước thể hiện chính xác vùng được phép gõ; phần nằm ngoài lề có nền xám. Có dấu tam giác chỉ giới hạn trái/phải và chỉ báo góc dạng chữ L.
- Cả hai thước được hiển thị khi bật `showRuler`, ẩn khi tắt. Thước ngang giữ vị trí trong header workspace, cập nhật theo `scrollLeft`; thước dọc neo phía trái, cập nhật theo `scrollTop`. Cùng áp dụng `zoom/100`; thay khổ giấy/lề không cần tự sửa tọa độ thước.
- Trang giấy, thước và vùng gõ phải dùng **cùng dữ liệu kích thước** thay vì thay đổi width riêng khi responsive. Trên màn nhỏ, cuộn trang ngang thay vì làm giả khổ A4 hẹp khác kích thước.
- Thanh tab có nền xám chung `#e8e7eb`, nhãn bình thường `font-weight:500`, đang chọn `font-weight:900`, pseudo-element underline dày **3px**, `bottom:4px` gần chân chữ và **không bo tròn** nét.
- Ribbon Home sử dụng nền xám chung, khung công cụ trắng nổi vừa phải, có khoảng đệm hai phía, **bo góc 5px**, viền xám mảnh và bóng nhẹ; không áp gradient/glassmorphism.
- Kiểm thử tự động bắt buộc cho production: `node --test tests/word-home-qa.test.mjs tests/presentation-basics.test.mjs` trước `next build`. File QA chạy **10 vòng kiểm tra đường nối mã nguồn cho từng nút Home và mục menu**, kiểm tra hình học ruler 16 tổ hợp mỗi vòng. Đây là **kiểm thử hợp đồng mã nguồn, không phải E2E nhấp chuột**, nên kiểm thử trình duyệt thực tế vẫn là một bước xác nhận riêng.


## 2026-10-16 — Chuẩn hóa mốc đầu thước dọc, tab vuông và Ribbon Home kín ngang

- Thước dọc **bắt đầu đúng tại mép trên tờ giấy**, không bắt đầu từ mép trên vùng cuộn. Dùng **một biến CSS chung** `--wsl-page-top-offset` cho `padding-top` của giấy và `top` của thước dọc: mặc định 13px, màn hình `max-width:650px` 9px. Phần đo bên trong thước có `top:0` và chiều cao đúng tỷ lệ giấy, không cộng bù 13px hay chỉnh `margin-top:-4px` thủ công. Vẫn đồng bộ `scrollTop` khi cuộn và tỷ lệ zoom khi phóng.
- Thanh menu tab và từng tab **không bo góc trên/dưới**, áp `border-radius:0`; giữ nguyên nét active 3px, màu nền xám và độ đậm đã duyệt.
- Khung trắng nổi của Home Ribbon **chiếm hết chiều rộng khả dụng** `width:100%;flex:1 0 auto;box-sizing:border-box`, vẫn bo góc 5px, lề ngoài trái/phải và viền/bóng mảnh. Các nhóm Clipboard, Font, Paragraph, Styles, Editing có `flex:0 0 auto` để **dồn về trái**. Khoảng trống còn lại **bên phải để trắng**, không phóng to các nhóm. Khi tổng công cụ lớn hơn viewport, thanh Ribbon cuộn ngang.
- Các kiểm thử hồi quy cần kiểm tra cả offset 13px/9px, mốc thước 0, tab vuông, khung 100% và nhóm không giãn; kiểm tra lặp 10 vòng trong bộ `word-home-qa`.


## 2026-10-16 — Hoàn thiện thước theo hình tham chiếu mới

- Thước ngang vẫn không có viền trên; **phục hồi viền dưới** mảnh `1px solid #c7c7cb`, phân cách rõ với vùng trang bên dưới.
- Hai thước tiếp tục lấy chiều dài A4 chuẩn từ `word-paper-metrics.ts`; không tự chia lại theo toàn màn hình. Thước ngang giữ các mốc và dấu lề đầu/cuối theo tờ giấy.
- Thước dọc phải nằm **bên trong `.wsl-word-page-body` có `position:relative`**, không đặt cùng cấp với vùng trang vì `position:absolute` sẽ sai gốc tọa độ.
- Chiều cao của thước dọc đo từ **chính phần tử `.wsl-paper`** bằng `getBoundingClientRect().height` và `ResizeObserver`; nhờ đó bằng chiều cao hiển thị thật kể cả khi thu/phóng, đổi hướng giấy hay tài liệu dài hơn chiều cao A4 tối thiểu. Đầu thước và tờ giấy dùng cùng offset; khi cuộn dọc, `top` được giảm đúng `scrollTop`. Khi vượt khung xem, thước được cắt bởi viewport, không kéo dài vô hạn.
- Giữ hành vi hiển thị/ẩn theo nút Ruler hiện có. Hệ kiểm thử Home lặp 10 lượt phải bắt đường viền dưới, vị trí vùng chứa và cơ chế quan sát chiều cao thực.


## 2026-10-16 — Chiều cao Ribbon cố định, khoảng cách hai bên và ranh giới tab

- `.wsl-ribbon` khi chứa Home và chính `.wsl-home-ribbon` đều cố định **96px** ở mọi breakpoint: `height`, `min-height`, `max-height` đều **96px**. Phần cha dùng `flex:0 0 96px` để không co chiều cao.
- Chiều rộng của Ribbon tiếp tục responsive. Các nhóm Home dồn trái; nếu thiếu chỗ thì có thể cuộn ngang. Không thay đổi chiều cao hoặc cỡ nút theo viewport.
- Khoảng trống bên ngoài Ribbon là `margin-inline:8px` trên **phần tử cha**, tăng gấp đôi mức 4px; cả cha và Home không dùng padding ngang.
- Xóa đường kẻ **giữa tab và Ribbon**: `.wsl-shell .wsl-tabs` bỏ `border-bottom`, `.wsl-ribbon` giữ `border-top:0` và khung `.wsl-home-ribbon` cũng `border-top:0`. Viền trái, phải, dưới và bo góc của khung Home được giữ lại.
- Kiểm thử hồi quy và QA 10 vòng phải đảm bảo các quy tắc này ở cả desktop và mobile.


## 2026-10-16 — Tạm bỏ nội dung thước để thiết kế mới

- Theo yêu cầu mới, **xóa toàn bộ nội dung đồ họa hiện tại của hai thước**: vùng trắng, các vạch cm/¼cm, số đo, biểu tượng L và dấu lề trái/phải. Những yêu cầu vẽ thước ở các mục trước **tạm thời không còn áp dụng**.
- Vẫn giữ đúng **hai thẻ cha rỗng**: `.wsl-word-horizontal-ruler` (chiếm hàng ngang 26px, có đường viền dưới mảnh) và `.wsl-word-vertical-ruler` (bề ngang 23px, bám theo vị trí và chiều cao trang giấy). Chúng không có phần tử con, để sẵn cho phương án thước mới.
- Giữ nguyên phép tính A4, bố cục trang, zoom, cuộn, nút bật/tắt thước và tất cả lệnh Home; không đưa thêm thiết kế thước mới khi người dùng chưa cung cấp.
- Hồi quy kiểm tra **không còn SVG, marker, tick hay vùng trắng bên trong thước**; các test khác của ứng dụng vẫn chạy như bình thường.


## 2026-10-16 — Bước đầu dựng thước mới: vạch chia cm trên thước ngang

- Thước **ngang** hiển thị **chỉ các vạch dọc**, từ mép trái giấy A4 đến mép phải giấy A4, không có nền trắng mới, số đo, ký hiệu lề hoặc bất kỳ biểu tượng nào khác. Thước **dọc** vẫn giữ thẻ rỗng chờ thiết kế.
- Khoảng vạch chia: mỗi **0,25 cm**, sử dụng đúng quy đổi `96/2.54` CSS px/cm; vạch 1 cm cao 14px, nửa cm cao 9px, một phần tư cm cao 5px. Màu xám đậm `#64676c`, rộng 1px, không dùng gradient.
- Track chứa vạch dài đúng `a4Dimensions(landscape).width * zoom/100`; có vạch đầu tiên tại 0 và vạch cuối `width-1px` để nét nằm trong đúng hai mép giấy. Với A4 ngang 29,7 cm, vạch cuối là mốc cuối trang thay vì làm tròn lên 30cm.
- Dùng `paper.getBoundingClientRect().left - ruler.getBoundingClientRect().left` để xác định vị trí ngang của giấy. `ResizeObserver` và `scrollLeft` đồng bộ lại căn chỉnh trên màn hình co giãn, có scrollbar, lúc zoom hay lúc cuộn.
- Giữ vùng cha `.wsl-word-horizontal-ruler`, nền xám sẵn có và đường viền dưới; không sửa `.wsl-paper`, nhóm Home và thước dọc. Kiểm thử yêu cầu đủ vạch, số đo không xuất hiện, kích thước theo A4 dọc/ngang và zoom.


## 2026-10-16 — Đồng bộ nét 1px và căn giữa chiều cao thước ngang

- Giữ cả ba cấp vạch cách nhau theo 0,25 cm, nhưng mọi vạch chỉ **1 CSS px bề rộng** (`width`, `min-width`, `max-width` đều 1px). Không dùng border hoặc quy đổi độ dày theo cấp vạch.
- Mọi vạch đều được **căn chính giữa dọc** theo thanh thước bằng `top:50%` và `transform:translateY(-50%)`, thay cho căn dưới `bottom:3px`.
- **Giảm chính xác một nửa chiều cao:** vạch cm 14 → **7px**, nửa cm 9 → **4,5px**, 1/4 cm 5 → **2,5px**.
- Với khoảng cách cm quy đổi ra pixel lẻ, tọa độ vạch phải được **snap theo lưới pixel vật lý của màn hình**: `Math.round((viewportLeft + offset) * devicePixelRatio) / devicePixelRatio - viewportLeft`, vì làm tròn riêng offset tại gốc track sẽ gây lệch vạch khi trang giấy nằm tại tọa độ lẻ. Lấy `viewportLeft` từ `.wsl-paper.getBoundingClientRect().left`, cập nhật khi zoom, cuộn và resize.
- Không thêm nền trắng, số hay marker. Thước dọc tiếp tục để trống; giữ nguyên giấy A4 và các nhóm công cụ Home. Bổ sung kiểm thử nhiều DPR khác nhau để phát hiện các vạch đặt vào nửa pixel vật lý.


## 2026-10-16 — Dải trắng vùng nhập liệu nằm dưới vạch thước ngang

- Chỉ thêm **một dải nền trắng** trong `.wsl-word-ruler-cm-track`, có class `.wsl-word-ruler-content-strip`. Không đổi màu nền xám của thước cha hay phần hai đầu giấy.
- Hai mép trái/phải của dải trắng phải đúng vị trí của `.wsl-editor` bên trong `.wsl-paper`: lấy `editorRect.left - paperRect.left` và `editorRect.width` bằng `getBoundingClientRect`, không hardcode số centimet hoặc giả định padding. Bởi vậy dải tự cập nhật khi đổi lề hẹp/thường, A4 đứng/ngang, zoom, cuộn ngang và resize. Quan sát cả phần tử editor qua `ResizeObserver`.
- Dải cao gần bằng thước ngang nhưng chừa **2px ở mép trên và 2px ở mép dưới**, ở giữa theo chiều dọc (`top:2px;bottom:2px`). Chú ý thước cao 26px nên 2cm không thể thực hiện theo nghĩa đen; khoảng chừa được triển khai là 2px.
- Thứ tự layer: `.wsl-word-ruler-content-strip` có `z-index:0`, toàn bộ các vạch cm có `z-index:1`; giữ nguyên các vạch 1px và các mức chiều cao 7/4,5/2,5px. Không thêm chữ số, màu sắc khác hoặc marker.
- Phần thước dọc vẫn chỉ có thẻ cha rỗng. Test hồi quy xác minh các quan hệ DOM, kích thước theo vùng nhập liệu, layer và 16 tổ hợp trang/zoom.


## 2026-10-16 — Bỏ focus viền xanh và phân biệt thước giấy/thước vùng nhập liệu

- `.wsl-editor:focus` và `:focus-visible` không hiển thị viền xanh hay shadow (`outline:none;outline-offset:0;box-shadow:none`); vẫn cho phép focus, caret và nhập liệu.
- Thước giấy màu xám giữ vạch chia tính từ mép giấy A4. **Thước nền trắng là một lớp phủ độc lập** (`.wsl-word-ruler-content-strip`, `z-index:2`, `overflow:hidden`) che toàn bộ các vạch cũ nằm trong vùng trắng; các vạch thước giấy vẫn `z-index:1`.
- Dải trắng có bộ vạch riêng `contentTicks`, **khởi đầu 0 cm chính tại lề nhập liệu trái**; các vạch tiếp theo cách nhau 0,25cm, với vạch 1cm, 0,5cm, 0,25cm lần lượt cao 7px, 4,5px, 2,5px, rộng 1px. Không hiển thị số đo.
- Lấy lề/trắc địa từ `.wsl-editor.getBoundingClientRect()` và `.wsl-paper.getBoundingClientRect()`; chốt `contentStart=snapTick(editorOffset)`, `contentEnd=snapTick(editorOffset+editorWidth)` để khung và mốc 0 bắt đầu cùng vị trí trên lưới pixel vật lý, ngay cả khi zoom hoặc thay đổi lề thường/hẹp. Vạch nội bộ tại `snapTick(editorOffset+tick.left)-contentStart`.
- Giữ khung dải trắng chừa 2px phía trên/dưới, căn giữa; thước dọc chưa dựng. Test bảo đảm lớp trắng xuất hiện **sau** vạch thước giấy, có vạch riêng và gốc 0 di chuyển theo lề.


## 2026-10-16 — Ẩn vạch số 0 của dải trắng và tăng khoảng hở

- Bộ vạch của dải trắng `contentTicks` vẫn lấy gốc đo là mép trái vùng nhập liệu, nhưng **không vẽ vạch tại `index=0`**. Vạch 0,25cm đầu tiên trở thành vạch đầu hiển thị; mốc 1cm và các mốc tiếp theo không được dịch.
- Chỉ áp dụng điều kiện `tick.index>0` cho vạch của **dải trắng**. Các vạch trên phần nền xám tính từ mép giấy và hai mép giấy vẫn giữ nguyên.
- Dải trắng hiện chừa khoảng hở `top:4px;bottom:4px` so với chiều cao của thước ngang; giữ `z-index:2` để che vạch giấy ở phía dưới và vẽ lại các vạch trên dải trắng.
- Không thêm số hoặc marker; không thay đổi kích thước giấy, thước dọc hoặc các nút Home.


## 2026-10-16 — Hiển thị số tại từng cm trên dải trắng

- Trên dải thước nền trắng, thay **tất cả vạch dài ở mốc cm nguyên** bằng nhãn số tuần tự **1, 2, 3, 4, ...** (`tick.index / 4`), đến hết vùng nhập liệu. **Không hiển thị số 0**.
- Nhãn được định vị đúng điểm chia cm tính từ mép trái vùng nhập liệu (`snapTick(editorOffset + tick.left) - contentStart`), căn giữa cả chiều dọc và chiều ngang tại mốc bằng `top:50%` và `transform:translate(-50%,-50%)`. Kiểu chữ Arial 10px.
- Vạch 0,25cm và 0,5cm trong dải trắng giữ nguyên, vạch cm trên phần xám bên ngoài dải trắng cũng giữ nguyên. Không thay đổi khung nền trắng, khoảng hở trên/dưới 4px, thao tác zoom và lề.
- Hồi quy đảm bảo số liên tiếp theo vị trí cm và không còn vạch dài cm nằm trong dải trắng.

## 2026-10-16 — Hai đầu thước ngang có biểu tượng Indent cùng chiều rộng

- Thêm đúng theo mẫu được duyệt: **bên trái** có ba thành phần **First Line Indent** (tam giác xuôi), **Hanging Indent** (tam giác ngược chiều) và **Left Indent** (thanh chữ nhật); **bên phải** là tam giác hướng lên **Right Indent**.
- Hai biểu tượng dùng **cùng một component `RulerIndentMarker`**, SVG **12 × 20px**, wrapper `width:min-width:max-width:12px`, cao 20px. Các phần tử hình học nội bộ nằm trong cùng khung 12px, viền xám mảnh.
- Left Marker đặt tại `contentStart`, Right Marker tại `contentEnd`, bám đúng **hai mép dải trắng/vùng nhập liệu**, tự thay đổi theo lề thường/hẹp, khổ A4 dọc/ngang, zoom, cuộn, và resize.
- Cả hai nằm ngoài `.wsl-word-ruler-content-strip` để không bị `overflow:hidden` cắt mất một nửa, có `z-index:3` nên nổi phía trên nền trắng (`z-index:2`) và vạch chia (`z-index:1`); căn giữa dọc theo thanh thước 26px.
- Đây **chỉ là hình ảnh giao diện**, `pointer-events:none`, **chưa hỗ trợ kéo thả hoặc thay đổi giá trị indent**. Bảo toàn thước trắng 4px inset, mốc số cm, vạch 1px, giấy và Ribbon.
- Mỗi lần thay đổi tiếp theo phải thực hiện **Quy trình bắt buộc sau mỗi lần chỉnh sửa mô phỏng Word** ở đầu file: cập nhật MD, GitHub, test, Vercel Production READY.


## 2026-10-16 — Chỉnh biểu tượng Indent theo ảnh tham chiếu Word

- Người dùng cung cấp ảnh mẫu **60 × 38px**, yêu cầu sửa **hình dáng** biểu tượng, không thay đổi chức năng thước. Mẫu hiển thị hình **mái nhà trên thân chữ nhật chia ngang** ở đầu trái dải trắng và hình **thẻ chữ nhật có mũi tam giác chúc xuống** ở đầu phải.
- Thay các tam giác đặc xếp chồng của bản trước bằng **SVG đường viền mảnh xám `#818181` rộng 1px**, phần ruột trắng `#fff`. Marker trái dùng một đường bao kiểu nhà `M.5 10.5L6 6L11.5 10.5V19H.5Z` và vạch chia ngang `M.5 14H11.5`; marker phải dùng đường bao `M.5 1H11.5V5L6 9.25L.5 5Z`. Không sử dụng hình chữ nhật rời/biểu tượng tô xám đặc trước đây.
- **Cả hai icon giữ đúng cùng chiều rộng 12px**, SVG 12 × 20px, wrapper cùng chiều cao và căn giữa dọc theo thanh thước 26px. Vị trí neo vẫn là `contentStart` và `contentEnd` nên bám lề, xoay giấy, thu phóng, cuộn và thay đổi kích thước.
- Giữ nguyên dải trắng cao theo `top:4px;bottom:4px`, số cm, vạch chia 1px, lớp phủ, thước dọc, viền focus đã loại bỏ và Ribbon. Đây vẫn là biểu tượng trang trí, chưa thêm kéo thả điều chỉnh Indent.
- Kiểm thử hồi quy kiểm tra số lượng nét, hình học SVG, màu/độ dày đường viền, bằng nhau bề rộng 12px và vị trí theo lề. Thực hiện đầy đủ quy trình GitHub → build/test → Vercel Production READY cho lần chỉnh này.


## 2026-10-16 — Đúng hướng ba biểu tượng thụt lề và kéo điều chỉnh đoạn văn

- **Hai marker trái** nằm chồng theo chiều dọc tại cùng vị trí khởi đầu `contentStart`: marker **First Line** phía trên là khung có đầu nhọn **hướng xuống**; marker **Left/Hanging** phía dưới là mái nhọn **hướng lên**, nối với khung chữ nhật có **vạch ngang**. Chúng có thể di chuyển độc lập khi kéo.
- **Marker phải** nằm **phía dưới** thước ngang, là mái nhọn **hướng lên** nối với khung bên dưới; neo `contentEnd` và kéo ngang để tăng/giảm **right indent**. Không còn biểu tượng bên phải hình mũi nhọn hướng xuống.
- Ba marker là button độc lập với nhãn tiếp cận rõ ràng, mỗi marker **SVG 12 × 10px**, chiều ngang wrapper chính xác 12px (min/max cũng là 12px), viền xám 1px, nền trắng, `touch-action:none`, cursor `ew-resize`, hỗ trợ kéo bằng `pointerdown/move/up/cancel` và `setPointerCapture`.
- Chuyển dịch con trỏ màn hình thành đơn vị CSS px thực tế của trang bằng `100/zoom`, với marker phải ngược dấu. Snap tới **0,25cm** (`96/2.54/4` px), giới hạn để hai phía không vượt nhau. Marker trái trên tác động `text-indent = firstLine - left`, marker trái dưới tác động `margin-left`, marker phải tác động `margin-right` của đoạn hiện hành; không thay đổi lề giấy và vị trí gốc 0 trên dải thước trắng.
- Khi chuyển đoạn bằng caret, đọc lại `marginLeft`, `marginRight`, `textIndent` để đồng bộ vị trí marker. Khi xuất nội dung hoặc lưu bản nháp, hàm sanitize giữ lại ba style thụt lề an toàn dạng số px, bảo toàn chỉnh sửa qua reload.
- Giữ thước ngang cao 26px, dải trắng chừa 4px trên/dưới, số cm 1,2,3…, vạch chia cm ngoài vùng trắng, thước dọc rỗng và viền xanh focus editor đã xóa.
- Luôn tuân thủ quy trình đã thống nhất ở đầu file: **cập nhật Markdown, commit GitHub, chạy test/build, deploy Vercel Production và xác nhận READY** sau mỗi lượt chỉnh sửa.


## 2026-10-16 — Rút ngắn đầu tam giác, tăng chiều cao khung chữ nhật

- Yêu cầu: các marker thụt lề có đầu mũi nhọn quá cao, cần **giảm độ cao tam giác và tăng phần thân khung chữ nhật**, không thay đổi kích thước tổng thể hoặc thao tác kéo.
- Toàn bộ ba marker (`firstLine` hướng xuống phía trên, `left` và `right` hướng lên phía dưới) giữ nguyên **SVG rộng 12px, cao 10px**, viền xám `#818181` dày 1px và ruột trắng.
- Marker trên: khung chữ nhật bắt đầu `y=0.5`, kéo dài tới `y=6.5` (**cao 6px**); đầu tam giác từ `y=6.5` đến `y=9.5` (**cao 3px**), thay vì độ cao 5px trước đây.
- Hai marker dưới: đầu tam giác từ `y=0.5` đến `y=3.5` (**3px**); phần khung chữ nhật từ `y=3.5` đến `y=9.5` (**6px**). Vạch ngang của biểu tượng `left` chuyển từ `y=7` tới `y=6.5` cho cân đối.
- Chỉ sửa tọa độ `path d` của SVG, không chỉnh `pointer capture`, drag snapping 0,25cm, vị trí các marker, chiều cao thước 26px, dải trắng 4px hay vùng nhập liệu. Bổ sung kiểm thử kiểm tra tỷ lệ 3px/6px, ba marker rộng như nhau và chức năng kéo còn nguyên.
- Tuân thủ quy trình sau mỗi sửa: cập nhật file Markdown này, commit GitHub, test/build và triển khai Vercel Production đến trạng thái READY.


## 2026-10-16 — Hoàn thiện thước dọc giống thước ngang, không có Indent

- Thước **dọc** tiếp tục dùng thẻ cha `.wsl-word-vertical-ruler` rộng **23px**, nền xám `#e8e7eb`, đường viền phải 1px và chiều cao bám theo chiều cao thực của `.wsl-paper`. Không chuyển sang thước nổi cố định khác và không thêm biểu tượng/khả năng kéo Indent theo trục dọc.
- Thêm `VerticalRulerTicks` riêng có các thành phần đối xứng với thước ngang: `.wsl-word-vertical-cm-track` (vạch trên nền xám tính từ **mép trên paper**), `.wsl-word-vertical-content-strip` (dải nền trắng che vạch dưới, tính từ **lề trên vùng nội dung**), vạch cm ngắn và số nguyên cm.
- **Đơn vị centimet:** 1cm = `96/2.54` CSS px ở zoom 100%. Chia vạch mỗi **0,25cm**, gồm vạch dài ở mốc 1cm, nửa cm và một phần tư cm. Vạch nằm **ngang**, dày đồng nhất **1px**, chiều dài các cấp tương ứng **7px / 4,5px / 2,5px**, căn giữa theo chiều ngang thanh thước. Chỉ vạch cm **nền xám** còn dài; bên trong dải trắng, thay vạch dài bằng **số 1, 2, 3, ...** (Arial 10px, xoay 90°), không hiển thị mốc số 0.
- Dải trắng trục dọc có khoảng hở **4px bên trái và 4px bên phải**, `z-index:2` và `overflow:hidden`. Nền xám vẫn ở ngoài lề trên/dưới; giữ đúng thứ tự lớp như thước ngang. Không có biểu tượng Indent trên thước dọc.
- Tính vùng thước trắng theo `paperRect` và `editorRect`: `editorOffset = editorRect.top - paperRect.top`; điểm đầu = `editorOffset`, điểm cuối = `paperRect.height - editorOffset`. Giấy dùng cùng padding trên/dưới nên chính xác với **lề thường/hẹp** và chiều cao giấy có thể tăng khi nhập nhiều văn bản. Không dùng chiều cao editor hiện có làm chiều dài vùng trắng vì editor có thể chưa lấp hết phần nội dung trang A4.
- Bám cuộn dọc bằng `top:calc(var(--wsl-page-top-offset) - scrollTop)`, giữ `height:renderedPaperHeight` và tính vị trí thực giữa giấy và thước bằng `getBoundingClientRect()`. `ResizeObserver` quan sát giấy, thước, editor, đồng bộ lại khi thay đổi kích thước, zoom hoặc khổ A4 dọc/ngang; snap vạch theo pixel vật lý để giữ nét 1px rõ ràng.
- Hồi quy kiểm tra không xuất hiện marker Indent trên trục dọc, 16 tổ hợp hình học và 10 lượt QA, đúng 0,25cm, nền trắng phủ nền xám, số nguyên cm và giữ nguyên chức năng thước ngang.
- Sau mỗi chỉnh sửa tiếp tục **cập nhật Markdown, commit GitHub main, chạy kiểm thử/build, triển khai Vercel Production đến trạng thái READY**, và chỉ xác nhận sau khi kiểm tra trạng thái.


## 2026-10-16 — Sửa nút chỉ số dưới x₂ và chỉ số trên x² theo cơ chế BIU

- Hai nút **Subscript (x₂)** và **Superscript (x²)** ở `Home → Font` là các nút định dạng bật/tắt (toggle) giống **Bold (B), Italic (I), Underline (U)**; giữ nguyên thiết kế, icon, vị trí, hiệu ứng nút `.is-active` và trạng thái `aria-pressed` thông qua `formatActive`.
- `runHome` xử lý riêng `subscript`/`superscript` qua `toggleScriptFormat` thay vì gọi mù `command(name,value)`: khôi phục chính xác vùng chọn/caret bằng `restoreSelection()`, đọc `document.queryCommandState`, thực hiện `document.execCommand`, lưu lại lựa chọn bằng `rememberSelection()`, đồng bộ `formatActive`, rồi `markChanged()`. Kết quả có thể áp dụng trực tiếp cho chữ bôi đen hoặc kiểu gõ kế tiếp tại caret, tương tự BIU.
- Hai kiểu **loại trừ nhau**: trước khi kích hoạt x₂ phải bỏ x² nếu đang bật; trước khi kích hoạt x² phải bỏ x₂ nếu đang bật. Nhấn lại đúng nút đang bật sẽ tắt và đưa văn bản về chế độ chỉ số bình thường. Màu nền trạng thái của nút phải phản ánh dữ liệu định dạng thật từ editor.
- Nếu `execCommand` báo không hỗ trợ hoặc phát sinh lỗi, hiển thị trạng thái lỗi, không gọi `markChanged` và không giả vờ cập nhật thành công. Giữ nguyên các phần tử `SUP/SUB` thuộc danh sách HTML được phép để nội dung chỉ số được lưu, khôi phục và xuất tài liệu.
- Bổ sung kiểm thử hồi quy: kiểm tra wiring từ hai nút trên Ribbon đến editor, quyền giữ selection, chuyển đổi loại trừ x₂/x², bật/tắt nhiều lần, nút sáng trạng thái và đường đi lỗi. Kiểm thử mô phỏng lệnh gốc của trình duyệt để kiểm tra trạng thái qua các lần nhấn liên tục; vẫn cần kiểm tra trực quan trên trình duyệt để xác nhận trải nghiệm thực tế.
- Tuân thủ yêu cầu dự án: cập nhật tài liệu MD này, commit GitHub `main`, chạy tất cả test và Next.js build rồi deploy Vercel **Production READY** sau mỗi thay đổi.


## 2026-10-17 — Phân biệt hai chế độ x₂/x², sửa lỗi không tắt khi nhấn lần hai

- **Chế độ A — đang bôi đen văn bản:** Nhấn `Subscript (x₂)` hoặc `Superscript (x²)` để áp dụng trực tiếp trên đoạn bôi đen. Nhấn **chính nút đó lần nữa** để bỏ định dạng và trả chữ về vị trí ban đầu. Nhấn nút còn lại thì tắt định dạng cũ và bật định dạng mới. Phải **giữ nguyên vùng bôi đen** sau mỗi lần áp dụng bằng cách đo vị trí text trong editor trước khi gọi lệnh định dạng, rồi tái chọn bằng `restoreScriptTextSelection` để lần nhấn thứ hai không biến thành thao tác gõ tại caret.
- **Chế độ B — chưa chọn văn bản (caret):** Nhấn x₂/x² để vào **chế độ nhập chữ chỉ số tiếp theo**. Tạo thật một phần tử rỗng `<sub>` hoặc `<sup>` tại caret và đưa caret vào đó để các ký tự gõ mới kế thừa định dạng đã chọn. Nhấn chính nút đó lần hai sẽ đặt caret **ra ngoài** phần tử chỉ số và tắt trạng thái nút, không làm mất các ký tự đã nhập. Nhấn nút còn lại sẽ thoát chế độ cũ rồi tạo chế độ mới tương ứng. Phần tử rỗng chưa gõ ký tự sẽ được xóa khi thoát.
- Không tin hoàn toàn vào `document.queryCommandState` đối với caret rỗng hoặc vùng chọn có nút văn bản nằm trong `<sup>/<sub>`: dùng `scriptAncestor` và `rangeHasScript` đọc DOM thực để xác định x₂/x² đang được áp dụng; khi caret thay đổi, `syncFormatState` đồng bộ lại trạng thái nút theo node chứa caret. Giữ các nút **Bold/Italic/Underline/StrikeThrough** và style `.is-active` như trước.
- Giữ `onMouseDown(event.preventDefault())` của Home Ribbon để click không làm mất vùng bôi đen. Kiểm thử bảo đảm hai trạng thái loại trừ nhau, bật/tắt được bằng lần nhấn thứ hai, vùng bôi đen được duy trì, caret vào/ra phần tử chỉ số, text đã nhập không bị xóa và phần tử rỗng được dọn dẹp.
- Cần kiểm tra thêm trên trình duyệt thật sau deploy để xác nhận hành vi nhập liệu Unicode, undo/redo và thao tác IME đối với `contentEditable`; kiểm thử Node giả lập DOM không phải E2E thực. Không khẳng định đã kiểm tra trực quan khi chưa thực hiện.
- Quy trình bắt buộc sau chỉnh sửa: cập nhật file Markdown này, commit GitHub main, chạy kiểm thử và build, deploy Vercel Production và chỉ báo thành công khi trạng thái READY.
