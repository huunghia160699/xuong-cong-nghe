import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const core=[
 "AGENTS.md","README.md",
 "docs/INDEX.md","docs/WORKLOG_AND_RULES.md",
 "docs/PRODUCT_AND_MODULES.md","docs/ARCHITECTURE_AND_SECURITY.md",
 "docs/UI_DESIGN_SYSTEM.md","docs/WEBSITE_REFERENCES.md",
 "docs/ROADMAP.md","docs/PUBLIC_WEBSITE_DESIGN_SPEC.md","docs/SYSTEM_AUDIT_2026-10-30.md"
];
const read=p=>readFileSync(p,"utf8");
test("Documentation entrypoint maps work to modules without reading all source files",()=>{
 const index=read("docs/INDEX.md");
 const instructions=read("AGENTS.md");
 for(const name of ["src/features/admin","src/features/learning","src/features/word-simulator",
  "PRODUCT_AND_MODULES.md","ARCHITECTURE_AND_SECURITY.md","UI_DESIGN_SYSTEM.md","WEBSITE_REFERENCES.md"])
  assert.ok(index.includes(name),name+" missing module map");
 assert.ok(instructions.includes("docs/INDEX.md"));
 assert.ok(instructions.includes("Không đọc lại toàn bộ"));
 assert.ok(index.includes("Không tạo thêm file"));
});

test("All canonical Markdown and root entrypoint links resolve within repository",()=>{
 for(const file of core){
  assert.ok(existsSync(file),"Missing "+file);
  const content=read(file);
  const links=[...content.matchAll(/\[[^\]\n]+\]\(([^)]+)\)/g)].map(m=>m[1].split("#")[0]);
  for(const link of links){
   if(!link||/^(https?:|mailto:|#)/.test(link))continue;
   const target=resolve(dirname(file),decodeURI(link));
   assert.ok(existsSync(target),file+" contains broken local Markdown link to "+link);
  }
 }
});

test("Legacy reports are preserved in history but the active documentation stays lean",()=>{
 const dir=readdirSync("docs",{withFileTypes:true});
 const active=dir.filter(x=>x.isFile()&&x.name.endsWith(".md")).map(x=>x.name);
 // Reference reviews and domain-specific standards are intentionally kept as standalone sources.
 // Only the entrypoint/operational set is subject to the lean-doc count.
 const reviews=active.filter(name=>name.endsWith("_DEEP_REVIEW.md"));
 const moduleStandards=active.filter(name=>/^(WORD_|SLIDE_|PRESENTATION_|PPT_)/.test(name));
 const operational=active.filter(name=>!reviews.includes(name)&&!moduleStandards.includes(name));
 assert.ok(operational.length<=20,"Too many operational docs: "+operational.length);
 for(const name of ["DUA_EDU_DEEP_REVIEW.md","DETHISO_DEEP_REVIEW.md",
   "MONTINHOC_DEEP_REVIEW.md","TINHOCBAN_DEEP_REVIEW.md"])
  assert.ok(reviews.includes(name),"Missing reference report "+name);
 for(const name of ["FOUNDATION_ORIGINALS_BEFORE_2026-10-30.md",
  "PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md","WORKLOG_HISTORY_TO_2026-10-30.md"]){
  const path="docs/archive/"+name;
  assert.ok(existsSync(path),"Missing archive "+path);
  assert.ok(read(path).length>10_000,"History not fully preserved: "+path);
 }
 // Retain current checkpoint history; archive it as the active log approaches 18k.
 assert.ok(read("docs/WORKLOG_AND_RULES.md").length<18_000);
});

test("Five-source roadmap preserves the complete parked backlog without marking features done",()=>{
 const roadmap=read("docs/ROADMAP.md");
 const references=read("docs/WEBSITE_REFERENCES.md");
 const expected={VN:21,DT:34,DU:22,MT:27,TC:28};
 const ids=[...roadmap.matchAll(/^\| `((?:VN|DT|DU|MT|TC)-\d{2})` \|/gm)].map(x=>x[1]);
 assert.equal(ids.length,132,"Complete feature idea inventory must be preserved");
 assert.equal(new Set(ids).size,132,"Feature idea IDs must be unique");
 for(const [prefix,count] of Object.entries(expected)){
  assert.equal(ids.filter(id=>id.startsWith(prefix+"-")).length,count,prefix+" report coverage");
 }
 assert.match(roadmap,/BACKLOG \/ NOT STARTED/);
 assert.match(roadmap,/không tick Admin Roadmap/);
 assert.match(references,/REF-07.*Tin học cơ bản/);
});
