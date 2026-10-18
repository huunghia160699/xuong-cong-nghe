# Changelog

## 2026-10-19 — Sửa giãn dòng và giãn đoạn trong Word
- Mặc định giảm giãn dòng từ 1.55 xuống 1.15; khoảng cách sau mỗi đoạn từ 13px về 8px, tránh Enter một lần tạo dòng trông quá xa.
- Menu Line Spacing và hộp thoại Paragraph cho chọn giãn dòng 1/1.15/1.5/2 và cách trước/sau đoạn 0/6/12/18px.
- Khi bôi chọn nhiều đoạn, điều chỉnh giãn dòng, giãn đoạn áp dụng đồng bộ lên toàn bộ đoạn được chọn; lưu và khôi phục được cả cách trước lẫn cách sau.
- Giữ nguyên phân trang, Ctrl+Enter, ¶ và định dạng nội tuyến.

## 2026-10-19 — Dấu ¶ cùng cỡ chữ, lề chọn dòng dùng mũi tên
- Dấu ¶ cuối đoạn và tiêu đề theo cỡ chữ tính từ ký tự cuối, không còn cỡ 12px cố định.
- Đoạn trống: ¶ nằm cạnh caret trên cùng dòng, dùng khoảng cách tỉ lệ với font thay vì tọa độ 3px/2px. Giữ caret native theo font-size thực.
- Khi đổi cỡ chữ tại con trỏ chưa bôi chọn và nhập tiếp, dấu ¶ cập nhật theo span định dạng mới.
- Vùng chọn lề trái luôn trong suốt, chuột hiển thị mũi tên chuẩn (`cursor:default`) chứ không phải bàn tay. Giữ khả năng nhấp/kéo chọn dòng.
- Bổ sung bộ kiểm thử nhiều cỡ chữ và kiểm tra hồi quy về con trỏ.

## 2026-10-19 — Ngăn con trỏ nhập nằm ngoài lề A4 sau Ctrl+Enter
- Khắc phục vùng chọn bị neo ở wrapper của trang giấy hoặc `contentEditable` khiến caret xuất hiện sát biên tờ A4, trong khi dấu ¶ đúng lề bên trong.
- Tự khôi phục caret về đoạn văn hợp lệ khi phân trang, focus, nhập chữ và Ctrl+Enter; giữ nguyên vùng bôi chọn hợp lệ cùng trạng thái định dạng.
- Không thay đổi giao diện ký hiệu ¶/Page Break, bố cục A4 và nội dung tài liệu.
- Bổ sung kiểm thử hồi quy đúng trường hợp caret ở editor root và page wrapper.

## 2026-10-19 — Hiển thị dấu Page Break và tự chuyển màn hình sang trang mới
- Khi Ctrl+Enter hoặc Insert → Ngắt trang, hiển thị dấu ngắt trang dạng đường chấm ngang với `Page Break` giữa đường và `¶` ở bên phải, giống hình mẫu Word; marker không xuất hiện khi in.
- Tự cuộn vùng trang tài liệu đến đầu trang mới sau khi phân trang xong, giữ caret sẵn để gõ. Khi gõ đầy trang khiến nội dung tự chuyển sang trang kế cũng tự cuộn.
- Tôn trọng mức zoom và chỉ cuộn khu vực soạn thảo, không cuộn cả trang web hoặc che Ribbon.
- Dấu ngắt được giữ khi lưu/khôi phục; tiếp tục không thể sửa bên trong marker.
- Thêm kiểm thử hiển thị, sự kiện Ctrl+Enter và độ chính xác vị trí scroll.

## 2026-10-18 — Dấu ¶ nằm cạnh con trỏ trong đoạn trống
- Khắc phục CSS khiến dấu kết thúc đoạn ¶ rơi xuống dưới khi đoạn trống có `<br>`; đoạn trống giờ hiển thị ký hiệu cạnh con trỏ trên cùng dòng.
- Khi nhập chữ, ký hiệu tiếp tục chạy theo cuối dòng thay vì nhảy từ dòng dưới lên.
- Không sửa tài liệu, không bỏ `<br>`, không tác động Enter, Ctrl+Enter hoặc phân trang.
- Bổ sung kiểm thử dấu ¶ của đoạn rỗng và đoạn có chữ.

