import type {Metadata} from "next";
import Link from "next/link";
import {FeatureCard,PublicHero,SectionTitle,TrustNote} from "@/components/public-content";

export const metadata:Metadata={
 title:"Giới thiệu",
 description:"Câu chuyện, sứ mệnh và kiến trúc Xưởng Công Nghệ đang được hoàn thiện. Trong lúc này, bạn có thể khám phá các công cụ đã có."
};
export default function Page(){
 return <main><PublicHero eyebrow="Về Xưởng Công Nghệ" title="Công nghệ dễ học hơn khi được thực hành." description="Xưởng Công Nghệ giúp người học biến kiến thức số thành kỹ năng bằng những bài học có mục tiêu, công cụ để tự tay làm và phản hồi rõ ràng."><div className="xcn-content-actions"><Link className="xcn-content-primary" href="/cong-cu">Dùng thử công cụ</Link><Link className="xcn-content-secondary" href="/khoa-hoc">Xem lộ trình</Link></div></PublicHero>
  <section className="xcn-content-section"><div className="xcn-container"><SectionTitle eyebrow="Cách chúng tôi làm" title="Một vòng học ngắn, rõ và có kết quả." description="Mỗi trải nghiệm được thiết kế để người học nhanh chóng chuyển từ hiểu sang làm được."/><div className="xcn-content-grid three"><FeatureCard title="Học để hiểu" description="Kiến thức được chia thành bài ngắn, ví dụ cụ thể và mục tiêu có thể kiểm tra."/><FeatureCard title="Luyện cho vững" description="Người học thao tác trực tiếp trên công cụ, làm lại khi cần và nhận phản hồi ngay."/><FeatureCard title="Ứng dụng được" description="Mỗi chặng hướng đến một bài làm, sản phẩm hoặc kỹ năng có thể dùng ngoài đời."/></div></div></section>
  <section className="xcn-content-section soft"><div className="xcn-container xcn-content-two-col"><div><SectionTitle eyebrow="Dành cho ai" title="Một nền tảng, nhiều cách bắt đầu."/></div><div className="xcn-content-list"><div><strong>Người học</strong><p>Học theo lộ trình, thực hành và theo dõi tiến bộ của chính mình.</p></div><div><strong>Giáo viên</strong><p>Từng bước xây dựng không gian học liệu, lớp học và bài giao.</p></div><div><strong>Nhà trường</strong><p>Tiến tới quản lý nội dung, vai trò và báo cáo theo phạm vi được cấp quyền.</p></div></div></div></section>
  <section className="xcn-content-section"><div className="xcn-container"><TrustNote>Trang web đang mở rộng từng module. Tính năng nào chưa sẵn sàng sẽ được ghi rõ trạng thái, không dùng nội dung minh họa để giả lập khả năng đã triển khai.</TrustNote></div></section></main>;
}
