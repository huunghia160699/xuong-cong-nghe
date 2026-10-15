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
  assert.match(hero,/lg:grid-cols-\[1\.12fr_\.88fr\]/);
  assert.match(hero,/rotate-\[-4deg\]/);
  assert.match(hero,/rotate-\[3deg\]/);
  assert.match(hero,/onClick=\{onStart\}/);
  assert.match(player,/onAdvance=\{\(\) => move\(current \+ 1\)\}/);
});

test("Word first hero uses large type, concise title and WORD outline",()=>{
  const hero=readFileSync("src/features/presentations/components/word-home-hero.tsx","utf8");
  assert.match(hero,/Làm quen với<br\/>\s*<span className="text-cyan">Microsoft Word<\/span>/);
  assert.doesNotMatch(hero,/qua thực hành\.|Nhập liệu · Chỉnh sửa · Lưu văn bản/);
  assert.match(hero,/min-h-14/);
  assert.match(hero,/sm:text-3xl/);
  assert.match(hero,/text-\[clamp\(2\.4rem,8vw,3\.5rem\)\]/);
  assert.match(hero,/>WORD<\/span>/);
  assert.doesNotMatch(hero,/aria-hidden="true">01<\/span>/);
  assert.match(hero,/onClick=\{onStart\}/);
  assert.equal(wordBasicsLessons[0].slides[0].blocks[0].type,"wordHomeHero");
  assert.equal(wordBasicsLessons.reduce((n,m)=>n+m.slides.length,0),124);
  assert.equal(excelBasicsLessons.reduce((n,m)=>n+m.slides.length,0),96);
});

test("slide headings never render generic eyebrow labels above their titles",()=>{
  const player=readFileSync("src/features/presentations/components/player.tsx","utf8");
  const explorerCover=readFileSync("src/features/presentations/components/lesson-opening-cover.tsx","utf8");
  const blocks=readFileSync("src/features/presentations/components/blocks.tsx","utf8");
  const rules=readFileSync("docs/SLIDE_STANDARD.md","utf8");
  assert.doesNotMatch(player,/slide\.eyebrow\s*\?\?/);
  assert.doesNotMatch(player,/>BÀI GIẢNG<\/p>/);
  assert.doesNotMatch(explorerCover,/xcn-lesson-opening-eyebrow|PHẦN NỘI DUNG/);
  assert.doesNotMatch(blocks,/block\.number\s*\?\?\s*"KIẾN THỨC"/);
  assert.doesNotMatch(blocks,/block\.label\s*\?\?\s*"KHÁI NIỆM"/);
  assert.match(player,/\{slide\.title\}/);
  assert.match(rules,/Không hiển thị/);
  assert.match(rules,/slide\.eyebrow/);
  assert.match(rules,/Checklist nghiệm thu/);
});

test("only the second slide of the first Word lesson uses the custom interactive purpose design",()=>{
  const word=wordBasicsLessons[0];
  assert.equal(word.slides[0].blocks[0].type,"wordHomeHero");
  assert.equal(word.slides[1].id,"word-use");
  assert.equal(word.slides[1].title,"Word dùng để làm gì?");
  assert.equal(word.slides[1].blocks.length,1);
  assert.equal(word.slides[1].blocks[0].type,"wordPurpose");
  assert.match(word.slides[1].notes,/Word không thay thế Excel/);
  assert.equal(wordBasicsLessons.reduce((sum,lesson)=>sum+lesson.slides.length,0),124);
  assert.equal(excelBasicsLessons.reduce((sum,lesson)=>sum+lesson.slides.length,0),96);
  assert.equal(wordBasicsLessons.flatMap(l=>l.slides).filter(s=>s.blocks.some(b=>b.type==="wordPurpose")).length,1);
  assert.equal(excelBasicsLessons.flatMap(l=>l.slides).filter(s=>s.blocks.some(b=>b.type==="wordPurpose")).length,0);
});