## 2026-10-18 — Sửa lỗi Enter/¶ thừa và con trỏ nhảy trong Word phân trang
- Khi tài liệu đã có đoạn trống `<p><br></p>`, không tự tạo thêm đoạn rỗng chỉ vì `textContent` trống.
- Phục hồi vị trí con trỏ theo phần tử và offset gốc, phân biệt các đoạn trống cùng có độ dài 0.
- Khi nội dung còn vừa một trang A4, không tháo và dựng lại DOM sau mỗi lần gõ, giữ con trỏ ổn định hơn và tránh phá thao tác nhập.
- Thêm bài kiểm thử tái hiện 2 dấu ¶ và nhập chữ làm con trỏ nhảy; giữ Ctrl+Enter và định dạng khác.

## 2026-10-18 — Lề trái chọn dòng không còn nền hover
- Xóa nền xanh nhạt khi rê chuột vào lề trái của trang Word; lề luôn trong suốt.
- Giữ nguyên chức năng nhấp chọn dòng, kéo chọn nhiều dòng và con trỏ `pointer`.
- Bổ sung kiểm thử chống tái xuất hiện màu hover.

## 2026-10-18 — Sửa trang A4 chồng và lệch lề sau phân trang
- Loại bỏ padding, nền trắng, viền và min-height A4 cũ trên wrapper `.wsl-paper` trong stylesheet tải sau cùng; chỉ các trang con `.wsl-document-page` được tạo khung giấy.
- Ngăn trang trắng giả xuất hiện phía sau và trang chứa nội dung bị lệch sang phải/xuống dưới khoảng 87×86px.
- Giữ nguyên chức năng phân trang và Ctrl+Enter, không sửa DOM/rich-text editor.
- Thêm regression test kiểm tra thứ tự import CSS và các thuộc tính chống lỗi chồng trang.

## 2026-10-18 — Phân trang Word A4 tự động và ngắt trang Ctrl+Enter
- Thay tờ giấy có chiều cao tự kéo dài bằng nhiều trang A4 riêng biệt, cùng kích thước, lề và khoảng cách 24px. Nội dung tự chạy sang trang mới khi đầy.
- **Ctrl+Enter / Cmd+Enter** và nút Ngắt trang trong Insert chèn ngắt trang thực, đặt con trỏ vào trang kế, ghi dấu ngắt cùng tài liệu khi lưu/khôi phục/xuất.
- Giữ một vùng rich text `contentEditable` liên tục để dùng định dạng, lựa chọn văn bản, điều khiển Ribbon. Các thẻ trang hiển thị không được lưu vào nội dung.
- Thanh trạng thái hiển thị số trang hiện tại và tổng số trang; thước tham chiếu trang A4 đầu, vùng chọn dòng lề trái theo từng trang.
- Bổ sung kiểm thử phân trang, ngắt trang, lưu dấu ngắt, tích hợp thước và trạng thái trang.

## 2026-10-18 — Chọn dòng và nhiều dòng từ lề trái của trang Word
- Thêm vùng chọn ở lề trắng bên trái, nằm ngoài khung nhập liệu `contentEditable`.
- Nhấp vào lề → bôi chọn nguyên dòng hiển thị (kể cả dòng tự xuống do wrap); kéo lên hoặc xuống → mở rộng lựa chọn qua nhiều dòng.
- Hỗ trợ chữ mang nhiều định dạng inline; giữ vùng chọn để dùng công cụ Font và Paragraph.
- Dùng pointer capture; hiệu ứng hover nhẹ; ẩn vùng chọn khi in, không làm thay đổi dữ liệu tài liệu.
- Bổ sung kiểm thử chọn dòng, kéo nhiều dòng hai chiều và tích hợp CSS/sự kiện.

## 2026-10-18 — Khối chữ nhật dưới Left Indent sát phần trên
- Kéo phần chữ nhật dưới lên 1px để tiếp giáp với phần thân của dấu Left Indent.
- Giữ nguyên đáy, tổng kích thước 12×14px, đường viền ba cạnh, `cursor: pointer` và chức năng kéo.
- Cập nhật kiểm thử SVG theo tọa độ mới.

## 2026-10-18 — Left Indent bỏ đường viền trên khối dưới
- Loại bỏ border-top của thanh chữ nhật phía dưới Left Indent, giữ cạnh trái, phải, dưới.
- Không thay chiều cao, vị trí, cursor pointer và cơ chế kéo các dấu thụt lề.
- Cập nhật kiểm thử SVG để ngăn đường viền trên xuất hiện trở lại.

