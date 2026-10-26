/** Draft-only site configuration; NEVER treated as production configuration or authorization. */
export const ADMIN_CONFIG_KEY="xcn-admin-settings-draft-v1";
export const ADMIN_AUDIT_KEY="xcn-admin-browser-audit-v1";
export type AdminConfig={
  siteName:string;tagline:string;supportEmail:string;
  highlightTools:boolean;highlightCourses:boolean;highlightLibrary:boolean;
  announcement:string;
};
export const DEFAULT_ADMIN_CONFIG:AdminConfig={
 siteName:"Xưởng Công Nghệ",
 tagline:"Học Tin học qua trải nghiệm và thực hành",
 supportEmail:"",
 highlightTools:true,highlightCourses:true,highlightLibrary:true,
 announcement:""
};
export type AdminAuditEvent={
 id:string;at:string;kind:"settings"|"roadmap"|"backup";message:string;
};
export function validateAdminConfig(value:unknown):value is AdminConfig{
 if(!value||typeof value!=="object"||Array.isArray(value))return false;
 const v=value as Partial<AdminConfig>;
 return typeof v.siteName==="string"&&v.siteName.trim().length>=2&&v.siteName.length<=80
  &&typeof v.tagline==="string"&&v.tagline.length<=180
  &&typeof v.supportEmail==="string"&&v.supportEmail.length<=120
  &&(!v.supportEmail||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.supportEmail))
  &&typeof v.highlightTools==="boolean"&&typeof v.highlightCourses==="boolean"
  &&typeof v.highlightLibrary==="boolean"
  &&typeof v.announcement==="string"&&v.announcement.length<=240;
}
export function validateAuditLog(value:unknown):value is AdminAuditEvent[]{
 return Array.isArray(value)&&value.length<=120&&value.every((x:unknown)=>{
  if(!x||typeof x!=="object"||Array.isArray(x))return false;
  const e=x as Partial<AdminAuditEvent>;
  return typeof e.id==="string"&&e.id.length<=100
   &&typeof e.at==="string"&&e.at.length<=40&&!Number.isNaN(Date.parse(e.at))
   &&["settings","roadmap","backup"].includes(e.kind??"")
   &&typeof e.message==="string"&&e.message.length<=240;
 });
}
export function readLocalEvents():AdminAuditEvent[]{
 try{
  const data=localStorage.getItem(ADMIN_AUDIT_KEY);
  const value:unknown=data?JSON.parse(data):[];
  return validateAuditLog(value)?value:[];
 }catch{return [];}
}
export function recordLocalAdminEvent(kind:AdminAuditEvent["kind"],message:string){
 if(typeof window==="undefined")return;
 try{
  const entry:AdminAuditEvent={id:crypto.randomUUID(),at:new Date().toISOString(),
   kind,message:message.slice(0,240)};
  const next=[entry,...readLocalEvents()].slice(0,120);
  localStorage.setItem(ADMIN_AUDIT_KEY,JSON.stringify(next));
  window.dispatchEvent(new Event("xcn-admin-audit-change"));
 }catch{ /* storage unavailable; cannot claim a durable audit */ }
}
