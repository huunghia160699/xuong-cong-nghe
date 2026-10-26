# Xưởng Công Nghệ — Master Plan 2026–2028 (đề xuất v2.0)

> Ngày lập: 2026-10-26 · Trạng thái: **ĐỀ XUẤT CHỜ DUYỆT**, không phải các tính năng đã triển khai.  
> Tài liệu này bổ sung cho `docs/ROADMAP.md`, không thay thế lịch sử công việc trong `docs/WORKLOG_AND_RULES.md`.
> Tham khảo mô hình sản phẩm từ tài liệu công khai của https://dethiso.vn, KHÔNG sao chép giao diện, nội dung hoặc mã nguồn của bên thứ ba.

## 1. Quyết định chiến lược

**Tầm nhìn:** Xưởng Công Nghệ là hệ sinh thái số cho việc **chuẩn bị bài – dạy học – tương tác – giao bài – đánh giá – thực hành – phân tích – cải thiện** trên một nền tảng thống nhất.

**Khác biệt cần giữ:** không chỉ là công cụ tạo đề. Sản phẩm có bộ mô phỏng Word/Excel, bài học Tin học, hệ trình chiếu, thư viện học liệu và môi trường tương tác thực hành. Phát triển năng lực đa môn, nhưng **đi vào thị trường bằng Tin học và năng lực số** trước để bảo đảm chất lượng.

**Nguyên tắc ưu tiên:**
1. Một tài nguyên (câu hỏi, bài học, slide) tạo một lần, dùng ở nhiều ngữ cảnh.
2. Bắt đầu từ nhu cầu một giáo viên đứng lớp, một lớp 40–50 học sinh; mở rộng trường học ở giai đoạn sau.
3. Điện thoại học sinh dùng để nhập mã phòng và trả lời; KHÔNG đưa quét thẻ giấy/Plickers vào phiên bản đầu.
4. Giáo viên kiểm soát công bố đáp án. Bài làm và điểm có bản ghi đáng tin cậy ở máy chủ.
5. Có trải nghiệm khách phù hợp cho buổi học; kết quả chính thức, giao bài dài hạn và hồ sơ tiến bộ gắn với danh tính học sinh đã xác thực.
6. Xây lõi nghiệp vụ vững trước các hiệu ứng game, marketplace hay tích hợp AI hàng loạt.
7. Mỗi giai đoạn phải có tiêu chuẩn hoàn thành và kiểm thử với người dùng thật; không đánh dấu "xong" chỉ vì có UI.

## 2. Đối chiếu tham khảo dethiso.vn

**Đã có mô tả công khai:** tạo đề từ Word, soạn đề, chấm tự động, giao bằng link/mã/lớp, ngân hàng câu hỏi, lớp học, biểu đồ kết quả, đấu trường trực tiếp và OMR. Trang chủ còn giới thiệu các trò chơi RPG, Gỡ bom, Nông trại.  
**Giới hạn nghiên cứu:** URL `/teacher/dashboard` không truy cập được từ nguồn web công khai; các cấu phần dashboard và hành vi sau đăng nhập chưa được xác thực trực tiếp. Các con số hiệu suất/giới hạn do website tự công bố không được coi là chuẩn nghiệm thu của Xưởng Công Nghệ.

| Nhóm | Tham khảo từ Đề Thi Số | Cách áp dụng ở Xưởng Công Nghệ |
| --- | --- | --- |
| Giáo viên | Dashboard và luồng ra đề → giao bài → báo cáo | Trung tâm điều khiển kết hợp lớp, bài giảng, thực hành, bài tập và đề kiểm tra |
| Học liệu | Word import, đề, ngân hàng câu hỏi | Học liệu đa dạng: slide, chủ đề Tin học, Word/Excel Lab, tài liệu, câu hỏi |
| Lớp | Import danh sách, giao cho lớp | Sổ lớp, học sinh, nhóm, bài được giao, tiến độ và lịch sử |
| Tương tác | PIN phòng, HS trả lời trên điện thoại | Live Quiz giáo viên điều khiển, trình chiếu, thống kê tức thời và reconnect |
| Chấm bài | Trắc nghiệm/tự luận/OMR | Chấm máy chủ, quy tắc phiên bản và giải thích; OMR là tùy chọn giai đoạn sau |
| Trò chơi | Đấu trường, RPG, nhiều mode | Một engine câu hỏi và một score engine dùng lại, rồi mở từng mode |
| Phân tích | Điểm, tỷ lệ đúng, xuất dữ liệu | Phân tích theo câu, chuẩn năng lực, lớp, bài học, tiến bộ và gợi ý dạy lại |

