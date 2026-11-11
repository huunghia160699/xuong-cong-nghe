import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const page=fs.readFileSync(path.join(root,'src/app/(public)/page.tsx'),'utf8');
const css=fs.readFileSync(path.join(root,'src/app/(public)/home-workshop.css'),'utf8');
const layout=fs.readFileSync(path.join(root,'src/app/(public)/layout.tsx'),'utf8');

test('public homepage: community-first hero and four accessible real role destinations',()=>{
 assert.match(page,/<main className="xcn-workshop"/);
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 assert.match(page,/id="ws-home-title"/);
 assert.match(page,/Nơi học tập trở thành/);
 assert.match(page,/Học đến đâu, làm được đến đó/);
 for(const role of ['Giáo viên','Phụ huynh','Học viên','Nhà trường'])assert.ok(page.includes('name:"'+role+'"'),role);
 assert.match(page,/className="ws-path-grid"/);
 assert.match(page,/aria-label=\{`\$\{role\.name\}/);
 for(const href of ['/gioi-thieu','/lien-he','/khoa-hoc'])assert.ok(page.includes('href:"'+href+'"'),href);
});

test('public homepage: photography collage, five winding learning stories and rounded CTA',()=>{
 assert.equal((page.match(/src:"https:\/\/images\.unsplash\.com\/photo-/g)||[]).length,9);
 assert.match(page,/ws-photo-mosaic/);
 assert.match(page,/ws-journey-trail/);
 assert.equal((page.match(/ws-journey-row ws-row-/g)||[]).length,5);
 for(const subject of ['ws-art-chat','ws-art-lessons','ws-art-quiz','ws-art-steps','ws-art-teacher'])assert.ok(page.includes(subject),subject);
 assert.match(page,/ws-discover-inner/);
 assert.match(page,/ws-photo-finale/);
 assert.match(page,/ws-value-grid/);
 assert.doesNotMatch(page,/ClassDojo|Dojo Islands|45 triệu/);
});

test('public homepage: product links are real; no development notices or fictitious social proof',()=>{
 for(const href of ['/cong-cu','/khoa-hoc','/cong-cu/mo-phong-word','/cong-cu/trinh-chieu','/dang-nhap?next=%2Fstudent%2Fquiz'])assert.ok(page.includes(href),href);
 for(const category of ['Học tập','Soạn thảo','Bài giảng','Đánh giá','Thư viện','Giảng dạy','Kỹ năng số','Tương tác'])assert.ok(page.includes('area:"'+category+'"'),category);
 assert.equal((page.match(/area:"/g)||[]).length,8);
 assert.doesNotMatch(page,/Đã có nền tảng|Có thể sử dụng|Cần đăng nhập|Đang phát triển|Trong lộ trình|đang được cập nhật|đang được xây dựng/);
 assert.doesNotMatch(page,/href:null|href="#"/);
 assert.doesNotMatch(page,/đánh giá 5 sao|triệu người dùng|\btestimonials\b/i);
});

test('public homepage: role shell, live courses and scoped responsive presentation preserved',()=>{
 assert.match(page,/getPublishedCourses/);
 assert.match(page,/isLiveMode\(\)\?await getPublishedCourses\(\):courses/);
 assert.match(layout,/import "\.\/home-workshop.css"/);
 assert.match(layout,/<PublicHeader\/>/);
 assert.match(layout,/<Footer\/>/);
 assert.match(css,/\.xcn-workshop/);
 assert.match(css,/\.ws-mosaic-photo/);
 assert.match(css,/\.ws-journey-trail/);
 assert.match(css,/@media\(max-width:850px\)/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(css,/linear-gradient\(|radial-gradient\(|scroll-snap/);
});