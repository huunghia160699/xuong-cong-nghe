# Báo cáo rà soát chuyên sâu dethiso.vn

> Ngày rà soát: 07/11/2026  
> Phạm vi: rà soát trực tiếp giao diện, điều hướng, nội dung và các luồng tính năng giáo viên trên `dethiso.vn`.  
> Phương thức: chỉ đọc và điều hướng; không tạo đề, không tải tệp, không mở lớp, không gửi bài, không phát hành dữ liệu.

## 1. Tóm tắt điều hành

Đề Thi Số là một nền tảng EdTech tập trung vào giáo viên và hoạt động lớp học. Sản phẩm không chỉ là công cụ tạo đề mà là một bộ công cụ khép kín:

- Tạo đề từ Word/PDF hoặc nhập thủ công.
- Ngân hàng câu hỏi.
- Tạo đề theo ma trận và bản đặc tả.
- AI phân tích yêu cầu, sinh ma trận và tạo đề.
- Trộn nhiều mã đề Word.
- Giao đề cho lớp và chấm trực tuyến.
- Chấm phiếu trắc nghiệm bằng camera điện thoại.
- Chấm tự luận.
- Trình chiếu tương tác.
- PowerPoint add-in kết hợp thẻ trả lời.
- Trò chơi ôn tập theo đội/cả lớp.
- Học liệu và thư viện đề cộng đồng.
- Thống kê, lưu buổi học và dữ liệu kết quả.

Định vị rõ ràng của sản phẩm là “trợ thủ ra đề cho giáo viên”: giảm thao tác hành chính, tăng tương tác trong giờ học và biến cùng một bộ câu hỏi thành nhiều hình thức kiểm tra.

## 2. Trang công khai và định vị sản phẩm

Trang chủ nhấn mạnh ba giá trị:

1. Ra đề nhanh.
2. Trình chiếu tiện lợi.
3. In ma trận và bản đặc tả.

Các CTA chính gồm “Bắt đầu ra đề” và “Khám phá công cụ”. Trang cũng chia sản phẩm thành các nhóm “Dạy học”, “Trò chơi” và “Đấu trường RPG”.

Các thông điệp đáng chú ý:

- Từ ngân hàng câu hỏi đến đề kiểm tra, ma trận và bản đặc tả.
- Đưa file Word vào hệ thống, chỉnh sửa và giao bằng đường dẫn.
- Chấm trắc nghiệm tự động.
- Trình chiếu tương tác trên màn hình.
- Thư viện đề và hướng dẫn thực hành.

Trang chủ có thêm nội dung hướng dẫn trước khi đăng ký, nhấn mạnh rà soát đề sau khi nhập Word và kiểm tra kết quả chấm phiếu. Đây là dấu hiệu tốt về thiết kế sản phẩm thực tế, vì công cụ cảnh báo rủi ro thay vì chỉ quảng cáo tính năng.

## 3. Dashboard giáo viên /teacher/dashboard

Dashboard chào người dùng theo thời gian và đưa thẳng vào câu hỏi “Hôm nay, thầy cô muốn làm gì?”.

Có CTA “Tạo đề mới” và khu “Bắt đầu nhanh” theo chuỗi:

1. Tạo đề đầu tiên.
2. Gửi link đề cho học sinh.
3. Nhận bài nộp đầu tiên.
4. Tạo lớp và giao đề.
5. Thử một trò chơi trên lớp.

Điều hướng được chia thành năm miền:

- Đề thi & câu hỏi.
- Lớp học & kết quả.
- Dạy học trên lớp.
- Trò chơi ôn tập.
- Học liệu tham khảo.

Đây là kiến trúc dashboard tốt: nhóm theo công việc thay vì nhóm theo mô-đun kỹ thuật.

## 4. Tạo đề mới /teacher/exams/create

Luồng tạo đề được thiết kế theo ba bước:

