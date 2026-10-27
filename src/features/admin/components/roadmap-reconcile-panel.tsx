"use client";
import {useState} from "react";
import {GitCompareArrows,ShieldAlert,Plus,Info} from "lucide-react";
import {ROADMAP_INITIAL,type RoadmapEpic} from "../roadmap-data";
import {compareRoadmaps,compareTotals} from "../roadmap-reconcile";

export function RoadmapReconcilePanel({items,version,sourceDraft,onImportMissing,mode}:{
 items:RoadmapEpic[];version:number;sourceDraft:RoadmapEpic[]|null;
 onImportMissing:(source:RoadmapEpic[],label:string)=>void;mode:"demo"|"live";
}){
 const [open,setOpen]=useState(false);
 const baseline=compareRoadmaps(ROADMAP_INITIAL,items);
 const baselineTotals=compareTotals(baseline);
 const local=sourceDraft?compareRoadmaps(sourceDraft,items):null;
 const localTotals=local?compareTotals(local):null;
 const reports=[
  {name:"Checklist GitHub / dữ liệu gốc",source:ROADMAP_INITIAL,report:baseline,totals:baselineTotals},
  ...(local&&localTotals?[{name:"Bản nháp cũ trên thiết bị",source:sourceDraft!,report:local,totals:localTotals}]:[])
 ];
 return <section className="xcn-roadmap-reconcile" aria-label="Đối chiếu nguồn dữ liệu Roadmap">
  <div className="xcn-roadmap-reconcile-top">
   <div><h2><GitCompareArrows size={18}/> Đối chiếu nguồn dữ liệu</h2>
    <p>Supabase là nguồn chính trong Live. Không tự đánh dấu hoàn thành, xóa ghi chú hoặc ghi đè việc đã sửa.</p></div>
   <button type="button" aria-expanded={open} aria-controls="xcn-roadmap-reconcile-details"
    onClick={()=>setOpen(v=>!v)}>{open?"Thu gọn":"Xem khác biệt"}</button>
  </div>
  <div className="xcn-roadmap-reconcile-summary">
   <span><strong>{mode==="live"?"Supabase phiên bản "+version:"Bản nháp Demo"}</strong></span>
   <span>{items.length} việc lớn</span>
   <span>{baselineTotals.differences} trạng thái khác checklist GitHub</span>
   {local&&localTotals&&<span>{localTotals.differences+localTotals.missing+localTotals.extra} điểm khác bản nháp</span>}
  </div>
  {open&&<div id="xcn-roadmap-reconcile-details">
   <div className="xcn-roadmap-reconcile-alert"><ShieldAlert size={17}/>
    Dấu tích trong checklist phản ánh dữ liệu, không chứng minh đã nghiệm thu. Ví dụ, kiểm thử JWT hai vai trò chỉ được đánh dấu đạt sau khi thực hiện thật.</div>
   {reports.map(({name,source,report,totals})=><div className="xcn-roadmap-reconcile-report" key={name}>
    <h3>{name}</h3>
    <p>Thiếu: {totals.missing} · Thay đổi trạng thái hoặc nội dung: {totals.differences} · Có thêm ở bản hiện tại: {totals.extra}.</p>
    {report.mismatchedTasks.length>0&&<ul className="xcn-roadmap-reconcile-differences">
     {report.mismatchedTasks.slice(0,18).map((task,index)=><li key={task.epicId+index}>
      <span>{task.text}</span>
      <small>Checklist nguồn: {task.sourceDone?"Đã tích":"Chưa tích"} · Bản đang xem: {task.targetDone?"Đã tích":"Chưa tích"} · Cần kiểm chứng</small>
     </li>)}
    </ul>}
    {(report.missingEpics.length>0||report.missingTasks.length>0||report.missingEntries.length>0)&&
     <div className="xcn-roadmap-reconcile-missing">
      <Info size={15}/> Thiếu {report.missingEpics.length} việc lớn, {report.missingTasks.length} việc nhỏ và {report.missingEntries.length} ghi chú so với nguồn này.
     </div>}
    {totals.missing>0&&<button type="button" className="xcn-roadmap-reconcile-import"
     onClick={()=>onImportMissing(source,name)}><Plus size={14}/> Chỉ bổ sung mục đang thiếu</button>}
    {totals.differences===0&&totals.missing===0&&<p className="xcn-roadmap-reconcile-ok">Không phát hiện trạng thái bất đồng; mọi dữ liệu đã có vẫn được giữ nguyên.</p>}
   </div>)}
   <p className="xcn-roadmap-reconcile-footer">Gộp chỉ bổ sung ID chưa tồn tại; không thay đổi dấu tích, trạng thái, thứ tự hoặc nhật ký hiện tại. Mọi thao tác ghi vẫn đi qua nút xác nhận, bản sao lưu và RLS.</p>
  </div>}
 </section>;
}
