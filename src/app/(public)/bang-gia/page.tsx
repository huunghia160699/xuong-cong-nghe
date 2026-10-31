import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRight,ArrowUpRight,BookOpen,GraduationCap,School,ShieldCheck} from "lucide-react";

export const metadata:Metadata={
 title:"Bảng giá & quyền sử dụng",
 description:"Tìm hiểu các nhóm nhu cầu sử dụng Xưởng Công Nghệ. Chính sách giá, quyền lợi và giới hạn cụ thể đang được hoàn thiện; chưa có thanh toán trực tuyến.",
 alternates:{canonical:"/bang-gia"},
 openGraph:{title:"Bảng giá & quyền sử dụng Xưởng Công Nghệ",url:"/bang-gia"}
};
const plans=[
 {title:"Khám phá",audience:"Dành cho người học và người muốn tìm hiểu.",icon:BookOpen,items:["Xem hệ sinh thái và trạng thái sản phẩm","Tìm hiểu chương trình học công khai","Khám phá các công cụ đã giới thiệu","Xem nội dung và hướng dẫn được xuất bản","Tìm hiểu cách đăng nhập để sử dụng","Quyền tài khoản cụ thể: đang xác định"],href:"/#he-sinh-thai",cta:"Khám phá danh mục"},
 {title:"Giáo viên",audience:"Dành cho nhu cầu tổ chức hoạt động trong lớp.",icon:GraduationCap,items:["Tìm hiểu hướng phát triển Teacher Studio","Quản lý lớp: đang phát triển trên staging","Giao bài và theo dõi: đang thiết kế","Tái sử dụng học liệu: định hướng tương lai","Phân quyền theo lớp: chờ kiểm thử","Chính sách cấp quyền: chưa công bố"],href:"/gioi-thieu#lo-trinh",cta:"Xem lộ trình"},
 {title:"Trường học & trung tâm",audience:"Dành cho nhu cầu triển khai theo tổ chức.",icon:School,items:["Tìm hiểu lộ trình quản lý nhiều lớp","Hỗ trợ nhiều giáo viên: dự kiến","Báo cáo theo tổ chức: dự kiến","Phân quyền quản lý: đang xác định","Tư vấn triển khai: phụ thuộc kênh liên hệ","Điều khoản hợp tác: chưa ban hành"],href:"/lien-he?topic=pricing",cta:"Tìm hiểu liên hệ"}
];
const matrix=[
 ["Xem danh mục và thông tin sản phẩm","Có","Có","Có"],
 ["Truy cập bài học theo tài khoản","Theo quyền hiện có","Đang xác định","Đang xác định"],
 ["Quản lý lớp và thành viên","Đang xác định","Đang phát triển","Dự kiến"],
 ["Giao bài, kiểm tra và kết quả","Theo quyền hiện có","Đang xác định","Đang xác định"],
 ["Thư viện tài nguyên và dung lượng lưu trữ","Đang xác định","Đang xác định","Đang xác định"],
 ["Số lớp, người dùng và giới hạn sử dụng","Đang xác định","Đang xác định","Đang xác định"],
 ["Báo cáo và phân quyền tổ chức","Không công bố","Đang xác định","Dự kiến"],
 ["Hỗ trợ và điều khoản","Chưa công bố","Chưa công bố","Chưa công bố"]
];
const faqs=[
 {q:"Tôi có thể xem các công cụ trước khi đăng nhập không?",a:"Có. Danh mục, giới thiệu và tình trạng công cụ được công khai. Các chức năng sử dụng dữ liệu tài khoản phải được xác thực và kiểm tra quyền."},
 {q:"Chính sách giá đã áp dụng chưa?",a:"Chưa có bảng giá hoặc gói thanh toán chính thức được công bố trên website. Mọi giới hạn hoặc quyền lợi chưa xác nhận được ghi là đang xác định."},
 {q:"Tài khoản giáo viên gồm những gì?",a:"Teacher Studio quản lý lớp, giao bài và báo cáo vẫn đang trong lộ trình phát triển và kiểm thử; chưa công bố quyền lợi gói giáo viên để đăng ký mua."},
 {q:"Trường học cần triển khai thế nào?",a:"Mô hình nhiều giáo viên và nhiều lớp thuộc giai đoạn dự kiến. Trang Liên hệ sẽ cập nhật kênh chính thức khi được xác minh."},
 {q:"Dữ liệu cá nhân được phân quyền ra sao?",a:"Chức năng theo tài khoản được kiểm tra bằng xác thực và phân quyền ở máy chủ. Quyền truy cập các module dự kiến sẽ được kiểm thử trước khi phát hành."}
];