## 2026-10-18 — Thiết kế lại dấu thụt lề trên thước Word
- Left Indent: hình mũi nhọn và thân giống Right Indent, thêm một khối chữ nhật phía dưới để phân biệt.
- First Line Indent và Right Indent: giảm độ cao phần chữ nhật còn 4px; giữ chiều rộng 12px, nét viền 1px.
- Left Indent cao 14px; hai dấu còn lại 10px, giữ vị trí neo và thao tác kéo độc lập.
- Khi hover cả ba dấu dùng `cursor:pointer`, không còn `ew-resize`; giữ pointer capture và đồng bộ văn bản khi kéo.
- Cập nhật kiểm thử SVG/CSS và hành vi kéo trên các mức zoom, không thay đổi phần còn lại của Ribbon Home.

## 2026-10-18 — Nút căn đoạn văn hiển thị active theo văn bản
- Đồng bộ trạng thái **Align Left, Center, Align Right, Justify** với kiểu căn của đoạn tại con trỏ/bôi chọn; nút đang được áp dụng sáng giống Bold/Italic/Underline.
- Chuyển con trỏ qua các đoạn văn căn khác nhau làm đổi nút active tương ứng, mặc định Left với đoạn chưa định dạng.
- Sau lệnh căn văn bản, cập nhật active ngay; giữ nguyên hành vi nút, lớp CSS, thước và các chức năng Word khác.
- Bổ sung kiểm thử chuyển đoạn và thay đổi căn lề theo 10 vòng.

## 2026-10-18 — Paragraph và thước Left Indent đồng bộ đoạn văn
- Kéo Left Indent (mốc bên dưới) làm cả đoạn văn và dòng đầu di chuyển theo; bảo toàn khoảng lệch first-line/hanging indent.
- Điều chỉnh First Line Indent độc lập, Right Indent theo lề phải; thước căn theo vùng soạn thảo, hỗ trợ zoom 60/100/160%.
- Increase/Decrease Indent sử dụng cùng margin CSS như thước, tránh lỗi lệch giữa Ribbon và ruler.
- Ưu tiên đoạn có caret thực khi chọn mục tiêu; thước ngang chứa nút có thể tương tác không còn `aria-hidden`.
- Kiểm thử 14 công cụ Paragraph và các kiểu khoảng cách, nền, viền, đánh số, căn lề và kéo thước lặp 10 vòng với kiểm tra CSS đoạn văn.

## 2026-10-18 — Sửa phím Space và font chọn trước khi nhập trong Word
- Không xóa mọi dấu cách NBSP của trình duyệt; chỉ xóa placeholder thoát Sup/Sub được đánh dấu riêng.
- Chọn font hoặc cỡ chữ ở con trỏ khi chưa bôi chọn sẽ giữ nguyên trạng thái dropdown và áp dụng lên nội dung gõ sau đó, gồm cả dấu cách.
- Hỗ trợ chọn lại font/cỡ trước khi gõ mà không tạo lồng thẻ rỗng; xóa zero-width placeholder sau khi nhập ký tự.
- Thêm kiểm thử hồi quy nhập dấu cách và đổi font ở Range thu gọn.

## 2026-10-18 — Hoàn thiện Change Case (Aa) trong Word mô phỏng
- Menu có đủ 5 thao tác: Viết hoa đầu câu, chữ thường, CHỮ HOA, Viết Hoa Từng Từ và đẢO hOA/tHƯỜNG.
- Nút Aa chính đảo hoa/thường **từng ký tự**, thay vì đổi cả vùng thành một kiểu chữ.
- Viết hoa đầu câu nhận dấu chấm, chấm hỏi, chấm than và qua các đoạn khác nhau; Viết Hoa Từng Từ xử lý tiếng Việt, dấu nối và dấu câu.
- Vẫn giữ nguyên cấu trúc định dạng hỗn hợp của đoạn được bôi chọn (đậm, nghiêng, gạch chân, chỉ số, liên kết...) và vùng chọn sau chuyển đổi.
- Thêm kiểm thử chức năng 5 kiểu Change Case và nội dung tiếng Việt qua các thẻ định dạng.

## 2026-10-18 — Nút Sup/Sub active đúng theo vùng chữ được chọn
- Sửa `rangeHasScript` theo đúng semantics của `Range.compareBoundaryPoints`: dùng START_TO_END kiểm tra cuối vùng chọn nằm sau đầu text node, END_TO_START kiểm tra đầu vùng chọn nằm trước cuối text node. Trước đây đảo hai phép so sánh nên chọn chữ đã Sup/Sub không báo active.
- Giữ cấu trúc DOM Sup/Sub và các nút Bold/Italic/Underline không thay đổi.
- Bổ sung kiểm thử nhận diện chữ Sup, Sub, chữ thường, vùng chọn hỗn hợp và chọn một phần nội dung; cập nhật assertion kiểm thử Ribbon.

