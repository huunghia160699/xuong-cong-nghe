# Xưởng Công Nghệ — Layout và typography đồng bộ

## Vùng nội dung
- Dùng **`xcn-container`** cho header công khai, mỗi section trang chủ, danh sách khóa học, công cụ, thư viện trình chiếu và footer. Cùng một max-width **1680px**, gutter responsive **clamp(20px, 2.5vw, 42px)**; điện thoại **18px**.
- Không dùng `max-w-7xl px-5 lg:px-8` trên các vùng cấp trang mới: chúng làm header và nội dung lệch lề khi màn hình lớn.
- Dùng vùng nội dung chung ở các trang học viên/quản trị: app header là `xcn-app-header`, main là `xcn-app-main`. Cả hai lấy đúng cùng gutter, sidebar riêng.
- Biểu mẫu đăng nhập và các đoạn văn đọc dài có thể giữ độ rộng hạn chế, nhưng phần khung trang vẫn cân đối và không lồng hai lớp padding ngang thừa.
- **Ngoại lệ:** công cụ trình chiếu `/cong-cu/trinh-chieu/[lessonId]` luôn hiển thị **full-bleed 100dvh**, không nhận gutter của website.

## Mật độ hiển thị
- Các khối public cơ bản giảm khoảng cách dọc từ 80–96px xuống 48–74px, card giảm padding ở những màn có khoảng trắng lớn.
- Trên website và shell, font phụ `text-xs` tăng từ 12 lên **13px** và `text-sm` từ 14 lên **15px**. Giữ `text-base` tối thiểu **16px** cho nội dung dài; tăng headline của dashboard.
- Không tăng font trong File Explorer mô phỏng, quiz trình chiếu hay slide đang tối ưu cho chiếu lớp.
- Khi tạo trang mới, ưu tiên `xcn-container` thay cho việc tự chọn max-width và hai padding riêng biệt.

## Kiểm soát thay đổi
Chạy `pnpm test`, `pnpm typecheck`, `pnpm build` trước khi merge. Kiểm tra các trang trên desktop và mobile, đặc biệt header có thể xuống dòng khi điều hướng quá dài.

## Mật độ giao diện linh hoạt (cập nhật 14/10/2026)

- `xcn-page-pad`: lề trên/dưới căn theo `clamp(22px, 4.3dvh, 54px)`; `xcn-section-pad`: `clamp(28px, 5.4dvh, 64px)`; `xcn-section-gap`: `clamp(20px, 3.4dvh, 40px)`.
- Header công khai bố trí logo ở trái, điều hướng và hành động liền nhau ở phải. Dưới 900px, thanh điều hướng xuống hàng và cuộn ngang thay vì tràn hoặc ép chữ.
- Trang Công cụ và Thư viện trình chiếu không còn chiều cao tối thiểu cố định cho card hay khối trang; chiều cao theo nội dung thực tế, responsive theo cột.
- Bỏ nhóm thống kê 01/01/29 không thiết yếu ở đầu thư viện để ưu tiên chủ đề có thể mở ngay.
- Hero trang chủ dùng `clamp` với đơn vị `dvh` thay vì chiều cao pixel tuyệt đối, cho phép nội dung nở theo chữ; hình mô phỏng dùng đơn vị tương đối.
- Hệ trình chiếu độc lập giữ toàn màn hình `100dvh`, không áp `xcn-container` hoặc padding trang công khai lên slide.

## Trang chủ: section cuộn từng màn hình

- Chỉ trang chủ có wrapper `xcn-home-snap`; mỗi `section` bên trong có `min-height: calc(100dvh - header-height)`. Section **được phép cao hơn màn hình** khi nội dung dài, không cắt mất chữ hay card.
- Trên desktop màn hình đủ cao, CSS `scroll-snap-type: y mandatory` giúp mỗi lần cuộn kết thúc đúng đầu section. Màn hình nhỏ/thấp dùng `proximity` để vẫn cuộn tự nhiên và truy cập được toàn bộ nội dung.
- Sticky header vẫn nằm trên, đầu section nằm **ngay dưới header** nhờ `scroll-padding-top`. `HomeSectionSnap` theo dõi chiều cao header thực bằng `ResizeObserver`, kể cả khi menu chuyển thành hai hàng hoặc kích cỡ chữ thay đổi.
- Không tự chặn wheel, touch, trackpad hoặc thêm hiệu ứng JavaScript ép cuộn. Browser thực hiện scroll-snap kết hợp với `scroll-behavior: smooth` hiện có.
- Có `prefers-reduced-motion: reduce` để tắt snap và cuộn mượt cho người muốn giảm chuyển động; footer có điểm snap riêng để không bị kẹt cuối trang. Các trang công cụ/khóa học và trình chiếu vẫn cuộn như cũ.
