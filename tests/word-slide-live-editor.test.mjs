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

test("Word 01 headings stay on one line and shrink to fit rather than wrapping",()=>{
  const component=readFileSync("src/features/presentations/components/word-lesson-slide.tsx","utf8");
  const styles=readFileSync("src/features/presentations/word-lesson-slide.css","utf8");
  assert.match(component,/function SingleLineTitle/);
  assert.match(component,/ResizeObserver\(fit\)/);
  assert.match(component,/heading\.scrollWidth>available/);
  assert.match(component,/requestAnimationFrame\(fit\)/);
  assert.match(component,/document\.fonts\?\.ready\.then\(fit\)/);
  assert.match(component,/<SingleLineTitle text=\{slide\.title\}/);
  assert.match(styles,/\.w01-fitted-title h1,\.w01-fitted-title h2\{[^}]*white-space:nowrap/s);
  assert.match(styles,/\.w01-cover-copy h1 span\{display:inline\}/);
  assert.match(styles,/overflow-x:auto/);
});
test("Word 01 uses natural flow so vertical steps do not inflate or overlap headings",()=>{
 const component=readFileSync("src/features/presentations/components/word-lesson-slide.tsx","utf8");
 const styles=readFileSync("src/features/presentations/word-lesson-slide.css","utf8");
 assert.match(styles,/\.w01-slide-inner\{display:block;width:100%/);
 assert.match(styles,/\.w01-main\{display:block;width:100%/);
 assert.match(styles,/\.w01-process\{display:grid;min-height:0;height:auto;grid-auto-rows:auto/);
 assert.match(styles,/\.w01-process-list\{width:min\(100%,1040px\);max-width:1040px/);
 assert.match(styles,/\.w01-process-list \.w01-step\{display:grid;grid-template-columns:52px minmax\(0,1fr\)/);
 assert.match(styles,/\.w01-step\{display:flex;flex-direction:column;align-items:stretch;/);
 assert.match(styles,/\.w01-step-text\{min-width:0;align-self:start\}/);
 assert.doesNotMatch(styles,/grid-auto-rows:minmax\(min-content,1fr\)/);
 assert.doesNotMatch(styles,/flex:1 0 auto;min-height:auto;justify-content:safe center/);
 assert.match(component,/<ArrowRight className="w01-step-link" size=\{42\}/);
 assert.match(component,/<ArrowDown className="w01-step-link-down" size=\{40\}/);
 assert.match(styles,/\.w01-process-list \.w01-step-link-down\{display:block\}/);
});

test("Word 01 has no in-slide progress strip or redundant Word launch on any slide", () => {
  const component = readFileSync("src/features/presentations/components/word-lesson-slide.tsx", "utf8");
  const styles = readFileSync("src/features/presentations/word-lesson-slide.css", "utf8");
  for (const unwanted of ["w01-bottom", "w01-progress", "w01-open-word", "OpenWord"]) {
    assert.ok(!component.includes(unwanted), "in-slide Word 01 component: " + unwanted);
    assert.ok(!styles.includes(unwanted), "unused styles: " + unwanted);
  }
  assert.match(component, /<WordCover slide=\{slide\} onAdvance=\{onAdvance\}\/>/);
  assert.match(component, /w01-start/);
  assert.match(player, /xcn-word-lab-trigger/);
  assert.match(player, /<iframe ref=\{wordFrameRef\} src="\/cong-cu\/mo-phong-word"/);
  assert.match(player, /if \(wordLesson\) return <WordLessonSlide slide=\{slide\} index=\{index\} onAdvance=\{onAdvance\}\/>/);
});

test("Word 01 teaches three equal cards without forcing the first into a tall spanning tile",()=>{
 const component=readFileSync("src/features/presentations/components/word-lesson-slide.tsx","utf8");
 const styles=readFileSync("src/features/presentations/word-lesson-slide.css","utf8");
 assert.doesNotMatch(component,/w01-demo-mark|w01-purpose-mark/);
 assert.doesNotMatch(styles,/w01-demo-mark|w01-purpose-mark/);
 assert.match(styles,/\.w01-ideas,\.w01-ideas-editorial,\.w01-ideas-strip,\.w01-ideas-tiles\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\);[^}]*grid-auto-rows:auto/s);
 assert.match(styles,/\.w01-ideas-editorial \.w01-idea:first-child\{grid-row:auto;\s*min-height:0;justify-content:flex-start/s);
 assert.match(styles,/\.w01-idea\{display:flex;flex-direction:column;justify-content:flex-start/s);
 assert.match(styles,/@media\(max-width:900px\)/);
});
test("Word 01 two-column purpose slide fills available width without tall empty panels",()=>{
 const styles=readFileSync("src/features/presentations/word-lesson-slide.css","utf8");
 assert.match(styles,/\.w01-purpose\{display:grid;width:100%;max-width:1180px;margin:0 auto/s);
 assert.match(styles,/\.w01-purpose-half\{display:flex;flex-direction:column;justify-content:flex-start/s);
 assert.match(styles,/\.w01-purpose-half\{[^}]*min-height:0;height:auto/s);
 assert.match(styles,/\.w01-purpose-half p\{max-width:none;margin:0/s);
 assert.match(styles,/@media\(max-width:560px\)/);
});
