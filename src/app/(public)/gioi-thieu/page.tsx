import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRight,ArrowUpRight,BookOpen,GraduationCap,Layers3,LockKeyhole,School,ShieldCheck,Target,Users,Wrench} from "lucide-react";
import {PUBLIC_CATALOG,CATALOG_STATUS_LABEL,type CatalogStatus} from "@/config/public-catalog";

export const metadata:Metadata={
 title:"Giới thiệu",
 description:"Tìm hiểu sứ mệnh, phương pháp Học – Luyện – Ứng dụng, kiến trúc và lộ trình minh bạch của Xưởng Công Nghệ.",
 alternates:{canonical:"/gioi-thieu"},
 openGraph:{title:"Giới thiệu Xưởng Công Nghệ",url:"/gioi-thieu"}
};

const values=[
 {title:"Tiếp cận dễ hơn",text:"Danh mục minh bạch, giúp người học nhận ra công cụ phù hợp.",icon:BookOpen},
 {title:"Thực hành có mục tiêu",text:"Mỗi chủ đề hướng tới thao tác và sản phẩm cụ thể.",icon:Target},
 {title:"Phản hồi để cải thiện",text:"Kiểm tra và xem lại kết quả khi tính năng đã được triển khai.",icon:GraduationCap}
];
const spaces=[
 {title:"Không gian công khai",text:"Danh mục, giới thiệu và trạng thái sản phẩm dành cho mọi người.",status:"Đã có",icon:Layers3},
 {title:"Student Hub",text:"Học tập, bài luyện và tiến độ theo tài khoản.",status:"Đã có nền tảng",icon:GraduationCap},
 {title:"Teacher Studio",text:"Lớp học, giao bài và quản lý học liệu đang phát triển trên staging.",status:"Đang phát triển",icon:Users},
 {title:"Admin",text:"Quản trị nền tảng và phân quyền, yêu cầu tài khoản có quyền.",status:"Đã có, có phân quyền",icon:ShieldCheck}
];
const audiences=[
 {title:"Học sinh",text:"Học theo chủ đề, thực hành và tự kiểm tra.",icon:GraduationCap},
 {title:"Giáo viên",text:"Tìm học liệu, tìm hiểu lộ trình tổ chức hoạt động cho lớp.",icon:Users},
 {title:"Người tự học",text:"Phát triển kỹ năng Tin học và năng lực số theo nhu cầu.",icon:Wrench},
 {title:"Trường & trung tâm",text:"Khám phá khả năng hỗ trợ nhiều lớp và giáo viên trong tương lai.",icon:School}
];
const statuses:CatalogStatus[]=["available","building","planned"];

