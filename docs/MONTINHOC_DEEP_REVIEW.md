# Báo cáo rà soát chuyên sâu montinhoc.vn

> Ngày rà soát: 07/11/2026  
> Phạm vi: rà soát trực tiếp trang công khai, kho bài tập, thư viện, đăng nhập và mô hình sản phẩm của `montinhoc.vn`.  
> Phương thức: đọc và điều hướng ở chế độ không gây thay đổi; không đăng nhập, không giao bài, không nộp bài và không gửi dữ liệu học sinh.

## 1. Tóm tắt điều hành

Môn Tin học là nền tảng quản lý dạy và học Tin học cho trường học Việt Nam, bao phủ chương trình GDPT từ lớp 3 đến lớp 12.

Sản phẩm tập trung vào bốn vấn đề:

- Giao và thu bài tập Tin học.
- Chấm tự động code/SQL theo test case.
- Chấm nhiều dạng bài khác nhau, không ép mọi bài vào trắc nghiệm.
- Đưa AI vào trong kịch bản sư phạm có giới hạn, thay vì chatbot tự do.

Các năng lực chính:

- Python, C++, Java, JavaScript, SQL.
- Scratch chạy trên trình duyệt.
- HTML/CSS live preview.
- Trắc nghiệm, Đúng/Sai và tự luận.
- Nộp file Word/Excel/PDF và chấm trực quan.
- AI nhận xét dựa trên bài làm, kết quả chấm và rubric.
- Chống gian lận bằng so khớp bài và log rời màn hình.
- Kho bài tập theo lớp/chủ đề/loại bài.
- Thư viện ebook và video.

## 2. Định vị và trang chủ

Trang chủ định vị rất rõ:

> Nền tảng dạy và học Tin học cho trường học Việt Nam.

Thông điệp bao phủ từ Scratch lớp 3 đến Python lớp 12. Hai lối vào chính:

- Học sinh vào lớp bằng mã lớp.
- Giáo viên đăng nhập bằng tài khoản Google của trường.

Trang chủ trình bày demo chấm Python theo từng test case, gồm:

- Code mẫu.
- Kết quả từng test.
- Thời gian chạy.
- Test ẩn.
- Số test đúng.
- Điểm dự kiến.

Các số liệu nổi bật:

- 7 chủ đề GDPT.
- 6+ ngôn ngữ lập trình.
- Khối 3–12.
- Có điểm bài code trong dưới một phút.

Cách dùng minh họa bằng test case giúp người dùng hiểu giá trị sản phẩm nhanh hơn so với mô tả chung chung.

## 3. Hệ tính năng cốt lõi

### 3.1. Chấm tự động đa ngôn ngữ

Nền tảng quảng bá chấm real-time cho Python, C++, Java, JavaScript và SQL. Học sinh nhận biết đúng/sai theo từng test case ngay sau khi nộp.

Giá trị:

- Giáo viên không phải chạy từng bài thủ công.
- Học sinh nhận phản hồi gần như ngay lập tức.
- Có thể dùng test công khai và test ẩn.
- Có thể tính điểm dự kiến và thời gian chạy.

Điểm cần kiểm soát khi triển khai:

- Cô lập sandbox.
- Giới hạn CPU, RAM, thời gian và hệ thống tệp.
- Chặn mạng ngoài.
- Kiểm soát vòng lặp vô hạn.
- Log biên dịch/chạy và xử lý lỗi thân thiện.

### 3.2. AI hỗ trợ nhận xét

AI đọc:

- Bài làm.
- Kết quả chấm.
- Rubric.
- Tiêu chí điểm.

Sau đó đề xuất nhận xét và điểm từng tiêu chí để giáo viên duyệt.

Mô hình “AI đề xuất, giáo viên duyệt” phù hợp giáo dục hơn việc tự động công bố điểm không kiểm soát.

### 3.3. Chấm trực quan trên file

Giáo viên có thể gạch chân, viết nhận xét, đóng dấu Đúng/Sai trên Word, Excel hoặc PDF, tương tự bút đỏ số hóa.

Tính năng này phù hợp với các bài:

- Báo cáo.
- Bài thực hành Office.
- Bài dự án.
- Sản phẩm thiết kế.
- File cần nhận xét theo vị trí.

### 3.4. Scratch trên trình duyệt

Project `.sb3` được chạy trực tiếp trên trình duyệt, hiển thị khối lệnh màu sắc và hỗ trợ kiểm tra rubric theo từng khối.

Lợi ích:

- Không cần cài Scratch Desktop.
- Giảm lỗi môi trường.
- Giáo viên có thể xem sản phẩm ngay trên hệ thống.

### 3.5. HTML/CSS live preview

Học sinh viết code và xem trang web chạy ngay bên cạnh. Giáo viên chấm dựa trên kết quả thực tế, không chỉ dựa vào file tải lên.

