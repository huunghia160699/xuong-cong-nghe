import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {readAuthQaConfig,AUTH_STAGING_REF} from "../scripts/verify-auth-staging.mjs";
const env=()=>({
 RLS_SUPABASE_URL:"https://"+AUTH_STAGING_REF+".supabase.co",
 RLS_SUPABASE_PUBLISHABLE_KEY:"sb_publishable_fakeonly",
 RLS_TEST_PROJECT_REF:AUTH_STAGING_REF,
 RLS_ADMIN_EMAIL:"admin@example.test",RLS_ADMIN_PASSWORD:"never-real",
 RLS_STUDENT_EMAIL:"student@example.test",RLS_STUDENT_PASSWORD:"never-real",
 RLS_TEACHER_EMAIL:"teacher@example.test",RLS_TEACHER_PASSWORD:"never-real",
 AUTH_QA_PREVIEW_URL:"https://xuong-cong-nghe-mj279n7c3-huunghia160699-5603.vercel.app"
});
test("auth QA enforces staging and rejects production + other Preview domains",()=>{
 const valid=readAuthQaConfig(env());
 assert.equal(valid.hasTeacher,true);
 assert.equal(valid.preview,env().AUTH_QA_PREVIEW_URL);
 for(const bad of [
  {RLS_TEST_PROJECT_REF:"bpxwpfmjoojrgqlfkqgz"},
  {RLS_SUPABASE_URL:"https://bpxwpfmjoojrgqlfkqgz.supabase.co"},
  {AUTH_QA_PREVIEW_URL:"https://xuong-cong-nghe.vercel.app"},
  {AUTH_QA_PREVIEW_URL:"https://example.com"},
  {AUTH_QA_PREVIEW_URL:"http://xuong-cong-nghe-mj279n7c3-huunghia160699-5603.vercel.app"},
 ]){
  assert.throws(()=>readAuthQaConfig({...env(),...bad}));
 }
});
test("auth QA cannot silently consider missing Teacher a full pass",()=>{
 const e=env();delete e.RLS_TEACHER_EMAIL;delete e.RLS_TEACHER_PASSWORD;
 assert.throws(()=>readAuthQaConfig(e),/Teacher QA/);
 const partial=readAuthQaConfig({...e,AUTH_QA_ALLOW_PARTIAL:"YES"});
 assert.equal(partial.hasTeacher,false);
 assert.throws(()=>readAuthQaConfig({...env(),RLS_TEACHER_EMAIL:env().RLS_STUDENT_EMAIL}),/tài khoản riêng/);
});
test("live role QA reads only and never logs user identifiers or credentials",()=>{
 const s=readFileSync("scripts/verify-auth-staging.mjs","utf8");
 assert.match(s,/createServerClient/);
 assert.match(s,/auth\.signInWithPassword/);
 assert.match(s,/auth\.getUser/);
 assert.match(s,/redirect:"manual"/);
 assert.match(s,/Cache-Control|cache:"no-store"/);
 assert.match(s,/\/api\/admin\/roadmap/);
 assert.match(s,/\/api\/quiz\/nonexistent/);
 assert.doesNotMatch(s,/\.from\([^)]*\)\s*\.(?:insert|update|delete)\(|method:"POST"|method:"PUT"|method:"DELETE"/);
});
