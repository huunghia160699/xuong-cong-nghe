import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import * as crypto from "node:crypto";
import ts from "typescript";
import * as data from "../src/features/admin/roadmap-data.ts";

const read=p=>readFileSync(p,"utf8");
function load(path,dependencies){
 const js=ts.transpileModule(read("src/features/admin/"+path+".ts"),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};
 runInNewContext(js,{module,exports:module.exports,require(name){
  if(name==="./roadmap-data")return data;
  if(name==="./roadmap-validation")return dependencies;
  if(name==="node:crypto")return crypto;
  throw Error("Unexpected import "+name);
 },TextEncoder,Date,JSON,Number,Object,Array,Set,String,Error},{timeout:3000});
 return module.exports;
}
const validation=load("roadmap-validation",{});
const backup=load("roadmap-server-backup",validation);
const events=[{id:1,version:1,occurred_at:"2026-10-27T02:46:58Z",
 actor_id:"7f2c93e6-0000-0000-0000-000000000000",
 changes:[{kind:"roadmap.created",title:"Initialized"}]}];

test("server backup is lossless, includes audit events and stable SHA256",()=>{
 const payload=backup.makeRoadmapBackup(data.ROADMAP_INITIAL,4,events);
 assert.equal(payload.kind,"xcn-roadmap-supabase-backup");
 assert.equal(payload.format,1);
 assert.equal(payload.roadmapVersion,4);
 assert.equal(payload.events.length,1);
 assert.equal(payload.sha256.length,64);
 assert.equal(backup.verifyRoadmapBackup(payload),true);
 assert.deepEqual(JSON.parse(JSON.stringify(payload.items)),data.ROADMAP_INITIAL);
});
test("tampered checklist, version and document name invalidate checksum",()=>{
 const payload=backup.makeRoadmapBackup(data.ROADMAP_INITIAL,4,events);
 const edited=JSON.parse(JSON.stringify(payload));
 edited.items[0].checklist[0].done=!edited.items[0].checklist[0].done;
 assert.equal(backup.verifyRoadmapBackup(edited),false);
 edited.items=payload.items;edited.roadmapVersion=5;
 assert.equal(backup.verifyRoadmapBackup(edited),false);
 edited.roadmapVersion=4;edited.documentId="other";
 assert.equal(backup.verifyRoadmapBackup(edited),false);
 assert.equal(backup.verifyRoadmapBackup(null),false);
});
test("backup rejects invalid and oversized roadmap or malformed history",()=>{
 assert.throws(()=>backup.makeRoadmapBackup({},1,events));
 assert.throws(()=>backup.makeRoadmapBackup(data.ROADMAP_INITIAL,0,events));
 assert.throws(()=>backup.makeRoadmapBackup(data.ROADMAP_INITIAL,2,Array(2001).fill(events[0])));
 assert.throws(()=>backup.makeRoadmapBackup(data.ROADMAP_INITIAL,2,[{bad:true}]));
});
test("server export endpoint requires verified Admin JWT and never edits data",()=>{
 const route=read("src/app/api/admin/roadmap/backup/route.ts");
 assert.match(route,/export async function GET/);
 assert.doesNotMatch(route,/export async function (?:PUT|POST|DELETE|PATCH)/);
 assert.match(route,/isLiveMode\(\)/);
 assert.match(route,/supabase\.auth\.getUser\(\)/);
 assert.match(route,/profile\?\.role!=="admin"/);
 assert.match(route,/from\("admin_roadmap_events"\)/);
 assert.match(route,/\.range\(offset,offset\+pageSize-1\)/);
 assert.match(route,/offset===maxEvents/);
 assert.match(route,/Cache-Control":"private, no-store"/);
 assert.doesNotMatch(route,/service.role|service_role|SERVICE_ROLE/);
 const board=read("src/features/admin/components/roadmap-board.tsx");
 assert.match(board,/Sao lưu từ Supabase/);
 assert.match(board,/fetch\("\/api\/admin\/roadmap\/backup"/);
});
test("operations dashboard differentiates Live and the unverified JWT gate",()=>{
 const monitor=read("src/features/admin/components/admin-monitor.tsx");
 const page=read("src/app/admin/he-thong/page.tsx");
 assert.match(monitor,/JWT E2E hai vai trò chưa được nghiệm thu/);
 assert.match(monitor,/roadmapEvents/);
 assert.match(monitor,/roadmapVersion/);
 assert.doesNotMatch(monitor,/Chưa áp cấu hình Live vào production/);
 assert.match(page,/from\("admin_roadmap"\)/);
 assert.match(page,/from\("admin_roadmap_events"\)/);
});
