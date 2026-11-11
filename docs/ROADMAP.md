# Roadmap tổng thể — Xưởng Công Nghệ

> **Trạng thái:** CURRENT / kế hoạch hợp nhất  
> **Ngày cập nhật:** 07/11/2026  
> **Nguồn chính:** tiến độ repository, kiểm toán hệ thống, Master Plan, checklist chức năng và năm báo cáo tham khảo sản phẩm.  
> **Nguyên tắc:** báo cáo tham khảo chỉ cung cấp ý tưởng; không sao chép giao diện, nội dung hoặc mã nguồn. Mục chưa có bằng chứng code/test/deploy được xem là **CHƯA TRIỂN KHAI**.

## 1. Tầm nhìn sản phẩm

Xưởng Công Nghệ là nền tảng học công nghệ theo chu trình:

`khám phá → học có hướng dẫn → thực hành → kiểm tra → nhận phản hồi → lưu tiến bộ → giáo viên theo dõi`

Năm nguồn tham khảo được ghi nhận, mỗi nguồn bổ sung một nhóm năng lực:

- VniTeach: trung tâm công cụ giáo viên, tiện ích lớp và hoạt động ôn tập.
- DUA Edu: dashboard học tập, lộ trình, Quiz, Slides và Data Lab.
- Đề Thi Số: tạo đề, ma trận, lớp học, chấm bài, trình chiếu, QR và trò chơi lớp.
- Môn Tin học: chấm code real-time, nhiều loại bài, AI sư phạm, kho bài và thư viện.
- Tin học cơ bản: lộ trình tự học, typing thích ứng, gamification, blog, tiện ích và tài nguyên.

Xưởng Công Nghệ sẽ hấp thụ **mô hình luồng** và **nguyên tắc UX**, không bê nguyên tính năng vào cùng một lần phát triển.

## 2. Thứ tự ưu tiên

| Ưu tiên | Mục tiêu | Điều kiện hoàn thành |
|---|---|---|
| P0 | An toàn dữ liệu, Auth, RLS, Roadmap và release gate | Có bằng chứng SQL, E2E, 401/403/409 và audit |
| P1 | Lõi học viên hiện tại và Teacher Studio nền tảng | Giáo viên tạo nội dung, học viên học/nộp, dữ liệu phân quyền đúng |
| P1 | Public Website và onboarding | 5 trang public, CTA thật, responsive, SEO, accessibility |
| P2 | Nội dung tương tác: Quiz, Slides, Word/Excel Lab | Có autosave, chấm, kết quả và khôi phục |
| P2 | Lớp học, giao bài, bài nộp, thống kê | Ownership/cross-class isolation được kiểm thử |
| P3 | Live Quiz, QR, trình chiếu và hoạt động nhóm | 40–50 thiết bị, reconnect và mạng yếu đạt |
| P3 | Coding Lab, SQL, chấm file, Scratch/HTML | Sandbox, test case, quota và audit log đạt |
| P4 | AI sư phạm, typing thích ứng, gamification | Consent, giới hạn lượt, teacher review và dữ liệu tối thiểu |
| P4 | Thư viện, blog, tài nguyên và commerce | Quyền đọc, phiên bản, bản quyền, thanh toán/hoàn tiền rõ |
| P5 | Quản lý phòng máy, realtime nâng cao, phụ huynh/trường | Có pilot, đánh giá pháp lý/bảo mật và SLA vận hành |

## 3. Trạng thái nền hiện tại

### Đã có hoặc đã được kiểm chứng

- Student learning flow, Quiz, tiến độ và Admin nền tảng đã có trong mã nguồn.
- Supabase SSR/Auth/RLS và Roadmap production có migration; staging đã chạy nghiệm thu JWT Roadmap CRUD/conflict/backup/restore.
- Public foundation đã được triển khai theo PR đã ghi trong lịch sử.
- Word Lab đã có các checkpoint Cut/Sort/Undo/Redo và CI tương ứng.
- Các tài liệu chuyên môn và báo cáo tham khảo đã được lập.

### Chưa được coi là hoàn tất

- Teacher Studio browser E2E với role teacher thật.
- Ownership và cross-class isolation cho lớp/bài nộp.
- Coding sandbox production.
- AI production với consent và dữ liệu học sinh.
- Live Quiz/QR nhiều thiết bị.
- Chấm file, thư viện có bản quyền và commerce.
- Full release gate trên tất cả breakpoint và mạng yếu.

## 4. Giai đoạn P0 — Nền an toàn và hợp đồng dữ liệu

### 4.1. Database và quyền

- Duy trì schema migration versioned.
- Tách rõ user, profile, role, organization, class, membership, assignment, submission, attempt và audit event.
- RLS theo ownership: giáo viên chỉ thấy lớp/bài của mình; học viên chỉ thấy lớp/bài được giao; quản trị viên có quyền theo scope.
- Kiểm tra SECURITY DEFINER, EXECUTE grant, search_path và quyền PUBLIC.
- Có unique/version constraint cho Roadmap và các tài liệu chỉnh sửa đồng thời.
- Không để client tự quyết định điểm, role, owner hoặc trạng thái phát hành.

### 4.2. Hợp đồng API

Mọi mutation phải có:

- Auth bắt buộc.
- Input schema.
- Quyền resource-level.
- Idempotency hoặc chống ghi trùng.
- Mã lỗi chuẩn: 400, 401, 403, 404, 409, 422, 429, 500.
- Audit event cho thao tác nhạy cảm.

### 4.3. Release gate

Chỉ release khi có:

