import {courses} from '../public/apps/ppt/assets/data/tin-hoc-co-ban.js';
import {layouts} from '../public/apps/ppt/assets/js/engine/layouts.js';
import {components} from '../public/apps/ppt/assets/js/engine/components.js';
import {classGroups,classesForCourse,classHasLesson} from '../public/apps/ppt/assets/data/classes.js';
let errors=0;
for(const course of Object.values(courses)){
 for(const lesson of Object.values(course.lessons)){
  const seen=new Set();
  for(const [index,slide] of lesson.slides.entries()){
   const loc=`${course.id}/${lesson.id}/#${index+1}`;
   if(!slide.id||seen.has(slide.id)){console.error(loc,'Missing/duplicate slide.id');errors++;}
   seen.add(slide.id);
   if(!layouts[slide.layout]){console.error(loc,`Unknown layout ${slide.layout}`);errors++;}
   if(!slide.title){console.error(loc,'Missing title');errors++;}
   if(!Array.isArray(slide.blocks)||slide.blocks.length===0){console.error(loc,'Missing slide blocks');errors++;}
   for(const block of slide.blocks||[]){
    if(!components[block.type]){console.error(loc,`Unknown component ${block.type}`);errors++;}
    if(block.type==='quiz'&&(!Number.isInteger(block.correctIndex)||block.correctIndex<0||block.correctIndex>=block.answers.length)){console.error(loc,'Invalid correctIndex');errors++;}
   }
  }
  for(const section of lesson.sections||[])if(section.start>=lesson.slides.length||section.start<0){console.error('Invalid section index',lesson.id);errors++;}
  console.log(`${course.name} / ${lesson.title}: ${lesson.slides.length} slides ✓`);
 }
}
for(const group of Object.values(classGroups)){
 for(const offering of group.offerings){
  const course=courses[offering.courseId];
  if(!course){console.error(group.id,'Unknown course',offering.courseId);errors++;continue;}
  for(const lessonId of offering.lessonIds||[]){
   if(!course.lessons[lessonId]){console.error(group.id,'Unknown lesson',lessonId);errors++;}
   if(!classHasLesson(group,course.id,lessonId)){console.error(group.id,'Missing offering association',lessonId);errors++;}
  }
  if(!classesForCourse(course.id).some(x=>x.id===group.id)){errors++;console.error('Reverse class lookup mismatch',group.id);}
 }
}
console.log(`${Object.keys(classGroups).length} classes configured`);
console.log(`${Object.keys(layouts).length} layouts · ${Object.keys(components).length} components · ${errors} validation errors`);
if(errors)process.exit(1);
