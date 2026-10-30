# Hệ thống thiết kế UI & nhận diện — Xưởng Công Nghệ

> **Nguồn chuẩn cho màu, typography, spacing, responsive, accessibility và nhận diện.** Cập nhật 30/10/2026. Đọc trước khi sửa CSS nhiều trang, Header, Sidebar hoặc một module UI. Slide/Word Lab có tiêu chuẩn tương tác chuyên biệt, đọc thêm tài liệu của chúng.

## Hướng thiết kế Public Website mới — 31/10/2026 (ĐỀ XUẤT, CHƯA ÁP DỤNG)

**Đặc tả thiết kế chi tiết 5 trang:** [PUBLIC_WEBSITE_DESIGN_SPEC.md](PUBLIC_WEBSITE_DESIGN_SPEC.md). Trang chủ làm bản đồ hệ sinh thái, người chưa login xem thông tin tính năng và người đã login dùng công cụ có phân quyền; 4 route Giới thiệu/Bảng giá/Tin tức/Liên hệ cần xây mới.

**Palette Public mới theo yêu cầu (chưa đổi token Production):** text ink \`#223044\`, primary \`#365F80\`, primary-hover \`#294D6C\`, background \`#F6F8FB\`, soft-blue \`#EAF1F7\`, muted \`#52687B\`, border \`#D8E1EA\`, card \`#FFFFFF\`, accents sage \`#DCE8DF\`, sand \`#EEE7DD\`, lavender \`#E7E2F1\`, peach \`#F2E3DA\`. **Không gradient, không neon**. Primary với chữ trắng đạt khoảng 6.76:1; kiểm theo WCAG 2.2 AA khi code. Chỉ scope \`xcn-public\` / public layout; **Admin/Word/Slides đang dùng palette Navy/Blue/Cyan cũ và chưa đổi**.

**Các mốc triển khai:** D0 đặc tả → D1 public shell/header/footer/tokens → D2 homepage catalog → D3 Giới thiệu → D4 Bảng giá → D5 Tin tức → D6 Liên hệ → D7 QA/release. Khi chưa có giá/tin tức/đầu nhận liên hệ chính thức, giao diện không bịa dữ liệu. Checklist [ROADMAP.md](ROADMAP.md). Mọi PR cần cập nhật Worklog từng bước.

---

## 1. Thương hiệu và nguyên tắc

- Tên sản phẩm: **Xưởng Công Nghệ**.
- Định vị: nền tảng học và thực hành năng lực số.
- Slogan: **Học để hiểu. Làm để thành thạo.**
- Giọng văn: rõ ràng, có mục đích, tiếng Việt tự nhiên; thông báo ngắn và phân biệt Demo/Live.
- Tinh thần: Minimal Education SaaS, sạch, thoáng vừa đủ, nhiều không gian cho nội dung thực hành; không glassmorphism/gradient tùy tiện.
- **Không sao chép** giao diện, hình, logo hoặc nội dung từ web tham khảo; mọi ví dụ chỉ để học quy trình/UX.

## 2. Bảng màu chuẩn

| Token | Mã | Chức năng |
| --- | --- | --- |
| `ink` / Navy | `#04122D` | Header, headline, nền tối |
| `blue` / Royal Blue | `#005BFD` | Primary CTA, active, progress |
| `cyan` | `#00E9FD` | Highlight trên navy, hover/selected có tương phản |
| `paper` / Ice | `#F0F6FD` | Vùng nền phụ, panel nhẹ |
| White | `#FFFFFF` | Surface, button text trên blue |
| `mist` | `#E1EBF7` | Viền/đường phân tách mềm |

**Chốt màu:** blue đi với chữ trắng; cyan trên navy hoặc chữ navy trên cyan; không cyan chữ nhỏ trên trắng. Red/green chỉ mang nghĩa cảnh báo/thành công, không làm thương hiệu. Không dùng lime branding.

Nguồn định nghĩa kỹ thuật: `tailwind.config.ts` và `src/app/globals.css`. Ưu tiên chỉnh token chung thay vì hardcode CSS phân tán.

## 3. Chữ và tỷ lệ

