import type {Metadata} from "next";
import {Suspense} from "react";
import Link from "next/link";
import {ArrowRight,BookOpen} from "lucide-react";
import {PublicNewsExplorer} from "@/components/public-news-explorer";
import {getPublishedArticles} from "@/config/public-articles";

export const metadata:Metadata={
 title:"Tin tức & Tri thức",
 description:"Khám phá các nội dung Tin học, giáo dục số và cập nhật chính thức từ Xưởng Công Nghệ khi bài viết được xuất bản.",
 alternates:{canonical:"/tin-tuc"},
 openGraph:{title:"Tin tức & Tri thức | Xưởng Công Nghệ",url:"/tin-tuc"}
};

export default function NewsPage(){
 const articles=getPublishedArticles();
 return <main className="xcn-marketing-main">
  <section className="xcn-marketing-page-hero xcn-news-hero" aria-labelledby="news-title"><div className="xcn-container">
   <span className="xcn-kicker">Xưởng Công Nghệ / Tin tức & Tri thức</span>
   <h1 id="news-title">Kiến thức mới. Cách làm rõ ràng.</h1>
   <p>Nơi dành cho nội dung Tin học, phương pháp dạy học, chuyển đổi số và các cập nhật sản phẩm được xác minh. Bài viết chỉ xuất hiện khi đã được duyệt và xuất bản.</p>
  </div></section>
  <section className="xcn-marketing-section" aria-labelledby="article-heading"><div className="xcn-container">
   <div className="xcn-section-heading"><span className="xcn-kicker">01 / Thư viện bài viết</span><h2 id="article-heading">Tìm hiểu theo chủ đề của bạn.</h2><p>Chọn chủ đề hoặc nhập từ khóa. Bộ lọc được lưu trên đường dẫn để bạn có thể chia sẻ kết quả tìm kiếm.</p></div>
   <Suspense fallback={<div className="xcn-news-empty" role="status">Đang tải bộ lọc bài viết...</div>}>
    <PublicNewsExplorer articles={articles}/>
   </Suspense>
  </div></section>
  <section className="xcn-marketing-section xcn-marketing-surface" aria-labelledby="news-next"><div className="xcn-container xcn-updates-layout">
   <div><span className="xcn-kicker">02 / Đọc và thực hành</span><h2 id="news-next">Đọc để hiểu, mở công cụ để thực hành.</h2><p className="xcn-section-intro">Bạn có thể khám phá các không gian học tập và công cụ đã có trong khi thư viện nội dung được chuẩn bị.</p></div>
   <div className="xcn-news-next-card"><BookOpen size={30} aria-hidden="true"/><h3>Tiếp tục khám phá</h3><p>Tìm hiểu các bài học, Word Lab, trình chiếu và trắc nghiệm cùng trạng thái phát triển minh bạch.</p><Link className="xcn-marketing-btn primary" href="/#he-sinh-thai">Xem hệ sinh thái <ArrowRight size={17} aria-hidden="true"/></Link></div>
  </div></section>
 </main>;
}
