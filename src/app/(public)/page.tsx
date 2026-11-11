import type {Metadata} from "next";
import {Noto_Sans} from "next/font/google";
import Link from "next/link";
import {
 ArrowDown,ArrowRight,ArrowUpRight,BookOpen,CalendarDays,Check,ChevronDown,
 ClipboardCheck,GraduationCap,Heart,MessageCircle,
 PenLine,Presentation,School,ShieldCheck,Sparkles,Star
} from "lucide-react";
import {courses} from "@/data/mock";
import {getPublishedCourses} from "@/features/courses/live-public";
import {isLiveMode} from "@/lib/supabase/config";

// Self-hosted by next/font, including the Vietnamese glyph subset and variable weights.
// Applies only to the public homepage, not the editing tools or admin workspace.
const homepageFont=Noto_Sans({subsets:["latin","vietnamese"],display:"swap"});

export const metadata:Metadata={
 title:"Xưởng Công Nghệ | Học đến đâu, làm được đến đó",
 description:"Nơi học viên, giáo viên và gia đình cùng khám phá kỹ năng số qua khóa học, Word Lab, trình chiếu và Quiz.",
 alternates:{canonical:"/"}
};

const rolePaths=[
 {name:"Giáo viên",description:"Chuẩn bị và truyền cảm hứng",href:"/gioi-thieu",icon:BookOpen,color:"amber"},
 {name:"Phụ huynh",description:"Cùng con khám phá",href:"/gioi-thieu",icon:Heart,color:"sky"},
 {name:"Học viên",description:"Học và thực hành",href:"/khoa-hoc",icon:GraduationCap,color:"lime"},
 {name:"Nhà trường",description:"Kết nối việc học",href:"/lien-he",icon:School,color:"violet"}
] as const;

