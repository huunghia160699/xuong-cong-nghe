"use client";

import {Download,History,Plus,RotateCcw,ShieldCheck,Trash2} from "lucide-react";
import type {RoadmapSnapshot} from "../roadmap-history";

type Props={
 history:RoadmapSnapshot[];
 open:boolean;
 onCreate:()=>void;
 onRestore:(value:RoadmapSnapshot)=>void;
 onDelete:(id:string)=>void;
 onExport:(value:RoadmapSnapshot)=>void;
};
export function RoadmapHistoryButton({count,onClick,open}:{count:number;onClick:()=>void;open:boolean}){
 return <button type="button" onClick={onClick} aria-expanded={open}
  aria-controls="xcn-roadmap-backup-history"><History size={15}/> Bản sao lưu ({count})</button>;
}
export function RoadmapHistoryPanel({history,open,onCreate,onRestore,onDelete,onExport}:Props){
 if(!open)return null;
 return <section className="xcn-roadmap-history" id="xcn-roadmap-backup-history"
   aria-label="Lịch sử sao lưu cục bộ">
   <div className="xcn-roadmap-history-heading">
    <div><h2><ShieldCheck size={18}/> Bản sao & điểm khôi phục</h2>
     <p>Lưu trên trình duyệt này, tối đa 6 bản. Không đồng bộ giữa các thiết bị.
      Hệ thống tự giữ một bản trước khi xóa việc lớn hoặc nhập JSON.</p></div>
    <button type="button" onClick={onCreate}><Plus size={15}/> Tạo điểm khôi phục</button>
   </div>
   {history.length===0?<p className="xcn-roadmap-muted">Chưa có bản sao. Có thể tạo điểm khôi phục ngay.</p>:
    <div className="xcn-roadmap-history-list">
     {history.map(snapshot=><div className="xcn-roadmap-history-item" key={snapshot.id}>
      <div className="xcn-roadmap-history-meta">
       <strong>{snapshot.label}</strong>
       <small>{new Date(snapshot.createdAt).toLocaleString("vi-VN")} · {snapshot.items.length} việc lớn · phiên bản gốc {snapshot.baseVersion}</small>
      </div>
      <div className="xcn-roadmap-history-buttons">
       <button type="button" onClick={()=>onRestore(snapshot)}><RotateCcw size={14}/> Khôi phục</button>
       <button type="button" onClick={()=>onExport(snapshot)}><Download size={14}/> JSON</button>
       <button type="button" aria-label={"Xóa bản sao "+snapshot.label}
        onClick={()=>onDelete(snapshot.id)}><Trash2 size={14}/></button>
      </div>
     </div>)}
    </div>}
  </section>;
}
