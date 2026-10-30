import Link from "next/link";

type Props={section:string;title:string;description:string};
export function PublicPendingPage({section,title,description}:Props){
 return <main className="xcn-public-placeholder">
  <div className="xcn-container">
   <div className="xcn-public-placeholder-wrap">
    <span className="xcn-public-placeholder-eyebrow">{section} · Đang hoàn thiện</span>
    <h1>{title}</h1>
    <p>{description}</p>
    <div className="xcn-public-placeholder-actions">
     <Link href="/cong-cu">Khám phá công cụ</Link>
     <Link href="/">Về trang chủ</Link>
    </div>
   </div>
  </div>
 </main>;
}
