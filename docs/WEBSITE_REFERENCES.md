# Website tham khảo, ý tưởng sản phẩm và tên miền ứng dụng — Xưởng Công Nghệ

> Ngày ghi nhận: 30/10/2026 · cập nhật sau bổ sung DUA Edu & Môn Tin học  
> Trạng thái: **TÀI LIỆU THAM KHẢO / Ý TƯỞNG — CHƯA PHÊ DUYỆT TRIỂN KHAI DNS**  
> Dự án: HuuNghia Studio / Xưởng Công Nghệ  
> Mục tiêu: lưu lại các trang đã được đưa vào cuộc trao đổi hoặc đã ghi rõ trong tài liệu dự án; có thể đối chiếu lại mà không phải nghiên cứu từ đầu.
>
> **Giới hạn truy vết:** Không có bản ghi toàn văn của mọi cuộc hội thoại cũ để chứng minh tất cả website người dùng từng gửi. Chỉ đưa vào danh sách xác nhận được từ hội thoại hiện có và mã/tài liệu repository. Không tự đoán địa chỉ cho những trang từng nhắc mà chưa xác định được URL.

## 1. Danh mục website tham khảo

| Mã | Trang / đường dẫn | Căn cứ đã ghi nhận | Vai trò tham khảo | Trạng thái |
| --- | --- | --- | --- | --- |
| REF-01 | [VniTeach — danh mục ứng dụng](https://vniteach.net/apps) | **Link người dùng gửi trực tiếp ngày 30/10/2026**; đã có bản nghiên cứu chi tiết trước đó | Hệ sinh thái nhiều ứng dụng dạy học, dùng chung cổng công cụ và định danh thương hiệu | Xác nhận link đã gửi; nội dung /apps chưa đọc trực tiếp đầy đủ |
| REF-02 | [VniTeach — trang giới thiệu](https://www.vniteach.net/) | Nguồn công khai dùng để đối chiếu REF-01 | Tên và nhóm ứng dụng, cổng tập trung | Đã khảo sát dữ liệu công khai; từng tính năng chưa kiểm thử sau đăng nhập |
| REF-03 | [VniTest — giới thiệu](https://www.vniteach.com/vnitest/) | Nguồn bổ sung để phân tích VniTeach | Nhập Word/PDF, trộn đề, ngân hàng câu hỏi, AI hỗ trợ soạn | Mô tả từ nhà cung cấp, chưa kiểm thử phần mềm |
| REF-04 | [Đề Thi Số](https://dethiso.vn/) | Đã được dùng và lưu làm tham khảo trong docs/ROADMAP.md và docs/XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md | Thi trực tuyến, giao bài, đánh giá, trò chơi Live Quiz | Xác nhận có trong tài liệu dự án; không có bằng chứng độc lập về mọi chức năng đã quảng bá |
| REF-05 | [DUA Edu / DataLab](https://duaedu.net/) | **Người dùng gửi trực tiếp 30/10/2026**, link có fbclid đã chuẩn hóa về URL gốc | Học dữ liệu theo lộ trình, lab Python/SQL trên web, tài nguyên và ghi danh khóa | Đã đọc trang công khai; chưa thử sau đăng nhập |
| REF-06 | [Môn Tin học](https://montinhoc.vn/) | **Người dùng gửi trực tiếp 30/10/2026**; trước đó AGENTS.md từng nhắc là trang mood tham khảo | Hệ thống dạy Tin học lớp 3–12: giao bài, chấm code, Scratch, HTML/CSS, phân quyền | Đã đọc trang công khai; chưa thử chấm code, AI/RLS sau đăng nhập |

**Không tính là website người dùng đã gửi:** GitHub, Vercel, Supabase, tài liệu Microsoft và những trang chỉ xuất hiện do tab trình duyệt đang mở hoặc kết quả tìm kiếm. Chúng thuộc nguồn kỹ thuật hoặc nguồn duyệt web, không phải bằng chứng người dùng chủ động gửi link tham khảo.

### REF-01 đến REF-03 — VniTeach

- URL gốc người dùng gửi: https://vniteach.net/apps
- Trang giới thiệu đã dùng để đối chiếu: https://www.vniteach.net/
- Bài tham khảo VniTest: https://www.vniteach.com/vnitest/
- Bản nghiên cứu đầy đủ đã có: NGHIEN_CUU_VNITEACH_HE_SINH_THAI_UNG_DUNG_2026-10-30.md (lưu riêng trong Library; không đồng nghĩa đã thêm toàn bộ nội dung vào GitHub).
- Danh mục công khai được ghi nhận: VniClock, VniMillionaire, VniBoard, VniForm, VniClass, VniLuckyNumber, VniSchedule, VniPowerPoint, VniCam, VniTest, VniPlan, VniYouth, VniLuckyWheel, VniPlickers, VniBookmark, VniPuzzle, VniCrossword, VniWordFly, VniWordSearch và VniPDF.
- Điểm đáng nghiên cứu: một cổng mở ứng dụng; các công cụ nhỏ dùng ngay trong giờ học; nhóm quản lý lớp/soạn bài/đánh giá; tên ứng dụng riêng và khả năng mở rộng thành hệ sinh thái.
- Hướng áp dụng độc lập: Teacher Toolbox (đồng hồ, bốc chọn ngẫu nhiên, bảng chú thích); hoạt động ô chữ/trò chơi dùng chung kho câu hỏi; Teacher Studio dùng chung lớp và tài nguyên.
- Chưa xác minh: kiến trúc domain/DNS thực tế của từng ứng dụng, cơ chế SSO, quyền truy cập các gói, chức năng sau đăng nhập, dữ liệu đồng bộ. Không coi mô tả quảng bá là kiểm thử sản phẩm.
- Phân biệt: **quy ước subdomain dưới đây là đề xuất của Xưởng Công Nghệ theo ý tưởng người dùng**, không khẳng định VniTeach hiện vận hành đúng cùng cấu hình.

### REF-04 — Đề Thi Số

- Trang chủ: https://dethiso.vn/
- Tài liệu: https://dethiso.vn/docs
- Đọc về tạo đề Word: https://dethiso.vn/docs/tao-de-thi/tao-de-tu-word
- Luồng giao bài cho lớp: https://dethiso.vn/docs/thi-online/giao-bai-cho-lop
- Luồng đấu trường hai đội: https://dethiso.vn/docs/dau-truong/tao-dau-truong-2-doi
- Quản lý lớp: https://dethiso.vn/docs/quan-ly-lop
- Mô tả công khai nổi bật: đưa đề Word vào hệ thống, giao bài qua link/mã/QR, chấm điểm và phân tích, phiên quiz trên điện thoại, các chế độ thi đấu và trò chơi.
- Hướng áp dụng độc lập: một ngân hàng câu hỏi dùng cho bài luyện, đề thi và Live Quiz; giáo viên tạo phòng, học sinh vào bằng PIN hoặc QR, giáo viên điều khiển công bố đáp án; thống kê và báo cáo theo lớp/câu hỏi.
- Giới hạn: không sao chép giao diện, nội dung, game art, mã nguồn hay khẳng định năng lực chịu tải/độ chính xác AI nếu chưa có kiểm thử.
- Tài liệu dự án có liên quan: docs/ROADMAP.md; docs/XUONG_CONG_NGHE_MASTER_PLAN_2026_2028.md.

### REF-05 — DUA Edu / DataLab

- **Người dùng cung cấp:** https://duaedu.net/ (link được gửi có tham số theo dõi fbclid; chỉ lưu URL chuẩn, không lưu tracking).
- Các trang công khai đã khảo sát: https://duaedu.net/ · https://duaedu.net/resources · https://duaedu.net/courses · https://duaedu.net/theory/da101.
- **Quan sát trên website:** lộ trình kiến thức SQL/Python/thống kê; thực hành code/dataset trong trình duyệt; tài nguyên sách, cheatsheet, dataset có tìm kiếm và phân loại; khóa học theo đợt và khả năng ghi danh; phân tầng miễn phí hoặc cần xét duyệt; tiếp tục bài đang học.
- **Ý tưởng cho Xưởng Công Nghệ:** một lesson có tab `Học` / `Thử ngay` / `Tự kiểm tra`; dataset mẫu và kết quả có thể tái sử dụng ở Python/SQL/Excel Lab; danh mục tài liệu gắn với bài học; tracking tiến độ theo công việc thay vì chỉ số buổi.
- **Cần kiểm thử:** hành vi chạy code thật, môi trường sandbox, giới hạn tài nguyên, session, quyền lớp, trạng thái autosave, thanh toán sau login. Không suy ra từ giao diện giới thiệu.
- Nguồn kiểm tra 30/10/2026: https://duaedu.net/ · https://duaedu.net/resources · https://duaedu.net/courses.

### REF-06 — Môn Tin học

- **Người dùng cung cấp:** https://montinhoc.vn/ (ngày 30/10/2026).
- **Quan sát công khai:** phạm vi GDPT lớp 3–12; giáo viên đăng nhập Google, học sinh dùng mã lớp; chấm code nhiều ngôn ngữ theo test cases; bài Scratch .sb3 chạy web; HTML/CSS preview; chấm/ghi chú trực tiếp Word/Excel/PDF; kiểm tra ba phần; thư viện ebook/video; các kịch bản AI học tập có rubric và giáo viên duyệt.
- **Ý tưởng cho Xưởng Công Nghệ:** Teacher Studio quản lý lớp mã mời; Coding Lab Python/SQL và preview HTML/CSS có runner cách ly; Word/Excel Lab gắn rubric và bài nộp; chấm file có chú thích; AI gợi mở không làm hộ; bảng điều khiển của giáo viên theo câu/lớp.
- **Hạn chế triển khai:** chạy mã người học chỉ trong sandbox được cách ly, tài nguyên/timeout chặt, không bao giờ chạy trực tiếp trong Next.js server/DB; quyền bài làm chỉ qua RLS; AI cần bảo vệ dữ liệu học sinh và giới hạn chi phí.
- **Trạng thái:** thông tin mô tả trên trang chủ, **không phải xác nhận kỹ thuật chấm bài, chống gian lận hoặc chất lượng AI trong điều kiện thực tế**.
- Nguồn kiểm tra 30/10/2026: https://montinhoc.vn/.

### Liên hệ mô hình Tin học được nhắc trước đây

- Người dùng từng hỏi “trước đây tôi gửi một trang web tinhoc gì đó phải ko”; ở thời điểm đó chưa phục hồi được URL.
- Ngày 30/10/2026 người dùng **đã cung cấp trực tiếp montinhoc.vn**, vì vậy website này được ghi là nguồn tham khảo đã xác thực. Không khẳng định chắc đó là cùng đường dẫn trong cuộc trò chuyện xa hơn nếu thiếu log.

## 2. Định hướng đặt tên phần mềm: tenungdung.xuongcongnghe.net

**Ý tưởng do người dùng nêu ngày 30/10/2026:** Mỗi ứng dụng có một subdomain mang tên phần mềm, với cấu trúc:

    abc.xuongcongnghe.net

Trong đó abc là tên ngắn của ứng dụng. Tên miền gốc là cổng hệ sinh thái; ứng dụng được mở trực tiếp bằng địa chỉ dễ nhớ, không phải chui qua nhiều cấp đường dẫn.

### Bảng quy hoạch đề xuất (chưa tạo DNS)

| Thành phần | Địa chỉ đề xuất | Mục đích | Ưu tiên |
| --- | --- | --- | --- |
| Cổng chính | https://xuongcongnghe.net | Trang chủ, giới thiệu, điều hướng hệ sinh thái | P0 — nghiên cứu quyền sở hữu/domain |
| Cổng ứng dụng | https://apps.xuongcongnghe.net | Danh bạ phần mềm, tìm kiếm theo tác vụ, trạng thái | P1 |
| Word Lab | https://word.xuongcongnghe.net | Thực hành và mô phỏng Word | P1 — đã có công cụ ở route hiện tại |
| Trình chiếu | https://slides.xuongcongnghe.net | Trình chiếu bài giảng, tương tác | P1 — đã có hệ trình chiếu |
| Quiz | https://quiz.xuongcongnghe.net | Bài luyện, kiểm tra, Live Quiz | P1/P2 tùy nghiệm thu phần hiện có |
| Teacher Studio | https://studio.xuongcongnghe.net | Lớp học, ngân hàng câu hỏi, bài giảng và giao bài | P2 — chưa hoàn chỉnh |
| Excel Lab | https://excel.xuongcongnghe.net | Luyện tập Excel tương tác | P2 |
| Công cụ nhanh | https://tools.xuongcongnghe.net | Đồng hồ, gọi tên, vòng quay, bảng viết | P2 |
| Học viên | https://learn.xuongcongnghe.net | Student Hub và bài học | P2 |

**Tên miền trên chỉ là mẫu quy hoạch**, chưa xác minh quyền sở hữu xuongcongnghe.net và chưa xác nhận bản ghi DNS tồn tại. Trang hiện vận hành theo tên miền Vercel riêng; không tự ý đổi URL canonical/redirect khi chưa lập kế hoạch di chuyển.

**Quy tắc đặt tên:** chữ thường không dấu, ngắn, dễ gõ và thống nhất; ví dụ word, slides, quiz. Tránh nhiều tên cùng chỉ một chức năng, tránh chữ quá dài hoặc chứa thương hiệu bên thứ ba. Chừa khoảng cho mở rộng nhưng không đăng ký hàng loạt ứng dụng chưa có.

## 3. Hai phương án hạ tầng trên Vercel

### Phương án A — Subdomain tường minh, triển khai dần (ưu tiên thí điểm)

- Khi đã sở hữu và kiểm soát tên miền, thêm từng subdomain vào Vercel Project → Settings → Domains.
- Cấu hình CNAME ở nhà cung cấp DNS theo **giá trị Vercel báo chính thức cho từng project**; không hardcode CNAME dùng chung khi dashboard yêu cầu khác.
- Mỗi ứng dụng có thể là một Vercel project độc lập (deploy/rollback riêng) hoặc dùng một Next.js project gắn nhiều host và phân luồng theo hostname.
- Ưu điểm: không cần chuyển toàn bộ nameserver chỉ để thử 2–3 ứng dụng; tách phạm vi lỗi, ít xáo trộn Production.
- Đề xuất thí điểm sau khi Auth ổn định: Word Lab và Trình chiếu trước, giữ route cũ hoạt động; chỉ chuyển link chính thức sau QA và kế hoạch redirect.

### Phương án B — Wildcard cho nhiều ứng dụng

- Khai báo *.xuongcongnghe.net trên Vercel và định tuyến theo host nếu nhiều ứng dụng đi qua cùng một project.
- **Theo tài liệu Vercel được kiểm tra ngày 30/10/2026, wildcard domain yêu cầu phương thức Vercel nameservers** để cấp/đổi chứng chỉ wildcard bằng DNS verification.
- Trước khi đổi nameserver cần kiểm kê toàn bộ A, AAAA, CNAME, MX, TXT (SPF/DKIM/DMARC) và record của dịch vụ khác để không làm gián đoạn email, website, xác minh miền.
- Wildcard thuận tiện khi danh mục ứng dụng rất lớn hoặc có ứng dụng động, nhưng không nên triển khai ngay chỉ vì có ý tưởng tên miền đẹp.

Nguồn kỹ thuật:
- https://vercel.com/docs/domains/working-with-domains
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://vercel.com/docs/domains/working-with-ssl
- https://vercel.com/docs/domains/working-with-nameservers

## 4. Đăng nhập dùng chung giữa các subdomain: phải thiết kế và kiểm thử

- Xưởng Công Nghệ hiện dùng Supabase Auth/SSR. **Dùng chung cơ sở dữ liệu Auth không có nghĩa các subdomain đã tự dùng chung phiên đăng nhập.**
- Cookie mặc định có thể bị giới hạn ở hostname đã đăng nhập. Nếu muốn mở Word Lab, Quiz, Teacher Studio mà không phải đăng nhập lại, cần lựa chọn chiến lược phiên an toàn (đăng nhập trung tâm và callback, hoặc cookie với domain phù hợp) và kiểm tra CSRF, SameSite, Secure, HttpOnly, quyền của từng ứng dụng, session refresh và sign-out trên toàn hệ sinh thái.
- Không tự chia sẻ access token qua query string hoặc localStorage giữa các website.
- Mọi API và RLS vẫn kiểm tra quyền theo người dùng; chỉ nhìn subdomain hoặc nhãn frontend không phải kiểm soát quyền.
- Khi thêm hostname/callback, xem lại Supabase Auth redirect allowlist và OAuth provider; kiểm thử desktop/mobile, môi trường preview, localhost, cookie/session, logout và truy cập trái phép.
- Chỉ triển khai SSO sau khi kiểm thử được Admin và Student thực tế. Không thay đổi production Auth trong tài liệu này.

Nguồn tham khảo:
- https://supabase.com/docs/guides/auth/server-side
- https://supabase.com/docs/guides/auth/redirect-urls

## 5. Nguyên tắc hệ sinh thái sản phẩm

1. Cổng chính là nơi giới thiệu và điều hướng; Apps là danh bạ phần mềm theo nhóm nhu cầu.
2. Mỗi ứng dụng có tên, URL, mô tả tác vụ, trạng thái (đang dùng/thử nghiệm/sắp ra mắt), nút mở và hướng dẫn.
3. Dùng chung tài khoản, lớp học, học liệu và kho câu hỏi **khi đã xác minh quyền truy cập và phân tách dữ liệu**.
4. Nội dung tạo một lần tái sử dụng trong nhiều công cụ (quiz → slides → games → assignments).
5. Công cụ dùng tức thời có thể cho khách truy cập không cần tài khoản; tính năng ghi kết quả phải có cơ chế phân quyền.
6. Thiết kế UI nhất quán nhận diện nhưng phù hợp hành vi từng phần mềm; không sao chép VniTeach/Đề Thi Số.
7. Giữ đường dẫn cũ cho đến khi có migration plan, SEO canonical, sitemap, analytics và kiểm thử liên kết chia sẻ.
8. Chưa coi tên miền phụ, ứng dụng hoặc SSO là đã triển khai chỉ vì chúng xuất hiện trong tài liệu.

## 6. Backlog liên hệ Roadmap hiện tại

| Mức | Việc cần làm | Điều kiện |
| --- | --- | --- |
| P0 | Hoàn tất kiểm thử Auth/Admin/Student và Roadmap sync thực tế | Bảo đảm nền tảng không mất dữ liệu, không lẫn vai trò |
| P1 | Khảo sát sở hữu xuongcongnghe.net và DNS hiện tại, chọn subdomain thí điểm | Không ảnh hưởng email/Production |
| P1 | Thiết kế trang danh bạ ứng dụng và quy tắc tên | Chỉ thiết kế/PR, không thay toàn bộ sitemap |
| P1 | Thí điểm địa chỉ riêng cho một ứng dụng có sẵn (Word hoặc Slides) | Qua QA, cookie, redirect, HTTPS |
| P2 | Teacher Toolbox: đồng hồ, vòng quay, bảng tương tác | Sau khi hệ công cụ sẵn có ổn định |
| P2 | Teacher Studio và dùng chung dữ liệu lớp/bài giảng/câu hỏi | Có staging/RLS theo vai trò |
| P3 | Bộ trò chơi ô chữ/ghép chữ, AI soạn đề, import Word/PDF chuyên sâu | Sau khi câu hỏi/đề/quiz có schema và kiểm thử |

## 7. Cách cập nhật sổ tay khi người dùng gửi website mới

Mỗi lần có URL mới, thêm một REF mới với:
- Ngày người dùng gửi, URL gốc, URL chuyển hướng (nếu có), tên website và nhóm.
- Tính năng **đã trực tiếp kiểm tra** versus **nhà cung cấp mô tả** versus **ý tưởng cho Xưởng Công Nghệ**.
- Điểm mạnh về UX, thiết kế điều hướng, cấu trúc tài khoản/subdomain, dữ liệu, quyền, mô hình doanh thu (nếu quan sát được).
- Mức ưu tiên P0–P3; module Xưởng Công Nghệ liên quan; ràng buộc bản quyền và kỹ thuật.
- Nguồn được dẫn, ngày khảo sát, phần chưa truy cập được.
- Nếu chưa chắc từng được người dùng gửi thì gắn trạng thái “nguồn tìm thấy trong tài liệu”, không tự xưng là link người dùng đã gửi.

## 8. Kết luận

Tài liệu đã ghi bốn website chính: VniTeach, Đề Thi Số, DUA Edu/DataLab và Môn Tin học. DUA Edu và Môn Tin học là hai liên kết người dùng cung cấp thêm ngày 30/10/2026; chức năng sau đăng nhập chỉ được xem là chưa xác minh. Định hướng **tenungdung.xuongcongnghe.net** đã được lưu như nguyên tắc thiết kế đề xuất, chưa triển khai DNS/Vercel/Auth; sử dụng chính sổ tay này làm danh sách tham khảo cập nhật cho các đợt nghiên cứu kế tiếp.

## 9. Bản tổng hợp chức năng đưa vào Navbar — 31/10/2026

**Bốn nguồn sản phẩm chính** được gom vào một hệ sinh thái Xưởng Công Nghệ theo mục đích người dùng, không sao chép y nguyên navigation/menu của nguồn:

| Trang đã tham khảo | Nhóm tính năng tham khảo | Nhóm Navbar Xưởng Công Nghệ đề xuất |
| --- | --- | --- |
| [VniTeach](https://vniteach.net/apps) | Nhiều tiện ích giáo viên, bảng viết, đồng hồ, bốc chọn, thời khóa biểu, lớp học, thi và trò chơi | Công cụ, Kiểm tra, Giáo viên |
| [Đề Thi Số](https://dethiso.vn/) | Soạn đề/ma trận, nhập Word, ngân hàng câu hỏi, giao đề, tự chấm, quiz trực tiếp, game ôn tập | Kiểm tra, Giáo viên, Tài nguyên |
| [DUA Edu / DataLab](https://duaedu.net/) | Khóa học và lộ trình SQL/Python/data, thực hành, dataset, sách/cheatsheet, đồ án | Khóa học, Thực hành, Tài nguyên, Dự án |
| [Môn Tin học](https://montinhoc.vn/) | Tin học theo lớp/môn, Scratch, Python/HTML/CSS, chấm bài thực hành, lớp học, học liệu và hỗ trợ giáo viên | Khóa học, Thực hành, Giáo viên, Tài nguyên |

**Đề xuất 7 mục cấp một:** `Khóa học · Thực hành · Kiểm tra · Công cụ · Tài nguyên · Dự án · Giáo viên`; logo là Trang chủ, tài khoản bên phải. Danh sách submenu, đường dẫn hiện có và trạng thái tương lai: [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md#2a-đề-xuất-điều-hướng-công-khai-theo-4-nguồn-tham-khảo--31102026).

### Nguồn bổ sung của ý tưởng quản lý phòng máy: NetSupport School

- **Người dùng đề xuất:** “công cụ quản lý phòng máy giống net sp”, ngày 31/10/2026. Cụm “net sp” **chưa được xác nhận chính tả/tên sản phẩm**; tạm tham chiếu [NetSupport School](https://www.netsupportschool.com/feature-focus/) (nhà sản xuất) như một ví dụ gần đúng, không đồng nhất với bốn website nghiên cứu sản phẩm phía trên.
- **Chức năng nêu trên nguồn chính thức:** kết nối lớp theo phòng/danh sách máy, sắp xếp thumbnail máy theo bàn học, bảng trắng chia sẻ, chia sẻ màn hình giáo viên, chọn máy xem/hỗ trợ, kiểm soát trang web được phép, phát/thu tài liệu, khảo sát và phản hồi học sinh. Tài liệu nguồn: https://www.netsupportschool.com/feature-focus/ và https://www.netsupportschool.com/.
- **Đề xuất độc lập cho Xưởng Công Nghệ:** công cụ LAB-MANAGER thuộc nhóm **Công cụ**, nhưng console điều hành thuộc workspace **Giáo viên** hoặc kỹ thuật viên; trước mắt nghiên cứu sơ đồ phòng, gắn danh sách máy và trạng thái, chưa tạo UI hay remote agent. Backlog: [ROADMAP.md](ROADMAP.md#backlog--điều-hướng-sản-phẩm-và-quản-lý-phòng-máy-chỉ-ý-tưởng-31102026).
- **Hạn chế cốt lõi:** website Next.js không tự điều khiển màn hình hay hệ điều hành của máy trạm; phần remote viewing/control cần agent cài trên thiết bị, xác thực chặt, mạng phù hợp, thông báo/đồng ý và chính sách bảo vệ trẻ em, audit và quyền theo phòng. Không thử truy cập camera/microphone hoặc màn hình âm thầm; không công khai agent/API điều khiển Internet khi chưa thẩm định.
- **Trạng thái:** **CHỈ Ý TƯỞNG, P3**; không phải module đã có hoặc tính năng đã được duyệt triển khai. Không thay đổi menu, URL, DNS hay Supabase.
