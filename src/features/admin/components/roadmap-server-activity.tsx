"use client";

import {Activity,Clock3,RefreshCcw} from "lucide-react";

export type RoadmapChange={
 kind:string;epicId?:string;title:string;count?:number;
};
export type RoadmapServerEvent={
 id:number;version:number;actor_id:string|null;occurred_at:string;changes:RoadmapChange[];
};
export function validServerEvents(value:unknown):value is RoadmapServerEvent[]{
 if(!Array.isArray(value)||value.length>100)return false;
 return value.every(e=>{
  if(!e||typeof e!=="object")return false;
  const x=e as Partial<RoadmapServerEvent>;
  return typeof x.id==="number"&&Number.isSafeInteger(x.id)&&
   typeof x.version==="number"&&Number.isInteger(x.version)&&x.version>0&&
   (x.actor_id===null||typeof x.actor_id==="string")&&
   typeof x.occurred_at==="string"&&!Number.isNaN(Date.parse(x.occurred_at))&&
   Array.isArray(x.changes)&&x.changes.length<=1000&&x.changes.every(c=>
     c&&typeof c.kind==="string"&&typeof c.title==="string"&&c.title.length<=1500);
 });
}
const changeLabels:Record<string,string>={
 "roadmap.created":"Khởi tạo Roadmap","roadmap.reordered":"Sắp xếp lại",
 "epic.added":"Thêm việc lớn","epic.deleted":"Xóa việc lớn","epic.updated":"Sửa việc lớn",
 "task.added":"Thêm việc nhỏ","task.deleted":"Xóa việc nhỏ","task.updated":"Sửa việc nhỏ",
 "task.completed":"Đánh dấu hoàn thành","task.reopened":"Bỏ hoàn thành",
 "note.added":"Thêm ghi chú","note.deleted":"Xóa ghi chú","note.updated":"Sửa ghi chú"
};
export function RoadmapServerActivity({events,loading,onRefresh}:{
 events:RoadmapServerEvent[];loading:boolean;onRefresh:()=>void
}){
 return <section className="xcn-admin-panel xcn-roadmap-events" aria-label="Nhật ký thay đổi trên Supabase">
  <div className="xcn-admin-panel-head">
   <div><h2 className="flex items-center gap-2"><Activity size={18} className="text-blue-700"/> Nhật ký thay đổi đã đồng bộ</h2>
    <p className="mt-1 text-xs leading-6 text-slate-500">Ghi tại database khi lưu thành công; thêm, sửa, xóa và checklist đều có lịch sử chung.</p></div>
   <button type="button" onClick={onRefresh} disabled={loading}
    className="xcn-roadmap-activity-refresh"><RefreshCcw size={14}/> {loading?"Đang tải…":"Làm mới"}</button>
  </div>
  {!events.length?<p className="text-sm text-slate-500">Chưa có thay đổi được ghi trên máy chủ.</p>:
   <div className="xcn-roadmap-events-list">{events.map(event=>
    <div className="xcn-roadmap-events-group" key={event.id}>
     <div className="xcn-roadmap-events-meta">
      <span className="font-bold text-blue-800">Phiên bản {event.version}</span>
      <span><Clock3 size={13}/> {new Date(event.occurred_at).toLocaleString("vi-VN")}</span>
      <span>Người cập nhật: {event.actor_id?event.actor_id.slice(0,8)+"…":"Hệ thống"}</span>
     </div>
     <div className="xcn-roadmap-events-changes">{event.changes.map((change,index)=>
      <div className="xcn-roadmap-event" key={event.id+"-"+index}>
       <span className="xcn-roadmap-event-kind">{changeLabels[change.kind]??"Cập nhật"}</span>
       <span className="xcn-roadmap-event-title">{change.title||"Thay đổi dữ liệu"}</span>
      </div>
     )}</div>
    </div>
   )}</div>}
 </section>;
}
