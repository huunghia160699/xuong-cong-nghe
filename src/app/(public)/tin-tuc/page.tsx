import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRight,BarChart3,BrainCircuit,FileText} from "lucide-react";

export const metadata:Metadata={title:"Tin tức & Tri thức",description:"Góc hướng dẫn thực hành, tư duy công nghệ và cập nhật từ Xưởng Công Nghệ."};

export default function Page(){
 return <main className="xcn-journal">
  <section className="xcn-journal-mast"><div className="xcn-container"><div className="xcn-journal-meta"><span>Tạp chí kỹ năng số</span><span>Số mở đầu · 2026</span></div><h1>Tin tức <i>&</i> Tri thức</h1><div className="xcn-journal-sub"><p>Đọc ít thuật ngữ hơn.<br/>Làm được nhiều việc hơn.</p><div className="xcn-journal-filters"><span className="active">Tất cả</span><span>Kỹ năng số</span><span>Hướng dẫn</span><span>Sản phẩm</span></div></div></div></section>
  <section className="xcn-journal-feature"><div className="xcn-container xcn-journal-feature-grid"><div className="xcn-journal-art" aria-hidden="true"><div className="xcn-journal-art-sheet"><span>01</span><strong>LEARN<br/>BY<br/><em>DOING</em></strong><div/></div><span className="xcn-journal-stamp">Bài nổi bật</span></div><article><span>Kỹ năng học tập · 6 phút đọc</span><h2>Học bằng cách làm: vì sao một bài thực hành ngắn có thể thay đổi cả cách học?</h2><p>Phản hồi sớm, mục tiêu nhỏ và cảm giác tự tay hoàn thành giúp kiến thức không dừng lại ở việc “đã xem qua”.</p><span className="xcn-journal-status">Đang biên soạn bản đầy đủ</span></article></div></section>
  <section className="xcn-journal-latest"><div className="xcn-container"><div className="xcn-journal-section-title"><span>Mới trong xưởng</span><h2>Ba chủ đề đang được phát triển</h2></div><div className="xcn-journal-grid">
   <article><div className="xcn-journal-icon blue"><BarChart3/></div><span>Excel · Công việc</span><h3>Từ bảng dữ liệu thô đến một câu trả lời có ích.</h3><p>Khái niệm nền tảng, công thức vừa đủ và những ví dụ sát công việc hằng ngày.</p><small>Đang biên soạn</small></article>
   <article><div className="xcn-journal-icon peach"><BrainCircuit/></div><span>AI · Tư duy</span><h3>Dùng AI tốt hơn mà vẫn giữ quyền tự suy nghĩ.</h3><p>Cách đặt câu hỏi, kiểm tra kết quả và bảo vệ dữ liệu cá nhân khi dùng công cụ AI.</p><small>Đang biên soạn</small></article>
   <article><div className="xcn-journal-icon green"><FileText/></div><span>Sản phẩm · Cập nhật</span><h3>Bên trong một công cụ học thực hành được xây như thế nào?</h3><p>Từ mục tiêu học tập đến thao tác, phản hồi và kiểm thử trước khi phát hành.</p><small>Đang biên soạn</small></article>
  </div></div></section>
  <section className="xcn-journal-flow"><div className="xcn-container xcn-journal-flow-grid"><div><span>Nguyên tắc biên tập</span><h2>Mỗi bài viết phải dẫn đến một hành động.</h2></div><ol><li><b>01</b><span><strong>Đọc</strong>Hiểu một khái niệm bằng ngôn ngữ rõ ràng.</span></li><li><b>02</b><span><strong>Thử</strong>Mở công cụ hoặc bài học để làm ngay.</span></li><li><b>03</b><span><strong>Áp dụng</strong>Tạo một sản phẩm nhỏ của chính bạn.</span></li></ol></div></section>
  <section className="xcn-journal-cta"><div className="xcn-container"><p>Không cần chờ bài viết mới.</p><Link href="/cong-cu">Mở công cụ và bắt đầu làm <ArrowRight size={19}/></Link></div></section>
 </main>;
}
