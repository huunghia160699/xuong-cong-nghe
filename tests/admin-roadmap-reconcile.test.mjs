import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {ROADMAP_INITIAL} from "../src/features/admin/roadmap-data.ts";
import {compareRoadmaps,compareTotals,mergeMissingRoadmap} from "../src/features/admin/roadmap-reconcile.ts";

const copy=value=>structuredClone(value);
const checklist=readFileSync("docs/XCN_FUNCTION_ROADMAP_CHECKLIST.md","utf8");
const board=readFileSync("src/features/admin/components/roadmap-board.tsx","utf8");
test("GitHub checklist and seeded roadmap contain matching tasks and checked states",()=>{
 const sections=checklist.split(/^### /m).slice(1);
 for(const epic of ROADMAP_INITIAL){
  const part=sections.find(s=>s.includes("**ID:** `"+epic.id+"`"));
  assert.ok(part,"No matching GitHub milestone "+epic.id);
  const actual=[...part.matchAll(/^- \[([x ])\] (.+)$/gm)].map(x=>({done:x[1]==="x",text:x[2]}));
  assert.deepEqual(actual,epic.checklist.map(task=>({done:task.done,text:task.text})),epic.id+" drifted between GitHub markdown and bundled data");
 }
});
test("diff detects exactly two disputed Done flags without mutating the source",()=>{
 const live=copy(ROADMAP_INITIAL);
 const item=live.find(e=>e.id==="admin-center");
 item.checklist[10].done=true;item.checklist[11].done=true;
 const report=compareRoadmaps(ROADMAP_INITIAL,live);
 assert.equal(compareTotals(report).differences,2);
 assert.equal(compareTotals(report).missing,0);
 assert.equal(report.mismatchedTasks[1].text,"Xác minh quyền admin, RLS và kiểm thử đa tài khoản");
 assert.equal(ROADMAP_INITIAL.find(e=>e.id==="admin-center").checklist[11].done,false);
});
test("missing IDs merge non-destructively; never change existing checkmarks or notes",()=>{
 const base=copy(ROADMAP_INITIAL);
 const target=copy(ROADMAP_INITIAL);
 const src=base.find(e=>e.id==="admin-center");
 const dst=target.find(e=>e.id==="admin-center");
 dst.checklist[0].done=false;
 dst.checklist.pop();
 dst.entries.splice(0,1);
 const extra={id:"new-epic",title:"New milestone",summary:"",area:"Tin học",
  phase:dst.phase,order:100,priority:"P0",status:"planned",checklist:[],entries:[]};
 const upstream=[...base,extra];
 const merged=mergeMissingRoadmap(target,upstream);
 const got=merged.find(x=>x.id==="admin-center");
 assert.equal(got.checklist[0].done,false,"must not overwrite edits");
 assert.equal(got.checklist.length,src.checklist.length);
 assert.equal(got.entries.length,src.entries.length);
 assert.ok(merged.some(x=>x.id==="new-epic"));
 assert.equal(target.find(x=>x.id==="admin-center").checklist.length,src.checklist.length-1);
});
test("never merge a checked source task over an existing unfinished task",()=>{
 const server=copy(ROADMAP_INITIAL);
 const source=copy(ROADMAP_INITIAL);
 source[0].checklist[0].done=true;
 server[0].checklist[0].done=false;
 const merged=mergeMissingRoadmap(server,source);
 assert.equal(merged[0].checklist[0].done,false);
 assert.notEqual(merged[0],server[0]);
 assert.equal(compareTotals(compareRoadmaps(server,merged)).missing,0);
});
test("when missing unfinished work is appended, completed milestone is reopened",()=>{
 const data=copy(ROADMAP_INITIAL),target=[...copy(ROADMAP_INITIAL)];
 const owner=target.find(x=>x.id==="admin-center");
 owner.checklist=[];owner.status="done";
 const merged=mergeMissingRoadmap(target,data);
 assert.equal(merged.find(x=>x.id==="admin-center").status,"building");
});
test("UI records source comparison and snapshots old draft before discard",()=>{
 for(const label of ["RoadmapReconcilePanel","mergeMissingRoadmap","Bảo quản bản nháp cũ","checkpoint(","Đã giữ bản Supabase"]){
  assert.ok(board.includes(label),"not found: "+label);
 }
 const ui=readFileSync("src/features/admin/components/roadmap-reconcile-panel.tsx","utf8");
 assert.match(ui,/Xem khác biệt/);
 assert.match(ui,/Checklist GitHub \/ dữ liệu gốc/);
 assert.match(ui,/Không tự đánh dấu hoàn thành/);
});
