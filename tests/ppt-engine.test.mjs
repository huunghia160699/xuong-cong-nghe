import test from "node:test";
import assert from "node:assert/strict";
import {fileExplorerLesson} from "../src/features/presentations/data/file-explorer.ts";
import {layoutGallery} from "../src/features/presentations/data/layout-gallery.ts";
import {PRESENTATION_LAYOUTS} from "../src/features/presentations/types.ts";
test("29 slides and five quizzes remain unchanged",()=>{
 assert.equal(fileExplorerLesson.slides.length,29);
 assert.equal(fileExplorerLesson.slides.filter(s=>s.layout==="quiz").length,5);
 assert.equal(new Set(fileExplorerLesson.slides.map(s=>s.id)).size,29);
 assert.equal(fileExplorerLesson.slides[0].title,"Làm quen với File Explorer");
});
test("15 showcase slide layouts remain separate from lessons",()=>{
 assert.equal(layoutGallery.slides.length,15);
 assert.equal(layoutGallery.kind,"showcase");
 assert.equal(new Set(layoutGallery.slides.map(s=>s.layout)).size,15);
 assert.equal(PRESENTATION_LAYOUTS.length,15);
});
test("content only uses supported reusable blocks",()=>{
 const allowed=new Set(["lessonCover","warmUpComparison","heroStats","card","definition","fileType","filename","item","stack","notice","shortcut","keyCombo","folderTree","code","steps","explorer","fileTransfer","quiz","formula","excelTable","document","image","compare","hotspot"]);
 for(const lesson of [fileExplorerLesson,layoutGallery]) for(const slide of lesson.slides) {
  assert.ok(PRESENTATION_LAYOUTS.includes(slide.layout),slide.id);
  for(const block of slide.blocks) assert.ok(allowed.has(block.type),slide.id+":"+block.type);
 }
});
test("quiz options and correct indexes remain valid",()=>{
 for(const slide of fileExplorerLesson.slides.filter(s=>s.layout==="quiz")) {
  const quiz=slide.blocks.find(b=>b.type==="quiz");
  assert.equal(quiz.answers.length,4);
  assert.ok(quiz.correctIndex>=0&&quiz.correctIndex<4);
  assert.ok(quiz.explanation);
 }
});

test("lesson uses three explicit narrative phases",()=>{
 assert.deepEqual(fileExplorerLesson.phases.map(phase=>phase.label),["Mở đầu","Thân bài","Kết luận"]);
 assert.deepEqual(fileExplorerLesson.phases.map(phase=>phase.start),[0,4,28]);
 assert.equal(fileExplorerLesson.slides.at(-1).id,"summary");
});
test("visible slide information follows the 5±2 density guide",()=>{
 for(const slide of fileExplorerLesson.slides){
  assert.ok(slide.blocks.filter(b=>b.type!=="notice").length<=7,slide.id);
  for(const block of slide.blocks){
   if(["stack","steps","heroStats"].includes(block.type)){
    assert.ok((block.items??[]).length<=7,slide.id+":"+block.type);
   }
  }
 }
 const shortcuts=fileExplorerLesson.slides.find(slide=>slide.id==="shortcuts");
 assert.equal(shortcuts.blocks.length,6);
 assert.match(shortcuts.notes,/Ctrl \+ Z/);
 assert.match(shortcuts.notes,/Ctrl \+ S/);
});

test("opening cover explains why File Explorer matters without decorative statistics",()=>{
 const cover=fileExplorerLesson.slides[0];
 assert.equal(cover.layout,"cover");
 assert.equal(cover.blocks.length,1);
 const visual=cover.blocks[0];
 assert.equal(visual.type,"lessonCover");
 assert.equal(visual.heading,"Làm quen với File Explorer");
 assert.equal(visual.goals.length,3);
 assert.deepEqual(visual.goals.map(goal=>goal.verb),["Nhận diện","Thao tác","Tổ chức"]);
 assert.equal(Object.hasOwn(visual,"question"),false);
 assert.ok(!cover.blocks.some(block=>block.type==="heroStats"));
});
test("the 29 existing lesson slides keep their original educational subtitles in data",()=>{
 const warmUp=fileExplorerLesson.slides.find(slide=>slide.id==="warm-up");
 assert.equal(warmUp.subtitle,"Một tình huống thường gặp khi học và làm việc.");
});

test("slide 02 owns the warm-up question and before/after reveal",()=>{
  const slides=fileExplorerLesson.slides;
  assert.equal(slides[0].id,"cover");
  assert.equal(slides[1].id,"warm-up");
  assert.equal(slides[1].blocks.length,1);
  const warmup=slides[1].blocks[0];
  assert.equal(warmup.type,"warmUpComparison");
  assert.match(warmup.prompt,/Máy tính của em/);
  assert.match(warmup.discussion,/tìm lại ảnh hoặc bài văn/);
  assert.match(warmup.messyText,/bài tập/);
  assert.match(warmup.tidyText,/thư mục/);
  assert.equal(fileExplorerLesson.slides.length,29);
});
