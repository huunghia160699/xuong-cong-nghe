import type {Metadata} from "next";
import Link from "next/link";
import {ArrowDown,ArrowRight,ArrowUpRight,Check,ChevronDown} from "lucide-react";
import {courses} from "@/data/mock";
import {getPublishedCourses} from "@/features/courses/live-public";
import {isLiveMode} from "@/lib/supabase/config";

export const metadata:Metadata={
 title:"Xưởng Công Nghệ | Học đến đâu, làm được đến đó",
 description:"Khám phá Xưởng Công Nghệ: khóa học, Word Lab, trình chiếu, Quiz, tài nguyên và các trải nghiệm học tập số trong một không gian.",
 alternates:{canonical:"/"}
};

const paths=[
 {title:"Tôi muốn học",subtitle:"Học từ nền tảng, theo từng bài và từng chủ đề.",href:"/khoa-hoc",action:"Xem khóa học"},
 {title:"Tôi muốn thực hành",subtitle:"Mở công cụ, tự thao tác và làm ra sản phẩm.",href:"/cong-cu",action:"Vào khu thực hành"},
 {title:"Tôi muốn kiểm tra",subtitle:"Làm bài Quiz và xem những phần cần ôn lại.",href:"/dang-nhap?next=%2Fstudent%2Fquiz",action:"Đến bài luyện"},
 {title:"Tôi là giáo viên",subtitle:"Bài giảng, câu hỏi và hoạt động lớp học trong cùng một hành trình.",href:"/gioi-thieu",action:"Khám phá góc giáo viên"}
] as const;

const directory=[
 {name:"Khóa học",desc:"Kiến thức Tin học và kỹ năng số theo chủ đề, từ nền tảng đến ứng dụng.",area:"Học tập"},
 {name:"Word Lab",desc:"Luyện soạn thảo, định dạng và trình bày tài liệu một cách chỉn chu.",area:"Soạn thảo"},
 {name:"Trình chiếu",desc:"Những bài giảng trực quan, ví dụ sinh động và hoạt động theo từng trang.",area:"Bài giảng"},
 {name:"Quiz & luyện tập",desc:"Câu hỏi, bài luyện và phản hồi để củng cố kiến thức.",area:"Đánh giá"},
 {name:"Tài nguyên học tập",desc:"Học liệu, hướng dẫn và mẫu bài thực hành theo từng mục tiêu.",area:"Thư viện"},
 {name:"Teacher Studio",desc:"Bài giảng, học liệu, lớp học và bài tập dưới góc nhìn giáo viên.",area:"Giảng dạy"},
 {name:"Excel · Coding · SQL · Data Lab",desc:"Tư duy bảng tính, lập trình, truy vấn và phân tích dữ liệu.",area:"Kỹ năng số"},
 {name:"Live Quiz · Garden · Đấu trường",desc:"Thử thách kiến thức, hoạt động nhóm và trải nghiệm học tập tương tác.",area:"Tương tác"}
] as const;

