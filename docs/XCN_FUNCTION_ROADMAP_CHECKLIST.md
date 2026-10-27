# Xưởng Công Nghệ — Checklist chức năng 2026–2028

> Cập nhật: 2026-10-27. **Ưu tiên khóa:** hoàn thiện Admin + Roadmap trước, sau đó mới phát triển module khác.  
> Đây là bộ checklist gốc đã chuyển vào giao diện Admin Roadmap. Dấu [x] là mã nguồn/khả năng đã ghi nhận, không tự chứng minh đã kiểm thử Production.  
> Để cập nhật sau này: thay đổi trong `/admin/roadmap` → **Xuất Markdown** → rà soát và commit lại tài liệu. Thay đổi trong Admin không tự động tạo commit GitHub.

## Nguyên tắc triển khai

- [ ] Hoàn tất giao diện Admin, Sitemap, Roadmap, lưu bền vững và kiểm thử quyền trước khi làm chức năng khác.
- [ ] Mọi module mới có route, kiểm soát truy cập, dữ liệu thật, trạng thái lỗi, mobile, test và tài liệu.
- [ ] Tin học ưu tiên hơn marketplace, AI và gamification; tập trung năng lực Word, Excel, PowerPoint, Windows, Python và SQL.
- [ ] Một tài nguyên dùng chung cho lớp, đề, Live Quiz, slide và Lab; không sao chép dữ liệu.
- [ ] Không đánh dấu `DONE` nếu chưa kiểm thử thực tế và trên production.


## 00 · Nền tảng & Admin

### Trung tâm quản trị toàn website

- **ID:** `admin-center` · **Ưu tiên:** P0 · **Phân hệ:** Quản trị
- **Mục tiêu:** Dashboard điều hành, điều hướng module, báo cáo hệ thống và quyền admin.

- [x] Dashboard tổng quan thực/được ghi nhãn demo
- [x] Sidebar quản trị phân nhóm đúng các trang đã có
- [x] Roadmap dọc có lọc, tìm kiếm, checklist và nhật ký
- [x] Tạo/sửa/xóa nhiệm vụ lớn, nhiệm vụ nhỏ và ghi chú
- [x] Danh sách người dùng với bộ lọc, phân trang và xuất CSV chỉ đọc khi Live
- [x] Ma trận quyền và điều kiện chặn cấp vai trò trái phép
- [x] Soạn, xem trước, nhập/xuất và lưu bản nháp cấu hình cục bộ
- [x] Nhật ký thao tác cục bộ và xuất dữ liệu
- [x] Trung tâm giám sát trạng thái module và quyền
- [x] Báo cáo tổng hợp dữ liệu server, không hiển thị số giả Demo
- [x] Lưu roadmap an toàn, xuất Markdown/JSON và nhập sao lưu
- [ ] Xác minh quyền admin, RLS và kiểm thử đa tài khoản
- [ ] Kiểm thử trực quan mobile/tablet/desktop và Production

**Ghi nhận 27/10/2026:** Supabase đã có Roadmap v4 và 4 sự kiện lưu; mục sao lưu/khôi phục đã có kiểm thử mã. Mục JWT hai vai trò vẫn chưa nghiệm thu, dù hiện đang được tích trên Supabase.\n\n**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### Kiến trúc, dữ liệu và bảo mật

- **ID:** `system-architecture` · **Ưu tiên:** P0 · **Phân hệ:** Hệ thống
- **Mục tiêu:** Kiểm kê hệ thống, chuẩn schema, quyền, môi trường và vận hành.

- [ ] Kiểm kê module/routes đã có và tình trạng vận hành
- [ ] Khóa mô hình quyền khách/học sinh/giáo viên/trường/admin
- [ ] Thiết lập Dev, Preview, Production và migration an toàn
- [ ] Kiểm tra RLS chống đọc/sửa dữ liệu chéo
- [ ] Thiết lập backup, restore, audit logs và giám sát
- [ ] Kiểm thử tải, bảo mật API và khả năng khôi phục dữ liệu

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### Thiết kế chung & trải nghiệm responsive

- **ID:** `design-system` · **Ưu tiên:** P0 · **Phân hệ:** Giao diện
- **Mục tiêu:** Hệ token, header, cards, typography và UI cho máy tính/điện thoại.

- [ ] Thống nhất navy/blue/cyan/ice và hệ spacing
- [ ] Chuẩn header, footer, sidebar, thành phần form
- [ ] Xây trạng thái loading/empty/error và keyboard focus
- [ ] Xây các layout theo vai trò, không ép chiều cao mobile
- [ ] Kiểm thử 360/768/1280px và WCAG cơ bản

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.


## 01 · Website & Tài khoản

### Landing Page & điều hướng công khai

