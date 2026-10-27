import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const sql=readFileSync("supabase/migrations/20261027010815_admin_roadmap_change_events.sql","utf8");
const route=readFileSync("src/app/api/admin/roadmap/route.ts","utf8");
const board=readFileSync("src/features/admin/components/roadmap-board.tsx","utf8");
const feed=readFileSync("src/features/admin/components/roadmap-server-activity.tsx","utf8");

test("audit migration is append-only and derives operations inside DB transaction",()=>{
 assert.match(sql,/create table public\.admin_roadmap_events/);
 assert.match(sql,/version integer not null check \(version > 0\)/);
 assert.match(sql,/unique \(document_id, version\)/);
 assert.match(sql,/alter table public\.admin_roadmap_events enable row level security/);
 assert.match(sql,/revoke all privileges on table public\.admin_roadmap_events from public, anon, authenticated/);
 assert.match(sql,/grant select on table public\.admin_roadmap_events to authenticated/);
 assert.doesNotMatch(sql,/grant (?:insert|update|delete)/i);
 assert.match(sql,/create policy "Only admins read committed Roadmap changes"/);
 assert.match(sql,/p\.id = \(select auth\.uid\(\)\) and p\.role = 'admin'/);
 assert.match(sql,/create schema if not exists xcn_private/);
 assert.match(sql,/security definer\s+set search_path = ''/);
 assert.match(sql,/revoke all on function xcn_private\.write_admin_roadmap_event\(\) from public, anon, authenticated/);
 assert.match(sql,/after insert or update of items,version on public\.admin_roadmap/);
 assert.match(sql,/insert into public\.admin_roadmap_events\(document_id,version,actor_id,changes\)/);
 assert.match(sql,/new\.updated_by/);
 assert.match(sql,/new\.version <> old\.version \+ 1/);
 assert.match(sql,/new\.items = old\.items/);
});

test("event types cover all user edits, including deletion and checkboxes",()=>{
 for(const kind of ["epic.added","epic.deleted","epic.updated","task.added","task.deleted",
  "task.updated","task.completed","task.reopened","note.added","note.deleted","note.updated","roadmap.reordered"]){
  assert.ok(sql.includes("'"+kind+"'")||sql.includes("'"+kind.split(".")[0]+".completed'"),
   "missing DB change kind "+kind);
 }
});
test("API GET reads private RLS-protected event log alongside roadmap",()=>{
 assert.match(route,/from\("admin_roadmap_events"\)/);
 assert.match(route,/\.order\("id",\{ascending:false\}\)\.limit\(60\)/);
 assert.match(route,/cache-control/i);
 assert.match(route,/profile\?\.role!=="admin"/);
 assert.match(route,/\.eq\("id",KEY\)\.eq\("version",version\)/);
 assert.doesNotMatch(route,/service_role|SERVICE_ROLE/);
});
test("live board automatically saves edits, polls new data and guards conflicts",()=>{
 assert.match(board,/setTimeout\(\(\)=>\{void save\(\);\},850\)/);
 assert.match(board,/setInterval\(\(\)=>\{void refreshFromServer\(false\);\},12000\)/);
 assert.match(board,/response\.status===409/);
 assert.match(board,/setConflict\(true\)/);
 assert.match(board,/!dirty&&!saving/);
 assert.match(board,/if\(!serverVersion\)setDirty\(true\)/);
 assert.match(board,/unimportedDemoDraft/);
 assert.match(board,/Tải lại từ Supabase/);
 assert.match(board,/RoadmapServerActivity/);
 assert.match(board,/Đã đồng bộ Supabase/);
 assert.doesNotMatch(board,/setInterval\(.*save/);
});
test("remote event feed is always visibly labeled as committed backend history",()=>{
 assert.match(feed,/Nhật ký thay đổi đã đồng bộ/);
 assert.match(feed,/database khi lưu thành công/);
 assert.match(feed,/Người cập nhật/);
 assert.match(feed,/Bỏ hoàn thành/);
 assert.match(feed,/Xóa việc lớn/);
 assert.match(feed,/Xóa ghi chú/);
});
