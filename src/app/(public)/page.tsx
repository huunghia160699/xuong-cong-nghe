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
 {title:"Học để hiểu",description:"Xem ví dụ rồi tự làm theo từng bước.",icon:BookOpen},
 {title:"Luyện cho vững",description:"Thử trên công cụ, luyện lại khi cần.",icon:ClipboardCheck},
 {title:"Ứng dụng được",description:"Tạo bài làm và sản phẩm của riêng bạn.",icon:CheckCircle2}
] as const;

export default async function HomePage(){
 const listedCourses=isLiveMode()?await getPublishedCourses():courses;
 return <main className="xcn-new-home">
  <section className="xcn-new-hero" aria-labelledby="home-title">
   <div className="xcn-container xcn-new-hero-layout">
    <div className="xcn-new-hero-copy">
     <h1 id="home-title">Học đến đâu,<br/><span>làm được đến đó.</span></h1>
     <p className="xcn-new-hero-description">Học kỹ năng số bằng cách tự tay thực hành. Chọn một công cụ, làm thử và tiến bộ qua mỗi bài học.</p>
     <div className="xcn-new-hero-actions">
      <Link href="/cong-cu" className="xcn-new-button-primary">Khám phá công cụ <ArrowUpRight size={18} aria-hidden="true"/></Link>
      <Link href="/khoa-hoc" className="xcn-new-button-text">Xem khóa học <ArrowRight size={18} aria-hidden="true"/></Link>
     </div>
    </div>
    <PublicHomeHero/>
   </div>
  </section>

  <section id="he-sinh-thai" className="xcn-new-section xcn-new-tools" aria-labelledby="tools-title">
   <div className="xcn-container">
    <div className="xcn-new-section-head"><div><h2 id="tools-title">Không chỉ xem bài giảng.<br/>Bạn có thể bắt tay vào làm.</h2></div><p>Soạn văn bản, học qua trình chiếu và luyện kiến thức — tất cả trong một nơi.</p></div>
    <div className="xcn-new-tool-feature">
     <div className="xcn-new-tool-art" aria-hidden="true">
      <div className="xcn-new-tool-paper">
       <div className="xcn-new-tool-ribbon"><span>Trang đầu</span><span>Chèn</span><span>Bố trí</span><span>Xem</span></div>
       <div className="xcn-new-tool-page"><span>TÀI LIỆU THỰC HÀNH</span><strong>Lập kế hoạch học tập</strong><div className="xcn-new-tool-line wide"/><div className="xcn-new-tool-line"/><div className="xcn-new-tool-line mid"/><p><b>01.</b> Mục tiêu trong tuần</p><div className="xcn-new-tool-line wide"/><div className="xcn-new-tool-line mid"/></div>
      </div>
     </div>
     <div className="xcn-new-tool-copy"><div className="xcn-new-tool-heading"><FileText size={33} strokeWidth={1.6} aria-hidden="true"/><span>Word Lab</span></div><h3>Tập soạn thảo<br/>như trên Word.</h3><p>Gõ, định dạng văn bản và làm quen với trang A4 ngay trên trình duyệt.</p><span className="xcn-new-status">Đang tiếp tục hoàn thiện</span><Link href="/cong-cu/mo-phong-word" className="xcn-new-text-action">Mở bản trải nghiệm <ArrowUpRight size={19} aria-hidden="true"/></Link></div>
    </div>
    <div className="xcn-new-two-tools">
     <Link href="/cong-cu/trinh-chieu" className="xcn-new-tool-tile"><div className="xcn-new-tool-tile-icon xcn-new-tile-blue"><Presentation size={31} strokeWidth={1.6} aria-hidden="true"/></div><div><h3>Trình chiếu<br/>Tin học.</h3><p>Học theo chủ đề với slide và câu hỏi tương tác.</p><span>Xem thư viện <ArrowUpRight size={17} aria-hidden="true"/></span></div></Link>
     <Link href="/dang-nhap?next=%2Fstudent%2Fquiz" className="xcn-new-tool-tile"><div className="xcn-new-tool-tile-icon xcn-new-tile-peach"><ClipboardCheck size={31} strokeWidth={1.6} aria-hidden="true"/></div><div><h3>Trắc nghiệm<br/>và bài luyện.</h3><p>Làm bài, nhận phản hồi và xem kết quả học tập.</p><span>Vào bài luyện <ArrowUpRight size={17} aria-hidden="true"/></span></div></Link>
    </div>
    <Link href="/cong-cu" className="xcn-new-all-link">Xem toàn bộ công cụ <ArrowRight size={18} aria-hidden="true"/></Link>
   </div>
  </section>

  <section id="du-an" className="xcn-new-section xcn-new-learning" aria-labelledby="learning-title">
   <div className="xcn-container">
    <div className="xcn-new-section-head"><div><h2 id="learning-title">Hiểu một điều mới.<br/>Thử ngay điều đó.</h2></div><p>Hiểu kiến thức qua ví dụ, luyện tập rồi áp dụng vào bài làm thực tế.</p></div>
    <div className="xcn-new-learning-grid">{learning.map(item=><article key={item.title}><div className="xcn-new-learning-icon"><item.icon size={25} strokeWidth={1.6} aria-hidden="true"/></div><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
    <div className="xcn-new-learning-note"><p>Học để hiểu. Làm để thành thạo.</p></div>
   </div>
  </section>

  <section id="khoa-hoc" className="xcn-new-section xcn-new-courses" aria-labelledby="courses-title">
   <div className="xcn-container">
    <div className="xcn-new-section-head"><div><h2 id="courses-title">Bắt đầu từ điều<br/>bạn muốn giỏi hơn.</h2></div><p>Chọn chủ đề phù hợp và học theo từng bước.</p></div>
    {listedCourses.length?<div className="xcn-new-course-grid">{listedCourses.slice(0,3).map((course,index)=><Link href={`/khoa-hoc/${course.slug}`} key={course.slug} className="xcn-new-course">
      <div className={`xcn-new-course-cover xcn-new-course-cover-${index%3}`}><span>{course.category}</span><BookOpen size={49} strokeWidth={1.25} aria-hidden="true"/></div>
      <div className="xcn-new-course-body"><small>{course.level} · {course.lessons} bài học</small><strong>{course.title}</strong><span>Xem lộ trình <ArrowUpRight size={17} aria-hidden="true"/></span></div>
     </Link>)}</div>:<p className="xcn-new-empty">Khóa học đang được cập nhật. Bạn vẫn có thể khám phá các công cụ thực hành.</p>}
    <Link href="/khoa-hoc" className="xcn-new-all-link">Khám phá tất cả khóa học <ArrowRight size={18} aria-hidden="true"/></Link>
   </div>
  </section>

  <section className="xcn-new-section xcn-new-audience" aria-labelledby="audience-title">
   <div className="xcn-container xcn-new-audience-layout">
    <div><h2 id="audience-title">Một nền tảng.<br/>Đúng nhu cầu của bạn.</h2><p>Không gian riêng cho người học, giáo viên và quản trị.</p><Link href="/gioi-thieu" className="xcn-new-text-action">Tìm hiểu về Xưởng Công Nghệ <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
    <div className="xcn-new-audience-list">
     <div><GraduationCap size={27} strokeWidth={1.6} aria-hidden="true"/><div><h3>Người học</h3><p>Học bài, thực hành và xem kết quả của mình.</p></div><span>Đã có nền tảng</span></div>
     <div><Users size={27} strokeWidth={1.6} aria-hidden="true"/><div><h3>Giáo viên</h3><p>Hướng tới quản lý học liệu, lớp học và bài giao.</p></div><span>Đang phát triển</span></div>
     <div><ShieldCheck size={27} strokeWidth={1.6} aria-hidden="true"/><div><h3>Quản trị</h3><p>Quản lý nội dung, người dùng và phân quyền.</p></div><span>Cần tài khoản có quyền</span></div>
    </div>
   </div>
  </section>

  <section className="xcn-new-last" aria-labelledby="last-title"><div className="xcn-container xcn-new-last-layout"><div><h2 id="last-title">Mở công cụ.<br/>Bắt đầu học thật.</h2></div><Link href="/cong-cu" className="xcn-new-last-button">Khám phá Xưởng Công Nghệ <ArrowUpRight size={19} aria-hidden="true"/></Link></div></section>
 </main>;
}
