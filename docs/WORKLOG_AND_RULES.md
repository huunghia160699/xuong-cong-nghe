# Quy tắc làm việc và nhật ký đang hoạt động — Xưởng Công Nghệ

> **Tài liệu nhỏ, được cập nhật từng bước** · Từ 30/10/2026. Điểm vào toàn hệ thống: [INDEX.md](INDEX.md). Toàn bộ bản gốc 2026 được giữ nguyên tại [archive/WORKLOG_HISTORY_TO_2026-10-30.md](archive/WORKLOG_HISTORY_TO_2026-10-30.md) — không đọc mặc định.
> Các quy chuẩn kỹ thuật và domain không đặt lặp lại ở file này: [ARCHITECTURE_AND_SECURITY.md](ARCHITECTURE_AND_SECURITY.md), [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md), [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md).

## I. Quy tắc bắt buộc cho mọi yêu cầu

1. **Chọn đúng module:** mở `docs/INDEX.md` → file chuẩn của module → phần code liên quan. **Không quét toàn bộ dự án** trừ khi người dùng yêu cầu kiểm toán tổng thể hoặc cần điều tra lỗi liên module có bằng chứng.
2. **Sợi dây liên kết:** xác định producer/consumer dữ liệu, module sở hữu, route, API và test khi chức năng chạm nhiều module; cập nhật `PRODUCT_AND_MODULES.md` / `ARCHITECTURE_AND_SECURITY.md` khi hợp đồng đổi.
3. **Không làm ngoài phạm vi:** sửa đúng tác vụ, không tự tạo UI/DB/chức năng khác, không đổi Auth/role/RLS/Production hoặc DNS khi chưa cần/được phép.
4. **Dữ liệu và bảo mật:** đọc trước và backup khi việc ghi có nguy cơ mất dữ liệu; thay đổi schema bằng migration mới và kiểm JWT thật trên staging, không sửa migration đã áp; không commit secret hoặc dữ liệu riêng.
5. **UI:** dùng màu và bố cục trong `UI_DESIGN_SYSTEM.md`; giữ chức năng hiện tại, responsive/a11y; slide/Word phải đọc tiêu chuẩn riêng.
6. **Ghi tới đâu lưu tới đó:** hoàn thành một phần xác minh được thì ghi vào mục đang làm ngay trên branch, không chờ kết thúc cả kế hoạch. Ghi rõ `DONE / IN PROGRESS / BLOCKED / NOT TESTED` và dữ liệu đã/không thay đổi.
7. **Test và phát hành:** `pnpm test`, `pnpm typecheck`, `pnpm build`, smoke/Chromium khi hợp lý; commit/PR review; chỉ xác nhận deployed khi CI, Vercel READY, SHA GitHub main và domain chính khớp.
8. **Tài liệu:** chỉ sửa nguồn chính của module; không tạo 2 file cùng mục đích. Snapshot cũ chỉ lưu vào `archive/` và không suy ra trạng thái hiện tại từ đó.
9. **Không tự cập nhật Roadmap Supabase từ GitHub:** dữ liệu Roadmap trên Production là nguồn riêng, không tick checkbox hoặc overwrite ngầm từ các file Markdown.
10. **Thành thật với kết quả:** “CI PASS” không bằng “đã kiểm JWT thật”; báo blocker và môi trường test; không hứa hoàn thành sau trong khi không có tác vụ nền.

## II. Mẫu checkpoint ngắn

```text
### YYYY-MM-DD — [MODULE] Tiêu đề
- Yêu cầu / phạm vi:
- Đã làm (file, tác động module):
- Đã kiểm (test, CI, URL/SHA nếu có):
- Chưa kiểm / blocker:
- Bước còn lại:
```

Không viết lại cả nhật ký cũ. Một task nhiều commit có thể thêm checkpoint theo giai đoạn nhưng chỉ một mục tổng kết rõ ràng.

## III. Nhật ký mới (từ 30/10/2026)

### 2026-10-30 — [DOCS/ARCH] Kiểm toán hệ thống và chuẩn hóa Markdown
- **Yêu cầu:** bổ sung https://duaedu.net/ và https://montinhoc.vn/ vào website tham khảo; thống nhất đọc tài liệu đúng module, ghi tới đâu lưu tới đó; kiểm toán một lần và tinh gọn tài liệu nền tảng.
- **Đã làm:** khảo sát trang công khai của DUA Edu và Môn Tin học; viết [WEBSITE_REFERENCES.md](WEBSITE_REFERENCES.md); tổng kiểm kê cấu trúc repository, Supabase Advisor/CI/Live status; tạo [SYSTEM_AUDIT_2026-10-30.md](SYSTEM_AUDIT_2026-10-30.md). Gộp product/route/role vào [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md); kiến trúc/RLS vào [ARCHITECTURE_AND_SECURITY.md](ARCHITECTURE_AND_SECURITY.md); brand/layout vào [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md).
- **Bảo toàn:** lưu nguyên văn 11 tài liệu nền tảng + 6 kiểm toán cũ + 1 worklog lịch sử trong `docs/archive/`; không chạm dữ liệu Supabase, DNS, Auth, UI.
- **Kiểm tra:** read-only DB (14/14 bảng RLS), security/performance advisor; GitHub PR và CI cần xác minh trước merge.
- **Tồn đọng Product P0:** staging, kiểm JWT Admin/Student, Roadmap CRUD/backup/reload, audit hàm `SECURITY DEFINER`; chỉ sau đó bắt đầu Teacher Studio.
- **Phát hành:** tài liệu trên branch; cập nhật số PR/CI/SHA/READY sau khi đã xác minh, không khẳng định trước.
