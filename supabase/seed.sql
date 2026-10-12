-- Development-only idempotent seed. Use synthetic data, never real student records.
-- Run AFTER all migrations (supabase db reset / Supabase SQL editor).
begin;

insert into public.courses (id,slug,title,excerpt,description,category,level,status,published_at)
values
  ('10000000-0000-0000-0000-000000000001', 'excel-can-ban', 'Excel căn bản cho công việc', 'Làm chủ bảng tính từ nền tảng.', 'Từ thao tác đầu tiên đến công thức, biểu đồ và báo cáo thực tế.', 'Excel', 'Cơ bản', 'published', now()),
  ('10000000-0000-0000-0000-000000000002', 'nang-luc-so-nen-tang', 'Năng lực số nền tảng', 'Các kỹ năng số thiết yếu.', 'Làm chủ môi trường số an toàn và hiệu quả.', 'Năng lực số', 'Cơ bản', 'published', now()),
  ('10000000-0000-0000-0000-000000000003', 'ai-cho-cong-viec', 'AI cho học tập và công việc', 'Dùng AI có phương pháp.', 'Viết prompt, kiểm chứng và ứng dụng AI vào tác vụ thật.', 'AI', 'Cơ bản', 'published', now())
on conflict (slug) do update set
  title=excluded.title, excerpt=excluded.excerpt, description=excluded.description,
  category=excluded.category, level=excluded.level, status='published';

insert into public.chapters (id,course_id,title,position)
values
  ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Làm quen với Excel',1),
  ('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Công thức nền tảng',2),
  ('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','Ứng dụng vào công việc',3)
on conflict (id) do update set title=excluded.title,position=excluded.position;

update public.lessons set slug='giao-dien-va-vung-lam-viec' where chapter_id='20000000-0000-0000-0000-000000000001' and slug='giao-dien-vung-lam-viec' and not exists (select 1 from public.lessons existing where existing.chapter_id='20000000-0000-0000-0000-000000000001' and existing.slug='giao-dien-va-vung-lam-viec');
update public.lessons set slug='nhap-va-dinh-dang-du-lieu' where chapter_id='20000000-0000-0000-0000-000000000001' and slug='nhap-dinh-dang-du-lieu' and not exists (select 1 from public.lessons existing where existing.chapter_id='20000000-0000-0000-0000-000000000001' and existing.slug='nhap-va-dinh-dang-du-lieu');
update public.lessons set slug='cau-truc-mot-cong-thuc' where chapter_id='20000000-0000-0000-0000-000000000002' and slug='cau-truc-cong-thuc' and not exists (select 1 from public.lessons existing where existing.chapter_id='20000000-0000-0000-0000-000000000002' and existing.slug='cau-truc-mot-cong-thuc');

insert into public.lessons (chapter_id,slug,title,summary,duration_minutes,position,is_preview,status)
values
  ('20000000-0000-0000-0000-000000000001','giao-dien-va-vung-lam-viec','Giao diện và vùng làm việc','Làm quen với workbook, worksheet, ô, hàng và cột.',8,1,true,'published'),
  ('20000000-0000-0000-0000-000000000001','nhap-va-dinh-dang-du-lieu','Nhập và định dạng dữ liệu','Tạo bảng dữ liệu dễ đọc.',10,2,false,'published'),
  ('20000000-0000-0000-0000-000000000001','thao-tac-voi-hang-va-cot','Thao tác với hàng và cột','Chèn và định dạng hàng cột.',8,3,false,'published'),
  ('20000000-0000-0000-0000-000000000002','cau-truc-mot-cong-thuc','Cấu trúc một công thức','Công thức bắt đầu bằng dấu bằng.',10,1,false,'published'),
  ('20000000-0000-0000-0000-000000000002','sum-average-min-max','SUM, AVERAGE, MIN, MAX','Các hàm tính toán thông dụng.',12,2,false,'published'),
  ('20000000-0000-0000-0000-000000000002','tham-chieu-tuong-doi-va-tuyet-doi','Tham chiếu tương đối và tuyệt đối','Hiểu A1 và $A$1.',12,3,false,'published'),
  ('20000000-0000-0000-0000-000000000003','lap-bang-theo-doi-chi-phi','Lập bảng theo dõi chi phí','Lập và tổng hợp báo cáo chi phí.',15,1,false,'published'),
  ('20000000-0000-0000-0000-000000000003','truc-quan-hoa-bang-bieu-do','Trực quan hóa bằng biểu đồ','Chọn biểu đồ phù hợp.',12,2,false,'published'),
  ('20000000-0000-0000-0000-000000000003','bai-thuc-hanh-tong-hop','Bài thực hành tổng hợp','Vận dụng toàn bộ kỹ năng.',20,3,false,'published')
on conflict (chapter_id,slug) do update set
  title=excluded.title,summary=excluded.summary,duration_minutes=excluded.duration_minutes,
  position=excluded.position,status='published';

