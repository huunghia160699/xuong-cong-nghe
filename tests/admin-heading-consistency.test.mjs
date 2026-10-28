import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(path,"utf8");
const adminSources=[
 ["Tổng quan","src/features/admin/components/admin-overview.tsx","xcn-admin-heading"],
 ["Roadmap","src/features/admin/components/roadmap-board.tsx","xcn-roadmap-heading"],
 ["Sitemap","src/app/admin/sitemap/page.tsx","xcn-admin-heading"],
 ["Người dùng","src/features/admin/components/admin-users.tsx","xcn-admin-heading"],
 ["Phân quyền","src/app/admin/phan-quyen/page.tsx","xcn-admin-heading"],
 ["Cấu hình","src/features/admin/components/admin-settings.tsx","xcn-admin-heading"],
 ["Nhật ký","src/features/admin/components/admin-audit.tsx","xcn-admin-heading"],
 ["Giám sát","src/features/admin/components/admin-monitor.tsx","xcn-admin-heading"],
 ["Báo cáo","src/app/admin/bao-cao/page.tsx","xcn-admin-heading"],
 ["Khóa học","src/app/admin/khoa-hoc/page.tsx","xcn-admin-heading"],
 ["Kho tài liệu","src/app/admin/kho-tai-lieu/page.tsx","xcn-admin-heading"],
];
const css=read("src/app/admin/admin.css");
const shell=read("src/components/app-shell.tsx");

test("All 11 Admin pages use the shared heading rhythm with no colored eyebrow or breadcrumb",()=>{
 for(const [name,path,heading] of adminSources){
  const src=read(path);
  assert.ok(src.includes('className="'+heading+'"'),name+" heading should be consistent");
  assert.match(src,/<h1(?:\s[^>]*)?>/u,name+" requires a visible h1");
  assert.ok(!src.includes("xcn-admin-kicker"),name+" must not render decorative kicker");
  assert.ok(!/ADMIN\s*\/\s*[A-ZÀ-Ỹ]/u.test(src),name+" must not show admin breadcrumb text");
 }
 const courses=read("src/app/admin/khoa-hoc/page.tsx");
 assert.equal(courses.split('className="xcn-admin-heading"').length-1,2,"Courses must match in Live and Demo");
 assert.ok(!courses.includes("Quản trị nội dung</Badge>"));
 const library=read("src/app/admin/kho-tai-lieu/page.tsx");
 assert.ok(!library.includes('href="/admin"'),"Sidebar already provides back navigation");
 assert.ok(!css.includes(".xcn-admin-kicker{"),"Remove unused colored eyebrow style");
});

test("Admin page h1, description, margins and buttons follow one responsive CSS system",()=>{
 assert.ok(css.includes(".xcn-admin-heading,.xcn-roadmap-heading{"));
 assert.ok(css.includes(".xcn-admin-heading p,.xcn-roadmap-heading p{"));
 assert.ok(css.includes(".xcn-admin h1,.xcn-roadmap h1{font-size:clamp("));
 assert.ok(!css.includes(".xcn-roadmap-heading h1{"),"Roadmap must not override heading size");
 assert.ok(css.includes(".xcn-admin-heading-actions{"));
 assert.ok(css.includes(".xcn-admin-secondary{"));
 assert.ok(css.includes(".xcn-roadmap{width:100%;min-width:0;max-width:none;margin:0}"));
});

test("Admin sidebar removes redundant area label without changing student navigation",()=>{
 assert.ok(!shell.includes("Khu vực quản trị"));
 assert.ok(shell.includes('!isAdmin && <div className="mt-9'));
 assert.ok(shell.includes("Không gian học tập"));
 assert.ok(shell.includes("xcn-admin-sidebar-nav"));
 assert.ok(!css.includes(".xcn-admin-sidebar-title{"));
 assert.ok(shell.includes("Supabase · Live"));
 assert.ok(shell.includes("Đăng xuất"));
});