Tài liệu tham khảo:
- https://dethiso.vn/
- https://dethiso.vn/docs
- https://dethiso.vn/docs/tao-de-thi/tao-de-tu-word
- https://dethiso.vn/docs/thi-online/giao-bai-cho-lop
- https://dethiso.vn/docs/dau-truong/tao-dau-truong-2-doi
- https://dethiso.vn/docs/quan-ly-lop

## 3. Kiểm kê thực tế hiện có (theo repository, chưa phải kiểm thử đầy đủ production)

| Thành phần hiện tại | Quan sát trong repository | Việc phải làm |
| --- | --- | --- |
| Web nền | Next.js 15, React 19, TypeScript, Supabase SSR client, một số giao diện admin/student | Kiểm tra live mode, cấu hình môi trường và khả năng vận hành nhiều người |
| Học và quiz | Quiz demo; LiveQuiz cơ bản gọi API; dữ liệu bài học/tiến độ có mã nguồn | Hợp nhất mô hình bài tập, bài thi, phiên bản câu hỏi và dữ liệu thật |
| Trình chiếu | React renderer, catalog bài Tin học / Word / Excel, nhiều bố cục | Tạo CMS/editor, quản lý quyền và tích hợp câu hỏi trực tiếp |
| Word simulator | Trình soạn thảo/mô phỏng Word với nhiều hành vi tương tác; lưu nháp cục bộ | Giữ và ổn định chức năng hiện có; tích hợp bài thực hành và cơ chế nộp bài về sau |
| Admin | Demo dashboard và live admin đọc bảng `profiles/courses/quiz_attempts` | Tách quản trị toàn nền tảng với workspace riêng của giáo viên |
| Supabase | Tài liệu migration/RLS/RPC và chế độ demo/live | **Xác minh trực tiếp** môi trường Dev/Production, migrations, RLS, backup, quy trình khôi phục |
| Thiếu | Không thấy luồng trọn vẹn giáo viên tạo phòng → HS join → báo cáo; không thấy Teacher Workspace độc lập | Xây nền tảng lớp học, ngân hàng câu hỏi, phiên trực tiếp, báo cáo thống nhất |

Lưu ý: tài liệu roadmap cũ có mục trạng thái triển khai đã lạc hậu so với các đợt Vercel trước; **không suy ra mọi dịch vụ dữ liệu đã sẵn sàng** chỉ từ mã nguồn hoặc một deployment READY.

## 4. Vai trò và cấu trúc sản phẩm

### 4.1 Nhóm người dùng
- **Khách:** xem nội dung công khai, nhập PIN phòng (nếu giáo viên cho phép), không xem dữ liệu cá nhân khác.
- **Học sinh:** lớp được tham gia, bài được giao, lịch học/tương tác, kết quả, thực hành, tiến bộ cá nhân.
- **Giáo viên:** lớp mình phụ trách, soạn học liệu/đề, tổ chức buổi học, xem/chấm bài, xuất báo cáo.
- **Tổ trưởng/Bộ môn:** chia sẻ tài nguyên và báo cáo trong phạm vi được phân quyền.
- **Quản trị trường:** danh sách giáo viên/lớp, cấu hình trường, báo cáo tổng hợp; không đọc trái phép bài làm riêng.
- **Quản trị nền tảng:** hệ thống, bảo mật, giám sát, hỗ trợ, cấu hình tính năng.

### 4.2 Bốn sản phẩm trong cùng hệ sinh thái
1. **Teacher Studio** — tổng quan, quản lý lớp, học liệu, bài giảng, câu hỏi, đề thi, giao bài, Live Quiz, điểm và báo cáo.
2. **Student Hub** — vào phòng nhanh, lớp của em, học bài, bài tập, thi thử, phòng thực hành, phản hồi và kết quả.
3. **School Manager** — nhiều giáo viên, lớp/năm học/học kỳ, phân quyền, báo cáo và chuẩn hóa nội dung.
4. **Content Library** — câu hỏi, đề, slide, tài liệu, mẫu bài giảng, bài thực hành; công khai/riêng tư/tổ chuyên môn theo quyền.

Mọi sản phẩm dùng chung tài khoản, dữ liệu trường/lớp, danh mục môn-chủ đề, công cụ biên soạn và sự kiện học tập.

## 5. Bản đồ điều hướng đề xuất

> Route là **thiết kế đích**, không phải đường dẫn đã tồn tại. Giữ route cũ và thêm redirect khi chuyển đổi; tránh làm hỏng liên kết đã chia sẻ.