- **ID:** `public-landing` · **Ưu tiên:** P0 · **Phân hệ:** Website
- **Mục tiêu:** Khám phá hệ sinh thái, giới thiệu sản phẩm và nút truy cập nhanh.

- [ ] Hero giới thiệu Xưởng Công Nghệ và CTA theo đối tượng
- [ ] Header Giáo viên/Học sinh/Công cụ/Thực hành/Thư viện/Trò chơi
- [ ] Hiển thị tên, ảnh đại diện và menu tài khoản khi đã đăng nhập
- [ ] Tham gia phòng bằng mã từ header
- [ ] Section Tin học và bản demo thực hành nổi bật
- [ ] FAQ, hỗ trợ, chính sách, footer và tìm kiếm
- [ ] Điều hướng mobile và phân tích sự kiện tương tác

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### Đăng nhập, đăng ký và hồ sơ đa vai trò

- **ID:** `auth-account` · **Ưu tiên:** P0 · **Phân hệ:** Tài khoản
- **Mục tiêu:** Một danh tính, nhiều quyền hợp lệ, onboarding riêng từng người dùng.

- [x] Đăng nhập/đăng ký/quên mật khẩu/xác minh email
- [ ] Chọn mục đích tham gia khi đăng ký, không tự cấp quyền admin
- [ ] Onboarding học sinh, giáo viên và người học tự do
- [ ] Hồ sơ cá nhân và ảnh đại diện
- [ ] Chuyển không gian làm việc khi tài khoản có nhiều quyền
- [ ] Bảo vệ tài khoản HS, quyền riêng tư và kiểm soát phiên

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.


## 02 · Giáo viên & Học sinh

### Teacher Studio & quản lý lớp

- **ID:** `teacher-workspace` · **Ưu tiên:** P0 · **Phân hệ:** Giáo viên
- **Mục tiêu:** Không gian giáo viên: lớp, sổ học sinh, hoạt động và thông báo.

- [ ] Dashboard công việc & lớp gần đây
- [ ] Tạo/chỉnh sửa/lưu trữ lớp, năm học và môn
- [ ] Import danh sách HS từ CSV/Excel, kiểm tra trùng
- [ ] Mời/xác thực học sinh, nhóm và phân quyền lớp
- [ ] Xem bài cần chấm, hoạt động sắp tới, thông báo
- [ ] Báo cáo kết quả và xuất sổ lớp

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### Student Hub & tiến độ cá nhân

- **ID:** `student-hub` · **Ưu tiên:** P1 · **Phân hệ:** Học sinh
- **Mục tiêu:** Không gian học tập mobile-first cho HS theo lớp hoặc tự học.

- [ ] Dashboard bài đang học/bài được giao/lớp của em
- [ ] Tham gia lớp bằng mã, hồ sơ học sinh và quyền dữ liệu
- [ ] Vào nhanh Live Quiz, làm bài trên điện thoại
- [ ] Lưu tiến độ, bài dở và xem kết quả khi được phép
- [ ] Luyện câu sai, thành tích và khuyến nghị học lại

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.


## 03 · Câu hỏi, Đề thi & Live

### Ngân hàng câu hỏi dùng chung

- **ID:** `question-bank` · **Ưu tiên:** P0 · **Phân hệ:** Đánh giá
- **Mục tiêu:** Một câu hỏi sử dụng lại cho bài giảng, đề, live và luyện tập.

- [ ] Mô hình môn/khối/phần/chủ đề/độ khó/kỹ năng
- [ ] Soạn A/B/C/D, nhiều đáp án, đúng-sai và điền ngắn
- [ ] Version, nháp/duyệt/xuất bản và khóa bản đã giao
- [ ] Tìm kiếm, lọc, nhân bản, nhập Word/CSV có rà soát
- [ ] Gắn câu hỏi vào bài giảng, đề, trò chơi và luyện tập
- [ ] Quản lý media, công thức, giải thích và đáp án

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### Đề kiểm tra, giao bài và chấm

- **ID:** `exams-assignments` · **Ưu tiên:** P1 · **Phân hệ:** Đánh giá
- **Mục tiêu:** Ra đề, giao lớp, nộp trên thiết bị, chấm tự động và báo cáo.

- [ ] Tạo đề từ ngân hàng và thiết lập thời gian/điểm
- [ ] Trộn câu/đáp án, ma trận/đặc tả theo yêu cầu
- [ ] Giao lớp, link/mã, mở/đóng và số lượt làm
- [ ] Autosave bài làm server, reconnect và nộp đúng hạn
- [ ] Chấm server, chấm tự luận và quy trình chấm lại
- [ ] Thống kê câu sai, điểm theo lớp và xuất CSV/Excel

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### Live Quiz — học sinh nhập mã phòng

