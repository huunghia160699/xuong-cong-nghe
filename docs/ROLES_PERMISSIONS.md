# Roles & Permissions v1.0

| Khả năng | Guest | Student | Teacher | Admin |
|---|---:|---:|---:|---:|
| Xem nội dung public | ✓ | ✓ | ✓ | ✓ |
| Làm quiz miễn phí | ✓ | ✓ | ✓ | ✓ |
| Lưu tiến độ/kết quả | — | own | own | all |
| Ghi danh khóa học | — | own | own | all |
| Tạo ghi chú | — | own | own | all |
| Tạo nội dung học | — | — | own/draft | all |
| Quản lý lớp học | — | — | own | all |
| Xuất bản nội dung | — | — | đề nghị | ✓ |
| Quản lý người dùng | — | — | — | ✓ |
| Quản lý hệ thống | — | — | — | ✓ |

`own` nghĩa là chỉ đọc/ghi dữ liệu gắn với `auth.uid()`. Teacher có trong schema nhưng workspace đầy đủ bị tắt ở MVP. Admin role phải được kiểm tra bằng profile trên server và RLS, không chỉ ẩn/hiện UI.