export default async function HomePage(){
 const listedCourses=isLiveMode()?await getPublishedCourses():courses;
 return <main className="xcn-workshop">
  <section className="ws-hero" aria-labelledby="ws-home-title">
   <div className="xcn-container ws-hero-grid">
    <div className="ws-hero-copy">
     <h1 id="ws-home-title">Học đến đâu,<br/><span>làm được đến đó.</span></h1>
     <p>Đừng chỉ xem cách làm. Hãy tự tay thử, sửa, và tạo ra sản phẩm của mình — từ một trang Word đầu tiên đến những kỹ năng số dùng được mỗi ngày.</p>
     <div className="ws-hero-actions">
      <Link href="/cong-cu" className="ws-button ws-button-primary">Bắt đầu thực hành <ArrowUpRight size={19} aria-hidden="true"/></Link>
      <Link href="/khoa-hoc" className="ws-text-link">Tìm khóa học phù hợp <ArrowRight size={17} aria-hidden="true"/></Link>
     </div>
    </div>
    <div className="ws-hero-work" role="group" aria-label="Minh họa một sản phẩm tài liệu học tập có thể tạo với Word Lab">
     <div className="ws-work-head"><span>SẢN PHẨM SAU BUỔI THỰC HÀNH</span><span>01 / WORD LAB</span></div>
     <div className="ws-paper-frame">
      <div className="ws-paper" aria-hidden="true">
       <div className="ws-paper-topline"><span>HỌ VÀ TÊN</span><i/></div>
       <h2>Kế hoạch<br/><span>học tập.</span></h2>
       <p className="ws-paper-intro">Mục tiêu tuần này là biết cách trình bày một tài liệu rõ ràng, dễ đọc.</p>
       <div className="ws-paper-rule"/>
       <p className="ws-paper-small">NHỮNG VIỆC CẦN LÀM</p>
       <div className="ws-paper-task"><b>01</b><span>Căn lề và định dạng đoạn văn</span><Check size={15}/></div>
       <div className="ws-paper-task"><b>02</b><span>Tạo tiêu đề và danh sách</span><Check size={15}/></div>
       <div className="ws-paper-task"><b>03</b><span>Lưu tài liệu của mình</span><i/></div>
       <div className="ws-paper-sign">Một việc nhỏ, một kỹ năng thật.</div>
      </div>
      <div className="ws-paper-note"><span>THỰC HÀNH TRÊN TRÌNH DUYỆT</span><strong>Từ trang trắng<br/>đến tài liệu.</strong><ArrowUpRight size={24} aria-hidden="true"/></div>
     </div>
     <div className="ws-work-bottom"><span>BÀI TẬP MẪU · WORD LAB</span><Link href="/cong-cu/mo-phong-word">Mở Word Lab <ArrowUpRight size={15} aria-hidden="true"/></Link></div>
    </div>
   </div>
   <div className="xcn-container ws-hero-scroll"><a href="#bat-dau">Khám phá Xưởng <ArrowDown size={16} aria-hidden="true"/></a><span>HỌC · THỬ · LÀM ĐƯỢC</span></div>
  </section>

  <section className="ws-paths ws-section" id="bat-dau" aria-labelledby="ws-paths-title">
   <div className="xcn-container">
    <div className="ws-section-heading ws-heading-split"><h2 id="ws-paths-title">Bạn đến đây<br/>để làm gì?</h2><p>Không cần tìm trong một danh sách dài. Chọn việc bạn muốn làm và bắt đầu từ đó.</p></div>
    <div className="ws-path-grid">{paths.map((path,index)=><Link key={path.title} href={path.href} className="ws-path">
      <span className="ws-path-index">0{index+1}</span><div><h3>{path.title}</h3><p>{path.subtitle}</p><span className="ws-path-action">{path.action} <ArrowUpRight size={17} aria-hidden="true"/></span></div><ArrowUpRight className="ws-path-arrow" size={23} aria-hidden="true"/>
     </Link>)}</div>
   </div>
  </section>

  <section className="ws-tools ws-section" aria-labelledby="ws-tools-title">
   <div className="xcn-container">
    <div className="ws-section-heading ws-heading-split"><div><p className="ws-label">THỬ NGAY TRÊN WEB</p><h2 id="ws-tools-title">Công cụ để<br/>bắt tay vào làm.</h2></div><p>Không chỉ xem hướng dẫn. Bạn có thể mở công cụ, luyện một thao tác và biết mình vừa học được gì.</p></div>
    <div className="ws-feature-main">
     <div className="ws-feature-image ws-word-visual" aria-hidden="true">
      <div className="ws-editor-shell"><div className="ws-editor-toolbar"><strong>Word Lab</strong><span>Trang đầu</span><span>Chèn</span><span>Bố trí</span><span>Xem</span></div><div className="ws-editor-tools"><span className="ws-editor-bold">B</span><span className="ws-editor-italic">I</span><span><u>U</u></span><i/><span>≡</span><span>☷</span><span>▤</span></div><div className="ws-editor-canvas"><div className="ws-editor-paper"><small>BÀI THỰC HÀNH CỦA TÔI</small><h3>Viết một đoạn văn<br/>thật chỉn chu.</h3><p>Hôm nay, em học cách trình bày văn bản sao cho người đọc dễ theo dõi. Một tiêu đề rõ ràng, những đoạn văn ngay ngắn và khoảng cách hợp lý giúp tài liệu của em trở nên chuyên nghiệp hơn.</p><div/><div/></div></div></div>
      <span className="ws-visual-caption">Minh họa bố cục phòng soạn thảo</span>
     </div>
     <div className="ws-feature-copy"><span className="ws-availability">SOẠN THẢO · TRÌNH BÀY</span><p className="ws-feature-number">CÔNG CỤ 01</p><h3>Word Lab.</h3><p className="ws-feature-lead">Học soạn thảo bằng chính thao tác của bạn.</p><p>Trình bày trang A4, nhập nội dung, định dạng văn bản và làm quen với Ribbon. Hữu ích từ bài Tin học đầu tiên đến công việc thường ngày.</p><Link href="/cong-cu/mo-phong-word" className="ws-inline-link">Mở Word Lab <ArrowUpRight size={19} aria-hidden="true"/></Link></div>
    </div>
    <div className="ws-feature-secondary">
     <article className="ws-tool-half ws-slide-half"><div className="ws-tool-half-visual" aria-hidden="true"><div className="ws-slide-art"><span>TRÌNH CHIẾU TIN HỌC</span><strong>Ý tưởng<br/>được nhìn thấy.</strong><div><i/><i/><i/></div></div></div><div className="ws-tool-half-copy"><span className="ws-availability">BÀI GIẢNG · TƯƠNG TÁC</span><h3>Trình chiếu</h3><p>Xem bài giảng trực quan, khám phá nội dung theo từng trang và tương tác với câu hỏi.</p><Link href="/cong-cu/trinh-chieu">Khám phá trình chiếu <ArrowUpRight size={18} aria-hidden="true"/></Link></div></article>
     <article className="ws-tool-half ws-quiz-half"><div className="ws-tool-half-visual" aria-hidden="true"><div className="ws-quiz-art"><div><span>LUYỆN TẬP</span><b>1 / 10</b></div><strong>Đâu là thao tác để căn giữa đoạn văn?</strong><p>A. Căn đều</p><p className="selected">B. Căn giữa <Check size={17}/></p><p>C. Căn trái</p></div></div><div className="ws-tool-half-copy"><span className="ws-availability">TRẮC NGHIỆM · ÔN TẬP</span><h3>Quiz & bài luyện</h3><p>Tự kiểm tra kiến thức, nhận kết quả và quay lại những nội dung cần luyện thêm.</p><Link href="/dang-nhap?next=%2Fstudent%2Fquiz">Đến khu luyện tập <ArrowUpRight size={18} aria-hidden="true"/></Link></div></article>
    </div>
   </div>
  </section>

  <section className="ws-method ws-section" aria-labelledby="ws-method-title">
   <div className="xcn-container ws-method-grid"><div><p className="ws-label">CÁCH CHÚNG TÔI MUỐN BẠN HỌC</p><h2 id="ws-method-title">Hiểu một chút.<br/>Thử ngay.<br/><span>Nhớ lâu hơn.</span></h2></div><div className="ws-method-steps"><article><span>01</span><div><h3>Hiểu điều cần làm</h3><p>Đọc hướng dẫn ngắn và biết kết quả mình cần đạt.</p></div></article><article><span>02</span><div><h3>Tự tay thực hành</h3><p>Làm ngay trên công cụ, thay vì chỉ xem một video dài.</p></div></article><article><span>03</span><div><h3>Kiểm tra và tiếp tục</h3><p>Nhận phản hồi, sửa chỗ chưa đúng và học bước tiếp theo.</p></div></article></div></div>
  </section>

  <section className="ws-courses ws-section" aria-labelledby="ws-courses-title">
   <div className="xcn-container"><div className="ws-section-heading ws-heading-split"><div><p className="ws-label">HỌC THEO LỘ TRÌNH</p><h2 id="ws-courses-title">Hôm nay học gì?</h2></div><p>Bắt đầu từ một chủ đề vừa sức. Mỗi bài học là một bước nhỏ trong quá trình làm chủ kỹ năng.</p></div>
    {listedCourses.length?<div className="ws-course-list">{listedCourses.slice(0,3).map((course,index)=><Link key={course.slug} href={`/khoa-hoc/${course.slug}`} className="ws-course"><span className="ws-course-index">0{index+1}</span><div><span className="ws-course-meta">{course.category} · {course.level} · {course.lessons} bài học</span><h3>{course.title}</h3></div><span className="ws-course-go">Xem nội dung <ArrowUpRight size={19} aria-hidden="true"/></span></Link>)}</div>:<div className="ws-course-empty"><p>Bắt đầu từ một bài thực hành để khám phá cách học phù hợp với bạn.</p><Link href="/cong-cu">Khám phá công cụ <ArrowUpRight size={18} aria-hidden="true"/></Link></div>}
    <Link href="/khoa-hoc" className="ws-inline-link ws-course-all">Xem tất cả khóa học <ArrowRight size={18} aria-hidden="true"/></Link>
   </div>
  </section>

  <section className="ws-catalog ws-section" id="du-an" aria-labelledby="ws-catalog-title">
   <div className="xcn-container"><div className="ws-section-heading ws-heading-split"><div><p className="ws-label">BẢN ĐỒ HỆ SINH THÁI</p><h2 id="ws-catalog-title">Mỗi kỹ năng,<br/>một hướng khám phá.</h2></div><p>Khóa học, công cụ thực hành, bài luyện và hoạt động lớp học — tìm đúng nhóm nội dung cho mục tiêu của bạn.</p></div>
    <div className="ws-directory">{directory.map((item,index)=><article key={item.name} className="ws-directory-row"><span className="ws-directory-index">{"0"+(index+1)}</span><div><h3>{item.name}</h3><p>{item.desc}</p></div><span className="ws-directory-area">{item.area}</span></article>)}</div>
    <Link href="/cong-cu" className="ws-inline-link ws-directory-more">Khám phá công cụ thực hành <ArrowUpRight size={18} aria-hidden="true"/></Link>
   </div>
  </section>

  <section className="ws-teacher ws-section" aria-labelledby="ws-teacher-title"><div className="xcn-container ws-teacher-grid"><div><p className="ws-label">DÀNH CHO GIÁO VIÊN</p><h2 id="ws-teacher-title">Giờ học tốt bắt đầu từ khâu chuẩn bị.</h2><p>Từ chuẩn bị bài giảng, tổ chức hoạt động đến luyện tập và phản hồi, mỗi giờ học trở thành một hành trình rõ ràng cho cả thầy cô và học sinh.</p><div className="ws-teacher-actions"><Link href="/gioi-thieu" className="ws-inline-link">Khám phá cách dạy và học <ArrowUpRight size={19} aria-hidden="true"/></Link><span>BÀI GIẢNG · LỚP HỌC · TƯƠNG TÁC</span></div></div><div className="ws-teacher-illustration" aria-hidden="true"><div className="ws-teacher-board"><span>BUỔI HỌC NGÀY MAI</span><strong>Một bài giảng.<br/>Nhiều cách hiểu.</strong><div className="ws-board-list"><div><b>01</b><span>Giới thiệu nội dung</span></div><div><b>02</b><span>Học sinh thử làm</span></div><div><b>03</b><span>Kiểm tra & phản hồi</span></div></div></div></div></div></section>

  <section className="ws-faq ws-section" aria-labelledby="ws-faq-title"><div className="xcn-container ws-faq-grid"><div><p className="ws-label">BẮT ĐẦU CÙNG XƯỞNG</p><h2 id="ws-faq-title">Một vài câu hỏi thường gặp.</h2></div><div className="ws-faq-items"><details><summary>Tôi nên bắt đầu học từ đâu? <ChevronDown size={19} aria-hidden="true"/></summary><p>Bạn có thể chọn một khóa học theo chủ đề, mở Word Lab để thực hành ngay hoặc vào khu Quiz nếu muốn tự kiểm tra kiến thức.</p></details><details><summary>Word Lab khác bài hướng dẫn thông thường ở điểm nào? <ChevronDown size={19} aria-hidden="true"/></summary><p>Thay vì chỉ xem các bước, bạn trực tiếp nhập nội dung, chỉnh sửa và định dạng văn bản ngay trong trình duyệt.</p></details><details><summary>Làm thế nào để học đều và nhớ kiến thức lâu hơn? <ChevronDown size={19} aria-hidden="true"/></summary><p>Đặt một mục tiêu nhỏ, thử làm trong công cụ, kiểm tra lại bằng bài luyện và tiếp tục với chủ đề kế tiếp.</p></details></div></div></section>

  <section className="ws-end" aria-labelledby="ws-end-title"><div className="xcn-container ws-end-grid"><div><h2 id="ws-end-title">Bạn không cần biết hết.<br/><span>Chỉ cần bắt đầu.</span></h2><p>Một bài thực hành hôm nay có thể là kỹ năng bạn dùng ngày mai.</p></div><div><Link href="/cong-cu/mo-phong-word" className="ws-button ws-button-light">Thử Word Lab <ArrowUpRight size={19} aria-hidden="true"/></Link><Link href="/khoa-hoc" className="ws-end-link">Xem khóa học <ArrowRight size={18} aria-hidden="true"/></Link></div></div></section>
 </main>;
}