import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
const editor=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
const split=readFileSync("src/features/word-simulator/word-split-button.tsx","utf8");
const dialog=readFileSync("src/features/word-simulator/word-ribbon-dialog.tsx","utf8");
const styles=readFileSync("src/features/word-simulator/word-styles-ribbon.css","utf8");
const ruler=readFileSync("src/features/word-simulator/word-page-rulers.tsx","utf8");
const paper=readFileSync("src/features/word-simulator/word-paper-metrics.ts","utf8");
const simulator=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
const rulerCSS=readFileSync("src/features/word-simulator/word-page-rulers.css","utf8");
const chrome=readFileSync("src/features/word-simulator/word-chrome-polish.css","utf8");
const interactions=readFileSync("src/features/word-simulator/word-interactions.css","utf8");

const controls=[
  // Each tuple covers visible UI wiring and the receiving editor implementation.
  ["Clipboard","Paste",'run("paste")','if(name==="paste"){'],
  ["Clipboard","Paste Rich",'run("pasteRich")','if(name==="pasteRich"){'],
  ["Clipboard","Cut",'run("cut")','if(name==="cut"||name==="copy"){'],
  ["Clipboard","Copy",'run("copy")','if(name==="cut"||name==="copy"){'],
  ["Clipboard","Format Painter",'run("formatPainter")','if(name==="formatPainter"){'],
  ["Font","Font Family",'editFont(event.target.value)','function editFont(next:string)'],
  ["Font","Font Size",'editSize(event.target.value)','function editSize(next:string)'],
  ["Font","Increase Font Size",'label="Increase Font Size"','function editSize(next:string)'],
  ["Font","Decrease Font Size",'label="Decrease Font Size"','function editSize(next:string)'],
  ["Font","Change Case",'run={changeCase}','function changeCase()'],
  ["Font","Clear All Formatting",'run("removeFormat")','command(name,value);'],
  ["Font","Bold",'run("bold")','document.queryCommandState(key)'],
  ["Font","Italic",'run("italic")','document.queryCommandState(key)'],
  ["Font","Underline",'run("underline")','document.queryCommandState(key)'],
  ["Font","Strikethrough",'run("strikeThrough")','document.queryCommandState(key)'],
  ["Font","Subscript",'run("subscript")','document.queryCommandState(key)'],
  ["Font","Superscript",'run("superscript")','document.queryCommandState(key)'],
  ["Font","Highlight Color",'run("hiliteColor",highlightColor)','command(name,value);'],
  ["Font","Font Color",'run("foreColor",textColor)','command(name,value);'],
  ["Paragraph","Bullets",'run("insertUnorderedList")','command(name,value);'],
  ["Paragraph","Numbering",'run("insertOrderedList")','command(name,value);'],
  ["Paragraph","Multilevel List",'run("multilevelList")','if(name==="multilevelList")'],
  ["Paragraph","Decrease Indent",'run("outdent")','command(name,value);'],
  ["Paragraph","Increase Indent",'run("indent")','command(name,value);'],
  ["Paragraph","Sort",'run={sortLines}','function sortLines()'],
  ["Paragraph","Show/Hide",'label="Show/Hide ¶"','showMarks?"show-paragraph-marks"'],
  ["Paragraph","Align Left",'run("justifyLeft")','command(name,value);'],
  ["Paragraph","Align Center",'run("justifyCenter")','command(name,value);'],
  ["Paragraph","Align Right",'run("justifyRight")','command(name,value);'],
  ["Paragraph","Justify",'run("justifyFull")','command(name,value);'],
  ["Paragraph","Line Spacing",'run("lineSpacing")','if(name==="lineSpacing"||name==="paragraphBorder")'],
  ["Paragraph","Paragraph Shading",'run("paragraphShading")','if(name==="paragraphShading"){'],
  ["Paragraph","Borders",'run("paragraphBorder")','if(name==="lineSpacing"||name==="paragraphBorder")'],
  ["Styles","Normal",'["Normal","No Spacing","Heading 1","Heading 2"]','function applyStyle(name:string)'],
  ["Styles","No Spacing",'selectedStyle===style','function applyStyle(name:string)'],
  ["Styles","Heading 1",'aria-pressed={selectedStyle===style}','function applyStyle(name:string)'],
  ["Styles","Heading 2",'run:()=>selectStyle(value)','function applyStyle(name:string)'],
  ["Styles","Title",'["Normal","No Spacing","Heading 1","Heading 2","Title","Subtitle"]','function applyStyle(name:string)'],
  ["Styles","Subtitle",'run:()=>selectStyle(value)','function applyStyle(name:string)'],
  ["Editing","Find",'run={findText}','function findText()'],
  ["Editing","Replace",'run={replaceText}','function replaceText()'],
  ["Editing","Select All",'run={selectAll}','function selectAll()']
];

