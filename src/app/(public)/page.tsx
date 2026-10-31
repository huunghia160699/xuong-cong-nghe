import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRight,ArrowUpRight,BookOpen,CheckCircle2,ClipboardCheck,FileText,GraduationCap,Presentation} from "lucide-react";
import {courses} from "@/data/mock";
import {isLiveMode} from "@/lib/supabase/config";
import {getPublishedCourses} from "@/features/courses/live-public";

export const metadata:Metadata={
 title:"Xưởng Công Nghệ | Học công nghệ qua thực hành",
 description:"Khám phá công cụ Word Lab, trình chiếu, bài luyện và khóa học Tin học trong Xưởng Công Nghệ."
};

const products=[
 {number:"01",title:"Word Lab",detail:"Soạn thảo và định dạng văn bản",href:"/cong-cu/mo-phong-word",icon:FileText},
 {number:"02",title:"Trình chiếu",detail:"Học Tin học theo chủ đề",href:"/cong-cu/trinh-chieu",icon:Presentation},
 {number:"03",title:"Quiz",detail:"Luyện tập và nhận phản hồi",href:"/dang-nhap?next=%2Fstudent%2Fquiz",icon:ClipboardCheck}
];
const learningSteps=[
 {number:"01",title:"Học để hiểu",description:"Tìm hiểu nền tảng qua nội dung rõ ràng và ví dụ cụ thể."},
 {number:"02",title:"Luyện để vững",description:"Tự tay thao tác và củng cố bằng những bài thực hành."},
 {number:"03",title:"Ứng dụng thật",description:"Biến kiến thức thành kỹ năng và sản phẩm có thể sử dụng."}
];

