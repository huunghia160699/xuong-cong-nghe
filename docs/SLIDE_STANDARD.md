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