test("Word slide 02 has accessible, interactive CSS mock with large presentation typography",()=>{
  const component=readFileSync("src/features/presentations/components/word-purpose-slide.tsx","utf8");
  const styles=readFileSync("src/features/presentations/word-purpose.css","utf8");
  const player=readFileSync("src/features/presentations/components/player.tsx","utf8");
  const route=readFileSync("src/app/(presentation)/cong-cu/trinh-chieu/[lessonId]/page.tsx","utf8");
  for(const word of ["Word dùng để","Soạn thảo","Trình bày","aria-pressed","aria-live","setMode(\"edit\")","setMode(\"format\")","data-word-purpose-slide"]){
    assert.ok(component.includes(word),word);
  }
  assert.match(styles,/xcn-word-purpose-title/);
  assert.match(styles,/@media\(max-width:767px\)/);
  assert.match(styles,/#005bfd/i);
  assert.match(player,/slide\.id === "word-use" && blocks\[0\]\?\.type === "wordPurpose"/);
  assert.match(route,/word-purpose\.css/);
  assert.doesNotMatch(component,/\bKIẾN THỨC\b|\bTHAO TÁC\b/);
});

test("teacher-led Word slides show subject matter without instructional filler",()=>{
  const purpose=readFileSync("src/features/presentations/components/word-purpose-slide.tsx","utf8");
  const workspace=readFileSync("src/features/presentations/components/word-workspace.tsx","utf8");
  const guide=readFileSync("docs/SLIDE_STANDARD.md","utf8");
  const agents=readFileSync("AGENTS.md","utf8");
  for(const phrase of ["Chọn một chức năng để xem", "Giao diện Word được mô phỏng bằng CSS", "xcn-word-purpose-instruction", "xcn-word-purpose-outcome"])
    assert.ok(!purpose.includes(phrase),phrase);
  assert.match(purpose,/role="group" aria-live="polite"/);
  assert.match(purpose,/Soạn thảo/);
  assert.match(purpose,/Trình bày/);
  assert.match(purpose,/Thời gian: 8 giờ, thứ Sáu/);
  assert.doesNotMatch(purpose,/Nội dung mới được thêm vào văn bản/);
  for(const phrase of ["MÔ PHỎNG WORD · CSS/REACT","HƯỚNG DẪN THAO TÁC","Minh họa bằng CSS, không chỉnh sửa", "{data.tip&&"])
    assert.ok(!workspace.includes(phrase),phrase);
  assert.match(workspace,/xcn-word-step-detail/);
  assert.match(workspace,/data-word-workspace/);
  assert.match(guide,/Slide dùng để giảng/);
  assert.match(agents,/teacher-led teaching materials/);
  assert.equal(wordBasicsLessons.reduce((n,m)=>n+m.slides.length,0),124);
  assert.equal(excelBasicsLessons.reduce((n,m)=>n+m.slides.length,0),96);
});


test("independent Word simulator has functional editor, a tools entry and honest file limits",()=>{
  const page=readFileSync("src/app/(word-simulator)/cong-cu/mo-phong-word/page.tsx","utf8");
  const layout=readFileSync("src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx","utf8");
  const toolPage=readFileSync("src/app/(public)/cong-cu/page.tsx","utf8");
  const editor=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
  const css=readFileSync("src/features/word-simulator/word-simulator.css","utf8");
  const rules=readFileSync("docs/WORD_SIMULATOR_STANDARD.md","utf8");
  assert.match(page,/WordSimulator/);
  assert.match(layout,/word-simulator.css/);
  assert.match(toolPage,/\/cong-cu\/mo-phong-word/);
  assert.match(toolPage,/Word Lab/);
  for(const word of ["contentEditable","onInput","onPaste","localStorage","execCommand","sanitize","insertTable","insertImage","importFile","exportHTML","exportText","setOrientation","setMargins","setZoom","window.print"])
    assert.ok(editor.includes(word),word);
  assert.match(editor,/MAX_IMPORT_BYTES=1024\*1024/);
  assert.match(editor,/FORBIDDEN_TAGS/);
  assert.match(editor,/\.html"/);
  assert.match(css,/wsl-ribbon/);
  assert.match(css,/wsl-paper/);
  assert.match(css,/@media\(max-width:650px\)/);
  assert.match(css,/@media print/);
  assert.match(rules,/Chưa thể mở hoặc xuất DOCX thật/);
  assert.equal(wordBasicsLessons.reduce((n,m)=>n+m.slides.length,0),124);
  assert.equal(excelBasicsLessons.reduce((n,m)=>n+m.slides.length,0),96);
});


test("Word simulator shows complete classic Ribbon tabs and Home groups but no blue header",()=>{
  const source=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
  const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
  const css=readFileSync("src/features/word-simulator/word-home-ribbon.css","utf8");
  const route=readFileSync("src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx","utf8");
  assert.match(source,/TABS:Tab\[\]=\["File","Home","Insert","Design","Layout","References","Mailings","Review","View","Help"\]/);
  assert.doesNotMatch(source,/<header className="wsl-titlebar">/);
  assert.match(source,/<WordHomeRibbon/);
  for(const group of ["Clipboard","Font","Paragraph","Styles","Editing"])
    assert.ok(home.includes('name="'+group+'"'),group);
  for(const item of ["Bold","Italic","Underline","Subscript","Superscript","Bullets","Numbering","Justify","Font Color","Format Painter","Find","Replace","Select All"])
    assert.ok(home.includes(item),item);
  assert.doesNotMatch(home,/"Text Effects" icon=.*run=\{\(\)=>run\("bold"\)/);
  assert.match(css,/wsl-style-gallery/);
  assert.match(css,/@media\(max-width:650px\)/);
  assert.match(route,/word-home-ribbon.css/);
  assert.match(source,/wsl-vertical-ruler/);
  assert.match(source,/replaceText/);
  assert.match(source,/showMarks/);
  assert.match(source,/applyStyle/);
});


test("Word window title and Quick Access Toolbar have working Save Undo Redo and only X exits",()=>{
 const bar=readFileSync("src/features/word-simulator/word-window-bar.tsx","utf8");
 const code=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
 const css=readFileSync("src/features/word-simulator/word-window-bar.css","utf8");
 const layout=readFileSync("src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx","utf8");
 for(const icon of ["Save","Undo2","Redo2","ChevronDown","Minus","Square","X"])
   assert.match(bar,new RegExp(icon));
 for(const handler of ["onSave","onUndo","onRedo","onNew","onPrint","onClose"])
   assert.ok(bar.includes(handler),handler);
 assert.match(bar,/role="toolbar" aria-label="Quick Access Toolbar"/);
 assert.match(bar,/href="\/cong-cu" onClick=\{onClose\}/);
 assert.match(bar,/className="wsl-window-decor"/);
 assert.doesNotMatch(bar,/onClick=\{.*Minimize|onClick=\{.*Maximize/);
 assert.match(bar,/ - Word/);
 assert.match(code,/<WordWindowBar/);
 assert.match(code,/function saveDraft\(\)/);
 assert.match(code,/onSave=\{saveDraft\}/);
 assert.match(code,/onClose=\{saveDraft\}/);
 assert.match(code,/onUndo=\{\(\)=>command\("undo"\)\}/);
 assert.match(code,/onRedo=\{\(\)=>command\("redo"\)\}/);
 assert.match(css,/grid-template-columns/);
 assert.match(css,/@media\(max-width:650px\)/);
 assert.match(layout,/word-window-bar.css/);
});

test("Clipboard and Font correctly map each visible control and respect selection",()=>{
 const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
 const editor=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
 const css=readFileSync("src/features/word-simulator/word-window-bar.css","utf8");
 for(const value of ["paste","cut","copy","formatPainter","bold","italic","underline","strikeThrough","subscript","superscript","removeFormat","hiliteColor","foreColor"])
   assert.ok(home.includes(value),value);
 for(const value of ["Increase Font Size","Decrease Font Size","Change Case","Clear All Formatting","Format Painter","Text Highlight Color","Font Color"])
   assert.ok(home.includes(value),value);
 assert.match(home,/disabled=\{!hasSelection\}/);
 assert.match(home,/active=\{paintArmed\}/);
 assert.match(home,/className="wsl-font-effect-disabled" aria-hidden="true"/);
 assert.doesNotMatch(home,/label="Text Effects".*run=/);
 assert.match(editor,/const success=document\.execCommand\(name\)/);
 assert.match(editor,/if\(success\)\{if\(name==="cut"\)markChanged\(\);else setStatus\("Đã sao chép/);
 assert.match(editor,/navigator\.clipboard\.readText\(\)/);
 assert.match(editor,/range=savedSelection\.current\?\.cloneRange\(\)/);
 assert.match(editor,/setHasSelection/);
 assert.match(editor,/function saveDraft/);
 assert.match(css,/wsl-clipboard-paste-art/);
 assert.match(css,/wsl-underline-dropdown/);
 const audit=readFileSync("docs/WORD_SIMULATOR_CONTROL_AUDIT.md","utf8");
 assert.match(audit,/Clipboard/);
 assert.match(audit,/Font/);
 assert.match(audit,/Chưa kiểm thử E2E/);
});

test("Word disabled ribbon buttons keep normal cursor and never animate on hover",()=>{
  const homeCss=readFileSync("src/features/word-simulator/word-home-ribbon.css","utf8");
  const windowCss=readFileSync("src/features/word-simulator/word-window-bar.css","utf8");
  const simulatorCss=readFileSync("src/features/word-simulator/word-simulator.css","utf8");
  const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
  const standard=readFileSync("docs/WORD_SIMULATOR_STANDARD.md","utf8");
  assert.match(homeCss,/\.wsl-hb:hover:not\(:disabled\)/);
  assert.match(homeCss,/\.wsl-hb:disabled\{opacity:\.35;cursor:default/);
  assert.match(windowCss,/\.wsl-home-clipboard \.wsl-hb\[disabled\]\{opacity:\.32;cursor:default\}/);
  assert.match(windowCss,/\.wsl-home-font \.wsl-hb\[disabled\]:hover/);
  assert.match(simulatorCss,/\.wsl-tool:disabled\{opacity:\.4;cursor:default\}/);
  assert.doesNotMatch(homeCss+windowCss+simulatorCss,/cursor:not-allowed/);
  assert.match(home,/title=\{disabled\?undefined:/);
  assert.match(home,/disabled=\{!hasSelection\}/);
  assert.doesNotMatch(home,/className="wsl-font-effect-disabled" title=/);
  assert.match(standard,/cursor: default/);
});


test("Word Font group has deliberate two-row alignment, real color swatches and correct disabled state",()=>{
  const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
  const css=readFileSync("src/features/word-simulator/word-font-ribbon.css","utf8");
  const layout=readFileSync("src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx","utf8");
  const standard=readFileSync("docs/WORD_SIMULATOR_STANDARD.md","utf8");
  const start=home.indexOf('<Group name="Font"');
  const end=home.indexOf('<Group name="Paragraph"');
  assert.ok(start>=0&&end>start);
  const font=home.slice(start,end);
  assert.match(font,/className="wsl-font-top"/);
  assert.match(font,/className="wsl-font-bottom"/);
  assert.ok(font.indexOf('className="wsl-font-top"')<font.indexOf('className="wsl-font-bottom"'));
  for(const label of ["Font","Font Size","Increase Font Size","Decrease Font Size","Change Case","Clear All Formatting","Bold","Italic","Underline","Strikethrough","Subscript","Superscript","Text Highlight Color","Font Color"])
    assert.ok(font.includes(label),label);
  for(const cmd of ['run("bold")','run("italic")','run("underline")','run("strikeThrough")','run("subscript")','run("superscript")','run("removeFormat")','run("hiliteColor",event.target.value)','run("foreColor",event.target.value)'])
    assert.ok(font.includes(cmd),cmd);
  assert.match(font,/className="wsl-font-effect-disabled" aria-hidden="true"/);
  assert.doesNotMatch(font,/title="Text Effects/);
  assert.doesNotMatch(font,/label="Text Effects".*run=/);
  assert.match(font,/style=\{\{backgroundColor:highlightColor\}\}/);
  assert.match(font,/style=\{\{backgroundColor:textColor\}\}/);
  assert.match(css,/grid-template-columns: 136px 43px repeat\(2, 27px\) 1px 27px 1px 27px/);
  assert.match(css,/grid-template-rows: 27px 27px/);
  assert.match(css,/\.wsl-home-font \.wsl-font-select-chevron/);
  assert.match(css,/\.wsl-home-font \.wsl-font-color-swatch/);
  assert.match(css,/\.wsl-home-font \.wsl-font-color-control:focus-within/);
  assert.match(css,/\.wsl-home-font \.wsl-font-effect-disabled:hover/);
  assert.match(css,/cursor: default/);
  assert.doesNotMatch(css,/cursor:\s*not-allowed/);
  assert.ok(layout.indexOf('word-font-ribbon.css')>layout.indexOf('word-window-bar.css'));
  assert.match(standard,/Chuẩn thị giác nhóm Font/);
});


test("Word Font glyphs use sans-serif B/U, matched A baselines and full-width second row",()=>{
  const component=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
  const css=readFileSync("src/features/word-simulator/word-font-ribbon.css","utf8");
  const group=component.slice(component.indexOf('<Group name="Font"'),component.indexOf('<Group name="Paragraph"'));
  for(const className of ["wsl-font-grow","wsl-font-shrink","wsl-font-size-letter","wsl-font-size-direction","wsl-font-bold","wsl-font-underline"]){
    assert.ok(group.includes(className),className);
  }
  assert.match(css,/\.wsl-home-font \.wsl-font-bold\s*\{\s*font:\s*700 17px\/1 Arial/);
  assert.match(css,/\.wsl-home-font \.wsl-font-underline\s*\{[\s\S]*?font:\s*16px\/1 Arial/);
  assert.match(css,/\.wsl-home-font \.wsl-font-size-letter\s*\{[\s\S]*?bottom:\s*1px;/);
  assert.match(css,/\.wsl-home-font \.wsl-font-size-letter\s*\{[\s\S]*?transform-origin:\s*left bottom;/);
  assert.match(css,/\.wsl-home-font \.wsl-font-shrink \.wsl-font-size-letter\s*\{[\s\S]*?transform:\s*scale\(\.77\);/);
  const bottom=css.match(/\.wsl-home-font \.wsl-font-bottom\s*\{([^}]+)\}/);
  assert.ok(bottom,"second row layout rule exists");
  assert.match(bottom[1],/width:\s*100%/);
  assert.match(bottom[1],/justify-content:\s*space-between/);
  assert.match(bottom[1],/gap:\s*0/);
  assert.equal((group.match(/run=\{\(\)=>run\("/g)||[]).length>=7,true);
});


test("Word Font spaces both rows, separates Change Case and superscript, and uses the Eraser icon",()=>{
  const source=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
  const css=readFileSync("src/features/word-simulator/word-font-ribbon.css","utf8");
  const standard=readFileSync("docs/WORD_SIMULATOR_STANDARD.md","utf8");
  const group=source.slice(source.indexOf('<Group name="Font"'),source.indexOf('<Group name="Paragraph"'));
  const first=group.slice(group.indexOf('<div className="wsl-font-top">'),group.indexOf('<div className="wsl-font-bottom">'));
  const second=group.slice(group.indexOf('<div className="wsl-font-bottom">'));
  const line='<span className="wsl-font-divider" aria-hidden="true"/>';
  assert.equal(first.split(line).length-1,2,"two dividers around Aa");
  assert.equal(second.split(line).length-1,1,"one divider after superscript");
  const beforeAa=first.indexOf(line);
  const aa=first.indexOf('label="Change Case"');
  const afterAa=first.indexOf(line,beforeAa+line.length);
  const eraser=first.indexOf('label="Clear All Formatting"');
  assert.ok(beforeAa<aa&&aa<afterAa&&afterAa<eraser,"Aa is enclosed by dividers");
  assert.ok(second.indexOf('label="Superscript"')<second.indexOf(line)&&second.indexOf(line)<second.indexOf('wsl-font-effect-disabled'));
  assert.match(first,/label="Clear All Formatting" icon=\{<Eraser size=\{20\}/);
  assert.match(first,/run=\{\(\)=>run\("removeFormat"\)\}/);
  assert.doesNotMatch(first,/wsl-font-clear/);
  const top=css.match(/\.wsl-home-font \.wsl-font-top\s*\{([^}]+)\}/);
  assert.ok(top);
  assert.match(top[1],/column-gap:\s*0/);
  assert.match(top[1],/justify-content:\s*space-between/);
  assert.match(css,/\.wsl-home-font \.wsl-font-divider\s*\{[\s\S]*?width:\s*1px/);
  assert.match(css,/\.wsl-home-font \.wsl-font-divider\s*\{[\s\S]*?height:\s*18px/);
  assert.match(css,/\.wsl-home-font \.wsl-font-divider\s*\{[\s\S]*?pointer-events:\s*none/);
  assert.match(standard,/Khoảng cách hàng trên và vạch phân nhóm/);
});


test("Word top Font row has no CSS override defeating space-between alignment",()=>{
  const css=readFileSync("src/features/word-simulator/word-font-ribbon.css","utf8");
  const rules=[...css.matchAll(/\.wsl-home-font \.wsl-font-top\s*\{([^}]+)\}/g)];
  assert.equal(rules.length,1,"only one primary top-row layout block");
  const properties=[...rules[0][1].matchAll(/justify-content\s*:\s*([^;]+)\s*;/g)].map(m=>m[1].trim());
  assert.deepEqual(properties,["space-between"],"later justify-content must not override space-between");
  assert.match(rules[0][1],/width:\s*100%/);
  assert.match(rules[0][1],/grid-template-columns:\s*136px 43px repeat\(2, 27px\) 1px 27px 1px 27px/);
  assert.doesNotMatch(rules[0][1],/justify-content:\s*(?:start|flex-start)/);
  const standard=readFileSync("docs/WORD_SIMULATOR_STANDARD.md","utf8");
  assert.match(standard,/Sửa xung đột CSS khiến hàng trên Font không giãn đều/);
});


test("Word Paragraph ribbon follows reference layout, correct command mapping and avoids misleading buttons",()=>{
  const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
  const code=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
  const css=readFileSync("src/features/word-simulator/word-paragraph-ribbon.css","utf8");
  const layout=readFileSync("src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx","utf8");
  const paragraph=home.slice(home.indexOf('<Group name="Paragraph"'),home.indexOf('<Group name="Styles"'));
  const top=paragraph.slice(paragraph.indexOf('className="wsl-paragraph-top"'),paragraph.indexOf('className="wsl-paragraph-bottom"'));
  const bottom=paragraph.slice(paragraph.indexOf('className="wsl-paragraph-bottom"'));
  for(const [section,labels] of [[top,["Bullets","Numbering","Multilevel List","Decrease Indent","Increase Indent","Sort","Show/Hide ¶"]],[bottom,["Align Left","Center","Align Right","Justify","Line Spacing 1.5","Paragraph Shading","Borders"]]]){
    let previous=-1;
    for(const label of labels){
      const index=section.indexOf('label="'+label+'"');
      assert.ok(index>previous,label+" must appear in correct order");
      previous=index;
    }
  }
  assert.equal((paragraph.match(/className="wsl-paragraph-divider"/g)||[]).length,3);
  assert.match(top,/run=\{\(\)=>run\("insertUnorderedList"\)\}/);
  assert.match(top,/run=\{\(\)=>run\("insertOrderedList"\)\}/);
  assert.match(top,/label="Multilevel List"[\s\S]*?run=\{\(\)=>run\("multilevelList"\)\}/);
  assert.match(bottom,/run=\{\(\)=>run\("paragraphShading"\)\}/);
  assert.match(bottom,/run=\{\(\)=>run\("paragraphBorder"\)\}/);
  assert.match(home,/function WordListGlyph/);
  assert.match(code,/function insertMultilevelList\(\)/);
  assert.match(code,/if\(name==="multilevelList"\)\{insertMultilevelList\(\);return;\}/);
  assert.match(code,/if\(name==="paragraphShading"\)/);
  assert.match(code,/block\.style\.backgroundColor/);
  assert.doesNotMatch(paragraph,/run\("backColor"/);
  assert.match(css,/\.wsl-home-paragraph \.wsl-home-group-content\s*\{[\s\S]*?grid-template-rows:\s*27px 27px/);
  for(const row of ["wsl-paragraph-top","wsl-paragraph-bottom"]){
    const selector=".wsl-home-paragraph ."+row;
    const at=css.indexOf(selector);
    assert.ok(at>=0,row+" selector must exist");
    const open=css.indexOf("{",at);
    const close=css.indexOf("}",open);
    assert.ok(open>at&&close>open,row+" CSS rule must exist");
    const block=css.slice(open+1,close);
    assert.deepEqual([...block.matchAll(/justify-content:\s*([^;]+);/g)].map(x=>x[1].trim()),["space-between"]);
    assert.match(block,/width:\s*100%/);
  }
  assert.match(css,/\.wsl-home-paragraph \.wsl-hb\.wsl-paragraph-icon-button:disabled/);
  assert.doesNotMatch(css,/cursor:\s*not-allowed/);
  assert.match(layout,/word-paragraph-ribbon.css/);
  assert.ok(layout.indexOf('word-paragraph-ribbon.css')>layout.indexOf('word-font-ribbon.css'));
});