| Không gian | Menu cấp một | Route dự kiến |
| --- | --- | --- |
| Giáo viên | Tổng quan, Lớp học, Ngân hàng câu hỏi, Đề kiểm tra, Bài giảng, Buổi học trực tiếp, Bài tập, Kết quả, Học liệu, Công cụ | `/giao-vien/*` |
| Học sinh | Trang của em, Lớp, Bài được giao, Luyện tập, Thực hành, Kết quả, Hồ sơ | `/hoc-sinh/*` |
| Phòng tương tác | Nhập mã phòng, phòng chờ, trả lời, công bố, kết quả | `/tham-gia`, `/play/[code]` |
| Trình chiếu | Danh mục, player, xây dựng bài giảng | Giữ `/cong-cu/trinh-chieu`; thêm đường dẫn quản lý |
| Quản trị trường | Tổng quan, tài khoản, lớp, năm học, tài nguyên, báo cáo | `/truong/*` |
| Quản trị hệ thống | Quyền, tổ chức, kiểm duyệt, cấu hình, giám sát | Giữ `/admin/*` và chuẩn hóa |

## 6. Chi tiết backlog theo hệ thống

### A. Danh tính, trường, lớp và phân quyền — P0

- [ ] Thiết kế `organizations`/trường, `academic_years`/năm học, `memberships`/vai trò, `classrooms`/lớp, `enrollments`/danh sách HS.
- [ ] GV tự tạo lớp riêng hoặc tham gia trường; lớp có mã mời, danh sách, trạng thái hoạt động, nhóm/lớp con.
- [ ] Import danh sách từ CSV/Excel với xem trước, map cột và báo lỗi; hỗ trợ nhập thủ công.
- [ ] Liên kết tên HS khách của buổi live với hồ sơ chính thức sau khi xác thực, theo quy trình có kiểm duyệt.
- [ ] Phân quyền theo tổ chức + lớp + tài nguyên; kiểm tra RLS và API với tài khoản khác nhau.
- [ ] Quản lý năm học/học kỳ, chuyển lớp, lưu trữ lớp cũ; không xóa dữ liệu kết quả khi đổi lớp.
- [ ] Định nghĩa quyền xử lý dữ liệu trẻ em, chính sách riêng tư, yêu cầu sự đồng ý/phù hợp theo đối tượng và nhà trường.

**Hoàn thành khi:** hai GV không xem/sửa lớp, câu hỏi và kết quả riêng của nhau; HS không lấy kết quả người khác bằng cách thay ID; import 50 HS hoạt động ổn định.

### B. Teacher Dashboard và Teacher Workspace — P0/P1

- [ ] Dashboard tóm tắt **lớp đang dạy, công việc sắp tới, bài chưa chấm, buổi học gần đây, kết quả cần chú ý**.
- [ ] Nút hành động nhanh: **Tạo bài giảng / Tạo câu hỏi / Tạo đề / Mở phòng / Giao bài**.
- [ ] Danh sách bản nháp gần đây, tài nguyên của tôi, bộ môn, bộ sưu tập dùng chung.
- [ ] Thông báo có ý nghĩa (bài nộp mới, lớp chưa hoàn thành, bản nháp cần xử lý), tránh gamification dày đặc ở dashboard.
- [ ] Tìm kiếm toàn cục theo tên học liệu, lớp, câu hỏi và đề.

**Hoàn thành khi:** GV từ dashboard có thể tạo tài nguyên và giao/triển khai hoạt động thực chỉ qua một chuỗi thao tác ngắn; không có nút trang trí thiếu chức năng.

### C. Ngân hàng câu hỏi làm lõi chung — P0/P1

- [ ] Schema câu hỏi thống nhất: môn, khối, phần/chủ đề, năng lực, độ khó, mục tiêu học tập, từ khóa, tác giả, hình ảnh/công thức, đáp án, giải thích và version.
- [ ] Loại câu hỏi giai đoạn đầu: một đáp án A/B/C/D, nhiều đáp án, đúng/sai, điền ngắn.
- [ ] Hỗ trợ tự luận/chấm tay, nhóm câu đọc hiểu, ma trận/đặc tả, công thức, hình/âm thanh ở giai đoạn tiếp.
- [ ] Soạn trực tiếp; nhân bản; tái sử dụng; nhập hàng loạt CSV; import Word sau khi có quy trình kiểm tra chuyển đổi.
- [ ] Quy trình **nháp → kiểm tra → xuất bản → khóa phiên bản → lưu trữ**; sửa đáp án sau khi HS làm phải tạo phiên bản mới hoặc có quy trình chấm lại minh bạch.
- [ ] Tìm kiếm, bộ lọc và lựa chọn câu từ ngân hàng cho: đề thi, live quiz, bài giảng, trò chơi, bài tập.

**Hoàn thành khi:** một câu hỏi được dùng cho ít nhất 3 ngữ cảnh mà không tạo bản sao rời rạc; kết quả lịch sử vẫn dựa trên phiên bản cũ dù tác giả chỉnh câu.

### D. Đề thi, bài tập, giao bài và chấm điểm — P1

