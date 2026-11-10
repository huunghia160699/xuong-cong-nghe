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

test("homepage uses scoped editorial public styles and distinguishes available from planned features", () => {
  const button=read("src/components/ui/button.tsx");
  const home=read("src/app/(public)/page.tsx");
  const css=read("src/app/(public)/home-workshop.css");
  const layout=read("src/app/(public)/layout.tsx");
  assert.match(button,/bg-blue text-white/);
  assert.match(home,/className="xcn-workshop"/);
  assert.match(home,/Học đến đâu,/);
  for(const label of ["Có thể sử dụng","Cần đăng nhập","Đang phát triển","Trong lộ trình"])assert.ok(home.includes(label),label);
  assert.match(home,/href:null/);
  assert.match(layout,/home-workshop\.css/);
  assert.doesNotMatch(layout,/home-universe\.css|home-condensed\.css/);
  assert.match(css,/\.xcn-workshop/);
  assert.match(css,/@media\(max-width:600px\)/);
  assert.doesNotMatch(css,/linear-gradient\(|radial-gradient\(|#c8f13b/i);
  assert.doesNotMatch(home,/132 ứng dụng đang hoạt động|xcn-u-playground/);
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