- Unit/typecheck/build.
- Browser E2E.
- RLS thật với Admin/Teacher/Student.
- Mobile 360, tablet 768, desktop 1280/1920.
- Keyboard navigation và reduced motion.
- Loading, empty, error, offline/reconnect.
- Vercel READY đúng commit SHA.
- Không có secret trong log, docs hoặc client bundle.

## 5. Giai đoạn P1 — Kiến trúc giao diện chung

### 5.1. Public shell

**Desktop**

- Header cao khoảng 64–72px.
- Logo trái.
- Nav giữa theo nhóm: Học tập, Thực hành, Kiểm tra, Công cụ, Tài nguyên.
- CTA phải: Đăng nhập và Không gian của tôi.
- Container tối đa 1200px, gutter thích ứng.
- Không dùng menu quá dày hoặc link chưa tồn tại.

**Mobile**

- Header gọn: logo, menu, CTA.
- Menu mở dạng drawer theo nhóm.
- CTA chính luôn chạm được bằng một tay.
- Không để bảng lớn tràn ngang.
- Focus/ESC đóng menu; trap focus trong drawer.

### 5.2. Student shell

- Header: logo, tiến độ tổng, thông báo, avatar.
- Sidebar desktop / bottom navigation mobile.
- Điều hướng chính: Tổng quan, Lộ trình, Bài học, Luyện tập, Kết quả, Tài nguyên.
- Khu nội dung rộng, card ít nhưng có thứ bậc rõ.
- Luôn hiển thị “bước tiếp theo” thay vì chỉ hiển thị danh sách.

### 5.3. Teacher shell

- Header: lớp đang chọn, thông báo, tài khoản.
- Sidebar: Tổng quan, Nội dung, Ngân hàng câu hỏi, Lớp học, Giao bài, Chấm bài, Thống kê, Trình chiếu, Cài đặt.
- Breadcrumb ở mọi trang sâu.
- Primary action cố định theo ngữ cảnh: Tạo bài, Giao bài, Chấm, Xuất báo cáo.
- Không trộn ví/commerce vào khu chấm và giảng dạy.

### 5.4. Admin shell

- Sidebar riêng cho hệ thống, user/role, Roadmap, audit, cài đặt.
- Không dùng cùng affordance với Teacher nếu quyền khác nhau.
- Mọi destructive action có confirm và audit event.

## 6. Giai đoạn P1 — Student Dashboard và lộ trình

### Bố cục

1. **Welcome card:** tên, streak, bài tiếp theo.
2. **Continue learning:** bài đang dở với CTA tiếp tục.
3. **Roadmap:** các chặng theo thứ tự, trạng thái locked/current/done.
4. **Practice queue:** câu sai, bài cần ôn, quiz đề xuất.
5. **Recent results:** điểm và nhận xét gần nhất.
6. **Resource rail:** bài viết, video, tiện ích liên quan.

### Luồng

`Đăng nhập → Dashboard → chọn bước tiếp theo → Lesson → Practice → Result → Review/Continue`

### Nguyên tắc

- Không bắt người học chọn từ quá nhiều menu.
- Luôn lưu tiến độ sau mỗi đơn vị có ý nghĩa.
- Result không chỉ là điểm: phải có lỗi, giải thích và hành động tiếp theo.
- Empty state phải hướng dẫn học viên bắt đầu bằng một CTA duy nhất.

## 7. Giai đoạn P1/P2 — Nội dung, Quiz và ngân hàng câu hỏi

### Teacher flow

`Tạo nội dung → chọn loại → nhập/nhập file → xem trước → kiểm tra → lưu nháp → phát hành`

Loại nội dung:

- Lesson.
- Quiz.
- Đúng/Sai.
- Tự luận.
- Bài thực hành file.
- Bài code/SQL (sau khi sandbox đạt).
- Slide/presentation.

### Question bank

- Tags: lớp, chủ đề, chuẩn đầu ra, độ khó, ngôn ngữ.
- Versioning và trạng thái draft/review/published/archived.
- Preview không lộ đáp án cho learner.
- Reuse câu hỏi vào nhiều đề nhưng giữ snapshot khi đã giao.
- Có lịch sử sửa và người sửa.

### Quiz UI

- Header: tiến độ, thời gian, lưu trạng thái.
- Main: một câu hoặc nhóm câu, media/công thức accessible.
- Footer: trước/sau, đánh dấu xem lại, nộp.
- Result: điểm, câu sai, giải thích, nút ôn lại.
- Server là nguồn sự thật cho timer, attempt và điểm.

## 8. Giai đoạn P2 — Teacher Studio, lớp và giao bài

### Luồng tạo lớp

`Teacher Dashboard → Lớp học → Tạo lớp → mã lớp → thêm thành viên → kiểm tra danh sách`

### Luồng giao bài

`Chọn lớp → chọn nội dung → đặt hạn → cấu hình attempt/quyền xem đáp án → preview → giao`

### Student flow

`Vào lớp bằng mã → xem bài được giao → làm bài → nộp → nhận trạng thái → xem điểm/nhận xét`

### Bố cục lớp học

- Header: tên lớp, mã lớp, giáo viên.
- Tabs: Tổng quan, Thành viên, Bài giao, Bài nộp, Thống kê.
- Summary cards: số học viên, bài sắp hạn, bài chưa chấm.
- Table desktop / cards mobile.
- Filter theo trạng thái, hạn, nhóm.
- Không hiển thị dữ liệu học sinh ngoài scope.

### Bài nộp

- Queue chưa chấm.
- Detail theo học viên và attempt.
- Rubric/annotation.
- Lịch sử chấm.
- Publish/reopen điểm.
- Export có quyền và audit.

## 9. Giai đoạn P2 — Word/Excel/Slides Lab

