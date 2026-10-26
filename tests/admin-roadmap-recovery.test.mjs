import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import {TextEncoder} from "node:util";
import ts from "typescript";
import * as data from "../src/features/admin/roadmap-data.ts";

function load(path,dependencies){
 const source=readFileSync("src/features/admin/"+path+".ts","utf8");
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};
 runInNewContext(js,{module,exports:module.exports,require:(name)=>{
  if(name==="./roadmap-data")return data;
  if(name==="./roadmap-validation")return dependencies;
  throw Error("unrecognized dependency "+name);
 },TextEncoder,Date,JSON,Number,Object,Array,Set,String,Error},{timeout:3000});
 return module.exports;
}
const validation=load("roadmap-validation",{});
const draft=load("roadmap-draft",validation);
const seed=data.ROADMAP_INITIAL;
const clone=value=>JSON.parse(JSON.stringify(value));

test("shared validation accepts all initial milestone records",()=>{
 assert.equal(validation.validateRoadmap(seed),true);
 assert.equal(validation.validateRoadmap([]),true);
 assert.equal(validation.validateRoadmap({items:seed}),false);
 assert.ok(validation.roadmapBytes(seed)<validation.ROADMAP_MAX_BYTES);
});
test("reject malformed imports and duplicate ids at every depth",()=>{
 const badCases=[
  [...seed,...seed],Array.from({length:201},(_,i)=>({...seed[0],id:"x"+i})),
  [{...seed[0],phase:"unknown"}],
  [{...seed[0],status:"admin"}],
  [{...seed[0],checklist:[seed[0].checklist[0],seed[0].checklist[0]]}],
  [{...seed[0],entries:[{id:"e",kind:"hacked",text:"x",date:"2026-10-26"}]}],
  [{...seed[0],owner:"a".repeat(101)}],
  [{...seed[0],targetDate:"2026-99-99"}]
 ];
 for(const attempt of badCases)assert.equal(validation.validateRoadmap(attempt),false);
});
test("draft migration from v2 and v3 is lossless",()=>{
 const legacy=draft.decodeDraft(seed);
 assert.equal(legacy.format,3);
 assert.equal(legacy.baseVersion,0);
 assert.equal(legacy.pending,true);
 const versioned=draft.buildDraft(clone(seed),8,true);
 const recovered=draft.decodeDraft(JSON.parse(JSON.stringify(versioned)));
 assert.equal(recovered.baseVersion,8);
 assert.equal(recovered.pending,true);
 assert.deepEqual(JSON.stringify(recovered.items),JSON.stringify(seed));
 assert.equal(draft.decodeDraft({format:99,items:seed}),null);
 assert.equal(draft.decodeDraft({format:3,items:[{bad:true}],baseVersion:0,pending:true,savedAt:""}),null);
});
test("local recovery avoids overwriting server data silently",()=>{
 const versioned=draft.buildDraft(clone(seed),8,true);
 assert.equal(draft.shouldOfferRecovery(versioned,seed,8),false);
 assert.equal(draft.shouldOfferRecovery(versioned,seed,9),true);
 const changed=clone(seed);changed[0].summary="Edited on another machine";
 assert.equal(draft.shouldOfferRecovery(versioned,changed,8),true);
 assert.equal(draft.shouldOfferRecovery({...versioned,pending:false},changed,8),false);
});
test("real UTF-8 byte limit rejects oversized payloads",()=>{
 const small=clone(seed);
 assert.equal(validation.validateRoadmap(small),true);
 const extended=clone(seed);
 for(let i=0;i<200;i++)extended.push({...seed[0],id:"additional-"+i});
 assert.equal(validation.validateRoadmap(extended),false);
 assert.ok(validation.roadmapBytes("🙂")>JSON.stringify("🙂").length);
});
