import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(p,"utf8");
const brand=read("src/components/brand.tsx");
const header=read("src/components/public-header.tsx");
const nav=read("src/components/public-navigation.tsx");
const css=read("src/app/(public)/public.css");
const globalCss=read("src/app/globals.css");
const routes=read("src/config/navigation.ts");

test("Brand remains a single unbroken line in the public header",()=>{
 assert.match(brand,/whitespace-nowrap/);
 assert.match(brand,/xcn-brand-name/);
 assert.match(brand,/shrink-0/);
 assert.match(brand,/Xưởng Công Nghệ/);
 assert.match(globalCss,/\.xcn-brand-name\s*\{[^}]*white-space:\s*nowrap;/s);
 assert.match(header,/xcn-public-header-inner/);
});

test("Desktop nav is a single row, with a responsive disclosure menu",()=>{
 assert.match(globalCss,/\.xcn-header-inner\s*\{[^}]*flex-wrap:\s*nowrap;/s);
 assert.match(css,/\.xcn-public-desktop-nav\s*\{[^}]*display:\s*flex;/s);
 assert.match(css,/@media\(max-width:1180px\)/);
 assert.match(css,/\.xcn-public-desktop-nav\{display:none\}/);
 assert.match(nav,/aria-controls=\{ecosystemId\}/);
 assert.match(nav,/aria-expanded=\{ecosystemOpen\}/);
 assert.match(nav,/onClick=\{\(\)=>setEcosystemOpen/);
});

test("Mobile retains navigation, auth CTA and Escape accessibility",()=>{
 assert.match(css,/\.xcn-public-mobile-panel/);
 assert.match(css,/@media\(max-width:440px\)/);
 assert.match(nav,/aria-label=\{menuOpen\?/);
 assert.match(nav,/publicNav\.filter/);
 assert.match(nav,/href=\{accountHref\}/);
 assert.match(nav,/event\.key==="Escape"/);
 assert.match(routes,/export const publicNav = \[/);
});
