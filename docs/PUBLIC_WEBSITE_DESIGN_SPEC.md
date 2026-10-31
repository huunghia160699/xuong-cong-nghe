# Đặc tả thiết kế 5 trang Website công khai — Xưởng Công Nghệ

> **PHASE D0: SPEC READY FOR CODE REVIEW — CHƯA TRIỂN KHAI GIAO DIỆN.** Biên soạn 31/10/2026 theo yêu cầu thiết kế lại trang chủ, Giới thiệu, Bảng giá, Tin tức, Liên hệ. Tài liệu này là nguồn chính của PUBLIC-WEB; không tạo nhiều file bản nháp/FINAL mới.
>
> **Sợi dây liên kết module:** [INDEX.md](INDEX.md) → [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) (token & UI hiện hành) → tài liệu này (public site mới) → [PRODUCT_AND_MODULES.md](PRODUCT_AND_MODULES.md) (các nhóm sản phẩm) → [ROADMAP.md](ROADMAP.md) (đợt triển khai) → [WORKLOG_AND_RULES.md](WORKLOG_AND_RULES.md) (checkpoint).
>
> **Chưa thực hiện:** không đổi mã ứng dụng, route, Supabase Auth/RLS, bảng giá thật, DNS, bài viết, email liên hệ hoặc theme Admin/Word/Slides bằng riêng tài liệu này.

## 0. Quyết định thiết kế và nguyên tắc sản phẩm

1. **Website công khai = bản đồ hệ sinh thái.** Người chưa đăng nhập xem các trang marketing, mọi nhóm công cụ, kiến trúc module, công dụng và trạng thái. Đăng nhập mới sử dụng các chức năng thuộc quyền bên trong. Thay đổi hành vi dùng công cụ từ public sang auth-gated phải được kiểm thử từng route; đây là YÊU CẦU TƯƠNG LAI, không phải tình trạng code hiện tại.
2. **Header marketing ngắn gọn:** Logo / Trang chủ / Hệ sinh thái / Giới thiệu / Bảng giá / Tin tức / Liên hệ / Đăng nhập hoặc Không gian của tôi. Danh mục 7 nhóm chức năng nằm trong catalog/mega menu, không nhồi vào navbar.
3. **Nhóm công cụ ở catalog:** Khóa học, Thực hành, Kiểm tra, Công cụ, Tài nguyên, Dự án, Giáo viên. Admin được giới thiệu theo vai trò nhưng không đưa thao tác Admin vào nav công khai.
4. **Trạng thái minh bạch:** Mỗi công cụ có status available (đã có và QA), building (đang phát triển), planned (dự kiến). Chỉ available mới có CTA “Sử dụng”, và CTA này đi qua đăng nhập/quyền server; planned không có link 404. File route tồn tại không tự động đồng nghĩa tính năng hoàn chỉnh.
5. **Không gradient ở toàn bộ 5 trang**: kể cả hero, card, button, background, overlay, ảnh giả lập; không neon/cyan chói. Chỉ màu solid, border mảnh, shadows cực nhẹ, icon tuyến tính và ảnh/screenshot do XCN tự tạo.
6. **Không thông tin giả:** Bảng giá chưa duyệt → không điền giá/giới hạn; Tin tức chưa có bài thật → empty state; Liên hệ chưa có email/địa chỉ xác minh → ẩn. Không lấy Zalo/Hotline/Logo và ảnh của VniTeach hoặc Dribbble.
7. **Tách phần quyền:** Catalog/public content không được expose dữ liệu riêng, Admin/Student/Teacher kiểm session/role tại server và Supabase RLS. Mở một tool bằng URL trực tiếp cũng phải được chặn nếu không có quyền; client redirect chỉ là trải nghiệm người dùng.
8. **Scope palette:** thay đổi màu trong public layout trước, giữ Admin/Word Simulator/Slides như hiện hành cho đến khi có QA và quyết định migrate toàn thương hiệu.

## 1. Design system đề xuất: Calm Slate Blue

### 1.1. Bảng màu chuẩn cho PUBLIC (không phải token đã đổi trong code)

