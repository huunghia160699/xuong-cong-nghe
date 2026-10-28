"use client";
import {useMemo,useState} from "react";
import {Download,Search,UserRound,ShieldAlert} from "lucide-react";
import {filterProfiles,profilesToCsv,PROFILE_ROLES,type AdminProfile} from "../admin-controls";
const labels:Record<string,string>={student:"Học sinh",teacher:"Giáo viên",admin:"Quản trị"};
export function AdminUsers({rows,live,error}:{rows:AdminProfile[];live:boolean;error?:string}){
 const [query,setQuery]=useState("");const [role,setRole]=useState("all");const [page,setPage]=useState(1);
 const filtered=useMemo(()=>filterProfiles(rows,query,role),[rows,query,role]);
 const perPage=15, pages=Math.max(1,Math.ceil(filtered.length/perPage)),index=Math.min(page,pages);
 const exportCsv=()=>{
  const blob=new Blob([profilesToCsv(filtered)],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="xcn-admin-profiles.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 return <div className="xcn-admin">
  <div className="xcn-admin-heading"><div><h1>Quản lý người dùng</h1>
   <p>Tra cứu, phân loại và xuất danh sách hồ sơ. Không hiển thị email hoặc mật khẩu; không cấp quyền Admin qua giao diện.</p></div>
   <button className="xcn-admin-primary" onClick={exportCsv} disabled={!live||filtered.length===0}><Download size={16}/> Xuất CSV</button>
  </div>
  {!live?<div className="xcn-admin-notice"><ShieldAlert size={18}/> Chế độ Demo: không truy vấn hồ sơ thật. Danh sách và xuất dữ liệu chỉ hoạt động sau khi xác thực Admin Live.</div>:null}
  {error&&<div className="xcn-admin-notice is-error" role="alert">{error}</div>}
  <div className="xcn-admin-stat-grid">
   {[["Tổng hồ sơ",live?rows.length:"—"],["Học sinh",live?rows.filter(r=>r.role==="student").length:"—"],
    ["Giáo viên",live?rows.filter(r=>r.role==="teacher").length:"—"],["Admin",live?rows.filter(r=>r.role==="admin").length:"—"]].map(([l,v])=>
    <div className="xcn-admin-stat" key={l}><span>{l}</span><strong>{v}</strong></div>)}
  </div>
  <section className="xcn-admin-panel">
   <div className="xcn-admin-toolbar">
    <label className="xcn-admin-search"><Search size={16}/><input value={query} placeholder="Tìm theo tên hoặc ID…" aria-label="Tìm hồ sơ"
     onChange={e=>{setQuery(e.target.value);setPage(1);}}/></label>
    <label className="xcn-admin-filter">Vai trò <select value={role} onChange={e=>{setRole(e.target.value);setPage(1);}}>
     {PROFILE_ROLES.map(value=><option key={value} value={value}>{value==="all"?"Tất cả":labels[value]}</option>)}
    </select></label>
   </div>
   <div className="xcn-admin-table-wrap"><table className="xcn-admin-table"><thead><tr><th>Hồ sơ</th><th>Vai trò</th><th>Ngày tham gia</th><th>Trạng thái</th></tr></thead>
    <tbody>{filtered.slice((index-1)*perPage,index*perPage).map(p=><tr key={p.id}>
     <td><div className="flex items-center gap-2"><UserRound size={19} className="shrink-0 text-blue-600"/><div>
      <strong>{p.display_name||"Chưa đặt tên"}</strong><small className="block break-all text-slate-500">{p.id}</small></div></div></td>
     <td><span className="xcn-roadmap-badge">{labels[p.role]??p.role}</span></td><td>{p.created_at?new Date(p.created_at).toLocaleDateString("vi-VN"):"—"}</td>
     <td><span className="text-xs text-slate-500">Chưa xác minh email từ hồ sơ</span></td>
    </tr>)}</tbody></table>
   </div>
   {!filtered.length&&<p className="p-6 text-sm text-slate-500">{!live?"Cần kết nối Admin Live để xem hồ sơ.":"Không có hồ sơ phù hợp."}</p>}
   {filtered.length>perPage&&<div className="xcn-admin-pagination"><span>Trang {index}/{pages} · {filtered.length} hồ sơ</span>
    <button disabled={index<=1} onClick={()=>setPage(index-1)}>Trước</button>
    <button disabled={index>=pages} onClick={()=>setPage(index+1)}>Sau</button></div>}
  </section>
  <div className="xcn-admin-note">Việc nâng vai trò hoặc gửi lời mời được tạm dừng theo yêu cầu. Quản trị viên chỉ được cấp quyền qua quy trình đã xác minh riêng; giao diện này không truy vấn bảng <code>auth.users</code>.</div>
 </div>;
}