1. Chọn cách tạo.
2. Nhập nội dung.
3. Kiểm tra và lưu.

Hai hướng đầu vào:

- Có file: tải Word hoặc PDF để máy tách câu hỏi và đáp án.
- Chưa có file: nhập từng câu, thêm đáp án, bảng và công thức.

Luồng này phù hợp cả giáo viên đã có đề cũ lẫn người đang soạn đề mới. Điểm cần kiểm soát ở bước kiểm tra cuối là số câu, đáp án, hình ảnh, thang điểm và loại câu hỏi.

## 5. Đề thi /teacher/exams

Trang quản lý đề là nơi tập trung các đề do giáo viên tạo. Từ đây có thể đi sang tạo đề mới, chia sẻ, giao lớp, trình chiếu hoặc sử dụng cho trò chơi.

Trong tài khoản rà soát không có đề nên các luồng phụ thuộc dữ liệu hiển thị trạng thái rỗng. Đây là empty state hợp lý, có CTA quay về tạo đề.

## 6. Ngân hàng câu hỏi /teacher/questions

Chức năng gồm:

- Thêm câu hỏi.
- Lọc theo mức độ Dễ, Trung bình, Khó.
- Lưu trữ câu hỏi dùng lại cho nhiều đề.
- Làm nguồn cho tạo đề theo ma trận.

Trang hiển thị rõ số lượng câu hỏi hiện có. Khi chưa có dữ liệu, trạng thái “0 câu hỏi” giúp người dùng biết bước tiếp theo là thêm câu.

## 7. Tạo đề theo ma trận /teacher/kho-de

Trang cho phép chọn môn trước khi xây ma trận.

Các nhóm môn được quan sát:

- THCS: Toán, Khoa học tự nhiên, Lịch sử và Địa lí, Giáo dục công dân, Công nghệ, Tin học, Giáo dục thể chất.
- THPT: Toán, Vật lý, Hóa học, Sinh học, Lịch sử, Địa lý, Giáo dục Kinh tế và Pháp luật, Tin học, Công nghệ, Công nghiệp, Nông nghiệp, Giáo dục quốc phòng và an ninh.

Một số môn hiển thị “Sắp có”, giúp phân biệt phạm vi đã hỗ trợ với roadmap tương lai.

Giá trị chính của tính năng:

- Chuẩn hóa đề theo môn/lớp.
- Gắn câu hỏi với mức độ và chủ đề.
- Hỗ trợ sinh ma trận và bản đặc tả.
- Giảm việc lập bảng thủ công.

## 8. AI tạo đề + ma trận /teacher/ai-tao-de

Đây là luồng AI có công bố dữ liệu khá minh bạch.

Trước khi dùng, hệ thống thông báo:

- Yêu cầu, lựa chọn môn/chủ đề và ngữ liệu cần thiết được gửi tới Claude của Anthropic.
- Tài liệu được trích thành chữ trước khi gửi.
- Không đưa mật khẩu, thông tin riêng của học sinh hoặc dữ liệu không có quyền chia sẻ.
- Người dùng có thể bỏ chọn đồng ý và dùng cách lập ma trận thủ công.
- Nội dung đã gửi không thể thu hồi tại giao diện.

Luồng làm việc gồm:

1. Nói hoặc gõ yêu cầu.
2. Xem ma trận.
3. Tạo đề.
4. Giáo viên duyệt trước khi in hoặc sử dụng.

Có hỗ trợ giọng nói qua dịch vụ nhận dạng của trình duyệt và cho phép sửa văn bản trước khi phân tích.

Đây là điểm mạnh về UX và minh bạch. Tuy nhiên, production cần thêm:

- Nhật ký phiên bản prompt và ma trận.
- Cảnh báo nội dung AI phải được giáo viên duyệt.
- Giới hạn dữ liệu nhạy cảm.
- Cơ chế xóa dữ liệu trung gian.
- Hiển thị nhà cung cấp và mục đích xử lý trong đúng thời điểm người dùng bật AI.

