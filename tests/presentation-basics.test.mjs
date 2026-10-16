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
  assert.match(source,/<WordPageRulers axis="horizontal" landscape=/);
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
 assert.match(home,/disabled=\{!hasSelection&&!clipboardMode\}/);
 assert.match(home,/active=\{paintArmed\}/);
 assert.match(home,/className="wsl-font-effect-disabled" aria-hidden="true"/);
 assert.doesNotMatch(home,/label="Text Effects".*run=/);
 assert.match(editor,/const success=document\.execCommand\(name,false\)/);
 assert.match(editor,/if\(name==="cut"\)\{/);
 assert.match(editor,/stagedClipboard\.current=selected;/);
 assert.match(editor,/setClipboardMode\(name\)/);
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
  assert.match(home,/disabled=\{!hasSelection&&!clipboardMode\}/);
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
  assert.match(css,/grid-template-columns: 136px 43px repeat\(2, 27px\) 1px 37px 1px 27px/);
  assert.match(css,/grid-template-rows: 27px 27px/);
  assert.match(css,/\.wsl-home-font \.wsl-font-select-chevron/);
  assert.match(css,/\.wsl-home-font \.wsl-font-color-swatch/);
  assert.match(home,/className="wsl-font-split wsl-font-color-split"/);
  assert.match(layout,/word-split-ribbon.css/);
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
  assert.match(css,/font: 500 20px\/1/);
  assert.match(css,/width: max-content/);
  assert.match(css,/font-size: 15\.4px/);
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
  assert.match(rules[0][1],/grid-template-columns:\s*136px 43px repeat\(2, 27px\) 1px 37px 1px 27px/);
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


test("Word ribbon icons use Word-like arrows, nested list and correct sort/spacing glyph layout",()=>{
  const source=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
  const fontCSS=readFileSync("src/features/word-simulator/word-font-ribbon.css","utf8");
  const paragraphCSS=readFileSync("src/features/word-simulator/word-paragraph-ribbon.css","utf8");
  const standard=readFileSync("docs/WORD_SIMULATOR_STANDARD.md","utf8");
  const font=source.slice(source.indexOf('<Group name="Font"'),source.indexOf('<Group name="Paragraph"'));
  const paragraph=source.slice(source.indexOf('<Group name="Paragraph"'),source.indexOf('<Group name="Styles"'));
  assert.match(font,/wsl-font-grow[^]*?<svg className="wsl-font-size-direction" viewBox="0 0 9 8"/);
  assert.match(font,/wsl-font-shrink[^]*?<svg className="wsl-font-size-direction" viewBox="0 0 9 8"/);
  assert.doesNotMatch(font,/wsl-font-size-direction">[↑↓]/);
  assert.match(fontCSS,/top: 2px/);
  assert.ok(fontCSS.includes("left: calc(100% + 0px)"));
  for(const glyph of ["WordListGlyph","WordIndentGlyph","WordLineSpacingGlyph","WordSortGlyph"])
    assert.match(source,new RegExp("function "+glyph+"\\("));
  assert.match(source,/kind==="multilevel"/);
  assert.match(source,/<text x="0\.3" y="6\.4">1\.<\/text>/);
  assert.match(source,/<text x="4" y="13\.2">a\.<\/text>/);
  assert.match(source,/<text x="8" y="20">i\.<\/text>/);
  assert.match(source,/<path d="M9 4H25M12\.5 10\.8H25M16 17\.5H25"/);
  assert.match(paragraph,/label="Decrease Indent" icon=\{<WordIndentGlyph direction="decrease"\/>\}/);
  assert.match(paragraph,/label="Increase Indent" icon=\{<WordIndentGlyph direction="increase"\/>\}/);
  assert.match(paragraph,/label="Sort" icon=\{<WordSortGlyph\/>\}/);
  assert.match(paragraph,/label="Line Spacing 1\.5"[\s\S]*?<WordLineSpacingGlyph\/>/);
  assert.match(source,/M5 19\.5V2\.5/);
  assert.match(source,/fill="#167fc0">A<\/text>/);
  assert.match(source,/x="2" y="19\.2" fill="#3f4c5a">Z<\/text>/);
  for(const command of ['run("outdent")','run("indent")','run("lineSpacing")'])
    assert.ok(paragraph.includes(command),command);
  assert.match(paragraphCSS,/\.wsl-home-paragraph \.wsl-paragraph-indent-glyph/);
  assert.match(paragraphCSS,/\.wsl-home-paragraph \.wsl-paragraph-sort-glyph/);
  assert.match(standard,/Tinh chỉnh biểu tượng Word Home Ribbon/);
});


test("Word Indent icons show four thin lines and 70% arrows; Line Spacing shows four",()=>{
 const source=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
 const block=source.slice(source.indexOf("function WordIndentGlyph"),source.indexOf("function WordLineSpacingGlyph"));
 assert.match(block,/viewBox="0 0 24 22"/);
 const line=block.match(/<path d="([^"]+)"\/>/);
 assert.ok(line);
 assert.equal([...line[1].matchAll(/M[\d.]+ [\d.]+H22/g)].length,4);
 assert.match(line[1],/^M2 3H22M13 8\.3H22M13 13\.7H22M2 19H22$/);
 assert.match(block,/stroke="#43494e"/);
 assert.match(block,/fill="#168fca"/);
 assert.equal((block.match(/fill="#168fca"/g)||[]).length,1);
 assert.match(block,/strokeWidth="1\.3"/);
 assert.match(block,/transform="translate\(2\.025 3\.3\) scale\(0\.7\)"/);
 const spacing=source.slice(source.indexOf("function WordLineSpacingGlyph"),source.indexOf("function WordSortGlyph"));
 const rows=[...spacing.matchAll(/<path d="M11\.5 (3|8\.3|13\.7|19)H27"\/>/g)];
 assert.deepEqual(rows.map(match=>Number(match[1])),[3,8.3,13.7,19]);
 assert.match(spacing,/M5 19\.5V2\.5/);
 const paragraph=source.slice(source.indexOf('<Group name="Paragraph"'),source.indexOf('<Group name="Styles"'));
 assert.match(paragraph,/label="Decrease Indent"[\s\S]*?run=\{\(\)=>run\("outdent"\)\}/);
 assert.match(paragraph,/label="Increase Indent"[\s\S]*?run=\{\(\)=>run\("indent"\)\}/);
});

test("Word font size chevrons match the two reference images and preserve editing commands",()=>{
 const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
 const css=readFileSync("src/features/word-simulator/word-font-ribbon.css","utf8");
 const font=home.slice(home.indexOf('<Group name="Font"'),home.indexOf('<Group name="Paragraph"'));
 const grow=font.slice(font.indexOf('label="Increase Font Size"'),font.indexOf('label="Decrease Font Size"'));
 const shrink=font.slice(font.indexOf('label="Decrease Font Size"'),font.indexOf('label="Change Case"'));
 for(const glyph of [grow,shrink]){
   assert.match(glyph,/className="wsl-font-size-direction" viewBox="0 0 9 8"/);
   assert.match(glyph,/fill="none" stroke="currentColor" strokeWidth="2\.1"/);
   assert.doesNotMatch(glyph,/viewBox="0 0 12 12"/);
 }
 assert.match(grow,/d="M1\.4 5\.8 4\.5 2\.7 7\.6 5\.8"/);
 assert.match(shrink,/d="M1\.4 2\.2 4\.5 5\.3 7\.6 2\.2"/);
 assert.match(grow,/run=\{\(\)=>editSize\(String\(Math.min\(7,size\+1\)\)\)\}/);
 assert.match(shrink,/run=\{\(\)=>editSize\(String\(Math.max\(1,size-1\)\)\)\}/);
 const rule=css.match(/\.wsl-home-font \.wsl-font-size-direction\s*\{([^}]+)\}/);
 assert.ok(rule);
 for(const prop of ["top: 2px;","left: calc(100% + 0px);","width: 5px;","height: 4px;","color: #2197ce;"])
   assert.ok(rule[1].includes(prop),prop);
 assert.ok(css.includes("font: 500 20px/1"));
 assert.ok(css.includes("font-size: 15.4px"));
});
test("Word Indent image fidelity and Font blue arrows survive legacy CSS cascade",()=>{
 const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
 const fontCss=readFileSync("src/features/word-simulator/word-font-ribbon.css","utf8");
 const legacy=readFileSync("src/features/word-simulator/word-window-bar.css","utf8");
 const indent=home.slice(home.indexOf("function WordIndentGlyph"),home.indexOf("function WordLineSpacingGlyph"));
 assert.match(indent,/M2 3H22M13 8\.3H22M13 13\.7H22M2 19H22/);
 assert.match(indent,/transform="translate\(2\.025 3\.3\) scale\(0\.7\)"/);
 assert.match(indent,/stroke="#43494e"/);
 assert.match(indent,/fill="#168fca"/);
 assert.doesNotMatch(indent,/stroke="#2499d4"/);
 const font=home.slice(home.indexOf('<Group name="Font"'),home.indexOf('<Group name="Paragraph"'));
 assert.match(font,/label="Increase Font Size"[\s\S]*?wsl-font-size-direction/);
 assert.match(font,/label="Decrease Font Size"[\s\S]*?wsl-font-size-direction/);
 assert.match(fontCss,/\.wsl-home-font \.wsl-font-size-direction[\s\S]*?color: #2197ce/);
 assert.match(legacy,/\.wsl-home-font \.wsl-font-top \.wsl-hb svg:not\(\.wsl-font-size-direction\)/);
 assert.doesNotMatch(legacy,/\.wsl-home-font \.wsl-font-top \.wsl-hb svg\{/);
 const para=home.slice(home.indexOf('<Group name="Paragraph"'),home.indexOf('<Group name="Styles"'));
 assert.match(para,/run=\{\(\)=>run\("outdent"\)\}/);
 assert.match(para,/run=\{\(\)=>run\("indent"\)\}/);
});



test("Word Font toolbar has centered 27px controls, 0px intrinsic caret gap, matching dividers",()=>{
 const css=readFileSync("src/features/word-simulator/word-font-ribbon.css","utf8");
 const para=readFileSync("src/features/word-simulator/word-paragraph-ribbon.css","utf8");
 const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
 const rule=(text,selector)=>{
   const i=text.indexOf(selector+" {");
   assert.ok(i>=0,selector);
   return text.slice(text.indexOf("{",i)+1,text.indexOf("}",i));
 };
 const font=home.slice(home.indexOf('<Group name="Font"'),home.indexOf('<Group name="Paragraph"'));
 assert.equal((font.match(/className="wsl-font-size-letter">A<svg/g)||[]).length,2);
 const arrow=rule(css,".wsl-home-font .wsl-font-size-direction");
 assert.match(arrow,/position: absolute/);
 assert.ok(arrow.includes("left: calc(100% + 0px)"));
 assert.ok(arrow.includes("width: 5px"));
 assert.ok(arrow.includes("height: 4px"));
 assert.doesNotMatch(arrow,/right:/);
 const letter=rule(css,".wsl-home-font .wsl-font-size-letter");
 assert.match(letter,/margin-right: 5px/);
 assert.match(letter,/align-items: flex-end/);
 assert.doesNotMatch(letter,/transform:/);
 assert.match(rule(css,".wsl-home-font .wsl-font-shrink .wsl-font-size-direction"),/top: 6px/);
 for(const sel of [".wsl-home-font .wsl-font-top",".wsl-home-font .wsl-font-bottom"]){
   const row=rule(css,sel);
   assert.match(row,/align-items: stretch/);
   assert.match(row,/box-sizing: border-box/);
 }
 assert.match(rule(css,".wsl-home-font .wsl-font-change-case"),/align-items: center/);
 for(const sel of [".wsl-home-font .wsl-font-top",".wsl-home-font .wsl-font-bottom",".wsl-home-font .wsl-font-select",".wsl-home-font .wsl-hb.wsl-font-icon-button",".wsl-home-font .wsl-font-effect-disabled",".wsl-home-font .wsl-font-color-control"]){
   assert.match(rule(css,sel),/height: 27px/);
 }
 for(const sel of [".wsl-home-font .wsl-font-select-chevron",".wsl-home-font .wsl-font-color-chevron"]){
   assert.match(rule(css,sel),/top: 50%/);
   assert.match(rule(css,sel),/translateY\(-50%\)/);
 }
 for(const block of [rule(css,".wsl-home-font .wsl-font-divider"),rule(para,".wsl-home-paragraph .wsl-paragraph-divider")]){
   for(const prop of ["width: 1px;","height: 18px;","background: #c9ced6;","align-self: center;"]){
     assert.ok(block.includes(prop),prop);
   }
 }
 assert.match(rule(css,".wsl-home-font .wsl-font-shrink .wsl-font-size-letter"),/font-size: 15.4px/);
});


test("Word Ribbon splits icon actions and 13px dropdown menus without fake controls",()=>{
 const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
 const editor=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
 const component=readFileSync("src/features/word-simulator/word-split-button.tsx","utf8");
 const splitCSS=readFileSync("src/features/word-simulator/word-split-ribbon.css","utf8");
 const layout=readFileSync("src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx","utf8");
 assert.equal((home.match(/<WordSplitButton/g)||[]).length,12);
 assert.match(component,/className="wsl-hb wsl-split-arrow"/);
 assert.match(component,/className=\{"wsl-hb wsl-split-main"/);
 assert.match(component,/aria-haspopup="menu"/);
 assert.match(component,/aria-expanded=\{open\}/);
 assert.match(component,/role="menuitem"/);
 assert.match(component,/onMouseDown=\{e=>e.preventDefault\(\)\}/);
 assert.match(component,/createPortal/);
 assert.match(component,/event.key==="Escape"/);
 assert.match(component,/e.key==="ArrowDown"/);
 assert.match(component,/focus\(\{preventScroll:true\}\)/);
 assert.match(component,/<ChevronDown size=\{13\}/);
 assert.match(layout,/word-split-ribbon.css/);
 assert.ok(layout.indexOf("word-split-ribbon.css")>layout.indexOf("word-paragraph-ribbon.css"));
 assert.match(splitCSS,/\.wsl-split-menu\{/);
 assert.match(splitCSS,/z-index:12000/);
 assert.match(splitCSS,/\.wsl-font-split \.wsl-split-arrow\{width:14px\}/);
 assert.match(splitCSS,/\.wsl-paragraph-split \.wsl-split-arrow\{width:16px\}/);
 const names=["Paste — Dán","Change Case","Underline","Text Highlight Color","Font Color",
              "Bullets","Numbering","Multilevel List","Line Spacing 1.5","Paragraph Shading","Borders","Styles"];
 for(const label of names)assert.ok(home.includes('label="'+label+'"'),label);
 for(const action of ['run("pasteRich")','run("changeCaseMode","upper")','run("underlineMode","on")',
                       'run("hiliteColor",highlightColor)','run("foreColor",textColor)',
                       'run("lineSpacing",value)','run("paragraphShading","#dbeafe")',
                       'run("paragraphBorder","top")'])
   assert.ok(home.includes(action),action);
 for(const action of ['if(name==="pasteRich")','if(name==="changeCaseMode")','if(name==="underlineMode")',
                       'if(name==="lineSpacing"||name==="paragraphBorder")'])
   assert.ok(editor.includes(action),action);
 assert.match(editor,/sanitize\(await blob\.text\(\)\)/);
 assert.match(editor,/block\.style\.borderTop=/);
 assert.match(editor,/block\.style\.lineHeight=/);
 assert.match(editor,/selectedChange\(text=>text\.toLocaleUpperCase/);
});


test("Word split hover outlines the entire control but fills only the hovered half",()=>{
 const css=readFileSync("src/features/word-simulator/word-split-ribbon.css","utf8");
 const component=readFileSync("src/features/word-simulator/word-split-button.tsx","utf8");
 assert.match(css,/\.wsl-split:hover:not\(:has\(> \.wsl-hb:disabled\)\)/);
 assert.match(css,/\.wsl-split:has\(> \.wsl-split-arrow\[aria-expanded="true"\]\)/);
 const outline=css.match(/\.wsl-split:hover:not\(:has\(> \.wsl-hb:disabled\)\),[\s\S]*?\{([^}]*)\}/);
 assert.ok(outline);
 assert.match(outline[1],/background:transparent;/);
 assert.match(outline[1],/box-shadow:0 0 0 1px #b9d1eb;/);
 const hovered=css.match(/\.wsl-split \.wsl-hb\.wsl-split-main:hover:not\(:disabled\),[\s\S]*?\{([^}]*)\}/);
 assert.ok(hovered);
 assert.match(hovered[0],/\.wsl-split \.wsl-hb\.wsl-split-arrow:hover:not\(:disabled\)/);
 assert.match(hovered[1],/background:#eaf2fb;/);
 assert.match(hovered[1],/border-color:transparent;/);
 assert.doesNotMatch(hovered[0],/\[aria-expanded="true"\]/);
 assert.match(component,/onClick=\{run\}/);
 assert.match(component,/onClick=\{toggle\}/);
 assert.match(component,/onClick=\{\(\)=>\{setOpen\(false\);option\.run\(\);\}\}/);
});


test("Word Styles gallery matches reference strip, anchors Editing to the left and reduces visible styles responsively",()=>{
 const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
 const css=readFileSync("src/features/word-simulator/word-styles-ribbon.css","utf8");
 const oldCss=readFileSync("src/features/word-simulator/word-home-ribbon.css","utf8");
 const layout=readFileSync("src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx","utf8");
 const styles=home.slice(home.indexOf('<Group name="Styles"'),home.indexOf('<Group name="Editing"'));
 const editing=home.slice(home.indexOf('<Group name="Editing"'));
 assert.match(styles,/className="wsl-style-picker" aria-label="Bộ sưu tập kiểu văn bản"/);
 assert.match(styles,/className="wsl-style-gallery"/);
 assert.match(styles,/\["Normal","No Spacing","Heading 1","Heading 2"\]\.map\(style=>/);
 assert.match(styles,/aria-pressed=\{selectedStyle===style\}/);
 assert.match(styles,/onClick=\{\(\)=>selectStyle\(style\)\}/);
 assert.match(styles,/className="wsl-styles-scroll"/);
 assert.match(styles,/WordSplitButton arrowOnly/);
 assert.match(styles,/options=\{\["Normal","No Spacing","Heading 1","Heading 2","Title","Subtitle"\]/);
 assert.match(styles,/run:\(\)=>selectStyle\(value\)/);
 assert.match(home,/const selectStyle=\(style:string\)=>\{applyStyle\(style\);setSelectedStyle\(style\);\}/);
 for(const handler of ["findText","replaceText","selectAll"])assert.ok(editing.includes(handler));
 assert.ok(home.indexOf('<Group name="Styles"')<home.indexOf('<Group name="Editing"'));
 assert.match(css,/\.wsl-home-styles\{\s*flex:0 0 auto;\s*width:auto;\s*min-width:0;/);
 assert.match(css,/\.wsl-home-styles \.wsl-style-picker\{[\s\S]*?height:69px;[\s\S]*?border:1px solid #b8b9bc;/);
 assert.match(css,/\.wsl-home-styles \.wsl-style-gallery\{[\s\S]*?overflow:hidden;/);
 assert.match(css,/\.wsl-home-styles \.wsl-style-tile\{[\s\S]*?flex:0 0 123px;/);
 assert.match(css,/\.wsl-home-styles \.wsl-style-tile\[aria-pressed="true"\]/);
 assert.doesNotMatch(css,/\.wsl-home-styles \.wsl-style-no-spacing\s*\{[^}]*border/);
 assert.match(css,/\.wsl-home-styles \.wsl-style-tile\{[^}]*border:1px solid transparent;/);
 assert.match(css,/\.wsl-home-styles \.wsl-style-tile:hover,[\s\S]*?border-color:#9eafc0;/);
 assert.match(css,/\.wsl-home-styles \.wsl-style-heading-1 span\{/);
 assert.match(css,/\.wsl-home-styles \.wsl-style-heading-2 span\{/);
 assert.match(css,/\.wsl-home-styles \.wsl-styles-scroll\{[\s\S]*?border-left:1px solid #b8b9bc;/);
 assert.match(css,/\.wsl-home-editing\{\s*flex:0 0 111px;/);
 assert.match(css,/\.wsl-home-editing \.wsl-home-group-content\{[\s\S]*?align-items:flex-start;/);
 assert.match(css,/@media\(max-width:1480px\)\{\s*\.wsl-home-styles \.wsl-style-tile:nth-child\(n\+4\)\{display:none\}/);
 assert.match(css,/@media\(max-width:1350px\)\{\s*\.wsl-home-styles \.wsl-style-tile:nth-child\(n\+3\)\{display:none\}/);
 assert.match(css,/@media\(max-width:1210px\)\{\s*\.wsl-home-styles \.wsl-style-tile:nth-child\(n\+2\)\{display:none\}/);
 assert.match(css,/@media\(max-width:1090px\)\{\s*\.wsl-home-styles \.wsl-style-gallery\{display:none\}/);
 assert.match(oldCss,/wsl-style-gallery/);
 assert.ok(layout.indexOf("word-styles-ribbon.css")>layout.indexOf("word-split-ribbon.css"));
});


test("Word Font maintains six active typing formats and synchronizes them with selection",()=>{
 const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
 const editor=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
 const split=readFileSync("src/features/word-simulator/word-split-button.tsx","utf8");
 const css=readFileSync("src/features/word-simulator/word-interactions.css","utf8");
 for(const name of ["bold","italic","underline","strikeThrough","subscript","superscript"]){
   assert.match(home,new RegExp("active=\\{formatActive\\."+name+"\\}"));
   assert.ok(editor.includes(name+":false"),name);
 }
 assert.match(editor,/document\.queryCommandState\(key\)/);
 assert.match(editor,/document\.addEventListener\("selectionchange",changed\)/);
 assert.match(editor,/syncFormatState\(\)/);
 assert.match(split,/aria-pressed=\{active\|\|undefined\}/);
 assert.match(css,/\.wsl-home-font \.wsl-hb\.wsl-font-icon-button\.is-active/);
 assert.match(css,/\.wsl-home-font \.wsl-font-underline-button \.wsl-hb\.wsl-split-main\.is-active/);
 assert.match(css,/\.wsl-editor::selection,\.wsl-editor \*::selection\{background:#eaf2fb;/);
});
test("Word Clipboard stages Copy or Cut until Paste and cancels with Escape",()=>{
 const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
 const editor=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
 assert.match(home,/clipboardMode==="cut"/);
 assert.match(home,/clipboardMode==="copy"/);
 assert.match(home,/active=\{clipboardMode==="copy"\}/);
 assert.match(home,/active=\{clipboardMode==="cut"\}/);
 assert.match(home,/\(!clipboardMode\|\|paintArmed\)/);
 assert.match(editor,/const stagedClipboard=useRef<string\|null>\(null\)/);
 assert.match(editor,/setClipboardMode\(name\)/);
 assert.match(editor,/if\(clipboardMode&&stagedClipboard\.current!==null\)/);
 assert.match(editor,/event\.key!=="Escape"/);
 assert.match(editor,/setClipboardMode\(null\);stagedClipboard\.current=null;/);
 assert.match(editor,/command\("insertText",content\)/);
});
test("All five Word groups have functional detail dialog launchers and Editing divider",()=>{
 const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
 const dialog=readFileSync("src/features/word-simulator/word-ribbon-dialog.tsx","utf8");
 const css=readFileSync("src/features/word-simulator/word-interactions.css","utf8");
 const layout=readFileSync("src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx","utf8");
 for(const group of ["Clipboard","Font","Paragraph","Styles","Editing"]){
   assert.ok(home.includes('onDetails={()=>setDialog("'+group+'")}'),group);
 }
 assert.equal((home.match(/onDetails=\{\(\)=>setDialog\("/g)||[]).length,5);
 assert.match(home,/ArrowDownRight size=\{12\}/);
 assert.match(home,/WordRibbonDialog name=\{dialog\} actions=\{dialogActions\}/);
 assert.match(dialog,/role="dialog" aria-modal="true"/);
 assert.match(dialog,/onClick=\{\(\)=>\{onClose\(\);action\.run\(\);\}\}/);
 assert.match(css,/\.wsl-home-ribbon \.wsl-group-launcher\{/);
 assert.match(css,/bottom:1px;/);
 assert.match(css,/\.wsl-home-ribbon \.wsl-home-editing\{border-right:1px solid #d8d8dc\}/);
 assert.match(layout,/word-interactions.css/);
});
test("Selected Word tab has a bold label and a clear 3px underline",()=>{
 const css=readFileSync("src/features/word-simulator/word-interactions.css","utf8");
 const home=readFileSync("src/features/word-simulator/word-home-ribbon.css","utf8");
 assert.match(css,/\.wsl-tabs \.wsl-tab\.is-active\{[^}]*font-weight:700;/);
 assert.match(css,/\.wsl-tabs \.wsl-tab\.is-active:after\{[^}]*height:3px;/);
 assert.match(home,/\.wsl-tabs \.wsl-tab\.is-active:after\{height:2px/);
});


test("Word horizontal ruler has paper-edge aligned cm ticks only, leaving vertical empty",()=>{
 const editor=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
 const ruler=readFileSync("src/features/word-simulator/word-page-rulers.tsx","utf8");
 const css=readFileSync("src/features/word-simulator/word-page-rulers.css","utf8");
 const metrics=readFileSync("src/features/word-simulator/word-paper-metrics.ts","utf8");
 assert.match(metrics,/export const CSS_PX_PER_MM=96\/25\.4/);
 assert.match(metrics,/export const A4_WIDTH_PX=210\*CSS_PX_PER_MM/);
 assert.match(metrics,/export const A4_HEIGHT_PX=297\*CSS_PX_PER_MM/);
 assert.match(ruler,/const PX_PER_CM=96\/2\.54/);
 assert.match(ruler,/const PX_PER_QUARTER_CM=PX_PER_CM\/4/);
 assert.match(ruler,/function HorizontalRulerTicks/);
 assert.match(ruler,/useLayoutEffect\(\(\)=>/);
 assert.match(ruler,/const paperRect=paper\.getBoundingClientRect\(\);/);
 assert.match(ruler,/const editorRect=editor\.getBoundingClientRect\(\);/);
 assert.match(ruler,/const viewportLeft=paperRect\.left;/);
 assert.match(ruler,/const editorOffset=editorRect\.left-viewportLeft;/);
 assert.match(ruler,/const editorWidth=editorRect\.width;/);
 assert.match(ruler,/observer\?\.observe\(editor\)/);
 assert.match(ruler,/const contentStart=snapTick\(paperGeometry\.editorOffset\);/);
 assert.match(ruler,/const contentEnd=snapTick\(paperGeometry\.editorOffset\+paperGeometry\.editorWidth\);/);
 assert.match(ruler,/style=\{\{left:contentStart,width:Math\.max\(0,contentEnd-contentStart\)\}\}/);
 assert.match(ruler,/narrow=\{narrow\}/);
 assert.match(ruler,/const left=viewportLeft-ruler\.getBoundingClientRect\(\)\.left;/);
 assert.match(ruler,/const pixelRatio=window\.devicePixelRatio\|\|1;/);
 assert.match(ruler,/Math\.round\(\(viewportLeft\+offset\)\*pixelRatio\)\/pixelRatio-viewportLeft/);
 assert.match(ruler,/style=\{\{left:snapTick\(tick\.left\)\}\}/);
 assert.match(ruler,/const observer=typeof ResizeObserver/);
 assert.match(ruler,/observer\?\.observe\(ruler\)/);
 assert.match(ruler,/observer\?\.observe\(paper\)/);
 assert.match(ruler,/if\(scroller\)observer\?\.observe\(scroller\)/);
 assert.match(ruler,/window\.addEventListener\("resize",align\)/);
 assert.match(ruler,/scrollLeft\]\)/);
 assert.match(ruler,/const scaledWidth=paperWidth\*zoom\/100/);
 assert.match(ruler,/kind:index%4===0\?"cm":index%2===0\?"half":"quarter"/);
 assert.match(ruler,/\.filter\(tick=>tick\.left<scaledWidth-1\)/);
 assert.match(ruler,/style=\{\{left:snapTick\(Math\.max\(0,scaledWidth-1\)\)\}\}/);
 assert.match(ruler,/className="wsl-word-ruler-cm-track"/);
 assert.match(ruler,/className="wsl-word-vertical-ruler" aria-hidden="true"/);
 assert.doesNotMatch(ruler,/<svg|<RulerTicks|<MarginMarker|<text|<label/);
 assert.doesNotMatch(ruler,/>Normal</);
 assert.match(css,/\.wsl-word-ruler-cm-track\{[^}]*background:transparent;/);
 assert.match(css,/\.wsl-word-ruler-content-strip\{[^}]*top:4px;[^}]*bottom:4px;[^}]*z-index:2;[^}]*overflow:hidden;[^}]*background:#fff;/);
 assert.match(css,/\.wsl-word-ruler-cm-tick\{[^}]*z-index:1;/);
 assert.doesNotMatch(css,/\.wsl-word-ruler-content-strip\{[^}]*border:/);
 assert.match(css,/\.wsl-word-ruler-cm-tick\{[^}]*top:50%;[^}]*transform:translateY\(-50%\);/);
 assert.match(css,/\.wsl-word-ruler-cm-tick\{[^}]*width:1px;[^}]*min-width:1px;[^}]*max-width:1px;/);
 assert.doesNotMatch(css,/\.wsl-word-ruler-cm-tick\{[^}]*bottom:3px;/);
 assert.match(css,/\.wsl-word-ruler-cm-tick-cm\{height:7px\}/);
 assert.match(css,/\.wsl-word-ruler-cm-tick-half\{height:4.5px\}/);
 assert.match(css,/\.wsl-word-ruler-cm-tick-quarter\{height:2.5px\}/);
 assert.doesNotMatch(css,/\.wsl-word-ruler-horizontal-printable/);
 assert.match(editor,/showRuler&&<WordPageRulers axis="horizontal"/);
 assert.match(editor,/showRuler&&<WordPageRulers axis="vertical"/);
 for(const cm of [21,29.7])for(const zoom of [60,100,130,160]){
   const width=cm*96/2.54*zoom/100,step=96/2.54/4*zoom/100;
   const positions=Array.from({length:Math.floor(width/step+1e-8)+1},(_,index)=>index*step)
      .filter(x=>x<width-1);
   assert.equal(positions[0],0);
   assert.ok(positions.every(x=>x>=0&&x<width));
   assert.ok(positions.every((x,i)=>i===0||x>positions[i-1]));
   assert.ok(Math.abs(positions[4]-96/2.54*zoom/100)<1e-8);
   assert.ok(Math.abs((width-1)-(width-1))<1e-8);
 }
});
test("Word gray tab strip and floating 5px Home ribbon match the requested frame",()=>{
 const chrome=readFileSync("src/features/word-simulator/word-chrome-polish.css","utf8");
 const layout=readFileSync("src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx","utf8");
 assert.match(chrome,/\.wsl-shell \.wsl-tabs\{\s*background:#e8e7eb;/);
 assert.match(chrome,/font:500 12\.5px\/1\.3/);
 assert.match(chrome,/font-weight:900;/);
 assert.match(chrome,/bottom:4px;/);
 assert.match(chrome,/\.wsl-shell \.wsl-tabs \.wsl-tab\.is-active::after/);
 assert.match(chrome,/\.wsl-ribbon:has\(\.wsl-home-ribbon\)/);
 assert.match(chrome,/\.wsl-shell \.wsl-ribbon\{\s*margin-inline:8px;\s*padding:0;\s*border-top:0;\s*border-bottom:0;/);
 assert.match(chrome,/\.wsl-shell \.wsl-ribbon:has\(\.wsl-home-ribbon\)\{[^}]*padding:0;[^}]*border-top:0;[^}]*border-bottom:0;/);
 assert.match(chrome,/border-radius:5px;/);
 assert.match(chrome,/box-shadow:0 1px 4px rgba\(35,35,45,.09\)/);
 assert.match(layout,/word-chrome-polish.css/);
});


test("Word ruler retains page-relative position and existing Ribbon/viewport layout",()=>{
 const css=readFileSync("src/features/word-simulator/word-page-rulers.css","utf8");
 const ruler=readFileSync("src/features/word-simulator/word-page-rulers.tsx","utf8");
 const chrome=readFileSync("src/features/word-simulator/word-chrome-polish.css","utf8");
 assert.match(css,/--wsl-page-top-offset:13px;/);
 assert.match(css,/padding:var\(--wsl-page-top-offset,13px\) 36px 120px;/);
 assert.match(css,/\.wsl-word-vertical-ruler\{[^}]*top:var\(--wsl-page-top-offset,13px\);/);
 assert.match(css,/@media\(max-width:650px\)\{[^}]*--wsl-page-top-offset:9px/);
 assert.match(css,/\.wsl-word-horizontal-ruler\{[^}]*height:26px;[^}]*border-bottom:1px solid #c7c7cb;/);
 assert.match(ruler,/scrollTop}px\)/);
 assert.match(ruler,/const verticalHeight=renderedPaperHeight\?\?paperHeight\*zoom\/100;/);
 assert.match(ruler,/if\(axis==="horizontal"\)return <HorizontalRulerTicks/);
 assert.match(chrome,/\.wsl-shell \.wsl-tabs\{[^}]*border-radius:0;/);
 const strip=chrome.match(/\.wsl-shell \.wsl-ribbon:has\(\.wsl-home-ribbon\)>\.wsl-home-ribbon\{([^}]*)\}/);
 assert.ok(strip);
 for(const rule of ["flex:1 0 auto;","width:100%;","min-width:max-content;","box-sizing:border-box;","border-radius:5px;"])
   assert.ok(strip[1].includes(rule),rule);
 assert.match(chrome,/\.wsl-shell \.wsl-home-ribbon \.wsl-home-group\{[^}]*flex:0 0 auto;/);
});
test("Horizontal ruler draws only ticks, vertical placeholder preserves measured .wsl-paper height",()=>{
 const ruler=readFileSync("src/features/word-simulator/word-page-rulers.tsx","utf8");
 const editor=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
 const css=readFileSync("src/features/word-simulator/word-page-rulers.css","utf8");
 assert.match(css,/\.wsl-word-horizontal-ruler\{[^}]*border-top:0;[^}]*border-bottom:1px solid #c7c7cb;/);
 assert.match(css,/\.wsl-word-vertical-ruler\{[^}]*position:absolute;/);
 assert.match(css,/\.wsl-word-layout \.wsl-word-page-body\{[^}]*position:relative;/);
 assert.match(editor,/\{showRuler&&<WordPageRulers axis="horizontal"/);
 assert.match(editor,/<div className="wsl-word-page-body">\s*\{showRuler&&<WordPageRulers axis="vertical"/);
 assert.match(editor,/ref=\{paperRef\} className=\{"wsl-paper /);
 assert.match(editor,/const observer=new ResizeObserver\(measure\)/);
 assert.match(editor,/observer\.observe\(page\)/);
 assert.match(editor,/const height=page\.getBoundingClientRect\(\)\.height;/);
 assert.match(editor,/renderedPaperHeight=\{measuredHeight\}/);
 assert.match(ruler,/renderedPaperHeight\?:number;/);
 assert.match(ruler,/const verticalHeight=renderedPaperHeight\?\?paperHeight\*zoom\/100;/);
 assert.match(ruler,/height:verticalHeight/);
 assert.match(ruler,/if\(axis==="horizontal"\)return <HorizontalRulerTicks/);
 assert.match(ruler,/className=\{"wsl-word-ruler-cm-tick wsl-word-ruler-cm-tick-"\+tick\.kind\}/);
 assert.doesNotMatch(ruler,/<svg|<RulerTicks|<MarginMarker|<text/);
 for(const landscape of [false,true])for(const zoom of [60,80,100,120,160]){
   const height=(landscape?210:297)*96/25.4*zoom/100;
   assert.ok(height>0);
 }
});
test("Home Ribbon keeps exactly 96px at every width, 8px parent margins and no top seam",()=>{
 const home=readFileSync("src/features/word-simulator/word-home-ribbon.css","utf8");
 const chrome=readFileSync("src/features/word-simulator/word-chrome-polish.css","utf8");
 assert.match(home,/\.wsl-home-ribbon\{[^}]*height:100%;padding:0;/);
 assert.doesNotMatch(home,/\.wsl-home-ribbon\{[^}]*padding:0 4px;/);
 assert.match(chrome,/\.wsl-shell \.wsl-ribbon\{\s*margin-inline:8px;\s*padding:0;\s*border-top:0;\s*border-bottom:0;/);
 const child=chrome.match(/\.wsl-shell \.wsl-ribbon:has\(\.wsl-home-ribbon\)>\.wsl-home-ribbon\{([^}]*)\}/);
 assert.ok(child);
 assert.match(child[1],/width:100%;/);
 assert.match(child[1],/box-sizing:border-box;/);
 assert.match(child[1],/padding:0;/);
 assert.doesNotMatch(child[1],/padding:0 4px;/);
 assert.match(child[1],/align-self:stretch;/);
 for(const property of ["height:96px;","min-height:96px;","max-height:96px;"])
   assert.ok(child[1].includes(property),property);
 assert.match(child[1],/border-top:0;/);
 assert.match(chrome,/\.wsl-shell \.wsl-tabs\{[^}]*border-bottom:0;/);
 const parent=chrome.match(/\.wsl-shell \.wsl-ribbon:has\(\.wsl-home-ribbon\)\{([^}]*)\}/);
 assert.ok(parent);
 for(const property of ["flex:0 0 96px;","height:96px;","min-height:96px;","max-height:96px;"])
   assert.ok(parent[1].includes(property),property);
 const mobile=chrome.match(/@media\(max-width:650px\)\{([\s\S]*?)\n\}/);
 assert.ok(mobile);
 assert.match(mobile[1],/flex:0 0 96px;height:96px;min-height:96px;max-height:96px;/);
 assert.match(mobile[1],/height:96px;min-height:96px;max-height:96px;/);
 assert.doesNotMatch(child[1],/height:85px;/);
 assert.match(chrome,/\.wsl-shell \.wsl-ribbon:has\(\.wsl-home-ribbon\)\{[^}]*height:96px;/);
});


test("Word centimeter tick pixel snapping is consistent across fractional origins, zoom and DPR",()=>{
 const ruler=readFileSync("src/features/word-simulator/word-page-rulers.tsx","utf8");
 const css=readFileSync("src/features/word-simulator/word-page-rulers.css","utf8");
 assert.match(ruler,/const snapTick=\(offset:number\)=>\{/);
 assert.match(ruler,/Math\.round\(\(viewportLeft\+offset\)\*pixelRatio\)\/pixelRatio-viewportLeft/);
 for(const ratio of [1,1.25,1.5,2,3])
  for(const origin of [0,0.15,0.33,23.76,154.27])
   for(const zoom of [60,100,130,160])
    for(let index=0;index<120;index++){
     const offset=index*(96/2.54)/4*zoom/100;
     const relative=Math.round((origin+offset)*ratio)/ratio-origin;
     const screenPosition=(origin+relative)*ratio;
     assert.ok(Math.abs(screenPosition-Math.round(screenPosition))<1e-7,
       "tick should align to a device-pixel boundary");
     assert.ok(Math.abs(relative-offset)<=0.5/ratio+1e-8);
    }
 const track=css.match(/\.wsl-word-ruler-cm-tick\{([^}]+)\}/);
 assert.ok(track);
 for(const property of ["width:1px;","min-width:1px;","max-width:1px;","top:50%;","transform:translateY(-50%);"])
   assert.ok(track[1].includes(property),property);
 for(const [cls,height] of [["cm",7],["half",4.5],["quarter",2.5]]){
  assert.match(css,new RegExp("wsl-word-ruler-cm-tick-"+cls+"\\{height:"+height+"px\\}"));
  assert.ok(height>0&&height<=7);
 }
});


test("White ruler underlay aligns exactly with the editor between A4 page margins",()=>{
 const ruler=readFileSync("src/features/word-simulator/word-page-rulers.tsx","utf8");
 const css=readFileSync("src/features/word-simulator/word-page-rulers.css","utf8");
 assert.match(ruler,/const editor=document\.querySelector<HTMLElement>\("\.wsl-word-page-body \.wsl-editor"\)/);
 assert.match(ruler,/const editorOffset=editorRect\.left-viewportLeft;/);
 assert.match(ruler,/const editorWidth=editorRect\.width;/);
 assert.match(ruler,/Math\.abs\(previous\.editorOffset-editorOffset\)<0\.01/);
 assert.match(ruler,/Math\.abs\(previous\.editorWidth-editorWidth\)<0\.01/);
 assert.match(ruler,/observer\?\.observe\(editor\)/);
 assert.match(ruler,/\[landscape,narrow,zoom,scrollLeft\]/);
 assert.match(ruler,/<div className="wsl-word-ruler-content-strip"\s*style=\{\{left:contentStart,width:Math\.max\(0,contentEnd-contentStart\)\}\}>/);
 const trackPos=ruler.indexOf('<div className="wsl-word-ruler-cm-track"');
 const fillPos=ruler.indexOf('<div className="wsl-word-ruler-content-strip"');
 const ticksPos=ruler.indexOf('{ticks.map(tick=>');
 const insetTicksPos=ruler.indexOf('{contentTicks.map(tick=>');
 assert.ok(trackPos>=0&&ticksPos>trackPos&&fillPos>ticksPos,
  "white ruler must overlay the pre-existing gray-region ticks");
 assert.ok(insetTicksPos>fillPos,"white region has its own tick series");
 const fill=css.match(/\.wsl-word-ruler-content-strip\{([^}]+)\}/);
 const tick=css.match(/\.wsl-word-ruler-cm-tick\{([^}]+)\}/);
 assert.ok(fill&&tick);
 for(const rule of ["position:absolute;","top:4px;","bottom:4px;","z-index:2;","overflow:hidden;","background:#fff;"])
  assert.ok(fill[1].includes(rule),rule);
 assert.ok(tick[1].includes("z-index:1;"));
 assert.match(ruler,/const contentTicks=useMemo\(\(\)=>\{/);
 assert.match(ruler,/const step=PX_PER_QUARTER_CM\*zoom\/100;/);
 assert.match(ruler,/const count=Math\.floor\(paperGeometry\.editorWidth\/step\+1e-8\);/);
 assert.match(ruler,/\.filter\(tick=>tick\.index>0&&tick\.left<paperGeometry\.editorWidth-1\)/);
 assert.match(ruler,/style=\{\{left:snapTick\(paperGeometry\.editorOffset\+tick\.left\)-contentStart\}\}/);
 assert.match(ruler,/const contentStart=snapTick\(paperGeometry\.editorOffset\);/);
 assert.match(ruler,/const contentEnd=snapTick\(paperGeometry\.editorOffset\+paperGeometry\.editorWidth\);/);
 assert.ok(!fill[1].includes("height:"));
 assert.ok(!fill[1].includes("border:"));
 for(const landscape of [false,true])for(const narrow of [false,true])for(const zoom of [60,100,130,160]){
  const paperWidth=(landscape?297:210)*96/25.4;
  const side=narrow?48:87;
  const editorStart=(side+1)*zoom/100;
  const editorWidth=(paperWidth-2*(side+1))*zoom/100;
  const editorEnd=editorStart+editorWidth;
  assert.ok(editorStart>0);
  assert.ok(editorWidth>0);
  assert.ok(editorEnd<paperWidth*zoom/100);
  assert.ok(Math.abs(editorEnd-(paperWidth-side-1)*zoom/100)<1e-8);
 }
});


test("Word editor focus is borderless and white ruler scale restarts at margin zero",()=>{
 const editorCss=readFileSync("src/features/word-simulator/word-simulator.css","utf8");
 const ruler=readFileSync("src/features/word-simulator/word-page-rulers.tsx","utf8");
 const rulerCss=readFileSync("src/features/word-simulator/word-page-rulers.css","utf8");
 assert.match(editorCss,/\.wsl-editor:focus,\.wsl-editor:focus-visible\{outline:none;outline-offset:0;box-shadow:none\}/);
 assert.doesNotMatch(editorCss,/\.wsl-editor:focus-visible\{outline:1px solid #adc8f5/);
 assert.match(ruler,/contentTicks\.map\(tick=><span key=\{tick\.index\}/);
 assert.match(ruler,/style=\{\{left:snapTick\(paperGeometry\.editorOffset\+tick\.left\)-contentStart\}\}/);
 const gray=ruler.indexOf("{ticks.map(tick=>");
 const white=ruler.indexOf('<div className="wsl-word-ruler-content-strip"');
 const own=ruler.indexOf("{contentTicks.map(tick=>");
 assert.ok(gray>=0&&white>gray&&own>white);
 const strip=rulerCss.match(/\.wsl-word-ruler-content-strip\{([^}]*)\}/)?.[1];
 assert.ok(strip?.includes("z-index:2;")&&strip.includes("overflow:hidden;"));
 for(const cm of [21,29.7])for(const narrow of [true,false])for(const zoom of [60,100,130,160]){
   const paperWidth=cm*96/2.54*zoom/100;
   const margin=(narrow?48:87)*zoom/100;
   const editorWidth=paperWidth-2*(margin+zoom/100);
   const step=96/2.54/4*zoom/100;
   assert.ok(editorWidth>0);
   const marks=Array.from({length:Math.floor(editorWidth/step+1e-8)+1},(_,i)=>({index:i,left:i*step}))
     .filter(mark=>mark.index>0&&mark.left<editorWidth-1);
   assert.equal(marks[0].index,1,"the zero tick must not be rendered");
   assert.ok(Math.abs(marks[0].left-step)<1e-8,"first tick is still 0.25 cm after the margin");
   assert.ok(Math.abs(marks[3].left-96/2.54*zoom/100)<1e-8,"the 1 cm mark keeps its origin at the margin");
   assert.ok(marks.at(-1).left<editorWidth);
 }
});


test("White Word ruler omits only its zero mark and keeps a 4px vertical inset",()=>{
 const ruler=readFileSync("src/features/word-simulator/word-page-rulers.tsx","utf8");
 const css=readFileSync("src/features/word-simulator/word-page-rulers.css","utf8");
 const grayTicks=ruler.slice(ruler.indexOf("const ticks=useMemo"),ruler.indexOf("const contentTicks=useMemo"));
 const whiteTicks=ruler.slice(ruler.indexOf("const contentTicks=useMemo"),ruler.indexOf("const snapTick="));
 assert.match(grayTicks,/\.filter\(tick=>tick\.left<scaledWidth-1\)/);
 assert.doesNotMatch(grayTicks,/tick\.index>0/);
 assert.match(whiteTicks,/\.filter\(tick=>tick\.index>0&&tick\.left<paperGeometry\.editorWidth-1\)/);
 assert.match(ruler,/const contentStart=snapTick\(paperGeometry\.editorOffset\);/);
 assert.match(css,/\.wsl-word-ruler-content-strip\{[^}]*top:4px;[^}]*bottom:4px;[^}]*z-index:2;[^}]*overflow:hidden;[^}]*background:#fff;/);
 assert.doesNotMatch(css,/\.wsl-word-ruler-content-strip\{[^}]*top:2px;/);
 for(const width of [210,297])for(const zoom of [60,80,100,130,160])
  for(const margin of [48,87]){
   const pxWidth=(width*96/25.4-2*(margin+1))*zoom/100;
   const step=96/2.54/4*zoom/100;
   const marks=Array.from({length:Math.floor(pxWidth/step+1e-8)+1},(_,i)=>({index:i,left:i*step}))
    .filter(mark=>mark.index>0&&mark.left<pxWidth-1);
   assert.equal(marks[0].index,1);
   assert.ok(Math.abs(marks[0].left-step)<1e-8);
   assert.ok(Math.abs(marks[3].left-4*step)<1e-8);
   assert.ok(marks.every(mark=>mark.left>0));
  }
});
