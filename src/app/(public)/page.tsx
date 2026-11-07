import type {Metadata} from "next";
import Link from "next/link";
import {
 ArrowRight,ArrowUpRight,BarChart3,BookOpen,BrainCircuit,CheckCircle2,
 ClipboardCheck,Code2,FileText,Gamepad2,GraduationCap,Library,MousePointer2,
 Newspaper,Presentation,School,ShieldCheck,Sparkles,Target,
 WandSparkles,Zap
} from "lucide-react";
import {courses} from "@/data/mock";
import {getPublishedCourses} from "@/features/courses/live-public";
import {isLiveMode} from "@/lib/supabase/config";

export const metadata:Metadata={
 title:"Xưởng Công Nghệ | Học, thực hành và sáng tạo với công nghệ",
 description:"Một xưởng học số dành cho người học và giáo viên: khóa học, công cụ thực hành, bài luyện, trò chơi, tài nguyên và tin tức công nghệ.",
 alternates:{canonical:"/"}
};

const worlds=[
 {icon:BookOpen,title:"Học tập",desc:"Lộ trình ngắn, bài học rõ và bước tiếp theo dễ thấy.",meta:"Khóa học · Roadmap"},
 {icon:MousePointer2,title:"Thực hành",desc:"Tự tay làm trên Word Lab, trình chiếu và các phòng lab.",meta:"Office · Data · Coding"},
 {icon:ClipboardCheck,title:"Kiểm tra",desc:"Quiz, câu sai cần ôn và kết quả giúp biết nên học gì tiếp.",meta:"Quiz · Đề · Phản hồi"},
 {icon:Gamepad2,title:"Trò chơi",desc:"Học qua thử thách lớp, ô chữ, đua kiến thức và nhiệm vụ.",meta:"Games · Live · XP"},
 {icon:GraduationCap,title:"Giáo viên",desc:"Hướng tới tạo nội dung, giao bài, chấm và theo dõi lớp.",meta:"Teacher Studio"},
 {icon:Library,title:"Tài nguyên",desc:"Bài viết, ebook, video, dataset và học liệu theo chủ đề.",meta:"Library · News"}
] as const;

const roadmapGroups=[
 {no:"01",title:"Học & luyện",items:"Lộ trình · Quiz · Typing · Chứng chỉ",tone:"mint"},
 {no:"02",title:"Sáng tạo",items:"Word · Excel · Slides · Scratch · Web",tone:"blue"},
 {no:"03",title:"Lớp học",items:"Giao bài · Chấm · Live Quiz · Báo cáo",tone:"peach"},
 {no:"04",title:"Khám phá",items:"AI sư phạm · Data Lab · Coding · SQL",tone:"yellow"},
 {no:"05",title:"Động lực",items:"XP · Nhiệm vụ · Garden · Đấu trường",tone:"green"}
] as const;