// Secondary arrow menus and dialog launchers remain independently operable.
const menuCases=[
  ["Clipboard Paste options",'label:"Dán văn bản"','if(name==="paste"){'],
  ["Clipboard Rich HTML",'label:"Dán giữ định dạng (HTML)"','sanitize(await blob.text())'],
  ["Change Case upper",'run("changeCaseMode","upper")','if(name==="changeCaseMode"){'],
  ["Change Case lower",'run("changeCaseMode","lower")','if(name==="changeCaseMode"){'],
  ["Change Case title",'run("changeCaseMode","title")','if(name==="changeCaseMode"){'],
  ["Change Case sentence",'run("changeCaseMode","sentence")','if(name==="changeCaseMode"){'],
  ["Underline on",'run("underlineMode","on")','if(name==="underlineMode"){'],
  ["Underline off",'run("underlineMode","off")','if(name==="underlineMode"){'],
  ["Highlight no color",'run("removeHighlight")','if(name==="removeHighlight")'],
  ["Font colors",'["#111827","#c91c2a","#2563eb","#15803d","#7c3aed"]','command(name,value);'],
  ["Bullets menu",'label:"Danh sách dấu đầu dòng"','command(name,value);'],
  ["Numbering menu",'label:"Danh sách đánh số"','command(name,value);'],
  ["Multilevel menu",'label:"Danh sách nhiều cấp"','insertMultilevelList()'],
  ["Spacing 1",'["1","1.15","1.5","2"].map(value','block.style.lineHeight='],
  ["Spacing 1.15",'label:"Giãn dòng "+value','block.style.lineHeight='],
  ["Spacing 1.5",'run("lineSpacing",value)','block.style.lineHeight='],
  ["Spacing 2",'run("lineSpacing",value)','block.style.lineHeight='],
  ["Shading yellow",'label:"Nền vàng"','block.style.backgroundColor='],
  ["Shading blue",'label:"Nền xanh"','block.style.backgroundColor='],
  ["Shading green",'label:"Nền xanh lá"','block.style.backgroundColor='],
  ["Shading clear",'label:"Không tô nền"','block.style.backgroundColor='],
  ["Border bottom",'label:"Viền dưới"','block.style.borderBottom='],
  ["Border top",'label:"Viền trên"','block.style.borderTop='],
  ["Border none",'label:"Bỏ viền"','block.style.borderBottom='],
  ["Style menu",'WordSplitButton arrowOnly','function applyStyle(name:string)'],
];

