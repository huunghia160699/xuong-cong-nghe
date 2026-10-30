#!/usr/bin/env node
/**
 * Isolated Supabase staging acceptance test.
 *
 * Usage (ONLY a non-production project/branch with two confirmed test accounts):
 * RLS_* env variables documented in docs/SUPABASE_SETUP.md
 * node scripts/verify-roadmap-staging.mjs
 *
 * This test CREATES the singleton Roadmap on an EMPTY staging DB, exercises
 * real JWT RLS, readback, 409-style compare-and-swap, add/edit/remove, backup,
 * restore and audit events. It DOES NOT delete the singleton; on success it
 * leaves a blank document with incremented version and its immutable events.
 * Do not run if an important Roadmap already exists in the staging project.
 */
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {mkdtempSync,writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {createClient} from "@supabase/supabase-js";
import {readRlsConfig,runRlsCheck,ROADMAP_ID} from "./verify-roadmap-rls.mjs";

// This QA acceptance runner must never operate on another application\'s project.
export const STAGING_PROJECT_REF="ordiksbvpewwgrnvzrud";

const options={auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}};
const normalized=value=>JSON.stringify(value,(key,v)=>
 v && typeof v==="object" && !Array.isArray(v)
 ? Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v
);
const equal=(a,b)=>normalized(a)===normalized(b);
const nowDate=()=>new Date().toISOString().slice(0,10);
const check=(result,what)=>{
 if(result.error)throw new Error(what+": "+(result.error.code||"unknown Supabase error"));
 return result.data;
};
const sample=()=>({
 id:"staging-roadmap-acceptance",title:"Kiểm thử lưu và khôi phục trên staging",
 summary:"Dữ liệu giả lập của bài kiểm thử, tuyệt đối không dùng cho Production",
 phase:"00 · Nền tảng & Admin",area:"QA",priority:"P0",status:"testing",order:0,
 checklist:[{id:"staging-check-1",text:"Kiểm tra trạng thái ban đầu",done:false}],
 entries:[{id:"staging-entry-1",kind:"note",text:"Bản thử nghiệm tách Production",date:nowDate()}]
});

/** Auth sessions created with different clients so JWT permissions are real. */
async function signIn(config,email,password,expected){
 const client=createClient(config.url,config.key,options);
 const result=await client.auth.signInWithPassword({email,password});
 if(result.error||!result.data?.session?.access_token)throw new Error("Không đăng nhập được tài khoản test "+expected);
 const who=await client.auth.getUser();
 if(who.error||!who.data?.user?.email_confirmed_at)throw new Error("JWT/email chưa xác thực cho "+expected);
 const role=await client.from("profiles").select("role").eq("id",who.data.user.id).single();
 if(role.error||role.data?.role!==expected)throw new Error("Role DB không khớp "+expected);
 return {client,userId:who.data.user.id};
}

