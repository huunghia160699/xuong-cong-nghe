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
  assert.match(player, /<iframe ref=\{wordFrameRef\} src="\/cong-cu\/mo-phong-word"/);
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

test("Word 01 editorial renderer shows every step immediately, without extra Word screenshots",()=>{
  const component=readFileSync("src/features/presentations/components/word-lesson-slide.tsx","utf8");
  const styles=readFileSync("src/features/presentations/word-lesson-slide.css","utf8");
  assert.ok(player.includes("if (wordLesson) return <WordLessonSlide"));
  assert.ok(player.includes("wordLesson={wordLesson}"));
  assert.ok(page.includes("word-lesson-slide.css"));
  assert.ok(component.includes("data-word-lesson-slide={slide.id}"));
  assert.ok(component.includes("asSteps(block.steps)"));
  assert.ok(component.includes("items.map((item,i)=><li"));
  assert.ok(!component.includes("setIndex("));
  assert.ok(!/<img|<video|<iframe/.test(component));
  assert.ok(component.includes('data-native-quiz="true"'));
  for (const name of ["w01-purpose","w01-process-path","w01-process-list","w01-process-stair",
    "w01-ideas-editorial","w01-shortcut-grid","w01-sample-layout","w01-quiz-options"])
    assert.ok(styles.includes(name),name);
  assert.ok(styles.includes("prefers-reduced-motion"));
  assert.ok(styles.includes("@media(max-width:560px)"));
});
