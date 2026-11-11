import Link from "next/link";
import {BookOpen,FileText,Globe2,Presentation} from "lucide-react";
import {Brand} from "@/components/brand";

// Every footer destination resolves to an existing route; shortcut badges are genuine product links.
const columns=[
 {title:"Về Xưởng",links:[
  {label:"Giới thiệu",href:"/gioi-thieu"},
  {label:"Tin tức & tri thức",href:"/tin-tuc"},
  {label:"Bảng giá",href:"/bang-gia"},
  {label:"Liên hệ",href:"/lien-he"}]},
 {title:"Học & thực hành",links:[
  {label:"Khóa học",href:"/khoa-hoc"},
  {label:"Word Lab",href:"/cong-cu/mo-phong-word"},
  {label:"Trình chiếu",href:"/cong-cu/trinh-chieu"},
  {label:"Quiz & luyện tập",href:"/dang-nhap?next=%2Fstudent%2Fquiz"}]},
 {title:"Khám phá",links:[
  {label:"Thư viện công cụ",href:"/cong-cu"},
  {label:"Dự án học tập",href:"/#du-an"},
  {label:"Tài nguyên học tập",href:"/khoa-hoc"},
  {label:"Hướng dẫn học tập",href:"/gioi-thieu"}]},
 {title:"Kết nối",links:[
  {label:"Dành cho giáo viên",href:"/gioi-thieu"},
  {label:"Dành cho phụ huynh",href:"/gioi-thieu"},
  {label:"Dành cho nhà trường",href:"/lien-he"},
  {label:"Đăng nhập",href:"/dang-nhap"}]}
] as const;

export function Footer(){
 return <footer className="xcn-public-footer">
  <div className="xcn-container xcn-public-footer-inner">
   <div className="xcn-public-footer-brand">
    <Brand/>
    <p>Cùng học, cùng thực hành và khám phá thế giới công nghệ. Mỗi kỹ năng bắt đầu từ một trải nghiệm nhỏ.</p>
    <span className="xcn-public-footer-locale" aria-label="Ngôn ngữ hiển thị: Tiếng Việt">
     <Globe2 size={15} aria-hidden="true"/> Tiếng Việt
    </span>
   </div>
   <nav className="xcn-public-footer-links" aria-label="Liên kết cuối trang">
    {columns.map(column=><div className="xcn-public-footer-column" key={column.title}>
     <h2>{column.title}</h2>
     <ul>{column.links.map(link=><li key={link.label}>
      <Link href={link.href}>{link.label}</Link>
     </li>)}</ul>
    </div>)}
   </nav>
  </div>
  <div className="xcn-container xcn-public-footer-bottom">
   <nav className="xcn-public-footer-quicklinks" aria-label="Truy cập nhanh">
    <Link href="/khoa-hoc" aria-label="Khóa học"><BookOpen size={17} aria-hidden="true"/></Link>
    <Link href="/cong-cu/mo-phong-word" aria-label="Word Lab"><FileText size={17} aria-hidden="true"/></Link>
    <Link href="/cong-cu/trinh-chieu" aria-label="Trình chiếu"><Presentation size={17} aria-hidden="true"/></Link>
   </nav>
   <div className="xcn-public-footer-meta">
    <span>© {new Date().getFullYear()} Xưởng Công Nghệ</span>
    <Link href="/gioi-thieu">Giới thiệu</Link>
    <Link href="/lien-he">Liên hệ</Link>
    <Link href="/bang-gia">Bảng giá</Link>
   </div>
   <nav className="xcn-public-footer-apps" aria-label="Công cụ nổi bật">
    <Link href="/cong-cu/mo-phong-word" className="xcn-public-footer-app">
     <FileText size={21} aria-hidden="true"/><span><small>BẮT ĐẦU VỚI</small><strong>Word Lab</strong></span>
    </Link>
    <Link href="/cong-cu/trinh-chieu" className="xcn-public-footer-app">
     <Presentation size={21} aria-hidden="true"/><span><small>KHÁM PHÁ</small><strong>Trình chiếu</strong></span>
    </Link>
   </nav>
  </div>
 </footer>;
}