insert into public.quizzes (id,slug,title,description,course_id,status,duration_minutes)
values ('30000000-0000-0000-0000-000000000001','excel-can-ban','Trắc nghiệm Excel căn bản','6 câu ôn tập kiến thức cơ bản.','10000000-0000-0000-0000-000000000001','published',15)
on conflict (slug) do update set title=excluded.title,description=excluded.description,status='published';

insert into public.questions (id,quiz_id,prompt,explanation,position,points)
values
  ('31000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Trong Excel, ký hiệu nào dùng để bắt đầu một công thức?','Công thức Excel bắt đầu bằng dấu bằng, ví dụ =A1+B1.',1,1),
  ('31000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000001','Hàm nào dùng để tính tổng các ô từ B2 đến B8?','SUM là hàm tính tổng, công thức là =SUM(B2:B8).',2,1),
  ('31000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000001','Địa chỉ ô ở cột C, hàng 5 được viết như thế nào?','Địa chỉ ô viết tên cột trước và số hàng sau, ví dụ C5.',3,1),
  ('31000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000001','Tham chiếu nào giữ nguyên cả cột và hàng khi sao chép công thức?','$A$1 là tham chiếu tuyệt đối, cố định cả cột và hàng.',4,1),
  ('31000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000001','Hàm nào tính giá trị trung bình của vùng B2:B8?','AVERAGE tính trung bình cộng của các giá trị số.',5,1),
  ('31000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000001','Để so sánh chi phí giữa các tháng, biểu đồ nào thường phù hợp?','Biểu đồ cột phù hợp để so sánh giá trị giữa các tháng.',6,1)
on conflict (id) do update set prompt=excluded.prompt,explanation=excluded.explanation,position=excluded.position;

insert into public.question_options (id,question_id,label,is_correct,position)
values
  ('41000000-0000-0000-0000-000000000001','31000000-0000-0000-0000-000000000001','Dấu bằng (=)',true,1),
  ('41000000-0000-0000-0000-000000000002','31000000-0000-0000-0000-000000000001','Dấu cộng (+)',false,2),
  ('41000000-0000-0000-0000-000000000003','31000000-0000-0000-0000-000000000001','Dấu thăng (#)',false,3),
  ('41000000-0000-0000-0000-000000000004','31000000-0000-0000-0000-000000000001','Dấu hai chấm (:)',false,4),
  ('41000000-0000-0000-0000-000000000005','31000000-0000-0000-0000-000000000002','COUNT(B2:B8)',false,1),
  ('41000000-0000-0000-0000-000000000006','31000000-0000-0000-0000-000000000002','AVERAGE(B2:B8)',false,2),
  ('41000000-0000-0000-0000-000000000007','31000000-0000-0000-0000-000000000002','SUM(B2:B8)',true,3),
  ('41000000-0000-0000-0000-000000000008','31000000-0000-0000-0000-000000000002','IF(B2:B8)',false,4),
  ('41000000-0000-0000-0000-000000000009','31000000-0000-0000-0000-000000000003','5C',false,1),
  ('41000000-0000-0000-0000-000000000010','31000000-0000-0000-0000-000000000003','C5',true,2),
  ('41000000-0000-0000-0000-000000000011','31000000-0000-0000-0000-000000000003','C:5',false,3),
  ('41000000-0000-0000-0000-000000000012','31000000-0000-0000-0000-000000000003','C-5',false,4),
  ('41000000-0000-0000-0000-000000000013','31000000-0000-0000-0000-000000000004','A1',false,1),
  ('41000000-0000-0000-0000-000000000014','31000000-0000-0000-0000-000000000004','A$1',false,2),
  ('41000000-0000-0000-0000-000000000015','31000000-0000-0000-0000-000000000004','$A1',false,3),
  ('41000000-0000-0000-0000-000000000016','31000000-0000-0000-0000-000000000004','$A$1',true,4),
  ('41000000-0000-0000-0000-000000000017','31000000-0000-0000-0000-000000000005','=AVERAGE(B2:B8)',true,1),
  ('41000000-0000-0000-0000-000000000018','31000000-0000-0000-0000-000000000005','=MAX(B2:B8)',false,2),
  ('41000000-0000-0000-0000-000000000019','31000000-0000-0000-0000-000000000005','=MIN(B2:B8)',false,3),
  ('41000000-0000-0000-0000-000000000020','31000000-0000-0000-0000-000000000005','=SUM(B2:B8)',false,4),
  ('41000000-0000-0000-0000-000000000021','31000000-0000-0000-0000-000000000006','Biểu đồ phân tán',false,1),
  ('41000000-0000-0000-0000-000000000022','31000000-0000-0000-0000-000000000006','Biểu đồ cột',true,2),
  ('41000000-0000-0000-0000-000000000023','31000000-0000-0000-0000-000000000006','Biểu đồ radar',false,3),
  ('41000000-0000-0000-0000-000000000024','31000000-0000-0000-0000-000000000006','Không cần biểu đồ',false,4)
on conflict (id) do update set label=excluded.label,is_correct=excluded.is_correct,position=excluded.position;

commit;
