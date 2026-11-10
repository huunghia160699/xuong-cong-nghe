import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const page=fs.readFileSync(path.join(root,'src/app/(public)/page.tsx'),'utf8');
const layout=fs.readFileSync(path.join(root,'src/app/(public)/layout.tsx'),'utf8');
const css=fs.readFileSync(path.join(root,'src/app/(public)/home-workshop.css'),'utf8');

test('public homepage: one primary headline and accessible landmarks',()=>{
 assert.match(page, /<main className="xcn-workshop"/);
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 for(const text of ['Học đến đâu,','làm được đến đó.','aria-labelledby','ws-home-title','ws-tools-title','ws-catalog-title']){
  assert.ok(page.includes(text),`Missing content: ${text}`);
 }
});

test('public homepage: operational destinations and honest roadmap states',()=>{
 for(const href of ['/khoa-hoc','/cong-cu','/cong-cu/mo-phong-word','/cong-cu/trinh-chieu','/dang-nhap?next=%2Fstudent%2Fquiz']){
  assert.ok(page.includes(href),`Missing supported route: ${href}`);
 }
 for(const label of ['Có thể sử dụng','Cần đăng nhập','Đang phát triển','Trong lộ trình']){
  assert.ok(page.includes(label),`Missing state: ${label}`);
 }
 assert.match(page,/href:null/);
 assert.doesNotMatch(page,/href="#"/);
 assert.doesNotMatch(page,/132 ý tưởng|Tri thức mới|Gamification giúp/);
});

test('public homepage: keeps live course pipeline and existing global shell',()=>{
 assert.match(page,/getPublishedCourses/);
 assert.match(page,/isLiveMode\(\)\?await getPublishedCourses\(\):courses/);
 assert.match(layout,/import "\.\/home-workshop.css";/);
 assert.doesNotMatch(layout,/home-universe.css|home-condensed.css/);
 assert.match(layout,/<PublicHeader\/>/);
 assert.match(layout,/<Footer\/>/);
});

test('public homepage: scoped and responsive; no decorative gradients',()=>{
 assert.match(css,/\.xcn-workshop/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/@media\(max-width:850px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(css,/linear-gradient|radial-gradient|scroll-snap/);
});