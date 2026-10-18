import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const source=readFileSync("src/features/word-simulator/word-paragraph-marks.ts","utf8");
const simulator=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
const css=readFileSync("src/features/word-simulator/word-home-ribbon.css","utf8");

function getUpdater(){
 const javascript=source.replace(
   "export function syncWordParagraphMarkSizes(root:HTMLElement):void{",
   "function syncWordParagraphMarkSizes(root){"
 ).replace("querySelectorAll<HTMLElement>","querySelectorAll")
  .replace("const findLastText=(element:Element):Element|null=>{","const findLastText=(element)=>{")
  .replace("child as Element","child");
 let writes=0;
 const makeBlock=(tagName,children=[],fontSize="16px")=>{
   const styles=new Map();
   const el={nodeType:1,tagName,childNodes:children,fontSize,
     style:{
       getPropertyValue:key=>styles.get(key)||"",
       setProperty(key,value){styles.set(key,value);writes++}
     },
     matches:()=>false};
   for(const child of children)child.parentElement=el;
   return el;
 };
 const text=(value,owner)=>({nodeType:3,textContent:value,parentElement:owner});
 const scope={
   Node:{TEXT_NODE:3,ELEMENT_NODE:1},
   getComputedStyle:el=>({fontSize:el.fontSize})
 };
 const update=runInNewContext(javascript+";syncWordParagraphMarkSizes",scope);
 return {update,makeBlock,text,get writes(){return writes}};
}

test("Paragraph mark follows the size of the final formatted text, 8pt to 36pt",()=>{
 const {update,makeBlock,text}=getUpdater();
 for(const [pt,px] of [["8",10.667],["10",13.333],["12",16],["14",18.667],["18",24],["24",32],["36",48]]){
   const last=makeBlock("SPAN",[],px+"px");
   last.childNodes.push(text("Hello",last));
   const first=makeBlock("SPAN",[],"16px");
   first.childNodes.push(text("Prefix ",first));
   const p=makeBlock("P",[first,last]);
   const root={querySelectorAll:()=>[p]};
   update(root);
   assert.equal(p.style.getPropertyValue("--wsl-paragraph-mark-size"),px+"px",
     "paragraph mark must follow the actual last character in "+pt+"pt");
   assert.equal(p.childNodes.length,2,"mark updater must not rewrite editor DOM");
   assert.equal(last.childNodes[0].textContent,"Hello");
 }
});

test("Blank paragraph and pending untyped font format keep the mark at native caret size",()=>{
 const f=getUpdater();
 const br={nodeType:1,tagName:"BR",childNodes:[],matches:()=>false};
 const empty=f.makeBlock("P",[br],"16px");
 const pending=f.makeBlock("SPAN",[],"48px");
 pending.childNodes.push(f.text("\u200B",pending));
 const large=f.makeBlock("P",[pending],"16px");
 const heading=f.makeBlock("H1",[],"36px");
 heading.childNodes.push(f.text("Title",heading));
 const root={querySelectorAll:()=>[empty,large,heading]};
 for(let round=0;round<10;round++)f.update(root);
 assert.equal(empty.style.getPropertyValue("--wsl-paragraph-mark-size"),"16px");
 assert.equal(large.style.getPropertyValue("--wsl-paragraph-mark-size"),"48px");
 assert.equal(heading.style.getPropertyValue("--wsl-paragraph-mark-size"),"36px");
 assert.equal(f.writes,3,"no redundant DOM style mutations after repeated typing refresh");
 assert.match(simulator,/span\.style\.fontSize=\(sizes\[Number\(value\)-1\]\?\?"12"\)\+"pt"/);
 assert.match(simulator,/caret\.selectNodeContents\(span\)/,
   "the real blinking caret must stay inside the resized inline format span");
 assert.match(simulator,/syncWordParagraphMarkSizes\(editor\.current\)/);
 assert.match(simulator,/\},\[isReady,showMarks,revision,fontSize,orientation,margins\]\)/);
 assert.doesNotMatch(css,/caret-height\s*:/,"never overlay a fake fixed-size text cursor");
});

test("Selection margin uses standard arrow without any hover highlight",()=>{
 const selection=readFileSync("src/features/word-simulator/word-simulator.css","utf8");
 const rule=selection.match(/\.wsl-word-selection-gutter\{([^}]*)\}/);
 assert.ok(rule,"gutter styling must exist");
 assert.match(rule[1],/cursor:default;/);
 assert.match(rule[1],/background:transparent;/);
 assert.match(rule[1],/touch-action:none;/);
 assert.doesNotMatch(rule[1],/cursor:pointer;/);
 assert.doesNotMatch(selection,/\.wsl-word-selection-gutter:hover\s*\{/);
 assert.match(simulator,/onPointerDown=\{beginLineGutterSelection\}/);
 assert.match(simulator,/onPointerMove=\{moveLineGutterSelection\}/);
 assert.match(simulator,/onPointerUp=\{endLineGutterSelection\}/);
});
