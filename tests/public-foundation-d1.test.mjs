import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=p=>readFileSync(p,"utf8");

test("D1 marketing navigation resolves to existing public routes, not dead links",()=>{
 const config=read("src/config/navigation.ts");
 for(const route of ["gioi-thieu","bang-gia","tin-tuc","lien-he"]){
  assert.ok(config.includes('"/'+route+'"'),"navbar route missing: "+route);
  assert.ok(existsSync("src/app/(public)/"+route+"/page.tsx"),"404 for "+route);
 }
 for(const label of ["Trang chủ","Giới thiệu","Bảng giá","Tin tức","Liên hệ"]){
  assert.ok(config.includes('label: "'+label+'"'),"navbar label missing: "+label);
 }
 assert.match(config,/export const publicEcosystemNav/);
 const header=read("src/components/public-header.tsx");
 assert.match(header,/getUser\(\)/);
 assert.match(header,/profiles/);
 assert.match(header,/Không gian của tôi/);
 const client=read("src/components/public-navigation.tsx");
 assert.match(client,/aria-expanded/);
 assert.match(client,/Escape/);
 assert.match(client,/aria-current/);
 assert.match(client,/Điều hướng trên thiết bị nhỏ/);
});

test("Scoped public theme uses the approved palette without gradient and preserves legacy Admin tokens",()=>{
 const css=read("src/app/(public)/public.css");
 for(const token of ["#223044","#365F80","#F6F8FB","#EAF1F7","#D8E1EA"])
  assert.ok(css.includes(token),"Missing D1 color "+token);
 assert.doesNotMatch(css,/(?:linear|radial|conic)-gradient\s*\(/i);
 const layout=read("src/app/(public)/layout.tsx");
 assert.match(layout,/xcn-public/);
 assert.match(layout,/Bỏ qua điều hướng/);
 assert.match(layout,/public\.css/);
 const current=read("tailwind.config.ts");
 assert.match(current,/ink: "#04122D"/);
 assert.match(current,/blue: "#005BFD"/);
});

test("Public marketing pages have content without invented billing, support or articles",()=>{
 for(const path of ["gioi-thieu","bang-gia","tin-tuc","lien-he"]){
  const page=read("src/app/(public)/"+path+"/page.tsx");
  assert.match(page,/export const metadata/);
  assert.match(page,/<main className=/);
  assert.match(page,/<h1/);
  assert.doesNotMatch(page,/PublicPendingPage|<form\b/);
 }
 const pricing=read("src/app/(public)/bang-gia/page.tsx");
 const journal=read("src/app/(public)/tin-tuc/page.tsx");
 const contact=read("src/app/(public)/lien-he/page.tsx");
 assert.match(pricing,/chưa mở thanh toán production/i);
 assert.match(journal,/Đang biên soạn/);
 assert.match(contact,/Kênh tiếp nhận chính thức/);
 const footer=read("src/components/footer.tsx");
 assert.doesNotMatch(footer,/href="#"/);
 assert.match(footer,/new Date\(\)\.getFullYear/);
});
