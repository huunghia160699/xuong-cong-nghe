import type {Metadata} from "next";
import Link from "next/link";
import {ArrowDownRight,ArrowRight,BookOpen,MousePointer2,Shapes} from "lucide-react";

export const metadata:Metadata={title:"Giới thiệu",description:"Câu chuyện và phương pháp học thực hành của Xưởng Công Nghệ."};

export default function Page(){
 return <main className="xcn-about">
  <section className="xcn-about-hero"><div className="xcn-container xcn-about-hero-grid">
   <div className="xcn-about-index"><span>01 — Giới thiệu</span><span>Học để hiểu<br/>Làm để thành thạo</span></div>
   <div className="xcn-about-lead"><p className="xcn-page-kicker">Xưởng Công Nghệ</p><h1>Biến điều khó hiểu thành một việc <em>có thể tự tay làm.</em></h1><p>Chúng tôi xây một không gian học kỹ năng số bằng trải nghiệm: mục tiêu rõ, thao tác thật và phản hồi đủ gần để người học không bị bỏ lại.</p><div className="xcn-page-actions"><Link className="xcn-page-solid" href="/cong-cu">Bắt đầu thực hành <ArrowRight size={17}/></Link><Link className="xcn-page-plain" href="#phuong-phap">Xem cách chúng tôi làm <ArrowDownRight size={17}/></Link></div></div>
   <div className="xcn-about-orbit" aria-hidden="true"><div className="xcn-about-orbit-center">X</div><span>Hiểu</span><span>Luyện</span><span>Làm</span></div>
  </div></section>
  <section className="xcn-about-manifest"><div className="xcn-container xcn-about-manifest-grid"><p>Không chỉ xem bài giảng.</p><blockquote>“Một bài học tốt phải để lại cho người học một thứ họ <strong>làm được</strong>, không chỉ một điều họ vừa nghe qua.”</blockquote></div></section>
  <section id="phuong-phap" className="xcn-about-method"><div className="xcn-container"><div className="xcn-about-section-head"><span>02 — Phương pháp</span><h2>Một vòng học ngắn.<br/>Ba chuyển động rõ ràng.</h2></div><div className="xcn-about-steps">
   <article><span>01</span><BookOpen/><h3>Học để hiểu</h3><p>Bắt đầu bằng một khái niệm vừa đủ, ví dụ cụ thể và mục tiêu có thể kiểm tra.</p></article>
   <article><span>02</span><MousePointer2/><h3>Luyện cho vững</h3><p>Thao tác trực tiếp, thử lại khi cần và nhận phản hồi ngay trong lúc làm.</p></article>
   <article><span>03</span><Shapes/><h3>Ứng dụng được</h3><p>Kết thúc bằng một bài làm, sản phẩm hoặc kỹ năng dùng được ngoài đời.</p></article>
  </div></div></section>
  <section className="xcn-about-audience"><div className="xcn-container xcn-about-audience-grid"><div><span>03 — Cùng một nền tảng</span><h2>Ba góc nhìn,<br/>một hành trình học.</h2></div><div className="xcn-about-roles"><article><b>Người học</b><p>Học theo lộ trình, thực hành và nhìn thấy tiến bộ của chính mình.</p><span>Đã có nền tảng</span></article><article><b>Giáo viên</b><p>Xây dựng học liệu, lớp học và bài giao theo từng giai đoạn kiểm thử.</p><span>Đang phát triển</span></article><article><b>Nhà trường</b><p>Quản lý nội dung, vai trò và báo cáo theo đúng phạm vi được cấp.</p><span>Trong lộ trình</span></article></div></div></section>
  <section className="xcn-about-close"><div className="xcn-container"><p>Chúng tôi công khai trạng thái từng module.</p><h2>Cái gì chưa sẵn sàng sẽ được nói rõ.</h2><Link href="/cong-cu">Khám phá những gì đã hoạt động <ArrowRight size={18}/></Link></div></section>
 </main>;
}
