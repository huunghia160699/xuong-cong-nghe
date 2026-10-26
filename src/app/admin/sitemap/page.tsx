import type {Metadata} from "next";
import Link from "next/link";
import {ADMIN_SITEMAP} from "@/features/admin/admin-sitemap";
import {Blocks,BookOpen,CheckCircle2,Compass,Map,School,UserRound,Users,Wrench} from "lucide-react";
export const metadata:Metadata={title:"Sitemap hệ thống — Admin Xưởng Công Nghệ"};
const icons=[Compass,Map,Users,UserRound,Wrench,BookOpen,School];
export default function AdminSitemapPage(){
 const existing=ADMIN_SITEMAP.reduce((sum,g)=>sum+g.links.filter(l=>l.state==="available").length,0);
 const total=ADMIN_SITEMAP.reduce((sum,g)=>sum+g.links.length,0);
 return <div className="xcn-admin">
  <div className="xcn-admin-heading">
   <div><div className="xcn-admin-kicker">KIẾN TRÚC SẢN PHẨM / SITEMAP</div><h1>Sơ đồ toàn website</h1>
    <p>Các đường dẫn có thật và mục tiêu tương lai được phân biệt rõ; không dẫn người dùng vào trang chưa lập trình.</p></div>
   <Link href="/admin/roadmap" className="xcn-admin-primary"><Map size={17}/> Xem Roadmap</Link>
  </div>
  <div className="xcn-admin-stat-grid">
   {[{name:"Khu vực",count:ADMIN_SITEMAP.length},{name:"Đường dẫn dự kiến",count:total},
     {name:"Đã có route",count:existing},{name:"Đang quy hoạch",count:total-existing}].map(a=>
     <div className="xcn-admin-stat" key={a.name}><span>{a.name}</span><strong>{a.count}</strong></div>)}
  </div>
  <div className="xcn-sitemap">
   {ADMIN_SITEMAP.map((group,index)=>{
    const Icon=icons[index]??Blocks;
    return <section key={group.title} className="xcn-sitemap-card">
     <header><Icon size={22}/><div><h2>{group.title}</h2><p className="mt-1 text-xs text-slate-500">{group.summary}</p></div></header>
     <ul>{group.links.map(link=><li key={link.href}>
      <div className="min-w-0"><strong>{link.title}</strong><div className="mt-1 break-all"><code>{link.href}</code></div></div>
      {link.state==="available"?<Link href={link.href} className="inline-flex shrink-0 items-center gap-1 font-semibold text-blue-700">
       <CheckCircle2 size={14}/> Mở</Link>:<span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500">Dự kiến</span>}
     </li>)}</ul>
    </section>;
   })}
  </div>
 </div>;
}
