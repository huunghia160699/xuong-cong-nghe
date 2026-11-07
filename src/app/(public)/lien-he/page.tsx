import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRight,Building2,GraduationCap,LifeBuoy,ShieldCheck,UserRound} from "lucide-react";

export const metadata:Metadata={title:"Liên hệ",description:"Chọn đúng luồng hỗ trợ cho người học, giáo viên và nhà trường."};

export default function Page(){
 return <main className="xcn-contact">
  <section className="xcn-contact-hero"><div className="xcn-container xcn-contact-hero-grid"><div><p className="xcn-page-kicker">Trung tâm hỗ trợ</p><h1>Hãy bắt đầu từ điều bạn đang cần.</h1><p>Chọn đúng nhóm bên dưới để tìm đường đi nhanh nhất. Kênh tiếp nhận chính thức sẽ được mở khi quy trình hỗ trợ và bảo vệ dữ liệu hoàn tất.</p></div><div className="xcn-contact-signal" aria-hidden="true"><span/><span/><span/><div><LifeBuoy/><b>Chúng tôi đang lắng nghe</b><small>Chọn một hướng để bắt đầu</small></div></div></div></section>
  <section className="xcn-contact-paths"><div className="xcn-container"><div className="xcn-contact-paths-head"><span>Chọn một hướng</span><h2>Bạn đang liên hệ với vai trò nào?</h2></div><div className="xcn-contact-path-grid">
   <article><span>01</span><UserRound/><div><h3>Người học</h3><p>Bài học, công cụ, tài khoản hoặc tiến độ cá nhân.</p><Link href="/dang-nhap">Đăng nhập để bắt đầu <ArrowRight size={17}/></Link></div></article>
   <article><span>02</span><GraduationCap/><div><h3>Giáo viên</h3><p>Học liệu, lớp học, bài giao và không gian giáo viên.</p><Link href="/gioi-thieu">Xem định hướng <ArrowRight size={17}/></Link></div></article>
   <article><span>03</span><Building2/><div><h3>Nhà trường</h3><p>Triển khai theo lớp, quyền truy cập và phạm vi dữ liệu.</p><Link href="/bang-gia">Xem quyền sử dụng <ArrowRight size={17}/></Link></div></article>
  </div></div></section>
  <section className="xcn-contact-prepare"><div className="xcn-container xcn-contact-prepare-grid"><div className="xcn-contact-note"><ShieldCheck/><span>An toàn trước tiên</span><h2>Đừng gửi mật khẩu, JWT hoặc khóa bí mật.</h2><p>Ảnh chụp lỗi nên che email, mã truy cập và dữ liệu cá nhân.</p></div><div><span className="xcn-contact-small">Trước khi liên hệ</span><h2>Bốn thông tin giúp xử lý nhanh hơn.</h2><ol><li><b>01</b><span>Vai trò của bạn: người học, giáo viên hay quản trị.</span></li><li><b>02</b><span>Tên trang hoặc tính năng đang sử dụng.</span></li><li><b>03</b><span>Các bước đã làm trước khi vấn đề xảy ra.</span></li><li><b>04</b><span>Thiết bị và trình duyệt đang dùng.</span></li></ol></div></div></section>
  <section className="xcn-contact-footer"><div className="xcn-container"><div><span>Trong lúc chờ kênh hỗ trợ chính thức</span><h2>Bạn vẫn có thể khám phá nền tảng.</h2></div><Link href="/cong-cu">Xem các công cụ đang hoạt động <ArrowRight size={18}/></Link></div></section>
 </main>;
}
