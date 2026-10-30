import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runStagingAcceptance,STAGING_PROJECT_REF} from "../scripts/verify-roadmap-staging.mjs";
import {PRODUCTION_PROJECT_REF} from "../scripts/verify-roadmap-rls.mjs";

const source=readFileSync("scripts/verify-roadmap-staging.mjs","utf8");
const env=()=>({
 RLS_SUPABASE_URL:"https://"+PRODUCTION_PROJECT_REF+".supabase.co",
 RLS_SUPABASE_PUBLISHABLE_KEY:"sb_publishable_demo",
 RLS_ADMIN_EMAIL:"admin@example.test",RLS_ADMIN_PASSWORD:"test-only-password",
 RLS_STUDENT_EMAIL:"student@example.test",RLS_STUDENT_PASSWORD:"test-only-password",
 RLS_TEST_PROJECT_REF:PRODUCTION_PROJECT_REF,
 RLS_TEST_ISOLATED:"YES",RLS_WRITE_ACK:"I_UNDERSTAND",
 RLS_STAGING_PURPOSE:"ACCEPTANCE_ONLY"
});

test("staging scenario refuses production project before network, even if all flags opt in",async()=>{
 let calls=0;
 await assert.rejects(runStagingAcceptance({env:env(),makeClient:()=>{
  calls++;throw Error("network must never be attempted");},logger:()=>{}}),/production/);
 assert.equal(calls,0);
});

test("staging scenario refuses an alias, a mismatched ref and missing explicit scope",async()=>{
 const e={...env(),RLS_TEST_PROJECT_REF:"s".repeat(20)};
 await assert.rejects(runStagingAcceptance({env:e}),/production|RLS_TEST_PROJECT_REF/);
 const otherProject={...e,RLS_SUPABASE_URL:"https://"+"s".repeat(20)+".supabase.co"};
 await assert.rejects(runStagingAcceptance({env:otherProject}),
  /Sai project staging/);
 const staging={...e,RLS_SUPABASE_URL:"https://"+STAGING_PROJECT_REF+".supabase.co",
  RLS_TEST_PROJECT_REF:STAGING_PROJECT_REF};
 await assert.rejects(runStagingAcceptance({env:{...staging,RLS_STAGING_PURPOSE:""}}),
  /RLS_STAGING_PURPOSE/);
});

test("acceptance implementation must preserve snapshots and use version-filtered writes",()=>{
 assert.match(source,/runRlsCheck\(\{env,buildClient:makeClient,write:true/);
 assert.match(source,/readRlsConfig\(env,true\)/);
 assert.match(source,/mkdtempSync\(join\(tmpdir\(\)/);
 assert.match(source,/mode:0o600,flag:"wx"/);
 assert.match(source,/\.eq\("id",ROADMAP_ID\)\.eq\("version",version\)/);
 assert.match(source,/const stale=await admin\.from\("admin_roadmap"\)/);
 assert.match(source,/await save\(added\.items,"Khôi phục checkpoint đã sao lưu"\)/);
 assert.match(source,/await save\(initial\.items,"Dọn sạch dữ liệu thử về snapshot ban đầu"\)/);
 assert.match(source,/Không dọn được staging/);
 assert.match(source,/admin_roadmap_events/);
 assert.ok(!source.includes('from("admin_roadmap").delete('));
});
