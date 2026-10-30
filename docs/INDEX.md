# Bản đồ tài liệu — Xưởng Công Nghệ

> **Điểm vào duy nhất cho các phiên phát triển mới.** Cập nhật 30/10/2026.
> **Quy tắc: đọc theo nhiệm vụ, không đọc lại toàn bộ repository hay toàn bộ Markdown.** Các báo cáo trong `archive/` là lịch sử, không phải trạng thái hiện tại.

## 1. Khi nhận một yêu cầu mới

1. Đọc [WORKLOG_AND_RULES.md](WORKLOG_AND_RULES.md) phần quy tắc và mục đang mở (ngắn).
2. Tra bảng bên dưới để chọn **1 file chuẩn đúng module**; chỉ đọc tối đa 1–2 tài liệu phụ nếu có thay đổi liên module. Tránh duyệt cả repository.
3. Xem đúng file code trong `src/features/<module>` và route liên quan; tra GitHub history/PR hoặc snapshot kiểm toán **chỉ khi có sự cố liên quan**.
4. Chỉ thay file, test, DB và UI trong phạm vi đã giao. Không chỉnh module khác do tiện tay.
5. Sau từng bước được xác minh: cập nhật mục nhỏ ở nhật ký (file/commit/test/trạng thái), không cần đọc toàn bộ nhật ký cũ.
6. CI/Deploy: cập nhật đúng SHA và READY/alias đã xác minh; nếu chưa hoàn tất, ghi **chưa hoàn tất**, không hẹn cập nhật ngầm.

## 2. Module → file để đọc và sửa

| Khi làm gì? | Đọc trước (bắt buộc) | Đọc thêm khi trực tiếp ảnh hưởng | Mã nguồn sở hữu |
| --- | --- | --- | --- |
| Mọi yêu cầu | [WORKLOG_AND_RULES.md](WORKLOG_AND_RULES.md) | [SYSTEM_AUDIT_2026-10-30.md](SYSTEM_AUDIT_2026-10-30.md) **chỉ khi cần đánh giá rủi ro** | File đang được yêu cầu |
| Thay đổi sản phẩm, chức năng hoặc menu | [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md) | [ROADMAP.md](ROADMAP.md) / [XCN_FUNCTION_ROADMAP_CHECKLIST.md](XCN_FUNCTION_ROADMAP_CHECKLIST.md) | `src/features`, `src/config` |
| API, DB, RLS, Supabase, Auth, deploy | [ARCHITECTURE_AND_SECURITY.md](ARCHITECTURE_AND_SECURITY.md) | [SUPABASE_SETUP.md](SUPABASE_SETUP.md), [SUPABASE_STORAGE.md](SUPABASE_STORAGE.md) | `src/lib`, `src/middleware.ts`, `supabase/migrations` |
| Public Website 5 trang: Trang chủ / Giới thiệu / Bảng giá / Tin tức / Liên hệ | [PUBLIC_WEBSITE_DESIGN_SPEC.md](PUBLIC_WEBSITE_DESIGN_SPEC.md) | [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md), [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md) | `src/app/(public)`, `src/components/public-*`, `src/config/navigation.ts` |
| UI toàn site, Admin header/sidebar | [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) | [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md) khi cần luồng | `src/app`, `src/components`, `src/app/admin/admin.css` |
| Student/Quiz/learning progress | [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md) | [ARCHITECTURE_AND_SECURITY.md](ARCHITECTURE_AND_SECURITY.md) | `src/features/learning`, `src/app/student`, `src/app/api/quiz` |
| Roadmap/backup/conflict | [ROADMAP.md](ROADMAP.md) + [ARCHITECTURE_AND_SECURITY.md](ARCHITECTURE_AND_SECURITY.md) | [SYSTEM_AUDIT_2026-10-30.md](SYSTEM_AUDIT_2026-10-30.md) | `src/features/admin/roadmap-*` |
| Word Lab | [WORD_SIMULATOR_STANDARD.md](WORD_SIMULATOR_STANDARD.md) | [WORD_SIMULATOR_CONTROL_AUDIT.md](WORD_SIMULATOR_CONTROL_AUDIT.md), [WORD_HOME_QA_REPORT.md](WORD_HOME_QA_REPORT.md) | `src/features/word-simulator` |
| Slide/lesson presentation | [SLIDE_STANDARD.md](SLIDE_STANDARD.md) | [PRESENTATION_DESIGN_STANDARD.md](PRESENTATION_DESIGN_STANDARD.md), [PPT_INTEGRATION.md](PPT_INTEGRATION.md) | `src/features/presentations` |
| Teacher Studio/Quiz/Labs | [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md) | [XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md](XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md) | `src/features/<new-domain>` sau khi duyệt |
| Tham khảo website, tên miền ứng dụng | [WEBSITE_REFERENCES.md](WEBSITE_REFERENCES.md) | [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md) | Chỉ tài liệu cho đến khi có yêu cầu triển khai |
| Kiểm tra tổng thể, bảo mật, tồn đọng | [SYSTEM_AUDIT_2026-10-30.md](SYSTEM_AUDIT_2026-10-30.md) | [ARCHITECTURE_AND_SECURITY.md](ARCHITECTURE_AND_SECURITY.md) | Read-only lần đầu; staged changes riêng |

