# Quy ước tài liệu — Xưởng Công Nghệ

## Mục tiêu

Tài liệu phải dễ tìm, dễ đọc, có chủ sở hữu rõ ràng và không tạo nhiều bản sao cho cùng một vấn đề.

## Quy ước tên file

- Dùng `UPPER_SNAKE_CASE.md` cho tài liệu cấp dự án.
- Tên bắt đầu bằng miền nghiệp vụ: `SUPABASE_`, `WORD_`, `SLIDE_`, `PUBLIC_`, `SYSTEM_`.
- Báo cáo nền tảng tham khảo dùng hậu tố `_DEEP_REVIEW.md`.
- Snapshot kiểm toán có ngày dùng dạng `YYYY-MM-DD`.
- Không dùng `NEW`, `V2`, `FINAL`, số thứ tự hoặc tên mơ hồ.
- Tên viết tắt phải phổ biến hoặc được giải thích ở tiêu đề.

## Quy ước cấu trúc nội dung

Mỗi tài liệu nên có thứ tự:

1. Tiêu đề cấp 1.
2. Phạm vi và trạng thái.
3. Tóm tắt điều hành.
4. Nội dung chính theo heading cấp 2.
5. Quyết định, rủi ro hoặc việc cần làm.
6. Liên kết liên quan.
7. Ngày cập nhật và bằng chứng nếu là audit.

## Metadata tối thiểu

Với tài liệu quan trọng, đặt ngay sau tiêu đề:

- Trạng thái: `CURRENT`, `REFERENCE`, `AUDIT` hoặc `HISTORICAL`.
- Chủ sở hữu: module hoặc nhóm chịu trách nhiệm.
- Cập nhật: ngày gần nhất.
- Nguồn sự thật: file code, migration, PR hoặc deployment liên quan.

## Quy tắc viết

- Viết tiếng Việt nhất quán; giữ nguyên tên API, route, bảng và biến môi trường trong code format.
- Mỗi đoạn chỉ nên chứa một ý.
- Dùng bảng cho so sánh và mapping; dùng danh sách cho checklist.
- Không lặp lại nội dung đã có ở tài liệu chủ sở hữu; hãy liên kết tới tài liệu đó.
- Phân biệt rõ `đã triển khai`, `đã kiểm tra`, `đang chờ` và `chưa thực hiện`.
- Không đưa mật khẩu, JWT, secret, private key hoặc dữ liệu cá nhân nhạy cảm vào Markdown.

## Quy tắc liên kết

- Liên kết tương đối trong cùng thư mục.
- Dùng `docs/README.md` làm entrypoint khi liên kết từ ngoài thư mục.
- Khi đổi tên file, cập nhật mọi liên kết trong `docs/`, `README.md`, issue và workflow có liên quan.

## Vòng đời

- `CURRENT`: nguồn hướng dẫn hiện hành.
- `REFERENCE`: tài liệu tham khảo sản phẩm/thị trường.
- `AUDIT`: ghi nhận tại một thời điểm, không tự động thay thế trạng thái hiện tại.
- `HISTORICAL`: chỉ để truy vết, đặt trong `docs/archive/` khi không còn dùng vận hành.

## Kiểm tra trước khi commit

- Tên file đúng quy ước.
- Tiêu đề phản ánh đúng phạm vi.
- Không có link hỏng.
- Không trùng vai trò với tài liệu khác.
- Có trạng thái và ngày cập nhật nếu là snapshot.
- Không chứa thông tin bí mật.