export default function AboutPage(){
 return <main className="xcn-marketing-main">
  <section className="xcn-marketing-page-hero">
   <div className="xcn-container xcn-page-hero-grid"><div><span className="xcn-kicker">Giới thiệu / Xưởng Công Nghệ</span><h1>Công nghệ dễ học hơn khi được thực hành.</h1><p>Xưởng Công Nghệ kết nối kiến thức, công cụ và hoạt động thực hành trong một nền tảng thống nhất — phát triển từng bước và theo đúng vai trò sử dụng.</p><Link className="xcn-marketing-btn primary" href="/#he-sinh-thai">Khám phá công cụ <ArrowRight size={18} aria-hidden="true"/></Link></div>
    <div className="xcn-about-illustration" aria-label="Mô hình Học, Luyện, Ứng dụng">
     <div><BookOpen aria-hidden="true"/><strong>HỌC</strong><small>Hiểu kiến thức</small></div><span aria-hidden="true">→</span><div><Target aria-hidden="true"/><strong>LUYỆN</strong><small>Thao tác</small></div><span aria-hidden="true">→</span><div><Layers3 aria-hidden="true"/><strong>ỨNG DỤNG</strong><small>Tạo sản phẩm</small></div>
    </div>
   </div>
  </section>

  <section className="xcn-marketing-section" aria-labelledby="mission-title"><div className="xcn-container">
   <div className="xcn-section-heading"><span className="xcn-kicker">01 / Sứ mệnh</span><h2 id="mission-title">Chúng tôi xây một nơi để học, làm và tiến bộ.</h2><p>Không chỉ giới thiệu lý thuyết, nền tảng hướng tới trải nghiệm có mục tiêu, cơ hội thử và tự đánh giá.</p></div>
   <div className="xcn-simple-grid thirds">{values.map(value=><article key={value.title}><value.icon size={26} aria-hidden="true"/><h3>{value.title}</h3><p>{value.text}</p></article>)}</div>
  </div></section>

  <section id="he-sinh-thai" className="xcn-marketing-section xcn-marketing-surface" aria-labelledby="about-architecture-title"><div className="xcn-container">
   <div className="xcn-section-heading"><span className="xcn-kicker">02 / Kiến trúc</span><h2 id="about-architecture-title">Được tổ chức theo đúng vai trò.</h2><p>Bốn không gian có trách nhiệm riêng. Đăng nhập và quyền truy cập được xử lý tại máy chủ, không dựa vào nhãn hiển thị trên trang công khai.</p></div>
   <div className="xcn-space-grid">{spaces.map(space=><article key={space.title}><space.icon size={25} aria-hidden="true"/><h3>{space.title}</h3><p>{space.text}</p><small>{space.status}</small></article>)}</div>
   <div className="xcn-section-note"><LockKeyhole size={17} aria-hidden="true"/> Kết nối Teacher Studio với học liệu, câu hỏi và tiến độ là mục tiêu tương lai, chưa phải tính năng Production.</div>
  </div></section>

  <section id="vai-tro" className="xcn-marketing-section" aria-labelledby="audience-title"><div className="xcn-container">
   <div className="xcn-section-heading"><span className="xcn-kicker">03 / Đối tượng</span><h2 id="audience-title">Phù hợp cho nhiều cách học và dạy.</h2><p>Danh mục công khai cho phép mỗi nhóm khám phá trước khi quyết định sử dụng.</p></div>
   <div className="xcn-simple-grid fourths">{audiences.map(a=><article key={a.title}><a.icon size={26} aria-hidden="true"/><h3>{a.title}</h3><p>{a.text}</p></article>)}</div>
  </div></section>

  <section className="xcn-marketing-section xcn-marketing-surface" aria-labelledby="principles-title"><div className="xcn-container xcn-method-layout">
    <div><span className="xcn-kicker">04 / Nguyên tắc</span><h2 id="principles-title">Ít thao tác thừa. Nhiều thời gian cho học tập.</h2><p className="xcn-section-intro">Thiết kế công cụ xoay quanh nhiệm vụ thật và quyền truy cập cần thiết.</p></div>
    <ul className="xcn-principles">
      <li><strong>Học liệu có mục tiêu</strong><p>Ưu tiên nội dung dễ hiểu, ví dụ và bài tập gắn kỹ năng.</p></li>
      <li><strong>Module có trách nhiệm rõ</strong><p>Nội dung, bài làm và quản trị không dùng chung quyền chỉ vì cùng website.</p></li>
      <li><strong>Quyền riêng tư và an toàn</strong><p>Học viên chỉ truy cập thông tin phù hợp với tài khoản được xác thực.</p></li>
      <li><strong>Phát triển có kiểm chứng</strong><p>Chức năng được đánh dấu theo thực trạng, không theo lời hứa.</p></li>
    </ul>
  </div></section>

  <section id="lo-trinh" className="xcn-marketing-section" aria-labelledby="roadmap-title"><div className="xcn-container">
   <div className="xcn-section-heading"><span className="xcn-kicker">05 / Lộ trình minh bạch</span><h2 id="roadmap-title">Phát triển từng bước, minh bạch trạng thái.</h2><p>Danh mục dưới đây dùng cùng nguồn trạng thái với trang chủ. Một route thử nghiệm không đồng nghĩa một sản phẩm đã sẵn sàng hoàn toàn.</p></div>
   <div className="xcn-status-columns">{statuses.map(status=><div key={status} className="xcn-status-column">
    <h3><span className="xcn-atlas-status" data-status={status}>{CATALOG_STATUS_LABEL[status]}</span></h3>
    <ul>{PUBLIC_CATALOG.filter(item=>item.status===status).map(item=><li key={item.id}><Link href={item.detailHref}>{item.title}<ArrowUpRight size={15} aria-hidden="true"/></Link></li>)}</ul>
   </div>)}</div>
  </div></section>

  <section className="xcn-marketing-final" aria-labelledby="about-cta"><div className="xcn-container xcn-final-inner">
   <div><span className="xcn-kicker">06 / Bắt đầu khám phá</span><h2 id="about-cta">Tìm công cụ phù hợp với cách học của bạn.</h2><p>Tìm hiểu các không gian đang có và lộ trình phát triển trước khi sử dụng.</p></div>
   <div className="xcn-marketing-actions"><Link className="xcn-marketing-btn primary" href="/#he-sinh-thai">Xem hệ sinh thái <ArrowRight size={18} aria-hidden="true"/></Link><Link className="xcn-marketing-btn secondary" href="/lien-he">Liên hệ <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
  </div></section>
 </main>;
}