export default async function HomePage(){
 const listedCourses=isLiveMode()?await getPublishedCourses():courses;
 return <main className="xcn-home-editorial">
  <section className="xcn-home-hero" aria-labelledby="home-title">
   <div className="xcn-container xcn-home-hero-grid">
    <div className="xcn-home-hero-copy">
     <p className="xcn-home-label">XƯỞNG CÔNG NGHỆ <span>/</span> KHÔNG GIAN THỰC HÀNH</p>
     <h1 id="home-title">Học công nghệ.<br/><em>Làm được việc.</em></h1>
     <p className="xcn-home-description">Học kiến thức, thử ngay trên công cụ và luyện tập đến khi thành thạo. Một nơi để bắt đầu, thực hành và tiến bộ.</p>
     <div className="xcn-home-actions">
      <Link href="/cong-cu" className="xcn-home-primary">Khám phá công cụ <ArrowUpRight size={18} aria-hidden="true"/></Link>
      <Link href="/khoa-hoc" className="xcn-home-secondary">Xem khóa học <ArrowRight size={17} aria-hidden="true"/></Link>
     </div>
     <p className="xcn-home-trust"><CheckCircle2 size={16} aria-hidden="true"/> Khám phá tự do. Đăng nhập khi sử dụng chức năng cần tài khoản.</p>
    </div>
    <div className="xcn-home-visual" aria-label="Ba không gian học tập và thực hành">
     <div className="xcn-home-visual-top"><span>KHÔNG GIAN HỌC TẬP</span><strong>XCN<span>.</span></strong></div>
     <div className="xcn-home-visual-list">{products.map(product=><Link key={product.number} href={product.href} className="xcn-home-visual-row">
      <span className="xcn-home-visual-num">{product.number}</span><product.icon size={26} strokeWidth={1.55} aria-hidden="true"/>
      <span><strong>{product.title}</strong><small>{product.detail}</small></span>
      <ArrowUpRight size={19} aria-hidden="true"/>
     </Link>)}</div>
     <div className="xcn-home-visual-end">HỌC <span>—</span> LUYỆN <span>—</span> ỨNG DỤNG</div>
    </div>
   </div>
   <div className="xcn-container xcn-home-hero-foot"><span>THỰC HÀNH LÀ TRỌNG TÂM</span><a href="#he-sinh-thai">Khám phá bên dưới <ArrowRight size={15} aria-hidden="true"/></a></div>
  </section>

  <section id="he-sinh-thai" className="xcn-home-section" aria-labelledby="ecosystem-title">
   <div className="xcn-container">
    <div className="xcn-home-heading"><div><p className="xcn-home-index">01 / HỆ SINH THÁI</p><h2 id="ecosystem-title">Chọn công cụ.<br/>Bắt đầu làm thật.</h2></div><p>Không cần những bước giới thiệu dài. Chọn đúng không gian cho việc bạn muốn thực hiện.</p></div>
    <div className="xcn-home-feature">
     <div className="xcn-home-feature-copy"><span>ĐANG HOÀN THIỆN</span><FileText size={33} strokeWidth={1.4} aria-hidden="true"/>
      <h3>Word Lab</h3><p>Gõ, định dạng và sắp xếp văn bản trên trang A4 với giao diện Ribbon ngay trong trình duyệt.</p>
      <Link href="/cong-cu/mo-phong-word">Khám phá Word Lab <ArrowUpRight size={18} aria-hidden="true"/></Link>
     </div>
     <div className="xcn-home-feature-preview" aria-label="Minh họa một trang văn bản đang soạn thảo">
      <div className="xcn-home-paper"><span>BÀI THỰC HÀNH / 01</span><strong>Định dạng văn bản</strong><i className="wide"/><i/><i className="long"/><b>01. Học qua thao tác</b><i className="short"/><i/></div>
     </div>
    </div>
    <div className="xcn-home-product-rows">
     <Link href="/cong-cu/trinh-chieu" className="xcn-home-product-row"><span>02</span><Presentation size={26} strokeWidth={1.6} aria-hidden="true"/><div><strong>Trình chiếu Tin học</strong><p>Khám phá bài học và thực hành theo chủ đề.</p></div><small>Thư viện chủ đề</small><ArrowUpRight size={19} aria-hidden="true"/></Link>
     <Link href="/dang-nhap?next=%2Fstudent%2Fquiz" className="xcn-home-product-row"><span>03</span><ClipboardCheck size={26} strokeWidth={1.6} aria-hidden="true"/><div><strong>Trắc nghiệm & bài luyện</strong><p>Luyện kiến thức và xem kết quả trong tài khoản học tập.</p></div><small>Cần đăng nhập</small><ArrowUpRight size={19} aria-hidden="true"/></Link>
    </div>
    <Link className="xcn-home-inline" href="/cong-cu">Xem tất cả công cụ <ArrowRight size={17} aria-hidden="true"/></Link>
   </div>
  </section>

  <section id="khoa-hoc" className="xcn-home-section xcn-home-learning" aria-labelledby="courses-title">
   <div className="xcn-container">
    <div className="xcn-home-heading"><div><p className="xcn-home-index">02 / HỌC THEO LỘ TRÌNH</p><h2 id="courses-title">Học có mục tiêu.<br/>Tiến bộ từng bước.</h2></div><p>Bắt đầu từ kiến thức nền tảng, sau đó chuyển sang thao tác và bài luyện phù hợp.</p></div>
    {listedCourses.length>0?<div className="xcn-home-course-list">{listedCourses.slice(0,3).map((course,index)=><Link className="xcn-home-course" href={`/khoa-hoc/${course.slug}`} key={course.slug}><span>{String(index+1).padStart(2,"0")}</span><div><small>{course.category} · {course.level}</small><strong>{course.title}</strong></div><span>{course.lessons} bài học</span><ArrowUpRight size={19} aria-hidden="true"/></Link>)}</div>:<p className="xcn-home-no-courses">Lộ trình học đang được cập nhật. Bạn có thể bắt đầu từ các công cụ thực hành.</p>}
    <Link className="xcn-home-inline" href="/khoa-hoc">Khám phá khóa học <ArrowRight size={17} aria-hidden="true"/></Link>
   </div>
  </section>

  <section id="du-an" className="xcn-home-section" aria-labelledby="method-title">
   <div className="xcn-container">
    <div className="xcn-home-heading"><div><p className="xcn-home-index">03 / CÁCH HỌC</p><h2 id="method-title">Hiểu đúng.<br/>Thực hành đủ.</h2></div><p>Một phương pháp rõ ràng: hiểu kiến thức, luyện thao tác và áp dụng vào công việc thực tế.</p></div>
    <div className="xcn-home-steps">{learningSteps.map(item=><div key={item.number}><span>{item.number} /</span><h3>{item.title}</h3><p>{item.description}</p></div>)}</div>
    <div className="xcn-home-roles"><div><GraduationCap size={24} aria-hidden="true"/> Dành cho người học</div><div><BookOpen size={24} aria-hidden="true"/> Hướng tới giáo viên và lớp học</div><Link href="/gioi-thieu">Tìm hiểu thêm <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
   </div>
  </section>

  <section className="xcn-home-close" aria-labelledby="close-title"><div className="xcn-container xcn-home-close-inner"><div><p className="xcn-home-index">BẮT ĐẦU TỪ HÔM NAY</p><h2 id="close-title">Chọn điều muốn học.<br/>Bắt tay vào làm.</h2></div><Link href="/cong-cu" className="xcn-home-light-btn">Khám phá không gian thực hành <ArrowUpRight size={18} aria-hidden="true"/></Link></div></section>
 </main>;
}
