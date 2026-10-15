# Quy chuẩn trình chiếu — Xưởng Công Nghệ

Áp dụng cho công cụ `/cong-cu/trinh-chieu` và các bài giảng tạo mới.

## 1. Nội dung: Mở đầu → Thân bài → Kết luận

- **Mở đầu:** tiêu đề, tình huống khởi động, mục tiêu và khái niệm cần có.
- **Thân bài:** đưa kiến thức theo trình tự nhận biết → thao tác → luyện tập/giải quyết tình huống; dành chỗ cho mô phỏng, bài tập và trắc nghiệm.
- **Kết luận:** tối đa một vài nguyên tắc nhớ lâu, hành động/kiểm tra sau phần nội dung.
- Lesson khai báo `phases` (3 phần) và có thể giữ `sections` chi tiết để chia chủ đề; nội dung một bài dùng chung giữa các lớp.

## 2. Giảm tải nhận thức

- Mỗi slide nên có **3–7 nhóm ý** theo hướng dẫn 5 ± 2, ưu tiên một thông điệp chính.
- **6×6 là mục tiêu biên tập, không phải quy tắc máy móc:** khoảng tối đa sáu dòng văn bản chính, mỗi dòng ngắn; tiếng Việt, tên tệp, mã lệnh, công thức và đường dẫn có thể cần số từ dài hơn.
- Không dùng `line-clamp` để làm mất kiến thức. Khi quá dày, phân bổ sang slide tiếp theo hoặc đưa diễn giải/bổ sung vào `notes`.
- Trắc nghiệm ưu tiên một câu hỏi và bốn đáp án lớn, kết quả đúng/sai cần rõ. Tệp demo/mô phỏng phải giữ nhãn và thao tác chính xác.
- Bài File Explorer hiện giữ 29 slide, 5 quiz; slide phím tắt chỉ chiếu 6 mục chính, 3 mục bổ sung lưu trong ghi chú giảng viên.

## 3. Typography cho máy chiếu

- Dùng 2 font có sẵn của Xưởng Công Nghệ: **Manrope** cho tiêu đề, **Be Vietnam Pro** cho nội dung.
- Đặt mục tiêu tiêu đề chính **trên 40 pt** (~54 px với 96 dpi) ở màn chiếu thông dụng; chữ diễn giải chính cỡ tương đương **18–28 pt** (~24–37 px) khi có đủ không gian. Công cụ dùng `clamp()` và responsive; khi cửa sổ nhỏ, giảm tương ứng để không vỡ bố cục.
- Tách nhãn/breadcrumb/đối tượng giả lập hệ điều hành khỏi nội dung giảng dạy; các nhãn kỹ thuật nhỏ không được dùng làm chữ bài giảng chính.
- Giữ dòng ngắn, line-height thoáng, không dùng nhiều họ font hay chữ in hoa cho đoạn dài.

## 4. Màu sắc và tương phản

- **Bảng màu hiện hành**: navy `#04122D`, blue `#005BFD`, cyan `#00E9FD`, ice `#F0F6FD` và trắng; xám là sắc độ trung tính cho phân tầng. Blue làm CTA, cyan nhấn trên navy.
- Chỉ dùng đỏ/amber cho trạng thái sai hoặc cảnh báo có ý nghĩa, không trang trí tùy hứng.
- Nền sáng ↔ chữ tối; slide mở đầu nền tối ↔ chữ trắng. Không lạm dụng gradient, kính mờ, nhiều màu hay hiệu ứng.
- Layout dùng grid thẳng hàng. Bốn nhóm ý trình bày **2×2**, không ép bốn cột chữ nhỏ.

## 5. Bố cục trình phát

- Slide phủ toàn bộ viewport (`100dvh`), không có header/footer website.
- Thanh chấm phân trang nằm **nổi ở cạnh phải slide**.
- **Viên thuốc trái** chỉ có hai nội dung chữ: **tên lớp và tên môn**; có các nút quay lại, reset, ghi chú.
- **Viên thuốc phải** có lên/xuống, số slide, toàn màn hình.
- Tránh làm mất tương tác hoặc nội dung để vừa kích thước: phần quá dài có thể cuộn bên trong slide; tối ưu nội dung trước khi dùng giải pháp đó.

