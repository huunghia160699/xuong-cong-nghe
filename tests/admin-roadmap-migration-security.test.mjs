import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const sql=readFileSync("supabase/migrations/20261026163500_admin_roadmap.sql","utf8");
const api=readFileSync("src/app/api/admin/roadmap/route.ts","utf8");
const layout=readFileSync("src/app/admin/layout.tsx","utf8");
const doc=readFileSync("docs/ADMIN_ROADMAP_MIGRATION_SECURITY_REVIEW.md","utf8");
const normalized=sql.replace(/--[^\n]*/g,"").replace(/\s+/g," ").trim().toLowerCase();
const policy=(name)=>{
  const parts=sql.split('create policy "'+name+'"');
  assert.equal(parts.length,2,"Missing or duplicate policy: "+name);
  return parts[1].split(";")[0].replace(/\s+/g," ").toLowerCase();
};

test("migration is reviewed and cannot conceal an unexpected preexisting schema",()=>{
 assert.match(normalized,/create table public\.admin_roadmap\s*\(/);
 assert.doesNotMatch(normalized,/create table if not exists/);
 assert.match(normalized,/id text primary key/);
 assert.match(normalized,/items jsonb not null default '\[\]'::jsonb/);
 assert.match(normalized,/version integer not null default 1/);
 assert.match(normalized,/updated_by uuid references auth\.users\(id\) on delete set null/);
 assert.match(normalized,/updated_at timestamptz not null default now\(\)/);
 assert.match(normalized,/constraint admin_roadmap_single_document check \(id = 'global-master-roadmap'\)/);
 assert.match(normalized,/constraint admin_roadmap_positive_version check \(version > 0\)/);
 assert.match(normalized,/constraint admin_roadmap_items_array check \(jsonb_typeof\(items\) = 'array'\)/);
 assert.match(normalized,/constraint admin_roadmap_payload_limit check \(pg_column_size\(items\) < 600000\)/);
 assert.match(api,/const KEY="global-master-roadmap"/);
});

test("public table RLS is enabled before any narrow grant",()=>{
 const rls=normalized.indexOf("alter table public.admin_roadmap enable row level security");
 const revoke=normalized.indexOf("revoke all privileges on table public.admin_roadmap");
 const grant=normalized.indexOf("grant select, insert, update on table public.admin_roadmap to authenticated");
 assert.ok(rls>0&&revoke>rls&&grant>revoke);
 assert.match(normalized,/revoke all privileges on table public\.admin_roadmap from public, anon, authenticated/);
 assert.doesNotMatch(normalized,/grant .* to anon/);
 assert.doesNotMatch(normalized,/grant .*delete/);
 assert.doesNotMatch(normalized,/create policy .* for delete/);
 assert.doesNotMatch(normalized,/security definer/);
 assert.doesNotMatch(normalized,/create function/);
 assert.doesNotMatch(normalized,/(?:grant|revoke)\s+execute/);
 assert.doesNotMatch(normalized,/(?:alter|drop)\s+function\s+(?:public\.)?is_admin/);
 assert.doesNotMatch(normalized,/alter table public\.profiles/);
});

test("all RLS policies require authenticated plus trusted database role",()=>{
 const read=policy("Only admins read product roadmap");
 const insert=policy("Only admins create product roadmap");
 const update=policy("Only admins update product roadmap");
 for(const [command,policySql] of [["select",read],["insert",insert],["update",update]]){
   assert.match(policySql,new RegExp("for "+command+" to authenticated"));
   assert.match(policySql,/id = 'global-master-roadmap'/);
   assert.match(policySql,/from public\.profiles p/);
   assert.match(policySql,/p\.id = \(select auth\.uid\(\)\)/);
   assert.match(policySql,/p\.role = 'admin'/);
   assert.doesNotMatch(policySql,/user_metadata|raw_user_meta_data/);
 }
 assert.match(read,/using \(/);
 assert.match(insert,/with check \(/);
 assert.match(update,/using \(/);
 assert.match(update,/with check \(/);
 assert.match(insert,/updated_by = \(select auth\.uid\(\)\)/);
 assert.match(update,/updated_by = \(select auth\.uid\(\)\)/);
});

test("client and server maintain independent authorization and concurrency protections",()=>{
 assert.match(api,/supabase\.auth\.getUser\(\)/);
 assert.match(api,/profile\?\.role!=="admin"/);
 assert.match(api,/\.eq\("id",KEY\)\.eq\("version",version\)/);
 assert.match(api,/return fail\("Dữ liệu đã thay đổi ở phiên khác/);
 assert.match(api,/updated_by:a\.user!\.id/);
 assert.match(layout,/profile\?\.role !== "admin"/);
 assert.doesNotMatch(api,/service[_-]?role|secret[_-]?key/i);
});

test("release review explicitly gates production SQL and real JWT verification",()=>{
 assert.match(doc,/CHƯA ÁP MIGRATION LÊN PRODUCTION/);
 assert.match(doc,/Admin Auth JWT/);
 assert.match(doc,/Student Auth JWT/);
 assert.match(doc,/SELECT, INSERT, UPDATE/);
 assert.match(doc,/Security Advisor/);
 assert.match(doc,/17 RLS policy/);
 assert.match(doc,/11 bảng/);
 assert.match(doc,/public_execute=true/);
 assert.match(doc,/không có JWT/);
 assert.match(doc,/ACTIVE_HEALTHY/);
});