| Token | HEX | Mục đích |
| --- | --- | --- |
| public-ink | **#223044** | Chữ chính/H1/H2 |
| public-primary | **#365F80** | CTA, link quan trọng, active nav |
| public-primary-hover | **#294D6C** | Hover nút chính |
| public-primary-soft | **#EAF1F7** | Active pill, icon-background, section |
| public-muted | **#52687B** | Mô tả, metadata |
| public-page | **#F6F8FB** | Nền toàn trang |
| public-surface | **#FFFFFF** | Card và form |
| public-border | **#D8E1EA** | Border/divider mảnh |
| public-sage | **#DCE8DF** | Accent nhẹ cho giáo viên |
| public-sand | **#EEE7DD** | Accent tài nguyên |
| public-lavender | **#E7E2F1** | Accent kế hoạch/nghiên cứu |
| public-peach | **#F2E3DA** | Accent bài viết/ý tưởng |

Tỷ lệ tương phản tính bằng công thức WCAG: #223044 trên trắng ~13.34:1; #365F80 với chữ trắng ~6.76:1; #52687B trên trắng ~5.79:1; #223044 trên #EAF1F7 ~11.70:1. Lựa chọn #365F80 cho CTA thay vì #5B7FA3 (chỉ ~4.19:1 với chữ trắng, thấp hơn 4.5:1 của chữ thường). Khi code vẫn phải kiểm tra contrast thực tế: chữ thường ≥4.5:1; chữ lớn ≥3:1; đường điều khiển quan trọng ≥3:1. Nguồn chuẩn: https://www.w3.org/TR/WCAG22/ .

**Quy tắc:** pastel dùng làm NỀN và icon container, không dùng làm chữ nhỏ. Không áp palette lên toàn bộ Admin, Word Ribbon, Slides chỉ vì đổi trang công khai; tạo token CSS scoped trong public layout.

### 1.2. Typography, spacing, grids và component

- Font giữ hệ thống: **Manrope** cho headline, **Be Vietnam Pro** cho body/UI; không thêm font từ screenshot tham khảo.
- H1 dùng clamp(2.35rem, 4.3vw, 4.5rem), line-height 1.08–1.15; H2 clamp(1.9rem, 3vw, 3rem); H3 20–24px. Body 16px/1.6, meta 14px, hạn chế chữ dưới 14px.
- Outer container dùng xcn-container và cùng gutter header/footer hiện có; vùng content editorial có thể dùng inner max-width 1360–1440px, không đặt padding lề rời nhau. Giữ outer max-width 1680px cho đến khi đánh giá qua ảnh.
- Section padding-block clamp(52px, 7dvh, 108px); section nhỏ 40–64px; không ép mọi section cao 100vh, không scroll-snap. Hero dựa vào nội dung, không height cố định.
- Card border 1px solid #D8E1EA, radius 18–22px, shadow tối đa 0 8px 30px rgba(34,48,68,.055); tránh shadow dày, card bồng bềnh quá mức.
- Button cao 44–48px, radius 12–14px. Primary solid #365F80 chữ trắng; secondary white + border; tertiary text link. Hover đổi solid color/di chuyển tối đa 2px, focus outline 2px rõ.
- Motion 150–220ms ease-out; không parallax; tôn trọng prefers-reduced-motion, không dùng animation là cách duy nhất truyền đạt trạng thái.
- Icon nét đồng nhất, tránh biểu tượng bàn tay/decorative badges quá mức. Ảnh phải có alt, ưu tiên UI-preview tự thiết kế, không dùng stock kém phù hợp hoặc screenshot của đối thủ.

### 1.3. Responsive/Accessibility acceptance

| Viewport | Header | Grid | Nội dung/kiểm thử |
| --- | --- | --- | --- |
| 360–430 | Logo, menu, login nằm trong menu | 1 cột | CTA width đủ chạm; gutter ~18px; H1 36–42px; không scroll ngang |
| 640–767 | Menu thu gọn nếu thiếu chỗ | 1–2 cột | Form 1 cột, pills có thể cuộn ngang với chỉ báo |
| 768–1023 | Menu tự chuyển theo độ rộng thực | 2 cột | Hero có thể stack, pricing không ép 3 card quá hẹp |
| 1024–1439 | Nav desktop nếu 6 link fit | 3 cột; hero khoảng 55/45 | Anchor dưới sticky header không bị che; focus/ESC |
| 1440–1920–2560 | Header và nội dung chung nhịp lề | 3–4 cột có max width | Không kéo chữ dài quá 75 ký tự; xem 680px-height |

A11y: một H1/trang; header/nav/main/footer, skip link, aria-current, tab order, enter/space/escape cho menu, focus visible, error liên kết với label, hình alt, keyboard, zoom 200%, không phụ thuộc màu. Header sticky 68–76px desktop; mobile ≤64px. Menu mobile accordion, không click hover-only.

## 2. Header, Footer và điều hướng dùng chung