// Decorative photos. No reviews, learner counts or endorsements are implied.
const moments=[
 {src:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=78",alt:""},
 {src:"https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=78",alt:""},
 {src:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=78",alt:""},
 {src:"https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&q=78",alt:""},
 {src:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=78",alt:""},
 {src:"https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=500&q=78",alt:""},
 {src:"https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=500&q=78",alt:""},
 {src:"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=500&q=78",alt:""},
 {src:"https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=500&q=78",alt:""}
] as const;

const ecosystem=[
 {title:"Khóa học",desc:"Bài học theo chủ đề và mục tiêu",area:"Học tập"},
 {title:"Word Lab",desc:"Tự tay soạn thảo và định dạng",area:"Soạn thảo"},
 {title:"Trình chiếu",desc:"Biến ý tưởng thành bài giảng",area:"Bài giảng"},
 {title:"Quiz & luyện tập",desc:"Ôn tập bằng câu hỏi và phản hồi",area:"Đánh giá"},
 {title:"Tài nguyên học tập",desc:"Tư liệu và bài tập gắn thực tế",area:"Thư viện"},
 {title:"Teacher Studio",desc:"Góc nhìn dành cho người dạy",area:"Giảng dạy"},
 {title:"Excel · Coding · Data",desc:"Tư duy số từ bảng tính đến dữ liệu",area:"Kỹ năng số"},
 {title:"Live Quiz · Garden",desc:"Thử thách và học tập tương tác",area:"Tương tác"}
] as const;

const values=[
 {number:"01",title:"Học để hiểu",body:"Bắt đầu từ một câu hỏi thật rõ ràng."},
 {number:"02",title:"Luyện để nhớ",body:"Tự tay làm thay vì chỉ đứng ngoài quan sát."},
 {number:"03",title:"Làm để giỏi",body:"Tạo ra một sản phẩm nhỏ sau mỗi chặng học."},
 {number:"04",title:"Cùng tiến bộ",body:"Kết nối kiến thức với lớp học và cuộc sống."}
] as const;

export default async function HomePage(){
 const listedCourses=isLiveMode()?await getPublishedCourses():courses;
 return <main className="xcn-workshop" style={{fontFamily:homepageFont.style.fontFamily}}>
  <section className="ws-hero" aria-labelledby="ws-home-title">
   <div className="xcn-container ws-hero-copy">
    <p className="ws-hero-kicker">XƯỞNG CÔNG NGHỆ · KHÔNG GIAN HỌC TẬP SỐ</p>
    <h1 id="ws-home-title">Nơi học tập trở thành<br/><span>hành trình khám phá.</span></h1>
    <p>Học đến đâu, làm được đến đó. Từ những kỹ năng số đầu tiên đến những sản phẩm do chính bạn tạo nên.</p>
    <p className="ws-roles-label">Bắt đầu với vai trò của bạn</p>
    <div className="ws-path-grid" id="bat-dau" aria-label="Chọn vai trò">
     {rolePaths.map(role=>{const Icon=role.icon;return <Link className="ws-path" href={role.href} key={role.name} aria-label={`${role.name}: ${role.description}`}>
      <span className={`ws-role-icon ws-role-${role.color}`}><Icon size={28} strokeWidth={2.3} aria-hidden="true"/></span>
      <strong>{role.name}</strong><span className="ws-path-arrow"><ArrowRight size={16} aria-hidden="true"/></span>
     </Link>;})}
    </div>
    <p className="ws-hero-note"><Star size={15} fill="currentColor" aria-hidden="true"/><Star size={15} fill="currentColor" aria-hidden="true"/><Star size={15} fill="currentColor" aria-hidden="true"/><span>HỌC · THỬ · TẠO RA SẢN PHẨM</span></p>
   </div>
   <div className="ws-photo-mosaic" aria-label="Hình ảnh minh họa những khoảnh khắc học tập">
    {moments.map((moment,index)=><div key={moment.src} className={`ws-mosaic-photo ws-mosaic-${index+1}`} role="img" aria-label={`Khoảnh khắc học tập ${index+1}`} style={{backgroundImage:`url("${moment.src}")`}} />)}
    <div className="ws-mosaic-center"><span>KHÁM PHÁ</span><strong>Một nơi để học.<br/>Nhiều cách để lớn lên.</strong><Link href="/cong-cu">Vào Xưởng <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
    <span className="ws-mosaic-caption">Từ lớp học, gia đình đến thế giới kỹ năng số.</span>
   </div>
   <div className="ws-scroll-note"><a href="#cau-chuyen">Khám phá hành trình <ArrowDown size={17} aria-hidden="true"/></a></div>
  </section>

  <section className="ws-journey" id="cau-chuyen" aria-label="Hành trình học tập trong Xưởng Công Nghệ">
   <svg className="ws-journey-trail" viewBox="0 0 1000 2350" fill="none" preserveAspectRatio="none" aria-hidden="true"><path d="M190 70C700 170 240 360 620 475S870 760 490 860 135 1140 570 1260 760 1560 310 1630 100 1870 680 1980 815 2260 410 2300" stroke="#dce4f6" strokeWidth="3" strokeDasharray="5 12" strokeLinecap="round"/></svg>

   <div className="xcn-container ws-journey-row ws-row-blue ws-feature-main">
    <div className="ws-story-art ws-art-chat" aria-hidden="true">
     <div className="ws-chat-blob"><span className="ws-chat-bubble ws-chat-a">Cách làm này hay quá!<small>Thử thêm một ví dụ nhé.</small></span><span className="ws-chat-bubble ws-chat-b">Mình làm được rồi! <Check size={14}/></span><span className="ws-chat-bubble ws-chat-c">Hôm nay mình học được một điều mới.</span><span className="ws-chat-avatar ws-avatar-1"><GraduationCap size={22}/></span><span className="ws-chat-avatar ws-avatar-2"><Heart size={20}/></span><span className="ws-chat-sticker"><Sparkles size={26}/></span></div>
    </div>
    <div className="ws-story-copy"><span className="ws-story-icon ws-blue"><MessageCircle size={23} fill="currentColor" aria-hidden="true"/></span><p className="ws-step-eyebrow">KẾT NỐI</p><h2>Gần nhau hơn<br/>qua từng bài học.</h2><p>Một câu hỏi mở ra cuộc trò chuyện. Một bài thực hành nhỏ giúp người học, gia đình và giáo viên tìm thấy tiếng nói chung.</p><Link href="/gioi-thieu" className="ws-story-link">Khám phá cách học <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
   </div>

   <div className="xcn-container ws-journey-row ws-row-orange ws-row-reverse">
    <div className="ws-story-art ws-art-lessons" aria-hidden="true"><div className="ws-lesson-blob"/><div className="ws-lesson-card ws-lesson-back"><span>BÀI HỌC TRỰC QUAN</span><div className="ws-lesson-picture"/><b>Khám phá cách trình bày ý tưởng</b><small>TRÌNH CHIẾU</small></div><div className="ws-lesson-card ws-lesson-front"><span>THỰC HÀNH TỪNG BƯỚC</span><div className="ws-lesson-photo"/><b>Từ trang trắng đến tài liệu đầu tiên</b><small>WORD LAB</small></div><div className="ws-mini-tag"><Check size={16}/> Hoàn thành bài học</div></div>
    <div className="ws-story-copy"><span className="ws-story-icon ws-orange"><Presentation size={23} aria-hidden="true"/></span><p className="ws-step-eyebrow">TRẢI NGHIỆM</p><h2>Mở cánh cửa<br/>vào thế giới kỹ năng số.</h2><p>Soạn một trang Word, theo dõi bài trình chiếu và ứng dụng kiến thức vào việc thật. Học bằng mắt, bằng tay và bằng chính sự tò mò.</p><Link href="/cong-cu/mo-phong-word" className="ws-story-link">Thực hành với Word Lab <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
   </div>

   <div className="xcn-container ws-journey-row ws-row-purple">
    <div className="ws-story-art ws-art-quiz" aria-hidden="true"><div className="ws-quiz-blob"/><div className="ws-quiz-card ws-quiz-main"><span><ClipboardCheck size={16}/> TRẮC NGHIỆM</span><b>Phím tắt nào dùng để lưu tài liệu?</b><div>A. Ctrl + P</div><div className="ws-quiz-selected">B. Ctrl + S <Check size={18}/></div><div>C. Ctrl + Z</div><small>GIỎI LẮM! CÙNG THỬ CÂU TIẾP THEO</small></div><div className="ws-quiz-floating"><Star size={19} fill="currentColor"/> Hoàn thành thử thách</div></div>
    <div className="ws-story-copy"><span className="ws-story-icon ws-purple"><ClipboardCheck size={24} aria-hidden="true"/></span><p className="ws-step-eyebrow">LUYỆN TẬP</p><h2>Hỏi một câu.<br/>Hiểu thêm một điều.</h2><p>Mỗi bài Quiz là một cơ hội để thử sức, nhận phản hồi và nhìn lại điều mình đã học. Kiến thức trở nên gần gũi khi bạn được tự mình tìm câu trả lời.</p><Link href="/dang-nhap?next=%2Fstudent%2Fquiz" className="ws-story-link">Đến khu Quiz <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
   </div>

   <div className="xcn-container ws-journey-row ws-row-green ws-row-reverse">
    <div className="ws-story-art ws-art-steps" aria-hidden="true"><div className="ws-progress-blob"/><div className="ws-progress-board"><span>HÀNH TRÌNH CỦA BẠN</span><strong>Mỗi ngày một bước nhỏ.</strong><div className="ws-progress-line"><i className="done"><Check size={17}/></i><i className="done"><Check size={17}/></i><i className="now"><Star size={17}/></i><i><PenLine size={17}/></i></div><div className="ws-progress-labels"><span>Khám phá</span><span>Thực hành</span><span>Vận dụng</span><span>Chia sẻ</span></div></div><span className="ws-progress-spark"><Sparkles size={30}/></span></div>
    <div className="ws-story-copy"><span className="ws-story-icon ws-green"><GraduationCap size={24} aria-hidden="true"/></span><p className="ws-step-eyebrow">TIẾN BỘ</p><h2>Đi theo nhịp học<br/>của chính bạn.</h2><p>Chọn chủ đề vừa sức, thử lại khi cần và nối từng bài học thành một hành trình có ý nghĩa. Mỗi kỹ năng mới đều bắt đầu từ một lần bạn dám thử.</p><Link href="/khoa-hoc" className="ws-story-link">Chọn một khóa học <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
   </div>

   <div className="xcn-container ws-journey-row ws-row-coral">
    <div className="ws-story-art ws-art-teacher" aria-hidden="true"><div className="ws-teacher-blob"/><div className="ws-teacher-board"><span><CalendarDays size={18}/> GIỜ HỌC NGÀY MAI</span><strong>Một ý tưởng.<br/>Nhiều cách khám phá.</strong><div><b>01</b> Khởi động bằng câu hỏi</div><div><b>02</b> Thực hành cùng công cụ</div><div><b>03</b> Chia sẻ điều vừa học</div></div><span className="ws-teacher-tick"><Check size={20}/></span></div>
    <div className="ws-story-copy"><span className="ws-story-icon ws-coral"><PenLine size={23} aria-hidden="true"/></span><p className="ws-step-eyebrow">GIẢNG DẠY</p><h2>Một giờ học tuyệt vời<br/>bắt đầu từ ý tưởng.</h2><p>Biến nội dung Tin học thành trải nghiệm dễ hiểu, dễ thử và dễ nhớ. Bài giảng, câu hỏi và hoạt động thực hành cùng hướng về một mục tiêu: học sinh tự làm được.</p><Link href="/cong-cu/trinh-chieu" className="ws-story-link">Khám phá Trình chiếu <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
   </div>
  </section>

  <section className="ws-discover" aria-labelledby="ws-discover-title">
   <div className="xcn-container ws-discover-inner"><span className="ws-discover-sun"><Sparkles size={31}/></span><p>KHÁM PHÁ XƯỞNG</p><h2 id="ws-discover-title">Một thế giới kiến thức đang chờ bạn mở cửa.</h2><Link href="/cong-cu">Bắt đầu trải nghiệm <ArrowUpRight size={17} aria-hidden="true"/></Link><span className="ws-discover-decoration ws-deco-one">✳</span><span className="ws-discover-decoration ws-deco-two">✦</span><span className="ws-discover-decoration ws-deco-three">✳</span></div>
  </section>

  <section className="ws-catalog ws-section" id="du-an" aria-labelledby="ws-catalog-title"><div className="xcn-container"><div className="ws-section-heading"><p className="ws-kicker">HỆ SINH THÁI XƯỞNG CÔNG NGHỆ</p><h2 id="ws-catalog-title">Mỗi sự tò mò đều<br/>có một nơi để bắt đầu.</h2><p>Khám phá các lĩnh vực học tập, thực hành, kiểm tra và sáng tạo trong cùng một không gian.</p></div><div className="ws-directory">{ecosystem.map((item,index)=><article key={item.title} className="ws-directory-row"><span className="ws-directory-index">0{index+1}</span><h3>{item.title}</h3><p>{item.desc}</p><span className="ws-directory-area">{item.area}</span></article>)}</div><Link className="ws-directory-more" href="/cong-cu">Khám phá công cụ <ArrowUpRight size={17} aria-hidden="true"/></Link></div></section>

  <section className="ws-courses ws-section" aria-labelledby="ws-courses-title"><div className="xcn-container"><div className="ws-section-heading"><p className="ws-kicker">HỌC QUA TỪNG CHỦ ĐỀ</p><h2 id="ws-courses-title">Hôm nay bạn muốn học gì?</h2><p>Chọn một chủ đề gần gũi và bắt đầu bằng một bước vừa sức.</p></div>{listedCourses.length?<div className="ws-course-list">{listedCourses.slice(0,3).map((course,index)=><Link href={`/khoa-hoc/${course.slug}`} className="ws-course" key={course.slug}><span className="ws-course-number">0{index+1}</span><div><small>{course.category} · {course.level}</small><h3>{course.title}</h3><span>{course.lessons} bài học</span></div><ArrowUpRight size={22} aria-hidden="true"/></Link>)}</div>:<p className="ws-course-empty">Bắt đầu bằng một bài thực hành để khám phá cách học phù hợp với bạn.</p>}<Link href="/khoa-hoc" className="ws-course-more">Xem tất cả khóa học <ArrowRight size={18} aria-hidden="true"/></Link></div></section>

  <section className="ws-community ws-section" aria-labelledby="ws-community-title"><div className="xcn-container"><div className="ws-section-heading"><span className="ws-community-heart"><Heart size={20} fill="currentColor"/></span><h2 id="ws-community-title">Những điều nhỏ bé<br/>làm nên hành trình lớn.</h2><p>Bốn điều luôn hiện diện trong mỗi trải nghiệm học tập tại Xưởng Công Nghệ.</p></div><div className="ws-value-grid">{values.map(value=><article key={value.number} className="ws-value-card"><span>{value.number} / XƯỞNG</span><h3>{value.title}</h3><p>{value.body}</p><div className="ws-value-symbol" aria-hidden="true">✦</div></article>)}</div><Link href="/gioi-thieu" className="ws-community-more">Tìm hiểu câu chuyện của Xưởng <ArrowUpRight size={17} aria-hidden="true"/></Link></div></section>

  <section className="ws-trust ws-section" aria-labelledby="ws-trust-title"><div className="xcn-container ws-trust-inner"><span className="ws-trust-mark"><ShieldCheck size={28} aria-hidden="true"/></span><div><p className="ws-kicker">HỌC TẬP CÙNG SỰ TIN CẬY</p><h2 id="ws-trust-title">An tâm học hỏi.<br/>Tự tin khám phá.</h2><p>Mỗi không gian học tập nên rõ mục tiêu, dễ sử dụng và tôn trọng quyền truy cập của từng người. Đó là điều chúng tôi đặt vào trải nghiệm của Xưởng.</p><Link href="/gioi-thieu">Tìm hiểu Xưởng Công Nghệ <ArrowUpRight size={17} aria-hidden="true"/></Link></div></div></section>

  <section className="ws-photo-finale" aria-labelledby="ws-finale-title"><div className="ws-finale-shade"><h2 id="ws-finale-title">Cùng nhau tạo nên<br/>những giờ học đáng nhớ.</h2><Link href="/khoa-hoc">Khám phá bài học <ArrowUpRight size={18} aria-hidden="true"/></Link></div></section>
 </main>;
}