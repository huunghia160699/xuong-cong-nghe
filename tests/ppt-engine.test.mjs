import test from 'node:test';
import assert from 'node:assert/strict';
import {courses} from '../public/apps/ppt/assets/data/tin-hoc-co-ban.js';
import {layouts} from '../public/apps/ppt/assets/js/engine/layouts.js';
import {renderSlide} from '../public/apps/ppt/assets/js/engine/slide-renderer.js';
import {components,htmlEscape} from '../public/apps/ppt/assets/js/engine/components.js';
import {classGroups,classesForCourse,classHasLesson} from '../public/apps/ppt/assets/data/classes.js';
import {siteData} from '../public/apps/ppt/assets/data/site.js';
const lesson=courses['tin-hoc-co-ban'].lessons['buoi-01-file-explorer'];

test('29 existing slides converted to structured data',()=>{
 assert.equal(lesson.slides.length,29);
 assert.equal(lesson.slides.filter(s=>s.layout==='quiz').length,5);
 assert.equal(new Set(lesson.slides.map(s=>s.id)).size,29);
});
test('design system supports 15 layouts and 22 reusable components',()=>{
 assert.equal(Object.keys(layouts).length,15);
 assert.ok(Object.keys(components).length>=22);
});
test('every lesson block is supported',()=>{
 for(const slide of lesson.slides){
  assert.ok(layouts[slide.layout],slide.id);
  for(const block of slide.blocks)assert.ok(components[block.type],`${slide.id}:${block.type}`);
 }
});
test('render output uses generic layout and block classes',()=>{
 for(const [i,slide] of lesson.slides.entries()){
  const html=renderSlide(slide,i);
  assert.ok(html.includes('data-layout="'+slide.layout+'"'));
  assert.ok(html.includes('block-'+slide.blocks[0].type));
  assert.ok(!html.includes('undefined'));
 }
});
test('quiz renders four choices and feedback correctly',()=>{
 const s=lesson.slides.find(s=>s.id==='quiz-download');
 const html=renderSlide(s,23);
 assert.equal((html.match(/data-answer="/g)||[]).length,4);
 assert.ok(html.includes('data-correct="1"'));
 assert.ok(html.includes('Downloads'));
 assert.ok(html.includes('aria-live="polite"'));
});
test('component strings are escaped',()=>{
 assert.equal(htmlEscape('<img src=x onerror="x">'),'&lt;img src=x onerror=&quot;x&quot;&gt;');
});
test('File Explorer and copy/move share one renderer each',()=>{
 for(const id of ['explorer-intro','explorer-zones'])assert.match(renderSlide(lesson.slides.find(s=>s.id===id),0),/data-interaction="explorer"/);
 for(const id of ['copy-demo','move-demo'])assert.match(renderSlide(lesson.slides.find(s=>s.id===id),0),/data-interaction="transfer"/);
});

test('course registry independent from class catalog',()=>{
 const course=courses['tin-hoc-co-ban'];
 assert.equal(course.className,undefined);
 assert.equal(siteData.courses.length,1);
 assert.equal(siteData.classes[0].name,'HL.26-27');
 assert.equal(classesForCourse('tin-hoc-co-ban').length,1);
 assert.ok(classHasLesson(classGroups['hl-26-27'],'tin-hoc-co-ban','buoi-01-file-explorer'));
 assert.equal(classHasLesson(classGroups['hl-26-27'],'tin-hoc-co-ban','layout-gallery'),false);
});
test('a shared lesson can be assigned to another class',()=>{
 const another={id:'sample',offerings:[{courseId:'tin-hoc-co-ban',lessonIds:['buoi-01-file-explorer']}]};
 assert.ok(classHasLesson(another,'tin-hoc-co-ban','buoi-01-file-explorer'));
 assert.equal(lesson.slides.length,29);
 assert.doesNotMatch(lesson.slides[0].eyebrow,/HL\.26-27/);
});