## 9. Trộn đề Word /teacher/tron-de

Đây là công cụ thực dụng cho giáo viên đã có đề Word.

Tính năng:

- Tải file `.docx`, tối đa 20 MB.
- Đảo câu và đảo phương án.
- Giữ công thức và hình vẽ.
- Chuẩn hóa chữ về Times New Roman 12.
- Tạo 2, 4, 6, 8, 12 hoặc 24 mã đề.
- Đánh số tuần tự hoặc ngẫu nhiên 4 chữ số.
- Chọn đầu đề đầy đủ hoặc gọn.
- Chọn thời lượng 45, 50, 60 hoặc 90 phút.
- Tạo và tải về các mã đề kèm bảng đáp án.

Hệ thống có cảnh báo quan trọng: file tải lên độc lập chưa gắn với đề để chấm phiếu; muốn chấm phiếu phải dùng luồng trộn đề từ trang đề.

Đây là ví dụ tốt về việc báo rõ giới hạn liên thông giữa các tính năng.

## 10. Lớp học /teacher/classes

Chức năng lớp học gồm:

- Tạo lớp.
- Thêm học sinh.
- Giao đề.
- Dùng lớp cho trò chơi, thẻ trả lời và thống kê.

Tài khoản rà soát chưa có lớp nên trang hiển thị “Tạo lớp đầu tiên”. Empty state hướng dẫn đúng hành động tiếp theo.

## 11. Chấm phiếu bằng camera /teacher/cham-bai

Luồng được thiết kế thành bốn bước:

1. Chọn đề thi.
2. Chọn mẫu phiếu.
3. Tải và in phiếu.
4. Chụp/tải ảnh phiếu đã tô.

Các mẫu phiếu quan sát được:

- Phiếu TLTN 2025 của Bộ, gồm trắc nghiệm nhiều lựa chọn, Đúng/Sai và trả lời ngắn.
- Phiếu 20 câu.
- Phiếu 40 câu cắt đôi.
- Phiếu 50 câu chuẩn.
- Phiếu 60 câu.
- Phiếu 100 câu.
- Phiếu 120 câu kiểu cũ.

Cách dùng:

- In A4 đen trắng.
- Học sinh tô bằng bút chì hoặc bút mực đậm.
- Quét bằng camera hoặc chọn ảnh từ thư viện.
- Có thể chọn nhiều ảnh cùng lúc.
- Hệ thống canh bốn góc để nhận dạng.

Cơ chế kiểm soát chất lượng:

- Giữ lại mỗi lần quét.
- Đánh dấu phiếu trùng số báo danh.
- Cảnh báo ô tô mờ hoặc tẩy chưa sạch.
- Gắn cờ để giáo viên kiểm tra.

Đây là tính năng có giá trị vận hành cao vì giảm thời gian chấm nhưng vẫn giữ bước kiểm tra ngoại lệ.

## 12. Chấm tự luận /teacher/cham-tu-luan

Trang có luồng tải danh sách đề động. Chức năng được tách riêng với chấm phiếu, phù hợp bản chất khác nhau của bài tự luận.

Cần kiểm tra thêm khi có dữ liệu thật:

- Cách phân công người chấm.
- Rubric/thang điểm.
- Lưu lịch sử chỉnh điểm.
- Khóa bài sau khi công bố.
- Xuất nhận xét và phản hồi cho học sinh.

## 13. Thống kê /teacher/statistics

Trang thống kê nằm cùng nhóm với lớp học và chấm bài. Đây là vị trí đúng về mental model: giáo viên giao bài, chấm bài rồi xem kết quả.

Cần phát triển sâu các chỉ số:

- Điểm trung bình và phân phối.
- Tỷ lệ hoàn thành.
- Tỷ lệ đúng theo câu.
- Phân tích theo lớp, đề, thời gian.
- Câu hỏi có vấn đề.
- So sánh trước/sau.
- Xuất CSV/PDF.

## 14. Trình chiếu /teacher/present

Trình chiếu dành cho TV hoặc projector.

Tính năng quan sát được:

- Mở fullscreen ngay trên tab mới.
- Sao chép link để mở trên máy chiếu.
- Âm thanh và animation.
- Bấm F để toàn màn hình.
- Bấm Space để hiện đáp án và chuyển câu.
- Bấm H để ẩn đáp án.
- Hỗ trợ trắc nghiệm ABCD, Đúng/Sai 4 mệnh đề và trả lời ngắn.

Khi chưa có đề, hệ thống hiển thị CTA tạo đề. Đây là luồng “prepare → present” khá rõ.

## 15. PowerPoint add-in /powerpoint

Ứng dụng Đề Thi Số cho PowerPoint được cài từ Microsoft Store.

Phạm vi tương thích:

- Windows 10/11.
- Microsoft PowerPoint desktop.
- Không dùng trên điện thoại, Mac, PowerPoint web hoặc WPS.

Luồng sử dụng:

1. Cài ứng dụng một lần.
2. Chọn slide cần chèn.
3. Mở ứng dụng, đăng nhập.
4. Chọn đề và câu hỏi.
5. Mỗi câu trở thành một slide; ghi chú slide có đáp án.
6. Khi trình chiếu, thanh điều khiển xuất hiện ở góc màn hình.
7. Kết nối điện thoại bằng QR để quét thẻ.
8. Xem biểu đồ đáp án và học sinh đúng/sai.
9. Mỗi lần chiếu được lưu thành một buổi trong mục Thẻ trả lời.

Đây là một tính năng tích hợp sâu với quy trình giảng dạy thật, không chỉ là web app độc lập.

## 16. Thẻ trả lời /teacher/cards

Định vị chính: học sinh không cần điện thoại.

Cách dùng:

- Học sinh giơ thẻ đã in.
- Điện thoại của giáo viên quét.
- Kết quả của cả lớp hiện lên màn chiếu.
- Buổi học tự động lưu.

Trang hỗ trợ tạo lớp và thêm học sinh trước khi bắt đầu. Đây là giải pháp tốt cho lớp thiếu thiết bị hoặc cần giảm phụ thuộc vào mạng trên từng máy học sinh.

## 17. Trò chơi tổng hợp /teacher/games

Trang trò chơi có:

- Chinh phục đại dương.
- Chấm điểm nhóm.

### Chinh phục đại dương

- Câu hỏi xuất hiện trong bối cảnh biển.
- Học sinh chọn cá mang đáp án đúng.
- Chọn số cá gây nhiễu từ 3 đến 8.
- Có nút chơi thử.

### Chấm điểm nhóm

- Chia nhóm.
- Bấm chuông giành quyền.
- Có “Ngôi sao hy vọng” nhân đôi điểm.
- Mỗi nhóm quét QR bằng một điện thoại.
- Giáo viên chấm Đúng/Sai trên màn chiếu.

## 18. Đường đua tri thức /teacher/dua

Đây là trò đua xe 3D theo thời gian thực trên điện thoại.

Luật và luồng:

- Đề cần tối thiểu 10 câu trắc nghiệm bốn phương án.
- Giáo viên chọn lớp và mở đường đua.
- Màn hình chiếu hiện mã QR.
- Học sinh quét mã, chọn tên và chọn xe.
- Trả lời đúng giúp tăng tốc.
- Sai hoặc bấm bừa khiến xe lật.
- Va rào chắn làm xe dừng.
- Có trạm xăng và phần thưởng theo số câu đúng.
- Hệ thống tránh gây bất công khi người chơi đang dừng để trả lời.

Đây là gamification có cơ chế gameplay cụ thể, không chỉ đổi màu giao diện.