- **ID:** `live-quiz` · **Ưu tiên:** P1 · **Phân hệ:** Tương tác
- **Mục tiêu:** Giáo viên điều khiển trên máy tính, học sinh trả lời trên điện thoại.

- [ ] Tạo phòng PIN 6 chữ số, URL/QR và phòng chờ
- [ ] Học sinh nhập tên/chọn hồ sơ, quản lý tên trùng
- [ ] Host, màn trình chiếu, giao diện điện thoại
- [ ] Bắt đầu/tạm dừng/đếm giờ/khóa/công bố/chuyển câu
- [ ] Nhận câu trả lời realtime, chống gửi trùng và reconnect
- [ ] Biểu đồ A/B/C/D, báo cáo theo HS/câu và lưu lịch sử
- [ ] Pilot 45–50 thiết bị, quyền riêng tư và đo độ trễ

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.


## 04 · Tin học thực hành

### Word Lab — mô phỏng và thực hành

- **ID:** `word-lab` · **Ưu tiên:** P2 · **Phân hệ:** Tin học
- **Mục tiêu:** Nâng editor hiện tại thành bài thực hành có kiểm tra và nộp kết quả.

- [x] Mô phỏng Word: nhập liệu và định dạng văn bản
- [x] Ribbon, giãn dòng/đoạn, dấu ¶ và phân trang ổn định
- [ ] Bảng, hình ảnh, bố cục, in và lưu bản nháp
- [ ] Bộ nhiệm vụ Word theo kỹ năng và độ khó
- [ ] Chấm theo tiêu chí kết quả, không so pixel
- [ ] Lưu bài làm/nộp bài/báo cáo lớp

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### Excel Lab — bảng tính tương tác

- **ID:** `excel-lab` · **Ưu tiên:** P2 · **Phân hệ:** Tin học
- **Mục tiêu:** Thực hành ô, công thức, hàm, bảng và biểu đồ trên trình duyệt.

- [ ] Thiết kế bảng tính tương tác và dữ liệu mẫu
- [ ] Hàm cơ bản/điều kiện, địa chỉ ô, lỗi công thức
- [ ] Sắp xếp, lọc, bảng và biểu đồ
- [ ] Bài thực hành có test cases và gợi ý
- [ ] Chấm kết quả, lưu bài, nộp và tiến độ lớp

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### PowerPoint & trình chiếu bài giảng

- **ID:** `presentation-lab` · **Ưu tiên:** P2 · **Phân hệ:** Tin học
- **Mục tiêu:** Tận dụng player React có sẵn rồi bổ sung editor và tương tác.

- [x] Trình chiếu React/catalog bài Tin học
- [ ] Quản lý phần/chủ đề/bài, nhập lớp khi trình chiếu
- [ ] Editor slide: layout, text, hình, bảng và ghi chú
- [ ] Chèn câu hỏi ngân hàng và mở Live Quiz từ slide
- [ ] Lưu phiên bản, chia sẻ, trình chiếu toàn màn hình
- [ ] Bài thực hành PowerPoint và tiêu chí chấm

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### Windows / File Explorer Lab

- **ID:** `windows-lab` · **Ưu tiên:** P2 · **Phân hệ:** Tin học
- **Mục tiêu:** Luyện thao tác tệp và thư mục trong môi trường an toàn.

- [ ] Mô phỏng Desktop và File Explorer
- [ ] Tạo, đổi tên, sao chép, di chuyển, xóa tệp/thư mục
- [ ] Nhiệm vụ theo kỹ năng và hướng dẫn từng bước
- [ ] Chấm trạng thái hệ thống tệp, reset và lưu tiến độ

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### Python Practice — soạn và chạy code

- **ID:** `python-practice` · **Ưu tiên:** P2 · **Phân hệ:** Tin học
- **Mục tiêu:** Lộ trình lý thuyết ngắn, code editor, chạy thử, kiểm tra tự động.

- [ ] Lộ trình nhóm/chương/bài Python có tiến độ
- [ ] Code editor, gợi ý cú pháp và phím tắt
- [ ] Sandbox chạy code an toàn, giới hạn CPU/thời gian
- [ ] Chạy thử, kiểm tra bài với test cases
- [ ] Gợi ý, lời giải có điều kiện, bài tiếp theo
- [ ] Lưu code, nộp bài và báo cáo cá nhân/lớp

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### SQL Practice — cơ sở dữ liệu

- **ID:** `sql-practice` · **Ưu tiên:** P2 · **Phân hệ:** Tin học
- **Mục tiêu:** Từ SELECT đến JOIN với bộ dữ liệu mẫu và kiểm tra truy vấn.

