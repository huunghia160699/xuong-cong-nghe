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

### 2026-10-31 — [PUBLIC D2–D4 / ROADMAP 21] GitHub-only
- **DONE:** Admin roadmap epic 21 chuyển order 20 → 4, sau Public Landing, CAS v7→v8; tick D2–D4 code/CI v8→v9, giữ 21 epics và audit.
- **CODE:** PR #73 (draft), nhánh `feat/public-website-d2-d4-20261031`: D2 Product Atlas/catalog trạng thái và filter, D3 Giới thiệu 7 phần, D4 Bảng giá 3 nhóm/FAQ/so sánh không giá giả. CSS responsive, test, tài liệu cập nhật. D5–D6 vẫn placeholder.
- **QA PASS:** GitHub Actions #41114499566 SHA `177014272`: 234 unit, typecheck, build, Chromium 5 trang × 4 kích thước, lọc/khôi phục Product Atlas; Admin D2–D4 đã tick và ghi chú GitHub-only. Chưa merge `main`/deploy Vercel.

### 2026-10-31 — [PUBLIC-WEB D1 / ADMIN ROADMAP] Phần việc đang triển khai
- **DONE (Production Roadmap có chốt CAS):** trước ghi `version=4`, 20 epics, MD5 snapshot `c3442d7b1c2659caa87bd097ce090ce4`; đã **nối thêm** epic `public-website-redesign-d0-d7` gồm checklist D0–D7, chỉ D0 DONE, D1 đang phát triển. SQL kiểm tra phiên bản/hash và không trùng ID, không ghi đè 20 mục trước. Readback: `version=5`, 21 epics, 20 cũ, audit events 5. **Dữ liệu Admin Supabase Production đã đổi theo yêu cầu**, không thay Auth/RLS.
- **DONE (D1 đã RELEASE, PR #71):** public CSS Calm Slate Blue scoped không gradient, Navbar/mega-menu/mobile, Header kiểm vai trò server, Footer và 4 route placeholder không 404; tests tĩnh + Chromium 5 route × 360/768/1280/1920 PASS, Vercel Production READY commit `001bbfc`, đúng alias. **D1 có thể tick DONE trong Admin sau khi kiểm CAS và đọc lại phiên bản.**
- **DONE (Admin Roadmap đồng bộ):** CAS `v5→v6` tick D1, event `task.completed` + note; CAS `v6→v7` sửa tiêu đề D1 thành “hoàn thành” để không trái checkbox. Readback: 21 epics (20 cũ giữ nguyên), D0/D1 done, D2–D7 chưa làm, 7 audit events. **NEXT:** D2 Product Atlas; D3–D6 vẫn là placeholder.
- **Tài liệu:** [PUBLIC_WEBSITE_DESIGN_SPEC.md](PUBLIC_WEBSITE_DESIGN_SPEC.md), [ROADMAP.md](ROADMAP.md), [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md). `/admin/roadmap` dùng dữ liệu Supabase khác file Markdown và đã được đồng bộ riêng một lần theo yêu cầu.

### 2026-10-31 — [PUBLIC-WEB] Đặc tả redesign 5 trang
- **DONE (D0):** [PUBLIC_WEBSITE_DESIGN_SPEC.md](PUBLIC_WEBSITE_DESIGN_SPEC.md) có wireframe, copy và hành vi Trang chủ/Giới thiệu/Bảng giá/Tin tức/Liên hệ; header/footer, 7 nhóm catalog, palette public scoped #365F80/#223044/#F6F8FB **không gradient**, responsive, auth gate, WCAG, SEO và kế hoạch D1–D7.
- **LINKED:** [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md), [INDEX.md](INDEX.md), [ROADMAP.md](ROADMAP.md). Trạng thái available/building/planned phải đúng thực tế.
- **NOT IMPLEMENTED:** chưa có 4 route marketing mới, chưa đổi UI/Auth/RLS/Admin/Word/Slides, chưa có billing/CMS/contact thật. Giá, bài viết, liên hệ không được bịa.
- **NEXT:** PR docs CI PASS; D1 public shell/nav/footer, D2 homepage, D3–D6 từng trang, D7 QA/release. Mỗi đợt phải có checkpoint riêng.

### 2026-10-31 — [PRODUCT/NAV + LAB-MANAGER] Tổng hợp 4 website, lưu ý tưởng quản lý phòng máy
- **Yêu cầu:** đề xuất mục Navbar trang chủ và liệt kê nhóm chức năng dựa trên VniTeach, Đề Thi Số, DUA Edu, Môn Tin học; bổ sung ý tưởng quản lý phòng máy “giống net sp” để làm sau.
- **DONE (nghiên cứu/đề xuất):** nhóm nav tương lai `Khóa học · Thực hành · Kiểm tra · Công cụ · Tài nguyên · Dự án · Giáo viên`; liệt kê submenu, nguồn gốc ý tưởng và phân biệt route đã tồn tại với tính năng dự kiến tại [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md) mục 2A.
- **DONE (backlog):** LAB-MANAGER tương lai, tạm tham khảo NetSupport School: sơ đồ máy/phòng, trạng thái, phát màn hình, gửi/thu bài, hỗ trợ và giới hạn web/app theo buổi. Ghi rõ yêu cầu agent/thiết bị, consent, phân quyền lớp/phòng, audit và kiểm thử an toàn; ưu tiên **P3** ở [ROADMAP.md](ROADMAP.md), nguồn ghi tại [WEBSITE_REFERENCES.md](WEBSITE_REFERENCES.md).
- **NOT IMPLEMENTED:** không thay `src/config/navigation.ts`, header, route, API, Supabase, Vercel env/DNS hay triển khai agent điều khiển; mọi menu và công cụ nêu trong bản đề xuất vẫn là ý tưởng cho tới khi có PR xây dựng riêng.
- **Test/PR:** chỉ tài liệu; ghi thông tin CI/merge tại PR khi được xác minh.

### 2026-10-31 — [AUTH/ROADMAP → TEACHER] Nghiệm thu JWT/RLS/khôi phục staging thành công
- **DONE — QA trên máy của chủ dự án (báo cáo kết quả đã lọc secrets):** `READ-ONLY PASS` với JWT đăng nhập thật riêng của Admin và Student; Admin được SELECT Roadmap, Student bị RLS từ chối; bộ `verify-roadmap-staging.mjs` trả `STAGING ACCEPTANCE PASS` cho thêm/sửa/xóa, khóa phiên bản, sao lưu và khôi phục.
- **DONE — đối chiếu SQL read-only độc lập:** project staging `ordiksbvpewwgrnvzrud` có đúng một tài liệu `global-master-roadmap`, `version=8`, `items=[]`, 8 events đầy đủ các version `1..8`. Sự kiện thứ 8 ghi nhận bước dọn dữ liệu thử; kết quả báo cáo 1–7 là các sự kiện trước cleanup. Không dùng Supabase Production để thử ghi.
- **GATE:** `P0_STAGING_AUTH_ROADMAP=PASS` (quyền trên **Roadmap** với hai user đã test; không suy rộng thành tất cả RLS của Teacher/Quiz). **Teacher Studio được mở giai đoạn phân tích, thiết kế, viết migration/RLS và phát triển trên staging qua PR riêng; không bật Production lúc này.**
- **NOT TESTED:** Next.js Preview/E2E đăng nhập thật qua 11 màn Admin, lỗi 401/403/409 ở route API, cookie/logout/refresh, mobile/mất mạng; quyền `teacher` và RLS sở hữu lớp/bài giao chưa có schema/account riêng. Security Advisor về `SECURITY DEFINER` và bảo vệ mật khẩu vẫn cần xử lý theo đánh giá riêng.
- **NEXT:** thiết kế hợp đồng Teacher Studio (lớp → thành viên → bài giao → bài nộp), ma trận Admin/Teacher/Student, migration + RLS `USING/WITH CHECK`, kiểm dữ liệu của người khác, E2E staging/preview trước khi cân nhắc bật Production. Không sửa Production DB/Auth/RLS trong checkpoint này.
- **Bảo mật:** không thu thập hoặc ghi mật khẩu/JWT, không sao chép backup QA vào repo; máy local được người dùng xác nhận Git sạch và secrets vẫn ignored.

### 2026-10-30 — [AUTH/ROADMAP] Xác nhận QA users; chuyển sang kiểm thử JWT tại máy local
- **DONE (read-only):** xác minh trên staging ref `ordiksbvpewwgrnvzrud` hai tài khoản Auth có UUID/email trùng người dùng cung cấp, email confirmed, có password hash, không bị khóa, hồ sơ và vai trò `admin`/`student` khớp; không ghi dữ liệu, không đổi quyền.
- **DONE (local tooling):** thêm mẫu `.env.staging.qa.example` không chứa secret, bỏ qua `.env.staging.qa.local` trong Git, hướng dẫn `node --env-file=...` chạy read-only trước rồi mới bật ba cờ write để chạy nghiệm thu Roadmap staging. Mật khẩu/JWT vẫn nằm trên máy của người dùng; không lưu vào Git/chat.
- **NOT TESTED:** chưa chạy `auth.signInWithPassword`/`auth.getUser` bằng JWT thật từ môi trường có mật khẩu; chưa thử ghi/restore. Không coi xác nhận metadata bằng SQL là RLS E2E PASS.
- **Bước còn lại:** chủ dự án chạy hai lệnh local theo [SUPABASE_SETUP.md](SUPABASE_SETUP.md), chỉ báo trạng thái đã lọc secret; đối chiếu version/events trên staging sau chạy rồi mới chốt P0. Production không đổi.

### 2026-10-30 — [SUPABASE/STAGING] Project staging được tạo và xác minh schema
- **DONE:** với xác nhận chủ dự án, tạo `Xuong-Cong-Nghe Staging QA`, ref `ordiksbvpewwgrnvzrud` trong org `dgqktlsjiuaeyhkbcdtx` (`ap-southeast-1`, $0/tháng, ACTIVE_HEALTHY); hai project hiện có không bị sửa/tạm dừng/xóa.
- **DONE:** áp 7 migration từ repo trên project mới. Khi áp migration `harden_internal_trigger_grants` đã bỏ riêng lệnh REVOKE `rls_auto_enable()` không tồn tại trong staging, không đổi file migration gốc. Chạy `supabase/seed.sql` bằng dữ liệu giả: 3 khóa, 9 bài, 1 quiz, 6 câu, 24 đáp án.
- **DONE:** migration staging-only `deny_public_truncate_staging_qa` thu hồi TRUNCATE `anon`/`authenticated` trên public tables; kiểm lại **14/14 RLS ON**, 0 bảng có quyền TRUNCATE của hai role. Production không đổi.
- **DONE (code):** `scripts/verify-roadmap-staging.mjs` được khóa project ref cụ thể, tests bổ sung guard, hướng dẫn onboarding Auth cập nhật ở [SUPABASE_SETUP.md](SUPABASE_SETUP.md).
- **BLOCKED:** staging chưa có Auth users; connector không có chức năng Auth Admin tạo user. Cần người quản lý tạo hai QA user riêng, xác nhận email và cấp role Admin trong staging (không nhập passwords vào Chat) rồi mới chạy JWT thật, CRUD/backup/restore và E2E Next.js Preview.
- **KHÔNG LÀM:** không đổi Production DB, Auth, RLS, Vercel env; Teacher Studio vẫn chờ nghiệm thu P0.

### 2026-10-30 — [AUTH/ROADMAP] Chuẩn bị staging
- Đã viết script JWT và CRUD/backup/restore + chốt chống chạy nhầm Production. Sau đó tạo staging và nghiệm thu thành công ngày 31/10. Quy trình đầy đủ: [SUPABASE_SETUP.md](SUPABASE_SETUP.md); lịch sử chi tiết giữ trong Git.
### 2026-10-30 — [DOCS/ARCH] Chuẩn hóa tài liệu
- Đã kiểm toán hệ thống và gộp tài liệu theo module, lưu lịch sử ở docs/archive. Quy tắc đọc đúng file, checkpoint đúng công việc; xem [INDEX.md](INDEX.md) và [SYSTEM_AUDIT_2026-10-30.md](SYSTEM_AUDIT_2026-10-30.md).
