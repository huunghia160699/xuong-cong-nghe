import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(path,"utf8");

test("D2 registry and filterable Product Atlas",()=>{
 const registry=read("src/config/public-catalog.ts");
 const atlas=read("src/components/public-atlas.tsx");
 const home=read("src/app/(public)/page.tsx");
 assert.match(registry,/CatalogStatus = "available" \| "building" \| "planned"/);
 for(const id of ["lab-manager","teacher","quiz","word"])assert.ok(registry.includes('id:"'+id+'"'));
 for(const needle of ["useState","aria-pressed","aria-live","item.status==="+'"'+"available"+'"'+"&&useHref","encodeURIComponent(item.actionHref)"])assert.ok(atlas.includes(needle),needle);
 assert.match(home,/id="he-sinh-thai"/);
 for(const title of ["home-title","atlas-title","architecture-title","roles-title","showcase-title","method-title","price-preview-title","news-preview-title","final-title"])assert.ok(home.includes(title));
 assert.doesNotMatch(home,/7 ngày|Đăng ký miễn phí|Luyện miễn phí/);
});
test("D3 About has seven meaningful sections and catalog-linked roadmap",()=>{
 const about=read("src/app/(public)/gioi-thieu/page.tsx");
 for(const section of ["xcn-marketing-page-hero","mission-title","about-architecture-title","audience-title","principles-title","roadmap-title","about-cta"])assert.ok(about.includes(section));
 assert.match(about,/PUBLIC_CATALOG\.filter/);
 assert.match(about,/canonical:"\/gioi-thieu"/);
 assert.doesNotMatch(about,/PublicPendingPage/);
});
test("D4 Pricing is informational, accessible and without fake checkout",()=>{
 const pricing=read("src/app/(public)/bang-gia/page.tsx");
 for(const section of ["pricing-title","plan-title","compare-title","policy-title","faq-title","pricing-cta"])assert.ok(pricing.includes(section));
 assert.match(pricing,/Chưa mở thanh toán/);
 assert.match(pricing,/Đang xác định/);
 assert.match(pricing,/role="region" tabIndex=\{0\}/);
 assert.match(pricing,/<details key=\{faq.q\}>/);
 assert.match(pricing,/\/lien-he\?topic=pricing/);
 assert.doesNotMatch(pricing,/PublicPendingPage|thanh toán ngay|phổ biến nhất/i);
});
test("D2–D4 public CSS responsive and no gradients",()=>{
 const style=read("src/app/(public)/public.css");
 for(const text of [".xcn-public .xcn-atlas-grid","@media(max-width:540px)","@media(prefers-reduced-motion:reduce)"])assert.ok(style.includes(text));
 assert.doesNotMatch(style,/(?:linear|radial|conic)-gradient\s*\(/i);
});
