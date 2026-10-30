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
 assert.ok(active.length<=20,"Too many active docs: "+active.length);
 for(const name of ["FOUNDATION_ORIGINALS_BEFORE_2026-10-30.md",
  "PHASE_00_SECURITY_AND_SYNC_REPORTS_2026-10.md","WORKLOG_HISTORY_TO_2026-10-30.md"]){
  const path="docs/archive/"+name;
  assert.ok(existsSync(path),"Missing archive "+path);
  assert.ok(read(path).length>10_000,"History not fully preserved: "+path);
 }
 assert.ok(read("docs/WORKLOG_AND_RULES.md").length<12_000);
});
