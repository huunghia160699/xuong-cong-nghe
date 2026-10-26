import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {ADMIN_WORKSPACES,ADMIN_ROLE_MATRIX,filterProfiles,profilesToCsv} from "../src/features/admin/admin-controls.ts";
import {DEFAULT_ADMIN_CONFIG,validateAdminConfig,validateAuditLog} from "../src/features/admin/admin-local.ts";

const read=path=>readFileSync(path,"utf8");
const menu=read("src/config/navigation.ts");
const sitemap=read("src/features/admin/admin-sitemap.ts");
const overview=read("src/features/admin/components/admin-overview.tsx");
const layout=read("src/app/admin/layout.tsx");
const auth=read("src/app/api/admin/roadmap/route.ts");
const settings=read("src/features/admin/components/admin-settings.tsx");
const audit=read("src/features/admin/components/admin-audit.tsx");
const users=read("src/features/admin/components/admin-users.tsx");
const css=read("src/app/admin/admin.css");
const stats=read("src/features/admin/admin-stats.ts");
const pages=[
 "/admin/nguoi-dung","/admin/phan-quyen","/admin/cau-hinh",
 "/admin/nhat-ky","/admin/he-thong","/admin/bao-cao"
];

test("all admin modules are accessible via sidebar, sitemap and dashboard",()=>{
 for(const route of pages){
  const path="src/app"+route+"/page.tsx";
  assert.ok(read(path).length>90,route+" route missing");
  assert.ok(menu.includes('href: "'+route+'"'),route+" not in sidebar");
  assert.ok(sitemap.includes('href:"'+route+'",state:"available"'),route+" sitemap is not ready");
  assert.ok(overview.includes('href:"'+route+'"'),route+" not on dashboard");
  assert.ok(ADMIN_WORKSPACES.some(w=>w.href===route),route+" not in registry");
 }
 assert.match(layout,/profile\?\.role !== "admin"/);
 assert.match(auth,/profile\?\.role!=="admin"/);
});
test("Role matrix explicitly blocks role elevation via the frontend",()=>{
 const change=ADMIN_ROLE_MATRIX.find(x=>x.feature.includes("Cấp hoặc đổi vai trò"));
 assert.ok(change);
 assert.equal(change.admin,false);
 assert.equal(change.student,false);
 assert.equal(change.guest,false);
 assert.doesNotMatch(read("src/app/admin/phan-quyen/page.tsx"),/update\(\{role|supabase\.auth\.admin/);
});
test("profile filtering works with locale, role and zero data",()=>{
 const rows=[
  {id:"uuid-a",display_name:"Nguyễn An",role:"student",created_at:"2026-10-27"},
  {id:"uuid-b",display_name:"Hà Phúc",role:"teacher",created_at:"2026-10-27"},
  {id:"uuid-c",display_name:"An",role:"admin",created_at:"2026-10-27"}
 ];
 assert.equal(filterProfiles(rows,"Nguyễn","all").length,1);
 assert.equal(filterProfiles(rows,"","student").length,1);
 assert.equal(filterProfiles(rows,"an","all").length,2);
 assert.equal(filterProfiles(rows,"none","all").length,0);
 assert.equal(filterProfiles([],"","all").length,0);
});
test("CSV export neutralizes spreadsheet formulas and quoted newlines",()=>{
 const rows=[{id:"x",display_name:"=HYPERLINK(\"danger\")",role:"student",created_at:"2026-10-27"},
  {id:"y",display_name:"John\nDoe",role:"student",created_at:"2026-10-27"}];
 const csv=profilesToCsv(rows);
 assert.ok(csv.startsWith("\uFEFF"));
 assert.match(csv,/'=HYPERLINK/);
 assert.match(csv,/John Doe/);
 assert.doesNotMatch(csv,/John\nDoe/);
});
test("local draft configuration is strictly validated; no published settings",()=>{
 assert.equal(validateAdminConfig(DEFAULT_ADMIN_CONFIG),true);
 assert.equal(validateAdminConfig({...DEFAULT_ADMIN_CONFIG,siteName:""}),false);
 assert.equal(validateAdminConfig({...DEFAULT_ADMIN_CONFIG,supportEmail:"not-an-email"}),false);
 assert.equal(validateAdminConfig({...DEFAULT_ADMIN_CONFIG,announcement:"x".repeat(241)}),false);
 assert.equal(validateAdminConfig({...DEFAULT_ADMIN_CONFIG,highlightTools:"true"}),false);
 assert.match(settings,/localStorage\.setItem\(ADMIN_CONFIG_KEY/);
 assert.match(settings,/validateAdminConfig\(config\)/);
 assert.match(settings,/Đã lưu bản nháp trên thiết bị/);
 assert.doesNotMatch(settings,/Xuất bản website<\/button>/);
});
test("audit log has strict caps, honest scope and working controls",()=>{
 const valid=[{id:"x",at:"2026-10-27T10:00:00Z",kind:"settings",message:"Changed draft"}];
 assert.equal(validateAuditLog(valid),true);
 assert.equal(validateAuditLog(Array(121).fill(valid[0])),false);
 assert.equal(validateAuditLog([{...valid[0],kind:"admin_promotion"}]),false);
 assert.match(audit,/readLocalEvents\(\)/);
 assert.match(audit,/localStorage\.removeItem\(ADMIN_AUDIT_KEY/);
 assert.match(audit,/Không phải audit log bất biến/);
 assert.match(read("src/features/admin/components/roadmap-board.tsx"),/recordLocalAdminEvent\("roadmap"/);
});
test("reports are server-computed and Demo does not produce fake numbers",()=>{
 assert.match(stats,/if\(!isLiveMode\(\)\)return \{values:\{\},error:false,live:false\}/);
 assert.match(stats,/createSupabaseServerClient\(\)/);
 assert.match(stats,/Promise\.all/);
 assert.match(read("src/app/admin/bao-cao/page.tsx"),/Không đưa ra số liệu giả/);
 assert.match(users,/!live\?"Cần kết nối Admin Live/);
 assert.doesNotMatch(users,/service_role|SUPABASE_SECRET/);
});
test("control pages have keyboard, mobile, and overflow-safe styles",()=>{
 assert.match(css,/\.xcn-admin-table-wrap\{[^}]*overflow-x:auto/s);
 assert.match(css,/\.xcn-admin-duo\{[^}]*grid-template-columns:1fr 1fr/s);
 assert.match(css,/@media\(max-width:900px\)/);
 assert.match(css,/\.xcn-admin-notice\.is-error/);
});
