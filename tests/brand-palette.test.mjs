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

test("homepage uses a restrained public palette with no gradients or auto-generated claims", () => {
  const button=read("src/components/ui/button.tsx");
  const home=read("src/app/(public)/page.tsx");
  const publicCss=read("src/app/(public)/public.css");
  const hero=read("src/components/public-home-hero.tsx");
  assert.match(button,/bg-blue text-white/); // existing app UI remains unchanged
  assert.match(publicCss,/--public-primary:#365F80/);
  assert.match(publicCss,/--xcn-page-gutter:clamp\(20px,7\.5vw,120px\)/);
  assert.match(publicCss,/\.xcn-new-button-primary,\.xcn-new-last-button\{/);
  assert.match(publicCss,/background:#2D5C61;color:white/);
  assert.match(home,/id="he-sinh-thai"/);
  assert.match(home,/id="khoa-hoc"/);
  assert.match(home,/id="du-an"/);
  assert.match(hero,/prefers-reduced-motion: reduce/);
  assert.match(hero,/window\.clearInterval\(timer\)/);
  assert.doesNotMatch(home,/xcn-home-index|\d+\s*\/\s*HỆ SINH THÁI|Learn by doing|text-cyan/);
  assert.doesNotMatch(publicCss,/linear-gradient\(|radial-gradient\(|#c8f13b/i);
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