### 2.1. Header

~~~text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Xưởng Công Nghệ]  Trang chủ  Hệ sinh thái ▾  Giới thiệu  Bảng giá  Tin tức  Liên hệ  Đăng nhập │
└────────────────────────────────────────────────────────────────────────────────────────┘
~~~

- Logo về /; active nav nền #EAF1F7 chữ #365F80; bề mặt trắng với border-bottom mảnh; không có gradient.
- Hệ sinh thái mở mega-menu nhóm Khóa học / Thực hành / Kiểm tra / Công cụ / Giáo viên và link “Xem tất cả”; ở giai đoạn đầu có thể dẫn về /#he-sinh-thai, không tạo /he-sinh-thai mới nếu chưa cần SEO.
- Chưa login: Đăng nhập → /dang-nhap. Đã login: “Không gian của tôi” hướng theo profile server-verified: Admin → /admin; Student → /student; Teacher chỉ tới Teacher Studio khi route và quyền thật đã sẵn sàng. Trước đó không tạo link chết.
- Đối với công cụ có sẵn nhưng yêu cầu login: CTA sử dụng dẫn /dang-nhap với safe internal next. Kiểm tra role/authorization ở destination, không dựa vào hide button frontend.

### 2.2. Footer

4 cột ở desktop: Thương hiệu/slogan; Hệ sinh thái; Hỗ trợ & tài nguyên; Pháp lý. Social và contact channels chỉ hiện khi đã xác minh. Không tự sáng tác chính sách pháp lý đã tồn tại; nếu trang chưa có thì không mở link 404. Tablet 2 cột, mobile 1 cột; năm copyright động.

### 2.3. Hiện trạng route để không viết sai spec

Đã có code route trang chủ /, /khoa-hoc, /cong-cu, /cong-cu/trinh-chieu, /cong-cu/mo-phong-word, /student/quiz, auth /dang-nhap. **Chưa có 4 route marketing riêng:** /gioi-thieu, /bang-gia, /tin-tuc, /lien-he. Chưa đổi auth behavior/route bằng tài liệu này.

## 3. TRANG CHỦ / — Product Atlas

**Đích:** vừa mở trang đã hiểu Xưởng Công Nghệ có những nhóm ứng dụng nào, ai dùng, có liên kết gì, cái nào hoạt động; đăng nhập chỉ khi dùng thật. Không fake số lượt sử dụng, đánh giá hay số lượng trường.

### H-01. Hero (nền page solid, text 55% / preview 45%)

~~~text
┌────────────────────────── Hero ─────────────────────────────────┐
│ H1 + mô tả nền tảng             │ Khóa học → Thực hành → Quiz  │
│ [Khám phá hệ sinh thái]          │           ↓ Tiến độ         │
│ [Đăng nhập để bắt đầu]           │ Teacher → Lớp → Học liệu   │
└─────────────────────────────────────────────────────────────────┘
~~~

- H1 mẫu: **“Một hệ sinh thái. Nhiều cách học và thực hành.”**
- Copy: “Khám phá khóa học, phòng thực hành, bài kiểm tra, học liệu và công cụ dành cho giáo viên — được tổ chức thống nhất trong Xưởng Công Nghệ.”
- CTA Khám phá hệ sinh thái → /#he-sinh-thai; Đăng nhập để bắt đầu → /dang-nhap.
- Preview không dùng fake biểu đồ KPI, mà là sơ đồ kiến trúc UI tự tạo, node theo module và trạng thái.

### H-02. Catalog hệ sinh thái (trọng tâm, id=he-sinh-thai)

~~~text
                      Khám phá toàn bộ hệ sinh thái
           [Tất cả] [Học] [Thực hành] [Kiểm tra] [Giáo viên]
     [Khóa học]  [Word/Excel Lab]  [Quiz/đề]  [Trình chiếu]
     [Tài nguyên]  [Dự án]  [Student Hub]  [Teacher Studio]
                         [Phòng máy — Dự kiến]
~~~

- H2 mẫu: **“Từ bài học đến sản phẩm, tất cả trong một nơi.”**
- Mô tả: “Mỗi công cụ giải quyết một nhu cầu cụ thể, nhưng hướng tới việc dùng chung học liệu, bài tập và tiến độ.”
- Card có: icon nền pastel nhẹ, tên, mô tả 2 dòng, 2–4 tag khả năng, nhãn thật “Đã có / Đang phát triển / Dự kiến”, link “Tìm hiểu”. Chỉ công cụ available có thêm CTA “Sử dụng” có auth gate.
- Mỗi filter phải thực sự lọc card và cập nhật kết quả; mobile pills cuộn hoặc wrap không đè nhau.
- **Quản lý phòng máy (LAB-MANAGER)** chỉ hiện ở mục Công cụ dạng Dự kiến, không có nút sử dụng, không tạo agent.
- Source of truth danh mục: registry có owner, group, status, public detail href, protected action href nếu có, feature list. Không tạo status dựa vào việc có route.

