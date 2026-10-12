# Xưởng Công Nghệ — HuuNghia Lab

Nền tảng học và thực hành năng lực số: Next.js 15, TypeScript, Tailwind CSS và Supabase.

## Chạy chế độ Demo

Yêu cầu Node.js 22 trở lên.

```bash
pnpm install
pnpm dev
```

Mở `http://localhost:3000`. Mặc định dùng chế độ **Demo**, không cần Supabase.
Bài học, lựa chọn quiz và kết quả lưu trong `localStorage` của thiết bị.

## Chạy với Supabase Auth và dữ liệu thật

Xem `docs/SUPABASE_SETUP.md` để cấu hình từng bước. Tóm tắt:
1. Tạo / khôi phục Supabase Dev, chạy `supabase/migrations` theo thứ tự và `supabase/seed.sql`.
2. Tạo `.env.local` từ `.env.example`, điền URL và anon key.
3. Đặt `NEXT_PUBLIC_USE_MOCK_DATA=false` và restart server.
4. Đăng ký hoặc đăng nhập qua `/dang-nhap`.

**Live mode không tự lùi về Demo khi thiếu biến môi trường.** Middleware và Server Layout kiểm tra session/role; quiz chấm ở PostgreSQL qua RPC, không chấm trên trình duyệt.

## Routes

| Route | Mô tả |
| --- | --- |
| `/` | Trang chủ |
| `/khoa-hoc/excel-can-ban` | Lộ trình Excel |
| `/student` | Dashboard học viên |
| `/student/khoa-hoc/excel-can-ban/[lessonSlug]` | Bài học / tiến độ |
| `/student/quiz` | Làm bài |
| `/student/quiz/ket-qua/[attemptId]` | Xem kết quả |
| `/dang-nhap`, `/dang-ky`, `/quen-mat-khau` | Xác thực |
| `/admin`, `/admin/khoa-hoc` | Quản trị (cần quyền admin ở live mode) |

## Kiểm thử

```bash
pnpm test
pnpm typecheck
pnpm build
```

GitHub Actions kiểm tra tự động. Không đưa service role key, mật khẩu hoặc dữ liệu học viên thực vào repo.
