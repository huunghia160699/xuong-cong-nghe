import Link from "next/link";
import {
  ArrowRight,BookOpen,ClipboardCheck,Code2,FileText,LayoutDashboard,Library,
  ListTodo,Map,MonitorPlay,School,ShieldCheck,Users,SlidersHorizontal,Activity,ScrollText,BarChart3
} from "lucide-react";
import {ROADMAP_INITIAL,roadmapTotals,roadmapProgress} from "../roadmap-data";

type Props={live:boolean;stats?:{users:number|null;courses:number|null;attempts:number|null}};
const modules=[
 {title:"Roadmap phát triển",description:"Mốc công việc, checklist, nhật ký đã thêm và đã sửa.",href:"/admin/roadmap",icon:ListTodo,detail:"Đang hoạt động"},
 {title:"Sitemap toàn hệ thống",description:"Sơ đồ vai trò, phân hệ và các đường dẫn đã có/dự kiến.",href:"/admin/sitemap",icon:Map,detail:"Đang hoạt động"},
 {title:"Quản lý khóa học",description:"Tạo bản nháp, xem và xuất bản khóa học.",href:"/admin/khoa-hoc",icon:BookOpen,detail:"Có chức năng cơ bản"},
 {title:"Kho tài liệu",description:"Quản lý kho file trong không gian quản trị.",href:"/admin/kho-tai-lieu",icon:Library,detail:"Tùy môi trường dữ liệu"},
 {title:"Người dùng & vai trò",description:"Danh sách hồ sơ, bộ lọc và xuất CSV; không tự cấp Admin.",href:"/admin/nguoi-dung",icon:Users,detail:"Live: chỉ đọc"},
 {title:"Phân quyền hệ thống",description:"Ma trận vai trò và các điều kiện bảo vệ Live.",href:"/admin/phan-quyen",icon:ShieldCheck,detail:"Theo thiết kế"},
 {title:"Cấu hình website",description:"Bản nháp thương hiệu và thông báo, có xem trước và JSON.",href:"/admin/cau-hinh",icon:SlidersHorizontal,detail:"Lưu trên thiết bị"},
 {title:"Nhật ký thao tác",description:"Lịch sử hoạt động cục bộ, lọc và xuất JSON.",href:"/admin/nhat-ky",icon:ScrollText,detail:"Lưu trên thiết bị"},
 {title:"Giám sát hệ thống",description:"Kiểm kê trạng thái module và chốt triển khai.",href:"/admin/he-thong",icon:Activity,detail:"Có thông tin thực tế"},
 {title:"Báo cáo nền tảng",description:"Thống kê các bảng dữ liệu thật khi Live.",href:"/admin/bao-cao",icon:BarChart3,detail:"Live: số liệu thật"},
 {title:"Mô phỏng Word",description:"Kiểm tra trình soạn thảo và các công cụ thực hành.",href:"/cong-cu/mo-phong-word",icon:FileText,detail:"Công cụ hiện có"},
 {title:"Trình chiếu",description:"Bài giảng Tin học, Word và Excel.",href:"/cong-cu/trinh-chieu",icon:MonitorPlay,detail:"Công cụ hiện có"}
];
const planned=[
 {title:"Teacher Studio",description:"Lớp học, ngân hàng câu hỏi, giao bài và Live Quiz.",icon:Users},
 {title:"Student Hub",description:"Lớp của em, bài thực hành, tiến độ và kết quả.",icon:ClipboardCheck},
 {title:"Learning Labs",description:"Word, Excel, PowerPoint, Python, SQL và Windows.",icon:Code2},
 {title:"School Manager",description:"Quản trị trường, tổ chuyên môn và báo cáo.",icon:School}
];
export function AdminOverview({live,stats}:Props){
 const totals=roadmapTotals(ROADMAP_INITIAL);
 return <div className="xcn-admin">
  <section className="xcn-admin-hero">
   <div className="relative z-10">
    <div className="xcn-admin-kicker">XƯỞNG CÔNG NGHỆ / TRUNG TÂM ĐIỀU HÀNH</div>
    <h1>Quản trị toàn nền tảng</h1>
    <p>Định hướng một hệ sinh thái giáo dục số lấy Tin học thực hành làm trọng tâm.
     Theo dõi toàn bộ phân hệ, quản lý tài nguyên hiện có và phát triển dự án theo các mốc rõ ràng.</p>
    <div className="xcn-admin-hero-actions">
     <Link href="/admin/roadmap"><ListTodo size={16}/> Quản lý Roadmap</Link>
     <Link href="/admin/sitemap"><Map size={16}/> Xem Sitemap <ArrowRight size={15}/></Link>
    </div>
   </div>
   <div className="xcn-admin-hero-aside">
    <span>Ưu tiên hiện tại</span><strong>Admin + Roadmap</strong>
    <p>Hoàn thiện công cụ quản trị, giữ riêng quyền Live chưa xác minh.</p>
   </div>
  </section>
  <div className="xcn-admin-stat-grid">
   {[
    {label:live?"Tài khoản Supabase":"Tài khoản",value:live?stats?.users??"—":"Chế độ Demo"},
    {label:"Khóa học",value:live?stats?.courses??"—":"Chưa đồng bộ"},
    {label:"Lượt làm bài",value:live?stats?.attempts??"—":"Chưa đồng bộ"},
    {label:"Việc lớn trong Master Plan",value:totals.epics}
   ].map(item=><div key={item.label} className="xcn-admin-stat">
    <span>{item.label}</span><strong className={typeof item.value==="string"?"!text-lg":""}>{item.value}</strong>
   </div>)}
  </div>
  <div className="xcn-admin-grid">
   <section className="xcn-admin-panel">
    <div className="xcn-admin-panel-head"><h2>Module đang truy cập được</h2><Link href="/admin/sitemap">Sơ đồ đầy đủ →</Link></div>
    <div className="xcn-admin-modules">
     {modules.map(module=><Link href={module.href} key={module.href} className="xcn-admin-module">
      <module.icon size={19}/><div><strong>{module.title}</strong><p>{module.description}</p><small>{module.detail}</small></div>
     </Link>)}
    </div>
   </section>
   <section className="xcn-admin-panel">
    <div className="xcn-admin-panel-head"><h2>Ưu tiên phát triển</h2><Link href="/admin/roadmap">Xem timeline →</Link></div>
    <div className="xcn-admin-upcoming">
     {ROADMAP_INITIAL.filter(item=>item.priority==="P0").slice(0,5).map(item=>
      <Link href="/admin/roadmap" key={item.id}>
       <span>{item.title}<small className="mt-1 block text-xs font-normal text-slate-500">{item.area}</small></span>
       <span className="shrink-0 text-blue-700">{roadmapProgress(item)}%</span>
      </Link>)}
    </div>
    <div className="xcn-admin-note"><ShieldCheck size={18} className="mb-2 text-blue-700"/>
     <strong>Dữ liệu rõ ràng theo môi trường.</strong><br/>
     {live?"Các số liệu tài khoản/khóa học/bài làm được đọc từ Supabase.": "Đây là giao diện Demo, không hiển thị các thống kê người dùng giả."}
     {" "}Roadmap có phần ghi nhận lịch sử, không tự động xác nhận tính năng đã kiểm thử.</div>
   </section>
  </div>
  <section className="xcn-admin-panel mt-5">
   <div className="xcn-admin-panel-head"><h2>Những không gian trong kế hoạch</h2><span className="text-xs text-slate-500">Đang quy hoạch</span></div>
   <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {planned.map(item=><div key={item.title} className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
     <item.icon size={21} className="mb-3 text-blue-700"/><h3 className="font-bold">{item.title}</h3>
     <p className="mt-2 text-xs leading-6 text-slate-500">{item.description}</p>
     <span className="mt-3 inline-block text-xs font-semibold text-slate-500">Chưa triển khai đầy đủ</span>
    </div>)}
   </div>
  </section>
 </div>;
}
