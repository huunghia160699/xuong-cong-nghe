import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRight,ArrowUpRight,BookOpen,ClipboardCheck,FileText,GraduationCap,Layers3,Presentation,School,ShieldCheck,Users} from "lucide-react";
import {PublicAtlas} from "@/components/public-atlas";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {isLiveMode} from "@/lib/supabase/config";

export const metadata:Metadata={
 title:"Xưởng Công Nghệ | Hệ sinh thái học và thực hành năng lực số",
 description:"Khám phá hệ sinh thái Xưởng Công Nghệ: khóa học, thực hành Tin học, trắc nghiệm, trình chiếu và công cụ dành cho người học, giáo viên.",
 alternates:{canonical:"/"},
 openGraph:{title:"Xưởng Công Nghệ | Hệ sinh thái học và thực hành năng lực số",description:"Khám phá công cụ, hiểu cách chúng kết nối và bắt đầu trong không gian phù hợp.",url:"/"}
};

const journey=[
 {step:"01",title:"Soạn và tổ chức học liệu",text:"Bài học và câu hỏi hướng tới việc dùng lại theo chủ đề.",icon:BookOpen},
 {step:"02",title:"Học và thực hành",text:"Khám phá kiến thức rồi luyện thao tác với công cụ phù hợp.",icon:FileText},
 {step:"03",title:"Kiểm tra và phản hồi",text:"Làm câu hỏi, đối chiếu kết quả trong tài khoản học tập.",icon:ClipboardCheck},
 {step:"04",title:"Theo dõi quá trình",text:"Hướng tới kết nối tiến độ, lớp học và sản phẩm theo quyền.",icon:GraduationCap}
];
const roles=[
 {title:"Học sinh & người tự học",text:"Khám phá bài học, luyện tập và xem tiến độ của chính mình.",icon:GraduationCap,status:"Đã có nền tảng",href:"/dang-nhap?next=%2Fstudent",cta:"Vào không gian học"},
 {title:"Giáo viên",text:"Định hướng chuẩn bị nội dung, tổ chức lớp và giao bài trong một nơi.",icon:Users,status:"Đang phát triển trên staging",href:"/gioi-thieu#lo-trinh",cta:"Xem lộ trình"},
 {title:"Quản trị viên",text:"Quản lý nội dung, người dùng, phân quyền và roadmap qua tài khoản được cấp quyền.",icon:ShieldCheck,status:"Chỉ dành cho tài khoản có quyền",href:"/dang-nhap?next=%2Fadmin",cta:"Đi tới quản trị"}
];

