"use client";

import {useEffect,useMemo,useRef,useState,type ChangeEvent} from "react";
import {
  ArrowDown,ArrowUp,Check,ChevronDown,ChevronRight,Clock3,Download,FileDown,
  Filter,History,NotebookPen,Plus,Save,Search,Trash2,X
} from "lucide-react";
import {
  ROADMAP_INITIAL,ROADMAP_PHASES,ROADMAP_PRIORITY,ROADMAP_STATUS,
  roadmapAsMarkdown,roadmapProgress,roadmapTotals,
  type RoadmapChecklistItem,type RoadmapEntry,type RoadmapEntryKind,
  type RoadmapEpic,type RoadmapPriority,type RoadmapStatus
} from "../roadmap-data";

type Props={mode:"demo"|"live"};
type EditorState={id:string|null;title:string;summary:string;phase:string;area:string;priority:RoadmapPriority;status:RoadmapStatus};
const LOCAL_KEY="xcn-admin-roadmap-v2";
const CATEGORIES=["Tin học","Quản trị","Giao diện","Website","Tài khoản","Hệ thống","Giáo viên","Học sinh","Đánh giá","Tương tác","Nội dung","Nhà trường","Mở rộng"];
const editorDefault=():EditorState=>({id:null,title:"",summary:"",phase:ROADMAP_PHASES[0],area:"Tin học",priority:"P1",status:"planned"});
const newId=()=>typeof crypto!=="undefined"&&"randomUUID" in crypto?crypto.randomUUID():"id-"+Date.now()+"-"+Math.random().toString(36).slice(2);
const today=()=>new Date().toISOString().slice(0,10);

