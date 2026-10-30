# Kiểm toán toàn hệ thống — 30/10/2026

> **Snapshot tại thời điểm kiểm tra**, không phải kết luận sản phẩm đã hoàn tất hay bằng chứng E2E. Các phép kiểm tra Supabase chỉ đọc, không làm thay đổi DB/Auth/RLS; tài liệu được chỉnh trên branch qua PR riêng.
> Điểm vào làm việc sau này: [INDEX.md](INDEX.md) → module liên quan → [WORKLOG_AND_RULES.md](WORKLOG_AND_RULES.md). Không lặp lại kiểm kê toàn repo ở yêu cầu nhỏ.

## 1. Phạm vi đã kiểm kê

| Nhóm | Kết quả | Giới hạn kiểm chứng |
| --- | --- | --- |
| Repository | 378 mục trong Git tree, 217 mục ở `src/`, 32 Markdown dưới `docs/` trước chuẩn hóa | Đếm tree Git, không phải 378 module/function |
| Khung ứng dụng | Next.js 15.5.x, React 19.1.x, TypeScript, Tailwind 3, Supabase SSR/RLS, Vercel | package.json và sơ đồ repo |
| Mã nguồn module | `src/features/admin`, `auth`, `courses`, `learning`, `presentations`, `word-simulator` | Không xác nhận mọi chức năng chạy sau login |
| Route | 11 trang Admin; các trang Student/Quiz; public, slides, Word; API Roadmap, quiz, auth callback | File route tồn tại ≠ nghiệp vụ/QA Live đủ |
| Supabase Production | 14 bảng `public` đều `RLS=on` | **Không** suy ra policy/GRANT đúng cho mọi user |
| Staging Supabase | 0 branch thử nghiệm | Chưa kiểm thử CRUD/JWT thật cách ly |
| Security Advisor | 5 finding: `is_admin()` callable bởi anon; 3 lượt cảnh báo hàm SECURITY DEFINER gọi bởi authenticated; leaked-password protection tắt | Cảnh báo cần rà phụ thuộc, **không tự revoke/grant** |
| Performance Advisor | 14 foreign keys chưa có covering index; 3 RLS init-plan; 30 cảnh báo multiple permissive policies (theo role/action); 1 unused index | Không phải 48 lỗi nghiêm trọng; ưu tiên theo slow query trước |
| GitHub CI | Check mới nhất trên `main` trước đợt tài liệu này: success (unit, TypeScript, production build, Chromium) | CI dùng Demo; không phải E2E Auth Live |
| Vercel | Bản sản xuất của lần làm việc trước đã READY và alias chính khớp SHA | Khi phát hành tiếp phải tra lại deployment mới |
| Hướng module tương lai | Teacher Studio, School Manager, Excel/Coding Lab, Live Quiz | Chưa hoàn chỉnh; không coi là tính năng đã có |

Mã nguồn theo nhóm chính: Admin `src/app/admin/`, `src/features/admin/`; Auth `src/features/auth/`, `src/lib/supabase/`, `src/middleware.ts`; nội dung/lớp `src/features/courses/`, `src/features/learning/`; trình chiếu `src/features/presentations/`; Word `src/features/word-simulator/`. Bản đồ đầy đủ: [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md).

## 2. Rủi ro đã phát hiện và mức ưu tiên

| Mức | Phát hiện | Tác động / xử lý tiếp | Trạng thái |
| --- | --- | --- | --- |
| P0 | Chưa có Supabase staging; chưa chạy thật JWT Admin/Student và CRUD/restore sau refresh | Cần tách project/branch thử nghiệm, test real Auth/RLS; không thử ghi Production | **CHƯA NGHIỆM THU** |
| P0 | Security Advisor báo hàm đặc quyền exposed, password protection chưa bật | Kiểm hàm/policy, migration + test rollback trên staging, chỉ sau đó mới đổi Production | **CHƯA XỬ LÝ** |
| P0 | ROADMAP/README/Supabase docs cũ mô tả demo hay migration chưa áp | Tách snapshot lịch sử khỏi nguồn hiện hành, ghi trạng thái có ngày/nguồn; không đưa quyết định theo tài liệu cũ | **ĐANG CHUẨN HÓA TÀI LIỆU** |
| P1 | Không có route/module hoàn chỉnh của Teacher Studio, lớp và ngân hàng câu hỏi dùng chung | Định schema/contracts, kiểm quyền ownership trước khi xây UI | KẾ HOẠCH |
| P1 | Chưa có E2E các 11 trang Admin sau login và mạng yếu | QA trên staging, check loading/empty/error, session expiry, a11y, mobile | CHƯA NGHIỆM THU |
| P1 | 14 FK thiếu index, RLS init-plan và permissive policies lặp | Đo query thực tế/EXPLAIN, tạo migration cải thiện có benchmark; tránh thêm index đại trà | BACKLOG |
| P1 | Tài liệu rời rạc và nhật ký 100KB+ mỗi lượt phải đọc lại | INDEX theo module, 3 nguồn chuẩn nền tảng, nhật ký ngắn + archive nguyên văn | ĐANG TRIỂN KHAI |
| P2 | Tên miền phụ app-specific, SSO giữa subdomain | Xác minh sở hữu xuongcongnghe.net, đăng nhập SSR, DNS/SSL/callback; thí điểm nhỏ | CHƯA TRIỂN KHAI |
| P2 | AI, runner code, Scratch, game theo các web tham khảo | Thiết kế sandbox bảo mật, rubric, dữ liệu nội dung dùng chung; chưa đưa vào sản phẩm | NGHIÊN CỨU |