## Kiểm tra

`node --experimental-strip-types scripts/validate-ppt.mjs`, `pnpm test`, `pnpm typecheck`, `pnpm build`.

Kiểm tra trực quan trên 1280×720, 1920×1080, tablet/điện thoại và máy chiếu thực tế. Quy tắc về cỡ chữ là mục tiêu thiết kế, không thể chứng nhận độ đọc dễ từ mã nguồn đơn thuần.

## 6. Bố cục tiêu đề slide nội dung (cập nhật)

- **Mặc định:** Nhãn chủ đề ngắn (nếu cần) → một tiêu đề nội dung lớn, có thông điệp → **khối nội dung trực tiếp** (mô phỏng, bảng, thao tác, đối chiếu hoặc quiz). **Không tự động đặt subtitle/câu mô tả nhỏ dưới tiêu đề lớn.**
- Giữ `slide.subtitle` trong dữ liệu cũ để bảo toàn nội dung, nhưng chỉ hiển thị nó trong ghi chú giảng viên; không xóa dữ liệu gốc khi thay bố cục.
- Chỉ dùng dòng phụ trong chính một thành phần (ví dụ nhãn File Explorer, chú thích ảnh, lời giải đáp án), nếu nó tạo thêm giá trị, không lặp ý của tiêu đề.
- Mở đầu bài File Explorer dùng khối `lessonCover` tái sử dụng: tiêu đề, **ba mục tiêu ngắn**, mockup File Explorer, một câu hỏi khởi động. Bỏ hoàn toàn thống kê số slide/số câu hỏi ở trang mở đầu.
- Tránh hai nhan đề cạnh nhau, một tiêu đề quá dài hoặc hai đoạn cùng diễn giải lại một ý. Nếu slide cần quá nhiều câu để tự giải thích, cân nhắc tách slide hoặc thêm hướng dẫn vào ghi chú.
- Tham khảo: Microsoft PowerPoint [Tips for creating effective presentation](https://support.microsoft.com/en-us/powerpoint/tips-for-creating-and-delivering-an-effective-presentation), [Accessible slides](https://support.microsoft.com/en-us/accessibility/powerpoint/make-your-powerpoint-presentations-accessible-to-people-with-disabilities), Duarte [One idea per slide](https://www.duarte.com/blog/secrets-to-choosing-designing-unforgettable-visual-aids/).

## 7. Slide 01–02: tách mục tiêu và tình huống (14/10/2026)

- **Slide 01**: chỉ có tiêu đề, ba mục tiêu, mô phỏng File Explorer kích thước lớn. Không để câu hỏi khởi động trong cover.
- **Slide 02**: chỉ dùng tình huống tương phản, trọng tâm minh họa trực quan (Desktop rải tệp ⇢ thư mục Word/Excel/Hình ảnh rõ ràng).
- Đầu tiên chỉ hiện tình huống bừa bộn; giáo viên **bấm “Hiện cách sắp xếp”** để xuất hiện phương án ngăn nắp. Hiệu ứng ngắn, có tùy chọn giảm chuyển động và nút đặt lại; không tự chạy khi chuyển slide.
- Câu hỏi “Máy tính của em đang giống bên nào hơn?” xuất hiện ở chân nội dung slide; sau khi lộ phương án, bổ sung gợi hỏi tìm lại ảnh/bài văn.
- Dùng mockup giao diện máy tính bằng React/CSS, **không phải ảnh chụp Desktop thật**, tránh đưa dữ liệu cá nhân vào nội dung công khai.
- Giữ nguyên số lượng **29 slide** và 5 câu hỏi trắc nghiệm, không làm thay đổi thứ tự bài.

## Tổ chức theo phần học

Không gắn bài trình chiếu Tin học với số buổi hoặc số bài. Dùng tên chủ đề làm đơn vị bền vững (ví dụ **Phần 1 · Quản lý tệp và thư mục**); các lớp khác nhau có thể phân bổ phần nội dung vào nhiều buổi tùy tiến độ. Slide nhỏ vẫn đánh số để điều hướng, không gọi số slide là số bài.

## 8. Word/Excel cơ bản — cấu trúc chủ đề (14/10/2026)

- Tách `Word cơ bản` và `Excel cơ bản` thành **hai course độc lập** trong danh mục trình chiếu, không gộp chung hoặc đánh số buổi dạy.
- Mỗi course gồm các lesson theo chủ đề; slide 01 mở đầu, phần nội dung gồm khái niệm, thao tác, ví dụ thực hành, tối thiểu hai quiz tương tác, và slide tổng kết.
- Mỗi lesson sử dụng dữ liệu TypeScript và 15 bố cục có sẵn; hướng dẫn chi tiết và đáp án để trong `notes`. Không sao chép các slide Word/Excel vào thư viện bố cục mẫu.
- Excel có thể dùng dấu `,` hoặc `;` để phân tách tham số tùy vùng/cài đặt; ví dụ trong slide dùng dấu phẩy, ghi chú giải thích sự khác biệt.
- Ảnh minh họa bảng và tài liệu là mô phỏng cấu trúc, không coi là tài liệu Word/Excel đang chạy; bài thực hành yêu cầu người học mở phần mềm thật.

## 9. Word cơ bản — mô phỏng giao diện CSS (14/10/2026)

- Chỉ nâng cấp phần Word; giữ nguyên Excel và File Explorer.
- Giao diện Word mô phỏng do dự án dựng bằng CSS/React, **không phải ảnh chụp sản phẩm Microsoft, không có chức năng biên tập Word thật**.
- 49 slide hướng dẫn có các thẻ File, Home, Insert, Layout, References, Review, View; thanh Ribbon, thước, mặt giấy, bảng, ảnh minh họa, trạng thái, chế độ Backstage và từng bước thao tác. Người học bấm số bước, Trước/Tiếp hoặc các lệnh đang liên kết trong Ribbon.
- Mỗi bước gồm vị trí lệnh, mô tả thao tác và kết quả cần kiểm tra; lưu ghi chú giảng viên dài trong `slide.notes` để không nhồi chữ lên màn chiếu.
- Cơ sở dữ liệu Word gốc 75 slide được **giữ lại toàn bộ**, gắn thêm 49 minh họa thành 124 slide. Nội dung chia bốn chương theo chủ đề, không chia cứng theo buổi.
- Tương thích responsive: giao diện Word rút gọn Ribbon có thể cuộn ngang; trên màn hẹp bảng hướng dẫn xuống bên dưới; không tự chạy animation.
- Trình chiếu không cố giả lập đầy đủ mọi phiên bản Word; ghi rõ vị trí menu có thể thay đổi. Bài thực hành thật phải mở Word được cài trên máy.

## 10. Slide 01 Word đầu tiên — đồng bộ Hero trang chủ (15/10/2026)

- Chỉ slide mở đầu `word-lam-quen` dùng `wordHomeHero`; các slide và bài học khác giữ nguyên thiết kế.
- Bố cục lấy trực tiếp ngôn ngữ thị giác của Hero trang chủ: nền navy kẻ ô (`grid-paper`), nhãn pill, tiêu đề ba dòng lớn và dòng cuối cyan, nút hành động blue, khối ảnh minh họa Word và thẻ mục tiêu chồng góc. Hình Word do HTML/CSS tạo.
- Nút `Bắt đầu bài học` phải hoạt động và chuyển sang slide 02 bằng trình phát, không chỉ dùng để trang trí. Vẫn giữ điều khiển trình chiếu và chế độ nhập lớp hiện có.
- Trên màn nhỏ, hai cột xếp dọc và nội dung có thể cuộn; chữ không bị cắt, không bắt buộc thiết lập chiều cao cố định.

## 11. Tăng typography slide Word đầu tiên (15/10/2026)

- Tiêu đề chính chỉ gồm “Làm quen với Microsoft Word” (trong hai dòng với Microsoft Word màu cyan), không thêm “qua thực hành.”.
- Không hiển thị dòng phụ “Nhập liệu · Chỉnh sửa · Lưu văn bản”; CTA “Bắt đầu bài học” vẫn chuyển slide tiếp theo.
- Toàn bộ chữ trên Hero (mô tả, CTA, mục tiêu và mockup) cần đọc dễ khi trình chiếu; dùng cỡ chữ responsive theo `clamp()` hoặc breakpoint. Decorative outline dùng “WORD”, không dùng số “01” lớn.