## 19. Bậc Thang Lên Mây /teacher/may

- Leo tháp mây 3D theo đội.
- Hỗ trợ trắc nghiệm bốn phương án và Đúng/Sai bốn ý.
- Cần tối thiểu năm câu phù hợp.
- Mỗi cổng mây là một câu.
- Cho phép làm tối đa hai lần.
- Nếu sai lần đầu, câu quay lại sau hai tầng.
- Điểm tính theo lượt đầu.
- Cả lớp chia đội tự động.
- Có hộp quà, sấm sét và khiên.
- Kết thúc khi cả lớp về đích hoặc hết giờ.

Thiết kế này kết hợp luyện tập lặp lại với cạnh tranh đội nhóm.

## 20. Rung Chuông Vàng /teacher/cards/rung-chuong-vang

Có hai phương thức trả lời:

- Thẻ QR in sẵn: học sinh không cần máy.
- Điện thoại: vào phòng bằng mã trên màn chiếu.

Thiết lập:

- Chọn lớp/thí sinh.
- Chọn đề hoặc tự soạn.
- Chọn thời gian 10, 15, 20 hoặc 30 giây.
- Chọn luật hồi sinh.
- Học sinh sai hoặc không giơ thẻ sẽ rời sàn.
- Có lượt cứu trợ và phao máy bay giấy.
- Có bảng vinh danh.

Điểm mạnh là hỗ trợ cả lớp truyền thống lẫn lớp có thiết bị.

## 21. Vũ Điệu Tri Thức /teacher/tao-dang

Đây là trò chơi dùng camera để nhận dạng động tác:

- Học sinh đứng trước camera và tạo dáng.
- Có thể gọi từng em, chơi theo đội hoặc cho hai đội đối đầu.
- Có thể dùng điện thoại làm camera hoặc camera laptop.
- Các kiểu trả lời gồm lắc đầu, giơ tay, vườn thú, ngón tay, tay trái/phải, tay lên đầu, dang tay, gật/lắc và ngón cái.
- Có các bộ câu mẫu tiểu học và THCS/THPT.

Đây là tính năng khác biệt cao, nhưng cần kiểm soát ánh sáng, góc máy, quyền riêng tư hình ảnh và độ ổn định nhận dạng.

## 22. Đấu trường RPG /teacher/arena

Trang hiện có khung tính năng nhưng tài khoản chưa có dữ liệu chơi. Cần kiểm tra thêm các luật chiến đấu, vai trò đội, điều kiện thắng, lưu trận và cân bằng điểm khi có đề/lớp.

## 23. Gỡ Bom /teacher/bomb

- Có nút tạo game mới.
- Tài khoản hiện chưa có game.

Nên bổ sung hướng dẫn rõ về cách tạo màn chơi, loại câu hỏi, thời lượng, điều kiện nổ và cơ chế khôi phục khi mất kết nối.

## 24. Nông trại /teacher/nong-trai

Trang hiện không trả về nội dung giao diện trong phiên kiểm tra, nên cần xem lại trạng thái route, loading hoặc yêu cầu dữ liệu. Đây là điểm kỹ thuật cần kiểm tra trước khi công bố rộng rãi.

## 25. Học liệu /teacher/hoc-lieu

Các nhóm học liệu có phí:

- Kho kế hoạch bài dạy.
- Bài giảng PowerPoint theo môn.
- Bộ câu hỏi trắc nghiệm theo bài.
- Khóa học video.
- Khóa học lập trình AI cho giáo viên.

Cách trình bày theo card “sản phẩm → mô tả → xem học liệu” khá dễ mở rộng thành marketplace giáo dục.

## 26. Đề đã chia sẻ /teacher/de-da-chia-se

Có hai trạng thái:

- Trên thư viện.
- Gửi đồng nghiệp.

