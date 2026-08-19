# Xưởng Công Nghệ

Starter repository cho nền tảng học và thực hành năng lực số, xây bằng Next.js, TypeScript, Tailwind CSS và Supabase.

## Chạy ngay

Yêu cầu Node.js 20.9 trở lên.

Trên Windows, có thể nhấp đúp `START-WEB.cmd`. Cửa sổ trình duyệt sẽ tự mở sau khi website khởi động.

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. Dự án mặc định dùng dữ liệu mẫu nên không cần tài khoản Supabase để xem giao diện.

## Màn hình có sẵn

- `/` — Homepage công khai
- `/khoa-hoc/excel-can-ban` — Chi tiết khóa học
- `/student` — Student Dashboard
- `/student/quiz` — Quiz Player tương tác
- `/admin` — Admin Dashboard

## Kết nối Supabase

1. Sao chép `.env.example` thành `.env.local`.
2. Điền URL và anon key của Supabase.
3. Chạy migration trong `supabase/migrations` và file `supabase/seed.sql`.
4. Đặt `NEXT_PUBLIC_USE_MOCK_DATA=false`.

## Cấu trúc chính

```text
src/app           routes và layout
src/components    component dùng chung
src/config        navigation và feature flags
src/data          mock data
src/features      domain modules (mở rộng tiếp)
src/lib           utilities và clients
supabase          schema, migration, seed
docs              specification và quyết định sản phẩm
```

## Bước phát triển tiếp theo

Ưu tiên theo `docs/ROADMAP.md`: Supabase Auth + profile, repository layer thay mock data, CRUD khóa học phía admin, rồi mới mở rộng lesson player và kết quả học tập.