- Heading: Manrope; Body: Be Vietnam Pro (theo cấu hình/triển khai hiện hành).
- Nội dung dài: từ 16px khi khả thi; text nhỏ 14–15px trên các panel, không hy sinh khả năng đọc.
- H1 mỗi trang chỉ có một; khi user đã yêu cầu bỏ nhãn phụ, **không tự thêm các eyebrow/kicker ADMIN / MODULE phía trên H1**.
- Tối ưu khả năng đọc với khoảng cách dòng/paragraph hợp lý; với khối báo cáo dài ưu tiên phân nhóm và heading cấp thấp.

## 4. Layout và responsive

- Dùng biến gutter toàn trang `--xcn-page-gutter` và `xcn-container` thay vì max-width lẻ giữa các trang.
- Padding dọc cần linh hoạt theo viewport: `clamp()`, `dvh` và nội dung thực; không ép mọi section đúng 1 màn hình và **không dùng scroll-snap** cho trang chủ.
- Giữ padding hai bên thống nhất từ Header đến content; màn hình lớn phải dùng chiều ngang hợp lý thay vì max-width vô cớ.
- Kích thước cân đối tại viewport 360px, 768px, 1280px, 1920px, và kiểm tra màn chiều cao thấp 680px.
- Sidebar Admin có navigation cuộn riêng khi thấp, footer/status không bị che; Admin page H1, mô tả và action dùng chung nhịp `xcn-admin-heading`/Roadmap.
- Header công khai chứa logo, navigation và actions thành hệ thống; mobile ưu tiên menu dễ bấm, không tràn ngang.
- Trình chiếu ở fullscreen `100dvh` là ngoại lệ hợp lệ; Word simulator có bố cục Word Ribbon riêng.

## 5. Thành phần UI chuẩn

- Button: 1 primary action trong nhóm, secondary outline rõ ràng; trạng thái disabled/loading có phản hồi; icon không thay văn bản ở tác vụ quan trọng.
- Card: border mảnh, radius 12–16px, shadow nhẹ, khoảng đệm đồng bộ.
- Điều khiển input: label rõ, focus ring, ESC/keyboard navigation, error state có lời giải thích; không chỉ báo trạng thái bằng màu.
- Tài nguyên: loading skeleton, empty có hành động nếu phù hợp, retry khi lỗi, permission-denied và hỗ trợ touch 44px ở tương tác chủ đạo.
- Trình chỉnh sửa Word: đồng bộ chiều cao nút, kích thước icon, con trỏ/caret và selection theo chuẩn module; không giả định editor hỗ trợ DOCX nếu chưa có OOXML.
- Không dùng các nhãn xanh trang trí lặp lại trên đầu H1 các trang Admin.

## 6. Tài liệu đặc thù phải đọc khi chạm module

| Trường hợp | Nguồn chi tiết |
| --- | --- |
| Slide học tập | [SLIDE_STANDARD.md](SLIDE_STANDARD.md), [PRESENTATION_DESIGN_STANDARD.md](PRESENTATION_DESIGN_STANDARD.md) |
| Renderer và nhập nội dung slide | [PPT_INTEGRATION.md](PPT_INTEGRATION.md) |
| Word simulator | [WORD_SIMULATOR_STANDARD.md](WORD_SIMULATOR_STANDARD.md) |
| QA Word Ribbon/điều khiển | [WORD_SIMULATOR_CONTROL_AUDIT.md](WORD_SIMULATOR_CONTROL_AUDIT.md) |
| Trang và nghiệp vụ | [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md) |

**Nguồn lịch sử thiết kế (BRAND, DESIGN_SYSTEM, SITE_LAYOUT_STANDARD):** [archive/FOUNDATION_ORIGINALS_BEFORE_2026-10-30.md](archive/FOUNDATION_ORIGINALS_BEFORE_2026-10-30.md).

## 7. Checklist nghiệm thu mỗi UI change

1. Nêu module và file nào bị ảnh hưởng; hạn chế thay CSS global trừ khi thực sự cần.
2. Đối chiếu ảnh/ghi chú người dùng, không đổi ngoài phạm vi.
3. Thử 360, 768, 1280; nếu layout co giãn rộng thêm 1920/2560.
4. Thử kích thước chiều cao thấp, menu overflow, keyboard tab/ESC/focus và không horizontal scroll ngoài ý muốn.
5. `pnpm test`, `pnpm typecheck`, `pnpm build`, Chromium QA trên các route ảnh hưởng.
6. Ghi vào [WORKLOG_AND_RULES.md](WORKLOG_AND_RULES.md) và chỉ xác nhận Production khi SHA + READY + domain khớp.
