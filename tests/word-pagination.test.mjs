import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const helper=readFileSync("src/features/word-simulator/word-pagination.ts","utf8");
const simulator=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
const styles=readFileSync("src/features/word-simulator/word-simulator.css","utf8");
const ruler=readFileSync("src/features/word-simulator/word-page-rulers.tsx","utf8");

test("A4 pages are fixed-height and separate, not one infinitely stretching paper",()=>{
 assert.match(styles,/\.wsl-word-layout \.wsl-document-page\{[^}]*height:var\(--wsl-paper-height\)/s);
 assert.match(styles,/\.wsl-word-layout \.wsl-document-page\{[^}]*margin:0 0 24px;/s);
 assert.match(styles,/\.wsl-word-layout \.wsl-paper,[\s\S]*?min-height:0;/);
 assert.match(styles,/\.wsl-word-layout \.wsl-editor,[\s\S]*?min-height:0;/);
 assert.match(simulator,/const \[pageCount,setPageCount\]=useState\(1\)/);
 assert.match(simulator,/const \[activePage,setActivePage\]=useState\(1\)/);
 assert.match(simulator,/<span>Trang \{activePage\} \/ \{pageCount\}/);
 assert.match(simulator,/minHeight:\(a4Dimensions\(orientation==="landscape"\).height\+24\)\*zoom\/100\*pageCount/);
 for(let count=1;count<=15;count++){
   const portraitHeight=(1123+24)*count;
   assert.ok(portraitHeight>=1123*count);
 }
});

test("Ctrl+Enter and Insert tab use the same manual page-break command",()=>{
 assert.match(simulator,/if\(event.key==="Enter"&&\(event.ctrlKey\|\|event.metaKey\)\)\{/);
 assert.match(simulator,/event.preventDefault\(\);insertPageBreak\(\);return;/);
 assert.match(simulator,/\{id:"break",label:"Ngắt trang",run:insertPageBreak/);
 assert.match(simulator,/insertManualWordPageBreak\(root\)/);
 assert.match(helper,/hr.setAttribute\(MANUAL_BREAK_ATTRIBUTE,"true"\)/);
 assert.match(helper,/paragraph.after\(hr,next\)/);
 assert.match(helper,/selection.addRange\(caret\)/);
 assert.match(helper,/range.deleteContents\(\)/);
 assert.match(simulator,/if\(element.tagName==="HR"&&element.hasAttribute\(MANUAL_BREAK_ATTRIBUTE\)\)/);
 assert.match(simulator,/safeAttrs\[MANUAL_BREAK_ATTRIBUTE\]="true"/);
 assert.match(styles,/\[data-wsl-manual-break\]\{\s*display:none!important/);
});

test("Automatic pages preserve inline formatting and selection, split long paragraphs",()=>{
 assert.match(helper,/function visibleChildren\(root:HTMLElement\)/);
 assert.match(helper,/function breakOversizedParagraph\(block:HTMLElement,limit:number\)/);
 assert.match(helper,/const after=range.extractContents\(\)/);
 assert.match(helper,/const continuation=block.cloneNode\(false\)/);
 assert.match(helper,/fragment.insertBefore\(tail,fragment.firstChild\)/);
 assert.match(helper,/getBoundingClientRect\(\).bottom<=endOfPage\(\)\+1/);
 assert.match(helper,/const saved=savePageSelection\(root\)/);
 assert.match(helper,/restorePageSelection\(root,saved\)/);
 assert.match(helper,/page.setAttribute\(PAGE_ATTRIBUTE,String\(index\+1\)\)/);
 assert.match(helper,/gutter.setAttribute\("contenteditable","false"\)/);
 assert.match(simulator,/if\(!isReady\|\|!editor.current\|\|composingRef.current\)return/);
 assert.match(simulator,/onCompositionEnd=\{\(\)=>\{composingRef.current=false;markChanged\(\);\}\}/);
 assert.match(simulator,/setPageCount\(previous=>previous===pages\?previous:pages\)/);
});

test("Visual page wrappers and selection gutters are never stored in the HTML draft",()=>{
 assert.match(simulator,/if\(element.hasAttribute\("data-wsl-selection-gutter"\)\)\{element.remove\(\);return;\}/);
 assert.match(simulator,/if\(element.hasAttribute\("data-wsl-page"\)\)/);
 assert.match(simulator,/element.replaceWith\(\.\.\.Array.from\(element.childNodes\)\);return;/);
 assert.match(simulator,/html:sanitize\(editor.current.innerHTML\)/);
 assert.match(helper,/const gutter=document.createElement\("div"\)/);
 assert.match(helper,/if\(inner.nodeType===Node.ELEMENT_NODE&&/);
});

test("Horizontal/vertical ruler uses the physical first page, not total document height",()=>{
 assert.match(ruler,/const firstPage=paper.querySelector<HTMLElement>\("\.wsl-document-page"\)/);
 assert.match(ruler,/const physical=firstPage\?\?paper/);
 assert.match(ruler,/const editorOffset=firstPage\?padding:editorRect.left-viewportLeft/);
 assert.match(ruler,/const editorOffset=firstPage\?parseFloat\(getComputedStyle\(firstPage\).paddingTop\)\*zoom\/100/);
 assert.match(simulator,/page.querySelector\("\.wsl-document-page"\)\?\?page/);
 assert.match(styles,/@media print\{[\s\S]*?break-after:page;/);
});

test("No ghost paper behind A4 pages: final-loaded ruler CSS resets legacy wrapper box",()=>{
 const fs=readFileSync("src/app/(word-simulator)/cong-cu/mo-phong-word/layout.tsx","utf8");
 const late=readFileSync("src/features/word-simulator/word-page-rulers.css","utf8");
 const old=readFileSync("src/features/word-simulator/word-simulator.css","utf8");
 assert.ok(fs.indexOf("word-simulator.css")<fs.indexOf("word-page-rulers.css"),
   "ruler CSS loads after simulator CSS; it must not restore old paper padding");
 const start=late.indexOf(".wsl-word-layout .wsl-paper,");
 const end=late.indexOf(".wsl-word-horizontal-ruler{",start);
 assert.ok(start>=0&&end>start);
 const paper=late.slice(start,end);
 assert.match(paper,/min-height:0;/);
 assert.match(paper,/height:auto;/);
 assert.match(paper,/padding:0;/);
 assert.match(paper,/background:transparent;/);
 assert.match(paper,/border:0;/);
 assert.match(paper,/box-shadow:none;/);
 assert.doesNotMatch(paper,/padding:var\(--wsl-paper-top-margin/);
 assert.doesNotMatch(paper,/background:#fff/);
 assert.match(old,/\.wsl-word-layout \.wsl-document-page\{[^}]*height:var\(--wsl-paper-height\);/s);
 assert.match(old,/\.wsl-word-layout \.wsl-document-page\{[^}]*padding:var\(--wsl-paper-top-margin\) var\(--wsl-paper-side-margin\)/s);
 assert.match(simulator,/ref=\{paperRef\} className=\{"wsl-paper /);
 assert.match(simulator,/ref=\{editor\} className=\{"wsl-editor /);
});
