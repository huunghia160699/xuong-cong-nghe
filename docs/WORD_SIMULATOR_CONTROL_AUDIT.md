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

## Tổng duyệt Word Lab — 31/10/2026 (PR #73, chưa Production)

### Phạm vi & độ tin cậy

**Bằng chứng:** GitHub Actions [#41175860593](https://github.com/huunghia160699/xuong-cong-nghe/actions/runs/41175860593), commit `5bc3fd1d`: `pnpm test` 242 PASS/0 fail, `pnpm typecheck` PASS, `pnpm build` PASS; Chromium thực chạy `scripts/word-browser-qa.mjs` trên **website local Demo**, chụp 360/768/1280px, kiểm DOM/selection sau khi bấm Ribbon/gõ bàn phím và khôi phục dữ liệu. Không tuyên bố đã thử trên Preview với tài khoản JWT hay Production. Script được nối vào `.github/workflows/ci.yml` và lưu screenshot + JSON lên Actions artifact.

### Ma trận tính năng

| Phạm vi | Đã có trong code | Bằng chứng Chromium thật | Trạng thái |
|---|---|---|---|
| Windows/QAT | Tên tệp; Save, Undo/Redo, New/Print, Close | Khung/10 tab, nút Save, bản nháp | **CORE PASS**, chưa E2E Undo/Redo + đóng |
| File | Tạo mới, nhập HTML/TXT ≤1 MB, xuất HTML/TXT, in/PDF qua browser | Save + reload giữ bảng/ngắt trang/chữ | **MỘT PHẦN**, import/export/print chưa E2E |
| Clipboard | Copy/Cut/Paste, Paste Rich, Format Painter | Chỉ đối chiếu mã và unit contract | **CHƯA E2E**, phụ thuộc quyền clipboard |
| Font | Font/size, B/I/U/strike, sub/super, Change Case, Clear, highlight/màu | Bold, Italic, Subscript bật/tắt vùng chọn, Change Case giữ B/I, Clear Format | **PASS CHO CA ĐÃ THỬ**; U/strike/super/caret/color/dropdown cần bổ sung |
| Paragraph | Bullets/Numbering, indent/ruler, align, line spacing, shading/borders, sort, ¶ | Bật/tắt ¶ | **MỘT PHẦN**, đa đoạn và kéo thước chưa E2E |
| Styles/Editing | Normal/Heading/Title, Find/Replace/Select | Contract test, chưa bấm hành vi | **CHƯA E2E** |
| Insert | Bảng 3×3, ảnh ≤2 MB, link, đường kẻ, ngắt trang | Chèn bảng thật, Ctrl+Enter tạo trang 2 | **MỘT PHẦN**; ảnh/link chưa E2E |
| Layout | A4 dọc/ngang, lề thường/hẹp, trang nhiều tờ | Tồn tại giấy A4 tại 3 widths | **MỘT PHẦN**; xoay/lề chưa E2E |
| Review/View | Spellcheck browser, Find, đếm từ/ký tự; thước, zoom 60–160%, fullscreen | Đổi zoom 100→110% | **MỘT PHẦN** |
| Document engine | contentEditable, Ctrl+Enter, phân trang, lề chọn dòng, IME, autosave 750ms | Nhập chữ thật, Ctrl+Enter, **gõ tiếp đúng trang 2**, hai trang A4, lưu/reload giữ đúng | **PASS CÁC LUỒNG NỀN**; auto-split dài/IME/caret dòng trống còn cần E2E |
| Design/References/Mailings/Help | Tab giới thiệu chưa hỗ trợ | Xác nhận có tab | **CHƯA TRIỂN KHAI** |

**Không hỗ trợ**: DOCX thực, Header/Footer, Track Changes, Comments, mục lục tự động, layout Word tương thích từng pixel, đồng bộ đám mây và chấm bài.

### Phát hiện/rủi ro từ đối chiếu code (chưa gọi là lỗi tái hiện trong Chromium)

1. **P0 — Cut/Clipboard có nguy cơ mất dữ liệu:** `runHome("cut")` gọi `document.execCommand("delete")` khi `execCommand("cut")` trả false, sau đó luôn `markChanged()`. Cần chỉ xóa sau khi có clipboard write thành công hoặc có buffer khôi phục bảo đảm; test quyền bị từ chối/trình duyệt khác.
2. **P1 — Sort có nguy cơ phá định dạng:** `sortLines()` gọi `selectedChange()`, thao tác `execCommand("insertText")` thay cả selected range; B/I/links/highlight trong phạm vi có thể bị làm phẳng. Cần bảo toàn các node inline hoặc công bố rõ giới hạn trước khi xử lý.
3. **P1 — Undo/Redo với DOM surgery và auto pagination chưa có E2E:** `execCommand("undo"/"redo")` không chắc phủ hết những thay đổi trực tiếp DOM (Sub/Super, Change Case, phân trang). Kiểm tra mất selection và history trên tài liệu nhiều trang, IME tiếng Việt.
4. **P2 — Find/Replace còn tối giản:** `findText` chỉ dò kết quả đầu tiên trong từng text node; `replaceText` dùng `window.prompt` và thay **một kết quả**. Chưa có Find Next/Replace All, không tìm xuyên nhiều inline node.
5. **P2 — Phạm vi Format Painter giới hạn:** sao chép `font`, `color`, `bold`, `italic`, chưa tái tạo gạch chân, cỡ, khoảng cách đoạn và bảng; không nên mô tả là copy toàn bộ định dạng.
6. **P1 — Import/export, ảnh, clipboard HTML còn phụ thuộc trình duyệt:** HTML được lọc trước khi nhập/lưu, hình chỉ data:image, chưa test E2E file 1/2 MB và round-trip; PDF qua Print, không phải DOCX.

### Thứ tự xử lý

- **P0:** chặn mất dữ liệu khi Cut thất bại, Undo/Redo và selection reflow thực; test trên Chrome/Edge, clipboard quyền bị chặn.
- **P1:** Sort không mất markup, dài nhiều trang, IME Telex, bôi dòng ở lề trái, nhập ảnh/HTML và xuất tệp round-trip.
- **P2:** Find/Replace hoàn chỉnh, nâng Format Painter, tăng lựa chọn Insert và bổ sung hỗ trợ DOCX chỉ sau khi có engine thật.

**Quyết định:** Word Lab vẫn `building`, không tự tick nhóm bảng/ảnh/in/lưu nháp là hoàn tất; bộ QA Chrome core là mục riêng đã PASS. Không thay code trình soạn thảo, không deploy Production khi chỉ yêu cầu tổng duyệt. Admin Roadmap Production metadata CAS v12→v13, 21 epics giữ nguyên; Word epic order 11, chỉ thêm QA PASS và việc còn mở.
