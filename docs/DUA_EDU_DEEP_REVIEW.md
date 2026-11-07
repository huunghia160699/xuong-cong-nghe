# Báo cáo rà soát chuyên sâu DUA Edu / DataLab

- Website: https://duaedu.net/
- Ngày rà soát: 07/11/2026
- Phạm vi: trang chủ, tự học, thực hành, bài học, lộ trình, hồ sơ, nhiệm vụ, bảng xếp hạng, bản đồ, vườn, đấu trường, tài nguyên, lớp Zoom, shop, nâng cấp và đấu đội.
- Phương thức: chỉ điều hướng và đọc nội dung; không nhận phần thưởng, mua hàng, ghi tiến độ hoặc thay đổi dữ liệu.

## 1. Kiến trúc sản phẩm

DUA Edu là một hệ sinh thái gồm:

```text
Nội dung học
├── Tự học
├── Thực hành
├── Lộ trình
├── Chứng chỉ
└── Tài nguyên

Động lực học
├── XP
├── DUA Coins
├── Nhiệm vụ
├── Chuỗi ngày học
├── Bảng xếp hạng
└── Phần thưởng

Cộng đồng
├── Chat thế giới
├── Đấu đội
├── Đấu trường
├── Bảng xếp hạng
└── Bản đồ học tập

Thương mại
├── Lớp Zoom
├── EduLab Plus
├── EduLab Pro
├── Shop phần thưởng
└── Feedback nhận Plus
```

Vòng lặp cốt lõi:

```text
Học → Thực hành → Nhận XP → Làm nhiệm vụ → Nhận thưởng → Quay lại học
```

## 2. Trang chủ `/`

### Thành phần

- Chat thế giới.
- Điều hướng: Tự học, Thực hành, Lộ trình, Học thêm, BXH, Vườn Dứa, Nhiệm vụ, Lớp học Zoom, Nâng cấp và Shop.
- Hero giới thiệu SQL, Python và phân tích dữ liệu.
- CTA “Xem lớp tự học” và “Làm bài tập”.
- “Tiếp tục việc học”.
- Nhiệm vụ hằng ngày.
- Cuộc đua XP giữa hai đội.
- Nội dung học tập.
- Các khóa học khởi đầu.
- Bản đồ và cộng đồng.
- Kho tài nguyên.

### Đánh giá

Ưu điểm:

- CTA đầu trang rõ ràng.
- Người học được dẫn thẳng vào học hoặc làm bài.
- “Tiếp tục việc học” giảm ma sát quay lại.
- Nhiệm vụ xuất hiện ngay trên trang chủ.
- Trang vừa là landing page vừa là dashboard cá nhân.

Rủi ro:

- Người mới có thể thấy quá nhiều khái niệm: XP, DUA, nhiệm vụ, đội, vườn, shop.
- Chat cộng đồng hiện diện xuyên suốt và có thể gây phân tán.
- Nên có onboarding giải thích các khái niệm trong lần đăng nhập đầu.

## 3. Tự học `/theory`

### Nội dung

- Growth Analytics.
- Data Mindset.
- DA101.
- SQL.
- Python.
- Power BI.
- Xác suất và thống kê.
- Excel.
- Google Sheets.
- Machine Learning.
- AI.

### Bộ lọc

- Tất cả.
- Cơ bản.
- Trung cấp.
- Nâng cao.
- Phổ biến.
- Miễn phí.

### Metadata khóa học

Mỗi khóa hiển thị tên, mô tả, số bài, cấp độ, số người tham gia, trạng thái miễn phí/Plus/Pro, chia sẻ và ghi danh.

Ví dụ:

- DA101: 16 bài.
- SQL cơ bản: 36 bài.
- Python cơ bản: 33 bài.
- Python trung cấp: 42 bài.
- SQL nâng cao: 46 bài.
- Python nâng cao: 45 bài.

### Nhận xét

Điểm mạnh là phân loại nội dung tốt và mô tả gắn với năng lực nghề nghiệp. Điểm cần cải thiện là danh sách dài; nên có tìm kiếm nổi bật hơn, đề xuất theo mục tiêu và nhãn “đang học dở”.

## 4. Chi tiết khóa học lý thuyết

Trang khóa học hiển thị:

- Breadcrumb.
- Tên khóa.
- Nhãn miễn phí.
- Ghi danh để bắt đầu.
- Yêu cầu đăng nhập.
- Chia sẻ lớp.
- Nút ghi danh.

Luồng sản phẩm:

```text
Xem khóa → Ghi danh → Theo dõi tiến độ → Tiếp tục bài đang học
```

Khi người dùng đã ghi danh, nên ưu tiên hiển thị bài tiếp theo, phần trăm hoàn thành và nút “Tiếp tục học”.

