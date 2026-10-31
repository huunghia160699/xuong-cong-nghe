import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRight,ArrowUpRight,BookOpen,CheckCircle2,ClipboardCheck,FileText,GraduationCap,Presentation,ShieldCheck,Users} from "lucide-react";
import {PublicHomeHero} from "@/components/public-home-hero";
import {courses} from "@/data/mock";
import {getPublishedCourses} from "@/features/courses/live-public";
import {isLiveMode} from "@/lib/supabase/config";

export const metadata:Metadata={
 title:"Xưởng Công Nghệ | Học công nghệ bằng cách thực hành",
 description:"Học và luyện kỹ năng số với Word Lab, trình chiếu Tin học, trắc nghiệm và các lộ trình thực hành của Xưởng Công Nghệ.",
 alternates:{canonical:"/"}
};

const learning=[
 {title:"Học để hiểu",description:"Nội dung rõ ràng, có ví dụ và những việc cụ thể để tự thực hiện.",icon:BookOpen},
 {title:"Luyện cho vững",description:"Làm thử trên công cụ, thực hành lại khi cần và kiểm tra kiến thức.",icon:ClipboardCheck},
 {title:"Ứng dụng được",description:"Mang kỹ năng đã học vào bài làm, tài liệu và dự án của riêng mình.",icon:CheckCircle2}
] as const;