## 2026-10-18 — Khôi phục bôi chọn và Superscript/Subscript
- Ưu tiên vùng chữ đang được bôi chọn trước logic thoát chế độ gõ chỉ số, tránh xóa selection sai.
- Sửa cách kiểm tra vùng chọn Sup/Sub theo quy tắc `Range.compareBoundaryPoints` của trình duyệt.
- Cho phép kéo chọn qua mốc ngăn IME khi chuyển Sup/Sub → văn bản thường.
- Không tìm và tắt thẻ chỉ số bất kỳ trong tài liệu khi toolbar cập nhật trễ; hỗ trợ chuyển đổi từ Sup sang Sub hoặc ngược lại tại caret.
- Thêm kiểm thử lựa chọn, bật/tắt và chuyển đổi của cả hai chế độ; giữ logic Telex.

## 2026-10-17 — Khắc phục Telex tiếp tục ghép chữ trong Sup/Sub
- Khi tắt Superscript hoặc Subscript, kết thúc phiên IME và chuyển caret ra vùng chữ thường độc lập với thẻ chỉ số.
- Giữ ranh giới nhập Telex cho đến khi bộ gõ hoàn thành, tránh ký tự kế tiếp sửa ký tự cuối của Sup thành chữ có dấu hoặc tự bật lại Sup.
- Ranh giới ẩn chỉ dùng lúc nhập, không lưu vào bản nháp/xuất HTML.
- Thêm kiểm thử hồi quy cho chuỗi `aaaaa` trong Sup → tắt Sup → nhập `a`; không thay đổi thiết kế Ribbon Home.

## 2026-10-17 — Sửa tràn và biến dạng bố cục Word 01
- Xóa các quy tắc CSS chồng nhau từng làm thẻ bước cao quá mức và tràn khỏi màn hình.
- Giữ chiều cao khối theo nội dung, không kéo giãn bằng `1fr` hay `height:100%` trên mỗi bước.
- Slide 2 dùng hai cột cân đối, nội dung không bị dồn thành cột hẹp bên trái; trên điện thoại xếp một cột.
- Các thẻ Word khác căn đều theo hàng, giữ mũi tên và không làm thay đổi bài học hay công cụ Word.

## 2026-10-17 — Đồng bộ thẻ kiến thức và cân lại slide 2 Word 01
- Loại bỏ chi tiết trang trí thừa ở góc tiêu đề và các ký tự minh họa quá lớn trên slide 2.
- Các thẻ nội dung cùng loại bằng nhau về rộng/cao, không phụ thuộc chữ nhiều hay ít; toàn bộ nội dung bắt đầu từ phía trên thẻ.
- Bỏ kiểu một thẻ chiếm hai hàng làm lệch kích thước và chữ chìm đáy.
- Slide 2 gồm hai khối so sánh cân đối theo chiều ngang, bỏ chiều cao tối thiểu quá lớn làm thẻ rỗng.
- Giữ nút Word ở toolbar chung; các nút/thanh tiến độ thừa bên trong slide đã được xóa.

## 2026-10-17 — Xóa tiến độ và nút Word thừa dưới slide Word 01
- Bỏ dãy số và vạch tiến độ `02 — 31` trong chân mọi slide Word 01.
- Bỏ nút `Mở Word thực hành` lặp ở chân slide và trên bìa.
- Giữ nút `Word` ở thanh điều khiển trình chiếu để vẫn mở được công cụ trực tiếp trong bài giảng.
- Loại bỏ CSS/thành phần không dùng; không chỉnh nội dung bài học, trình phát hay Word Home Ribbon.

## 2026-10-17 — Căn chỉnh tiêu đề, thẻ nội dung và mũi tên Word 01
- Tiêu đề tự co cỡ chữ theo chiều rộng thực để nằm một dòng; tiêu đề quá dài vẫn cuộn ngang thay vì tràn hoặc tự xuống dòng.
- Khắc phục ba bước xếp dọc tràn lên tiêu đề do căn giữa vùng nội dung khi vượt quá chiều cao.
- Tăng mũi tên luồng ngang lên 42px, luồng dọc 40px, mũi tên chỉ lệnh 23px; chừa khoảng trống cho mũi tên.
- Giảm min-height và padding thẻ so sánh, nội dung, quy trình, phím tắt, câu hỏi; giữ khoảng trắng theo nội dung thực.
- Không sửa nội dung bài học hoặc công cụ Word.

