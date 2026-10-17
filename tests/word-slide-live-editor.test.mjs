import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const player = readFileSync("src/features/presentations/components/player.tsx", "utf8");
const workspace = readFileSync("src/features/presentations/components/word-workspace.tsx", "utf8");
const blockView = readFileSync("src/features/presentations/components/blocks.tsx", "utf8");
const css = readFileSync("src/features/presentations/word-live-lab.css", "utf8");
const page = readFileSync("src/app/(presentation)/cong-cu/trinh-chieu/[lessonId]/page.tsx", "utf8");

test("Word 01 embeds the existing full editor rather than a video or external page", () => {
  assert.match(player, /lesson\.id === "word-lam-quen"/);
  assert.match(player, /<iframe src="\/cong-cu\/mo-phong-word"/);
  assert.match(player, /className=\{"xcn-word-live-lab"/);
  assert.doesNotMatch(player, /window\.open\(/);
  assert.match(page, /word-live-lab\.css/);
});
test("Word tool stays mounted between slides and keyboard nav is suspended while editing", () => {
  assert.match(player, /\{wordLesson && <section/);
  assert.match(player, /if \(wordOpen\) \{/);
  assert.match(player, /setWordOpen\(false\)/);
  assert.match(player, /tabIndex=\{wordOpen \? 0 : -1\}/);
  assert.match(player, /event\.source !== wordFrameRef\.current\?\.contentWindow/);
});
test("Guided Word walkthrough can launch the real editor on the same slide", () => {
  assert.match(blockView, /<WordWorkspace block=\{block\} onOpenWord=\{onOpenWord\}/);
  assert.match(workspace, /className="xcn-word-live-launch"/);
  assert.match(workspace, /onClick=\{onOpenWord\}/);
  assert.match(css, /\.xcn-word-live-lab-frame iframe/);
  assert.match(css, /prefers-reduced-motion/);
});

test("Word window close is intercepted only when embedded", () => {
  const bar = readFileSync("src/features/word-simulator/word-window-bar.tsx", "utf8");
  assert.match(bar, /window\.parent!==window/);
  assert.match(bar, /xcn-word-lab-close/);
  assert.match(bar, /event\.preventDefault\(\)/);
});
