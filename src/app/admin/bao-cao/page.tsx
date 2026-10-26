import Link from "next/link";
import {BarChart3,FileDown} from "lucide-react";
import {loadAdminStats,ADMIN_COUNT_TABLES} from "@/features/admin/admin-stats";
export const dynamic="force-dynamic";
export default async function AdminReportsPage(){
 let stats:Awaited<ReturnType<typeof loadAdminStats>>;
 try{stats=await loadAdminStats();}catch{stats={live:true,values:{},error:true};}
 const max=Math.max(1,...Object.values(stats.values).filter((v):v is number=>typeof v==="number"));
 return <div className="xcn-admin">
  <div className="xcn-admin-heading"><div><div className="xcn-admin-kicker">ADMIN / BÁO CÁO</div><h1>Báo cáo nền tảng</h1>
   <p>Tổng hợp số liệu cơ sở dữ liệu khi có quyền Admin Live. Không đưa ra số liệu giả trong Demo.</p></div>
   <Link className="xcn-admin-primary" href="/admin/he-thong"><BarChart3 size={16}/> Giám sát hệ thống</Link>
  </div>
  {!stats.live?<div className="xcn-admin-notice">Hiện đang ở Demo. Số liệu chỉ xuất hiện khi môi trường Live đã được kiểm chứng và bật chính thức.</div>:null}
  {stats.error?<div role="alert" className="xcn-admin-notice is-error">Một hoặc nhiều truy vấn không thành công. Giá trị tương ứng hiển thị “—”, không thay thế bằng số 0.</div>:null}
  <div className="xcn-admin-stat-grid">
   {ADMIN_COUNT_TABLES.slice(0,4).map(([label])=><div key={label} className="xcn-admin-stat"><span>{label}</span><strong>{stats.live?stats.values[label]??"—":"—"}</strong></div>)}
  </div>
  <section className="xcn-admin-panel">
   <h2 className="text-lg font-bold">Quy mô dữ liệu theo phân hệ</h2>
   <div className="xcn-admin-report-bars">{ADMIN_COUNT_TABLES.map(([label])=>{
    const value=stats.values[label];
    return <div className="xcn-admin-report-line" key={label}>
     <span>{label}</span>
     <div className="xcn-admin-report-track"><span style={{width:typeof value==="number"?value===0?"0%":Math.max(3,(value/max)*100)+"%":"0%"}}/></div>
     <strong>{stats.live?value??"—":"—"}</strong>
    </div>;
   })}</div>
   <p className="mt-5 text-xs leading-6 text-slate-500">Đây là số lượng bản ghi, không phải thống kê người dùng đang trực tuyến hoặc hiệu quả đào tạo. Báo cáo nâng cao sẽ dùng dữ liệu thật sau khi hoàn thiện các phân hệ học tập.</p>
  </section>
 </div>;
}
