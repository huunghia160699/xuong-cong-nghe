import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRight,Check,LockKeyhole,Sparkles} from "lucide-react";

export const metadata:Metadata={title:"Bảng giá",description:"Quyền sử dụng Xưởng Công Nghệ — bắt đầu miễn phí và mở rộng minh bạch."};
const rows=[['Dùng công cụ công khai','Có','Có','Có'],['Lưu tiến độ cá nhân','—','Có','Có'],['Học theo lộ trình','—','Có','Có'],['Quản lý học liệu và lớp','—','—','Theo lộ trình'],['Quản lý vai trò, báo cáo','—','—','Theo lộ trình']];

export default function Page(){
 return <main className="xcn-pricing">
  <section className="xcn-pricing-hero"><div className="xcn-container"><p className="xcn-page-kicker">Quyền sử dụng minh bạch</p><h1>Bắt đầu bằng trải nghiệm.<br/><span>Chỉ mở rộng khi thật sự cần.</span></h1><p>Hiện chưa mở thanh toán production. Bạn có thể dùng các trải nghiệm công khai và đăng nhập khi muốn lưu tiến độ.</p></div></section>
  <section className="xcn-pricing-plans"><div className="xcn-container xcn-pricing-grid">
   <article className="xcn-plan xcn-plan-free"><div className="xcn-plan-top"><span>Khám phá</span><Sparkles/></div><h2>Miễn phí</h2><p>Cho người muốn xem, thử và bắt đầu ngay.</p><ul><li><Check/>Công cụ công khai</li><li><Check/>Không cần đăng nhập để xem thử</li><li><Check/>Nội dung giới thiệu và hướng dẫn</li></ul><Link href="/cong-cu">Dùng thử ngay <ArrowRight size={17}/></Link></article>
   <article className="xcn-plan xcn-plan-focus"><div className="xcn-plan-badge">Nên bắt đầu ở đây</div><div className="xcn-plan-top"><span>Người học</span><span className="xcn-plan-dot"/></div><h2>Tài khoản học tập</h2><p>Cho người muốn học có lộ trình và lưu lại kết quả.</p><ul><li><Check/>Lưu tiến độ và bài làm</li><li><Check/>Xem kết quả cá nhân</li><li><Check/>Truy cập nội dung theo quyền</li></ul><Link href="/dang-nhap">Vào không gian của tôi <ArrowRight size={17}/></Link></article>
   <article className="xcn-plan xcn-plan-roadmap"><div className="xcn-plan-top"><span>Giáo viên & Nhà trường</span><LockKeyhole/></div><h2>Theo lộ trình</h2><p>Mở theo từng giai đoạn sau khi bảo mật và vận hành đạt yêu cầu.</p><ul><li><Check/>Lớp học và bài giao</li><li><Check/>Học liệu dùng chung</li><li><Check/>Vai trò và báo cáo</li></ul><Link href="/lien-he">Trao đổi nhu cầu <ArrowRight size={17}/></Link></article>
  </div></section>
  <section className="xcn-pricing-compare"><div className="xcn-container"><div className="xcn-pricing-head"><div><span>So sánh nhanh</span><h2>Mỗi quyền đều gắn với một nhu cầu thật.</h2></div><p>Không dùng nhãn gói để quảng cáo tính năng chưa sẵn sàng.</p></div><div className="xcn-compare-table" role="table"><div className="xcn-compare-row head" role="row"><b>Tính năng</b><b>Khám phá</b><b>Người học</b><b>Tổ chức</b></div>{rows.map((row)=><div className="xcn-compare-row" role="row" key={row[0]}>{row.map((cell,i)=><span key={cell+i}>{cell}</span>)}</div>)}</div></div></section>
  <section className="xcn-pricing-note"><div className="xcn-container xcn-pricing-note-grid"><span>Chính sách rõ ràng</span><h2>Chưa có billing, chưa công bố giá.</h2><p>Khi mở gói trả phí, trang này sẽ có mức giá, giới hạn, so sánh, chính sách thanh toán và hoàn tiền đầy đủ.</p></div></section>
 </main>;
}