export default function PricingPage(){
 return <main className="xcn-marketing-main">
  <section className="xcn-marketing-page-hero xcn-pricing-hero" aria-labelledby="pricing-title"><div className="xcn-container">
   <span className="xcn-kicker">Bảng giá / Quyền sử dụng</span><h1 id="pricing-title">Lựa chọn cách sử dụng phù hợp.</h1><p>Các nhóm dưới đây mô tả nhu cầu cá nhân, giáo viên và tổ chức. Quyền lợi, giới hạn và mức giá chính thức sẽ chỉ được công bố sau khi chính sách được phê duyệt.</p>
   <div className="xcn-policy-banner"><ShieldCheck size={22} aria-hidden="true"/><span><strong>Chưa mở thanh toán hoặc bán gói.</strong> Website hiện không có giá niêm yết, ưu đãi, thời hạn dùng thử hay cam kết tính năng thương mại.</span></div>
  </div></section>

  <section className="xcn-marketing-section" aria-labelledby="plan-title"><div className="xcn-container">
   <div className="xcn-section-heading"><span className="xcn-kicker">01 / Theo nhu cầu</span><h2 id="plan-title">Ba nhóm sử dụng để bạn tìm hiểu.</h2><p>Thông tin dưới đây không phải bảng quyền lợi đã ký kết hoặc đang được bán.</p></div>
   <div className="xcn-pricing-grid">{plans.map(plan=><article key={plan.title} className="xcn-pricing-card">
    <span className="xcn-role-icon"><plan.icon size={26} aria-hidden="true"/></span><h3>{plan.title}</h3><p>{plan.audience}</p>
    <div className="xcn-pricing-unset">Chính sách giá đang hoàn thiện</div>
    <h4>Nhu cầu & định hướng</h4><ul>{plan.items.map(item=><li key={item}>{item}</li>)}</ul>
    <Link className="xcn-marketing-btn secondary" href={plan.href}>{plan.cta} <ArrowUpRight size={17} aria-hidden="true"/></Link>
   </article>)}</div>
  </div></section>

  <section className="xcn-marketing-section xcn-marketing-surface" aria-labelledby="compare-title"><div className="xcn-container">
   <div className="xcn-section-heading"><span className="xcn-kicker">02 / So sánh</span><h2 id="compare-title">Những quyền nào đang được xác định?</h2><p>Bảng thể hiện trạng thái thông tin, không thay thế chính sách quyền sử dụng hoặc hợp đồng dịch vụ.</p></div>
   <div className="xcn-pricing-table-scroll" role="region" tabIndex={0} aria-label="Bảng so sánh quyền sử dụng, cuộn ngang trên màn hình nhỏ"><table className="xcn-pricing-table"><caption className="sr-only">So sánh thông tin quyền sử dụng theo nhu cầu</caption><thead><tr><th scope="col">Chức năng / quyền</th><th scope="col">Khám phá</th><th scope="col">Giáo viên</th><th scope="col">Trường & trung tâm</th></tr></thead><tbody>{matrix.map(row=><tr key={row[0]}>{row.map((cell,index)=>index===0?<th key={cell} scope="row">{cell}</th>:<td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
  </div></section>

  <section className="xcn-marketing-section" aria-labelledby="policy-title"><div className="xcn-container xcn-method-layout">
   <div><span className="xcn-kicker">03 / Chính sách</span><h2 id="policy-title">Minh bạch trước khi triển khai.</h2><p className="xcn-section-intro">Quyền lợi, nâng cấp, thanh toán, hỗ trợ và quyền dữ liệu cần được phê duyệt riêng trước khi áp dụng.</p></div>
   <div className="xcn-policy-summary"><h3>Hiện trạng cần lưu ý</h3><p>Trang này không thu thập thông tin thanh toán, không tạo đơn hàng và không kích hoạt các tính năng chưa được triển khai.</p><p>Khi có chính sách chính thức, quyền của từng nhóm sẽ được công bố kèm điều kiện và giới hạn rõ ràng.</p></div>
  </div></section>

  <section className="xcn-marketing-section xcn-marketing-surface" aria-labelledby="faq-title"><div className="xcn-container xcn-faq-layout">
    <div><span className="xcn-kicker">04 / Giải đáp</span><h2 id="faq-title">Câu hỏi thường gặp.</h2><p className="xcn-section-intro">Những thông tin nên biết trước khi đăng nhập và sử dụng các không gian công cụ.</p></div>
    <div className="xcn-faq-list">{faqs.map(faq=><details key={faq.q}><summary>{faq.q}<span aria-hidden="true">+</span></summary><p>{faq.a}</p></details>)}</div>
  </div></section>

  <section className="xcn-marketing-final" aria-labelledby="pricing-cta"><div className="xcn-container xcn-final-inner">
   <div><span className="xcn-kicker">05 / Tìm hiểu thêm</span><h2 id="pricing-cta">Bạn cần phương án phù hợp cho lớp hoặc trường?</h2><p>Trang Liên hệ sẽ hiển thị kênh tiếp nhận sau khi được xác minh; hiện chưa có biểu mẫu gửi thông tin hay đặt mua.</p></div>
   <div className="xcn-marketing-actions"><Link href="/lien-he?topic=pricing" className="xcn-marketing-btn primary">Xem kênh liên hệ <ArrowRight size={18} aria-hidden="true"/></Link><Link href="/#he-sinh-thai" className="xcn-marketing-btn secondary">Khám phá sản phẩm <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
  </div></section>
 </main>;
}