- [ ] Trình tạo đề theo lựa chọn câu, trộn câu/đáp án tùy cấu hình, đặt điểm và đáp án.
- [ ] Giao đề bằng link, mã, hoặc gắn lớp; thời gian mở/đóng, số lượt làm, quyền xem đáp án/lời giải.
- [ ] Làm bài mobile-first, đánh dấu câu, autosave phía server, tiếp tục sau reconnect, nộp đúng hạn; chế độ khách riêng với bài được cho phép.
- [ ] Chấm ở server theo chính sách đóng băng của phiên bản đề; kiểm toán mọi lần chấm lại/đổi đáp án.
- [ ] Chấm tay câu tự luận, phản hồi, trạng thái đang chấm/đã công bố; hỗ trợ xuất điểm CSV/Excel; PDF/Word khi có pipeline phù hợp.
- [ ] Ma trận đề và bản đặc tả có thể cấu hình theo cấp/môn; **không áp dụng cứng một quy tắc chấm cho mọi bộ môn**.
- [ ] Không mô tả giám sát đổi tab, chặn copy, webcam là biện pháp chống gian lận tuyệt đối; sử dụng minh bạch, cân nhắc quyền riêng tư.

**Hoàn thành khi:** HS đăng xuất/tải lại không mất bài đã lưu; GV xem được ai nộp/chưa nộp; đáp án đúng không xuất hiện trong API trước thời điểm được phép.

### E. Live Quiz — giáo viên tạo phòng, HS dùng điện thoại — P1 (ưu tiên đặc biệt)

- [ ] Chọn bộ câu hỏi/bài giảng → **Tạo phòng** → PIN 6 chữ số có thời hạn + URL + QR.
- [ ] Phòng chờ: số người tham gia, tên/hồ sơ HS, báo trùng, duyệt/loại khách, cấu hình tham gia trễ.
- [ ] Màn hình GV (host) điều khiển: bắt đầu, tạm dừng, đếm giờ, khóa đáp án, chuyển câu, công bố, kết thúc.
- [ ] Màn hình trình chiếu (projector) **tách chế độ** khỏi màn host; không hiển thị thông tin cá nhân nhạy cảm hoặc đáp án đúng trước công bố.
- [ ] Màn hình HS 360px+: nhập PIN, chọn A/B/C/D, trạng thái đã gửi, kết nối lại và xác nhận nộp.
- [ ] Quản lý trạng thái server-authoritative: `lobby → question_open → question_locked → revealed → next → finished`; chuyển trạng thái có kiểm tra vai trò.
- [ ] Ghi mỗi câu trả lời có idempotency, thời gian server; chặn gửi sau khi khóa. Bật/tắt quyền đổi đáp án trước deadline.
- [ ] Realtime theo kênh phòng (đánh giá Supabase Realtime/WebSocket); có retry, resync snapshot và fallback nhẹ cho kết nối kém.
- [ ] Chấm server, biểu đồ A/B/C/D và tỷ lệ đúng sau công bố; export và lưu lịch sử phiên.
- [ ] Chấm điểm, streak và bảng xếp hạng là **tùy chọn**, không bắt buộc, để giữ mục tiêu học tập.

**Pilot chấp nhận:** 1 GV + 45–50 điện thoại Android/iOS, tối thiểu 10 câu; không mất đáp án đã xác nhận sau reload/reconnect; không rò đáp án; phân tích lỗi khi tốc độ realtime dưới mục tiêu.

### F. Bài giảng, trình chiếu, quản lý nội dung — P1/P2

- [ ] Dùng lại React presentation renderer/catalog hiện có; xây editor quản lý slide, block, ảnh/video, ghi chú, bài giảng mẫu.
- [ ] Phân cấp môn → chủ đề/Phần → bài giảng. Tên lớp nhập khi bắt đầu dạy; không gắn cứng 1 bài giảng với 1 lớp.
- [ ] Lưu version, publish/draft, lịch sử và phân quyền chia sẻ.
- [ ] Nhúng câu hỏi từ cùng question bank vào slide; bật Live Quiz ngay từ slide được chiếu, tự thu kết quả.
- [ ] Đồng bộ kết quả tương tác với lớp để GV xem lại sau buổi.
- [ ] Hỗ trợ trình chiếu toàn màn hình, chế độ GV riêng, điều khiển bằng bàn phím, TV/projector.
- [ ] Bảo toàn trải nghiệm các bài Tin học/File Explorer, Word và Excel đang có.

**Hoàn thành khi:** từ một slide có câu hỏi, GV tạo được phiên trả lời trực tiếp mà không sao chép thủ công câu hỏi.

### G. Thực hành Tin học và Lab — P2 (điểm khác biệt)

