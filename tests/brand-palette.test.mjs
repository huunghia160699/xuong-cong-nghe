import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("approved palette is defined in Tailwind", () => {
  const source = read("tailwind.config.ts");
  assert.match(source, /ink:\s*"#04122D"/);
  assert.match(source, /blue:\s*"#005BFD"/);
  assert.match(source, /cyan:\s*"#00E9FD"/);
  assert.match(source, /paper:\s*"#F0F6FD"/);
  assert.doesNotMatch(source, /lime:|#c8f13b/i);
});

test("primary button is legible and home keeps natural scrolling", () => {
  const button = read("src/components/ui/button.tsx");
  const home = read("src/app/(public)/page.tsx");
  const css = read("src/app/globals.css");
  assert.match(button, /bg-blue text-white/);
  assert.match(home, /bg-blue text-white/);
  assert.match(home, /text-cyan/);
  assert.doesNotMatch(home, /lime|xcn-home-snap|HomeSectionSnap/);
  assert.doesNotMatch(css, /scroll-snap-type|#c8f13b/i);
});

test("change tracking is part of the permanent development rules", () => {
  const log = read("docs/WORKLOG_AND_RULES.md");
  const agent = read("AGENTS.md");
  const archive = read("docs/archive/WORKLOG_HISTORY_TO_2026-10-30.md");
  assert.match(log, /Ghi tới đâu lưu tới đó/);
  assert.match(log, /2026-10-30/);
  assert.match(archive, /Nhật ký sau mỗi nhiệm vụ/);
  assert.match(archive, /2026-10-14/);
  assert.match(agent, /docs\/WORKLOG_AND_RULES\.md/);
});
