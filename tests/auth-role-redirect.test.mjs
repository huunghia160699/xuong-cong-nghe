import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { safeNextPath } from "../src/lib/supabase/config.ts";

const read = path => readFileSync(path, "utf8");
const source = read("src/features/auth/post-login.ts");
const compiled = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022
}}).outputText;
const module = { exports: {} };
runInNewContext(compiled, {
  module, exports: module.exports,
  require(name) {
    assert.equal(name, "@/lib/supabase/config");
    return { safeNextPath };
  }
});
const { postLoginDestination } = module.exports;

test("verified Admin signs in to Admin by default, Student to student", () => {
  assert.equal(postLoginDestination("admin", null), "/admin");
  assert.equal(postLoginDestination("admin", ""), "/admin");
  assert.equal(postLoginDestination("student", undefined), "/student");
  assert.equal(postLoginDestination("teacher", null), "/student");
});

test("explicit safe internal destinations override role defaults", () => {
  assert.equal(postLoginDestination("admin", "/student/quiz"), "/student/quiz");
  assert.equal(postLoginDestination("student", "/student/quiz"), "/student/quiz");
  assert.equal(postLoginDestination("admin", "/admin/roadmap"), "/admin/roadmap");
  assert.equal(postLoginDestination("admin", "/doi-mat-khau"), "/doi-mat-khau");
  assert.equal(postLoginDestination("admin", "//evil.example"), "/admin");
  assert.equal(postLoginDestination("student", "https://evil.example"), "/student");
});

test("missing or unexpected profile never silently gains Admin or Student access", () => {
  for (const role of [null, undefined, "", "superadmin", "owner", {}, ""]) {
    assert.equal(postLoginDestination(role, "/admin"), null);
    assert.equal(postLoginDestination(role, null), null);
  }
});

test("sign-in form does not inject student next and action checks real profile", () => {
  const form = read("src/app/dang-nhap/page.tsx");
  const actions = read("src/features/auth/actions.ts");
  assert.ok(form.includes('name="next" value={safeNextPath(params.next, "")}'));
  assert.ok(actions.includes('safeNextPath(formData.get("next"), "")'));
  assert.ok(actions.includes('supabase.auth.getUser()'));
  assert.ok(actions.includes('supabase.from("profiles")'));
  assert.ok(actions.includes("postLoginDestination(profile?.role, next)"));
  assert.ok(actions.includes('redirect(loginError("profile", next))'));
  assert.ok(actions.includes('redirect(destination)'));
  assert.ok(!actions.includes('const next = safeNextPath(formData.get("next"));'));
});

test("callback resolves role only for absent next and preserves password reset", () => {
  const callback = read("src/app/auth/callback/route.ts");
  const explicit = callback.indexOf("if (next) return NextResponse.redirect(new URL(next, base));");
  const role = callback.indexOf('supabase.from("profiles")');
  assert.ok(explicit > 0 && role > explicit);
  assert.ok(callback.includes("postLoginDestination(profile?.role, null)"));
  assert.ok(callback.includes('error=profile'));
  const actions = read("src/features/auth/actions.ts");
  assert.ok(actions.includes('/auth/callback?next=/doi-mat-khau'));
  assert.ok(actions.includes('/auth/callback?next=/student'));
  assert.ok(actions.includes('postLoginDestination(profile?.role, null)'));
});
