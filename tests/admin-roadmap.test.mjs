import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(path,"utf8");
const board=read("src/features/admin/components/roadmap-board.tsx");
const api=read("src/app/api/admin/roadmap/route.ts");
const page=read("src/app/admin/page.tsx");
const layout=read("src/app/admin/layout.tsx");
const sitemap=read("src/features/admin/admin-sitemap.ts");
const sitemapPage=read("src/app/admin/sitemap/page.tsx");
const migration=read("supabase/migrations/20261026163500_admin_roadmap.sql");
const css=read("src/app/admin/admin.css");
const checklist=read("docs/XCN_FUNCTION_ROADMAP_CHECKLIST.md");
const diagram=read("docs/XCN_SITEMAP_2026_2028.md");

test("Roadmap contains detailed ICT-first milestones and computable checklists",async()=>{
 const {ROADMAP_INITIAL,ROADMAP_PHASES,roadmapProgress,roadmapTotals,roadmapAsMarkdown}
  =await import("../src/features/admin/roadmap-data.ts");
 assert.equal(ROADMAP_INITIAL.length,20);
 assert.ok(ROADMAP_PHASES.length>=7);
 assert.equal(new Set(ROADMAP_INITIAL.map(x=>x.id)).size,ROADMAP_INITIAL.length);
 const count=roadmapTotals(ROADMAP_INITIAL);
 assert.ok(count.subtasks>=100,"at least 100 granular subtasks");
 assert.ok(count.checked<count.subtasks,"planned work cannot appear completed");
 assert.ok(ROADMAP_INITIAL.find(x=>x.id==="admin-center"));
 assert.ok(ROADMAP_INITIAL.find(x=>x.id==="word-lab"));
 assert.ok(ROADMAP_INITIAL.find(x=>x.id==="python-practice"));
 assert.ok(ROADMAP_INITIAL.find(x=>x.id==="sql-practice"));
 assert.equal(roadmapProgress({checklist:[]}),0);
 const md=roadmapAsMarkdown(ROADMAP_INITIAL);
 assert.match(md,/# Xưởng Công Nghệ/);
 assert.match(md,/- \[x\]/);
 assert.match(md,/- \[ \]/);
 assert.match(md,/Đã sửa/);
});

test("Roadmap has dotted vertical timeline, interactive editor and change log",()=>{
 assert.match(css,/border-left:3px dotted/);
 assert.match(css,/\.xcn-roadmap-dot\{/);
 for(const label of ["xcn-roadmap-node","xcn-roadmap-checklist","xcn-roadmap-note-editor","xcn-roadmap-modal","xcn-roadmap-search"]){
  if(label==="xcn-roadmap-modal")assert.match(board,/className="xcn-admin-modal"/);
  else assert.ok(board.includes(label));
 }
 for(const name of ["Thêm việc lớn","Thêm việc nhỏ","Lưu ghi chú","Đã sửa","Đã thêm","Xuất Markdown","Sao lưu JSON","Nhập JSON","Lưu thay đổi"]){
  assert.ok(board.includes(name),"missing "+name);
 }
 assert.match(board,/localStorage\.setItem\(ROADMAP_STORAGE_KEY/);
 assert.match(board,/fetch\("\/api\/admin\/roadmap"/);
 assert.match(board,/shouldOfferRecovery/);
 assert.match(board,/Khôi phục bản nháp/);
 assert.match(board,/Người phụ trách/);
 assert.match(board,/Hạn dự kiến/);
 assert.match(board,/Sửa ghi chú/);
 assert.match(board,/aria-expanded=\{open\}/);
 assert.match(board,/onChange=\{e=>update\(item.id/);
 assert.match(css,/@media\(max-width:700px\)/);
});

test("Admin-only API version checks and RLS protect persistent roadmap",()=>{
 assert.match(api,/profile\?\.role!=="admin"/);
 assert.match(api,/\.eq\("version",version\)/);
 assert.match(api,/return fail\("Dữ liệu đã thay đổi ở phiên khác/);
 assert.match(api,/Cache-Control":"no-store"/);
 assert.match(migration,/enable row level security/);
 assert.match(migration,/revoke all on table public\.admin_roadmap from public,anon,authenticated/);
 assert.match(migration,/p\.role='admin'/);
 assert.doesNotMatch(api,/service_role|SERVICE_ROLE/);
 assert.doesNotMatch(migration,/for delete to authenticated/);
});

test("Admin and sitemap show only working links and label future routes",()=>{
 assert.match(page,/<AdminOverview live=\{false\}/);
 assert.match(layout,/profile\?\.role !== "admin"/);
 assert.match(sitemapPage,/link\.state==="available"\?<Link/);
 assert.match(sitemap,/state:"planned"/);
 assert.match(sitemap,/state:"available"/);
 assert.match(diagram,/```mermaid/);
 assert.match(diagram,/Word Lab/);
 assert.match(checklist,/Python Practice/);
 assert.match(checklist,/Trung tâm quản trị/);
});
