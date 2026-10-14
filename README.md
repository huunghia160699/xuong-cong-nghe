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
| `/admin/kho-tai-lieu` | Kho tài liệu riêng tư Supabase Storage (Admin trong live mode) |

## Kiểm thử

```bash
pnpm test
pnpm typecheck
pnpm build
```

GitHub Actions kiểm tra tự động. Không đưa service role key, mật khẩu hoặc dữ liệu học viên thực vào repo.

## Kho tài liệu

Dùng Supabase Storage, chưa cần Cloudflare R2. Xem `docs/SUPABASE_STORAGE.md` về thiết lập và quyền truy cập.

## Trình chiếu bài giảng (React + Next.js)

Mở tại `/cong-cu/trinh-chieu`. Dữ liệu 29 slide và 15 mẫu được hiển thị bằng renderer React của Xưởng Công Nghệ, không còn HTML/CSS từ dự án PPT độc lập. Xem `docs/PPT_INTEGRATION.md` để thêm môn/bài, layout và component. Chưa có editor hoặc xuất .pptx.

**Tổ chức trình chiếu Tin học:** Môn học → các **Phần** theo chủ đề → slide tương tác. Phần hiện có: **Phần 1 – Quản lý tệp và thư mục (File Explorer)** tại `/cong-cu/trinh-chieu/quan-ly-tep-va-thu-muc`; URL `buoi-01-file-explorer` cũ chuyển hướng để giữ tương thích. Không thay đổi mô hình bài học/tiến độ của các khóa học khác.
