# Kiến trúc, dữ liệu, bảo mật và vận hành — Xưởng Công Nghệ

> **Chuẩn kỹ thuật hiện hành, cập nhật 30/10/2026.** Đọc khi thay đổi API, DB, Auth, middleware, Storage, deploy hoặc liên kết giữa các module. Truy cập theo [INDEX.md](INDEX.md). Dữ liệu thực tế đọc lại từ công cụ khi thực hiện thao tác Production; không dùng snapshot như chân lý vĩnh viễn.

## 1. Stack và ranh giới

- Next.js 15 App Router + React 19, TypeScript, Tailwind CSS 3.
- Supabase SSR Auth, PostgreSQL, RLS, RPC chấm quiz, Storage private.
- Vercel Production dùng Live Supabase; local/dev mặc định Demo khi `NEXT_PUBLIC_USE_MOCK_DATA` không bằng `false`.
- `src/app`: route, layout, server actions và HTTP handlers. `src/features/<domain>`: nghiệp vụ, state, validation, feature UI.
- `src/components/ui`: primitive tái sử dụng, không nắm logic nghiệp vụ. `src/lib`: hạ tầng chung, client Supabase, Storage; `src/config`: constants/nav.
- `supabase/migrations`: nguồn schema có kiểm soát; tuyệt đối không sửa lịch sử migration đã áp, không áp lại migration vì tên file khác version hệ thống.
- `tests` và `scripts`: test, smoke, QA; từng thay đổi nghiệp vụ phải có kiểm thử mức tương ứng.

Hướng phụ thuộc mục tiêu:

```text
src/app / routes             (điều phối)
  ├── src/features/<domain>  (nghiệp vụ, validation, UI)
  │     └── repository/service -> src/lib/supabase (hạ tầng)
  ├── src/components/ui      (trình bày thuần)
  └── src/config             (thiết lập chung)
```

Không gọi Supabase tùy tiện trong presentational components; nếu mã hiện tại chưa tách service hoàn chỉnh, sửa có kiểm soát và refactor dần theo PR nhỏ. Không tạo vòng phụ thuộc giữa các feature.

## 2. Data model hiện có và tương lai

**Các nhóm hiện trong schema:** Identity `profiles`; Content `courses`, `chapters`, `lessons`; Learning `enrollments`, `lesson_progress`; Quiz `quizzes`, `questions`, `question_options`, `quiz_attempts`, `quiz_answers`; Personal `notes`; Admin `admin_roadmap`, `admin_roadmap_events`. Tổng **14 bảng public** tại phiên kiểm tra Production 30/10/2026.

Quy ước: UUID cho key, `timestamptz` và `updated_at` cho bảng sửa được, unique slug công khai, soft deletion khi có điểm/lịch sử, không cascade bài làm không chủ đích.

Các module Teacher/class, assignment, content bank, Lab rubric, school manager là **dự kiến**, chưa có đầy đủ bảng tương ứng; phải thiết kế model và RLS trước khi mở API.

## 3. Identity, Auth, quyền và RLS

- Server xác minh phiên bằng Supabase `auth.getUser()`, vai trò lấy từ `profiles.role`; RLS là lớp chặn cuối cùng, không chỉ UI/middleware.
- Demo không phải Live; nhãn “Supabase · Live” không tự chứng minh mạng, RLS hoặc quyền đã qua E2E.
- Sau PR #62, login đọc profile để chọn mặc định `/admin` với Admin và `/student` với Student/Teacher; đường dẫn nội bộ chỉ được ưu tiên khi an toàn, nhưng từng route vẫn kiểm quyền.
- Vai trò: Guest (xem public), Student (own progress), Teacher (own content/class khi module đã có), Admin (quản trị hệ thống); School Manager chỉ là hướng mở rộng chưa có quyền thực.
- Không dùng `user_metadata` để cấp quyền, không đưa service-role secret vào client hoặc GitHub.
- Với RLS, luôn kiểm tra đồng thời GRANT trên schema/table/RPC, policy TO, USING/WITH CHECK và chặn UPDATE role sai.
- Tuyệt đối không chạy thử UPDATE/DELETE Production để chứng minh quyền; cần Supabase staging branch, hai JWT xác minh thật và rollback.
- Cookie session SSR trên nhiều subdomain **không tự đồng bộ**. Thiết kế SSO và callback allowlist riêng khi mở ứng dụng `*.xuongcongnghe.net`.