export async function runStagingAcceptance({env=process.env,logger=console.log,makeClient=createClient}={}){
 // Defense in depth: full staging URL/ref and explicit write gates checked
 // BEFORE making any network connections or filesystem backup.
 const config=readRlsConfig(env,true);
 if(env.RLS_TEST_PROJECT_REF!==STAGING_PROJECT_REF)
  throw new Error("Sai project staging cho Xưởng Công Nghệ: dừng trước khi ghi.");
 if(env.RLS_STAGING_PURPOSE!=="ACCEPTANCE_ONLY")
  throw new Error("Thiếu RLS_STAGING_PURPOSE=ACCEPTANCE_ONLY (chỉ DB staging riêng).");
 // runRlsCheck uses its own independently authenticated Admin + Student.
 const result=await runRlsCheck({env,buildClient:makeClient,logger:()=>{}});
 if(result.adminRows!==0)
  throw new Error("Staging đã có Roadmap: dừng, không thay/ghi đè dữ liệu sẵn có.");

 // runRlsCheck --write creates the initially empty versioned document after
 // checking Student INSERT/UPDATE and spoofed updated_by are refused.
 const writeResult=await runRlsCheck({env,buildClient:makeClient,write:true,logger:()=>{}});
 assert.equal(writeResult.version,2);
 const {client:admin,userId}=await signIn(config,config.adminEmail,config.adminPassword,"admin");
 const {client:student}=await signIn(config,config.studentEmail,config.studentPassword,"student");
 let expectedVersion=2;
 const fetchDoc=async()=>{
  const doc=check(await admin.from("admin_roadmap")
   .select("items,version,updated_by").eq("id",ROADMAP_ID).single(),"Admin readback");
  if(doc.updated_by!==userId)throw new Error("updated_by thay đổi ngoài mong đợi.");
  return doc;
 };
 const initial=await fetchDoc();
 if(initial.version!==2||!equal(initial.items,[]))throw new Error("Staging Roadmap không rỗng ở version 2.");
 const backup={
  createdAt:new Date().toISOString(),projectRef:env.RLS_TEST_PROJECT_REF,
  kind:"staging-roadmap-test-prewrite",version:initial.version,items:initial.items
 };
 const location=mkdtempSync(join(tmpdir(),"xcn-staging-roadmap-"));
 const backupPath=join(location,"roadmap-before-acceptance.json");
 writeFileSync(backupPath,JSON.stringify(backup,null,2),{mode:0o600,flag:"wx"});
 const digest=createHash("sha256").update(JSON.stringify(backup.items)).digest("hex");
 logger("PASS: backup staging đầu vào đã lưu trong máy chạy test: "+backupPath);
 logger("Backup SHA-256: "+digest+"; version="+initial.version);
 const steps=[];
 const save=async(items,label)=>{
  const version=expectedVersion;
  const attempt=await admin.from("admin_roadmap")
   .update({items,version:version+1,updated_by:userId})
   .eq("id",ROADMAP_ID).eq("version",version)
   .select("version,items").maybeSingle();
  const result=check(attempt,label);
  if(!result||result.version!==version+1)throw new Error(label+": optimistic lock không tạo bản ghi");
  expectedVersion=result.version;
  const fresh=await fetchDoc();
  if(fresh.version!==expectedVersion||!equal(fresh.items,items))
   throw new Error(label+": GET readback khác dữ liệu vừa lưu");
  steps.push({label,version:expectedVersion});
  return fresh;
 };
 let failure=null;
 try{
  const withEpic=[sample()];
  const added=await save(withEpic,"Thêm epic và checklist");
  // Backup after create, to verify an actual restore of non-empty content.
  const restorePath=join(location,"roadmap-restore-checkpoint.json");
  writeFileSync(restorePath,JSON.stringify({
   createdAt:new Date().toISOString(),version:added.version,items:added.items
  },null,2),{mode:0o600,flag:"wx"});
  const edited=structuredClone(withEpic);
  edited[0].summary="Phiên bản đã được chỉnh sửa ở staging";
  edited[0].checklist[0].done=true;
  await save(edited,"Sửa epic và hoàn thành checklist");

  // Compare-and-swap must reject a stale writer without touching the document.
  const stale=await admin.from("admin_roadmap")
   .update({items:withEpic,version:4,updated_by:userId})
   .eq("id",ROADMAP_ID).eq("version",2).select("version").maybeSingle();
  if(stale.error||stale.data)throw new Error("Xung đột phiên bản không bị từ chối.");
  const afterConflict=await fetchDoc();
  if(afterConflict.version!==expectedVersion||!equal(afterConflict.items,edited))
   throw new Error("PUT phiên cũ đã gây mất dữ liệu.");

  const studentUpdate=await student.from("admin_roadmap")
   .update({items:[],version:999}).eq("id",ROADMAP_ID).select("version");
  if(!studentUpdate.error&&(studentUpdate.data??[]).length>0)
   throw new Error("LỖ HỔNG: Student thay đổi Roadmap.");
  if((await fetchDoc()).version!==expectedVersion)throw new Error("Student đã đổi version.");

  const withoutTask=structuredClone(edited);withoutTask[0].checklist=[];
  await save(withoutTask,"Xóa checklist");
  await save([],"Xóa epic");
  // Restore the *saved* snapshot, not a synthetic approximation.
  const restored=await save(added.items,"Khôi phục checkpoint đã sao lưu");
  if(!equal(restored.items,added.items))throw new Error("Khôi phục sai nội dung ban đầu.");

  // Admin history must carry one server event per successfully committed version.
  const history=check(await admin.from("admin_roadmap_events")
   .select("version,changes").eq("document_id",ROADMAP_ID)
   .order("version",{ascending:true}),"Read audit history");
  for(let version=1;version<=expectedVersion;version++)
   if(history.filter(event=>event.version===version).length!==1)
    throw new Error("Audit events thiếu hoặc trùng version "+version);
  const studentHistory=await student.from("admin_roadmap_events").select("version");
  if(!studentHistory.error&&(studentHistory.data??[]).length!==0)
   throw new Error("LỖ HỔNG: Student đọc được lịch sử Admin.");
  logger("PASS: add/edit/delete/conflict/restore, Student denied và audit trail v1–v"+expectedVersion);
 }catch(error){failure=error;}
 // Finally: return content to the empty pre-test snapshot using CAS ONLY if
 // another Admin has not modified it. Never overwrite a new concurrent revision.
 try{
  const beforeCleanup=await fetchDoc();
  if(beforeCleanup.version!==expectedVersion)
   throw new Error("Có bản ghi mới bên ngoài bài test: không tự khôi phục chồng lên.");
  if(!equal(beforeCleanup.items,initial.items))
   await save(initial.items,"Dọn sạch dữ liệu thử về snapshot ban đầu");
  const final=await fetchDoc();
  if(!equal(final.items,initial.items))
   throw new Error("Không thể xác minh phục hồi snapshot trước kiểm thử.");
  logger("PASS: dữ liệu nội dung trở về bản rỗng, version="+final.version+
   "; audit history giữ nguyên, không xóa singleton.");
 }catch(cleanupError){
  throw new AggregateError([...(failure?[failure]:[]),cleanupError],
   "Không dọn được staging. Giữ backup tại "+backupPath+
   "; PHẢI kiểm tra thủ công trước khi thử lại.");
 }
 if(failure)throw failure;
 return {passed:true,projectRef:env.RLS_TEST_PROJECT_REF,version:expectedVersion,
  backupPath,steps:steps.map(x=>x.label)};
}
const isEntrypoint=process.argv[1]&&process.argv[1].endsWith("verify-roadmap-staging.mjs");
if(isEntrypoint){
 runStagingAcceptance().then(x=>console.log("STAGING ACCEPTANCE PASS; final version="+x.version))
  .catch(e=>{console.error("STAGING ACCEPTANCE FAILED:",e.message);process.exitCode=1;});
}
