# Báo cáo rà soát chuyên sâu VniTeach.net

> Ngày rà soát: 07/11/2026  
> Phạm vi: rà soát website công khai VniTeach.net, kiến trúc điều hướng, hệ sinh thái ứng dụng, thông điệp sản phẩm và các route marketing.  
> Phương thức: duyệt trực tiếp ở chế độ đọc; không đăng nhập Google, không khởi chạy ứng dụng yêu cầu tài khoản, không gửi dữ liệu.

## 1. Tóm tắt điều hành

VniTeach.net định vị là nền tảng chuyển đổi số giáo dục toàn diện, dùng một tài khoản cho nhiều ứng dụng hỗ trợ giáo viên và nhà trường.

Thông điệp chính:

- Đăng nhập một lần cho toàn bộ hệ sinh thái.
- Ứng dụng được quản lý tập trung.
- Có nhóm công cụ dạy học, kiểm tra, lập kế hoạch, quản lý và AI.
- Có cả ứng dụng miễn phí, Option và Advance.
- Có không gian lớp học Vni và các tiện ích dùng ngay trong giờ dạy.

Khác với các nền tảng tập trung vào một LMS hoặc một công cụ thi, VniTeach chọn hướng “hệ điều hành ứng dụng giáo dục”: nhiều app nhỏ, mỗi app giải quyết một nhiệm vụ, cùng chia sẻ tài khoản và định hướng dữ liệu.

## 2. Trang chủ và định vị

Trang chủ có các thành phần:

1. Header với logo VniTeach.net.
2. Navigation: Trang chủ, Giới thiệu, Bảng giá, Hướng dẫn, Tin tức & Tri thức, Liên hệ.
3. Chuyển ngôn ngữ `vi`.
4. Đăng nhập Google.
5. Hero “VniTeach – Hệ sinh thái giáo dục số”.
6. CTA “Trải nghiệm ngay”.
7. Các cam kết: bản quyền chính hãng, SSO, AI hỗ trợ, đồng bộ dữ liệu.
8. Khu vực Không gian lớp học Vni.
9. Bộ lọc ứng dụng theo nhóm.
10. Footer cộng đồng, hỗ trợ, pháp lý và bảo mật.

Hero không chỉ mô tả tính năng mà giải thích mô hình vận hành: người dùng đăng nhập một lần rồi truy cập nhiều dịch vụ. Đây là thông điệp phù hợp khi bán cho giáo viên/trường học vì giảm số tài khoản và quy trình cài đặt.

## 3. Không gian lớp học Vni

Trang chủ giới thiệu khu vực “Không gian lớp học Vni” và một số ứng dụng hoạt động nổi bật:

- VniSchedule: xếp thời khóa biểu.
- VniClock: đồng hồ đếm xuôi/đếm ngược.
- VniPlan: tích hợp năng lực số vào giáo án.

Cách trình bày “đang hoạt động” giúp người dùng phân biệt khu vực lớp học với danh mục app toàn hệ sinh thái.

Đề xuất khi tham khảo cho Xưởng Công Nghệ:

- Có workspace theo trường/lớp.
- Có ngữ cảnh lớp đang chọn khi mở app.
- App dùng chung danh sách lớp, thành viên, năm học và quyền.
- Người dùng không phải chọn lại cùng một lớp ở mỗi ứng dụng.

## 4. App launcher và phân loại

Hệ sinh thái có hơn 21 ứng dụng. Trang chủ cho phép:

- Xem tất cả.
- Lọc theo Giáo án.
- Lọc theo Đề thi.
- Lọc theo Trò chơi.
- Lọc theo Quản lý.
- Lọc theo Tiện ích.
- Tìm kiếm theo tên ứng dụng.

Mỗi card ứng dụng có:

- Tên.
- Nhãn nổi bật nếu có.
- Gói Miễn phí/Option/Advance.
- Mô tả ngắn.
- Nút Hướng dẫn.
- Nút Khởi chạy.

Đây là pattern tốt cho một hệ sinh thái lớn: không đưa toàn bộ chức năng vào sidebar của một app; dùng catalog có filter và search để giảm tải nhận thức.

## 5. Danh mục ứng dụng chính

### 5.1. Giáo án và trình chiếu

- VniPlan: tích hợp năng lực số vào giáo án.
- VniBoard: bảng viết hỗ trợ dạy học.
- VniPowerPoint: thay đổi câu hỏi trong tệp trò chơi PowerPoint.
- VniCam: dùng camera điện thoại để chiếu lên màn hình máy tính.

Nhóm này phục vụ trước và trong giờ dạy. Cần liên kết sâu với lớp, tiết học, tài liệu và trình chiếu thay vì chỉ mở app độc lập.

### 5.2. Đề thi và kiểm tra

- VniTest: tạo, quản lý và tổ chức thi trực tuyến.
- VniPlickers: tạo đề và củng cố kiến thức bằng Plickers.