Tài khoản rà soát chưa có đề nên cả hai đều bằng 0. Việc phân biệt chia sẻ công khai và chia sẻ riêng cho đồng nghiệp là hợp lý về quyền riêng tư.

## 27. Thư viện đề /teacher/thu-vien

Thư viện có:

- Nhập mã đề.
- Chia sẻ đề của tôi.
- Lọc theo môn.
- Chọn môn dạy để đưa lên đầu.
- Danh mục môn học.

Trang hiện báo 25 môn chưa có đề trong tài khoản. Về kiến trúc, thư viện có thể trở thành hệ thống nội dung cộng đồng, nhưng cần kiểm duyệt, báo cáo vi phạm, phiên bản và quyền sao chép.

## 28. Tư vấn thiết kế /teacher/tu-van

Trang cung cấp dịch vụ tư vấn thiết kế bài giảng và đề thi riêng, với:

- Kênh Zalo.
- Email hỗ trợ.
- Chat giờ hành chính mở rộng.
- Cam kết phản hồi trong 24 giờ.

Đây là lớp dịch vụ B2B/B2Teacher bổ sung cho sản phẩm SaaS.

## 29. Cài đặt và tài khoản /teacher/settings

Trang cài đặt hiển thị:

- Tên giáo viên.
- Email.
- Số điện thoại.
- Trường.
- Môn dạy.
- Đăng xuất.
- Xóa tài khoản.

Việc đưa “Xóa tài khoản” thành hành động riêng là tốt, nhưng production cần:

- Xác nhận mật khẩu.
- Cảnh báo không thể khôi phục.
- Hiển thị thời hạn xử lý.
- Hủy yêu cầu trước khi xóa.
- Xóa hoặc ẩn dữ liệu liên quan theo chính sách.

## 30. Bảo mật, quyền riêng tư và điều khoản

Chính sách bảo mật công bố các nhóm dữ liệu:

- Họ tên, email, số điện thoại.
- Tên trường, môn dạy.
- Nội dung đề, câu hỏi, bài tập.
- Câu trả lời, kết quả và điểm.
- IP, trình duyệt, hệ điều hành.
- Thời gian truy cập và lịch sử xem.
- Thời gian làm bài, số lần chuyển tab phục vụ chống gian lận.

Mục đích gồm vận hành, xác thực, thống kê, bảng xếp hạng, chống gian lận và thông báo.

Các điểm bảo mật được nêu:

- Mật khẩu băm bcrypt.
- JWT có thời hạn.
- HTTPS.
- Quyền yêu cầu chỉnh sửa và xóa tài khoản.
- Thời hạn xử lý xóa tối đa bảy ngày.
- Ảnh bài làm được lưu trên Google Drive của đơn vị vận hành trong thời hạn nêu tại điều khoản.
- Dữ liệu không được bán.
- Khi dùng AI, dữ liệu cần thiết được gửi tới Anthropic sau khi người dùng đồng ý.

Điều khoản cũng quy định:

- Chỉ sử dụng cho mục đích giáo dục hợp pháp.
- Không chia sẻ tài khoản.
- Không dùng bot/script để gian lận.
- Người tải lên chịu trách nhiệm về bản quyền.
- Nội dung bật chia sẻ có thể xuất hiện trong thư viện.
- Có tính năng miễn phí và tính phí.

Đây là nền tảng pháp lý khá đầy đủ; cần bảo đảm nội dung chính sách luôn đồng nhất với hành vi thực tế của hệ thống.

## 31. Điểm mạnh