## 3. File Markdown đang có vai trò độc lập

### Nhóm cốt lõi (đọc theo tác vụ)
- **[WORKLOG_AND_RULES.md](WORKLOG_AND_RULES.md)** — quy tắc thao tác, checkpoint và nhật ký mới ngắn.
- **[PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md)** — nghiệp vụ, module ownership, dependency, route thực/dự kiến.
- **[ARCHITECTURE_AND_SECURITY.md](ARCHITECTURE_AND_SECURITY.md)** — stack, Auth/RLS, dữ liệu, release gate.
- **[UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md)** — quy chuẩn UI hiện tại, palette Public đề xuất và các ràng buộc khác module.
- **[PUBLIC_WEBSITE_DESIGN_SPEC.md](PUBLIC_WEBSITE_DESIGN_SPEC.md)** — đặc tả 5 trang Marketing, wireframe, copy, auth-gated catalog và các phase D0–D7 (D2–D4 code/QA PASS trên PR #73, chưa deploy).
- **[ROADMAP.md](ROADMAP.md)** — backlog/mốc, link checklist chi tiết và giới hạn hiện hành.
- **[WEBSITE_REFERENCES.md](WEBSITE_REFERENCES.md)** — VniTeach, Đề Thi Số, DUA Edu, Môn Tin học, quy hoạch subdomain.
- **[SYSTEM_AUDIT_2026-10-30.md](SYSTEM_AUDIT_2026-10-30.md)** — snapshot kiểm toán có ngày, không đọc cho task UI nhỏ.

### Nhóm chuyên sâu (không gộp vì nội dung kỹ thuật riêng)
- [WORD_SIMULATOR_STANDARD.md](WORD_SIMULATOR_STANDARD.md) — hành vi/ribbon/editor; [WORD_SIMULATOR_CONTROL_AUDIT.md](WORD_SIMULATOR_CONTROL_AUDIT.md) và [WORD_HOME_QA_REPORT.md](WORD_HOME_QA_REPORT.md) giữ kiểm chứng.
- [SLIDE_STANDARD.md](SLIDE_STANDARD.md) — nguyên tắc slide; [PRESENTATION_DESIGN_STANDARD.md](PRESENTATION_DESIGN_STANDARD.md) — quy tắc trình bày; [PPT_INTEGRATION.md](PPT_INTEGRATION.md) — cấu trúc renderer.
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) — môi trường, migration; [SUPABASE_STORAGE.md](SUPABASE_STORAGE.md) — bucket, file, quyền.
- [XCN_FUNCTION_ROADMAP_CHECKLIST.md](XCN_FUNCTION_ROADMAP_CHECKLIST.md) — checklist chức năng; [XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md](XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md) — kế hoạch dài hạn.
- `CHANGELOG.md` tại root — lịch sử thay đổi có thể nhìn thấy; không dùng làm entrypoint thông tin hiện tại.

### Lịch sử (chỉ đọc khi truy vết)
- [archive/FOUNDATION_ORIGINALS_BEFORE_2026-10-30.md](archive/FOUNDATION_ORIGINALS_BEFORE_2026-10-30.md) — nguyên văn 11 tài liệu nền tảng gốc.
- [archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md](archive/PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md) — 6 báo cáo kiểm toán bảo mật cũ.
- [archive/WORKLOG_HISTORY_TO_2026-10-30.md](archive/WORKLOG_HISTORY_TO_2026-10-30.md) — nhật ký đầy đủ trước đợt chuẩn hóa.

**Mỗi file chỉ có một vai trò chính.** Không tạo thêm file `*_NEW.md`, `*_V2.md`, `*_FINAL.md` cho cùng mục đích. Khi có yêu cầu mới, cập nhật đúng file chủ sở hữu module; nếu nghiên cứu đang dở, ghi trạng thái trong Worklog chứ không tạo thêm 5 file tạm.

## 4. Cách cập nhật tiến độ

Sau mỗi bước:
- `[date][module][status]` nêu thay đổi, file, nguyên nhân, tác động liên module.
- Gắn PR/commit/test/bằng chứng và blocker, lưu ngay trên nhánh đang làm.
- Nếu đổi hợp đồng API/dữ liệu → cập nhật ARCHITECTURE_AND_SECURITY; nếu đổi luồng nghiệp vụ → cập nhật PRODUCT_AND_MODULES; nếu đổi UI toàn cục → UI_DESIGN_SYSTEM; nếu website mới → WEBSITE_REFERENCES.
- Khi kết thúc task: kiểm tra link Markdown, test, build, CI và Production SHA; chỉ sau đó đánh dấu xong.
- Tách snapshot báo cáo có ngày khi thật sự cần kiểm toán; không viết lại toàn bộ repo mỗi lần.

**Quyết định chính:** `docs/INDEX.md` là điểm vào duy nhất; `AGENTS.md` là hướng dẫn điều phối ngắn; tên file chuyên ngành được duy trì ổn định, repo Git giữ lịch sử.
