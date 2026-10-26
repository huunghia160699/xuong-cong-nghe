import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import ts from "typescript";
import {ROADMAP_INITIAL,ROADMAP_PHASES,ROADMAP_PRIORITY,ROADMAP_STATUS} from "../src/features/admin/roadmap-data.ts";

function load(file,deps={}){
 const source=readFileSync("src/features/admin/"+file+".ts","utf8");
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};
 runInNewContext(js,{
  module,exports:module.exports,
  require:name=>{
   if(name==="./roadmap-data")return {ROADMAP_INITIAL,ROADMAP_PHASES,ROADMAP_PRIORITY,ROADMAP_STATUS};
   if(name in deps)return deps[name];
   throw Error("Unknown dependency "+name);
  },
  Date,JSON,Set,Number,Object,String,Array,TextEncoder,Error,structuredClone
 },{timeout:3000});
 return module.exports;
}
const validation=load("roadmap-validation");
const history=load("roadmap-history",{"./roadmap-validation":validation});
const clone=value=>JSON.parse(JSON.stringify(value));
const stamp="2026-10-26T17:10:00.000Z";
const capture=(prior=[],items=ROADMAP_INITIAL,n=1,label="Checkpoint")=>
 history.addRoadmapSnapshot(prior,{items,baseVersion:n,label},"snapshot-"+n,stamp);
const board=readFileSync("src/features/admin/components/roadmap-board.tsx","utf8");
const component=readFileSync("src/features/admin/components/roadmap-history-panel.tsx","utf8");
const css=readFileSync("src/app/admin/admin.css","utf8");

test("new restore point is stored as a separate immutable validated copy",()=>{
 const original=clone(ROADMAP_INITIAL);
 const versions=capture([],original);
 assert.equal(versions.length,1);
 assert.equal(versions[0].label,"Checkpoint");
 original[0].title="Mutated";
 assert.notEqual(versions[0].items[0].title,"Mutated");
 assert.equal(history.parseRoadmapHistory(JSON.parse(JSON.stringify(versions))).length,1);
});
test("deduplicate unchanged content; preserve latest changed states",()=>{
 const versions=capture();
 const duplicate=capture(versions,clone(ROADMAP_INITIAL),2);
 assert.equal(duplicate.length,1);
 const changed=clone(ROADMAP_INITIAL);
 changed[0].title="Updated milestone";
 const newest=capture(duplicate,changed,2);
 assert.equal(newest.length,2);
 assert.equal(newest[0].items[0].title,"Updated milestone");
 assert.equal(newest[1].items[0].title,ROADMAP_INITIAL[0].title);
});
test("bounded history evicts oldest snapshots without changing active roadmap",()=>{
 let versions=[];
 for(let n=0;n<10;n++){
  const items=clone(ROADMAP_INITIAL);
  items[0].summary="Revision "+n;
  versions=capture(versions,items,n+1,"Manual "+n);
 }
 assert.equal(versions.length,history.ROADMAP_HISTORY_LIMIT);
 assert.equal(versions[0].items[0].summary,"Revision 9");
 assert.equal(versions.at(-1).items[0].summary,"Revision 4");
 assert.equal(history.parseRoadmapHistory(versions).length,versions.length);
});
test("reject corrupt imported history, too many entries and duplicate snapshot IDs",()=>{
 const one=capture();
 assert.equal(history.parseRoadmapHistory({items:one}).length,0);
 assert.equal(history.parseRoadmapHistory([...one,...one]).length,0);
 assert.equal(history.parseRoadmapHistory(Array(7).fill(one[0])).length,0);
 const broken=clone(one);
 broken[0].items[0].priority="SUPERADMIN";
 assert.equal(history.parseRoadmapHistory(broken).length,0);
 assert.equal(history.parseRoadmapHistory([{}]).length,0);
 assert.throws(()=>capture([], [{id:"malformed"}],1));
 assert.throws(()=>history.addRoadmapSnapshot([],{items:ROADMAP_INITIAL,baseVersion:0,label:""},"i",stamp));
});
test("delete restore points without deleting actual roadmap data",()=>{
 const first=capture();
 const changed=clone(ROADMAP_INITIAL);changed[0].summary="New";
 const two=capture(first,changed,2);
 const kept=history.removeRoadmapSnapshot(two,two[0].id);
 assert.equal(kept.length,1);
 assert.equal(kept[0].items[0].summary,ROADMAP_INITIAL[0].summary);
 assert.equal(history.removeRoadmapSnapshot(two,"unknown").length,2);
});
test("UI protects destructive actions and exposes explicit restore controls",()=>{
 for(const token of ["RoadmapHistoryPanel","RoadmapHistoryButton","Trước khi xóa:","Trước khi nhập JSON","Trước khi khôi phục bản nháp", "storeDraft(next,version"]){
  assert.ok(board.includes(token),"Missing: "+token);
 }
 for(const token of ["Tạo điểm khôi phục","Khôi phục","Bản sao","Không đồng bộ giữa các thiết bị"]){
  assert.ok(component.includes(token),"Missing: "+token);
 }
 assert.match(component,/aria-controls="xcn-roadmap-backup-history"/);
 assert.match(css,/\.xcn-roadmap-history-item\{/);
 assert.match(css,/@media\(max-width:700px\)/);
});