- [ ] Lộ trình SQL theo chủ đề SELECT/WHERE/GROUP BY/JOIN
- [ ] SQL editor có dữ liệu và bảng kết quả
- [ ] Môi trường chạy truy vấn biệt lập, chỉ đọc
- [ ] Test kết quả truy vấn thay vì so chữ SQL
- [ ] Tiến độ, gợi ý, nộp bài và báo cáo

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.


## 05 · Nội dung & Khóa học

### Lộ trình học & khóa học

- **ID:** `course-paths` · **Ưu tiên:** P2 · **Phân hệ:** Nội dung
- **Mục tiêu:** Trang lớp học, chương trình, giảng viên, lịch, ghi danh và học phí.

- [ ] Trang danh mục chương trình Tin học theo cấp
- [ ] Lớp/khóa với lộ trình, bài, thời gian, mức độ
- [ ] Trang giới thiệu lịch, giảng viên, quyền lợi và sản phẩm học viên
- [ ] Đăng ký/ghi danh và xác nhận tham gia
- [ ] Video, tài liệu, bài kiểm tra và % hoàn thành
- [ ] Thanh toán/ưu đãi chỉ sau khi có chính sách và nhu cầu

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### Thư viện học liệu & cộng đồng

- **ID:** `learning-library` · **Ưu tiên:** P2 · **Phân hệ:** Nội dung
- **Mục tiêu:** Tài nguyên chung có phiên bản, nguồn gốc và quyền chia sẻ.

- [ ] Kho bài giảng, câu hỏi, đề, tài liệu, bài Lab
- [ ] Tìm theo môn/khối/chủ đề/định dạng và tác giả
- [ ] Kho cá nhân, bộ môn, trường và công khai theo quyền
- [ ] Bộ sưu tập, bản sao, lưu nguồn gốc và bản quyền
- [ ] Hướng dẫn, FAQ và kênh hỗ trợ cộng đồng

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.


## 06 · Vận hành & Mở rộng

### School Manager & phân tích

- **ID:** `school-operations` · **Ưu tiên:** P3 · **Phân hệ:** Nhà trường
- **Mục tiêu:** Vận hành nhiều lớp/trường, báo cáo theo vai trò và năm học.

- [ ] Tổ chức/trường/năm học/học kỳ/tổ chuyên môn
- [ ] Quản lý tài khoản giáo viên, lớp và phân quyền
- [ ] Sổ điểm, tổng hợp năng lực, thống kê câu khó
- [ ] Audit xuất dữ liệu, báo cáo ban giám hiệu
- [ ] Giám sát vận hành, sự cố và nhu cầu tăng tải

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

### Trò chơi, AI & mở rộng

- **ID:** `gamification-ai` · **Ưu tiên:** P3 · **Phân hệ:** Mở rộng
- **Mục tiêu:** Đấu trường, huy hiệu và AI chỉ phát triển sau lõi giáo dục.

- [ ] Bảng xếp hạng/đội/XP tùy bật tắt
- [ ] Trò chơi tương tác sử dụng chung Live Quiz engine
- [ ] AI hỗ trợ soạn câu hỏi và bài giảng có người duyệt
- [ ] Gợi ý luyện lại từ dữ liệu học tập được phép
- [ ] Chính sách dữ liệu trẻ em, ngân sách AI và kiểm soát rủi ro
- [ ] Xem xét marketplace sau khi có nhu cầu thật

**Nhật ký / ghi chú:** xem các mục của node tương ứng trong `/admin/roadmap` (có loại Ghi chú / Đã thêm / Đã sửa) và `docs/WORKLOG_AND_RULES.md`.

## Tiêu chuẩn nghiệm thu cho Admin & Roadmap

- [ ] Admin shell và điều hướng có thể dùng tại 360 / 768 / 1280px.
- [ ] Trang `/admin` phân biệt thống kê Supabase thật và chế độ Demo.
- [ ] Sitemap nêu rõ đường dẫn đã có và đường dẫn tương lai, không mở route chưa tạo.
- [ ] Timeline có đường chấm dọc, chấm lớn, card, checklist, log đã thêm/sửa, tìm kiếm và lọc.
- [ ] Thêm/sửa/xóa việc lớn và việc nhỏ; chuyển trạng thái; đổi thứ tự; thêm/xóa ghi chú.
- [ ] Demo lưu trên cùng trình duyệt; Live lưu Supabase, có RLS admin và chống ghi đè phiên cũ.
- [ ] Xuất Markdown/JSON và nhập JSON không làm mất dữ liệu ngoài ý muốn.
- [ ] Kiểm thử an ninh vai trò và CI, deployment READY.

**Lưu ý:** Việc hoàn thành mục tiêu Admin không có nghĩa các mục giáo dục trong checklist này đã được xây dựng.