function validItems(value:unknown):value is RoadmapEpic[]{
 if(!Array.isArray(value)||value.length>200)return false;
 return value.every((item:unknown)=>{
  if(!item||typeof item!=="object")return false;
  const t=item as Partial<RoadmapEpic>;
  return typeof t.id==="string"&&t.id.length<120&&typeof t.title==="string"&&t.title.length<201
   &&typeof t.summary==="string"&&t.summary.length<1001&&typeof t.area==="string"
   &&typeof t.phase==="string"&&ROADMAP_PHASES.includes(t.phase as typeof ROADMAP_PHASES[number])
   &&Object.hasOwn(ROADMAP_PRIORITY,t.priority??"")&&Object.hasOwn(ROADMAP_STATUS,t.status??"")
   &&typeof t.order==="number"&&Number.isFinite(t.order)
   &&Array.isArray(t.checklist)&&t.checklist.length<=300
   &&t.checklist.every((x:RoadmapChecklistItem)=>typeof x?.id==="string"&&typeof x?.text==="string"&&x.text.length<501&&typeof x?.done==="boolean")
   &&Array.isArray(t.entries)&&t.entries.length<=500
   &&t.entries.every((x:RoadmapEntry)=>typeof x?.id==="string"&&typeof x?.text==="string"&&x.text.length<1501&&["note","added","fixed"].includes(x.kind)&&typeof x?.date==="string");
 });
}
function downloadFile(name:string,content:string,mime:string){
 const link=document.createElement("a");
 const url=URL.createObjectURL(new Blob([content],{type:mime}));
 link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),500);
}
function Badge({children,tone="neutral"}:{children:React.ReactNode;tone?:"neutral"|"blue"|"green"|"orange"}){
 return <span className={"xcn-roadmap-badge is-"+tone}>{children}</span>;
}
export function RoadmapBoard({mode}:Props){
 const [items,setItems]=useState<RoadmapEpic[]>([]);
 const [ready,setReady]=useState(false);
 const [dirty,setDirty]=useState(false);
 const [saving,setSaving]=useState(false);
 const [version,setVersion]=useState(0);
 const [notice,setNotice]=useState("");
 const [failure,setFailure]=useState("");
 const [query,setQuery]=useState("");
 const [phase,setPhase]=useState("all");
 const [area,setArea]=useState("all");
 const [status,setStatus]=useState("all");
 const [expanded,setExpanded]=useState<string[]>(["admin-center","word-lab","python-practice"]);
 const [editor,setEditor]=useState<EditorState|null>(null);
 const [editingItem,setEditingItem]=useState<string|null>(null);
 const [taskText,setTaskText]=useState("");
 const [notesFor,setNotesFor]=useState<string|null>(null);
 const [noteKind,setNoteKind]=useState<RoadmapEntryKind>("note");
 const [noteText,setNoteText]=useState("");
 const [lastSaved,setLastSaved]=useState("");
 const fileRef=useRef<HTMLInputElement>(null);

 useEffect(()=>{
  let valid=true;
  const init=async()=>{
   if(mode==="demo"){
    try{
     const raw=localStorage.getItem(LOCAL_KEY);
     const parsed:unknown=raw?JSON.parse(raw):null;
     if(valid)setItems(validItems(parsed)?parsed:ROADMAP_INITIAL);
    }catch{if(valid)setItems(ROADMAP_INITIAL);}
    if(valid)setReady(true);
    return;
   }
   try{
    const response=await fetch("/api/admin/roadmap",{cache:"no-store"});
    const result=await response.json() as {items?:unknown;version?:number;error?:string};
    if(!response.ok)throw Error(result.error??"Không tải được roadmap.");
    if(valid){
      setItems(validItems(result.items)&&result.items.length?result.items:ROADMAP_INITIAL);
      setVersion(result.version??0);
      setNotice(result.version?"Đã tải dữ liệu lưu trên hệ thống.":"Dữ liệu mẫu ban đầu chưa lưu. Hãy nhấn Lưu thay đổi để khởi tạo.");
    }
   }catch(reason){if(valid){setFailure(reason instanceof Error?reason.message:"Không tải được roadmap.");setItems(ROADMAP_INITIAL);}}
   if(valid)setReady(true);
  };
  void init();return()=>{valid=false;};
 },[mode]);

 function change(next:RoadmapEpic[]){
  setItems(next);setNotice("");setFailure("");
  if(mode==="demo"){
   try{localStorage.setItem(LOCAL_KEY,JSON.stringify(next));setLastSaved(new Date().toLocaleString("vi-VN"));}
   catch{setFailure("Không thể lưu trên thiết bị. Hãy xuất JSON để sao lưu.");}
  }else setDirty(true);
 }
 function update(id:string,fn:(item:RoadmapEpic)=>RoadmapEpic){
  change(items.map(item=>item.id===id?{...fn(item),updatedAt:new Date().toISOString()}:item));
 }
 function toggleExpand(id:string){
  setExpanded(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
 }
 async function save(){
  if(mode==="demo"){setNotice("Dữ liệu đã lưu trên trình duyệt này.");return;}
  if(saving)return;
  setSaving(true);setFailure("");setNotice("");
  try{
   const response=await fetch("/api/admin/roadmap",{
    method:"PUT",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({items,version})
   });
   const result=await response.json() as {version?:number;error?:string};
   if(!response.ok)throw Error(result.error??"Không thể lưu roadmap.");
   setVersion(result.version??version+1);
   setDirty(false);setNotice("Đã lưu lên hệ thống.");setLastSaved(new Date().toLocaleString("vi-VN"));
  }catch(reason){setFailure(reason instanceof Error?reason.message:"Không thể lưu roadmap.");}
  finally{setSaving(false);}
 }
 function commitEditor(){
  if(!editor||editor.title.trim().length<3)return;
  const data={title:editor.title.trim().slice(0,200),summary:editor.summary.trim().slice(0,1000),
   phase:editor.phase,area:editor.area.trim().slice(0,80)||"Khác",
   priority:editor.priority,status:editor.status};
  if(editor.id)update(editor.id,item=>({...item,...data}));
  else{
   const id=newId();
   change([...items,{...data,id,order:items.length,checklist:[],entries:[],updatedAt:new Date().toISOString()}]);
   setExpanded(v=>[...v,id]);
  }
  setEditor(null);
 }
 function removeEpic(id:string){
  if(!window.confirm("Xóa việc lớn cùng checklist và toàn bộ nhật ký của việc này?"))return;
  change(items.filter(item=>item.id!==id));
 }
 function moveEpic(id:string,direction:1|-1){
  const ordered=[...items].sort((a,b)=>a.order-b.order);
  const index=ordered.findIndex(i=>i.id===id),other=index+direction;
  if(index<0||other<0||other>=ordered.length)return;
  [ordered[index],ordered[other]]=[ordered[other],ordered[index]];
  change(ordered.map((item,order)=>({...item,order})));
 }
 function addTask(id:string){
  const text=taskText.trim().slice(0,500);if(!text)return;
  update(id,item=>({...item,checklist:[...item.checklist,{id:newId(),text,done:false}]}));
  setTaskText("");setEditingItem(null);
 }
 function addNote(id:string){
  const text=noteText.trim().slice(0,1500);if(!text)return;
  update(id,item=>({...item,entries:[{id:newId(),kind:noteKind,text,date:today()},...item.entries]}));
  setNotesFor(null);setNoteText("");setNoteKind("note");
 }
 async function importFile(event:ChangeEvent<HTMLInputElement>){
  const file=event.target.files?.[0];event.target.value="";
  if(!file)return;
  if(file.size>2_000_000){setFailure("File JSON quá lớn (tối đa 2 MB).");return;}
  try{
   const parsed:unknown=JSON.parse(await file.text());
   const raw=Array.isArray(parsed)?parsed:(parsed as {items?:unknown})?.items;
   if(!validItems(raw)||!raw.length)throw Error("File không đúng cấu trúc dữ liệu roadmap.");
   if(!confirm("Nhập bản sao lưu sẽ thay thế danh sách roadmap hiện tại. Tiếp tục?"))return;
   change(raw);setNotice("Đã nhập bản sao lưu. "+(mode==="live"?"Nhấn Lưu thay đổi để ghi lên hệ thống.":"Đã lưu trên thiết bị."));
  }catch(reason){setFailure(reason instanceof Error?reason.message:"Không thể đọc file.");}
 }
 const totals=useMemo(()=>roadmapTotals(items),[items]);
 const areas=useMemo(()=>[...new Set([...CATEGORIES,...items.map(i=>i.area)])].sort(),[items]);
 const visible=useMemo(()=>items.filter(item=>{
  if(phase!=="all"&&item.phase!==phase)return false;
  if(area!=="all"&&item.area!==area)return false;
  if(status!=="all"&&item.status!==status)return false;
  const text=[item.title,item.summary,item.area,...item.checklist.map(c=>c.text),...item.entries.map(e=>e.text)].join(" ").toLocaleLowerCase("vi");
  return text.includes(query.trim().toLocaleLowerCase("vi"));
 }).sort((a,b)=>a.order-b.order),[items,phase,area,status,query]);

 return <div className="xcn-roadmap" aria-busy={!ready}>
  <div className="xcn-roadmap-heading">
   <div>
    <div className="xcn-admin-kicker">TRUNG TÂM ĐIỀU HÀNH / TIẾN ĐỘ SẢN PHẨM</div>
    <h1>Roadmap phát triển</h1>
    <p>Đường thời gian theo các việc lớn; mở mỗi mốc để xem checklist, ghi chú đã bổ sung và lỗi đã sửa.</p>
   </div>
   <button className="xcn-admin-primary" type="button" onClick={()=>setEditor(editorDefault())}>
    <Plus size={17}/> Thêm việc lớn
   </button>
  </div>
  <div className="xcn-roadmap-metrics">
   {[{label:"Việc lớn",value:totals.epics},{label:"Đang thực hiện",value:totals.active},{label:"Hoàn thành",value:totals.done},
     {label:"Việc nhỏ đã ghi nhận",value:totals.checked+" / "+totals.subtasks}].map(metric=>
      <div key={metric.label} className="xcn-roadmap-metric"><span>{metric.label}</span><strong>{metric.value}</strong></div>)}
  </div>
  <div className="xcn-roadmap-toolbar">
   <label className="xcn-roadmap-search"><Search size={17}/><input aria-label="Tìm trong roadmap" value={query}
      onChange={e=>setQuery(e.target.value)} placeholder="Tìm việc lớn, việc nhỏ, ghi chú…"/></label>
   <label><Filter size={14}/> <span className="sr-only">Giai đoạn</span><select value={phase} onChange={e=>setPhase(e.target.value)}>
    <option value="all">Mọi giai đoạn</option>{ROADMAP_PHASES.map(p=><option key={p} value={p}>{p}</option>)}
   </select></label>
   <label><span className="sr-only">Phân hệ</span><select value={area} onChange={e=>setArea(e.target.value)}>
    <option value="all">Mọi phân hệ</option>{areas.map(a=><option key={a}>{a}</option>)}
   </select></label>
   <label><span className="sr-only">Trạng thái</span><select value={status} onChange={e=>setStatus(e.target.value)}>
    <option value="all">Mọi trạng thái</option>{Object.entries(ROADMAP_STATUS).map(([key,label])=><option key={key} value={key}>{label}</option>)}
   </select></label>
  </div>
  <div className="xcn-roadmap-actions">
   <div className="xcn-roadmap-save-state">
    {mode==="demo"?<Badge tone="orange">Chế độ thử — lưu trên thiết bị này</Badge>:
      <Badge tone={dirty?"orange":"green"}>{dirty?"Có thay đổi chưa lưu":"Dữ liệu hệ thống"}</Badge>}
    {lastSaved&&<small>Gần nhất: {lastSaved}</small>}
   </div>
   <div className="xcn-roadmap-action-buttons">
    <button type="button" onClick={()=>downloadFile("xuong-cong-nghe-roadmap.md",roadmapAsMarkdown(items),"text/markdown;charset=utf-8")}>
      <FileDown size={15}/> Xuất Markdown
    </button>
    <button type="button" onClick={()=>downloadFile("xuong-cong-nghe-roadmap.json",JSON.stringify({version:1,items},null,2),"application/json")}>
      <Download size={15}/> Sao lưu JSON
    </button>
    <input type="file" ref={fileRef} accept=".json,application/json" className="sr-only" aria-label="Nhập bản sao lưu" onChange={e=>void importFile(e)}/>
    <button type="button" onClick={()=>fileRef.current?.click()}>Nhập JSON</button>
    <button type="button" disabled={saving||!ready||(mode==="live"&&!dirty&&version>0)}
     className="xcn-admin-primary" onClick={()=>void save()}><Save size={15}/>{saving?"Đang lưu…":"Lưu thay đổi"}</button>
   </div>
  </div>
  {failure&&<div role="alert" className="xcn-roadmap-alert is-error">{failure}
    {mode==="live"&&<button onClick={()=>location.reload()} type="button">Tải lại dữ liệu</button>}
  </div>}
  {notice&&<div role="status" className="xcn-roadmap-alert">{notice}</div>}
  {!ready?<div className="xcn-roadmap-empty">Đang tải roadmap…</div>:
   visible.length===0?<div className="xcn-roadmap-empty">Không tìm thấy công việc phù hợp. Hãy thay đổi bộ lọc.</div>:
   <div className="xcn-roadmap-timeline">
    {visible.map((item,index)=>{
      const open=expanded.includes(item.id),percentage=roadmapProgress(item);
      return <section key={item.id} className={"xcn-roadmap-node status-"+item.status}>
       <div className="xcn-roadmap-spine" aria-hidden="true">
        <div className="xcn-roadmap-dot">{item.status==="done"?<Check size={17}/>:String(index+1).padStart(2,"0")}</div>
       </div>
       <article className="xcn-roadmap-card">
        <div className="xcn-roadmap-card-header">
         <button type="button" className="xcn-roadmap-card-title" aria-expanded={open} onClick={()=>toggleExpand(item.id)}>
          <div className="xcn-roadmap-card-overline">{item.phase} <span>·</span> {item.area}</div>
          <h2>{item.title}</h2>
          <p>{item.summary}</p>
         </button>
         <button type="button" className="xcn-roadmap-expand" onClick={()=>toggleExpand(item.id)}
          aria-label={(open?"Thu gọn ":"Mở rộng ")+item.title}>{open?<ChevronDown size={18}/>:<ChevronRight size={18}/>}</button>
        </div>
        <div className="xcn-roadmap-card-info">
         <Badge tone={item.status==="done"?"green":item.status==="building"?"blue":"neutral"}>{ROADMAP_STATUS[item.status]}</Badge>
         <Badge>{item.priority}</Badge>
         <span className="xcn-roadmap-percent">{percentage}% · {item.checklist.filter(t=>t.done).length}/{item.checklist.length} việc nhỏ</span>
        </div>
        <div className="xcn-roadmap-bar"><span style={{width:percentage+"%"}}/></div>
        {open&&<div className="xcn-roadmap-body">
         <div className="xcn-roadmap-inline-actions">
          <label>Trạng thái <select aria-label={"Trạng thái "+item.title} value={item.status}
           onChange={e=>update(item.id,old=>({...old,status:e.target.value as RoadmapStatus}))}>
           {Object.entries(ROADMAP_STATUS).map(([value,label])=><option key={value} value={value}>{label}</option>)}
          </select></label>
          <button type="button" onClick={()=>setEditor({id:item.id,title:item.title,summary:item.summary,phase:item.phase,area:item.area,priority:item.priority,status:item.status})}><NotebookPen size={15}/> Sửa việc lớn</button>
          <button type="button" onClick={()=>moveEpic(item.id,-1)} aria-label={"Đưa "+item.title+" lên"}><ArrowUp size={15}/> Lên</button>
          <button type="button" onClick={()=>moveEpic(item.id,1)} aria-label={"Đưa "+item.title+" xuống"}><ArrowDown size={15}/> Xuống</button>
          <button type="button" className="danger" onClick={()=>removeEpic(item.id)}><Trash2 size={15}/> Xóa</button>
         </div>
         <h3>Checklist công việc</h3>
         <div className="xcn-roadmap-checklist">
          {item.checklist.map(task=><div className="xcn-roadmap-task" key={task.id}>
           <input id={"road-task-"+task.id} type="checkbox" checked={task.done}
            onChange={e=>update(item.id,old=>({...old,checklist:old.checklist.map(t=>t.id===task.id?{...t,done:e.target.checked}:t)}))}/>
           <label htmlFor={"road-task-"+task.id} className={task.done?"is-done":""}>{task.text}</label>
           <button aria-label={"Xóa việc nhỏ "+task.text} type="button"
            onClick={()=>update(item.id,old=>({...old,checklist:old.checklist.filter(t=>t.id!==task.id)}))}><X size={15}/></button>
          </div>)}
          {item.checklist.length===0&&<p className="xcn-roadmap-muted">Chưa có việc nhỏ.</p>}
         </div>
         {editingItem===item.id?
          <form className="xcn-roadmap-add" onSubmit={e=>{e.preventDefault();addTask(item.id)}}>
           <input autoFocus value={taskText} onChange={e=>setTaskText(e.target.value)} maxLength={500} placeholder="Mô tả việc nhỏ…" required/>
           <button type="submit" className="xcn-admin-primary">Thêm</button>
           <button type="button" onClick={()=>setEditingItem(null)} aria-label="Hủy thêm việc"><X size={16}/></button>
          </form>:
          <button className="xcn-roadmap-link" type="button" onClick={()=>{setEditingItem(item.id);setTaskText("");}}><Plus size={16}/> Thêm việc nhỏ</button>}
         <div className="xcn-roadmap-notes-head"><h3><History size={17}/> Nhật ký thay đổi</h3>
          <button type="button" className="xcn-roadmap-link" onClick={()=>{setNotesFor(item.id);setNoteText("");}}><Plus size={15}/> Thêm ghi chú</button></div>
         {notesFor===item.id&&<form className="xcn-roadmap-note-editor" onSubmit={e=>{e.preventDefault();addNote(item.id)}}>
          <label>Loại cập nhật <select value={noteKind} onChange={e=>setNoteKind(e.target.value as RoadmapEntryKind)}>
           <option value="note">Ghi chú</option><option value="added">Đã bổ sung</option><option value="fixed">Đã sửa lỗi</option>
          </select></label>
          <textarea autoFocus value={noteText} onChange={e=>setNoteText(e.target.value)} maxLength={1500} rows={3} required placeholder="Ghi chi tiết nội dung đã làm thêm, đã sửa hoặc cần lưu ý…"/>
          <div><button type="submit" className="xcn-admin-primary">Lưu ghi chú</button>
           <button type="button" onClick={()=>setNotesFor(null)}>Hủy</button></div>
         </form>}
         <div className="xcn-roadmap-notes">
          {item.entries.length===0?<p className="xcn-roadmap-muted">Chưa có ghi chú.</p>:
           item.entries.map(entry=><div className="xcn-roadmap-note" key={entry.id}>
            <span className={"xcn-roadmap-note-tag is-"+entry.kind}>{entry.kind==="fixed"?"Đã sửa":entry.kind==="added"?"Đã thêm":"Ghi chú"}</span>
            <span className="xcn-roadmap-note-date"><Clock3 size={12}/>{entry.date}</span>
            <p>{entry.text}</p>
            <button type="button" aria-label="Xóa ghi chú" onClick={()=>{
             if(confirm("Xóa ghi chú này?"))update(item.id,old=>({...old,entries:old.entries.filter(e=>e.id!==entry.id)}));
            }}><Trash2 size={14}/></button>
           </div>)}
         </div>
        </div>}
       </article>
      </section>;
    })}
   </div>}
  {editor&&<div className="xcn-admin-modal-backdrop" onPointerDown={event=>{if(event.target===event.currentTarget)setEditor(null);}}>
   <form className="xcn-admin-modal" role="dialog" aria-modal="true" aria-label={editor.id?"Sửa việc lớn":"Thêm việc lớn"}
    onSubmit={event=>{event.preventDefault();commitEditor();}}>
    <div className="xcn-admin-modal-head"><h2>{editor.id?"Chỉnh sửa việc lớn":"Tạo mốc công việc"}</h2>
     <button aria-label="Đóng" type="button" onClick={()=>setEditor(null)}><X size={19}/></button></div>
    <label>Tên việc lớn<input autoFocus required minLength={3} maxLength={200} value={editor.title}
     onChange={e=>setEditor({...editor,title:e.target.value})}/></label>
    <label>Mục tiêu / mô tả<textarea rows={3} maxLength={1000} value={editor.summary}
     onChange={e=>setEditor({...editor,summary:e.target.value})}/></label>
    <div className="xcn-admin-modal-grid">
     <label>Giai đoạn<select value={editor.phase} onChange={e=>setEditor({...editor,phase:e.target.value})}>
      {ROADMAP_PHASES.map(p=><option key={p}>{p}</option>)}</select></label>
     <label>Phân hệ<input list="roadmap-areas" maxLength={80} value={editor.area}
      onChange={e=>setEditor({...editor,area:e.target.value})}/><datalist id="roadmap-areas">{areas.map(a=><option key={a} value={a}/>)}</datalist></label>
     <label>Ưu tiên<select value={editor.priority} onChange={e=>setEditor({...editor,priority:e.target.value as RoadmapPriority})}>
      {Object.entries(ROADMAP_PRIORITY).map(([v,label])=><option value={v} key={v}>{v} — {label}</option>)}</select></label>
     <label>Trạng thái<select value={editor.status} onChange={e=>setEditor({...editor,status:e.target.value as RoadmapStatus})}>
      {Object.entries(ROADMAP_STATUS).map(([v,label])=><option value={v} key={v}>{label}</option>)}</select></label>
    </div>
    <div className="xcn-admin-modal-footer"><button type="button" onClick={()=>setEditor(null)}>Hủy</button>
     <button type="submit" className="xcn-admin-primary"><Save size={16}/> Lưu việc lớn</button></div>
   </form>
  </div>}
 </div>;
}
