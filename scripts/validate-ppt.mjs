import {fileExplorerLesson} from "../src/features/presentations/data/file-explorer.ts";
import {layoutGallery} from "../src/features/presentations/data/layout-gallery.ts";
import {PRESENTATION_LAYOUTS} from "../src/features/presentations/types.ts";
const allowed=new Set(["lessonCover","warmUpComparison","heroStats","card","definition","fileType","filename","item","stack","notice","shortcut","keyCombo","folderTree","code","steps","explorer","fileTransfer","quiz","formula","excelTable","document","image","compare","hotspot"]);
let errors=0;
for (const lesson of [fileExplorerLesson,layoutGallery]) {
 const ids=new Set();
 for(const slide of lesson.slides) {
  if(!slide.id||ids.has(slide.id)){console.error("Duplicate ID",slide.id);errors++;}
  ids.add(slide.id);
  if(!PRESENTATION_LAYOUTS.includes(slide.layout)){console.error("Layout",slide.id);errors++;}
  if(!slide.title||!Array.isArray(slide.blocks)||!slide.blocks.length){console.error("Invalid slide",slide.id);errors++;}
  // Classroom principle: keep each slide focused (5 ± 2 key ideas).
  // 6x6 is an editorial target, not a hard limit for Vietnamese, file paths or code.
  const teachingItems=slide.blocks.filter(block=>block.type!=="notice");
  if(teachingItems.length>7){console.error("Too many teaching blocks",slide.id,teachingItems.length);errors++;}
  for(const block of teachingItems) {
   if(["steps","stack","heroStats"].includes(block.type) && (block.items?.length??0)>7){
    console.error("Too many items in one block",slide.id,block.type);errors++;
   }
  }
  for(const block of slide.blocks||[]) {
   if(!allowed.has(block.type)){console.error("Unknown block",slide.id,block.type);errors++;}
   if(block.type==="lessonCover" &&
      (!Array.isArray(block.goals) || block.goals.length!==3 ||
       !block.heading)) {
     console.error("Invalid lesson opening cover",slide.id);errors++;
   }
   if(block.type==="warmUpComparison" &&
      (!block.messyText||!block.tidyText||!block.prompt||!block.revealLabel)) {
      console.error("Warm-up comparison missing stages",slide.id);errors++;
   }
   if(block.type==="quiz"&&(!Array.isArray(block.answers)||block.correctIndex<0||block.correctIndex>=block.answers.length)){console.error("Invalid quiz",slide.id);errors++;}
  }
 }
 for(const section of lesson.sections||[])if(section.start<0||section.start>=lesson.slides.length)errors++;
 console.log(lesson.id+": "+lesson.slides.length+" slides checked");
}
const phases=fileExplorerLesson.phases??[];
if(phases.length!==3||phases[0]?.start!==0||phases[2]?.start!==28||
   phases.some((phase,i)=>phase.start<0||phase.start>=fileExplorerLesson.slides.length||
   (i>0&&phase.start<=phases[i-1].start))){
 console.error("Lesson must have ordered opening, body, conclusion");errors++;
}
if(fileExplorerLesson.slides.length!==29||layoutGallery.slides.length!==15)errors++;
console.log("Layout registry: "+PRESENTATION_LAYOUTS.length+"; errors: "+errors);
if(errors) process.exit(1);
