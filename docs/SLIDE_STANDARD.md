# Tiêu chuẩn biên soạn một slide — Xưởng Công Nghệ

> Quy tắc bắt buộc cho mọi bài giảng trình chiếu trên website, áp dụng từ **15/10/2026**. Đọc cùng `docs/PRESENTATION_DESIGN_STANDARD.md` và `docs/WORKLOG_AND_RULES.md`.

## 1. Tiêu đề — một câu, một trọng tâm

- **Tiêu đề nội dung là dòng chữ đầu tiên và nổi bật nhất ở đầu slide.** Không chèn dòng nhãn loại slide ngay trên tiêu đề.
- **Không hiển thị** những dòng chung chung: `KIẾN THỨC`, `BÀI GIẢNG`, `THAO TÁC`, `THỰC HÀNH`, `CÂU HỎI ÔN TẬP`, `TỔNG KẾT`, `VÍ DỤ WORD`, `VÍ DỤ EXCEL`, `PHẦN NỘI DUNG`, `NỘI DUNG 1/2`… khi chúng chỉ nói lại loại slide.
- Không hiển thị subtitle lặp lại ý của tiêu đề. Nếu cần giải thích dài, chuyển vào ghi chú giảng viên (`notes`) hoặc khối nội dung.
- Đặt tiêu đề bằng tiếng Việt tự nhiên, cụ thể, dễ hiểu; tránh tiêu đề kiểu máy móc (`Giới thiệu kiến thức số 1`).
- **Ngoại lệ có ý nghĩa:** bìa môn học có thể có nhận diện rõ ràng như `WORD CƠ BẢN · CHỦ ĐỀ 01`, nhưng không được thêm nhãn loại slide chung chung. Nhãn lệnh trong giao diện Word/Excel mô phỏng phải giữ để giúp tìm đúng thao tác.

## 2. Kích thước và khả năng đọc khi trình chiếu

- Manrope cho tiêu đề, Be Vietnam Pro cho nội dung.
- Tiêu đề chính mục tiêu **40–60 pt hoặc lớn hơn khi phù hợp** (khoảng 54–80 px ở 96 dpi); nội dung chính mục tiêu **18–28 pt** (khoảng 24–37 px). Đây là mục tiêu cho máy chiếu, không phải ràng buộc số cứng ở mọi thiết bị.
- Dùng `clamp()` và breakpoint thích hợp để không tràn trang; kiểm tra ở **1280×720, 1920×1080, 768px và 360px**.
- Có phân cấp chữ, giãn dòng thoáng, không đặt các đoạn dài bằng chữ quá nhỏ để nhồi vào slide.

## 3. Nội dung và minh họa

- Mỗi slide tập trung **một thông điệp hoặc kỹ năng**; khoảng 3–7 cụm ý nếu thật sự cần.
- Ưu tiên một ví dụ cụ thể, bảng, hình ảnh mô phỏng, quy trình hoặc tương tác thay vì nhiều đoạn chữ trùng ý.
- Quy trình thao tác gồm lệnh thực hiện, tác dụng và kết quả cần kiểm tra. Trắc nghiệm có lời giải và phản hồi đúng/sai, không chỉ đáp án.
- Hình mô phỏng CSS phải có chú thích chính xác khi không phải phần mềm thật; không tự tạo tính năng không tồn tại.
- Nhãn kỹ thuật **bên trong** giao diện giả lập (File, Home, Insert, v.v.), tên cột bảng, trạng thái, phím tắt vẫn hiển thị vì có giá trị giải thích. Số thứ tự các bước có thể giữ nếu phục vụ việc theo dõi.

## 4. Bố cục và màu

- Dùng một hệ màu nhất quán: navy `#04122D`, blue `#005BFD`, cyan `#00E9FD`, ice `#F0F6FD` và trắng.
- Đặt khối nội dung ngay sau tiêu đề, không dành khoảng trống cho nhãn phụ vô nghĩa. Giữ căn chỉnh và khoảng trắng thoáng.
- Giao diện phải responsive; không cắt chữ, không dùng `line-clamp` để che mất kiến thức, hạn chế gradient và hiệu ứng không cần thiết.
- Bìa/hero có thể sáng tạo nhưng vẫn phải có mục tiêu học tập rõ và không làm rối tiêu đề.

## 5. Dữ liệu và triển khai

