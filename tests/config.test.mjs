import test from "node:test";
import assert from "node:assert/strict";
import { safeNextPath, isLiveMode, getSupabasePublicConfig } from "../src/lib/supabase/config.ts";

test("safe redirect paths remain inside the application", () => {
  assert.equal(safeNextPath("/student/quiz"), "/student/quiz");
  assert.equal(safeNextPath("//evil.example"), "/student");
  assert.equal(safeNextPath("https://evil.example"), "/student");
  assert.equal(safeNextPath("/api/quiz"), "/student");
  assert.equal(safeNextPath("/student\\evil"), "/student");
  assert.equal(safeNextPath(null), "/student");
});

test("demo mode is explicit default and live mode refuses missing keys", () => {
  const previousMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  const previousVercel = process.env.VERCEL;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  try {
    delete process.env.VERCEL;
    delete process.env.NEXT_PUBLIC_USE_MOCK_DATA;
    assert.equal(isLiveMode(), false);
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = "true";
    process.env.VERCEL = "1";
    assert.equal(isLiveMode(), true, "Vercel cannot enable Demo bypass");
    delete process.env.VERCEL;
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = "false";
    assert.equal(isLiveMode(), true);
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    assert.throws(() => getSupabasePublicConfig(), /Thiếu NEXT_PUBLIC_SUPABASE_URL/);
  } finally {
    if(previousVercel===undefined) delete process.env.VERCEL; else process.env.VERCEL=previousVercel;
    if(previousMode===undefined) delete process.env.NEXT_PUBLIC_USE_MOCK_DATA; else process.env.NEXT_PUBLIC_USE_MOCK_DATA=previousMode;
    if(url===undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL=url;
    if(key===undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=key;
  }
});
