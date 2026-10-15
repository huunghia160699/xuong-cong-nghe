# Biên bản kiểm thử Word — Home Ribbon và thước giấy (16/10/2026)

## Mục tiêu

Kiểm tra cấu trúc nhóm Clipboard, Font, Paragraph, Styles, Editing và thước A4 dọc/ngang so với tiêu chuẩn giao diện.

## Kiểm thử tự động và kết quả

- **42 công cụ/lệnh chính của Home**: mỗi công cụ được đối chiếu 10 vòng độc lập theo đường nối thành phần giao diện → hàm thực thi tại trình soạn thảo. **420 vòng/công cụ**, 840 điều kiện kiểm tra hai lớp; đạt.
- **25 mục/lựa chọn menu của các nút tách đôi**: mỗi mục được kiểm tra 10 lần theo đường nối menu → handler. **250 lượt/mục**, 500 điều kiện; đạt.
- **Sáu nút định dạng**, giữ vùng chọn, Copy/Cut/Paste, Esc, hộp thoại nhóm và trạng thái Styles: 10 vòng kiểm tra điều kiện liên quan; đạt.
- **Thước và trang giấy**: 10 vòng × 16 tổ hợp gồm trang đứng/ngang, lề thường/hẹp và zoom 60%, 100%, 130%, 160%, cùng kiểm tra công thức cm, dấu lề và đồng bộ cuộn; đạt.
- **Bộ hồi quy trình chiếu và Word**: 41/41 bài kiểm thử qua `node --test tests/word-home-qa.test.mjs tests/presentation-basics.test.mjs`; 0 lỗi. Kết quả được xác nhận trong log Vercel build của commit `8ba686e`. Hai test cũ không còn khớp Clipboard staging và bàn phím menu đã được sửa trước khi đạt kết quả này.
- **Next.js production build**: đã biên dịch thành công ở đợt kiểm tra giao diện thước; bản production cuối cần xác nhận riêng trạng thái READY trên Vercel.

## Những gì bài kiểm thử thực sự xác nhận

Đây là **kiểm tra hợp đồng mã nguồn, lựa chọn vị trí xử lý lệnh, các trạng thái, CSS và build Next.js**. Số vòng được chạy thật qua runner Node khi xây dựng ứng dụng. Chúng **không tương đương** với 10 lượt click nhập liệu/mở menu/dán văn bản trên Chrome cho từng nút; chưa có một phiên tự động hóa trình duyệt đầy đủ, vì môi trường kiểm tra không truy cập trực tiếp giao diện trình duyệt của bản deploy.

## Kiểm thử bổ sung cần có khi thực hiện QA bằng trình duyệt

1. Bật/tắt B, I, U, gạch ngang, chỉ số dưới/trên rồi nhập nội dung và chuyển con trỏ.
2. Chọn nội dung, Copy/Cut → chuyển vị trí → Paste, kiểm tra Esc và Undo.
3. Mở đóng từng menu mũi tên và hộp thoại 5 nhóm.
4. Thử nhiều mức zoom; chuyển A4 đứng/ngang, lề thường/hẹp; cuộn ngang và dọc rồi đối chiếu dấu lề.
5. So sánh tab và gallery Styles ở cửa sổ rộng, trung bình, hẹp, kể cả mobile.
