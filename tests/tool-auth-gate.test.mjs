import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(path,"utf8");
test("middleware gates actual Word, slide, Student, Admin URLs",()=>{
 const middleware=read("src/middleware.ts");
 for(const p of ['"/cong-cu/mo-phong-word/:path*"','"/cong-cu/trinh-chieu/:lessonId"','"/student/:path*"','"/admin/:path*"'])assert.ok(middleware.includes(p),p);
 assert.ok(!middleware.includes('"/cong-cu/trinh-chieu/:path*"'));
 assert.match(middleware,/auth\.getUser\(\)/);
 assert.match(middleware,/select\("role"\)/);
 assert.match(middleware,/path\.startsWith\("\/admin"\)/);
});
test("SSR direct tool access independently checks Auth and role",()=>{
 const helper=read("src/lib/supabase/require-tool-access.ts");
 for(const file of ["src/app/(word-simulator)/cong-cu/mo-phong-word/page.tsx","src/app/(presentation)/cong-cu/trinh-chieu/[lessonId]/page.tsx"]){
  assert.match(read(file),/requireToolAccess\(/);
  assert.match(read(file),/force-dynamic/);
 }
 assert.match(helper,/auth\.getUser\(\)/);
 assert.match(helper,/select\("role"\)/);
 assert.match(helper,/redirect\("\/dang-nhap\?next="/);
 assert.match(helper,/redirect\("\/khong-co-quyen"\)/);
 assert.match(read("src/app/student/layout.tsx"),/select\("role"\)/);
 assert.match(read("src/app/admin/layout.tsx"),/profile\?\.role !== "admin"/);
 for(const p of ["src/app/api/quiz/[slug]/route.ts","src/app/api/quiz/[slug]/submit/route.ts"])
  assert.match(read(p),/auth\.getUser\(\)/);
});
