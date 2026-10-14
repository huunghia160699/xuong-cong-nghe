import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {PRESENTATION_LAYOUTS} from "../src/features/presentations/types.ts";
import {wordBasicsLessons} from "../src/features/presentations/data/word-basics.ts";
import {WORD_VISUAL_GUIDE_COUNT} from "../src/features/presentations/data/word-visual-guides.ts";
import {excelBasicsLessons} from "../src/features/presentations/data/excel-basics.ts";
import {fileExplorerLesson} from "../src/features/presentations/data/file-explorer.ts";
import {layoutGallery} from "../src/features/presentations/data/layout-gallery.ts";

const subjects=[["Word",wordBasicsLessons,4],["Excel",excelBasicsLessons,5]];
test("Word and Excel are separate subjects with full multi-topic curricula",()=>{
  assert.equal(wordBasicsLessons.length,4);
  assert.equal(excelBasicsLessons.length,5);
  assert.ok(wordBasicsLessons.reduce((n,m)=>n+m.slides.length,0)>=70);
  assert.ok(excelBasicsLessons.reduce((n,m)=>n+m.slides.length,0)>=85);
  assert.ok(wordBasicsLessons.every(m=>m.id.startsWith("word-")));
  assert.ok(excelBasicsLessons.every(m=>m.id.startsWith("excel-")));
});
test("every new topic has a strong classroom narrative, activities and explanations",()=>{
  for(const [subject,lessons] of subjects)for(const lesson of lessons){
    assert.ok(lesson.slides.length>=12,`${subject}:${lesson.id}`);
    assert.deepEqual(lesson.phases.map(p=>p.label),["Mở đầu","Thân bài","Kết luận"]);
    assert.deepEqual(lesson.phases.map(p=>p.start),[0,1,lesson.slides.length-1]);
    assert.equal(lesson.slides[0].layout,"cover");
    assert.equal(lesson.slides.at(-1).layout,"summary");
    assert.ok(lesson.slides.some(slide=>slide.eyebrow==="THỰC HÀNH"));
    const quizzes=lesson.slides.filter(slide=>slide.layout==="quiz");
    assert.ok(quizzes.length>=2);
    for(const slide of lesson.slides){
      assert.ok(PRESENTATION_LAYOUTS.includes(slide.layout),slide.id);
      assert.ok(slide.notes&&slide.notes.length>=20,slide.id+" missing notes");
      assert.ok(slide.blocks.length>=1&&slide.blocks.length<=7,slide.id);
      if(slide.layout==="quiz"){
        const quiz=slide.blocks[0];
        assert.equal(quiz.answers.length,4,slide.id);
        assert.ok(Number.isInteger(quiz.correctIndex)&&quiz.correctIndex>=0&&quiz.correctIndex<=3,slide.id);
        assert.ok(quiz.explanation.length>=20,slide.id);
      }
      if(slide.blocks.some(block=>block.type==="steps"))
        assert.ok(slide.blocks.find(block=>block.type==="steps").items.length<=7,slide.id);
    }
  }
});
test("no duplicate IDs and original File Explorer and gallery stay intact",()=>{
  const all=[fileExplorerLesson,layoutGallery,...wordBasicsLessons,...excelBasicsLessons];
  assert.equal(new Set(all.map(l=>l.id)).size,all.length);
  for(const lesson of all)assert.equal(new Set(lesson.slides.map(s=>s.id)).size,lesson.slides.length);
  assert.equal(fileExplorerLesson.slides.length,29);
  assert.equal(layoutGallery.slides.length,15);
});
test("catalog and slide routes are data driven and library visibly separates subjects",()=>{
  const catalog=readFileSync("src/features/presentations/catalog.ts","utf8");
  const library=readFileSync("src/app/(public)/cong-cu/trinh-chieu/page.tsx","utf8");
  const route=readFileSync("src/app/(presentation)/cong-cu/trinh-chieu/[lessonId]/page.tsx","utf8");
  assert.match(catalog,/id:"word-co-ban"/);
  assert.match(catalog,/id:"excel-co-ban"/);
  assert.match(catalog,/lessons:wordBasicsLessons/);
  assert.match(catalog,/lessons:excelBasicsLessons/);
  assert.match(library,/groups\.map/);
  assert.match(library,/course\.title/);
  assert.match(route,/allPresentationLessons\.map/);
  assert.match(route,/permanentRedirect/);
});
test("spreadsheet lessons include real formulas and locale separator guidance",()=>{
  const text=excelBasicsLessons.flatMap(m=>m.slides.map(s=>JSON.stringify(s))).join("\n");
  for(const name of ["SUM","AVERAGE","COUNTIF","SUMIF","IF","MIN","MAX"])
    assert.match(text,new RegExp(name+"\\("),name);
  assert.match(text,/dấu phẩy|dấu ;|dấu ,/i);
  assert.match(text,/101000/);
});

