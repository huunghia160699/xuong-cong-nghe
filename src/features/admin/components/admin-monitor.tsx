import Link from "next/link";
import {Activity,CheckCircle2,Clock3,Database,ExternalLink,ShieldAlert,Server,Workflow} from "lucide-react";
import {isLiveMode} from "@/lib/supabase/config";
export type MonitorRow={name:string;status:"ready"|"pending"|"warning";description:string;href?:string};
const styles:Record<MonitorRow["status"],string>={ready:"xcn-monitor-ready",pending:"xcn-monitor-pending",warning:"xcn-monitor-warning"};
const labels={ready:"Sẵn sàng",pending:"Chưa hoàn thiện",warning:"Cần kiểm thử"};
export function AdminMonitor({counts,error}:{counts?:Record<string,number|null>;error?:boolean}){
 const live=isLiveMode();
 const rows:MonitorRow[]=[
  {name:"Giao diện Admin",status:"ready",description:"Dashboard, người dùng, quyền, cấu hình, nhật ký, báo cáo và sitemap"},
  {name:"Roadmap",status:"ready",description:live?"Lưu trên Supabase qua RLS khi có JWT Admin":"Demo lưu trên thiết bị, có backup và khôi phục",href:"/admin/roadmap"},
  {name:"Supabase và JWT",status:live&&!error?"ready":"pending",description:live?(error?"Không đọc được toàn bộ bảng với quyền hiện tại":"Chế độ Live đang được bật"):"Chưa bật Live; xác minh hai tài khoản đang tạm dừng"},
  {name:"Lưu cấu hình toàn website",status:"pending",description:"Bản nháp cục bộ đã dùng được; chưa có xuất bản cấu hình tập trung"},
  {name:"Nhật ký bảo mật máy chủ",status:"pending",description:"Hiện chỉ có nhật ký hoạt động cục bộ; cần lưu audit bất biến"},
  {name:"Phân quyền người dùng",status:"warning",description:"Kiểm tra vai trò ở server; kiểm thử Admin/Student bằng JWT thật tạm dừng"},
  {name:"Word Lab và trình chiếu",status:"ready",description:"Công cụ đã có trang riêng, không thay đổi trong đợt này"},
  {name:"Giám sát và vận hành",status:"ready",description:"Bảng kiểm tình trạng và thống kê theo môi trường hiện tại"}
 ];
 return <div className="xcn-admin">
  <div className="xcn-admin-heading"><div><div className="xcn-admin-kicker">ADMIN / VẬN HÀNH</div>
   <h1>Giám sát hệ thống</h1><p>Phân biệt các module đã có trong mã nguồn và các bước chỉ hoàn thành sau khi kiểm thử Live. Không giả lập kết quả kết nối mạng.</p></div>
   <Link href="/admin/roadmap" className="xcn-admin-primary"><Workflow size={16}/> Roadmap vận hành</Link>
  </div>
  <div className="xcn-admin-stat-grid">
   {[["Môi trường",live?"Live":"Demo"],["Module kiểm kê",rows.length],
    ["Có giao diện",rows.filter(x=>x.status==="ready").length],["Chưa nghiệm thu",rows.filter(x=>x.status!=="ready").length]].map(([l,v])=>
    <div key={l} className="xcn-admin-stat"><span>{l}</span><strong className={typeof v==="string"?"!text-xl":""}>{v}</strong></div>)}
  </div>
  <div className="xcn-admin-duo">
   <section className="xcn-admin-panel"><h2 className="flex items-center gap-2 text-lg font-bold"><Activity size={19} className="text-blue-600"/> Danh mục trạng thái</h2>
    <div className="xcn-monitor-list">{rows.map(item=><div key={item.name} className="xcn-monitor-row">
     <div><strong>{item.name}</strong><p>{item.description}</p></div>
     <span className={"xcn-monitor-pill "+styles[item.status]}>{labels[item.status]}</span>
    </div>)}</div>
   </section>
   <div className="grid content-start gap-4">
    <section className="xcn-admin-panel"><h2 className="flex items-center gap-2 text-lg font-bold"><Database size={19} className="text-blue-600"/> Dữ liệu khả dụng</h2>
     {!live?<p className="mt-3 text-sm leading-7 text-slate-600">Demo không đọc dữ liệu thật. Kích hoạt Live chỉ sau khi kiểm thử JWT Admin/Học sinh đạt.</p>:
      <div className="mt-3 grid gap-2">{Object.entries(counts??{}).map(([label,value])=>
       <div key={label} className="flex justify-between gap-4 text-sm"><span>{label}</span><strong>{value??"Không truy cập được"}</strong></div>)}</div>}
    </section>
    <section className="xcn-admin-panel"><h2 className="flex items-center gap-2 text-lg font-bold"><ShieldAlert size={19} className="text-blue-600"/> Cổng triển khai</h2>
     <ul className="xcn-admin-checks">
      <li><CheckCircle2 size={16}/> Migration Roadmap đã có trên Supabase production</li>
      <li><Clock3 size={16}/> Chờ kiểm thử JWT bằng tài khoản đã xác minh</li>
      <li><Clock3 size={16}/> Chưa áp cấu hình Live vào production</li>
      <li><Clock3 size={16}/> Audit server và chính sách cấu hình tập trung chưa triển khai</li>
     </ul>
     <Link className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700" href="/admin/phan-quyen">Ma trận quyền <ExternalLink size={14}/></Link>
    </section>
    <section className="xcn-admin-panel"><h2 className="flex items-center gap-2 text-lg font-bold"><Server size={19} className="text-blue-600"/> Kiến trúc</h2>
     <p className="mt-2 text-sm leading-7 text-slate-600">Next.js 15 · Supabase Auth/PostgreSQL/Storage · Vercel. Các truy vấn dữ liệu thực chạy phía server sau khi Layout xác nhận role Admin.</p>
    </section>
   </div>
  </div>
 </div>;
}