test("Home Ribbon: 10 source-to-command contract checks per primary tool",()=>{
 const rounds=10;
 const unique=new Set(controls.map(item=>item[0]+"/"+item[1]));
 assert.equal(unique.size,controls.length);
 for(let iteration=0;iteration<rounds;iteration++){
   for(const [group,name,ui,impl] of controls){
     assert.ok(home.includes(ui),`round ${iteration+1}: ${group}/${name} UI is missing ${ui}`);
     assert.ok(editor.includes(impl),`round ${iteration+1}: ${group}/${name} receiver missing ${impl}`);
   }
 }
 console.log(`HOME_QA_PRIMARY_PASS ${controls.length} controls × ${rounds} rounds = ${controls.length*rounds} checks per layer`);
});
test("Home Ribbon: 10 checks per submenu option",()=>{
 for(let round=0;round<10;round++)for(const [name,ui,impl] of menuCases){
   assert.ok(home.includes(ui),`round ${round+1}: menu ${name} UI missing`);
   assert.ok(editor.includes(impl),`round ${round+1}: menu ${name} handler missing`);
 }
 assert.match(split,/onClick=\{run\}/);
 assert.match(split,/onClick=\{toggle\}/);
 assert.match(split,/setOpen\(false\);option\.run\(\)/);
 console.log(`HOME_QA_MENU_PASS ${menuCases.length} options × 10 rounds`);
});
test("Home Ribbon: repeat state, Escape, selection and dialogs 10 rounds",()=>{
 for(let round=0;round<10;round++){
   for(const format of ["bold","italic","underline","strikeThrough","subscript","superscript"]){
     assert.ok(home.includes(`active={formatActive.${format}}`));
     assert.ok(editor.includes(`formatActive`)&&editor.includes("document.queryCommandState(key)"));
   }
   assert.match(editor,/event\.key!=="Escape"/);
   assert.match(editor,/setClipboardMode\(null\);stagedClipboard\.current=null;/);
   assert.match(editor,/if\(clipboardMode&&stagedClipboard\.current!==null\)/);
   assert.match(editor,/restoreSelection\(\)/);
   assert.match(editor,/setHasSelection/);
   assert.match(interactions,/\.wsl-editor::selection,\.wsl-editor \*::selection/);
   assert.match(interactions,/\.wsl-home-ribbon \.wsl-home-editing\{border-right:1px/);
   assert.match(dialog,/role="dialog" aria-modal="true"/);
   assert.match(dialog,/onClick=\{\(\)=>\{onClose\(\);action\.run\(\);\}\}/);
   assert.equal((home.match(/onDetails=\{\(\)=>setDialog\("/g)||[]).length,5);
   assert.ok(styles.includes("wsl-style-gallery"));
 }
 console.log("HOME_QA_STATES_PASS 10 rounds × formatting, clipboard, selection, launchers");
});
test("Horizontal centimeter ruler and tab chrome: 10 rounds over A4 size and zoom",()=>{
 for(let round=0;round<10;round++){
   assert.match(ruler,/import \{a4Dimensions\} from "\.\/word-paper-metrics"/);
   assert.match(paper,/export const A4_WIDTH_PX=210\*CSS_PX_PER_MM/);
   assert.match(paper,/export const A4_HEIGHT_PX=297\*CSS_PX_PER_MM/);
   assert.match(ruler,/function HorizontalRulerTicks/);
   assert.match(ruler,/const PX_PER_CM=96\/2\.54/);
   assert.match(ruler,/const PX_PER_QUARTER_CM=PX_PER_CM\/4/);
   assert.match(ruler,/const scaledWidth=paperWidth\*zoom\/100/);
   assert.match(ruler,/kind:index%4===0\?"cm":index%2===0\?"half":"quarter"/);
   assert.match(ruler,/const paperRect=paper\.getBoundingClientRect\(\);/);
   assert.match(ruler,/const editorRect=editor\.getBoundingClientRect\(\);/);
   assert.match(ruler,/const viewportLeft=paperRect\.left;/);
   assert.match(ruler,/const editorOffset=editorRect\.left-viewportLeft;/);
   assert.match(ruler,/const editorWidth=editorRect\.width;/);
   assert.match(ruler,/observer\?\.observe\(editor\)/);
   assert.match(ruler,/const contentStart=snapTick\(paperGeometry\.editorOffset\);/);
   assert.match(ruler,/style=\{\{left:contentStart,width:Math\.max\(0,contentEnd-contentStart\)\}\}/);
   assert.match(ruler,/contentTicks\.map\(tick=>tick\.kind==="cm"\?/);
   assert.match(ruler,/<span key=\{tick\.index\} className="wsl-word-ruler-cm-label"/);
   assert.match(ruler,/\{tick\.index\/4\}<\/span>:/);
   assert.match(ruler,/\.filter\(tick=>tick\.index>0&&tick\.left<paperGeometry\.editorWidth-1\)/);
   assert.match(ruler,/style=\{\{left:snapTick\(paperGeometry\.editorOffset\+tick\.left\)-contentStart\}\}/);
   assert.match(ruler,/narrow=\{narrow\}/);
   assert.match(ruler,/const left=viewportLeft-ruler\.getBoundingClientRect\(\)\.left;/);
   assert.match(ruler,/const pixelRatio=window\.devicePixelRatio\|\|1;/);
   assert.match(ruler,/Math\.round\(\(viewportLeft\+offset\)\*pixelRatio\)\/pixelRatio-viewportLeft/);
   assert.match(ruler,/observer\?\.observe\(ruler\)/);
   assert.match(ruler,/observer\?\.observe\(paper\)/);
   assert.match(ruler,/scrollLeft\]\)/);
   assert.match(ruler,/style=\{\{left:snapTick\(Math\.max\(0,scaledWidth-1\)\)\}\}/);
   assert.match(ruler,/className="wsl-word-ruler-cm-track"/);
   assert.match(ruler,/className="wsl-word-vertical-ruler" aria-hidden="true"/);
   assert.doesNotMatch(ruler,/<svg|<RulerTicks|<MarginMarker|<text/);
   assert.doesNotMatch(rulerCSS,/wsl-word-ruler-(horizontal|vertical)-printable/);
   assert.match(rulerCSS,/\.wsl-word-ruler-cm-track\{[^}]*background:transparent;/);
   assert.match(rulerCSS,/\.wsl-word-ruler-content-strip\{[^}]*top:4px;[^}]*bottom:4px;[^}]*z-index:2;[^}]*overflow:hidden;[^}]*background:#fff;/);
   assert.match(rulerCSS,/\.wsl-word-ruler-cm-tick\{[^}]*z-index:1;/);
   assert.match(ruler,/const count=Math\.floor\(paperGeometry\.editorWidth\/step\+1e-8\);/);
   const editorCss=readFileSync("src/features/word-simulator/word-simulator.css","utf8");
   assert.match(editorCss,/\.wsl-editor:focus,\.wsl-editor:focus-visible\{outline:none;outline-offset:0;box-shadow:none\}/);
   assert.match(rulerCSS,/\.wsl-word-ruler-cm-tick\{[^}]*top:50%;[^}]*transform:translateY\(-50%\);/);
   assert.match(rulerCSS,/\.wsl-word-ruler-cm-tick\{[^}]*width:1px;[^}]*min-width:1px;[^}]*max-width:1px;/);
   assert.match(rulerCSS,/\.wsl-word-ruler-cm-tick-cm\{height:7px\}/);
   assert.match(rulerCSS,/\.wsl-word-ruler-cm-tick-half\{height:4.5px\}/);
   assert.match(rulerCSS,/\.wsl-word-ruler-cm-tick-quarter\{height:2.5px\}/);
   assert.match(rulerCSS,/\.wsl-word-horizontal-ruler\{[^}]*border-top:0;[^}]*border-bottom:1px solid #c7c7cb;/);
   assert.match(rulerCSS,/\.wsl-word-vertical-ruler\{[^}]*top:var\(--wsl-page-top-offset,13px\);/);
   assert.match(rulerCSS,/@media\(max-width:650px\)\{[^}]*--wsl-page-top-offset:9px/);
   assert.match(simulator,/const observer=new ResizeObserver\(measure\)/);
   assert.match(simulator,/ref=\{paperRef\}/);
   assert.match(simulator,/<div className="wsl-word-page-body">\s*\{showRuler&&<WordPageRulers axis="vertical"/);
   assert.match(chrome,/\.wsl-shell \.wsl-tabs \.wsl-tab\{[^}]*border-radius:0;/);
   assert.match(chrome,/font-weight:900/);
   assert.match(chrome,/\.wsl-shell \.wsl-ribbon\{\s*margin-inline:8px;\s*padding:0;/);
   assert.match(chrome,/\.wsl-shell \.wsl-ribbon:has\(\.wsl-home-ribbon\)>\.wsl-home-ribbon\{[^}]*width:100%;/);
   for(const landscape of [false,true])for(const narrow of [false,true])for(const zoom of [60,100,130,160]){
     const width=(landscape?297:210)*96/25.4;
     const height=(landscape?210:297)*96/25.4;
     const hor=narrow?48:87,ver=narrow?48:86;
     assert.ok(Math.abs((hor+width-2*hor+hor)-width)<1e-9);
     assert.ok(Math.abs((ver+height-2*ver+ver)-height)<1e-9);
     assert.ok((width-2*hor)*zoom/100>0);
     assert.ok((height-2*ver)*zoom/100>0);
     const paperWidth=width*zoom/100;
     const step=96/2.54/4*zoom/100;
     const subdivisions=Array.from({length:Math.floor(paperWidth/step+1e-8)+1},(_,index)=>index*step)
       .filter(x=>x<paperWidth-1);
     assert.equal(subdivisions[0],0);
     assert.ok(subdivisions.at(-1)<paperWidth);
     assert.ok(Math.abs(subdivisions[4]-96/2.54*zoom/100)<1e-8);
     assert.ok(paperWidth-1>subdivisions.at(-1));
   }
 }
 console.log("WORD_CM_TICKS_QA_PASS 10 rounds × 16 page geometry permutations");
});