test("Word now includes 49 detailed UI mock walkthroughs while Excel remains unchanged",()=>{
  assert.equal(WORD_VISUAL_GUIDE_COUNT,49);
  const demos=wordBasicsLessons.flatMap(m=>m.slides.filter(slide=>slide.blocks.some(block=>block.type==="wordWorkspace")));
  assert.equal(demos.length,49);
  assert.equal(wordBasicsLessons.reduce((n,m)=>n+m.slides.length,0),124);
  assert.equal(excelBasicsLessons.reduce((n,m)=>n+m.slides.length,0),96);
  for(const slide of demos){
    assert.match(slide.eyebrow,/MÔ PHỎNG/);
    const block=slide.blocks[0];
    assert.ok(["editing","open","save","font","paragraph","styles","lists","layout","break","section","header","pageNumber","table","image","wrap","toc","review","print","export"].includes(block.scene),slide.id);
    assert.ok(block.steps.length>=3,slide.id);
    assert.ok(block.steps.every(step=>step.title.length>8&&step.detail.length>=25&&step.tab&&step.command),slide.id);
    assert.ok(block.tip?.length>=30,slide.id);
  }
});
test("Word UI mocks are interactive and responsive with high-contrast brand colors",()=>{
  const jsx=readFileSync("src/features/presentations/components/word-workspace.tsx","utf8");
  const css=readFileSync("src/features/presentations/word-workspace.css","utf8");
  const renderer=readFileSync("src/features/presentations/components/blocks.tsx","utf8");
  const route=readFileSync("src/app/(presentation)/cong-cu/trinh-chieu/[lessonId]/page.tsx","utf8");
  assert.match(jsx,/data-word-workspace/);
  assert.match(jsx,/aria-live="polite"/);
  assert.match(jsx,/role="tablist"/);
  assert.match(jsx,/onClick=\{\(\)=>go\(index\+1\)\}/);
  assert.match(css,/@media\(max-width:767px\)/);
  assert.match(css,/#005bfd/i);
  assert.match(css,/xcn-word-paper/);
  assert.match(renderer,/case "wordWorkspace"/);
  assert.match(route,/word-workspace.css/);
});

test("only Word first lesson cover mirrors the public homepage Hero and advances",()=>{
  const first=wordBasicsLessons[0].slides[0];
  assert.equal(first.id,"cover");
  assert.equal(first.layout,"cover");
  assert.equal(first.blocks.length,1);
  assert.equal(first.blocks[0].type,"wordHomeHero");
  assert.equal(first.blocks[0].goals.length,3);
  for(const lesson of wordBasicsLessons.slice(1))assert.equal(lesson.slides[0].blocks[0].type,"heroStats");
  for(const lesson of excelBasicsLessons)assert.equal(lesson.slides[0].blocks[0].type,"heroStats");
  assert.equal(wordBasicsLessons.reduce((n,m)=>n+m.slides.length,0),124);
  const hero=readFileSync("src/features/presentations/components/word-home-hero.tsx","utf8");
  const player=readFileSync("src/features/presentations/components/player.tsx","utf8");
  assert.match(hero,/grid-paper/);
  assert.match(hero,/bg-ink text-white/);
  assert.match(hero,/text-cyan/);
  assert.match(hero,/lg:grid-cols-\\[1\\.12fr_\\.88fr\\]/);
  assert.match(hero,/rotate-\\[-4deg\\]/);
  assert.match(hero,/rotate-\\[3deg\\]/);
  assert.match(hero,/onClick=\\{onStart\\}/);
  assert.match(player,/onAdvance=\\{\\(\\) => move\\(current \\+ 1\\)\\}/);
});
