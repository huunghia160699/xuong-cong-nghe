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
 for(const label of ["Trang chủ","Hệ sinh thái","Giới thiệu","Bảng giá","Tin tức","Liên hệ"]){
  assert.ok(config.includes('label: "'+label+'"'),"navbar label missing: "+label);
 }
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

test("D2-D6 marketing pages render meaningful content and do not fabricate contact or articles",()=>{
 for(const path of ["tin-tuc","lien-he","gioi-thieu","bang-gia"]){
  const page=read("src/app/(public)/"+path+"/page.tsx");
  assert.doesNotMatch(page,/PublicPendingPage/);
  assert.match(page,/export const metadata/);
 }
 const articleData=read("src/config/public-articles.ts");
 const contactData=read("src/config/public-contact.ts");
 assert.match(articleData,/EDITORIAL_ARTICLES:readonly PublicArticle\[\]=\[\]/);
 assert.match(contactData,/VERIFIED_CONTACT_CHANNELS:readonly ContactChannel\[\]=\[\]/);
 assert.doesNotMatch(read("src/app/(public)/lien-he/page.tsx"),/<form\b|onSubmit|payment|checkout/i);
 const footer=read("src/components/footer.tsx");
 assert.doesNotMatch(footer,/href="#"/);
 assert.match(footer,/new Date\(\)\.getFullYear/);
});