- [ ] Biến mô phỏng Word/Excel/Windows thành **bài thực hành có mục tiêu, thao tác, trạng thái, kiểm tra và nộp bài**, thay vì chỉ môi trường thao tác tự do.
- [ ] Tách engine mô phỏng, bài tập/điều kiện đạt, bộ đánh giá, lưu nháp và lịch sử thao tác.
- [ ] Word: các tác vụ định dạng, đoạn, bảng, trang; xác minh chức năng trước khi chấm tự động.
- [ ] Excel: ô, hàm, bảng tính, biểu đồ và bài thực hành; chấm theo kết quả/điều kiện chứ không theo pixel UI.
- [ ] Windows/File Explorer: thao tác tệp/thư mục trong môi trường mô phỏng an toàn.
- [ ] Lưu kết quả theo bài/lớp; tránh lưu dữ liệu cá nhân không cần thiết từ thao tác chi tiết.
- [ ] Cho GV gắn bài thực hành vào bài giảng hoặc giao về nhà.

### H. Student Hub và hệ thống học tập — P1/P2

- [ ] Dashboard học sinh: bài cần hoàn thành, phòng đang mở, kết quả mới, tiến độ chủ đề.
- [ ] Lớp của em, tham gia buổi live, làm bài tập/đề, tiếp tục bài chưa xong, thực hành Lab.
- [ ] Xem lời giải sau khi được phép; luyện lại câu sai, gợi ý nội dung cần ôn; không công khai điểm cá nhân cho bạn cùng lớp.
- [ ] Mobile-first, trợ năng, cấu hình giảm chuyển động, UI rõ với học sinh nhỏ tuổi.
- [ ] Sau khi có nội dung đủ tốt: lộ trình học năng lực số nhiều cấp, bộ đề luyện tập cá nhân.

### I. Phân tích, sổ điểm và báo cáo — P1/P2

- [ ] Dữ liệu theo lớp, học sinh, bài, câu hỏi, mục tiêu học tập; chỉ số tỷ lệ trả lời, tỷ lệ đúng, thời gian.
- [ ] Thống kê buổi dạy: câu nào sai nhiều, học sinh chưa tham gia, nội dung cần dạy lại.
- [ ] Sổ điểm từ các hoạt động khác nhau, phân biệt **điểm luyện tập** và **điểm kiểm tra chính thức**.
- [ ] Xuất dữ liệu đúng quyền, không lộ điểm cho lớp/trường khác; nhật ký xuất dữ liệu nhạy cảm.
- [ ] Chuỗi báo cáo cho GV → tổ trưởng → quản trị trường; tổng hợp ẩn danh khi phù hợp.

### J. Kho học liệu, chia sẻ và cộng tác — P2/P3

- [ ] Kho cá nhân, kho tổ chuyên môn, kho trường, tài nguyên công khai theo quyền và giấy phép.
- [ ] Tìm kiếm, tag, bộ sưu tập, bản sao độc lập; nguồn gốc tác giả và phiên bản.
- [ ] Bình luận/review/duyệt nội dung khi chia sẻ nhiều tác giả.
- [ ] Thư viện mẫu chuẩn nội bộ, không sử dụng tài liệu có bản quyền khi thiếu quyền.
- [ ] Marketplace/mua bán nội dung: **để sau**, chỉ khảo sát khi có chất lượng tài nguyên, pháp lý và nhu cầu thực.

### K. AI hỗ trợ giáo viên — P3

- [ ] Dự thảo câu hỏi theo chủ đề/mức độ, biến nội dung giáo viên cung cấp thành câu hỏi hoặc gợi ý slide.
- [ ] Gợi ý ma trận, giải thích và hoạt động dạy lại từ thống kê; người dùng duyệt mọi kết quả AI trước công bố.
- [ ] Nhật ký nguồn nội dung, giới hạn chi phí, quota, quản lý prompt và công cụ đánh giá chất lượng.
- [ ] Không mặc định gửi dữ liệu cá nhân học sinh sang bên thứ ba; rà soát bảo mật/dữ liệu trước khi tích hợp.
- [ ] AI Tutor cho học sinh là giai đoạn sau, có giới hạn an toàn theo nhóm tuổi.

### L. School Manager, vận hành và thương mại — P3

- [ ] Đơn vị nhiều tổ/lớp/giáo viên, mời tài khoản và cấp quyền theo vai trò.
- [ ] Trường/năm học/học kỳ, chính sách lưu trữ và báo cáo.
- [ ] Quan sát chất lượng hệ thống, nhật ký sự kiện, hỗ trợ và xử lý sự cố.
- [ ] Gói cá nhân/trường, hạn mức lưu trữ/tài nguyên nếu có nhu cầu; cơ chế thanh toán chỉ nghiên cứu sau khi có sử dụng thật.
- [ ] Chưa đưa quảng cáo chen trong bài thi, marketplace hay chia sẻ dữ liệu HS vào phạm vi lõi.

## 7. Các luồng người dùng không được đứt đoạn