1. Định vị sản phẩm rất rõ: hỗ trợ giáo viên trước và trong giờ dạy.
2. Luồng tạo đề hỗ trợ cả Word/PDF và nhập thủ công.
3. Ma trận, bản đặc tả và thư viện câu hỏi tạo chiều sâu nghiệp vụ.
4. AI có bước đồng ý và cảnh báo dữ liệu trước khi gửi.
5. Chấm phiếu camera có cảnh báo ngoại lệ.
6. PowerPoint add-in tạo khác biệt lớn.
7. Thẻ trả lời không bắt học sinh phải có điện thoại.
8. Nhiều game có luật cụ thể, phù hợp tương tác cả lớp.
9. Có thư viện đề và học liệu để tạo hệ sinh thái.
10. Chính sách quyền riêng tư mô tả khá cụ thể các loại dữ liệu.

## 32. Rủi ro và điểm cần cải thiện

- Nhiều trò chơi làm tăng chi phí bảo trì, kiểm thử và hỗ trợ.
- Một số route phụ thuộc dữ liệu nên dễ rơi vào loading hoặc empty state kéo dài.
- Trò chơi dùng camera cần kiểm soát quyền riêng tư và môi trường lớp.
- AI cần cơ chế duyệt, lịch sử phiên bản và giới hạn dữ liệu.
- Thư viện cộng đồng cần kiểm duyệt bản quyền và chất lượng.
- Chấm phiếu cần bộ kiểm thử ảnh thật với nhiều loại giấy, ánh sáng và nét tô.
- Cần audit log cho điểm số, sửa điểm, xóa tài khoản và chia sẻ đề.
- Trải nghiệm giáo viên mới có thể bị quá tải bởi số lượng công cụ.
- Các thuật ngữ “mã đề”, “ma trận”, “bản đặc tả”, “buổi học” nên có tooltip hoặc hướng dẫn ngắn.

## 33. Bài học áp dụng cho Xưởng Công Nghệ

Nếu xây sản phẩm tương tự, nên chia thành các lớp:

### Lớp 1: lõi dữ liệu

- Câu hỏi.
- Đề thi.
- Ma trận.
- Attempt.
- Lớp học.
- Bài nộp.
- Điểm.
- Audit log.

### Lớp 2: quy trình giáo viên

- Tạo đề.
- Giao đề.
- Chấm.
- Thống kê.
- Trình chiếu.

### Lớp 3: tương tác lớp

- QR.
- Thẻ trả lời.
- Trò chơi đội.
- Camera.
- PowerPoint.

### Lớp 4: nội dung và thương mại

- Thư viện.
- Học liệu.
- Khóa học.
- Tư vấn.

### Lớp 5: AI

- Phân tích yêu cầu.
- Sinh ma trận.
- Sinh đề.
- Duyệt và phiên bản hóa.

Thứ tự triển khai khuyến nghị:

1. Câu hỏi, đề, lớp, giao bài, nộp bài và điểm.
2. Import Word/PDF và ngân hàng câu hỏi.
3. Chấm phiếu và thống kê.
4. Trình chiếu/QR.
5. Thư viện và học liệu.
6. Game lớp học.
7. AI và tích hợp PowerPoint.

## 34. Kết luận

Đề Thi Số có lợi thế lớn ở việc hiểu rất rõ công việc thực tế của giáo viên: soạn đề, in đề, giao bài, chấm nhanh, trình chiếu và tổ chức hoạt động trong lớp. Các tính năng tốt nhất là tạo đề từ tài liệu có sẵn, ma trận/bản đặc tả, chấm phiếu camera, PowerPoint add-in và thẻ trả lời.

Nếu tham khảo cho Xưởng Công Nghệ, nên học mô hình “một dữ liệu câu hỏi, nhiều đầu ra”: cùng một ngân hàng câu hỏi có thể tạo đề, trình chiếu, trò chơi, chấm tự động và thống kê. Tuy nhiên, cần xây lõi dữ liệu, quyền truy cập, audit log và kiểm thử chất lượng trước khi mở rộng AI, camera và game realtime.

Báo cáo này là rà soát sản phẩm/giao diện tại thời điểm kiểm tra, không phải kiểm toán bảo mật, kiểm định thuật toán chấm hay đánh giá pháp lý độc lập.
