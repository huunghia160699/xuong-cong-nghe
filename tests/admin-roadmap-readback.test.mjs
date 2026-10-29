import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import ts from "typescript";
import * as data from "../src/features/admin/roadmap-data.ts";

function load(path,dependencies){
 const source=readFileSync("src/features/admin/"+path+".ts","utf8");
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};
 runInNewContext(js,{module,exports:module.exports,require:name=>{
  if(name==="./roadmap-data")return data;
  if(name==="./roadmap-validation")return dependencies;
  throw Error("Unexpected import: "+name);
 },TextEncoder,Date,Object,Array,Set,JSON,Number,String,Error},{timeout:3000});
 return module.exports;
}
const validate=load("roadmap-validation",{});
const sync=load("roadmap-sync",validate);
const clone=value=>JSON.parse(JSON.stringify(value));
const seed=clone(data.ROADMAP_INITIAL);
const reorder=value=>Array.isArray(value)?value.map(reorder):
 value&&typeof value==="object"?Object.fromEntries(Object.entries(value).reverse().map(([k,v])=>[k,reorder(v)])):value;

test("JSONB key ordering never creates a false unsynced-draft alert",()=>{
 assert.equal(sync.sameRoadmapContent(seed,reorder(seed)),true);
 assert.equal(sync.sameRoadmapContent(seed,clone(seed)),true);
 assert.equal(sync.sameRoadmapContent(seed,{items:seed}),false);
});

test("Added, edited, checked, removed or reordered content is not a confirmed readback",()=>{
 const changes=[
  items=>items.push({...clone(items[0]),id:"new-epic",order:99}),
  items=>{items[0].summary="Changed summary";},
  items=>{items[0].checklist[0].done=!items[0].checklist[0].done;},
  items=>{items[0].checklist.splice(0,1);},
  items=>{items[0].entries.push({id:"new-note",kind:"note",text:"New note",date:"2026-10-29"});},
  items=>{items.reverse();}
 ];
 for(const change of changes){
  const next=clone(seed);change(next);
  assert.equal(validate.validateRoadmap(next),true);
  assert.equal(sync.sameRoadmapContent(seed,next),false);
  assert.equal(sync.isVerifiedRoadmapReadback({version:5,items:next},5,seed),false);
 }
});

test("Readback must match version and saved content before showing synchronized status",()=>{
 assert.equal(sync.isVerifiedRoadmapReadback({version:5,items:reorder(seed)},5,seed),true);
 assert.equal(sync.isVerifiedRoadmapReadback({version:6,items:seed},5,seed),false);
 assert.equal(sync.isVerifiedRoadmapReadback({version:5,items:seed},4,seed),false);
 assert.equal(sync.isVerifiedRoadmapReadback({version:5,items:[]},5,seed),false);
 assert.equal(sync.isVerifiedRoadmapReadback({error:"offline"},5,seed),false);
 assert.equal(sync.isVerifiedRoadmapReadback(null,5,seed),false);
});

test("Live save reads back after PUT; manual reload snapshots unsynced draft first",()=>{
 const board=readFileSync("src/features/admin/components/roadmap-board.tsx","utf8");
 const putAt=board.indexOf('method:"PUT"');
 const verifyAt=board.indexOf('isVerifiedRoadmapReadback(body,nextVersion,sent)');
 const cleanAt=board.indexOf("setDirty(changedMeanwhile)",verifyAt);
 assert.ok(putAt>=0&&verifyAt>putAt&&cleanAt>verifyAt);
 assert.ok(board.includes('checkpoint("Trước khi tải lại Supabase",latestItems.current)'));
 assert.ok(board.includes("Đã lưu và đọc lại thành công từ Supabase."));
 assert.ok(board.includes("không tự gửi lại bản ghi"));
});
