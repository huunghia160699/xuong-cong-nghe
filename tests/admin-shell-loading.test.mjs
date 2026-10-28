import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(path, "utf8");
const shell = read("src/components/app-shell.tsx");
const loading = read("src/app/admin/loading.tsx");
const adminCss = read("src/app/admin/admin.css");

test("Admin has route-level loading fallback with accessible skeleton", () => {
  assert.match(loading, /export default function AdminLoading/);
  assert.match(loading, /role="status"/);
  assert.match(loading, /aria-live="polite"/);
  assert.match(loading, /Đang tải nội dung quản trị/);
  assert.match(loading, /motion-safe:animate-pulse/);
  assert.match(adminCss, /\.xcn-admin-loading-progress/);
  assert.match(adminCss, /@media\(prefers-reduced-motion:reduce\)\{\.xcn-admin-loading-progress span\{/);
});

test("Admin navigation shows a pending indicator without affecting student menu", () => {
  assert.match(shell, /import Link, \{ useLinkStatus \} from "next\/link"/);
  assert.match(shell, /function AdminNavigationPending\(\)/);
  assert.match(shell, /const \{ pending \} = useLinkStatus\(\)/);
  assert.match(shell, /isAdmin && <AdminNavigationPending \/>/);
  assert.match(shell, /motion-reduce:animate-none/);
  assert.match(shell, /isAdmin \? adminNav : studentNav/);
});

test("Admin sidebar is compact and Live label is explicitly a mode, not connectivity test", () => {
  assert.match(shell, /isAdmin \? "mt-5 px-2 tracking-\[\.13em\]" : "mt-9 tracking-\[\.2em\]"/);
  assert.match(shell, /isAdmin && "mt-2 space-y-0\.5"/);
  assert.match(shell, /isAdmin && "gap-2\.5 px-2\.5 py-1\.5 text-\[13px\]"/);
  assert.match(shell, /"Supabase · Live"/);
  assert.match(shell, /"Chế độ Demo"/);
  assert.match(shell, /{isAdmin \? \(/);
  assert.match(shell, /{live && <form action={signOutAction}>/);
  assert.match(shell, /<div className="mt-auto rounded-xl border border-zinc-200 bg-paper p-4">/);
});