Cần lưu ý sandbox iframe, giới hạn script và chống nội dung độc hại khi chạy mã học sinh.

### 3.6. Chống gian lận

Sản phẩm nêu hai hướng:

- So khớp bài nộp tương tự kể cả khi đổi tên biến.
- Ghi log thời gian thực khi học sinh rời màn hình lúc thi.

Đây là cơ chế hỗ trợ giáo viên, không nên xem là bằng chứng duy nhất. Cần công bố rõ dữ liệu nào được thu thập, thời hạn lưu và cách xử lý nhầm lẫn.

### 3.7. Hệ thi ba phần

Hệ thống hỗ trợ:

- Trắc nghiệm.
- Đúng/Sai từng ý theo thang điểm THPT mới.
- Tự luận.
- Mỗi học sinh một mã đề riêng.

Điều này cho thấy sản phẩm không chỉ là IDE chấm code mà còn bao phủ kiểm tra lý thuyết và đánh giá viết.

## 4. AI trong bài giảng

Đây là phần khác biệt lớn nhất của montinhoc.vn. AI được đóng gói thành kịch bản sư phạm do giáo viên thiết kế, có giới hạn lượt và cho phép xem lại toàn bộ tương tác.

Có tám dạng block:

### 4.1. Phản biện AI

AI cố ý đưa ra một tuyên bố sai. Học sinh phải chỉ ra lỗi và phản biện đến khi lập luận đúng.

Mục tiêu: rèn thói quen kiểm chứng, không tin AI ngay lập tức.

### 4.2. Trợ giảng AI theo chủ đề

Học sinh hỏi tự do nhưng AI chỉ trả lời trong phạm vi chủ đề giáo viên đặt. Câu hỏi ngoài phạm vi bị từ chối lịch sự.

Mục tiêu: giữ AI trong ranh giới bài học.

### 4.3. Nhập vai cùng AI

AI đóng vai khách hàng, nhà tuyển dụng, người lạ trên mạng hoặc tình huống thực tế. Cuối hội thoại có nhận xét đối chiếu tiêu chí.

Mục tiêu: luyện kỹ năng xử lý tình huống.

### 4.4. AI vấn đáp

AI chủ động hỏi bám sát bài học và điều chỉnh câu hỏi theo câu trả lời.

Mục tiêu: tự luyện kiểm tra miệng riêng tư trước giờ học.

### 4.5. AI dấu mặt

AI mô phỏng kẻ lừa đảo trực tuyến như trúng thưởng giả, giả nhân viên ngân hàng hoặc tình cảm giả trên mạng.

Mục tiêu: rèn nhận diện dấu hiệu lừa đảo.

### 4.6. AI tranh biện

AI giữ lập trường đối lập và liên tục phản bác. Học sinh phải đưa lập luận và dẫn chứng.

Mục tiêu: rèn tư duy phản biện thay cho học thuộc.

### 4.7. Dạy lại cho AI

Học sinh đảo vai, giải thích kiến thức cho AI đóng vai người mới học.

Đây là cách áp dụng kỹ thuật Feynman: giải thích được cho người khác mới chứng minh hiểu bài.

### 4.8. AI rà lỗi cùng em

Học sinh dán code lỗi. AI chỉ hỏi gợi mở theo kiểu Socratic, không sửa hộ và không đưa đáp án trực tiếp.

Đây là thiết kế tốt để tránh biến AI thành công cụ làm bài thay.

## 5. Các vai trò trong nhà trường

Trang chủ mô tả bốn góc nhìn:

### Giáo viên

- Giao nhiều loại bài trong vài phút.
- Chấm code/SQL tự động.
- Duyệt nhận xét AI.
- Xem lại bài file đã chấm trực quan.

### Học sinh

- Vào lớp bằng mã.
- Không bắt buộc tài khoản Google.
- Nộp bài và thấy điểm code/SQL ngay.
- Làm dự án AI trên trình duyệt.

### Nhà trường/Sở Giáo dục

- Giám sát nhiều lớp và giáo viên.
- Xem báo cáo tổng hợp theo lớp/khối.
- Triển khai đồng bộ toàn trường.

### Phụ huynh

- Theo dõi kết quả.
- Nhận thông báo bài tập và hạn nộp.
- Xem nhận xét của giáo viên.

Mô hình này cho thấy sản phẩm hướng tới triển khai cấp trường, không chỉ một giáo viên cá nhân.

## 6. Quy trình nộp bài

Luồng được trình bày thành bốn bước:

1. Giáo viên tạo bài, chọn loại code, SQL, HTML/CSS, file hoặc quiz, rồi đặt hạn nộp.
2. Học sinh làm và nộp; code/SQL được chấm ngay.
3. AI đọc bài, kết quả chấm và rubric để gợi ý nhận xét.
4. Học sinh nhận điểm và nhận xét; bài file có thể nhận bản đã đánh dấu trực quan.