### Flow 1 — Từ bài học đến kiểm tra
GV tạo chủ đề → tạo câu hỏi → soạn slide → mở Live Quiz trong tiết dạy → xem biểu đồ → giao bài luyện ở nhà → HS hoàn thành → báo cáo lớp và câu sai.

### Flow 2 — Kiểm tra chính thức
GV tạo đề từ ngân hàng → đóng băng phiên bản → giao cho lớp có thời gian → HS làm bài, autosave → nộp → chấm server → GV xem/chấm tay nếu có → công bố và xuất điểm.

### Flow 3 — Lab Tin học
GV tạo bài thực hành theo tiêu chí → gắn lớp → HS làm trong mô phỏng Word/Excel → hệ thống lưu trạng thái → đánh giá/nhận xét → GV xem tiến độ và giao luyện lại.

### Flow 4 — Chuẩn bị nội dung để dùng lại
GV soạn nội dung một lần → lưu thư viện cá nhân → đánh dấu chủ đề/độ khó → dùng lại cho quiz, bài thi, slide, thực hành → phân phối theo quyền.

## 8. Kiến trúc hệ thống đề xuất

### 8.1 Nền tảng
- Frontend: tiếp tục Next.js + React + TypeScript, thiết kế responsive và dùng một bộ design tokens/components.
- Backend: server route/actions hoặc service module rõ ràng cho domain; Supabase PostgreSQL/Auth/Storage/RLS làm nền hiện có **sau khi xác minh môi trường**.
- Realtime: kênh theo session, sự kiện nhỏ, không gửi lại toàn bộ đề mỗi nhịp; trạng thái chính xác lưu DB, hỗ trợ lấy snapshot sau reconnect.
- File: Storage/CDN, checksum, giới hạn upload, kiểm tra định dạng và quyền truy cập media.
- Background tasks: import Word, xuất file, xử lý báo cáo/chấm hàng loạt; tránh xử lý nặng trên request tương tác.
- Quan sát: structured logs, Sentry/tương đương, uptime, slow query, lỗi giao dịch, metrics phòng live.
- Release: Dev → Preview/Staging → Production, migrations theo kế hoạch, rollback và backup; không sửa trực tiếp dữ liệu production để thử tính năng.

### 8.2 Domain model sơ bộ
- `users/profiles`, `organizations`, `organization_memberships`, `academic_years`, `classrooms`, `class_enrollments`
- `subjects`, `curriculum_units`, `learning_objectives`, `lessons`, `lesson_versions`, `slide_decks`, `slide_versions`
- `question_banks`, `questions`, `question_versions`, `question_options`, `media_assets`, `tags`
- `exams`, `exam_versions`, `exam_items`, `assignments`, `assignment_recipients`, `attempts`, `attempt_answers`, `grading_events`
- `live_sessions`, `live_participants`, `live_questions`, `live_answers`, `live_events`, `live_results`
- `lab_definitions`, `lab_assignments`, `lab_attempts`, `assessment_rubrics`
- `resource_collections`, `resource_shares`, `audit_logs`, `notification_events`

Đây là mô hình logic, **không phải yêu cầu tạo tất cả các bảng ngay**. Có thể tái dùng/thích nghi bảng cũ sau khi kiểm toán migrations; không triển khai song song hai nguồn sự thật.

### 8.3 Bảo mật và đúng dữ liệu
- Tenant isolation, RLS, server-side authorization, không tin `teacher_id`/role gửi từ client.
- Tất cả API đọc đề trước công bố phải loại đáp án đúng và rubric nhạy cảm.
- Phiên live: PIN tồn tại ngắn, chống đoán mã/rate limit, quyền host, cấm trùng/giả mạo HS, idempotent submit.
- Exam: có bản snapshot/version; xử lý regrade công khai trong audit log.
- Quy định dữ liệu học sinh/trẻ em, retention, yêu cầu xóa/xuất dữ liệu và quyền truy cập theo vai trò; rà soát yêu cầu pháp lý trước vận hành trường.
- Khả năng chịu lỗi: client cache chỉ là bản nháp hỗ trợ; xác nhận gửi và trạng thái chính thức phải ở server.

## 9. Lộ trình theo dependency và mức ưu tiên

> Các khoảng thời gian là **ước lượng để lập kế hoạch**, giả định nhóm nhỏ 3–5 người có hỗ trợ QA/design và hạ tầng sẵn có; không phải cam kết thời hạn. Làm một mình có thể mất lâu hơn đáng kể.