### H-03. Kiến trúc liên kết module

~~~text
Khóa học & học liệu ─→ Word / Slides / Quiz ─→ Kết quả & tiến độ
          │                     ↑                       ↑
          └─→ Teacher Studio ─ Lớp/Giao bài ──────────────┘
                    Admin quản lý và phân quyền nền tảng
~~~

- H2: **“Không chỉ nhiều công cụ — mà là một hành trình thống nhất.”**
- 4 bước copy: “Soạn và tổ chức học liệu” → “Học và thực hành” → “Kiểm tra, nhận phản hồi” → “Theo dõi quá trình”.
- Những kết nối mới ở Teacher/Question Bank phải được ghi Dự kiến, không nói đã đồng bộ nếu chưa xong.

### H-04. Khám phá theo vai trò

- H2: **“Một nền tảng, đúng không gian của bạn.”**
- Học sinh: “Học bài, luyện kỹ năng, xem kết quả và tiến độ.”
- Giáo viên: “Tổ chức lớp, chuẩn bị học liệu, giao và đánh giá bài.” — Teacher Studio **đang phát triển trên staging**, chưa Production.
- Quản trị viên: “Quản lý người dùng, nội dung, cấu hình, phân quyền và Roadmap.” — protected Admin.
- Bố cục 3 card, mobile stack; link xem vai trò công khai, CTA sử dụng theo quyền.

### H-05. Showcase công cụ thật

- H2: **“Khám phá các không gian nổi bật.”**
- 4–6 cards: Word Lab, Trình chiếu, Quiz, kho tài nguyên, Teacher Studio, Excel Lab. Có screenshot preview XCN tự tạo khi có; nếu chưa có thì icon + sơ đồ, không dùng screenshot bên ngoài.
- Label status phải chính xác: có route chưa đủ để “Đã có”; cần QA/permission thực.

### H-06. Phương pháp học

H2: **“Học → Luyện → Ứng dụng.”**
1. “Học để hiểu” — “Nội dung gọn, theo chủ đề và có ví dụ sát nhiệm vụ.”
2. “Luyện để vững” — “Thao tác trong phòng thực hành và nhận phản hồi.”
3. “Ứng dụng thật” — “Kết nối kỹ năng thành sản phẩm hoặc dự án.”

### H-07. Bản xem trước giá

H2: **“Bắt đầu theo nhu cầu của bạn.”** Ba nhóm Khám phá / Giáo viên / Trường học & trung tâm, chỉ mô tả đối tượng và quyền dự kiến, **không giá chưa được phê duyệt**. CTA → /bang-gia.

### H-08. Tin tức và tri thức

H2: **“Góc kiến thức và cập nhật.”** 3 bài **published thật** nếu có; nếu chưa có, thông báo “Bài viết chuyên môn đang được biên soạn.” Không fake ngày/tác giả/view count. CTA → /tin-tuc.

### H-09. CTA kết / footer

H2: **“Khám phá trước. Bắt đầu khi bạn sẵn sàng.”** Khám phá hệ sinh thái → /#he-sinh-thai; Đăng nhập → /dang-nhap. Không nhắc CTA login quá nhiều.

SEO: title “Xưởng Công Nghệ | Hệ sinh thái học và thực hành năng lực số”, mô tả 140–160 ký tự thật, canonical và OG. QA: user khách xem đầy đủ catalog, route protected phải qua server Auth, không cards dẫn 404, không snap-scroll.

## 4. GIỚI THIỆU /gioi-thieu

**Mục tiêu:** nói rõ lý do xây hệ sinh thái, sứ mệnh, đối tượng, kiến trúc và lộ trình. Không tự xưng có đối tác, thành tựu hay số liệu chưa kiểm chứng.

~~~text
[Hero: sứ mệnh]
[3 trụ cột: Học → Luyện → Ứng dụng]
[Kiến trúc: Public / Student / Teacher / Admin]
[Đối tượng: Học sinh / Giáo viên / Trường / Người tự học]
[Giá trị cốt lõi: Thực hành, kết nối module, bảo vệ quyền]
[Roadmap minh bạch: Đã có / Đang phát triển / Dự kiến]
[CTA: Khám phá / Liên hệ]
~~~