- Trường `slide.eyebrow` ở dữ liệu cũ có thể **giữ làm metadata** để không phá bài học, nhưng **trình phát không được render nhãn này phía trên tiêu đề**.
- Không thay đổi lịch sử, nội dung hoặc kết quả học tập chỉ để xóa dòng nhãn giao diện.
- Cập nhật tài liệu này khi có yêu cầu thiết kế mới và ghi lần sửa vào `docs/WORKLOG_AND_RULES.md`.
- Chạy kiểm thử trình chiếu, `pnpm test`, `pnpm typecheck`, `pnpm build`, smoke test các route liên quan trước khi đưa lên Production.

## 6. Checklist nghiệm thu

- [ ] Tiêu đề lớn, rõ, không có nhãn `KIẾN THỨC/THAO TÁC/…` ở phía trên
- [ ] Không có subtitle thừa; khối nội dung bắt đầu ngay dưới tiêu đề
- [ ] Chữ đọc dễ từ xa và không bị cắt trên màn hình nhỏ
- [ ] Mỗi slide có một trọng tâm, thông tin và ví dụ chính xác
- [ ] Tương tác có tác dụng thật; ghi chú và đáp án hoạt động
- [ ] Không làm hỏng các chương trình Word, Excel và File Explorer khác
- [ ] Kiểm thử đạt, cập nhật nhật ký và xác nhận cùng SHA GitHub/Vercel khi triển khai

## 7. Khi slide có mục tiêu trực quan cụ thể (15/10/2026)

- Có thể tạo **component và CSS riêng cho đúng một slide** thay vì dùng mẫu grid/card, nếu giúp học viên hiểu thao tác hoặc sự khác nhau giữa hai kết quả nhanh hơn.
- Ví dụ slide 02 Word: lựa chọn **Soạn thảo** / **Trình bày** thay đổi vùng trang Word CSS minh họa; nội dung gốc và ghi chú giảng viên phải được bảo toàn, không tăng số slide chỉ vì đổi layout.
- Tiêu đề vẫn phải là điểm nhìn đầu tiên, chữ lớn, không dùng nhãn `KIẾN THỨC` hoặc nhãn mẫu chung. Vùng tương tác phải có nút thật, hỗ trợ keyboard focus, `aria-pressed`, phản hồi `aria-live` và mobile responsive.
- Tương tác phải mô tả đúng hành vi, ghi rõ là mô phỏng Word bằng CSS nếu không thao tác trên tệp Word thật.

## 8. Slide dùng để giảng, không phải bảng hướng dẫn cho học viên (15/10/2026)

- **Người sử dụng slide là giáo viên đang giảng.** Màn chiếu chỉ giữ **tiêu đề, kiến thức, ví dụ, hình minh họa và tương tác có giá trị học tập**. Không tự thêm lời dẫn, câu ra lệnh học viên, câu nhắc chọn/bấm, câu tóm tắt lặp lại nội dung hoặc chỉ dẫn sư phạm chung.
- Không hiện các câu như “Chọn một chức năng để xem…”, “Hãy quan sát…”, “Sản phẩm này là mô phỏng CSS/React…”, “Minh họa bằng CSS, không chỉnh sửa tệp Word thật”, “Hướng dẫn thao tác” nếu chúng không trực tiếp giúp hiểu nội dung. Những chi tiết này thuộc **slide.notes / ghi chú giáo viên** hoặc tài liệu dành cho tác giả, không thuộc màn chiếu.
- **Không xóa kiến thức thực tế:** tên lệnh File/Home/Insert, phím tắt, trình tự thao tác cần dạy, câu hỏi trắc nghiệm, ví dụ Word/Excel và mục tiêu của bài thực hành vẫn có thể hiển thị khi thực sự cần.
- Với mô phỏng đổi trạng thái, ưu tiên **đưa ra sự khác biệt bằng hình ảnh/định dạng**; không thêm một bảng giải thích lặp lại hai lựa chọn vừa có. Không tạo “đoạn chữ giả” với nội dung không có nghĩa; dùng một ví dụ cụ thể, giữ nguyên dữ liệu gốc giữa các chế độ để người học nhìn thấy đúng sự thay đổi.
- Không dùng màn hình slide để giải thích công nghệ triển khai (CSS, React, mô phỏng, phiên bản). Những lưu ý đúng/sai về giới hạn tương thích cần lưu trong **ghi chú giảng viên**, có thể công bố ở tài liệu sử dụng ngoài slide nếu cần.