| Chặng | Ước lượng | Mục tiêu | Đầu ra kiểm chứng |
| --- | --- | --- | --- |
| **P0 — Audit & design** | 3–4 tuần | Audit repo, Supabase, deployment, flow; thiết kế quyền và dữ liệu | Product spec + schema/RLS design + UI flows + staging kiểm thử |
| **P1 — Identity, lớp, GV** | 6–8 tuần | Teacher Studio shell, lớp học, import học sinh, vai trò, danh mục | GV tạo lớp, HS tham gia, phân quyền độc lập |
| **P2 — Question Bank** | 6–9 tuần | Soạn câu hỏi, version, tìm kiếm, tổ chức môn/chủ đề | 1 câu dùng lại cho nhiều chế độ, có tests bảo mật |
| **P3 — Exam & Assignment** | 7–10 tuần | Đề, giao bài, mobile exam, chấm server, báo cáo cơ bản | End-to-end đề → HS → chấm → xuất dữ liệu |
| **P4 — Live Quiz** | 6–8 tuần | PIN, lobby, host/projector/mobile, realtime, reconnect | Pilot 1 lớp thực tế 45–50 HS |
| **P5 — Teaching & Lab** | 8–12 tuần | Authoring slide, tích hợp quiz, giao thực hành Word/Excel | GV dạy một chuỗi slide–quiz–lab–báo cáo |
| **P6 — Scale & extensions** | 10–16 tuần, chia đợt | Analytics mở rộng, tổ chuyên môn/trường, AI/chiến dịch game chọn lọc | Multi-teacher pilot, ổn định vận hành |

**Mốc sản phẩm:**
- **MVP A:** GV quản lý lớp, tạo câu hỏi, tạo đề, giao bài, chấm & xem báo cáo.
- **MVP B:** Mở Live Quiz trong lớp, HS vào bằng điện thoại, báo cáo tương tác lưu lại.
- **Release 1.0:** Bài giảng/trình chiếu kết nối trực tiếp ngân hàng câu hỏi, bài kiểm tra và bài thực hành Tin học.
- **Release 2.0:** Dùng được cho tổ/trường, nhiều môn, chia sẻ học liệu và phân tích tiến bộ.
- **Sau 2.0:** AI nâng cao, nhiều game, OMR, marketplace khi có bằng chứng nhu cầu.

### Quy tắc không làm song song sai thứ tự
Không xây nhiều trò chơi trước khi có question bank và Live Quiz ổn định.  
Không xây marketplace trước khi có quản trị tài nguyên và quyền tác giả.  
Không làm AI chấm điểm tự luận hoàn toàn tự động trước khi có rubric và con người giám sát.  
Không triển khai nhiều trường trước khi có tenant isolation và thử nghiệm RLS.

## 10. Phân công theo luồng công việc

**Product/giáo viên chủ nhiệm sản phẩm:** mô tả bài học và UX, xác nhận quy tắc chấm, chuẩn giáo dục, pilot lớp học.  
**Frontend:** design system, Teacher Workspace, Student mobile, live host/projector và authoring.  
**Backend/Data:** auth/tenancy, schema/RLS/RPC, storage, chấm bài, realtime state machine.  
**QA:** kiểm thử đa tài khoản, đa thiết bị, tải đồng thời, gián đoạn kết nối, dữ liệu và accessibility.  
**Ops:** CI/CD, staging, logs, alerting, backup và ngân sách.

Trong nhóm ít người, một người có thể kiêm nhiều vai, nhưng **vai trò QA/kiểm tra khác biệt quyền tài khoản không được bỏ**.

## 11. KPI và tiêu chí chất lượng dự kiến (mục tiêu, chưa đo)

| Đích | Mục tiêu thử nghiệm ban đầu | Cách đo |
| --- | --- | --- |
| Tham gia phòng | HS có thiết bị và mã hợp lệ vào được trong ≤45 giây ở điều kiện mạng bình thường | Pilot 45–50 HS, đo median/p90 |
| Độ chính xác bài làm | 0 mất đáp án đã được server xác nhận trong kịch bản reconnect/reload thử nghiệm | E2E + fault injection |
| Live latency | p95 thay đổi trạng thái hiển thị trong khoảng ≤2 giây ở 50 thiết bị trên mạng pilot | Logs client/server đồng bộ |
| Tạo lớp | GV nhập danh sách 45 HS và kiểm tra danh tính trong ≤10 phút | Usability test |
| Soạn–giao–chấm | GV tạo quiz 10 câu từ question bank, giao và xem kết quả trong một workflow | Task completion test |
| Bảo mật | 0 lỗi truy cập chéo GV/HS/lớp trong bộ kiểm thử RLS/API | Automated security tests |
| Chất lượng nội dung | Mỗi đề được rà đáp án, version và lời giải trước publish | Review checklist |
| Trợ năng | Các tác vụ cốt lõi điều khiển bằng bàn phím, text contrast tốt, giảm chuyển động | Checklist WCAG AA |

Mọi KPI chỉ trở thành cam kết sau khi đo baseline ở môi trường thật.

## 12. Rủi ro và đối sách