**Không đánh dấu P0 đạt chỉ vì CI xanh hoặc Vercel READY.**

## 3. Đề xuất cấu trúc ổn định để mở rộng

```text
src/
├── app/                       Next.js routes, layout, HTTP/API, server actions
├── features/
│   ├── auth/                  Login, role, session redirect
│   ├── admin/                 Dashboard, roadmap, system admin
│   ├── courses/               Content discovery, course read model
│   ├── learning/              Student lesson, quiz, progress
│   ├── presentations/         Teaching slides & content
│   └── word-simulator/        Independent Word Lab
├── components/ui/             Pure shared primitives
├── config/                    Navigation, constants
└── lib/                       Supabase client, storage, shared utilities
supabase/migrations/            Versioned schema + RLS changes
tests/                         Unit/regression/security harness
scripts/                       Chromium QA, smoke, RLS tooling
docs/
├── INDEX.md                   Duy nhất điểm vào: nhiệm vụ -> module -> file
├── WORKLOG_AND_RULES.md       Quy tắc làm việc + lịch sử mới ngắn gọn
├── PRODUCT_AND_MODULES.md     Nghiệp vụ + dependency + route map
├── ARCHITECTURE_AND_SECURITY.md  Data/RLS/contracts/runtime/CI
├── UI_DESIGN_SYSTEM.md        Brand + layout + component UX
├── ROADMAP.md                 Ghi các mốc chức năng và giới hạn hiện hành
├── WEBSITE_REFERENCES.md      4 website tham khảo + subdomain
├── SYSTEM_AUDIT_2026-10-30.md Chính tài liệu snapshot này
├── *STANDARD.md               Tài liệu module chuyên sâu, đọc khi cần
└── archive/                   Bản gốc và báo cáo có ngày, KHÔNG đọc mặc định
```

**Kiến trúc đề xuất:** modular monolith trong một Next.js repo trước, dùng một Supabase project cho Production, staging cách ly; tách deploy ứng dụng theo subdomain chỉ khi module đủ độc lập và vấn đề session/ownership đã được nghiệm thu. Tránh microservices sớm gây nhân đôi Auth/CMS và công việc vận hành.

### Chống liên kết chồng chéo

- Module **Auth** sở hữu session/role; Admin và Student chỉ sử dụng role qua API server.
- Module **Content** sở hữu bài học/câu hỏi và version; Slides/Quiz/Labs chỉ tham chiếu ID.
- Module **Teacher** (khi được xây) sở hữu lớp/giao bài; không ghi trực tiếp state thuộc Student.
- Module **Learning** sở hữu bài nộp/progress; không để UI tự chỉnh score.
- Module **Storage** chỉ cấp signed access sau xác thực quyền. Không phát public URL file riêng tư.
- Module **Roadmap** chỉ phục vụ vận hành Admin; không trộn làm bảng assignment giáo viên.
- Code mới phải có file entrypoint/owner/test/documented contract trong [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md), PR nhỏ theo domain.

## 4. Quy tắc nghiệm thu và release gate

**Definition of Done (mỗi PR):**
1. Có phạm vi module và ràng buộc không sửa ngoài nhiệm vụ.
2. Có unit/regression khi đổi logic, test a11y/responsive khi đổi UI.
3. `pnpm test`, `pnpm typecheck`, `pnpm build`, Chromium smoke đúng route chạy PASS.
4. Nếu liên quan Auth/DB/RLS: staging + JWT thật, migrate có rollback, backup trước ghi, kiểm tra lộ dữ liệu.
5. Đọc lại đường dẫn/nội dung/chuyển hướng; có 404/500/empty/loading handling phù hợp.
6. Ghi log vào WORKLOG khi hoàn thành bước, liên kết PR/commit và trạng thái CI/Vercel thật. Không báo Production READY trước khi xác minh alias và SHA.

**Stop conditions:** migration đụng dữ liệu Live chưa backup, policy không được test hai vai trò, cookie/sign-in không chứng minh đúng, SSR expose token, hoặc không xác minh được build/deploy. Trong các trường hợp đó chỉ tài liệu/code PR, không ghi Production.

## 5. Việc đã làm trong đợt này và chưa làm

**Đợt tài liệu:**
- Bổ sung DUA Edu và Môn Tin học vào sổ website, loại `fbclid`.
- Lưu nguyên văn 11 tài liệu nền tảng, 6 báo cáo Phase 00 và lịch sử nhật ký trước hợp nhất.
- Chỉ giữ bộ Markdown chuẩn tối thiểu để tra module và quyết định, tham chiếu archive khi cần.
- Cập nhật AGENTS, README, cách ghi log mới không đòi quét toàn dự án.

**Chưa làm:** chưa chạy xâm nhập/kiểm thử thực tế Auth/CRUD bằng tài khoản người dùng; chưa đổi RLS hay tạo staging; chưa đổi DNS; chưa lập Teacher Studio; chưa kiểm tra bằng cách chạy ứng dụng trong phiên người dùng ngoài CI Demo.

## 6. Liên kết bằng chứng

- CI: https://github.com/huunghia160699/xuong-cong-nghe/actions
- Vercel: https://vercel.com/huunghia160699-5603/xuong-cong-nghe
- Security linter: https://supabase.com/docs/guides/database/database-linter
- Báo cáo lịch sử: [archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md](archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md)
- Worklog trước chuẩn hóa: [archive/WORKLOG_HISTORY_TO_2026-10-30.md](archive/WORKLOG_HISTORY_TO_2026-10-30.md)
- Website tham khảo: [WEBSITE_REFERENCES.md](WEBSITE_REFERENCES.md)
