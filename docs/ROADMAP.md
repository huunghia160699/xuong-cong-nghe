# Roadmap tổng thể — Xưởng Công Nghệ

> **Trạng thái:** CURRENT / kế hoạch hợp nhất  
> **Ngày cập nhật:** 07/11/2026  
> **Nguồn chính:** tiến độ repository, kiểm toán hệ thống, Master Plan, checklist chức năng và bốn báo cáo tham khảo sản phẩm.  
> **Nguyên tắc:** báo cáo tham khảo chỉ cung cấp ý tưởng; không sao chép giao diện, nội dung hoặc mã nguồn. Mục chưa có bằng chứng code/test/deploy được xem là **CHƯA TRIỂN KHAI**.

## 1. Tầm nhìn sản phẩm

Xưởng Công Nghệ là nền tảng học công nghệ theo chu trình:

`khám phá → học có hướng dẫn → thực hành → kiểm tra → nhận phản hồi → lưu tiến bộ → giáo viên theo dõi`

Bốn báo cáo tham khảo bổ sung bốn năng lực:

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

> Đây là roadmap tổng hợp. Trạng thái triển khai thực tế vẫn phải đối chiếu code, CI, Vercel và Supabase trước khi đánh dấu hoàn tất.