### Word Lab

- Toolbar/ribbon có nhóm ngữ nghĩa.
- Editor trung tâm.
- Panel task/hướng dẫn bên phải.
- Autosave indicator.
- Undo/redo và clipboard fallback.
- QA IME tiếng Việt, tài liệu dài, ảnh/bảng, import/export.

### Excel Lab

- Grid trung tâm.
- Formula bar.
- Panel mục tiêu và lỗi.
- Test dữ liệu có kiểm soát.
- Kết quả: công thức đúng, định dạng đúng, lỗi tham chiếu.

### Slides

- Thumbnail rail trái.
- Canvas giữa.
- Inspector phải.
- Present mode tách khỏi edit mode.
- Hỗ trợ presenter controls, reduced motion và keyboard.

### Luồng dùng chung

`Mở bài → đọc mục tiêu → thao tác → autosave → kiểm tra → nhận phản hồi → nộp`

## 10. Giai đoạn P2/P3 — Trình chiếu và Live Quiz

### Giáo viên mở phiên

`Teacher → Live/Trình chiếu → chọn bộ câu hỏi → tạo phòng → PIN/QR → phòng chờ → bắt đầu`

### Học sinh tham gia

`Mở link/PIN → nhập tên hoặc chọn hồ sơ → xác nhận → chờ → trả lời`

### Màn hình phòng chờ

- PIN và QR lớn.
- Số người đã vào.
- Danh sách tên có kiểm soát riêng tư.
- Trạng thái kết nối.
- Nút bắt đầu chỉ dành cho giáo viên.

### Trong câu hỏi

**Màn chiếu**

- Câu hỏi, media, timer.
- Số người đã trả lời.
- Không lộ đáp án trước khi công bố.

**Thiết bị học sinh**

- Đáp án lớn, chạm dễ.
- Trạng thái đã gửi.
- Reconnect không mất lựa chọn.
- Không hiển thị bảng xếp hạng nếu lớp không bật.

### Sau câu

- Phân bố đáp án.
- Đáp án đúng và giải thích.
- Giáo viên giảng giải.
- Chuyển câu bằng nút hoặc phím.

### Release gate

- 40–50 thiết bị.
- Wi-Fi yếu.
- Refresh/reconnect.
- Android/iOS.
- Đồng hồ server.
- Chống nộp trùng và nộp sau hạn.

## 11. Giai đoạn P3 — Coding Lab, SQL, Scratch và file review

### Coding flow

`Chọn bài → editor → chạy thử → test công khai → nộp → test ẩn → điểm → phản hồi`

- Sandbox tách biệt.
- Resource quota.
- No outbound network.
- Test case versioned.
- Compile/runtime error thân thiện.
- Không trả đáp án hidden test.

### SQL

- Database fixture read-only.
- Reset giữa các lượt.
- Query timeout.
- Chặn mutation ngoài phạm vi.
- Hiển thị kết quả mẫu và giải thích.

### Scratch/HTML

- Preview sandbox.
- Rubric theo hành vi/kết quả.
- Giới hạn iframe/script.
- Giáo viên xem lại sản phẩm cùng metadata.

### File review

- Viewer PDF/Office.
- Annotation layer không sửa file gốc.
- Comment theo vị trí.
- Dấu Đúng/Sai.
- Version và trạng thái draft/published.

## 12. Giai đoạn P3 — Thư viện, blog và tài nguyên

### Library UI

- Filter theo lớp, chủ đề, loại, quyền đọc.
- Card có tiêu đề, tác giả, thời lượng/số trang, trạng thái public/locked.
- Reader có mục lục, tiến độ đọc, search.
- Video có transcript/captions.
- Tài liệu locked phải nêu điều kiện truy cập.

### Blog/resources

- Topic filter.
- Search.
- Published-only.
- Related lesson/resource.
- Empty state không dựng dữ liệu giả.
- Quyền upload/chia sẻ và quy trình kiểm duyệt.

## 13. Giai đoạn P4 — AI sư phạm

AI chỉ mở sau khi P0–P3 có dữ liệu và quyền ổn định.

### Kịch bản ưu tiên

1. AI rà lỗi cùng em.
2. Trợ giảng theo chủ đề.
3. Dạy lại cho AI.
4. AI vấn đáp.
5. Phản biện AI.
6. AI tranh biện.
7. Nhập vai.
8. An toàn số/nhận diện lừa đảo.

### UI block

- Mục tiêu học.
- Phạm vi chủ đề.
- Số lượt còn lại.
- Consent và cảnh báo dữ liệu.
- Chat/interaction.
- Rubric cuối phiên.
- Nút giáo viên xem lại.
- Nút báo lỗi hoặc kết thúc.

### Nguyên tắc

- AI không tự công bố điểm cuối nếu chưa có teacher review.
- Không gửi dữ liệu cá nhân không cần thiết.
- Chặn prompt lạc đề và prompt injection.
- Lưu audit tối thiểu, có thời hạn xóa.
- Hiển thị rõ AI có thể sai.

## 14. Giai đoạn P4 — Typing, gamification và động lực

### Typing

- Bài theo cụm phím.
- Telex tiếng Việt.
- WPM/accuracy.
- Phím yếu.
- Bài tập cá nhân hóa.
- Chế độ luyện nhanh và luyện theo lộ trình.

### Gamification

- XP, streak, badge.
- Nhiệm vụ ngày/tháng.
- Leaderboard opt-in.
- Phần thưởng không làm sai lệch mục tiêu học.
- Hạn chế hiển thị dữ liệu cá nhân.

### Không ưu tiên sớm