| Section | Copy mẫu + nội dung | Layout |
| --- | --- | --- |
| A-01 Hero | **“Công nghệ dễ học hơn khi được thực hành.”** “Xưởng Công Nghệ kết nối kiến thức, công cụ và hoạt động thực hành trong một nền tảng thống nhất.” | 60% text + 40% architecture mockup |
| A-02 Sứ mệnh | **“Chúng tôi xây một nơi để học, làm và tiến bộ.”** Ba giá trị: Tiếp cận dễ hơn, Thực hành có mục tiêu, Phản hồi giúp cải thiện | 3 cards |
| A-03 Kiến trúc | **“Được tổ chức theo đúng vai trò.”** Bản đồ Public → Student / Teacher → Admin & nền tảng, ghi trạng thái của mỗi workspace | diagram, mobile vertical |
| A-04 Đối tượng | **“Phù hợp cho nhiều cách học và dạy.”** Học sinh, giáo viên, người đi làm, trường/trung tâm | 4 cards |
| A-05 Nguyên tắc | **“Ít thao tác thừa. Nhiều thời gian cho học tập.”** Học liệu có mục tiêu, module tách trách nhiệm, quyền rõ, nâng cấp theo lộ trình | 2 cột |
| A-06 Lộ trình | **“Phát triển từng bước, minh bạch trạng thái.”** Đã có / Đang phát triển / Dự kiến dựa trên registry thật | timeline |
| A-07 CTA | “Tìm công cụ phù hợp với cách học của bạn.” → /#he-sinh-thai; “Liên hệ” → /lien-he | 2 CTA |

Chưa thêm tên người sáng lập, năm thành lập, đối tác, chỉ số thành công, ảnh chụp phòng máy giả nếu chưa có thông tin được xác nhận.

## 5. BẢNG GIÁ /bang-gia

**Mục tiêu:** giải thích cách dùng, chính sách, quyền lợi và tư vấn, không tự bật billing.

~~~text
[Bảng giá & quyền sử dụng / mô tả rõ chưa công bố giá]
[Khám phá]    [Giáo viên]    [Trường / Trung tâm]
[So sánh chi tiết tính năng / giới hạn nếu đã phê duyệt]
[FAQ: truy cập, đăng ký, phân quyền, dữ liệu]
[CTA: Liên hệ tư vấn]
~~~

| Section | Copy/logic | Điều kiện |
| --- | --- | --- |
| P-01 Hero | **“Lựa chọn cách sử dụng phù hợp.”** “Các quyền lợi và điều kiện triển khai được trình bày theo nhu cầu cá nhân, giáo viên và tổ chức.” | Không hứa billing đang có |
| P-02 Pricing cards | **Khám phá** – tìm hiểu công cụ; **Giáo viên** – quản lý lớp & bài; **Trường/Trung tâm** – nhiều giáo viên, tổ chức và báo cáo. Mỗi card có 5–7 quyền lợi dự kiến đã ghi trạng thái, CTA “Tìm hiểu/Liên hệ” | Không giá số, “phổ biến nhất” hoặc giới hạn giả |
| P-03 Bảng so sánh | Nhóm quyền: nội dung, số lớp, bài nộp, kiểm tra, tài nguyên, storage, hỗ trợ, phân quyền | Nếu chưa có entitlement matrix chính thức → “Đang xác định” |
| P-04 Chính sách | Điều kiện nâng cấp, gia hạn, thanh toán, hỗ trợ và quyền dữ liệu chỉ nếu đã ban hành chính sách | Không hứa hoàn tiền/thanh toán chưa được xây |
| P-05 FAQ | Có thể khám phá khi chưa login? Tài khoản giáo viên gồm gì? Trường cần triển khai thế nào? Dữ liệu được phân quyền ra sao? | Trả lời đúng hiện trạng |
| P-06 CTA | **“Bạn cần phương án phù hợp cho lớp hoặc trường?”** → /lien-he?topic=pricing | Không tạo checkout giả |

**Copy FAQ mẫu:** “Tôi có thể xem các công cụ trước khi đăng nhập không?” → “Có. Danh mục và thông tin sản phẩm được công khai; sử dụng công cụ phụ thuộc trạng thái và quyền tài khoản.” “Giá đã áp dụng chưa?” → “Chính sách giá đang được hoàn thiện và sẽ chỉ công bố khi được xác nhận.”

