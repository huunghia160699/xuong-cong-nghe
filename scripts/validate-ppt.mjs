import {fileExplorerLesson} from "../src/features/presentations/data/file-explorer.ts";
import {layoutGallery} from "../src/features/presentations/data/layout-gallery.ts";
import {PRESENTATION_LAYOUTS} from "../src/features/presentations/types.ts";
const allowed=new Set(["heroStats","card","definition","fileType","filename","item","stack","notice","shortcut","keyCombo","folderTree","code","steps","explorer","fileTransfer","quiz","formula","excelTable","document","image","compare","hotspot"]);
let errors=0;
for (const lesson of [fileExplorerLesson,layoutGallery]) {
 const ids=new Set();
 for(const slide of lesson.slides) {
  if(!slide.id||ids.has(slide.id)){console.error("Duplicate ID",slide.id);errors++;}
  ids.add(slide.id);
  if(!PRESENTATION_LAYOUTS.includes(slide.layout)){console.error("Layout",slide.id);errors++;}
  if(!slide.title||!Array.isArray(slide.blocks)||!slide.blocks.length){console.error("Invalid slide",slide.id);errors++;}
  for(const block of slide.blocks||[]) {
   if(!allowed.has(block.type)){console.error("Unknown block",slide.id,block.type);errors++;}
   if(block.type==="quiz"&&(!Array.isArray(block.answers)||block.correctIndex<0||block.correctIndex>=block.answers.length)){console.error("Invalid quiz",slide.id);errors++;}
  }
 }
 for(const section of lesson.sections||[])if(section.start<0||section.start>=lesson.slides.length)errors++;
 console.log(lesson.id+": "+lesson.slides.length+" slides checked");
}
if(fileExplorerLesson.slides.length!==29||layoutGallery.slides.length!==15)errors++;
console.log("Layout registry: "+PRESENTATION_LAYOUTS.length+"; errors: "+errors);
if(errors) process.exit(1);
