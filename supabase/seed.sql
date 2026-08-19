insert into public.courses (id, slug, title, excerpt, description, category, level, status, published_at)
values
  ('10000000-0000-0000-0000-000000000001', 'excel-can-ban', 'Excel căn bản cho công việc', 'Làm chủ bảng tính từ nền tảng.', 'Từ thao tác đầu tiên đến công thức, biểu đồ và báo cáo thực tế.', 'Excel', 'Cơ bản', 'published', now()),
  ('10000000-0000-0000-0000-000000000002', 'nang-luc-so-nen-tang', 'Năng lực số nền tảng', 'Các kỹ năng số thiết yếu.', 'Làm chủ môi trường số an toàn và hiệu quả.', 'Năng lực số', 'Cơ bản', 'published', now()),
  ('10000000-0000-0000-0000-000000000003', 'ai-cho-cong-viec', 'AI cho học tập và công việc', 'Dùng AI có phương pháp.', 'Viết prompt, kiểm chứng và ứng dụng AI vào tác vụ thật.', 'AI', 'Mọi cấp độ', 'published', now());

insert into public.chapters (id, course_id, title, position) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Làm quen với Excel', 1),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Công thức nền tảng', 2);

insert into public.lessons (chapter_id, slug, title, summary, duration_minutes, position, is_preview, status) values
  ('20000000-0000-0000-0000-000000000001', 'giao-dien-vung-lam-viec', 'Giao diện và vùng làm việc', 'Nhận biết các thành phần chính.', 8, 1, true, 'published'),
  ('20000000-0000-0000-0000-000000000001', 'nhap-dinh-dang-du-lieu', 'Nhập và định dạng dữ liệu', 'Tạo một bảng dữ liệu rõ ràng.', 12, 2, false, 'published'),
  ('20000000-0000-0000-0000-000000000002', 'cau-truc-cong-thuc', 'Cấu trúc một công thức', 'Hiểu toán tử và tham chiếu.', 10, 1, false, 'published');