UI: three pricing cards desktop, 1–2 tablet, 1 mobile; comparison table responsive, tooltip accessible và FAQ accordion keyboard.

## 6. TIN TỨC /tin-tuc

**Mục tiêu:** knowledge hub, bài hướng dẫn, kiến thức Tin học, giáo dục số và cập nhật XCN; không sao chép nguồn khác.

~~~text
[Tin tức & Tri thức]
[Tất cả] [Hướng dẫn] [Tin học] [Giáo dục số] [AI] [Sản phẩm]
[Tìm bài viết, chủ đề hoặc công cụ...]
[Bài nổi bật nếu có bài đã xuất bản]
[Article Card] [Article Card] [Article Card]
[Phân trang] [Liên hệ / Khám phá hệ sinh thái]
~~~

| Section | Copy/logic |
| --- | --- |
| N-01 Hero | **“Kiến thức mới. Cách làm rõ ràng.”** Mô tả: “Chia sẻ về Tin học, phương pháp dạy học, chuyển đổi số và các cập nhật từ Xưởng Công Nghệ.” |
| N-02 Category pills | Tất cả / Hướng dẫn sử dụng / Tin học & ứng dụng / Giáo dục số / AI trong dạy học / Cập nhật sản phẩm / STEM & dự án |
| N-03 Search | Placeholder “Tìm bài viết, chủ đề hoặc công cụ...”, filter sync query string (?q=, ?category=), debounce, URL shareable |
| N-04 Featured | Một bài featured nếu thực sự published; nếu không thì ẩn |
| N-05 Grid | Article card: category, cover, title, summary, tác giả đã xác minh, ngày, thời gian đọc từ dữ liệu thật; 3/2/1 cột |
| N-06 Empty | **“Chưa có bài viết phù hợp. Hãy thử từ khóa hoặc chủ đề khác.”** nút Xóa bộ lọc |
| N-07 CTA | **“Đọc để hiểu, mở công cụ để thực hành.”** → /#he-sinh-thai |

**Data model đề xuất, chưa tạo migration:** article_id, slug, title, summary, content (sanitized), category, tags, cover, author, status(draft/published), published_at, updated_at, reading_minutes. Public chỉ SELECT published; draft chỉ editor/admin xem được, không render fake bài nếu chưa có CMS. URL chi tiết /tin-tuc/[slug] chỉ khi có bài thật. Tìm kiếm có empty/loading/error, pagination server hoặc cursor; SEO canonical/Article structured data bài thật.

## 7. LIÊN HỆ /lien-he

**Mục tiêu:** hỗ trợ, tư vấn trường học, góp ý và hợp tác. Các kênh chỉ xuất hiện nếu được xác minh, không lấy từ screenshot của VniTeach.

~~~text
[Liên hệ & hợp tác]
[Card Email | Zalo | Hotline | Facebook] (chỉ kênh có thật)
┌────────────────────┬──────────────────────────────────┐
│ Thông tin xác minh  │ Form: Tên/Email/Tổ chức/Nhu cầu │
│ Kênh hỗ trợ         │ Lời nhắn / Chính sách / Gửi      │
└────────────────────┴──────────────────────────────────┘
[Giải đáp nhanh / hợp tác] [Social links chính thức] [Footer]
~~~

| Section | Copy/logic |
| --- | --- |
| C-01 Hero | **“Kết nối với Xưởng Công Nghệ.”** Mô tả: “Gửi câu hỏi về công cụ, học liệu, việc triển khai cho lớp học hoặc ý tưởng hợp tác.” |
| C-02 Kênh liên hệ | Email, Zalo, Facebook, Hotline, Social: icon nhẹ cùng phong cách, chỉ xuất hiện nếu có URL/giá trị được xác minh trong config |
| C-03 Form | Họ tên (bắt buộc), email (bắt buộc), tổ chức (tùy chọn), nhu cầu (Hỗ trợ kỹ thuật / Tư vấn trường / Góp ý / Hợp tác), lời nhắn (bắt buộc), consent riêng tư |
| C-04 Liên hệ cho tổ chức | **“Bạn đang triển khai công cụ cho một lớp hoặc trường?”** CTA mở form prefill topic=pricing/school |
| C-05 Social/footer | Logo và mạng xã hội chính thức, không sao chép thông tin từ trang khác |

