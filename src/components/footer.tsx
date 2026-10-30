import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {Brand} from "@/components/brand";

const columns=[
 {title:"Hệ sinh thái",links:[
  {label:"Khóa học",href:"/khoa-hoc"},
  {label:"Thực hành & công cụ",href:"/cong-cu"},
  {label:"Dự án",href:"/#du-an"}]},
 {title:"Khám phá",links:[
  {label:"Giới thiệu",href:"/gioi-thieu"},
  {label:"Bảng giá",href:"/bang-gia"},
  {label:"Tin tức & tri thức",href:"/tin-tuc"}]},
 {title:"Hỗ trợ",links:[
  {label:"Liên hệ",href:"/lien-he"},
  {label:"Đăng nhập",href:"/dang-nhap"},
  {label:"Trang chủ",href:"/"}]}
];

export function Footer(){
 return <footer className="xcn-public-footer">
  <div className="xcn-container xcn-public-footer-inner">
   <div className="xcn-public-footer-brand">
    <Brand/>
    <p>Một nơi để học, thực hành và phát triển năng lực số bằng những công cụ có mục đích rõ ràng.</p>
    <span>Học để hiểu. Làm để thành thạo.</span>
   </div>
   <nav className="xcn-public-footer-links" aria-label="Liên kết cuối trang">
    {columns.map(column=><div key={column.title}>
     <h2>{column.title}</h2>
     <ul>{column.links.map(link=><li key={link.href}>
      <Link href={link.href}>{link.label}<ArrowUpRight size={13} aria-hidden="true"/></Link>
     </li>)}</ul>
    </div>)}
   </nav>
  </div>
  <div className="xcn-container xcn-public-footer-bottom">
   <span>© {new Date().getFullYear()} Xưởng Công Nghệ</span>
   <span>Khám phá công khai · Sử dụng theo quyền tài khoản</span>
  </div>
 </footer>;
}