export default async function HomePage(){
 const listedCourses=isLiveMode()?await getPublishedCourses():courses;
 return <main className="xcn-new-home">
  <section className="xcn-new-hero" aria-labelledby="home-title">
   <div className="xcn-container xcn-new-hero-layout">
    <div className="xcn-new-hero-copy">
     <p className="xcn-new-eyebrow">Học công nghệ theo cách dễ hiểu hơn</p>
     <h1 id="home-title">Học đến đâu,<br/><span>làm được đến đó.</span></h1>
     <p className="xcn-new-hero-description">Khám phá kiến thức, luyện kỹ năng và thực hành trực tiếp. Xưởng Công Nghệ giúp bạn biến những điều vừa học thành sản phẩm của chính mình.</p>
     <div className="xcn-new-hero-actions">
      <Link href="/cong-cu" className="xcn-new-button-primary">Khám phá công cụ <ArrowUpRight size={18} aria-hidden="true"/></Link>
      <Link href="/khoa-hoc" className="xcn-new-button-text">Xem khóa học <ArrowRight size={18} aria-hidden="true"/></Link>
     </div>
     <p className="xcn-new-hero-helper">Xem nội dung công khai, đăng nhập khi cần sử dụng chức năng theo tài khoản.</p>
    </div>
    <PublicHomeHero/>
   </div>
   <div className="xcn-container xcn-new-hero-subline">
    <span>Học từ những thao tác nhỏ.</span>
    <span>Thành thạo qua thực hành mỗi ngày.</span>
   </div>
  </section>

  <section className="xcn-new-benefits" aria-label="Giá trị của Xưởng Công Nghệ">
   <div className="xcn-container xcn-new-benefit-list">
    <div><CheckCircle2 size={20} aria-hidden="true"/><span>Nội dung theo lộ trình</span></div>
    <div><FileText size={20} aria-hidden="true"/><span>Công cụ để tự thực hành</span></div>
    <div><ClipboardCheck size={20} aria-hidden="true"/><span>Bài luyện có phản hồi</span></div>
   </div>
  </section>

  <section id="he-sinh-thai" className="xcn-new-section xcn-new-tools" aria-labelledby="tools-title">
   <div className="xcn-container">
    <div className="xcn-new-section-head"><div><p className="xcn-new-eyebrow">Không gian thực hành</p><h2 id="tools-title">Không chỉ xem bài giảng.<br/>Bạn có thể bắt tay vào làm.</h2></div><p>Học cách soạn văn bản, theo dõi bài học trình chiếu và củng cố kiến thức bằng trắc nghiệm trên cùng một nền tảng.</p></div>
    <div className="xcn-new-tool-feature">
     <div className="xcn-new-tool-art" aria-hidden="true">
      <div className="xcn-new-tool-paper">
       <div className="xcn-new-tool-ribbon"><span>Trang đầu</span><span>Chèn</span><span>Bố trí</span><span>Xem</span></div>
       <div className="xcn-new-tool-page"><span>TÀI LIỆU THỰC HÀNH</span><strong>Lập kế hoạch học tập</strong><div className="xcn-new-tool-line wide"/><div className="xcn-new-tool-line"/><div className="xcn-new-tool-line mid"/><p><b>01.</b> Mục tiêu trong tuần</p><div className="xcn-new-tool-line wide"/><div className="xcn-new-tool-line mid"/></div>
      </div>
     </div>
     <div className="xcn-new-tool-copy"><p className="xcn-new-kicker">Trải nghiệm nổi bật</p><div className="xcn-new-tool-heading"><FileText size={33} strokeWidth={1.6} aria-hidden="true"/><span>Word Lab</span></div><h3>Tự tay soạn thảo<br/>một văn bản hoàn chỉnh.</h3><p>Thực hành gõ chữ, định dạng, làm việc với bảng và bố cục trang giấy bằng giao diện soạn thảo mô phỏng.</p><span className="xcn-new-status">Đang tiếp tục hoàn thiện</span><Link href="/cong-cu/mo-phong-word" className="xcn-new-text-action">Mở bản trải nghiệm <ArrowUpRight size={19} aria-hidden="true"/></Link></div>
    </div>
    <div className="xcn-new-two-tools">
     <Link href="/cong-cu/trinh-chieu" className="xcn-new-tool-tile"><div className="xcn-new-tool-tile-icon xcn-new-tile-blue"><Presentation size={31} strokeWidth={1.6} aria-hidden="true"/></div><div><p className="xcn-new-kicker">Trình chiếu Tin học</p><h3>Học qua hình ảnh<br/>và tình huống.</h3><p>Khám phá bài học theo phần chủ đề, quan sát và trả lời câu hỏi tương tác.</p><span>Xem thư viện <ArrowUpRight size={17} aria-hidden="true"/></span></div></Link>
     <Link href="/dang-nhap?next=%2Fstudent%2Fquiz" className="xcn-new-tool-tile"><div className="xcn-new-tool-tile-icon xcn-new-tile-peach"><ClipboardCheck size={31} strokeWidth={1.6} aria-hidden="true"/></div><div><p className="xcn-new-kicker">Trắc nghiệm</p><h3>Ôn tập hôm nay.<br/>Nhớ lâu hơn.</h3><p>Luyện kiến thức, nhận phản hồi và xem kết quả trong không gian người học.</p><span>Vào bài luyện <ArrowUpRight size={17} aria-hidden="true"/></span></div></Link>
    </div>
    <Link href="/cong-cu" className="xcn-new-all-link">Xem toàn bộ công cụ <ArrowRight size={18} aria-hidden="true"/></Link>
   </div>
  </section>

  <section id="du-an" className="xcn-new-section xcn-new-learning" aria-labelledby="learning-title">
   <div className="xcn-container">
    <div className="xcn-new-section-head"><div><p className="xcn-new-eyebrow">Cách chúng tôi thiết kế bài học</p><h2 id="learning-title">Hiểu một điều mới.<br/>Thử ngay điều đó.</h2></div><p>Không cần những lời hứa lớn. Mỗi bài học tập trung vào một việc bạn có thể hiểu, làm theo và dần tự thực hiện.</p></div>
    <div className="xcn-new-learning-grid">{learning.map(item=><article key={item.title}><div className="xcn-new-learning-icon"><item.icon size={25} strokeWidth={1.6} aria-hidden="true"/></div><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
    <div className="xcn-new-learning-note"><p>Học để hiểu. Làm để thành thạo.</p><span>Phương pháp thực hành của Xưởng Công Nghệ</span></div>
   </div>
  </section>

  <section id="khoa-hoc" className="xcn-new-section xcn-new-courses" aria-labelledby="courses-title">
   <div className="xcn-container">
    <div className="xcn-new-section-head"><div><p className="xcn-new-eyebrow">Lộ trình học tập</p><h2 id="courses-title">Bắt đầu từ điều<br/>bạn muốn giỏi hơn.</h2></div><p>Các khóa học được tổ chức theo chủ đề để bạn có thể học nền tảng rồi thực hành theo nhu cầu.</p></div>
    {listedCourses.length?<div className="xcn-new-course-grid">{listedCourses.slice(0,3).map((course,index)=><Link href={`/khoa-hoc/${course.slug}`} key={course.slug} className="xcn-new-course">
      <div className={`xcn-new-course-cover xcn-new-course-cover-${index%3}`}><span>{course.category}</span><BookOpen size={49} strokeWidth={1.25} aria-hidden="true"/></div>
      <div className="xcn-new-course-body"><small>{course.level} · {course.lessons} bài học</small><strong>{course.title}</strong><span>Xem lộ trình <ArrowUpRight size={17} aria-hidden="true"/></span></div>
     </Link>)}</div>:<p className="xcn-new-empty">Khóa học đang được cập nhật. Bạn vẫn có thể khám phá các công cụ thực hành.</p>}
    <Link href="/khoa-hoc" className="xcn-new-all-link">Khám phá tất cả khóa học <ArrowRight size={18} aria-hidden="true"/></Link>
   </div>
  </section>

  <section className="xcn-new-section xcn-new-audience" aria-labelledby="audience-title">
   <div className="xcn-container xcn-new-audience-layout">
    <div><p className="xcn-new-eyebrow">Dành cho nhiều cách học</p><h2 id="audience-title">Một nền tảng.<br/>Đúng nhu cầu của bạn.</h2><p>Người học có thể bắt đầu với bài học và bài luyện. Những không gian dành cho giáo viên và quản trị được phát triển theo phạm vi quyền riêng.</p><Link href="/gioi-thieu" className="xcn-new-text-action">Tìm hiểu về Xưởng Công Nghệ <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
    <div className="xcn-new-audience-list">
     <div><GraduationCap size={27} strokeWidth={1.6} aria-hidden="true"/><div><h3>Người học</h3><p>Học bài, thực hành và xem kết quả của mình.</p></div><span>Đã có nền tảng</span></div>
     <div><Users size={27} strokeWidth={1.6} aria-hidden="true"/><div><h3>Giáo viên</h3><p>Hướng tới quản lý học liệu, lớp học và bài giao.</p></div><span>Đang phát triển</span></div>
     <div><ShieldCheck size={27} strokeWidth={1.6} aria-hidden="true"/><div><h3>Quản trị</h3><p>Quản lý nội dung, người dùng và phân quyền.</p></div><span>Cần tài khoản có quyền</span></div>
    </div>
   </div>
  </section>

  <section className="xcn-new-last" aria-labelledby="last-title"><div className="xcn-container xcn-new-last-layout"><div><p>Hành trình của bạn có thể bắt đầu từ một bài thực hành.</p><h2 id="last-title">Mở công cụ.<br/>Bắt đầu học thật.</h2></div><Link href="/cong-cu" className="xcn-new-last-button">Khám phá Xưởng Công Nghệ <ArrowUpRight size={19} aria-hidden="true"/></Link></div></section>
 </main>;
}
