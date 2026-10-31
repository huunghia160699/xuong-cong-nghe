import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRight,ArrowUpRight,BookOpen,Headset,Lightbulb,Mail,School,ShieldCheck,Users} from "lucide-react";
import {CONTACT_TOPICS,getVerifiedContactChannels,getContactTopic,type ContactTopic} from "@/config/public-contact";

export const metadata:Metadata={
 title:"Liên hệ & Hợp tác",
 description:"Tìm hiểu các nhu cầu hỗ trợ, góp ý và hợp tác với Xưởng Công Nghệ. Kênh liên hệ sẽ được công bố sau khi xác minh chính thức.",
 alternates:{canonical:"/lien-he"},
 openGraph:{title:"Liên hệ & Hợp tác | Xưởng Công Nghệ",url:"/lien-he"}
};

const sections:{id:ContactTopic;title:string;description:string;icon:typeof Headset}[]=[
 {id:"support",title:"Hỗ trợ công cụ",description:"Hướng dẫn sử dụng, lỗi thao tác hoặc câu hỏi kỹ thuật.",icon:Headset},
 {id:"school",title:"Lớp học & nhà trường",description:"Tìm hiểu khả năng ứng dụng cho lớp, trường và trung tâm.",icon:School},
 {id:"feedback",title:"Góp ý sản phẩm",description:"Đề xuất cải thiện trải nghiệm học tập và công cụ.",icon:Lightbulb},
 {id:"partnership",title:"Hợp tác",description:"Câu hỏi về phát triển học liệu và hợp tác chuyên môn.",icon:Users}
];
const faq=[
 {q:"Tôi có thể bắt đầu sử dụng mà chưa liên hệ không?",a:"Có. Bạn có thể xem hệ sinh thái và các trang công cụ công khai. Những chức năng yêu cầu tài khoản sẽ hướng dẫn đăng nhập."},
 {q:"Tôi muốn tìm hiểu quyền sử dụng cho trường học?",a:"Chính sách cho tổ chức chưa được công bố. Bạn có thể xem định hướng và tình trạng ở Bảng giá; không có đơn hàng hay phí đã được xác nhận."},
 {q:"Khi nào có biểu mẫu gửi thông tin?",a:"Biểu mẫu chỉ được mở sau khi có kênh tiếp nhận thật, kiểm tra dữ liệu, chống spam và thông báo về xử lý thông tin cá nhân."}
];

export default async function ContactPage({searchParams}:{searchParams:Promise<{topic?:string}>}){
 const params=await searchParams;
 const topic=getContactTopic(params.topic);
 const selected=CONTACT_TOPICS[topic];
 const channels=getVerifiedContactChannels();
 return <main className="xcn-marketing-main">
  <section className="xcn-marketing-page-hero xcn-contact-hero" aria-labelledby="contact-title"><div className="xcn-container">
   <span className="xcn-kicker">Xưởng Công Nghệ / Liên hệ & Hợp tác</span>
   <h1 id="contact-title">Kết nối với Xưởng Công Nghệ.</h1>
   <p>Tìm hiểu cách được hỗ trợ, đề xuất ý tưởng hoặc thảo luận về nhu cầu triển khai công cụ cho lớp và trường. Các kênh liên hệ chỉ hiển thị khi được xác minh.</p>
  </div></section>
  <section className="xcn-marketing-section" aria-labelledby="contact-needs-title"><div className="xcn-container">
   <div className="xcn-section-heading"><span className="xcn-kicker">01 / Bạn cần điều gì?</span><h2 id="contact-needs-title">Chọn nội dung bạn quan tâm.</h2><p>Trước khi có kênh tiếp nhận chính thức, chúng tôi chỉ giới thiệu các hướng hỗ trợ để bạn biết thông tin nào đang sẵn có.</p></div>
   <div className="xcn-contact-grid">{sections.map(section=><Link key={section.id}
    className="xcn-contact-card" href={"/lien-he?topic="+section.id+"#kenh-lien-he"}
    aria-current={topic===section.id?"true":undefined}>
     <section.icon size={26} aria-hidden="true"/><h3>{section.title}</h3><p>{section.description}</p>
     <span>Tìm hiểu <ArrowUpRight size={17} aria-hidden="true"/></span>
    </Link>)}</div>
   <div className="xcn-contact-topic" role="status" aria-live="polite">
    <span className="xcn-atlas-status" data-status="building">{selected.label}</span>
    <h3>{selected.heading}</h3><p>{selected.description}</p>
   </div>
  </div></section>
  <section id="kenh-lien-he" className="xcn-marketing-section xcn-marketing-surface" aria-labelledby="contact-channels-title"><div className="xcn-container xcn-method-layout">
   <div><span className="xcn-kicker">02 / Kênh chính thức</span><h2 id="contact-channels-title">Thông tin liên hệ được xác minh.</h2><p className="xcn-section-intro">Chúng tôi không công bố email, số điện thoại hoặc đường dẫn mạng xã hội khi chưa xác nhận đúng chủ sở hữu và kênh tiếp nhận.</p></div>
   {channels.length>0
    ? <ul className="xcn-contact-channel-list">{channels.map(channel=><li key={channel.id}><Mail size={20} aria-hidden="true"/><div><strong>{channel.label}</strong><p>{channel.description}</p><a href={channel.href} rel="noopener noreferrer">{channel.value} <ArrowUpRight size={15} aria-hidden="true"/></a></div></li>)}</ul>
    : <div className="xcn-contact-not-ready"><Mail size={30} aria-hidden="true"/><h3>Kênh liên hệ đang được cập nhật.</h3><p>Chưa có địa chỉ email, hotline, Zalo hay liên kết mạng xã hội được phê duyệt để công bố. Chúng tôi chưa tiếp nhận lời nhắn trực tiếp trên trang này.</p><div className="xcn-contact-notice"><ShieldCheck size={19} aria-hidden="true"/><span>Biểu mẫu gửi thông tin sẽ chỉ xuất hiện khi có hệ thống tiếp nhận, bảo vệ dữ liệu và chống spam.</span></div></div>}
  </div></section>
  <section className="xcn-marketing-section" aria-labelledby="contact-faq-title"><div className="xcn-container xcn-faq-layout">
   <div><span className="xcn-kicker">03 / Giải đáp</span><h2 id="contact-faq-title">Thông tin hữu ích trước khi liên hệ.</h2><p className="xcn-section-intro">Bạn có thể khám phá nền tảng và chính sách đang phát triển mà không cần cung cấp dữ liệu cá nhân.</p></div>
   <div className="xcn-faq-list">{faq.map(item=><details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div>
  </div></section>
  <section className="xcn-marketing-final" aria-labelledby="contact-cta"><div className="xcn-container xcn-final-inner">
   <div><span className="xcn-kicker">04 / Khám phá tiếp</span><h2 id="contact-cta">Bạn đang triển khai cho một lớp hoặc trường?</h2><p>Xem lộ trình theo vai trò hoặc thông tin quyền sử dụng. Không cần điền biểu mẫu khi chưa có đầu nhận xác minh.</p></div>
   <div className="xcn-marketing-actions"><Link className="xcn-marketing-btn primary" href="/bang-gia">Xem quyền sử dụng <ArrowRight size={17} aria-hidden="true"/></Link><Link className="xcn-marketing-btn secondary" href="/#he-sinh-thai">Khám phá công cụ <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
  </div></section>
 </main>;
}