## 4. Roadmap, dữ liệu và recovery

- Master Roadmap Admin lưu ở `admin_roadmap`, event audit lưu `admin_roadmap_events`.
- Version và compare-and-swap bảo vệ xung đột; sau PUT cần GET readback version/nội dung để xác nhận. So sánh JSON semantic không phụ thuộc thứ tự khóa.
- Nếu GET không xác minh được hoặc có 409, không auto PUT mù; giữ local draft và checkpoint/backup. Không coi JSON trên thiết bị là nguồn chính trong Live.
- Backup phải khớp version, snapshot và nhật ký đầy đủ; không commit backup chứa dữ liệu thật vào repo.

## 5. Storage và file

- Đang dùng private Supabase Storage (bucket `xcn-private-documents`); Admin có workflow ký link hạn ngắn, giới hạn file và RLS. Chưa có thư viện nộp bài đa vai trò hoàn chỉnh.
- Cloudflare R2 là phương án dự phòng, **chưa kích hoạt trong cấu hình Production**. Không cấu hình secret hoặc đưa quyền public trước khi có quota, MIME, lifecycle, audit, antivirus.
- Hướng dẫn thao tác: [SUPABASE_STORAGE.md](SUPABASE_STORAGE.md). Nội dung R2 gốc lưu trong Git history nếu tài liệu tùy chọn được gộp về sau.

## 6. Local, Preview, Production và kiểm thử

**Staging riêng (30/10/2026):** Supabase ref `ordiksbvpewwgrnvzrud`, vùng Singapore, có 7 migration và dữ liệu seed giả; 1 migration hardening quyền TRUNCATE **chỉ trên staging**. 14/14 public tables bật RLS. Không có Auth QA user nên JWT E2E và CRUD/restore chưa chạy; hướng dẫn [SUPABASE_SETUP.md](SUPABASE_SETUP.md). Production ref `bpxwpfmjoojrgqlfkqgz` không đổi. Không đồng nhất môi trường staging với Production và không tự đẩy hardening SQL khi chưa kiểm thử xong.

**Local Demo:** `pnpm install` → `pnpm dev` → http://localhost:3000. `NEXT_PUBLIC_USE_MOCK_DATA` khác `false` là Demo, dữ liệu nháp trong localStorage không đồng bộ.

**Live Dev:** dùng Supabase project riêng; `.env.local` lấy template `.env.example`, không đưa keys vào tài liệu; migrations reconcile trước khi chạy. Chi tiết: [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

**CI:** `pnpm test`, `pnpm typecheck`, `pnpm build`, smoke/Chromium; test 360/768/1280 và các màn height thấp. CI Demo **không thay thế** test login real JWT, mạng yếu, restore và multi-tab.

**Release:** chỉ tuyên bố Production mới khi GitHub main SHA = Vercel deployment SHA, trạng thái READY, alias domain chính đúng, CI đạt và luồng quan trọng được nghiệm thu khi có môi trường phù hợp.

## 7. Các chốt an toàn cần hoàn tất trước mở rộng

1. Tạo staging Supabase tách Production; snapshot dữ liệu cần thiết đã ẩn danh.
2. Kiểm thử thật Admin vs Student: Auth redirect, 401/403, RLS đọc/ghi, RPC, Storage, không nâng quyền.
3. Nghiệm thu CRUD + reload + conflict + backup/restore Roadmap trên staging.
4. Kiểm tra 11 màn Admin sau đăng nhập thực, loading/error/empty, keyboard, mobile, mạng yếu.
5. Rà Supabase Security Advisor trước bất kỳ migration đổi quyền nào; kiểm thử lại với staging rồi PR riêng.
6. Thiết kế permission matrix và interface từng module trước khi xây Teacher Studio.

## 8. Liên kết module

- Product và dependency: [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md)
- Kiểm toán có ngày: [SYSTEM_AUDIT_2026-10-30.md](SYSTEM_AUDIT_2026-10-30.md)
- UI chuẩn: [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md)
- Roadmap hiện có: [ROADMAP.md](ROADMAP.md)
- Các báo cáo security cũ, giữ nguyên và **không dùng như trạng thái hiện hành**: [archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md](archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md)
- Các tài liệu nền tảng gốc: [archive/FOUNDATION_ORIGINALS_BEFORE_2026-10-30.md](archive/FOUNDATION_ORIGINALS_BEFORE_2026-10-30.md).