export default async function HomePage(){
 let authenticated=false;
 if(isLiveMode()){
  try{
   const supabase=await createSupabaseServerClient();
   const {data:{user}}=await supabase.auth.getUser();
   authenticated=Boolean(user);
  }catch{/* Visitors may still explore the entire public atlas. */}
 }
 return <main className="xcn-marketing-main">
  <section className="xcn-marketing-hero" aria-labelledby="home-title">
   <div className="xcn-container xcn-hero-grid">
    <div className="xcn-hero-copy">
     <span className="xcn-kicker">Xưởng Công Nghệ · Học → Luyện → Ứng dụng</span>
     <h1 id="home-title">Một hệ sinh thái.<br/><em>Nhiều cách học và thực hành.</em></h1>
     <p>Khám phá khóa học, phòng thực hành, bài kiểm tra, học liệu và công cụ dành cho giáo viên — được tổ chức thống nhất trong Xưởng Công Nghệ.</p>
     <div className="xcn-marketing-actions">
      <Link className="xcn-marketing-btn primary" href="/#he-sinh-thai">Khám phá hệ sinh thái <ArrowRight size={18} aria-hidden="true"/></Link>
      <Link className="xcn-marketing-btn secondary" href={authenticated?"/student":"/dang-nhap"}>{authenticated?"Không gian học tập":"Đăng nhập để bắt đầu"} <ArrowUpRight size={17} aria-hidden="true"/></Link>
     </div>
     <p className="xcn-hero-note">Xem toàn bộ danh mục không cần đăng nhập. Chức năng có tài khoản yêu cầu xác thực.</p>
    </div>
    <div className="xcn-architecture-preview" aria-label="Sơ đồ định hướng các module của nền tảng">
     <div className="xcn-preview-header"><span>Kiến trúc sản phẩm</span><span className="xcn-preview-pill">Bản đồ module</span></div>
     <div className="xcn-preview-core"><Layers3 size={23} aria-hidden="true"/><strong>XƯỞNG CÔNG NGHỆ</strong><small>Nền tảng học và thực hành</small></div>
     <div className="xcn-preview-nodes">
      <div><BookOpen size={20} aria-hidden="true"/><strong>Khóa học</strong><small>Học liệu</small></div>
      <div><Presentation size={20} aria-hidden="true"/><strong>Thực hành</strong><small>Word · Slides</small></div>
      <div><ClipboardCheck size={20} aria-hidden="true"/><strong>Kiểm tra</strong><small>Quiz</small></div>
     </div>
     <div className="xcn-preview-down" aria-hidden="true">↓ Hướng tới kết nối tiến độ và lớp học</div>
     <div className="xcn-preview-base"><span><GraduationCap size={18} aria-hidden="true"/> Học sinh</span><span><Users size={18} aria-hidden="true"/> Giáo viên <small>đang phát triển</small></span><span><ShieldCheck size={18} aria-hidden="true"/> Quản trị</span></div>
     <p className="xcn-preview-disclaimer">Sơ đồ định hướng, không khẳng định mọi kết nối đã vận hành.</p>
    </div>
   </div>
  </section>

  <section id="he-sinh-thai" className="xcn-marketing-section xcn-atlas-section" aria-labelledby="atlas-title">
   <div className="xcn-container">
    <div className="xcn-section-heading">
     <span className="xcn-kicker">01 / Khám phá sản phẩm</span>
     <h2 id="atlas-title">Từ bài học đến sản phẩm, tất cả trong một nơi.</h2>
     <p>Mỗi công cụ giải quyết một nhu cầu cụ thể và hướng tới việc dùng chung học liệu, bài tập và tiến độ. Trạng thái dưới đây phân biệt phần đã có, đang phát triển và dự kiến.</p>
    </div>
    <PublicAtlas authenticated={authenticated}/>
   </div>
  </section>

  <section id="kien-truc" className="xcn-marketing-section xcn-marketing-surface" aria-labelledby="architecture-title">
   <div className="xcn-container">
    <div className="xcn-section-heading">
     <span className="xcn-kicker">02 / Kiến trúc kết nối</span>
     <h2 id="architecture-title">Không chỉ nhiều công cụ — mà là một hành trình thống nhất.</h2>
     <p>Từ nội dung đến thực hành và đánh giá. Việc kết nối Teacher Studio, giao bài và tiến độ liên module vẫn nằm trong lộ trình phát triển.</p>
    </div>
    <ol className="xcn-journey">{journey.map(item=><li key={item.step}>
     <span className="xcn-journey-step">{item.step}</span>
     <item.icon size={26} strokeWidth={1.8} aria-hidden="true"/>
     <h3>{item.title}</h3><p>{item.text}</p>
    </li>)}</ol>
    <p className="xcn-section-note"><ShieldCheck size={17} aria-hidden="true"/> Admin quản trị nền tảng; Teacher Studio và các luồng giao bài liên kết là chức năng đang được thiết kế, chưa mở công khai.</p>
   </div>
  </section>

  <section id="vai-tro" className="xcn-marketing-section" aria-labelledby="roles-title">
   <div className="xcn-container">
    <div className="xcn-section-heading"><span className="xcn-kicker">03 / Không gian theo vai trò</span><h2 id="roles-title">Một nền tảng, đúng không gian của bạn.</h2><p>Bạn có thể khám phá công khai trước; khi sử dụng dữ liệu và chức năng theo tài khoản, hệ thống sẽ áp dụng quyền truy cập tương ứng.</p></div>
    <div className="xcn-role-grid">{roles.map(role=><article className="xcn-role-card" key={role.title}>
      <span className="xcn-role-icon"><role.icon size={25} aria-hidden="true"/></span><h3>{role.title}</h3>
      <p>{role.text}</p><small>{role.status}</small>
      <Link href={role.href}>{role.cta} <ArrowUpRight size={17} aria-hidden="true"/></Link>
    </article>)}</div>
   </div>
  </section>

  <section id="cong-cu" className="xcn-marketing-section xcn-marketing-surface" aria-labelledby="showcase-title">
   <div className="xcn-container"><div className="xcn-section-heading"><span className="xcn-kicker">04 / Không gian nổi bật</span><h2 id="showcase-title">Nhìn rõ công cụ trước khi bắt đầu.</h2><p>Trang giới thiệu dẫn đến các điểm trải nghiệm đang có hoặc thông tin lộ trình, không tạo sản phẩm mẫu giả.</p></div>
    <div className="xcn-showcase-grid">
     <Link className="xcn-showcase-card" href="/cong-cu/mo-phong-word"><span>Đang phát triển</span><FileText size={34} aria-hidden="true"/><h3>Word Lab</h3><p>Trình mô phỏng soạn thảo và định dạng văn bản đang được hoàn thiện.</p><strong>Xem bản thử nghiệm <ArrowUpRight size={17} aria-hidden="true"/></strong></Link>
     <Link className="xcn-showcase-card" href="/cong-cu/trinh-chieu"><span>Đã có thư viện</span><Presentation size={34} aria-hidden="true"/><h3>Trình chiếu Tin học</h3><p>Khám phá nội dung trình chiếu theo phần chủ đề và lớp học.</p><strong>Xem thư viện <ArrowUpRight size={17} aria-hidden="true"/></strong></Link>
     <Link className="xcn-showcase-card" href={authenticated?"/student/quiz":"/dang-nhap?next=%2Fstudent%2Fquiz"}><span>Đã có · cần đăng nhập</span><ClipboardCheck size={34} aria-hidden="true"/><h3>Quiz</h3><p>Làm câu hỏi và theo dõi kết quả trong tài khoản người học.</p><strong>Vào bài luyện <ArrowUpRight size={17} aria-hidden="true"/></strong></Link>
     <Link className="xcn-showcase-card" href="/gioi-thieu#lo-trinh"><span>Dự kiến</span><School size={34} aria-hidden="true"/><h3>Excel & công cụ mở rộng</h3><p>Thực hành bảng tính và công cụ cho giáo viên nằm trong kế hoạch.</p><strong>Xem lộ trình <ArrowUpRight size={17} aria-hidden="true"/></strong></Link>
    </div>
   </div>
  </section>

  <section id="du-an" className="xcn-marketing-section" aria-labelledby="method-title">
   <div className="xcn-container xcn-method-layout">
    <div><span className="xcn-kicker">05 / Phương pháp</span><h2 id="method-title">Học → Luyện → Ứng dụng.</h2><p className="xcn-section-intro">Đi từ hiểu kiến thức đến thao tác, rồi vận dụng vào bài thực hành hoặc dự án. Đây là định hướng xây dựng học liệu của Xưởng Công Nghệ.</p></div>
    <ol className="xcn-method-list">
     <li><strong>Học để hiểu</strong><p>Nội dung rõ theo chủ đề, gắn với những nhiệm vụ cụ thể.</p></li>
     <li><strong>Luyện để vững</strong><p>Thao tác với công cụ và luyện câu hỏi có phản hồi.</p></li>
     <li><strong>Ứng dụng thật</strong><p>Kết nối kỹ năng thành sản phẩm hoặc dự án theo lộ trình.</p></li>
    </ol>
   </div>
  </section>

  <section className="xcn-marketing-section xcn-marketing-surface" aria-labelledby="price-preview-title">
   <div className="xcn-container"><div className="xcn-section-heading"><span className="xcn-kicker">06 / Mô hình sử dụng</span><h2 id="price-preview-title">Bắt đầu theo nhu cầu của bạn.</h2><p>Nhóm nhu cầu dưới đây giúp bạn tìm hiểu sản phẩm; mức giá và quyền sử dụng cụ thể chưa được công bố.</p></div>
    <div className="xcn-tier-preview">
     {["Khám phá","Giáo viên","Trường học & trung tâm"].map((name,index)=><div key={name}><span>0{index+1}</span><h3>{name}</h3><p>{["Tìm hiểu công cụ và chương trình học công khai.","Khám phá định hướng quản lý lớp, học liệu và đánh giá.","Tìm hiểu kế hoạch tổ chức nhiều lớp và giáo viên."][index]}</p></div>)}
    </div>
    <Link href="/bang-gia" className="xcn-inline-link">Xem thông tin quyền sử dụng <ArrowUpRight size={17} aria-hidden="true"/></Link>
   </div>
  </section>

  <section className="xcn-marketing-section" aria-labelledby="news-preview-title">
   <div className="xcn-container xcn-updates-layout"><div><span className="xcn-kicker">07 / Tri thức & cập nhật</span><h2 id="news-preview-title">Góc kiến thức và cập nhật.</h2><p className="xcn-section-intro">Nội dung hướng dẫn Tin học, chia sẻ phương pháp và cập nhật sản phẩm sẽ được xuất bản khi được kiểm duyệt.</p><Link className="xcn-inline-link" href="/tin-tuc">Đến mục Tin tức <ArrowUpRight size={17} aria-hidden="true"/></Link></div><div className="xcn-empty-articles" role="status"><BookOpen size={30} aria-hidden="true"/><h3>Bài viết chuyên môn đang được biên soạn.</h3><p>Chưa có bài đã xuất bản để giới thiệu ở đây.</p></div></div>
  </section>

  <section className="xcn-marketing-final" aria-labelledby="final-title">
   <div className="xcn-container xcn-final-inner"><div><span className="xcn-kicker">Hành trình bắt đầu từ khám phá</span><h2 id="final-title">Khám phá trước. Bắt đầu khi bạn sẵn sàng.</h2><p>Chọn đúng công cụ và tìm hiểu trạng thái trước khi sử dụng.</p></div><div className="xcn-marketing-actions"><Link className="xcn-marketing-btn primary" href="/#he-sinh-thai">Xem hệ sinh thái <ArrowRight size={18} aria-hidden="true"/></Link><Link className="xcn-marketing-btn secondary" href="/dang-nhap">Đăng nhập <ArrowUpRight size={17} aria-hidden="true"/></Link></div></div>
  </section>
 </main>;
}