| Rủi ro | Tác động | Giảm thiểu |
| --- | --- | --- |
| Làm mọi thứ một lúc | Dự án lớn nhưng không có luồng nào hoàn thiện | Theo MVP và dependency; chống mở rộng phạm vi |
| Nhiều bản dữ liệu quiz/slide tách rời | Nội dung nhân bản, kết quả sai phiên bản | Question + content versions là nguồn sự thật dùng chung |
| Mạng trường yếu | Live Quiz bị giật, HS bị mất lượt | Reconnect, resync, tối ưu payload, kiểm thử tại trường |
| Quyền truy cập dữ liệu HS | Rò kết quả, không đủ tin cậy để trường sử dụng | RLS, audit, backup, kiểm thử nhiều vai trò, chính sách quyền riêng tư |
| Tính năng mô phỏng chưa ổn | Chấm Lab sai dù giao diện đẹp | Tách bài thực hành khỏi UI, xây rubric testable |
| AI tạo đáp án sai | Ảnh hưởng kiến thức, điểm | Human review, version, không tự xuất bản |
| Đối thủ nhiều tính năng | Dễ dàn trải theo trào lưu | Tập trung lợi thế dạy Tin học, Lab, slide–quiz–báo cáo |
| Chi phí realtime/media | Không bền vững khi tăng người dùng | Hạn mức, monitoring, thử nghiệm tải, tối ưu lưu trữ |

## 13. Danh sách công việc cụ thể cho vòng kế tiếp (ưu tiên P0)

1. [ ] Xác minh mode demo/live production; tình trạng Supabase Auth, migrations, RLS, backup, môi trường Staging và dữ liệu đang có.
2. [ ] Chụp sơ đồ các route/components liên quan `/admin`, `/student`, presentations, quiz, Word/Excel; đánh dấu dùng lại hay refactor.
3. [ ] Khóa vai trò trong PRD: khách, học sinh, giáo viên, quản trị trường, platform admin.
4. [ ] Phác thảo wireframe Teacher Dashboard 1440px/768px/360px, Student join 360px, Host/Projector live.
5. [ ] Chốt mô hình `Classroom + Enrollment + Question + Version + Assignment + Attempt + LiveSession`.
6. [ ] Viết user stories và E2E mẫu một giáo viên/45 học sinh, bao gồm các tình huống mất mạng và khôi phục.
7. [ ] Thiết kế cách tích hợp câu hỏi từ slide và nội dung mô phỏng vào ngân hàng câu hỏi chung.
8. [ ] Thiết lập đo lường logs/KPI pilot và ngân sách tải realtime.
9. [ ] Chọn một lớp Tin học thử nghiệm và bộ câu hỏi thật để đánh giá UX; dùng dữ liệu giả/được cho phép trong quá trình phát triển.
10. [ ] Chỉ sau khi P0 được duyệt mới chia issue/PR mã nguồn theo module.

## 14. Tiêu chuẩn hoàn thành mỗi tính năng (Definition of Done)

- Có user story, trạng thái loading/empty/error, quyền thao tác, phân trang/dữ liệu lớn khi cần.
- Giao diện desktop, tablet, mobile; bàn phím/focus; trải nghiệm máy chiếu cho sản phẩm tương tác.
- Có test unit, integration và E2E cho luồng quan trọng; kiểm tra RLS không dùng riêng tài khoản admin.
- Thao tác lưu/nộp/chấm có xác nhận server, tính idempotent, phục hồi được khi gián đoạn.
- Có tài liệu ngắn, telemetry, migration/rollback nếu có DB change.
- CI/test/typecheck/build thành công; staging xác nhận trước production.
- Chỉ đánh dấu **DONE** khi tính năng chạy thực tế chứ không chỉ xuất hiện trên sidebar.

## 15. Ngoài phạm vi ngay lúc này

- Không sửa chức năng Word/Excel đang ổn định chỉ để phù hợp dashboard mới.
- Không tự tạo game RPG/Gỡ bom/Zoo-pet khi chưa có Live Quiz cốt lõi.
- Không tạo chợ tài nguyên trả phí hoặc thương mại hóa dữ liệu học sinh.
- Không xây OMR/Plickers trong giai đoạn đầu; chế độ làm bài trên điện thoại là hướng đã chọn.
- Không thêm webcam/giám sát học sinh mặc định; mọi đề xuất cần đánh giá quyền riêng tư trước.
- Không công bố đã có một tính năng chỉ vì được ghi trong kế hoạch.

**Bước có giá trị nhất để bắt đầu:** chốt sơ đồ Teacher Dashboard và luồng `Lớp → Ngân hàng câu hỏi → Đề/Bài giảng → Live Quiz/Bài giao → Báo cáo`, rồi triển khai nền dữ liệu tương ứng.