Nhóm này có tiềm năng kết hợp với ngân hàng câu hỏi, mã phòng, QR, chấm tự động và thống kê.

### 5.3. Trò chơi củng cố kiến thức

- VniMillionaire: trò chơi Ai là triệu phú.
- VniLuckyNumber: quay số may mắn.
- VniLuckyWheel: quay tên ngẫu nhiên.
- VniPuzzle: lật mảnh ghép.
- VniCrossword: ô chữ hàng ngang/dọc.
- VniWordFly: ghép chữ bay.
- VniWordSearch: tìm ô chữ.

Điểm mạnh của nhóm này là chuyển cùng một nội dung thành nhiều hoạt động tương tác. Rủi ro là trải nghiệm có thể phân mảnh nếu mỗi game có luồng tạo câu hỏi riêng.

### 5.4. Quản lý lớp và nhà trường

- VniClass: trợ lý chủ nhiệm số.
- VniYouth: quản lý thi đua và công tác Đoàn trường.
- VniSchedule: xếp thời khóa biểu.
- VniForm: tạo biểu mẫu thu thập thông tin.

Nhóm quản lý mở rộng hệ sinh thái từ “công cụ dạy” sang “vận hành nhà trường”. Đây là lớp dữ liệu nhạy cảm hơn, cần role matrix, audit và chính sách lưu trữ rõ.

### 5.5. Tiện ích

- VniClock.
- VniBookmark.
- VniPDF.
- VniCam.

Các tiện ích đơn mục tiêu có lợi thế onboarding nhanh và tạo thói quen truy cập hằng ngày.

## 6. Mô hình SSO và tài khoản

Website sử dụng CTA “Đăng nhập Google”, đồng thời nhấn mạnh một tài khoản cho toàn bộ hệ sinh thái.

Luồng kỳ vọng:

`Landing → Đăng nhập Google → Workspace → App catalog → Khởi chạy app → quay lại workspace`

Để triển khai an toàn, cần có:

- Identity provider và session chung.
- App entitlement theo gói.
- Role theo trường, workspace, lớp và chức năng.
- Logout toàn hệ sinh thái hoặc logout theo app được mô tả rõ.
- Cơ chế thu hồi session.
- Audit login và app launch.
- Không gửi access token qua URL giữa các app.

## 7. UX của app catalog

Điểm tốt:

- Tìm kiếm theo tên.
- Lọc theo nghiệp vụ.
- Nhãn gói dễ hiểu.
- Card có CTA Hướng dẫn và Khởi chạy.
- Có nhóm nổi bật.

Nên cải thiện:

- Hiển thị trạng thái `available`, `beta`, `coming soon`, `maintenance`.
- Nêu quyền cần thiết trước khi khởi chạy.
- Hiển thị app yêu cầu dữ liệu lớp/học sinh.
- Có mục “Đã dùng gần đây” và “Yêu thích”.
- Có workspace context: trường, năm học, lớp hiện tại.
- Không cho nút Khởi chạy dẫn tới trang trắng hoặc loading vô hạn.

## 8. Các route marketing đã kiểm tra

Navigation có các route:

- `/` — Trang chủ.
- `/gioi-thieu` — Giới thiệu.
- `/bang-gia` — Bảng giá.
- `/huong-dan` — Hướng dẫn.
- `/tin-tuc` — Tin tức & Tri thức.
- `/lien-he` — Liên hệ.

Trong phiên kiểm tra trực tiếp, các route con chuyển URL thành công nhưng phần nội dung chính không render đầy đủ; chỉ hiển thị shell điều hướng, footer và thông báo cookie/quảng cáo. Đây là phát hiện cần xử lý trước khi dùng các route này làm điểm chuyển đổi production.

Khuyến nghị kiểm tra:

- lỗi hydration hoặc client-side data fetch.
- trạng thái loading không kết thúc.
- API/CMS trả dữ liệu rỗng.
- lỗi route khi refresh trực tiếp.
- cookie banner che nội dung hoặc chặn mount.
- CSP, third-party script và consent mode.

## 9. Bảng giá và mô hình gói

Trang chủ hiển thị ba nhãn gói:

- Miễn phí.
- Option.
- Advance.

Chưa nên coi đây là bảng giá hoàn chỉnh nếu route `/bang-gia` chưa render đầy đủ. Khi hoàn thiện cần công bố:

- Tính năng theo gói.
- Giới hạn người dùng/lớp/app.
- Dữ liệu được lưu bao lâu.
- Hỗ trợ và SLA.
- Điều kiện nâng/hạ gói.
- Gia hạn, hóa đơn, hoàn tiền.
- Quyền dùng thử.
- Entitlement có hiệu lực ở tất cả app như thế nào.

## 10. Hướng dẫn sử dụng

Card mỗi app có nút Hướng dẫn. Đây là điểm quan trọng với hệ sinh thái nhiều ứng dụng.