export default async function HomePage(){
 const listedCourses=isLiveMode()?await getPublishedCourses():courses;
 return <main className="xcn-universe">
  <section className="xcn-u-hero" aria-labelledby="home-title"><div className="xcn-container xcn-u-hero-grid">
   <div className="xcn-u-hero-copy"><p className="xcn-u-eyebrow"><span/> Một xưởng học số cho mọi người</p><h1 id="home-title">Học công nghệ.<br/><em>Tự tay làm thật.</em></h1><p>Khóa học, công cụ thực hành, bài luyện, trò chơi và không gian lớp học — cùng nằm trong một hành trình giúp bạn hiểu, làm được và tiến bộ.</p><div className="xcn-u-actions"><Link href="/cong-cu" className="xcn-u-primary">Vào xưởng thực hành <ArrowUpRight size={18}/></Link><Link href="/khoa-hoc" className="xcn-u-secondary">Khám phá khóa học <ArrowRight size={18}/></Link></div><div className="xcn-u-hero-notes"><span><CheckCircle2/> Dùng thử trước</span><span><CheckCircle2/> Học theo lộ trình</span><span><CheckCircle2/> Phù hợp lớp học</span></div></div>
   <div className="xcn-u-console" aria-label="Bản xem trước hệ sinh thái Xưởng Công Nghệ"><div className="xcn-u-console-top"><span><i/><i/><i/></span><b>XƯỞNG CÔNG NGHỆ</b><small>Khám phá</small></div><div className="xcn-u-console-body"><div className="xcn-u-console-nav"><span className="active"><Sparkles/>Hôm nay</span><span><BookOpen/>Học</span><span><Gamepad2/>Chơi</span><span><Target/>Tiến bộ</span></div><div className="xcn-u-console-main"><div className="xcn-u-welcome"><small>BƯỚC TIẾP THEO</small><strong>Làm quen với Word</strong><p>Tiếp tục bài thực hành đang mở.</p><div><span>64%</span><i><b/></i></div></div><div className="xcn-u-mini-grid"><article className="word"><FileText/><span>Word Lab</span><small>Thực hành</small></article><article className="quiz"><ClipboardCheck/><span>Quiz nhanh</span><small>10 câu</small></article><article className="game"><Gamepad2/><span>Thử thách</span><small>Đang lên ý tưởng</small></article><article className="news"><Newspaper/><span>Tri thức mới</span><small>Khám phá</small></article></div></div></div></div>
  </div></section>

  <section className="xcn-u-proof"><div className="xcn-container"><span>Học để hiểu</span><i/><span>Làm để thành thạo</span><i/><span>Chia sẻ để cùng tiến bộ</span></div></section>

  <section className="xcn-u-worlds" id="he-sinh-thai" aria-labelledby="worlds-title"><div className="xcn-container"><div className="xcn-u-section-head"><div><p className="xcn-u-eyebrow"><span/> Tất cả trong một nơi</p><h2 id="worlds-title">Mỗi điều bạn muốn giỏi hơn<br/>đều có một cửa để bắt đầu.</h2></div><p>Từ một bài học ngắn đến phòng lab, từ trò chơi cả lớp đến công cụ giáo viên — mọi phần dùng chung một hành trình học.</p></div><div className="xcn-u-world-grid">{worlds.map((world,index)=><article key={world.title} className={`world-${index+1}`}><div><world.icon/><span>0{index+1}</span></div><h3>{world.title}</h3><p>{world.desc}</p><small>{world.meta}</small></article>)}</div></div></section>

  <section className="xcn-u-tools" aria-labelledby="tools-title"><div className="xcn-container"><div className="xcn-u-tools-intro"><div><p className="xcn-u-eyebrow light"><span/> Công cụ đang có</p><h2 id="tools-title">Mở trình duyệt.<br/>Bắt đầu làm.</h2></div><p>Không cần chỉ đứng ngoài xem. Bạn có thể thử những trải nghiệm đã hoạt động và thấy rõ những gì đang tiếp tục hoàn thiện.</p></div><div className="xcn-u-tool-stage">
   <Link href="/cong-cu/mo-phong-word" className="xcn-u-tool-feature"><div className="xcn-u-word-art" aria-hidden="true"><div className="xcn-u-word-window"><div><span>File</span><span>Trang đầu</span><span>Chèn</span><span>Bố trí</span></div><article><small>BÀI THỰC HÀNH</small><strong>Kế hoạch học tập</strong><i/><i/><i className="short"/><p><b>01</b> Mục tiêu tuần này</p></article></div></div><div className="xcn-u-tool-content"><span className="available">Đang dùng được</span><div><FileText/><small>WORD LAB</small></div><h3>Soạn thảo như trên Word.</h3><p>Gõ, định dạng, dùng Ribbon và làm quen với trang A4 ngay trên trình duyệt.</p><b>Mở bản trải nghiệm <ArrowUpRight size={18}/></b></div></Link>
   <div className="xcn-u-tool-side"><Link href="/cong-cu/trinh-chieu"><span className="available">Đang dùng được</span><Presentation/><div><h3>Trình chiếu Tin học</h3><p>Slide trực quan và câu hỏi tương tác theo chủ đề.</p></div><ArrowUpRight/></Link><Link href="/dang-nhap?next=%2Fstudent%2Fquiz"><span className="available">Đang dùng được</span><ClipboardCheck/><div><h3>Quiz & bài luyện</h3><p>Làm bài, xem phản hồi và kết quả học tập.</p></div><ArrowUpRight/></Link><article><span className="planned">Trong lộ trình</span><Code2/><div><h3>Coding & Data Lab</h3><p>Python, SQL, HTML và dữ liệu trong sandbox an toàn.</p></div><ArrowRight/></article></div>
  </div><Link href="/cong-cu" className="xcn-u-view-all">Xem toàn bộ khu công cụ <ArrowRight/></Link></div></section>

  <section className="xcn-u-courses" aria-labelledby="courses-title"><div className="xcn-container"><div className="xcn-u-course-head"><div><p className="xcn-u-eyebrow"><span/> Học theo đường đi rõ ràng</p><h2 id="courses-title">Chọn một kỹ năng.<br/>Đi từng bước tới đích.</h2></div><Link href="/khoa-hoc">Tất cả khóa học <ArrowRight/></Link></div>{listedCourses.length?<div className="xcn-u-course-grid">{listedCourses.slice(0,3).map((course,index)=><Link href={`/khoa-hoc/${course.slug}`} key={course.slug} className={`xcn-u-course course-${index+1}`}><div className="xcn-u-course-cover"><span>0{index+1}</span><BookOpen/><small>{course.category}</small></div><div><span>{course.level} · {course.lessons} bài học</span><h3>{course.title}</h3><b>Xem lộ trình <ArrowUpRight/></b></div></Link>)}</div>:<div className="xcn-u-course-empty"><BookOpen/><p>Khóa học đang được cập nhật. Bạn vẫn có thể bắt đầu bằng các công cụ thực hành.</p></div>}</div></section>

  <section className="xcn-u-roles" aria-labelledby="roles-title"><div className="xcn-container xcn-u-roles-grid"><div className="xcn-u-role-copy"><p className="xcn-u-eyebrow light"><span/> Hai vai trò, một lớp học</p><h2 id="roles-title">Người học tiến bộ.<br/>Giáo viên nhìn thấy hành trình.</h2><p>Nền tảng được quy hoạch để nội dung tạo một lần có thể dùng cho bài học, bài giao, quiz, trình chiếu và trò chơi.</p><Link href="/gioi-thieu">Xem cách Xưởng vận hành <ArrowRight/></Link></div><div className="xcn-u-role-panels"><article className="student"><div><GraduationCap/><span>NGƯỜI HỌC</span></div><h3>Biết mình nên làm gì tiếp theo.</h3><ul><li>Tiếp tục bài đang học</li><li>Ôn lại câu sai</li><li>Xem tiến độ và kết quả</li><li>Khám phá tài nguyên liên quan</li></ul><span className="role-status available">Đã có nền tảng</span></article><article className="teacher"><div><School/><span>GIÁO VIÊN</span></div><h3>Chuẩn bị và theo dõi lớp ở một nơi.</h3><ul><li>Tạo nội dung và ngân hàng câu hỏi</li><li>Giao bài theo lớp</li><li>Chấm và phản hồi</li><li>Trình chiếu, thống kê, báo cáo</li></ul><span className="role-status planned">Đang phát triển</span></article></div></div></section>

  <section className="xcn-u-play" aria-labelledby="play-title"><div className="xcn-container"><div className="xcn-u-section-head"><div><p className="xcn-u-eyebrow"><span/> Học mà muốn quay lại</p><h2 id="play-title">Trò chơi không chỉ để vui.<br/>Mỗi lượt chơi đều quay về kiến thức.</h2></div><p>Khu trò chơi nằm trong lộ trình dài hạn và sẽ dùng chung kho câu hỏi, lớp học, quyền riêng tư cùng dữ liệu tiến bộ.</p></div><div className="xcn-u-playground">
   <article className="xcn-u-game-main"><div className="xcn-u-game-sky"><span/><span/><span/><div className="xcn-u-game-island"><i>XP</i><b>VƯỜN<br/>TRI THỨC</b></div><div className="xcn-u-game-path"><i/><i/><i/><i/></div></div><div><span className="planned">Ý tưởng dài hạn</span><h3>Xây khu vườn bằng chính tiến bộ học tập.</h3><p>Nhiệm vụ, streak, huy hiệu và Garden chỉ mở sau khi vòng học cốt lõi ổn định.</p></div></article>
   <div className="xcn-u-game-list"><article><div><Target/><b>Live Quiz</b></div><span>Phòng chơi · PIN · QR</span><small>Trong lộ trình</small></article><article><div><Zap/><b>Đường đua tri thức</b></div><span>Cùng lớp trả lời theo đội</span><small>Ý tưởng</small></article><article><div><WandSparkles/><b>Ô chữ & ghép từ</b></div><span>Dùng chung kho câu hỏi</span><small>Ý tưởng</small></article><article><div><Gamepad2/><b>Đấu trường Quiz</b></div><span>Phiên ngắn, luật rõ ràng</span><small>Ý tưởng dài hạn</small></article></div>
  </div></div></section>

  <section className="xcn-u-roadmap" aria-labelledby="roadmap-title"><div className="xcn-container"><div className="xcn-u-roadmap-top"><div><p className="xcn-u-eyebrow light"><span/> 132 ý tưởng đã được lưu</p><h2 id="roadmap-title">Không phải 132 ứng dụng.<br/>Là một bản đồ để xây đúng thứ tự.</h2></div><p>Năm website tham khảo đã được chuyển hóa thành năm nhóm năng lực. Ý tưởng chưa triển khai luôn được ghi rõ trạng thái.</p></div><div className="xcn-u-roadmap-grid">{roadmapGroups.map(group=><article key={group.no} className={group.tone}><span>{group.no}</span><h3>{group.title}</h3><p>{group.items}</p><small>Trong Roadmap</small></article>)}</div><div className="xcn-u-roadmap-foot"><p><ShieldCheck/> Dữ liệu và quyền trước · Tiến độ học trước game · Giáo viên kiểm duyệt AI</p><Link href="/gioi-thieu">Hiểu thêm về định hướng <ArrowRight/></Link></div></div></section>

  <section className="xcn-u-news" aria-labelledby="news-title"><div className="xcn-container"><div className="xcn-u-news-head"><div><p className="xcn-u-eyebrow"><span/> Tin tức & tri thức</p><h2 id="news-title">Đọc để hiểu.<br/>Mở công cụ để làm.</h2></div><Link href="/tin-tuc">Vào tạp chí <ArrowUpRight/></Link></div><div className="xcn-u-news-grid"><article className="featured"><div><span>01</span><strong>LEARN<br/>BY<br/><em>DOING</em></strong></div><small>Kỹ năng học tập</small><h3>Vì sao bài thực hành ngắn giúp kiến thức ở lại lâu hơn?</h3><p>Góc nhìn về học bằng cách làm và phản hồi sớm.</p></article><article><div className="xcn-u-news-icon"><BarChart3/></div><small>Excel · Công việc</small><h3>Từ bảng dữ liệu thô đến một câu trả lời có ích.</h3><p>Đang biên soạn</p></article><article><div className="xcn-u-news-icon ai"><BrainCircuit/></div><small>AI · Tư duy</small><h3>Dùng AI tốt hơn mà vẫn giữ quyền tự suy nghĩ.</h3><p>Đang biên soạn</p></article></div></div></section>

  <section className="xcn-u-final"><div className="xcn-container xcn-u-final-grid"><div><p>Một nơi để học, làm, chơi và cùng nhau tiến bộ.</p><h2>Mở một cánh cửa.<br/>Bắt đầu hành trình của bạn.</h2></div><div><Link href="/cong-cu" className="xcn-u-final-primary">Khám phá Xưởng Công Nghệ <ArrowUpRight/></Link><Link href="/bang-gia">Xem quyền sử dụng <ArrowRight/></Link></div></div></section>
 </main>;
}
