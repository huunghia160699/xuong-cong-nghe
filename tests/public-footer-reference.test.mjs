import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const footer=readFileSync("src/components/footer.tsx","utf8");
const css=readFileSync("src/app/(public)/public.css","utf8");

test("public footer uses a brand column and four genuine link groups",()=>{
 for(const heading of ["Về Xưởng","Học & thực hành","Khám phá","Kết nối"])
  assert.ok(footer.includes('title:"'+heading+'"'),heading);
 assert.match(footer,/className="xcn-public-footer-brand"/);
 assert.match(footer,/className="xcn-public-footer-links"/);
 assert.match(footer,/aria-label="Liên kết cuối trang"/);
 assert.match(footer,/aria-label="Ngôn ngữ hiển thị: Tiếng Việt"/);
 assert.equal((footer.match(/\{title:"/g)||[]).length,4);
 assert.equal((footer.match(/\{label:"[^"]+",href:"/g)||[]).length,16);
});

test("footer links and shortcut badges only use real public and product routes",()=>{
 for(const route of ["/gioi-thieu","/tin-tuc","/bang-gia","/lien-he","/khoa-hoc",
  "/cong-cu","/cong-cu/mo-phong-word","/cong-cu/trinh-chieu",
  "/dang-nhap?next=%2Fstudent%2Fquiz","/dang-nhap","/#du-an"])
  assert.ok(footer.includes('"'+route+'"'),"Missing route: "+route);
 assert.doesNotMatch(footer,/href="#"|app-store|google-play|facebook\.com|instagram\.com/i);
 assert.match(footer,/aria-label="Truy cập nhanh"/);
 assert.match(footer,/aria-label="Công cụ nổi bật"/);
 assert.equal((footer.match(/className="xcn-public-footer-app"/g)||[]).length,2);
 assert.match(footer,/new Date\(\)\.getFullYear/);
});

test("footer keeps compact editorial grid and mobile responsive columns",()=>{
 assert.match(css,/\.xcn-public-footer-inner\s*\{[^}]*grid-template-columns:minmax\(245px,1\.04fr\) minmax\(0,2fr\)/);
 assert.match(css,/\.xcn-public-footer-links\s*\{[^}]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
 assert.match(css,/@media\(max-width:1100px\)/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/\.xcn-public-footer-links\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(css,/\.xcn-public-footer-bottom\s*\{[^}]*grid-template-columns:auto minmax\(0,1fr\) auto/);
 assert.match(css,/@media\(max-width:440px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(css,/\.xcn-public-footer\{[^}]*linear-gradient/);
});

test("footer has accessible navigation and text without fake social proof",()=>{
 assert.match(footer,/<footer className="xcn-public-footer"/);
 assert.match(footer,/<nav className="xcn-public-footer-links"/);
 assert.match(footer,/<nav className="xcn-public-footer-quicklinks"/);
 assert.match(footer,/<nav className="xcn-public-footer-apps"/);
 for(const text of ["Khóa học","Word Lab","Trình chiếu","Tiếng Việt"])
  assert.ok(footer.includes(text),text);
 assert.doesNotMatch(footer,/Đang phát triển|Trong lộ trình|Sắp ra mắt|45 triệu/);
});