Đây là một vòng khép kín từ giao bài đến phản hồi, phù hợp làm xương sống dữ liệu của nền tảng.

## 7. Kho bài tập /bai-tap

Kho công khai hiển thị khoảng 300 bài Tin học lớp 3–12 do giáo viên đóng góp và được kiểm duyệt.

### Bộ lọc lớp

- Lớp 3 đến lớp 12.
- Mọi lớp.

### Bộ lọc chủ đề

- Máy tính và xã hội tri thức.
- Mạng máy tính và Internet.
- Tổ chức lưu trữ, tìm kiếm thông tin.
- Đạo đức, pháp luật và văn hóa số.
- Ứng dụng tin học.
- Giải quyết vấn đề với máy tính.
- Hướng nghiệp với tin học.
- Tin học quốc tế.
- STEM.
- Trí tuệ nhân tạo.

### Bộ lọc loại bài

- Lập trình.
- Nộp file.
- SQL.
- HTML/CSS.
- Trắc nghiệm.
- Hỗn hợp.
- Dự án AI.

### Metadata bài tập

Mỗi bài thường có:

- Lớp.
- Loại bài.
- Ngôn ngữ.
- Chủ đề.
- Mức độ: Thông hiểu, Vận dụng, Vận dụng cao.
- Số lượt giao hoặc trạng thái mới.
- Mô tả tình huống.

### Nội dung quan sát

Bài tập có tính ứng dụng, ví dụ:

- Giải thích nghề quản trị CNTT cho người thân.
- Tư vấn nhân sự CNTT cho cửa hàng bán online.
- Viết bài giới thiệu nhóm nghề quản trị.
- Tranh luận nghề quản trị mạng và bảo mật.
- Đề xuất tuyển nhân sự CNTT cho trường học.
- Sửa CSS cho thông báo lớp.
- Thiết kế trang câu lạc bộ và ngày hội sách.
- Bài Python tính điểm, xếp hạng và sửa lỗi chương trình.

Điểm mạnh là đề bài gắn với bối cảnh đời sống, hướng nghiệp và sản phẩm web thay vì chỉ hỏi thuật toán trừu tượng.

## 8. Thư viện /thu-vien

Thư viện cung cấp ebook và video cho Tin học lớp 3–12.

Bộ lọc:

- Ebook hoặc video.
- Lớp 3–12.
- Chủ đề A–G:
  - Máy tính và xã hội tri thức.
  - Mạng và Internet.
  - Lưu trữ và tìm kiếm.
  - Đạo đức và văn hóa số.
  - Ứng dụng tin học.
  - Giải quyết vấn đề.
  - Hướng nghiệp.

Tài liệu quan sát được gồm:

- Thiết kế trang web bán hàng online.
- Học qua dự án Trí tuệ nhân tạo.
- Nghề nghiệp lĩnh vực Công nghệ thông tin.
- Bên trong cỗ máy Trí tuệ nhân tạo, tập 1 và 2.
- Làm chủ lập trình Python phổ thông, tập 1 và 2.
- Tự luyện học sinh giỏi Tin học.
- Chuyên đề Trí tuệ nhân tạo lớp 10, 11, 12.

Một số tài liệu công khai đọc không cần tài khoản, một số tài liệu có biểu tượng khóa yêu cầu đăng nhập.

### Trang ebook chi tiết

Trang chi tiết hiển thị:

- Tên tài liệu.
- Lớp.
- Chủ đề.
- Tag như website, HTML, CSS.
- Mô tả ngắn.
- Trình đọc ebook đang tải.

Mô hình trình đọc trực tiếp trên trình duyệt giảm nhu cầu tải file và thuận lợi cho quản lý bản quyền.

## 9. Chương trình GDPT

Nền tảng chia chương trình thành bốn tầng:

### Lớp 3–5

- Làm quen máy tính.
- Scratch.
- Phần mềm cơ bản.

### Lớp 6–9

- Python cơ bản.
- Phần mềm văn phòng.
- Internet và mạng.
- Cơ sở dữ liệu đơn giản.

### Lớp 10–11

- Excel nâng cao.
- Cơ sở dữ liệu.
- Mạng máy tính.
- Thuật toán với Python/C++.

### Lớp 12

- Cơ sở dữ liệu quan hệ.
- Thiết kế web HTML/CSS.
- Lập trình hướng đối tượng.
- Nhập môn AI.

Trang còn nhấn mạnh cập nhật sách giáo khoa thống nhất năm 2026, với kho bài tập bám từng bài và từng tiết.

## 10. Đăng nhập

### Học sinh

Luồng học sinh dùng tên đăng nhập và mật khẩu, vào lớp theo mã giáo viên cung cấp. Trang đăng nhập nhấn mạnh không cần tài khoản Google.

