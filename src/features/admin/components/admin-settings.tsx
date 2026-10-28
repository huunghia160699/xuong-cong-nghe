"use client";
import {useEffect,useState,type ChangeEvent} from "react";
import {Check,Download,RotateCcw,Save,Upload} from "lucide-react";
import {ADMIN_CONFIG_KEY,DEFAULT_ADMIN_CONFIG,recordLocalAdminEvent,validateAdminConfig,type AdminConfig} from "../admin-local";
export function AdminSettings(){
 const [value,setValue]=useState<AdminConfig>(DEFAULT_ADMIN_CONFIG);
 const [loaded,setLoaded]=useState(false),[dirty,setDirty]=useState(false);
 const [status,setStatus]=useState(""),[error,setError]=useState("");
 useEffect(()=>{
  try{
   const raw=localStorage.getItem(ADMIN_CONFIG_KEY);
   if(raw){const parsed:unknown=JSON.parse(raw);if(validateAdminConfig(parsed))setValue(parsed);}
  }catch{ /* show defaults on corrupt draft */ }
  setLoaded(true);
 },[]);
 useEffect(()=>{
  if(!dirty)return;
  const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};
  window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn);
 },[dirty]);
 const update=<K extends keyof AdminConfig>(key:K,v:AdminConfig[K])=>{setValue(x=>({...x,[key]:v}));setDirty(true);setStatus("");setError("");};
 function save(){
  if(!validateAdminConfig(value)){setError("Cấu hình chưa hợp lệ. Kiểm tra tên, địa chỉ hỗ trợ và độ dài văn bản.");return;}
  try{localStorage.setItem(ADMIN_CONFIG_KEY,JSON.stringify(value));
   setDirty(false);setStatus("Đã lưu bản nháp trên thiết bị này. Chưa áp dụng lên website.");
   recordLocalAdminEvent("settings","Lưu bản nháp cấu hình website");
  }catch{setError("Không lưu được trên trình duyệt. Hãy xuất bản sao JSON.");}
 }
 function download(){
  const blob=new Blob([JSON.stringify({format:1,config:value},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="xcn-site-settings-draft.json";a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 async function importJson(e:ChangeEvent<HTMLInputElement>){
  const file=e.target.files?.[0];e.target.value="";if(!file)return;
  if(file.size>20_000){setError("Bản cấu hình quá 20 KB.");return;}
  try{
   const json:unknown=JSON.parse(await file.text());
   const config=(json&&typeof json==="object"&&"config" in json)?(json as {config:unknown}).config:json;
   if(!validateAdminConfig(config))throw Error("Cấu trúc cấu hình không đúng.");
   if(!confirm("Thay nội dung bản nháp hiện tại bằng file JSON?"))return;
   setValue(config);setDirty(true);setStatus("Đã nhập. Nhấn Lưu bản nháp để ghi trên thiết bị.");setError("");
   recordLocalAdminEvent("settings","Nhập bản nháp cấu hình từ JSON");
  }catch(err){setError(err instanceof Error?err.message:"Không đọc được file.");}
 }
 if(!loaded)return <div className="xcn-admin-panel">Đang tải bản nháp…</div>;
 return <div className="xcn-admin">
  <div className="xcn-admin-heading"><div><h1>Cấu hình website</h1>
   <p>Soạn, xem trước, lưu và sao lưu cấu hình. Khi chưa có Admin Live, bản nháp không làm thay đổi trang công khai.</p></div>
   <button type="button" className="xcn-admin-primary" onClick={save}><Save size={16}/> Lưu bản nháp</button>
  </div>
  <div className="xcn-admin-notice">Chế độ an toàn: dữ liệu chỉ được lưu trong trình duyệt. Không có nút Xuất bản website hoặc thay đổi quyền truy cập ở giai đoạn này.</div>
  {status&&<div className="xcn-admin-notice is-success" role="status"><Check size={16}/>{status}</div>}
  {error&&<div className="xcn-admin-notice is-error" role="alert">{error}</div>}
  <div className="xcn-admin-duo">
   <section className="xcn-admin-panel">
    <h2 className="text-lg font-bold">Nhận diện và nội dung</h2>
    <div className="xcn-admin-form">
     <label>Tên website<input maxLength={80} value={value.siteName} onChange={e=>update("siteName",e.target.value)}/></label>
     <label>Khẩu hiệu<textarea maxLength={180} rows={3} value={value.tagline} onChange={e=>update("tagline",e.target.value)}/></label>
     <label>Email hỗ trợ (trong bản nháp)<input type="email" maxLength={120} placeholder="support@example.com" value={value.supportEmail} onChange={e=>update("supportEmail",e.target.value)}/></label>
     <label>Thông báo nổi bật<textarea maxLength={240} rows={3} placeholder="Nội dung thông báo dự kiến…" value={value.announcement} onChange={e=>update("announcement",e.target.value)}/></label>
    </div>
   </section>
   <div className="grid content-start gap-4">
    <section className="xcn-admin-panel"><h2 className="text-lg font-bold">Các nhóm nổi bật (bản nháp)</h2>
     <div className="xcn-admin-toggles">
      {([["highlightTools","Công cụ Tin học"],["highlightCourses","Khóa học"],["highlightLibrary","Thư viện"]] as const).map(([key,label])=>
       <label key={key}><span>{label}</span><input type="checkbox" checked={value[key]} onChange={e=>update(key,e.target.checked)}/></label>)}
     </div>
    </section>
    <section className="xcn-admin-panel"><h2 className="text-lg font-bold">Xem trước nội dung</h2>
     <div className="xcn-admin-preview"><small>LANDING PAGE · DỰ THẢO</small>
      <h3>{value.siteName||"Tên website"}</h3><p>{value.tagline}</p>
      {value.announcement&&<div className="mt-3 rounded-lg bg-white/15 p-3 text-xs">{value.announcement}</div>}
      <div className="mt-4 flex flex-wrap gap-2">{value.highlightTools&&<span>Công cụ</span>}{value.highlightCourses&&<span>Khóa học</span>}{value.highlightLibrary&&<span>Thư viện</span>}</div>
     </div>
    </section>
   </div>
  </div>
  <div className="xcn-admin-panel mt-5">
   <div className="xcn-admin-actions">
    <button type="button" onClick={download}><Download size={16}/> Xuất JSON</button>
    <label className="xcn-admin-upload"><Upload size={16}/> Nhập JSON<input className="sr-only" type="file" accept=".json,application/json" onChange={e=>void importJson(e)}/></label>
    <button type="button" onClick={()=>{
     if(!confirm("Đưa bản nháp về cấu hình gợi ý ban đầu?"))return;
     setValue(DEFAULT_ADMIN_CONFIG);setDirty(true);recordLocalAdminEvent("settings","Khôi phục cấu hình nháp mặc định");
    }}><RotateCcw size={16}/> Khôi phục mặc định</button>
    <span className="text-xs text-slate-500">{dirty?"Có thay đổi chưa lưu":"Đã đồng bộ với bản nháp cục bộ"}</span>
   </div>
  </div>
 </div>;
}
