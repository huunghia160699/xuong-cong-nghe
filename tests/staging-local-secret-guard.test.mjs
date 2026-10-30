import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const text=p=>readFileSync(p,"utf8");

test("Local staging QA secrets are ignored by Git and only the empty example is checked in",()=>{
 const ignore=text(".gitignore");
 assert.match(ignore,/^\.env\.\*\.local$/m);
 assert.match(ignore,/^\.env\.staging\.qa\.local$/m);
 const example=text(".env.staging.qa.example");
 assert.match(example,/RLS_SUPABASE_URL=https:\/\/ordiksbvpewwgrnvzrud\.supabase\.co/);
 assert.match(example,/RLS_TEST_PROJECT_REF=ordiksbvpewwgrnvzrud/);
 assert.match(example,/RLS_ADMIN_PASSWORD=<staging-admin-local-password>/);
 assert.match(example,/RLS_STUDENT_PASSWORD=<staging-student-local-password>/);
 assert.doesNotMatch(example,/^RLS_SUPABASE_PUBLISHABLE_KEY=(?!<)\S+/m);
 assert.ok(example.includes("# RLS_WRITE_ACK=I_UNDERSTAND"),
  "Do not enable write acknowledgment by default");
});

test("Staging QA documentation requires an actual JWT read pass before any writes",()=>{
 const doc=text("docs/SUPABASE_SETUP.md");
 assert.match(doc,/node --env-file=\.env\.staging\.qa\.local scripts\/verify-roadmap-rls\.mjs/);
 assert.match(doc,/node --env-file=\.env\.staging\.qa\.local scripts\/verify-roadmap-staging\.mjs/);
 assert.ok(doc.indexOf("verify-roadmap-rls.mjs") < doc.lastIndexOf("verify-roadmap-staging.mjs"));
 assert.ok(doc.includes("không phải đăng nhập bằng JWT thật"));
 assert.ok(doc.includes("STAGING ACCEPTANCE PASS") || doc.includes("STAGING ĐÃ TẠO") || doc.includes("STAGING VÀ HAI TÀI KHOẢN QA"),"Documentation must state the staging lifecycle status");
});
