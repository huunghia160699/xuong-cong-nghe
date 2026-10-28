"use client";
import {useEffect,useMemo,useState} from "react";
import {Download,History,Trash2} from "lucide-react";
import {ADMIN_AUDIT_KEY,readLocalEvents,type AdminAuditEvent} from "../admin-local";
const labels:Record<AdminAuditEvent["kind"],string>={settings:"Cấu hình",roadmap:"Roadmap",backup:"Sao lưu"};
export function AdminAudit(){
 const [items,setItems]=useState<AdminAuditEvent[]>([]);
 const [type,setType]=useState("all");
 useEffect(()=>{
  const reload=()=>setItems(readLocalEvents());
  reload();window.addEventListener("storage",reload);window.addEventListener("xcn-admin-audit-change",reload);
  return()=>{window.removeEventListener("storage",reload);window.removeEventListener("xcn-admin-audit-change",reload);};
 },[]);
 const filtered=useMemo(()=>type==="all"?items:items.filter(x=>x.kind===type),[items,type]);
 function exportJson(){
  const url=URL.createObjectURL(new Blob([JSON.stringify(filtered,null,2)],{type:"application/json"}));
  const a=document.createElement("a");a.href=url;a.download="xcn-local-audit.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <div className="xcn-admin">
  <div className="xcn-admin-heading"><div><h1>Nhật ký thao tác</h1>
   <p>Ghi lại những thao tác cục bộ trong trình duyệt, phục vụ rà soát cấu hình và Roadmap. Không phải audit log bất biến trên máy chủ.</p></div>
   <button className="xcn-admin-primary" onClick={exportJson} disabled={!filtered.length}><Download size={16}/> Xuất nhật ký</button>
  </div>
  <div className="xcn-admin-notice"><History size={18}/> Nhật ký cục bộ có thể bị xóa bởi người dùng hoặc trình duyệt; không dùng làm bằng chứng bảo mật, không chứa email hoặc token.</div>
  <section className="xcn-admin-panel"><div className="xcn-admin-toolbar">
   <strong>{items.length} hoạt động (tối đa 120 gần nhất)</strong>
   <label className="xcn-admin-filter">Nhóm <select value={type} onChange={e=>setType(e.target.value)}>
    <option value="all">Tất cả</option>{Object.entries(labels).map(([key,value])=><option value={key} key={key}>{value}</option>)}
   </select></label>
   <button className="xcn-admin-action-danger" type="button" disabled={!items.length} onClick={()=>{
    if(!confirm("Xóa lịch sử thao tác cục bộ trên thiết bị này?"))return;
    try{localStorage.removeItem(ADMIN_AUDIT_KEY);setItems([]);}catch{ /* browser storage blocked */ }
   }}><Trash2 size={15}/> Xóa lịch sử cục bộ</button>
  </div>
  {filtered.length===0?<div className="p-6 text-sm text-slate-500">Chưa có hoạt động phù hợp. Thử lưu bản nháp trong Cấu hình để tạo nhật ký.</div>:
   <div className="xcn-admin-audit-list">{filtered.map(item=><div key={item.id} className="xcn-admin-audit-entry">
    <span className="xcn-roadmap-badge">{labels[item.kind]}</span><p>{item.message}</p>
    <time dateTime={item.at}>{new Date(item.at).toLocaleString("vi-VN")}</time></div>)}</div>}
  </section>
 </div>;
}
