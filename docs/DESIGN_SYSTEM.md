# Design System v1.1 — Xưởng Công Nghệ

## Nguyên tắc
Minimal Education SaaS: sạch, có hệ thống, khoảng trắng vừa đủ, tương phản dễ đọc, viền mảnh, ít màu trang trí. Chỉ sử dụng trang tham khảo làm cảm hứng, không sao chép.

## Tokens

| Token Tailwind | Giá trị | Vai trò |
|---|---|---|
| `ink` | `#04122D` | Headings, chữ chính, nền tối |
| `blue` | `#005BFD` | Primary CTA, tiến độ, active action |
| `cyan` | `#00E9FD` | Điểm nhấn tương phản trên navy |
| `paper` | `#F0F6FD` | Section phụ, app shell |
| `mist` | `#E1EBF7` | Viền/đường chia mềm |
| `white` | `#FFFFFF` | Card và bề mặt sáng |

Màu lấy từ ảnh tham chiếu 4 swatch người dùng gửi ngày 14/10/2026. **Không còn dùng lime** trong bộ nhận diện.

## Tương phản và khả năng tiếp cận
- `bg-blue text-white`: ~**5.36:1**.
- `bg-ink text-cyan`: ~**12.46:1**.
- `bg-cyan text-ink`, `bg-paper text-ink`: tương phản cao.
- **Tránh** `bg-blue text-ink` và `bg-white text-cyan` với chữ nhỏ.
- Giữ nhãn, biểu tượng, focus ring và phản hồi bằng chữ; không mã hóa trạng thái bằng màu đơn thuần.

## Layout, chữ và hình khối
Manrope cho heading, Be Vietnam Pro cho body. Dùng `xcn-container` đồng nhất và spacing với `clamp()` như `docs/SITE_LAYOUT_STANDARD.md`. Card viền mảnh, radius 12–16px, shadow ít; button có thể dạng pill; không trang trí gradient/glassmorphism tùy tiện.

Trang chủ cuộn liên tục tự nhiên, **không scroll-snap** và không cưỡng ép tất cả section một màn hình. Công cụ trình chiếu toàn màn hình là ngoại lệ độc lập.

## Khi thay đổi hệ thống
1. Ưu tiên token ở `tailwind.config.ts` / `src/app/globals.css`; không tự thêm màu thương hiệu mới.
2. Giữ màu semantic (đúng/sai) và biểu tượng tệp Word/Excel trong nội dung mô phỏng khi màu mang ý nghĩa chuyên môn.
3. Kiểm tra tương phản, 360px/768px/1280px, bàn phím và `pnpm test`, `pnpm typecheck`, `pnpm build`.
4. Sau mỗi công việc phải cập nhật `docs/WORKLOG_AND_RULES.md`; cập nhật `CHANGELOG.md` cho thay đổi người dùng thấy.