Hướng dẫn tốt nên có:

1. Mục tiêu ứng dụng.
2. Ai được dùng.
3. Chuẩn bị trước khi mở.
4. Luồng 3–5 bước có screenshot.
5. Cách tạo/lưu/chia sẻ.
6. Quyền dữ liệu.
7. Xử lý lỗi và liên hệ hỗ trợ.
8. Video ngắn hoặc demo.

Nên có một trung tâm trợ giúp thống nhất thay vì mỗi app dùng một kiểu tài liệu.

## 11. Nội dung, cộng đồng và pháp lý

Footer liên kết tới:

- YouTube.
- TikTok.
- X/Twitter.
- Instagram.
- Threads.
- Hướng dẫn sử dụng.
- Bảng giá dịch vụ.
- Liên hệ hỗ trợ.
- Privacy Policy.
- Terms of Service.
- Cookie & Google AdSense.

Việc công khai các nhóm pháp lý và cộng đồng tạo cảm giác sản phẩm đang được vận hành thật. Tuy nhiên cần bảo đảm:

- Link pháp lý mở được.
- Nội dung chính sách khớp với SSO/AI/Google Analytics/AdSense.
- Consent cookie không làm hỏng app.
- Có kênh xóa tài khoản và yêu cầu dữ liệu.
- Có thông tin chủ thể xử lý dữ liệu.

## 12. Điểm mạnh

1. Định vị hệ sinh thái rõ hơn một app đơn lẻ.
2. SSO là thông điệp có giá trị cho trường học.
3. App catalog chia theo nghiệp vụ dễ hiểu.
4. Có cả dạy học, kiểm tra, quản lý và tiện ích.
5. Nhiều trò chơi giúp tái sử dụng nội dung lớp học.
6. Có app miễn phí để giảm rào cản dùng thử.
7. Có hướng dẫn, bảng giá, cộng đồng và pháp lý ở footer.
8. Khả năng mở rộng theo app mà không làm một màn hình quá phức tạp.

## 13. Rủi ro và điểm cần cải thiện

- Nhiều app dễ tạo trải nghiệm rời rạc.
- SSO tăng tác động khi một phiên hoặc quyền bị cấu hình sai.
- Các app quản lý lớp chứa dữ liệu nhạy cảm hơn app trò chơi.
- Nhãn Free/Option/Advance chưa đủ để hiểu entitlement.
- Route marketing không render đầy đủ trong lần kiểm tra.
- Nút Khởi chạy cần có fallback và trạng thái lỗi rõ.
- Nếu mỗi app có database riêng, đồng bộ người dùng/lớp sẽ phức tạp.
- Nếu dùng chung database, RLS và boundary giữa app phải rất chặt.
- Cookie/AdSense/third-party script có thể ảnh hưởng performance và privacy.
- Hướng dẫn cần được version hóa theo app và phiên bản.

## 14. Bài học áp dụng cho Xưởng Công Nghệ

VniTeach gợi ý một lớp “Xưởng App Hub” cho Xưởng Công Nghệ:

### App Hub

- Header workspace.
- App catalog theo Học, Dạy, Kiểm tra, Công cụ, Quản trị.
- Search và filter.
- Recent/Favorites.
- Trạng thái availability.
- Entitlement theo role/gói.

### Shared context

- Trường/workspace.
- Năm học.
- Lớp hiện tại.
- User role.
- Course/lesson/question bank dùng chung.

### Launch contract

Mỗi app phải nhận context an toàn từ server:

- `user_id`.
- `workspace_id`.
- `role`.
- `class_id` nếu hợp lệ.
- `entitlements`.
- `session_id` không lộ secret.

### Ưu tiên triển khai

1. App Hub read-only và catalog thật.
2. SSO/Auth và role boundary.
3. Shared lớp/học viên/nội dung.
4. Teacher Studio và Student learning.
5. Live Quiz/Slides.
6. Tools như typing, Word/Excel, coding.
7. Games dùng chung question bank.
8. School analytics và commerce.

## 15. Kết luận

VniTeach đáng tham khảo nhất ở cấp độ kiến trúc sản phẩm: một tài khoản, một catalog và nhiều ứng dụng giải quyết các công việc khác nhau của nhà trường. Mô hình này phù hợp với Xưởng Công Nghệ nếu được xây trên hợp đồng dữ liệu dùng chung, phân quyền theo workspace và release gate nghiêm ngặt.

Không nên bắt đầu bằng việc tạo hàng chục app. Nên bắt đầu bằng App Hub, SSO, lớp học, nội dung và một vài luồng có giá trị cao; sau đó tái sử dụng cùng dữ liệu cho Quiz, Slides, Live Quiz, Coding Lab, game và báo cáo.

Báo cáo này là rà soát sản phẩm/giao diện tại thời điểm kiểm tra, không phải kiểm toán bảo mật, kiểm định SSO hay đánh giá độc lập về pháp lý.
