import Link from "next/link";
import {Activity,CheckCircle2,Clock3,Database,ExternalLink,ShieldAlert,Server,Workflow} from "lucide-react";
import {isLiveMode} from "@/lib/supabase/config";
export type MonitorRow={name:string;status:"ready"|"pending"|"warning";description:string;href?:string};
const styles:Record<MonitorRow["status"],string>={ready:"xcn-monitor-ready",pending:"xcn-monitor-pending",warning:"xcn-monitor-warning"};
const labels={ready:"Sẵn sàng",pending:"Chưa hoàn thiện",warning:"Cần kiểm thử"};
export function AdminMonitor({counts,error,roadmapVersion,roadmapEvents}:{
 counts?:Record<string,number|null>;error?:boolean;
 roadmapVersion?:number|null;roadmapEvents?:number|null
}){
 const live=isLiveMode();
 const rows:MonitorRow[]=[
  {name:"Giao diện Admin",status:"ready",description:"Dashboard, người dùng, quyền, cấu hình, nhật ký, báo cáo và sitemap"},
  {name:"Roadmap & sao lưu",status:live&&roadmapVersion!=null?"ready":"warning",
   description:live?(roadmapVersion!=null?"Dữ liệu thật phiên bản "+roadmapVersion+"; đã có công cụ sao lưu kèm lịch sử server":"Chưa truy vấn được phiên bản Roadmap thật"):"Demo lưu trên thiết bị; sao lưu chính thức cần Admin Live",href:"/admin/roadmap"},
  {name:"JWT và RLS đa tài khoản",status:"warning",
   description:"Chưa nghiệm thu kiểm thử thật Admin/Student bằng hai JWT, kể cả khi website đã bật Live"},
  {name:"Lưu cấu hình toàn website",status:"pending",description:"Bản nháp cục bộ đã dùng được; chưa có xuất bản cấu hình tập trung"},
  {name:"Nhật ký bảo mật máy chủ",status:"pending",
   description:live&&roadmapEvents!=null?
    "Đã có "+roadmapEvents+" sự kiện Roadmap trên Supabase; thao tác Admin khác còn thiếu audit tập trung":
    "Roadmap có trigger audit; các thao tác Admin khác còn thiếu nhật ký tập trung"},
  {name:"Phân quyền người dùng",status:"warning",description:"Layout và RLS có kiểm soát; JWT E2E hai vai trò chưa được nghiệm thu"},
  {name:"Word Lab và trình chiếu",status:"ready",description:"Công cụ đã có trang riêng, không thay đổi trong đợt này"},
  {name:"Giám sát và vận hành",status:"ready",description:"Có trang kiểm kê và thống kê DB; chưa tích hợp cảnh báo tự động"}
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
     {!live?<p className="mt-3 text-sm leading-7 text-slate-600">Demo không đọc dữ liệu thật. Không hiển thị số liệu giả.</p>:
      <div className="mt-3 grid gap-2">
       <div className="flex justify-between gap-4 text-sm"><span>Phiên bản Roadmap thật</span><strong>{roadmapVersion??"Không đọc được"}</strong></div>
       <div className="flex justify-between gap-4 text-sm"><span>Nhật ký Roadmap trên DB</span><strong>{roadmapEvents??"Không đọc được"}</strong></div>
       {Object.entries(counts??{}).map(([label,value])=>
       <div key={label} className="flex justify-between gap-4 text-sm"><span>{label}</span><strong>{value??"Không truy cập được"}</strong></div>)}</div>}
    </section>
    <section className="xcn-admin-panel"><h2 className="flex items-center gap-2 text-lg font-bold"><ShieldAlert size={19} className="text-blue-600"/> Cổng triển khai</h2>
     <ul className="xcn-admin-checks">
      <li><CheckCircle2 size={16}/> Migration Roadmap đã có trên Supabase production</li>
      <li><Clock3 size={16}/> Chờ kiểm thử JWT bằng cả Admin và học sinh đã xác minh</li>
      <li><Clock3 size={16}/> {live?"Live đã bật; chưa nghiệm thu E2E hai vai trò":"Demo chưa kết nối người dùng thật"}</li>
      <li><Clock3 size={16}/> Audit Roadmap đã có; audit toàn bộ Admin và cấu hình tập trung chưa hoàn tất</li>
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