**Bảo mật khi triển khai form:** chỉ tạo form có nút Gửi sau khi có đầu nhận/backend thật; validation server (Zod), rate-limit, honeypot/spam protection, kiểm CSRF phù hợp, log tối thiểu, chính sách retention/đồng ý, thông báo success chỉ sau khi gửi/lưu thành công. Chưa có backend thì show contact kênh thật hoặc “Kênh liên hệ đang được cập nhật”, không hiển thị form giả. Không tự nhập địa chỉ, số điện thoại hoặc email chưa xác minh.

## 8. Sơ đồ trang và hợp đồng CTA/login

~~~text
/                          Trang chủ + #he-sinh-thai
├── /gioi-thieu              Giới thiệu
├── /bang-gia                Bảng giá
├── /tin-tuc                 Tin tức
├── /lien-he                 Liên hệ
├── /khoa-hoc                Listing đã có
├── /cong-cu                 Listing đã có
├── /dang-nhap               Auth
├── /student                 Student Hub sau login
├── /admin                   Admin sau login và role check
└── Teacher Studio           Đang phát triển trên staging, chưa Production
~~~

- Chưa login: người dùng xem mọi nội dung marketing và catalog; CTA **Sử dụng** của available tool → login với safe local next; planned/building chỉ có thông tin và trạng thái.
- Đã login: role lấy server-side profile, Admin tới /admin, Student tới /student; Teacher chỉ tới workspace khi hoàn tất và được QA. Điều hướng frontend không thay server authorization/RLS.
- Mega-menu “Hệ sinh thái” dẫn tới /#he-sinh-thai hoặc mục chi tiết đã có, không tạo route giả. Logo về /; external link luôn xác minh.
- Bảng giá → /lien-he?topic=pricing; CTA Tin tức → bài published; liên kết qua breadcrumb/return link.

**Phân bổ code đề xuất:** public layout, src/components/public (component tái dùng giữa trang), src/config/navigation.ts, src/config/public-catalog.ts (registry), 5 page.tsx thuộc src/app/(public), CSS scoped (xcn-public). Nếu form/article service cần thiết mới mở src/features/marketing hoặc src/lib/public-content theo domain; không dựng nhiều shared components một lần khi mới dùng 1 nơi.

## 9. Thứ tự triển khai và checklist theo PR

**Mỗi PR chỉ thay một nhóm liên quan, ghi checkpoint ngay lúc xong, không viết lại cả repository.**

| Phase | Việc dự kiến | Kiểm tra để DONE |
| --- | --- | --- |
| **D0 SPEC** | Hoàn thiện file này, link docs, tone màu và nội dung mẫu, không code UI | PR docs CI PASS, không tuyên bố giao diện đã xây |
| **D1 Foundation** | Token scoped/public shell, navbar/mega-menu, footer và shared spacing | Responsive 360/768/1280/1920 + height 680; keyboard, focus, hover, link thật; không đổi Admin/Word/Slides |
| **D2 Homepage** | Hero kiến trúc, catalog + status, vai trò, showcases, CTA | Có registry status, guest xem được toàn kiến trúc, chức năng dùng thật qua auth gate |
| **D3 Giới thiệu** | 7 sections, architecture diagram, roadmap | Route /gioi-thieu, copy và SEO thật, không claim sai |
| **D4 Bảng giá** | 3 nhóm, comparison, FAQ, CTA | Route /bang-gia, không giá/giới hạn/checkout giả |
| **D5 Tin tức** | Index, filter/search, empty, bài thật nếu có CMS | Route /tin-tuc, không rò draft, search URL, paginate/empty hợp lý |
| **D6 Liên hệ** | Contact channels đã xác minh; form sau khi backend được duyệt | Route /lien-he, không info giả, validation/spam/consent khi gửi thật |
| **D7 QA & release** | Test end-to-end 5 trang, SEO, auth/role, responsive, accessibility | pnpm test/typecheck/build, Chromium 360/768/1280/1920, CI PASS; Vercel READY + đúng main SHA/alias |

**Decision gates:** Trước D4 duyệt chính sách giá/quyền, trước D5 duyệt bài thật và nguồn CMS, trước D6 xác nhận kênh liên hệ và backend. D1 cần xem palette qua screenshot thật và tương phản. **Không tự thay đổi database Production hoặc quyền Auth để làm landing page.**