## 2026-10-17 — Đổi mới toàn bộ bài trình chiếu Word 01
- Dùng nhiều bố cục theo loại nội dung: cover chữ lớn, so sánh, quy trình ngang/dọc, thẻ kiến thức bất đối xứng, phím tắt, ví dụ văn bản, bài thực hành và quiz.
- Các bước hướng dẫn Word luôn hiện đầy đủ ngay khi mở slide; không cần bấm từng bước.
- Bỏ mô phỏng Word trang trí bị trùng; chỉ mở công cụ Word đầy đủ đã tích hợp khi thực hành.
- Thêm animation/transition nhẹ, phản hồi quiz, responsive và reduced-motion; giữ nguyên dữ liệu và bộ Home Ribbon.

## 2026-10-17 — Trình soạn thảo Word trực tiếp trong slide Word 01

- Thêm công cụ Word hiện tại vào một cửa sổ thực hành ngay trong slide, không mở trang/tab mới hoặc dùng video.
- Trạng thái trang Word được giữ khi quay về bài giảng và chuyển slide; truy cập bằng nút Word trên thanh trình chiếu hoặc nút thực hành trong từng hướng dẫn.
- Làm mới khung thẻ nội dung và các panel Word 01 bằng CSS responsive, hiệu ứng nhẹ có hỗ trợ giảm chuyển động.
- Không chỉnh sửa Home Ribbon đã hoàn thiện và không thay đổi nội dung kiến thức.
- Nút X của cửa sổ Word khi nhúng sẽ lưu nháp và trở về slide thay vì mở trang Công cụ bên trong iframe; vẫn giữ `onClick={onClose}` nguyên bản, không ảnh hưởng Word độc lập.

## 2026-10-15 — Chuẩn hóa nhóm Font hai hàng

- Tất cả ô chọn phông, cỡ chữ và nút Font cao 27px; biểu tượng và mũi tên chọn được căn chính giữa theo chiều dọc.
- Mũi tên xanh tăng/giảm cỡ chữ đặt ngay sát mép chữ A bằng khoảng trống CSS 3px, không còn phụ thuộc tọa độ tùy chỉnh riêng cho từng cỡ A.
- Các vạch đứng nhỏ Font và Paragraph được chuẩn hóa cùng chiều rộng 1px, cao 18px, màu xám nhạt và vị trí căn giữa.
- Giữ nguyên thứ tự nhóm Ribbon và chức năng.


## 2026-10-15 — Rút ngắn khoảng cách giữa chữ A và mũi tên Font Size

- Dịch hai chevron xanh sát chữ A thêm 1,25px, giúp khoảng cách thị giác giảm khoảng một nửa.
- Giữ nguyên kích thước 5×4px, hàng ngang chung, chênh lệch vị trí phù hợp chữ A lớn/nhỏ và các chức năng.


## 2026-10-15 — Thu nhỏ, căn đều khoảng trống giữa A và mũi tên

- Thu hai mũi tên tăng/giảm Font Size còn khoảng nửa kích thước, cùng một hàng ngang trên đỉnh A nhỏ.
- Điều chỉnh riêng tọa độ ngang của mũi tên nút A nhỏ để khoảng cách giữa A và mũi tên cân bằng với nút A lớn.
- Giữ nguyên thao tác và mọi nhóm Ribbon khác.


## 2026-10-15 — Sửa icon Font Size và Indent không đúng hình mẫu

- Sửa selector CSS cũ ghi đè màu chevron xanh trên chữ A thành xám; màu xanh nay được áp dụng đúng.
- Vẽ lại Decrease/Increase Indent đúng ảnh mới nhất: ba nét ngang xám và mũi tên xanh đặc, rõ ràng ở giữa.
- Thêm kiểm thử hồi quy CSS cascade và hình dạng SVG, giữ nguyên các chức năng.


## 2026-10-15 — Biểu tượng A và Indent theo ảnh gốc mới

- Cặp tăng/giảm Font Size sử dụng nét nhọn xanh lam nhỏ ngay góc trên bên phải A thay cho tam giác đen đặc trước đây.
- Hai nút Indent giữ 4 dòng ngang, chỉnh mũi tên thành nét xanh nhỏ, không dùng khối mũi tên dày.
- Không thay đổi thao tác, trạng thái disabled, căn chỉnh hàng hay các nhóm Ribbon khác.


## 2026-10-15 — Tam giác tăng/giảm Font Size sát mẫu

- Hai nút tăng và giảm cỡ chữ Word dùng tam giác đặc hơi bo góc, không có thân mũi tên, đặt ngay đỉnh bên phải chữ A.
- Mũi tên có màu đen theo ảnh tham khảo, giữ nguyên đường chân chữ A, thứ tự bố cục và chức năng.


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