- Ví/hoa hồng/commerce phức tạp.
- Realtime battle.
- Hệ tiền tệ nhiều lớp.

## 15. Giai đoạn P5 — Commerce và quản trị cấp trường

### Commerce

- Product, entitlement, order, invoice, refund.
- Hiển thị giá thật đã phê duyệt.
- License/version.
- Điều khoản trước thanh toán.
- Webhook idempotent.
- Audit và hỗ trợ hoàn tiền.

### School dashboard

- Nhiều lớp/nhiều giáo viên.
- Báo cáo theo lớp/khối.
- Role matrix.
- Export theo quyền.
- Phụ huynh chỉ xem con mình.
- Retention và consent rõ.

## 16. Giai đoạn P5 — Quản lý phòng máy

Chỉ nghiên cứu sau khi lõi Teacher Studio ổn định.

### Pilot an toàn

1. Sơ đồ phòng.
2. Vị trí và trạng thái online/offline.
3. Gắn máy với lớp/ca.
4. Audit đăng ký thiết bị.

Remote monitoring/control, khóa màn hình, giới hạn web/app chỉ được làm sau đánh giá pháp lý, consent và bảo mật riêng. Không tự triển khai agent điều khiển thiết bị chỉ vì ý tưởng đã có trong tài liệu.

## 17. Design system và trạng thái bắt buộc

Mọi route phải có:

- Loading skeleton.
- Empty state.
- Error state có retry.
- Offline/reconnect state khi có realtime.
- Success feedback.
- Confirm cho destructive action.
- Keyboard focus.
- Screen reader label.
- Reduced motion.
- Responsive 360/768/1280/1920.

### Bố cục ưu tiên

- Một primary action mỗi màn hình.
- Không quá ba card summary trên mobile.
- Table chuyển thành card ở màn hình hẹp.
- Sidebar chuyển drawer/bottom nav.
- Detail dùng split view desktop, stacked view mobile.
- Breadcrumb cho route sâu.
- Không dùng placeholder để giả làm tính năng đã chạy.

## 18. Backlog đã hấp thụ từ báo cáo tham khảo