Acceptance chung:
- [ ] Không gradient, không neon, icon đồng bộ, padding Header và sections bằng nhau.
- [ ] WCAG 2.2 AA contrast, semantic landmarks, unique H1, accessible menu/dialog/tabs, keyboard/focus/escape/reduced motion.
- [ ] 360/430/768/1024/1280/1920 và height 680; không tràn, sticky nav không che anchor, zoom 200%.
- [ ] Link marketing guest mở được; protected functions không dùng được chỉ bằng URL khi chưa login; quyền role vẫn ở server/RLS.
- [ ] Không fake pricing/metrics/testimonials/news/contact/social, không có 404 từ catalog.
- [ ] Hình ảnh/asset có quyền sử dụng, ưu tiên tự thiết kế XCN, không copy trực tiếp từ Dribbble/VniTeach.
- [ ] SEO title, description, OpenGraph, canonical và sitemap; article schema chỉ cho bài thật.
- [ ] Cập nhật [WORKLOG_AND_RULES.md](WORKLOG_AND_RULES.md) sau từng bước, [ROADMAP.md](ROADMAP.md) khi trạng thái đổi; GitHub repo Markdown không tự ghi đè Roadmap Supabase Production.
- [ ] Chỉ báo deploy xong khi GitHub main SHA = Vercel READY SHA, domain production alias đúng và CI có kết luận PASS.

## 10. Cơ sở tham khảo, không copy

- 4 hình VniTeach do người dùng gửi ngày 31/10/2026: header/navbar, pricing, knowledge hub với filters/search, contact cards + footer; chỉ học cách tổ chức thông tin.
- [Dribbble Education Landing Pages](https://dribbble.com/search/education%20platform%20landing%20page), [SaaS Pricing](https://dribbble.com/search/saas%20pricing%20page), [SaaS Contact](https://dribbble.com/search/contact%20page%20saas) — học grid, phân cấp và spacing.
- [EdTech SaaS Hero — JA. Parvez/Wingly](https://dribbble.com/shots/27257593-EdTech-SaaS-Website-Hero-Section) — hero nền mềm/feature-preview; không lấy ảnh hay copy.
- [SkillSync AI Learning — Manoj Fernando](https://dribbble.com/shots/25967861-SkillSync-AI-Smart-Learning-Platform-UI) — card dashboard và phân cấp thông tin, **không dùng gradient** của mẫu.
- [Dianoia Educational Platform](https://portal.e-dianoia.com/) — định vị nền tảng nhiều công cụ, không copy branding/claims.
- [WCAG 2.2 — W3C](https://www.w3.org/TR/WCAG22/) — chuẩn tương phản, bàn phím và nội dung.

**Trạng thái 31/10/2026:** D0 đặc tả đã hoàn thành; **D1 đã được triển khai** (Public scoped palette, header/nav/mega-menu/footer, 4 route placeholder) qua PR #71, CI Chromium 5 trang × 4 độ rộng PASS, Vercel READY commit `001bbfc`. D2–D7 chưa hoàn thành. Khi đổi hướng thiết kế, cập nhật đúng file và Worklog thay vì tạo tài liệu v2/final trùng.


**Cập nhật implementation 31/10/2026 — D2–D4:** đã có mã nguồn trên nhánh `feat/public-website-d2-d4-20261031` (homepage Product Atlas, About 7 sections, Pricing so sánh/FAQ không fake giá). Đã tạo registry `src/config/public-catalog.ts` với 3 trạng thái thực; D5/D6 giữ placeholder; D2–D4 đã PASS CI/Chromium: 234 unit, typecheck, build, 5 trang × 4 viewport và Atlas filter/reset (run #41114499566, SHA `177014272`). D7 vẫn cần E2E auth/role và quyết định phát hành. Không tự coi đã deploy. Quyền truy cập công cụ Word/Slides hiện là route công khai được giới thiệu/preview, không gắn nhãn bảo vệ Auth ở client nếu middleware chưa chặn. Không công bố entitlement/giá khi chưa duyệt.


### Implementation 31/10/2026 — D5–D7 (GitHub PR #73)
- D5: `/tin-tuc` có 7 bộ lọc, tìm kiếm đồng bộ `?q=&category=`, empty-state; `src/config/public-articles.ts` chưa có bài duyệt, chỉ xuất bài `published`. Không tạo bài/CMS giả.
- D6: `/lien-he?topic=` hỗ trợ support/pricing/school/feedback/partnership, FAQ, chỉ hiển thị kênh có xác minh qua `src/config/public-contact.ts`. Chưa có email/hotline/social thật, backend/consent nên không bật form.
- D7: `sitemap.ts`, `robots.ts`, Chromium 6 viewport, lọc Tin tức, URL liên hệ, SEO và FAQ; `START-WEB-OFFLINE.cmd` chạy Demo local. Chưa release Production, QA JWT thật và phê duyệt thông tin còn là gate.