### Giáo viên

Giáo viên đăng nhập bằng tài khoản Google của trường.

Trang đăng nhập cũng tóm tắt các loại bài được hỗ trợ:

- Python.
- C++.
- SQL.
- HTML/CSS.
- Scratch.
- Quiz/trắc nghiệm.
- File Word/Excel.
- Ngân hàng câu hỏi.
- AI nhận xét.
- Dự án AI.

Cách tách lối vào giáo viên/học sinh giúp giảm nhầm vai trò.

## 11. Điểm mạnh

1. Định vị chuyên biệt, không bị loãng như LMS đa môn.
2. Bao phủ chương trình Tin học lớp 3–12.
3. Chấm code real-time theo test case.
4. Hỗ trợ nhiều ngôn ngữ và nhiều loại bài.
5. Có chấm file trực quan cho bài thực hành.
6. AI được đóng gói thành kịch bản sư phạm có giới hạn.
7. Kho bài tập có metadata lớp, chủ đề, ngôn ngữ và mức độ.
8. Bài tập gắn với bối cảnh nghề nghiệp và đời sống.
9. Thư viện ebook/video có lọc theo chương trình.
10. Có tầm nhìn triển khai cho giáo viên, học sinh, nhà trường và phụ huynh.

## 12. Rủi ro và điểm cần cải thiện

- Chấm code đa ngôn ngữ đòi hỏi sandbox và giám sát tài nguyên rất chặt.
- AI trong giáo dục cần kiểm soát dữ liệu học sinh, prompt injection và nội dung ngoài phạm vi.
- Log rời màn hình có thể tạo cảnh báo nhầm và cần chính sách minh bạch.
- Chấm bài file trực quan cần lưu phiên bản, quyền truy cập và audit log.
- Kho bài tập cần quy trình kiểm duyệt, gắn chuẩn đầu ra và cập nhật theo SGK.
- Thư viện có nội dung khóa cần nêu rõ điều kiện truy cập.
- Phụ huynh và nhà trường cần phân quyền dữ liệu theo lớp/khối/trường.
- Tài khoản học sinh không dùng Google cần cơ chế cấp mã, reset và chống chia sẻ tài khoản.
- Chạy HTML/CSS/Scratch và code học sinh cần cô lập khỏi hệ thống máy chủ.
- Với AI chấm/nhận xét, giáo viên phải có quyền sửa, từ chối và giải thích điểm.

## 13. Bài học áp dụng cho Xưởng Công Nghệ

Nếu xây mô hình tương tự, nên tách miền dữ liệu:

- `curriculum`: lớp, chủ đề, chuẩn đầu ra, SGK.
- `assignments`: bài tập, rubric, hạn nộp, loại bài.
- `submissions`: bài nộp, phiên bản, trạng thái.
- `judging`: test case, sandbox run, điểm, log.
- `review`: nhận xét giáo viên, annotation trên file, lịch sử sửa.
- `ai_sessions`: kịch bản, lượt hội thoại, giới hạn, consent.
- `classes`: lớp, thành viên, vai trò và mã tham gia.
- `library`: ebook, video, quyền đọc và tiến độ.
- `analytics`: báo cáo cá nhân, lớp và trường.
- `audit`: truy cập, chấm điểm, export, xóa dữ liệu.

Thứ tự triển khai khuyến nghị:

1. Lớp học, bài tập, nộp bài và quiz.
2. Chấm Python trong sandbox.
3. Kho bài tập theo lớp/chủ đề.
4. Chấm file và nhận xét.
5. Thư viện tài liệu.
6. C++/Java/JavaScript/SQL.
7. AI nhận xét có giáo viên duyệt.
8. AI kịch bản tương tác.
9. Báo cáo cấp trường/phụ huynh.

## 14. Kết luận

montinhoc.vn có định vị rõ và chuyên sâu hơn một LMS thông thường. Giá trị cốt lõi không nằm ở giao diện mà ở khả năng biến bài Tin học thành dữ liệu có thể giao, chạy, chấm, nhận xét và báo cáo.

Điểm đáng học nhất cho Xưởng Công Nghệ là:

- Một hệ thống phải hỗ trợ đúng bản chất từng loại bài.
- Phản hồi nhanh giúp học sinh tự sửa lỗi.
- AI nên nằm trong kịch bản sư phạm, có giới hạn và có người duyệt.
- Kho nội dung phải bám chương trình, lớp và chuẩn đầu ra.
- Chấm tự động chỉ đáng tin khi có sandbox, test case, audit log và quy trình xử lý ngoại lệ.

Báo cáo này là rà soát sản phẩm/giao diện tại thời điểm kiểm tra, không phải kiểm toán bảo mật, kiểm định sandbox hay đánh giá độc lập về bản quyền tài liệu.
