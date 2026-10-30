# Xưởng Công Nghệ — HuuNghia Studio

Nền tảng học và thực hành năng lực số: **Học → Luyện → Ứng dụng**. Stack: Next.js 15, React 19, TypeScript, Tailwind CSS 3, Supabase Auth/Postgres/RLS/Storage, Vercel.

**Điểm vào tài liệu dự án:** [docs/INDEX.md](docs/INDEX.md). Quy tắc làm theo module và checkpoint: [AGENTS.md](AGENTS.md) / [docs/WORKLOG_AND_RULES.md](docs/WORKLOG_AND_RULES.md). **Không đọc toàn bộ repository cho mỗi thay đổi nhỏ.**

## Chạy local

Node.js 22+ và pnpm:

```bash
pnpm install
pnpm dev
```

Mở http://localhost:3000. Mặc định ở chế độ Demo nếu `NEXT_PUBLIC_USE_MOCK_DATA` không bằng `false`. Bản Demo có localStorage và không đồng bộ giữa thiết bị.

Nếu cần Supabase **development riêng**: tạo `.env.local` theo `.env.example`, dùng cấu hình public dev, reconciled migrations và redirect URLs; xem [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md). Không dùng Production để thử ghi/role.

## Chạy test và release

```bash
pnpm test
pnpm typecheck
pnpm build
```

GitHub Actions còn chạy smoke/Chromium. Không coi CI Demo bằng E2E Auth/RLS thật. Chỉ xác nhận Production khi SHA Vercel READY trùng GitHub `main` và domain đã được gán. Không đưa service-role key, mật khẩu, token hoặc backup của người dùng lên repository.

## Các không gian chính

| Không gian | Route ví dụ | Mã sở hữu |
| --- | --- | --- |
| Public | `/`, `/khoa-hoc`, `/cong-cu` | `src/app/(public)` |
| Student | `/student`, `/student/quiz` | `src/features/learning` |
| Admin | `/admin`, `/admin/roadmap`, `/admin/sitemap`, `/admin/kho-tai-lieu` | `src/features/admin` |
| Word Lab | `/cong-cu/mo-phong-word` | `src/features/word-simulator` |
| Trình chiếu | `/cong-cu/trinh-chieu`, `/cong-cu/trinh-chieu/[lessonId]` | `src/features/presentations` |
| Teacher Studio | **Theo kế hoạch, chưa hoàn chỉnh** | Chưa có module độc lập được nghiệm thu |

Xem bản đồ route, module và hợp đồng dữ liệu: [docs/PRODUCT_AND_MODULES.md](docs/PRODUCT_AND_MODULES.md). Định hướng dài hạn: [docs/XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md](docs/XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md).

## Tình trạng và hạn chế quan trọng

- Production đã có Supabase Live, Admin/Student Auth và Roadmap lưu có phiên bản; **chưa có xác nhận E2E bằng hai JWT thật trên staging**.
- 14 bảng public đang bật RLS, nhưng security advisor còn warning và quyền chức năng phải tiếp tục được kiểm chứng. Không thay đổi RLS Production từ tài liệu này.
- Kho tài liệu dùng private Supabase Storage; Cloudflare R2 là hướng phụ, chưa cấu hình Live.
- Công cụ Word và Slide có mã nguồn; Word simulator **không bảo đảm xuất DOCX chuẩn** nếu chưa tích hợp engine OOXML.
- File dạng kế hoạch/đề xuất không phải là route hoặc tính năng đã vận hành.

Chi tiết kiểm toán tại thời điểm 30/10/2026: [docs/SYSTEM_AUDIT_2026-10-30.md](docs/SYSTEM_AUDIT_2026-10-30.md). Mỗi lần phát triển sau chỉ đọc module liên quan qua [docs/INDEX.md](docs/INDEX.md).

## Website tham khảo và tên miền ứng dụng

[docs/WEBSITE_REFERENCES.md](docs/WEBSITE_REFERENCES.md) ghi VniTeach, Đề Thi Số, DUA Edu, Môn Tin học cùng ý tưởng `word.xuongcongnghe.net`, `quiz.xuongcongnghe.net`, `studio.xuongcongnghe.net`. **Chưa đăng ký/cấu hình các subdomain này**.