## 5. Thực hành `/practice`

### Các chương trình

- Python cơ bản: 158 bài.
- SQL cơ bản: 128 bài.
- Python Data Analyst: 160 bài.
- Python tư duy: 150 bài.
- Python visualization: 100 bài.
- SQL nâng cao: 120 bài.
- Các case study ngân hàng, marketing, sản phẩm, tín dụng và bán lẻ: thường 40 bài mỗi bộ dữ liệu.

### Định hướng nội dung

DUA dạy bằng bối cảnh thực tế:

- Gian lận ngân hàng.
- Thu hồi công nợ.
- Digital Banking.
- Product Analytics.
- Marketing Analytics.
- Credit Analytics.
- Retail Banking.

Đây là điểm mạnh vì chuyển từ học cú pháp sang giải bài toán nghề nghiệp.

### Nhận xét

Khối lượng bài lớn và phân tầng Free/Plus/Pro rõ. Nên bổ sung các chế độ “15 phút”, “bài tiếp theo phù hợp” và lộ trình theo mục tiêu nghề nghiệp.

## 6. Giao diện bài thực hành Python

Đã kiểm tra một bài cụ thể.

### Thành phần

- Breadcrumb.
- Tên khóa và bảng xếp hạng lớp.
- Bài trước/bài tiếp.
- Số bài hiện tại, ví dụ 9/158.
- Lưu bài và ghi chú.
- Danh sách bài.
- Đề bài và yêu cầu.
- Kết quả mong muốn.
- Dữ liệu đầu vào.
- Editor Python.
- Gợi ý code bằng Ctrl + Space.
- Chạy thử.
- Kiểm tra bài.
- Xem đáp án.
- Output.

### Luồng UX

```text
Đọc đề → Viết code → Chạy thử → Kiểm tra → Nhận kết quả → Sang bài tiếp
```

Đây là trải nghiệm mạnh nhất của nền tảng. Đề bài, editor và output nằm trong cùng ngữ cảnh; có code khởi đầu, phím tắt và điều hướng tuần tự.

Nên bổ sung autosave bản nháp, trạng thái “đã lưu” rõ ràng, giải thích lỗi runtime thân thiện và kiểm thử accessibility/mobile cho editor.

## 7. Lộ trình `/roadmap`

### 8 chặng

1. Hiểu công việc Data Analyst.
2. Làm việc với bảng tính.
3. Truy vấn dữ liệu bằng SQL.
4. Làm sạch và kiểm chứng.
5. Thống kê và suy luận.
6. Python cho phân tích.
7. Power BI và mô hình dữ liệu.
8. Dự án từ đầu đến cuối.

Mỗi chặng có mục tiêu, kỹ năng, lớp lý thuyết, bài thực hành, số bài hoàn thành và case study liên quan.

### Đánh giá

Roadmap không chỉ là danh sách khóa học mà giải thích học trước gì, học sau gì và khi nào áp dụng công cụ. Người học có thể tự đánh dấu chặng; mô hình này đơn giản nhưng nếu chỉ lưu trên thiết bị sẽ khó đồng bộ đa thiết bị và không phù hợp cho chứng nhận chính thức.

## 8. Hồ sơ `/profile`

Hiển thị:

- Tên và cấp độ.
- EXP.
- Tổng quan.
- Việc học.
- Lịch học.
- Điểm danh.
- Huy hiệu.
- Tài khoản.
- Khóa đang học.
- Số bài hoàn thành.
- Nút học tiếp.

Đây là trung tâm tiến độ cá nhân. Mô hình phù hợp cho Xưởng Công Nghệ:

```text
Tổng quan → Đang học → Roadmap → Hoạt động gần đây → Huy hiệu → Bài tiếp theo
```

## 9. Nhiệm vụ `/missions`

Bốn nhiệm vụ hằng ngày:

- Học thêm một điều mới.
- Ra sân luyện tay.
- Nạp đầy năng lượng bằng XP.
- Ghé vườn.

Mỗi nhiệm vụ có mô tả, tiến độ, phần thưởng và CTA dẫn đến đúng khu vực. Có phần thưởng riêng và phần thưởng lớn khi hoàn thành cả bốn.

Quy tắc quan sát được:

- Nhận một lần mỗi ngày.
- Chỉ tính lần hoàn thành đầu tiên.
- Quà chưa nhận không chuyển sang ngày sau.
- DUA không cộng thêm XP.

Đây là gamification có mục tiêu vì mỗi nhiệm vụ đều thúc đẩy hành vi học thật.

## 10. Bảng xếp hạng `/leaderboard`

Các dạng:

- Top chăm học.
- Tuần này.
- Tuần trước.
- Tổng.
- Top đội.
- Top tài phiệt.
- Top chuyên cần.

Quy tắc được công khai: Level tính từ XP, XP đến từ bài học và bài thực hành, bảng có chu kỳ tuần, có phần thưởng và hiển thị khoảng cách đến cấp kế tiếp.

Cần có tùy chọn ẩn danh/tắt leaderboard, đặc biệt khi áp dụng cho học sinh nhỏ tuổi. Nên hiển thị tiến bộ cá nhân bên cạnh thứ hạng.

## 11. Bản đồ `/world`

Các khu vực:

- Khu tự học.
- Vườn tri thức.
- Đấu trường tri thức.
- Phòng Gym.
- Sảnh danh vọng.
- Khu mua sắm.
- Sự kiện.

Bản đồ biến route sản phẩm thành địa điểm trong một “thế giới học tập”. Đây là khác biệt thương hiệu tốt, nhưng không nên bắt người dùng đi qua bản đồ để thực hiện tác vụ nhanh; menu thông thường vẫn phải luôn có.

## 12. Vườn `/garden`

### Tính năng

- Hồ cá.
- Cá vàng và cá Koi.
- Cây trồng.
- Thu hoạch.
- Gieo hạt.
- Tưới nước.
- Bón phân.
- Thu hoạch tất cả.
- Bán sản phẩm.
- Dứa hướng dẫn.
- Kho đồ và trang trí.
- Cấp độ khu vườn.

Vườn tạo hoạt động nhẹ ngoài giờ học và giúp duy trì thói quen đăng nhập. Tuy nhiên, đây nên là tính năng tùy chọn, không trở thành điều kiện bắt buộc để học.

## 13. Đấu trường `/arena`

- 5 câu mỗi trận.
- 15 giây mỗi câu.
- Phòng hệ thống.
- Phòng cộng đồng.
- Tạo phòng.
- Chọn phòng ngẫu nhiên.
- Bảng thành tích 7 ngày.

Luồng:

```text
Vào phòng → Trả lời nhanh → Nhận điểm → So sánh thành tích
```

Nên bổ sung giải thích đáp án sau trận và cơ chế chống spam/gian lận. Tốc độ thi không nên thay thế việc học sâu.

## 14. Đấu đội `/team-battle`

Cơ chế:

- Đội Dưa đấu đội Dừa.
- Người dùng chọn đội.
- XP từ học và thực hành cộng cho đội.
- Đội có XP trung bình cao hơn thắng.
- Quỹ thưởng được phân bổ theo thứ hạng.
- Có điều kiện XP tối thiểu.
- Người 0 XP không được tính vào trung bình.
- Tài khoản bị khóa không được nhận thưởng.

Điểm đáng chú ý là luật được mô tả chi tiết: cách tính trung bình, điều kiện nhận thưởng, tỷ lệ phân bổ, xử lý hòa, đội ít người và phần dư.

Mô hình:

```text
Học cá nhân → Đóng góp đội → Trách nhiệm cộng đồng → Nhận thưởng
```

## 15. Tài nguyên `/resources`

### Loại nội dung

- Dataset.
- Cheatsheet.
- Sách.
- Hướng dẫn.
- Tài liệu phỏng vấn.
- Excel.
- SQL.
- Power BI.

### Chức năng

- Lọc theo loại.
- Tìm kiếm.
- Xem tài liệu.
- Tải tài nguyên.
- Hiển thị nguồn/tác giả.

Điểm mạnh là kho tài nguyên bổ trợ trực tiếp cho học và nghề nghiệp. Khi xây hệ thống tương tự cần kiểm soát bản quyền, quyền phân phối, nguồn ngoài, phiên bản dataset và nội dung tải lên.

## 16. Lớp học Zoom `/courses`

Sản phẩm “Bình Dân học Data” gồm:

- Excel.
- SQL.
- Power BI.
- Data Mindset.
- Đồ án thực tế.
- 15 buổi Zoom.
- Giảng viên hỗ trợ.
- Video học lại.
- Tài liệu.
- Lịch khai giảng.
- Giá trước/sau giảm.
- Số người tham gia.
- Quà tặng.
- Ảnh lớp.
- Sản phẩm học viên.

Landing page có cấu trúc tốt:

```text
Hero → Lợi ích → Hình ảnh lớp → Số liệu → Lịch → Giá
→ Nội dung 15 buổi → Giảng viên → Sản phẩm học viên → CTA
```

## 17. Nâng cấp `/upgrade`

### Free

- Lớp tự học miễn phí.
- Theo dõi tiến độ.
- Điểm danh.
- XP.
- Bảng xếp hạng.
- Cộng đồng chung.