Danh mục đầy đủ 132 ý tưởng có mã từ năm nguồn được lưu tại [mục 21](#21-ngân-hàng-tính-năng-tham-khảo-từ-5-website--chỉ-lưu-ý-tưởng-07112026); mọi mục chỉ ở dạng **chờ nghiên cứu**, không phát sinh lệnh xây dựng.

### Đưa vào trước

- Review câu sai và ôn lại.
- Roadmap học theo chặng.
- Question bank và ma trận.
- Teacher flow giao bài/chấm/kết quả.
- Trình chiếu và Live Quiz.
- Coding sandbox cơ bản.
- Chấm file có annotation.
- Thư viện theo lớp/chủ đề.
- Loading/empty/error states.

### Để sau

- AI kịch bản nâng cao.
- Typing thích ứng.
- Gamification sâu.
- Nhiều trò chơi realtime.
- PowerPoint add-in.
- Commerce.
- Quản lý phòng máy.
- Parent/school analytics mở rộng.

## 19. Definition of Done chung

Một tính năng chỉ được đánh dấu DONE khi:

- Có owner và route rõ.
- Có schema/API/RLS tương ứng.
- Có loading/empty/error/success.
- Có mobile và keyboard QA.
- Có test quyền đúng/sai.
- Có audit cho thao tác nhạy cảm.
- Có xử lý retry/reconnect nếu cần.
- Có tài liệu cập nhật.
- CI/build PASS.
- Deploy READY và SHA khớp nếu phát hành.

## 20. Tài liệu nguồn

- [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md)
- [ARCHITECTURE_AND_SECURITY.md](ARCHITECTURE_AND_SECURITY.md)
- [ROADMAP cũ và lịch sử quyết định](ROADMAP.md)
- [XCN_FUNCTION_ROADMAP_CHECKLIST.md](XCN_FUNCTION_ROADMAP_CHECKLIST.md)
- [XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md](XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md)
- [DUA_EDU_DEEP_REVIEW.md](DUA_EDU_DEEP_REVIEW.md)
- [DETHISO_DEEP_REVIEW.md](DETHISO_DEEP_REVIEW.md)
- [MONTINHOC_DEEP_REVIEW.md](MONTINHOC_DEEP_REVIEW.md)
- [TINHOCBAN_DEEP_REVIEW.md](TINHOCBAN_DEEP_REVIEW.md)
- [WEBSITE_REFERENCES.md](WEBSITE_REFERENCES.md) và báo cáo VniTeach gốc lưu trong Library.

> Đây là roadmap tổng hợp. Trạng thái triển khai thực tế vẫn phải đối chiếu code, CI, Vercel và Supabase trước khi đánh dấu hoàn tất.

## 21. Ngân hàng tính năng tham khảo từ **5 website** — chỉ lưu ý tưởng (07/11/2026)

> **TRẠNG THÁI: BACKLOG / NOT STARTED — KHÔNG PHẢI LỆNH TRIỂN KHAI.** Đây là **132 hạng mục ý tưởng có mã truy vết** từ 5 báo cáo; gồm chức năng quan sát/được quảng bá ở website nguồn và phương án chuyển hóa cho Xưởng Công Nghệ. Một số hạng mục đã có một phần nền tảng trong code; việc ghi ở đây **không reset hoặc nâng trạng thái** chúng. Không tạo route/UI/API/schema, không giao task phát triển, không tick Admin Roadmap, không deploy, không cập nhật Supabase Production.

**Cách đọc:** `P2+`, `P3+`, `P4+`, `P5+` chỉ là **mốc cân nhắc sớm nhất** sau các dependency; **không phải ngày bắt đầu, mức phê duyệt hay cam kết release**. Trước mắt vẫn giữ thứ tự ưu tiên P0/P1 hiện hành ở mục 2. Cùng một năng lực xuất hiện ở nhiều website **chỉ xây một lần**, dùng chung câu hỏi, lớp, bài giao, bài nộp và học liệu. Thẻ nguồn (VN/DT/DU/MT/TC) để truy lại ý tưởng, không phải năm hệ thống độc lập.

**Điều kiện mở backlog khi được yêu cầu sau này:**

1. **Dữ liệu/quyền trước:** Admin/Teacher/Student JWT, RLS ownership, phòng chống lộ dữ liệu, backup, audit và E2E staging. Teacher Studio + question bank + assignment/submission tạo lõi dùng chung trước game/chấm/AI.
2. **Tiến độ học trước game:** học có mục tiêu → thực hành → phản hồi → theo dõi, sau đó mới XP, bảng xếp hạng, nhiệm vụ, vườn, thi đấu hoặc tiền ảo.
3. **Chỉ mở module nguy cơ cao khi có thiết kế riêng:** Word/PDF OCR và công thức phải qua bước GV xác nhận; code/SQL/Scratch/HTML chạy sandbox với quota; camera/OMR/giám sát cần consent, quyền và kiểm sai; AI cần hạn mức, bảo vệ trẻ em, giám sát giáo viên; shop/ví/hoa hồng cần pháp lý và vận hành.
4. **Không sao chép** source, thương hiệu, game art, giao diện, nội dung học liệu hoặc tuyên bố hiệu năng từ các nguồn. Chức năng quảng bá hoặc phần chưa truy cập được chỉ được ghi **tham khảo chưa xác minh**.
5. **Khi người dùng duyệt bắt đầu một mục:** mở task riêng theo ID, thiết kế luồng và owner, kiểm tra code hiện hữu tránh trùng, xác nhận scope/acceptance/security, test local/staging và cập nhật checkpoint. Production/Preview chỉ deploy khi có yêu cầu rõ.

### 21.1. VniTeach / VniTest — 20 ứng dụng đã nêu tên và cổng chung

Nguồn: Nguồn Library `NGHIEN_CUU_VNITEACH_HE_SINH_THAI_UNG_DUNG_2026-10-30.md` (20 app có tên, không suy đoán ứng dụng thứ 21) + [WEBSITE_REFERENCES.md](WEBSITE_REFERENCES.md).

| ID | Năng lực ghi nhận để nghiên cứu/phát triển độc lập | Đợt tối thiểu* |
|---|---|---|
| `VN-01` | Trung tâm công cụ giáo viên theo tác vụ; mở/hướng dẫn/điều kiện dùng, SSO đồng bộ khi an toàn | P2+ |
| `VN-02` | VniClock: đồng hồ đếm xuôi/ngược, pause/reset, toàn màn hình | P2+ |
| `VN-03` | VniMillionaire: trò hỏi đáp kiểu Ai là triệu phú, dùng chung kho câu hỏi | P4+ |
| `VN-04` | VniBoard: bảng viết/chú thích, bút/tẩy/Undo, layer tách bài giảng | P3+ |
| `VN-05` | VniForm: phiếu khảo sát, exit ticket, thu phản hồi lớp học | P3+ |
| `VN-06` | VniClass: sổ lớp/chủ nhiệm, danh sách HS, việc lớp (chi tiết cần khảo sát) | P2+ |
| `VN-07` | VniLuckyNumber: bốc số may mắn, gọi lượt | P2+ |
| `VN-08` | VniSchedule: xem lịch học/dạy; tối ưu xếp lịch trường/phòng sau | P5+ |
| `VN-09` | VniPowerPoint: tái sử dụng bộ câu hỏi trong slide/trò chơi PowerPoint | P4+ |
| `VN-10` | VniCam: phát hình camera điện thoại lên màn chiếu, consent/mã phiên | P5+ |
| `VN-11` | VniTest: nhập Word/PDF, nhận dạng câu/đáp án/ảnh/công thức; editor, trộn đề, xuất Word/ZIP, thi/chấm/thống kê; bắt buộc giáo viên kiểm duyệt | P3+ |
| `VN-12` | VniPlan: hỗ trợ giáo án gắn năng lực số, hoạt động, minh chứng; giáo viên duyệt | P4+ |
| `VN-13` | VniYouth: thi đua/công tác Đoàn/trường | P5+ |
| `VN-14` | VniLuckyWheel: quay tên, chọn nhóm/nhiệm vụ | P2+ |
| `VN-15` | VniPlickers: trả lời bằng thẻ giấy, giáo viên quét (chưa xác minh ứng dụng cụ thể) | P4+ |
| `VN-16` | VniBookmark: bộ sưu tập link/học liệu theo lớp, môn, nhãn | P3+ |
| `VN-17` | VniPuzzle: trò lật mảnh ghép kèm ảnh/câu hỏi | P4+ |
| `VN-18` | VniCrossword: ô chữ ngang/dọc ôn thuật ngữ | P4+ |
| `VN-19` | VniWordFly: ghép chữ chuyển động có reduced-motion | P4+ |
| `VN-20` | VniWordSearch: tìm từ khóa trong bảng chữ | P4+ |
| `VN-21` | VniPDF: chuyển PDF thành ảnh, giới hạn tệp và bảo mật | P3+ |

### 21.2. Đề Thi Số — soạn/giao/chấm đề, lớp học, game

Nguồn: [DETHISO_DEEP_REVIEW.md](DETHISO_DEEP_REVIEW.md).

| ID | Năng lực ghi nhận để nghiên cứu/phát triển độc lập | Đợt tối thiểu* |
|---|---|---|
| `DT-01` | Teacher Dashboard: bắt đầu nhanh, công việc hôm nay, lớp/đề gần đây | P2+ |
| `DT-02` | Luồng tạo đề từ DOCX/PDF hoặc nhập từng câu thủ công | P2+ |
| `DT-03` | Biên tập câu hỏi/đáp án, công thức, hình, bảng, kéo thả, rà soát trước lưu | P2+ |
| `DT-04` | Kho đề cá nhân: phiên bản, nháp, giao lớp, chia sẻ, trình chiếu | P2+ |
| `DT-05` | Question bank theo môn/chủ đề/độ khó, tái sử dụng | P2+ |
| `DT-06` | Ma trận đề và bản đặc tả theo môn, lớp, mức độ nhận thức | P3+ |
| `DT-07` | AI soạn đề/ma trận: consent dữ liệu, preview, giáo viên quyết định | P4+ |
| `DT-08` | Trộn câu/đáp án từ Word thành nhiều mã đề, giữ công thức/hình | P3+ |
| `DT-09` | Xuất mã đề DOCX/ZIP và đáp án tổng hợp, kiểm round-trip | P3+ |
| `DT-10` | Tạo lớp, danh sách HS, mã tham gia, giao bài và tiến độ | P2+ |
| `DT-11` | Giao đề bằng link/mã/QR, phạm vi lớp, hạn làm và quyền | P3+ |
| `DT-12` | Thi trực tuyến, đồng hồ và chấm server, công bố kết quả theo quyền | P3+ |
| `DT-13` | Thiết kế/in phiếu trắc nghiệm nhiều lựa chọn, đúng/sai, trả lời ngắn | P4+ |
| `DT-14` | OMR chấm ảnh phiếu bằng camera; kiểm ngoại lệ, duyệt người chấm, audit | P4+ |
| `DT-15` | Chấm tự luận bằng rubric, nhận xét, lịch sử sửa điểm, khóa sau công bố | P3+ |
| `DT-16` | Thống kê đề/lớp/câu, phân phối điểm, tỷ lệ hoàn thành, xu hướng | P3+ |
| `DT-17` | Trình chiếu đề TV/projector, fullscreen, phím tắt ẩn/hiện đáp án, âm thanh tùy chọn | P3+ |
| `DT-18` | PowerPoint add-in chèn câu hỏi lên slide desktop, kiểm tương thích và bản quyền | P5+ |
| `DT-19` | Thẻ QR giấy cho lớp thiếu thiết bị; quét bằng điện thoại giáo viên | P4+ |
| `DT-20` | Game Chinh phục đại dương dùng đáp án là cá | P4+ |
| `DT-21` | Game chấm điểm nhóm theo bài/đề | P4+ |
| `DT-22` | Đường đua tri thức 3D: QR, xe, tốc độ theo câu trả lời | P5+ |
| `DT-23` | Bậc thang lên mây: đội, cổng câu hỏi, luật làm lại | P5+ |
| `DT-24` | Rung chuông vàng: điện thoại/thẻ, giới hạn thời gian và luật hồi sinh | P4+ |
| `DT-25` | Vũ điệu tri thức: camera nhận dạng cử chỉ; consent/ánh sáng/thiết bị | P5+ |
| `DT-26` | Đấu trường RPG: luật, cân bằng điểm, phiên chơi (chưa kiểm chứng chi tiết) | P5+ |
| `DT-27` | Gỡ bom: game câu hỏi có thời gian/hồi phục phiên | P5+ |
| `DT-28` | Nông trại game: giữ ý tưởng, trang nguồn chưa có nội dung kiểm chứng | P5+ |
| `DT-29` | Kho giáo án/slide/bộ câu hỏi/video/đào tạo giáo viên | P4+ |
| `DT-30` | Chia sẻ đề công khai/đồng nghiệp, quyền sao chép, version | P3+ |
| `DT-31` | Thư viện đề cộng đồng: mã đề, môn, tìm kiếm, kiểm duyệt bản quyền | P4+ |
| `DT-32` | Dịch vụ tư vấn thiết kế đề/bài giảng và hỗ trợ giáo viên | P5+ |
| `DT-33` | Hồ sơ giáo viên, trường/môn, settings, export/xóa tài khoản | P3+ |
| `DT-34` | Minh bạch dữ liệu thi/chống gian lận: tab switch/time log, consent, lưu/xóa | P4+ |

### 21.3. DUA Edu / DataLab — tự học, luyện lập trình và động lực

Nguồn: [DUA_EDU_DEEP_REVIEW.md](DUA_EDU_DEEP_REVIEW.md).

| ID | Năng lực ghi nhận để nghiên cứu/phát triển độc lập | Đợt tối thiểu* |
|---|---|---|
| `DU-01` | Trang bắt đầu theo mục tiêu và nút tiếp tục học/bài thực hành | P2+ |
| `DU-02` | Danh mục môn Data Mindset, Growth Analytics, SQL, Python, Excel/Sheets, Power BI, thống kê | P3+ |
| `DU-03` | Danh sách/chi tiết khóa học, bộ lọc, yêu cầu, ghi danh, tiến độ | P2+ |
| `DU-04` | Lab Python/SQL: code editor, chạy thử, test/result, phản hồi lỗi | P3+ |
| `DU-05` | Bộ bài Python Data Analyst/visualization và SQL nâng cao | P4+ |
| `DU-06` | Dataset và case study nghề nghiệp: ngân hàng, bán lẻ, marketing, tín dụng, sản phẩm | P3+ |
| `DU-07` | Bài trước/sau, lưu bài, ghi chú, kết quả mong đợi, làm tiếp | P3+ |
| `DU-08` | Roadmap dữ liệu 8 chặng, mục tiêu, kỹ năng, bài tập, case study, tiến độ | P3+ |
| `DU-09` | Student Dashboard: lịch học, điểm danh, lịch sử và đang học dở | P2+ |
| `DU-10` | Hồ sơ: level, XP, huy hiệu, hoạt động và kỹ năng đã đạt | P4+ |
| `DU-11` | Nhiệm vụ ngày/tuần, tiến độ và nhận phần thưởng một lần | P4+ |
| `DU-12` | BXH tuần/tổng/đội/chuyên cần, quyền riêng tư opt-in | P4+ |
| `DU-13` | World map chuyển khu học/vườn/đấu trường/shop, luôn có menu truy cập trực tiếp | P5+ |
| `DU-14` | Vườn ảo, hồ cá/Koi, gieo/tưới/bón/thu hoạch/bán vật phẩm ảo | P5+ |
| `DU-15` | Đấu trường quiz phòng chung/riêng, trận ngắn tính thời gian | P5+ |
| `DU-16` | Đấu đội theo XP, luật tính trung bình, chống gian lận thưởng | P5+ |
| `DU-17` | Kho ebook/dataset/cheatsheet/hướng dẫn/phỏng vấn, lọc/tìm/quyền | P3+ |
| `DU-18` | Khóa Zoom theo đợt, giảng viên, video xem lại, đồ án thực tế | P4+ |
| `DU-19` | Chat/cộng đồng/sự kiện học tập, moderation | P5+ |
| `DU-20` | Huy hiệu và chứng chỉ theo chuẩn đầu ra | P4+ |
| `DU-21` | Shop/tiền ảo/quà, gói Free/Plus/Pro và entitlement | P5+ |
| `DU-22` | XP, streak, nhiệm vụ nhóm, động lực học không ép cạnh tranh | P4+ |

### 21.4. Môn Tin học — chương trình phổ thông, chấm thực hành và AI sư phạm

Nguồn: [MONTINHOC_DEEP_REVIEW.md](MONTINHOC_DEEP_REVIEW.md).

| ID | Năng lực ghi nhận để nghiên cứu/phát triển độc lập | Đợt tối thiểu* |
|---|---|---|
| `MT-01` | Chương trình Tin học GDPT lớp 3–12, chủ đề A–G, chuẩn đầu ra | P3+ |
| `MT-02` | Lớp mã tham gia; vai trò HS/GV/nhà trường/phụ huynh và dữ liệu đúng phạm vi | P2+ |
| `MT-03` | Giao/thu bài theo hạn, loại bài, rubric, quản lý submission | P2+ |
| `MT-04` | Trắc nghiệm, đúng/sai, trả lời ngắn, tự luận theo thang phù hợp | P2+ |
| `MT-05` | Chấm code Python/C++/Java/JavaScript theo public/hidden test | P3+ |
| `MT-06` | Chấm SQL trên database fixture cách ly và reset mỗi lượt | P3+ |
| `MT-07` | Scratch (.sb3) chạy trên web, nộp bài và đánh giá | P3+ |
| `MT-08` | HTML/CSS live preview, nộp sản phẩm web trong sandbox | P3+ |
| `MT-09` | Judge sandbox CPU/RAM/network/timeout, lỗi biên dịch, audit | P3+ |
| `MT-10` | Nộp/chấm file Word/Excel/PDF với lớp annotation giữ file gốc | P3+ |
| `MT-11` | AI gợi ý nhận xét theo rubric/test/bài làm, giáo viên duyệt/sửa/bác | P4+ |
| `MT-12` | Kho bài tập tìm/lọc theo lớp, chủ đề, ngôn ngữ, loại, khó và tác giả | P3+ |
| `MT-13` | Thư viện ebook/video theo chương trình, quyền và tiến độ đọc | P4+ |
| `MT-14` | Phân tích lớp/khối/trường, phụ huynh xem đúng con mình | P5+ |
| `MT-15` | AI phản biện: phát hiện lập luận AI cố ý sai | P4+ |
| `MT-16` | Trợ giảng AI giới hạn chủ đề do GV chọn | P4+ |
| `MT-17` | AI nhập vai khách hàng, phỏng vấn, tình huống an toàn mạng | P4+ |
| `MT-18` | AI vấn đáp cá nhân hóa theo câu trả lời, rubric cuối phiên | P4+ |
| `MT-19` | AI dấu mặt mô phỏng lừa đảo, rèn nhận diện | P4+ |
| `MT-20` | AI tranh biện, buộc giải thích bằng dẫn chứng | P4+ |
| `MT-21` | Dạy lại cho AI, nhận nhận xét về giải thích kiến thức | P4+ |
| `MT-22` | AI rà lỗi cùng em, gợi ý sửa sai không làm hộ | P4+ |
| `MT-23` | Bài tập Tin học thực tiễn, nghề nghiệp, STEM, dự án web | P3+ |
| `MT-24` | Bài kiểm tra ba phần/nhiều kiểu nộp theo môn | P3+ |
| `MT-25` | Cảnh báo chuyển tab/chống gian lận minh bạch; khiếu nại được | P4+ |
| `MT-26` | Quản trị trường, giáo viên, ngân hàng nội dung kiểm duyệt | P5+ |
| `MT-27` | Version bài nộp, lịch sử chấm/sửa điểm và export đúng quyền | P3+ |

### 21.5. Tin học cơ bản — Office, luyện thi, typing, tiện ích

Nguồn: [TINHOCBAN_DEEP_REVIEW.md](TINHOCBAN_DEEP_REVIEW.md).

| ID | Năng lực ghi nhận để nghiên cứu/phát triển độc lập | Đợt tối thiểu* |
|---|---|---|
| `TC-01` | Lộ trình máy tính cơ bản → Office → an toàn số/chứng chỉ | P2+ |
| `TC-02` | Luyện IC3/MOS, đánh giá kỹ năng theo cấp độ | P3+ |
| `TC-03` | Quiz theo chủ đề/độ khó, bộ 10/20/30/50 câu, thi thử | P2+ |
| `TC-04` | Ôn câu sai/câu ghim/câu khó, lịch sử làm bài | P2+ |
| `TC-05` | Thi quiz 1v1, luật phiên và chống gian lận | P4+ |
| `TC-06` | Video bài học về máy tính, Word, Excel, PowerPoint, an toàn số, Scratch | P3+ |
| `TC-07` | Gõ 10 ngón với 30 bài theo cụm phím, Telex tiếng Việt | P3+ |
| `TC-08` | WPM/accuracy/phím yếu, bài luyện thích ứng/AI khi đủ điều kiện | P4+ |
| `TC-09` | Game luyện gõ, đấu gõ 1v1, skin bàn phím | P4+ |
| `TC-10` | Nhiệm vụ ngày/tháng, mục tiêu, thời hạn và thưởng | P4+ |
| `TC-11` | XP, streak, badges, bảng xếp hạng và ruby/điểm ảo | P4+ |
| `TC-12` | Kiểm tra bàn phím, mã phím, hướng dẫn lỗi phím | P3+ |
| `TC-13` | Kiểm tra/luyện chuột, click/kéo/thả | P3+ |
| `TC-14` | Kiểm tra màn hình, điểm chết và hướng dẫn giới hạn kết quả | P3+ |
| `TC-15` | Thư viện phím tắt, hướng dẫn bàn phím đầy đủ | P3+ |
| `TC-16` | Symbols Guide/ký tự đặc biệt | P3+ |
| `TC-17` | OMR scanner (liên kết công cụ chấm phiếu) | P4+ |
| `TC-18` | Tiện ích Excel có phiên bản/giấy phép rõ | P3+ |
| `TC-19` | Blog Windows: driver, cài/gỡ app, PIN/mật khẩu, khóa máy, Find My Device | P3+ |
| `TC-20` | Bài học browser, Google/Microsoft/cloud, máy in, cài Windows, chọn thiết bị | P3+ |
| `TC-21` | Tiếng Anh từ vựng/cụm từ A1–C1 và thuật ngữ CNTT | P5+ |
| `TC-22` | Nghe, gõ, quiz, sắp xếp câu, TTS, trạng thái đã học/ôn cách quãng | P5+ |
| `TC-23` | Hồ sơ tiến độ, kết quả thi, typing, streak và huy hiệu | P3+ |
| `TC-24` | Cửa hàng học liệu/tiện ích Excel/Scratch/tài nguyên số theo quyền | P5+ |
| `TC-25` | Ví Ruby, giới thiệu, hoa hồng/đại lý, lịch sử ví (cần pháp lý) | P5+ |
| `TC-26` | Liên hệ/hỗ trợ đa chủ đề và báo lỗi có trạng thái xử lý | P3+ |
| `TC-27` | Điều khoản, bảo mật, giá/thanh toán, chấm dứt/hoàn tiền, khiếu nại | P5+ |
| `TC-28` | Tài liệu tải xuống theo miễn phí/giới hạn và quyền sử dụng | P3+ |

**Chốt phạm vi:** 21 ý tưởng VniTeach, 34 Đề Thi Số, 22 DUA Edu, 27 Môn Tin học, 28 Tin học cơ bản = **132 hạng mục**. Các nhóm **có ý tưởng trùng nhau** (question bank, Live Quiz, camera OMR, lớp, kho tài liệu, XP) phải được hợp nhất vào một thiết kế duy nhất khi triển khai; không tính 132 ý tưởng là 132 app hoặc 132 đầu việc phải làm ngay. Tình trạng kế hoạch hiện hành ở mục 2–19 không đổi.


### 2026-11-10 — P1 Public Website: Full Homepage Redesign

- **CODE READY (nhánh QA):** Trang chủ `/` mới theo Digital Learning Workshop, Hero → bốn lối vào → Labs → cách học → khóa học → catalog → giáo viên → FAQ → CTA.
- **GIỮ NGUYÊN:** Header/Footer công khai, workspace Student/Admin, Word Lab, Slides, Auth/RLS, Supabase Production, Admin Roadmap.
- **REGRESSION:** Bổ sung `tests/public-homepage-workshop.test.mjs` kiểm cấu trúc, route, trạng thái và CSS responsive; release chỉ DONE sau Next build và xác minh deployment theo SHA.

### 2026-11-11 — P1 Public Home: Presentation polish
- **Phạm vi:** điều chỉnh microcopy/SEO và catalog trang chủ theo giọng sản phẩm nhất quán; xóa trạng thái release khỏi UI công khai; cập nhật CSS category và test.
- **Không mở rộng năng lực:** Word Lab, Slides, Quiz, Auth, Teacher, Admin và Supabase giữ nguyên; các chức năng chưa nghiệm thu không được cấp URL giả.
- **GATE:** nghiệm thu `pnpm test`, `pnpm typecheck`, `pnpm build`, Chromium public QA trước khi hợp nhất. Không tự triển khai Vercel cho yêu cầu thay đổi nội dung này.
