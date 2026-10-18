import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

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
 assert.match(styles,/\.wsl-word-layout \.wsl-document-page hr\[data-wsl-manual-break\]\{[^}]*display:block!important;/s);
 assert.match(styles,/@media print\{[\s\S]*?hr\[data-wsl-manual-break\]\{display:none!important\}/);
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


test("Empty Word document never inserts a second phantom paragraph mark",()=>{
 const begin=helper.indexOf('export function paginateWordEditor(');
 const end=helper.indexOf('export function insertManualWordPageBreak(',begin);
 const executable=helper.slice(begin,end).trim()
   .replace('export function paginateWordEditor(root:HTMLElement):number','function paginateWordEditor(root)')
   .replace('root.firstElementChild as HTMLElement|null','root.firstElementChild')
   .replaceAll('node as Element','node')
   .replaceAll('node as HTMLElement','node');
 let mutations=0,created=[],lastRestored=null;
 const blank={
   nodeType:1,tagName:"P",childNodes:[{nodeType:1,tagName:"BR"}],
   hasAttribute(){return false},
   getBoundingClientRect(){return {bottom:120}}
 };
 const root={
   childNodes:[blank],
   get children(){return this.childNodes.filter(n=>n.nodeType===1)},
   get firstElementChild(){return this.children[0]??null},
   get textContent(){return ""},
   replaceChildren(...nodes){this.childNodes=nodes;mutations++},
   appendChild(node){this.childNodes.push(node)},
   querySelectorAll(){return created}
 };
 const ctx={
   ensureWordCaretInsideParagraph:()=>false,
   Node:{ELEMENT_NODE:1},
   MANUAL_BREAK_ATTRIBUTE:"data-wsl-manual-break",
   PAGE_ATTRIBUTE:"data-wsl-page",
   savePageSelection:()=>({start:0,end:0,startNode:blank,startOffset:0,endNode:blank,endOffset:0}),
   restorePageSelection:(editor,saved)=>{lastRestored=saved},
   visibleChildren:editor=>[...editor.childNodes],
   createPage(editor,i){
     const gutter={nodeType:1,hasAttribute:attr=>attr==="data-wsl-selection-gutter"};
     const page={
       nodeType:1,
       childNodes:[gutter],
       get children(){return this.childNodes},
       hasAttribute:attr=>attr==="data-wsl-page",
       querySelector(){return null},
       getBoundingClientRect(){return{bottom:1123,height:1123}},
       offsetHeight:1123,
       appendChild(node){this.childNodes.push(node)}
     };
     created.push(page);
     editor.appendChild(page);
     return page;
   },
   getComputedStyle:()=>({paddingBottom:"86px"}),
   document:{
     createDocumentFragment(){const nodes=[];return{
       get firstChild(){return nodes[0]??null},
       appendChild(node){nodes.push(node)},
       insertBefore(node,reference){nodes.splice(nodes.indexOf(reference),0,node)},
       removeChild(node){nodes.splice(nodes.indexOf(node),1)}
     }},
     createElement(name){return {nodeType:1,tagName:name.toUpperCase(),appendChild(){}}}
   },
   breakOversizedParagraph:()=>null
 };
 // Simulate real DocumentFragment semantics: appendChild moves from fragment.
 ctx.createPage=((original)=>original)(ctx.createPage);
 ctx.visibleChildren=()=>[blank];
 const oldCreate=ctx.createPage;
 ctx.createPage=(editor,index)=>{
   const page=oldCreate(editor,index);
   const append=page.appendChild.bind(page);
   page.appendChild=node=>{if(fragmentRef){const i=fragmentRef.nodes.indexOf(node);if(i>=0)fragmentRef.nodes.splice(i,1);}append(node)};
   return page;
 };
 let fragmentRef=null;
 ctx.document.createDocumentFragment=()=>{
   const nodes=[];fragmentRef={nodes};
   return {
     get firstChild(){return nodes[0]??null},
     appendChild(node){nodes.push(node)},
     insertBefore(node,reference){nodes.splice(nodes.indexOf(reference),0,node)}
   };
 };
 const paginate=runInNewContext('('+executable+')',ctx);
 assert.equal(paginate(root),1);
 assert.equal(created.length,1);
 assert.equal(created[0].children.length,2,
   "one selection gutter plus exactly one existing <p><br></p>");
 assert.equal(created[0].children[1],blank,"original blank paragraph reused, not duplicated");
 assert.equal(lastRestored?.startNode,blank);
 const count=mutations;
 assert.equal(paginate(root),1,"repeat pagination remains on one sheet");
 assert.equal(mutations,count,"typing on an in-bounds page must not detach the DOM again");
 assert.equal(created[0].children.length,2);
 assert.doesNotMatch(helper,/if\(!root\.textContent\?\.length&&/);
 assert.match(helper,/if\(children\.length===0\)/);
});

test("Restoring caret uses original paragraph DOM node, not ambiguous zero text offsets",()=>{
 const start=helper.indexOf("export function savePageSelection(");
 const end=helper.indexOf("function findTextOffset(",start);
 const code=helper.slice(start,end)
   .replaceAll("export function ","function ")
   .replace("root:HTMLElement):WordPageSelection|null","root)")
   .replace("root:HTMLElement,\n  saved:WordPageSelection|null):void","root,saved)")
   .replace("const textNodes:Text[]=[]","const textNodes=[]")
   .replaceAll(" as Text","")
   .replace("const find=(position:number):{node:Node;offset:number}=>{","const find=(position)=>{")
   .replace("const validOffset=(node:Node,offset:number)=>","const validOffset=(node,offset)=>")
   .replace("querySelector<HTMLElement>","querySelector");
 const firstP={nodeType:1,childNodes:[{nodeType:1}],textContent:""};
 const secondP={nodeType:1,childNodes:[{nodeType:1}],textContent:""};
 const root={childNodes:[firstP,secondP],
   contains(node){return node===firstP||node===secondP},
   querySelector(){return null}
 };
 let active={
   startContainer:secondP,startOffset:0,
   endContainer:secondP,endOffset:0
 };
 const selection={rangeCount:1,anchorNode:secondP,
   getRangeAt:()=>active,
   removeAllRanges(){this.rangeCount=0},
   addRange(range){active=range;this.rangeCount=1}
 };
 const doc={
   createRange(){return {
     startContainer:null,startOffset:0,endContainer:null,endOffset:0,
     selectNodeContents(){},
     setStart(node,offset){this.startContainer=node;this.startOffset=offset},
     setEnd(node,offset){this.endContainer=node;this.endOffset=offset},
     toString(){return ""}
   }},
   createTreeWalker(){throw Error("should not walk text nodes to restore empty caret")}
 };
 const ctx={window:{getSelection:()=>selection},document:doc,Node:{TEXT_NODE:3},NodeFilter:{SHOW_TEXT:4}};
 const funcs=runInNewContext(code+";({savePageSelection,restorePageSelection})",ctx);
 const stored=funcs.savePageSelection(root);
 assert.equal(stored.start,0);
 assert.equal(stored.end,0);
 assert.equal(stored.startNode,secondP,"capture caret inside second empty paragraph");
 assert.equal(stored.startOffset,0);
 // Both paragraphs have zero textContent; text-based restoration would
 // incorrectly select the first one or the page element.
 funcs.restorePageSelection(root,stored);
 assert.equal(active.startContainer,secondP,"caret does not jump above its paragraph");
 assert.equal(active.startOffset,0);
 assert.equal(active.endContainer,secondP);
 assert.match(helper,/if\(root\.contains\(saved\.startNode\)&&root\.contains\(saved\.endNode\)\)/);
 assert.match(helper,/if\(last&&last\.getBoundingClientRect\(\)\.bottom<=bottom\+1\)\{\s*ensureWordCaretInsideParagraph\(root\);\s*return 1;/);
});


test("Paragraph mark stays at text baseline and follows current font size, including an empty paragraph",()=>{
 const css=readFileSync("src/features/word-simulator/word-home-ribbon.css","utf8");
 const text=css.match(/\.wsl-editor\.show-paragraph-marks p::after,([\s\S]*?)\{/);
 const blank=css.match(/\.wsl-editor\.show-paragraph-marks p:has\(>br:only-child\)::after\{([^}]*)\}/);
 assert.ok(text,"paragraph mark must be shared by text and headings");
 assert.ok(blank,"blank paragraph requires a single-row decoration");
 assert.match(text[1],/h1::after/);
 assert.match(text[1],/h2::after/);
 assert.match(css,/content:" ¶";/,"paragraph mark follows the actual end of the text");
 assert.match(css,/font-size:var\(--wsl-paragraph-mark-size,1em\)/,
   "mark must inherit the size of the final typed run, not always 12px");
 assert.match(css,/vertical-align:baseline;/,"mark and text share a baseline");
 assert.doesNotMatch(css,/font:12px Georgia,serif/);
 assert.match(blank[1],/content:"¶"/,"one pilcrow in empty paragraph");
 assert.match(blank[1],/position:absolute/,"a BR cannot place the mark below the caret");
 assert.match(blank[1],/inset-inline-start:\.3em/,"blank mark uses em spacing, not fixed pixels");
 assert.match(blank[1],/top:50%/,"mark is centered in the live caret line box");
 assert.match(blank[1],/transform:translateY\(-50%\)/);
 assert.doesNotMatch(blank[1],/left:3px|top:2px/);
 assert.match(css,/\.wsl-editor\.show-paragraph-marks p:has\(>br:only-child\)\{position:relative\}/);
 assert.match(css,/pointer-events:none/,"visual marks may not intercept caret");
 assert.match(simulator,/const DEFAULT_CONTENT="<p><br><\/p>"/);
 assert.match(simulator,/showMarks\?"show-paragraph-marks":""/);
});

test("Visible Word Ctrl+Enter marker matches reference: dotted rule, centered Page Break, right ¶",()=>{
 const token=styles.slice(styles.indexOf("/* Editable Word manual page-break marker"),styles.indexOf("@media print",styles.indexOf("/* Editable Word manual page-break marker")));
 assert.ok(token.length>100);
 assert.match(token,/hr\[data-wsl-manual-break\]\{[\s\S]*?display:block!important;/);
 assert.match(token,/background:repeating-linear-gradient\(to right/);
 assert.match(token,/calc\(100% - 22px\) 1px no-repeat/);
 assert.match(token,/hr\[data-wsl-manual-break\]::before\{[\s\S]*?content:"Page Break";/);
 assert.match(token,/left:50%;[\s\S]*?top:50%;[\s\S]*?transform:translate\(-50%,-50%\);/);
 assert.match(token,/hr\[data-wsl-manual-break\]::after\{[\s\S]*?content:"¶";/);
 assert.match(token,/right:0;/);
 assert.match(styles,/@media print\{[\s\S]*?hr\[data-wsl-manual-break\]\{display:none!important\}/);
 assert.doesNotMatch(token,/display:none!important/,"marker must appear during editing");
 assert.match(helper,/hr\.setAttribute\(MANUAL_BREAK_ATTRIBUTE,"true"\)/);
 assert.match(helper,/contentEditable="false"/);
 assert.match(helper,/\(node as HTMLElement\)\.contentEditable="false"/);
});

test("Ctrl+Enter scrolls the editor viewport to the NEW page after repagination",()=>{
 const before=simulator.indexOf('  function insertPageBreak(){');
 const end=simulator.indexOf('  function blockCommand(',before);
 const insert=simulator.slice(before,end);
 assert.match(insert,/insertManualWordPageBreak\(root\)/);
 assert.match(insert,/pageBreakScrollTarget\.current=caretElement\?\.closest\("p,h1,h2,h3,h4,blockquote"\)/);
 assert.match(insert,/rememberSelection\(\);\s*markChanged\(\)/);
 assert.match(simulator,/const pageScrollRef=useRef<HTMLDivElement>\(null\)/);
 assert.match(simulator,/const pageBreakScrollTarget=useRef<HTMLElement\|null>\(null\)/);
 assert.match(simulator,/<div ref=\{pageScrollRef\} className="wsl-page-scroll"/);
 const effect=simulator.slice(simulator.indexOf('  // Reflow after text and formatting changes'),simulator.indexOf('  const formatKeys:',simulator.indexOf('  // Reflow after text and formatting changes')));
 assert.match(effect,/const pages=paginateWordEditor\(root\)/);
 assert.match(effect,/target\?\.isConnected/);
 assert.match(effect,/target\.closest\("\[data-wsl-page\]"\)/);
 assert.match(effect,/pageBreakScrollTarget\.current=null/);
 assert.match(effect,/scrollWordPageIntoView\(pageScrollRef\.current,nextPage\)/);
 assert.match(effect,/document\.activeElement===root&&afterIndex>beforeIndex\?afterPage:null/,
   "naturally flowing to a new page should scroll as well");
 assert.match(effect,/setActivePage\(previous=>previous===afterIndex\?previous:afterIndex\)/);
 assert.match(simulator,/if\(event\.key==="Enter"&&\(event\.ctrlKey\|\|event\.metaKey\)\)/);
 assert.match(simulator,/\{id:"break",label:"Ngắt trang",run:insertPageBreak/);
});

test("Scrolling a new page respects current zoom and only moves document scroller",()=>{
 const begin=helper.indexOf('export function scrollWordPageIntoView(');
 assert.ok(begin>0);
 const code=helper.slice(begin).trim()
   .replace('export function scrollWordPageIntoView(','function scrollWordPageIntoView(')
   .replace('scroller:HTMLElement,page:HTMLElement','scroller,page')
   .replace('):void{','){');
 const scroll=runInNewContext('('+code+')',{});
 for(const zoom of [60,80,100,150,200]){
   let requested;
   const viewport={top:100,bottom:500};
   const page={getBoundingClientRect(){return {top:viewport.top+540*zoom/100}}};
   const scroller={
     scrollTop:40,scrollHeight:7000,clientHeight:400,
     getBoundingClientRect(){return viewport},
     scrollTo(options){requested=options}
   };
   scroll(scroller,page);
   assert.equal(requested.behavior,"smooth");
   assert.equal(requested.top,40+540*zoom/100-12,
     "rectangle already includes zoom: no second zoom multiplication");
 }
 const scroller={
   scrollTop:100,scrollHeight:500,clientHeight:400,
   getBoundingClientRect(){return{top:30}},
   scrollTo(opts){this.called=opts}
 };
 scroll(scroller,{getBoundingClientRect(){return{top:9999}}});
 assert.equal(scroller.called.top,100,"clamp beyond scroll maximum");
});


test("Caret on editor outer wrapper is rehomed inside page paragraph, never at paper left edge",()=>{
 const begin=helper.indexOf("export function ensureWordCaretInsideParagraph(");
 const end=helper.indexOf("export function savePageSelection(",begin);
 assert.ok(begin>=0&&end>begin);
 const code=helper.slice(begin,end).trim()
   .replace("export function ","function ")
   .replace("root:HTMLElement,preferred:HTMLElement|null=null","root,preferred=null")
   .replace("):boolean{","){")
   .replaceAll(" as Element","")
   .replaceAll(" as HTMLElement|null","")
   .replaceAll("querySelectorAll<HTMLElement>","querySelectorAll")
   .replaceAll("querySelector<HTMLElement>","querySelector");
 const paragraph={
   nodeType:1,tagName:"P",childNodes:[{nodeType:1,tagName:"BR"}],
   matches(query){return query.includes("p")},
   closest(query){
     if(query.includes("p,h1"))return this;
     if(query==="[data-wsl-page]")return page;
     return null;
   }
 };
 const page={
   nodeType:1,tagName:"DIV",childNodes:[{},paragraph],
   closest(query){return query==="[data-wsl-page]"?this:null},
   querySelectorAll(query){return query.includes("p")?[paragraph]:[]}
 };
 const root={
   nodeType:1,tagName:"DIV",children:[page],childNodes:[page],
   contains(node){return node===this||node===page||node===paragraph},
   closest(){return null},
   querySelector(){return paragraph}
 };
 const selection={
   isCollapsed:true,rangeCount:1,
   range:{startContainer:root,startOffset:0},
   getRangeAt(){return this.range},
   removeAllRanges(){this.rangeCount=0},
   addRange(range){this.range=range;this.rangeCount=1}
 };
 const doc={createRange(){return {
   startContainer:null,startOffset:0,
   selectNodeContents(node){this.startContainer=node;this.startOffset=0},
   collapse(){this.collapsed=true}
 }}};
 const ctx={window:{getSelection:()=>selection},document:doc,Node:{ELEMENT_NODE:1}};
 const repair=runInNewContext('('+code+')',ctx);
 assert.equal(repair(root),true,"repair caret on editor wrapper");
 assert.equal(selection.range.startContainer,paragraph);
 assert.equal(selection.range.startOffset,0,"caret should be at paragraph start, with A4 padding");
 assert.equal(repair(root),false,"valid paragraph caret must not move or reset");
 selection.range={startContainer:page,startOffset:1};
 assert.equal(repair(root),true,"caret between page gutter and paragraph is invalid");
 assert.equal(selection.range.startContainer,paragraph);
 selection.isCollapsed=false;
 selection.range={startContainer:root,startOffset:0};
 assert.equal(repair(root),false,"cross-paragraph highlighted selection must be preserved");
});

test("Word guards root/page caret on focus, typing, repagination and manual Ctrl+Enter",()=>{
 const caretFn=helper.slice(helper.indexOf("export function ensureWordCaretInsideParagraph("),
   helper.indexOf("export function savePageSelection("));
 assert.match(caretFn,/element\.closest\("p,h1,h2,h3,h4,blockquote,li,td,th"\)/);
 assert.match(caretFn,/if\(editableBlock&&root\.contains\(editableBlock\)\)return false/);
 assert.match(caretFn,/range\.selectNodeContents\(target\)/);
 assert.match(caretFn,/selection\.addRange\(range\)/);
 const repaginate=helper.slice(helper.indexOf("export function paginateWordEditor("),
   helper.indexOf("export function insertManualWordPageBreak("));
 assert.match(repaginate,/ensureWordCaretInsideParagraph\(root\)/);
 assert.match(repaginate,/restorePageSelection\(root,saved\);\s*ensureWordCaretInsideParagraph\(root\)/);
 assert.match(helper,/export function insertManualWordPageBreak\(root:HTMLElement\):boolean\{\s*[\s\S]*?ensureWordCaretInsideParagraph\(root\)/);
 assert.match(simulator,/onFocus=\{\(\)=>\{if\(editor\.current\)ensureWordCaretInsideParagraph\(editor\.current\);rememberSelection\(\);\}\}/);
 assert.match(simulator,/onBeforeInput=\{event=>\{[\s\S]*?ensureWordCaretInsideParagraph\(editor\.current\)/);
 assert.match(simulator,/onKeyDown=\{event=>\{[\s\S]*?ensureWordCaretInsideParagraph\(editor\.current\)/);
 const start=simulator.indexOf("  function insertPageBreak(){");
 const end=simulator.indexOf("  function blockCommand(",start);
 assert.match(simulator.slice(start,end),/if\(root\)ensureWordCaretInsideParagraph\(root\)/);
});