### Plus

- Tất cả lớp tự học.
- Tất cả bài thực hành.
- Hướng dẫn chứng chỉ.
- E-learning miễn phí.

### Pro

- Workshop.
- Meetup.
- Career Talk.
- Study Group.
- Challenge.
- Tài nguyên riêng.
- Tư vấn định hướng.

DUA có nhiều đường chuyển đổi: feedback nhận Plus, học Zoom được tặng Pro, nội dung nâng cao yêu cầu Plus/Pro và shop dùng DUA Coins.

## 18. Đánh giá UX/UI tổng thể

### Điểm mạnh

1. Kiến trúc sản phẩm nhất quán.
2. Navigation lặp lại ở mọi khu vực.
3. Nội dung học và gamification liên kết chặt.
4. XP, nhiệm vụ và shop dùng cùng một logic.
5. Roadmap có tư duy nghề nghiệp.
6. Bài thực hành có tính ứng dụng.
7. Tài nguyên và khóa trả phí hỗ trợ lẫn nhau.
8. Có cộng đồng, chat và sự kiện.
9. Mô hình Free/Plus/Pro rõ.
10. Có nhiều điểm “tiếp tục học”.

### Rủi ro

1. Quá nhiều khái niệm cho người mới.
2. Popup/chat có thể che nội dung.
3. Dashboard dễ quá tải.
4. Một số route phụ thuộc dữ liệu động và có trạng thái loading.
5. Gamification cần onboarding.
6. Bảng xếp hạng cần chính sách riêng tư.
7. Editor code cần kiểm thử accessibility/mobile.
8. Tài nguyên ngoài hệ thống cần kiểm soát bản quyền.
9. Shop và tiền tệ làm tăng chi phí vận hành.
10. Cần phân biệt hành vi học và giải trí.

## 19. Bài học cho Xưởng Công Nghệ

### Nên áp dụng sớm

- Dashboard có “Tiếp tục học”.
- Roadmap theo chặng.
- Bài học có mục tiêu rõ.
- Bài thực hành có phản hồi.
- Thanh tiến độ.
- Nhiệm vụ hằng ngày nhẹ.
- Thư viện công khai.
- Điều hướng theo vai trò.
- Khu vực bắt đầu nhanh.

### Nên làm sau

- Huy hiệu.
- Chuỗi ngày học.
- Bảng thành tích.
- Cộng đồng.
- AI gợi ý.
- Shop phần thưởng.
- Đấu đội.

### Không nên sao chép ngay

- Nhiều loại tiền tệ.
- Bản đồ game lớn.
- Shop vật phẩm.
- Đấu đội có quỹ thưởng.
- Chat toàn hệ thống.
- Nhiều cấp độ trả phí.

## 20. Kiến trúc đề xuất cho Xưởng Công Nghệ

```text
Trang chủ
├── Học gì?
├── Công cụ
├── Roadmap
├── Bài học mẫu
└── Bắt đầu học

Dashboard học sinh
├── Tiếp tục học
├── Roadmap của tôi
├── Bài hôm nay
├── Tiến độ
└── Thành tích

Dashboard giáo viên
├── Lớp học
├── Bài giao
├── Học liệu
├── Kết quả
└── Nhận xét

Dashboard Admin
├── Roadmap tổng
├── Nội dung
├── Người dùng
├── Vai trò
├── Nhật ký
└── Cấu hình

Lớp học bài
├── Mục tiêu
├── Nội dung
├── Thực hành
├── Kiểm tra
├── Phản hồi
└── Bài tiếp theo
```

## Kết luận

DUA Edu đáng tham khảo nhất ở ba lớp:

1. Lớp học tập: tự học, thực hành, roadmap và case study.
2. Lớp duy trì người dùng: nhiệm vụ, XP, leaderboard, garden và arena.
3. Lớp kinh doanh: Free, Plus, Pro, lớp Zoom, tài nguyên và cộng đồng.

Thứ tự ưu tiên phù hợp cho Xưởng Công Nghệ:

1. Roadmap rõ ràng.
2. Luồng “tiếp tục học”.
3. Bài thực hành có phản hồi.
4. Dashboard theo vai trò.
5. Nhiệm vụ hằng ngày nhẹ.
6. Tiến độ và thành tích cá nhân.
7. Thư viện công khai.
8. AI sư phạm.
9. Cộng đồng và gamification nâng cao.

Mô hình nên áp dụng là lấy vòng lặp học tập của DUA Edu, kết hợp với dashboard quản trị an toàn và Roadmap Admin của Xưởng Công Nghệ; không nên sao chép toàn bộ hệ thống game ngay từ đầu.
