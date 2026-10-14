import test from "node:test";
import assert from "node:assert/strict";
import {fileExplorerLesson} from "../src/features/presentations/data/file-explorer.ts";
import {layoutGallery} from "../src/features/presentations/data/layout-gallery.ts";
import {PRESENTATION_LAYOUTS} from "../src/features/presentations/types.ts";
test("29 slides and five quizzes remain unchanged",()=>{
 assert.equal(fileExplorerLesson.slides.length,29);
 assert.equal(fileExplorerLesson.slides.filter(s=>s.layout==="quiz").length,5);
 assert.equal(new Set(fileExplorerLesson.slides.map(s=>s.id)).size,29);
 assert.equal(fileExplorerLesson.slides[0].title,"Quản lý tệp và thư mục");
});
test("15 showcase slide layouts remain separate from lessons",()=>{
 assert.equal(layoutGallery.slides.length,15);
 assert.equal(layoutGallery.kind,"showcase");
 assert.equal(new Set(layoutGallery.slides.map(s=>s.layout)).size,15);
 assert.equal(PRESENTATION_LAYOUTS.length,15);
});
test("content only uses supported reusable blocks",()=>{
 const allowed=new Set(["heroStats","card","definition","fileType","filename","item","stack","notice","shortcut","keyCombo","folderTree","code","steps","explorer","fileTransfer","quiz","formula","excelTable","document","image","compare","hotspot"]);
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
