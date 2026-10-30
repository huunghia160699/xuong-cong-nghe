# AGENTS.md — Quy tắc triển khai Xưởng Công Nghệ

> **Đọc duy nhất tài liệu theo module.** Entry point: [docs/INDEX.md](docs/INDEX.md); quy tắc + checkpoint: [docs/WORKLOG_AND_RULES.md](docs/WORKLOG_AND_RULES.md). Không đọc lại toàn bộ repository hay 30+ Markdown cho mỗi yêu cầu. Chỉ kiểm kê toàn bộ khi người dùng yêu cầu audit toàn hệ thống hoặc vấn đề liên module bắt buộc.

## Sản phẩm, công nghệ và phạm vi

Xưởng Công Nghệ là nền tảng **Học → Luyện → Ứng dụng**, xây bằng Next.js 15, TypeScript, Tailwind CSS, Supabase Auth/Postgres/RLS/Storage, Vercel. Code identifiers tiếng Anh, UI tiếng Việt.

Cấu trúc:
- `src/app` route/layout/HTTP/action
- `src/features/<domain>` nghiệp vụ / state / validation / feature UI
- `src/components/ui` phần tử dùng chung thuần trình bày
- `src/lib` infra Supabase/Storage, `src/config` constants/nav
- `supabase/migrations` schema/RLS versioned, `tests` regression, `scripts` QA

**Tra cứu đúng tài liệu qua docs/INDEX.md.** Module Word → `docs/WORD_SIMULATOR_STANDARD.md`; slide → `docs/SLIDE_STANDARD.md` và tài liệu trình chiếu liên quan. Không đọc module không liên quan.

## Quy tắc bắt buộc

1. Xác định module sở hữu, route, dữ liệu vào/ra và ảnh hưởng liên module trước khi thay đổi; cập nhật `docs/PRODUCT_AND_MODULES.md` hoặc `docs/ARCHITECTURE_AND_SECURITY.md` khi contract thay đổi.
2. Làm trong phạm vi user yêu cầu. Không xây Teacher Studio/AI/payments, dịch chuyển storage hay bật tính năng chưa có trong roadmap nếu chưa được yêu cầu.
3. Không gọi Supabase từ presentational components. Quyền Auth/role kiểm ở server và RLS; không sử dụng user_metadata để cấp quyền; không đưa service_role key vào client, GitHub hoặc log.
4. Bất kỳ bảng mới nào đều cần migration + RLS + test trên staging. Không sửa migration đã áp; không ghi đè hoặc xóa dữ liệu Production để test.
5. Giao diện dùng [UI_DESIGN_SYSTEM.md](docs/UI_DESIGN_SYSTEM.md): navy `#04122D`, royal blue `#005BFD`, cyan `#00E9FD`, ice `#F0F6FD`, không lime. Tối ưu responsive, nhất quán, không sao chép UI hay assets website tham khảo.
6. Slide là học liệu giáo viên dẫn dắt, không hiện mô tả kỹ thuật/CSS/React hay eyebrow chung. Trình Word không được tự nhận có tương thích DOCX nếu chưa có OOXML engine thực.
7. Mỗi screen có loading, empty, error, permission-denied và mobile behavior. UI cần keyboard focus và nhãn dễ hiểu.
8. **Ghi tới đâu lưu tới đó:** sau mỗi bước xác minh được, cập nhật checkpoint trong `docs/WORKLOG_AND_RULES.md` trên branch của nhiệm vụ; cập nhật đúng module doc khi có thay đổi contract. Không dồn tới cuối, không viết lại lịch sử cũ.
9. Đọc GitHub/Vercel/Supabase thông qua công cụ trực tiếp chỉ khi tác vụ cần, không giả định trạng thái từ báo cáo cũ. Chỉ thông báo release khi CI PASS, Vercel READY, alias Production đúng và SHA deployment = GitHub main.
10. Nếu thay đổi tác động Auth/DB/role, xác minh với JWT thật trên staging trước Production. CI Demo không thay thế E2E Live. Tài liệu lịch sử trong `docs/archive/` chỉ đọc khi truy vết.

## Definition of done

- `pnpm test`, `pnpm typecheck`, `pnpm build` PASS; smoke/Chromium trên route ảnh hưởng.
- Responsive 360px/768px/1280px, màn hình cao/thấp; a11y cơ bản.
- Không có secret, nội dung cá nhân hoặc bản sao dữ liệu Live trong Git.
- Cập nhật **chỉ** tài liệu module liên quan và checkpoint.
- PR/commit và Production SHA được xác minh thật; nếu còn blocker, ghi rõ thay vì đánh dấu xong.

## Tài liệu tra nhanh

- [docs/INDEX.md](docs/INDEX.md) — task → tài liệu → module (ưu tiên số 1).
- [docs/PRODUCT_AND_MODULES.md](docs/PRODUCT_AND_MODULES.md) — module ownership/contract.
- [docs/ARCHITECTURE_AND_SECURITY.md](docs/ARCHITECTURE_AND_SECURITY.md) — Auth/RLS/DB/CI.
- [docs/WEBSITE_REFERENCES.md](docs/WEBSITE_REFERENCES.md) — VniTeach, Đề Thi Số, DUA Edu, Môn Tin học.
- [docs/SYSTEM_AUDIT_2026-10-30.md](docs/SYSTEM_AUDIT_2026-10-30.md) — chỉ khi cần kiểm toán lớn.
