# Quy chuẩn trình chiếu — Xưởng Công Nghệ

Áp dụng cho công cụ `/cong-cu/trinh-chieu` và các bài giảng tạo mới.

## 1. Nội dung: Mở đầu → Thân bài → Kết luận

- **Mở đầu:** tiêu đề, tình huống khởi động, mục tiêu và khái niệm cần có.
- **Thân bài:** đưa kiến thức theo trình tự nhận biết → thao tác → luyện tập/giải quyết tình huống; dành chỗ cho mô phỏng, bài tập và trắc nghiệm.
- **Kết luận:** tối đa một vài nguyên tắc nhớ lâu, hành động/kiểm tra cuối buổi.
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

- **Ba màu chính**: nền trắng, chữ mực đen, điểm nhấn lime; xám là sắc độ trung tính cho phân tầng.
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
