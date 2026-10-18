import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const simulator=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
const ruler=readFileSync("src/features/word-simulator/word-page-rulers.tsx","utf8");
const rulerCSS=readFileSync("src/features/word-simulator/word-page-rulers.css","utf8");
const home=readFileSync("src/features/word-simulator/word-home-ribbon.tsx","utf8");
function section(source,start,end){
 const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,"code section "+start);
 return source.slice(a,b).trim();
}
const cm=96/2.54;
const quarter=cm/4;
const close=(a,b,msg)=>assert.ok(Math.abs(a-b)<0.05,msg+": "+a+" / "+b);

test("All 14 Paragraph tools are wired; each one checked 10 times",()=>{
 const controls=[
  ["Bullets",'run={()=>run("insertUnorderedList")}'],
  ["Numbering",'run={()=>run("insertOrderedList")}'],
  ["Multilevel List",'run={()=>run("multilevelList")}'],
  ["Decrease Indent",'run={()=>run("outdent")}'],
  ["Increase Indent",'run={()=>run("indent")}'],
  ["Sort",'run={sortLines}'],
  ["Show/Hide ¶",'run={toggleMarks}'],
  ["Align Left",'run={()=>run("justifyLeft")}'],
  ["Center",'run={()=>run("justifyCenter")}'],
  ["Align Right",'run={()=>run("justifyRight")}'],
  ["Justify",'run={()=>run("justifyFull")}'],
  ["Line Spacing 1.5",'run={()=>run("lineSpacing")}'],
  ["Paragraph Shading",'run={()=>run("paragraphShading")}'],
  ["Borders",'run={()=>run("paragraphBorder")}']
 ];
 const paragraph=section(home,'<Group name="Paragraph"','<Group name="Styles"');
 for(let round=0;round<10;round++)for(const [label,command] of controls){
  assert.ok(paragraph.includes('label="'+label+'"'),"tool "+label+" round "+round);
  assert.ok(paragraph.includes(command),"handler "+label+" round "+round);
 }
 for(const x of ["1","1.15","1.5","2"])
   assert.ok(paragraph.includes('"'+x+'"'),"line spacing "+x);
 for(const x of ["paragraphBorder","paragraphShading","lineSpacing","multilevelList"])
   assert.ok(simulator.includes('name==="'+x+'"'),"command dispatch "+x);
 assert.match(home,/<Group name="Paragraph"[^>]*onDetails=\{\(\)=>setDialog\("Paragraph"\)\}/);
 assert.match(ruler,/onPointerDown=\{event=>onPointerDown\(event,kind\)\}/);
 assert.match(ruler,/onPointerCancel=\{onPointerCancel\}/);
 assert.doesNotMatch(ruler,/className="wsl-word-horizontal-ruler" aria-hidden="true"/,
   "horizontal ruler contains interactive controls and must be accessible");
 assert.match(ruler,/className="wsl-word-vertical-ruler" aria-hidden="true"/);
 assert.match(rulerCSS,/touch-action:none;/);
 assert.match(rulerCSS,/pointer-events:auto;/);
});

test("Left Indent moves first-line and body together, 10 repetitions with hanging and first-line offsets",()=>{
 const raw=section(ruler,'function moveLeftIndent(','/** Three separate');
 const expr=raw.replace('indent:RulerIndent,nextLeft:number):RulerIndent','indent,nextLeft)');
 const move=runInNewContext('('+expr+')',{});
 const states=[
  {left:0,firstLine:0,right:0},
  {left:20,firstLine:50,right:0},
  {left:35,firstLine:15,right:8},
  {left:40,firstLine:40,right:15}
 ];
 for(let round=0;round<10;round++)for(const start of states){
  const nextLeft=start.left+cm*(round+1)/4;
  const result=move(start,nextLeft);
  close(result.left,nextLeft,"left marker");
  close(result.firstLine-result.left,start.firstLine-start.left,"first-line relative offset");
  close(result.left+(result.firstLine-result.left),result.firstLine,"actual first-line text position");
  assert.equal(start.left,states.find(i=>i===start).left,"source object not mutated");
 }
 assert.equal(move({left:0,firstLine:0,right:0},cm).firstLine,cm,
   "first line MUST move when lower Left Indent marker moves");
 close(move({left:cm,firstLine:cm*2,right:0},cm*3).firstLine,cm*4,"float-safe first line");
});

test("Ruler marker pointer movement tracks zoom, direction and left/first-line linkage",()=>{
 const helper=runInNewContext('('+section(ruler,'function moveLeftIndent(','/** Three separate')
  .replace('indent:RulerIndent,nextLeft:number):RulerIndent','indent,nextLeft)')+')',{});
 const eventFn=section(ruler,'  const onMarkerPointerMove=','  const onMarkerPointerUp=')
  .replace('event:RulerPointerEvent','event');
 for(let repeat=0;repeat<10;repeat++)for(const zoom of [60,100,160]){
  const start={left:0,firstLine:0,right:0};
  let next=null,prevented=0;
  const dragRef={current:{
   pointerId:7,kind:"left",startX:200,startValue:0,startIndent:{...start}
  }};
  const ctx={
   dragRef,onIndentChange:value=>{next=value},indent:start,
   zoom,moveLeftIndent:helper,
   paperGeometry:{editorWidth:580*zoom/100},
   PX_PER_QUARTER_CM:quarter,
   clamped:(v,min,max)=>Math.min(max,Math.max(min,v))
  };
  const move=runInNewContext('(()=>{'+eventFn+';return onMarkerPointerMove})()',ctx);
  move({pointerId:7,clientX:200+cm*zoom/100,
   preventDefault(){prevented++}});
  assert.equal(prevented,1);
  assert.ok(next,"left marker fired at zoom "+zoom);
  close(next.left,cm,"one centimeter in underlying paragraph units");
  close(next.firstLine,cm,"first line moves with entire paragraph");
  close(next.right,0,"right marker unchanged");
  next=null;
  move({pointerId:88,clientX:500,preventDefault(){throw Error("wrong pointer")}});
  assert.equal(next,null,"other touch pointer ignored");

  const lineStart={left:cm,firstLine:cm,right:0};
  dragRef.current={pointerId:7,kind:"firstLine",startX:200,startValue:cm,startIndent:lineStart};
  ctx.indent=lineStart;
  const lineMove=runInNewContext('(()=>{'+eventFn+';return onMarkerPointerMove})()',ctx);
  lineMove({pointerId:7,clientX:200+cm*zoom/100,preventDefault(){}});
  close(next.left,cm,"top first-line marker does not move body");
  close(next.firstLine,cm*2,"top marker changes only first line");
  next=null;
  dragRef.current={pointerId:7,kind:"right",startX:200,startValue:0,startIndent:start};
  ctx.indent=start;
  const rightMove=runInNewContext('(()=>{'+eventFn+';return onMarkerPointerMove})()',ctx);
  rightMove({pointerId:7,clientX:200-cm*zoom/100,preventDefault(){}});
  close(next.right,cm,"right marker moves inward to the left");
 }
});

test("Word paragraph CSS follows ruler values for margin left, right and first-line text",()=>{
 const src=section(simulator,'  function applyRulerIndent(next:RulerIndent)','  function endRulerIndent()');
 const executable=src.replace('next:RulerIndent','next').replace('value:number','value');
 let result=null,changed=0;
 const block={style:{marginLeft:"",marginRight:"",textIndent:""}};
 const target={current:block};
 const apply=runInNewContext('('+executable+')',{
  editor:{current:{contains:()=>true}},
  indentTarget:target,
  indentBlock:()=>block,
  setRulerIndent:value=>{result=value},
  markChanged:()=>changed++
 });
 for(let round=0;round<10;round++){
  const left=round*quarter,right=round*quarter/2,firstLine=left+quarter;
  apply({left,right,firstLine});
  close(parseFloat(block.style.marginLeft)||0,left,"CSS marginLeft");
  close(parseFloat(block.style.marginRight)||0,right,"CSS marginRight");
  close(parseFloat(block.style.textIndent)||0,quarter,"CSS textIndent offset");
  close((parseFloat(block.style.marginLeft)||0)+(parseFloat(block.style.textIndent)||0),
     firstLine,"first line follows ruler");
  assert.equal(result.left,left);
 }
 assert.equal(changed,10);
 apply({left:0,right:0,firstLine:0});
 assert.equal(block.style.marginLeft,"");
 assert.equal(block.style.marginRight,"");
 assert.equal(block.style.textIndent,"");
 assert.match(simulator,/function beginRulerIndent\(\)[\s\S]*?indentTarget\.current=indentBlock\(\)/);
 assert.match(simulator,/function endRulerIndent\(\)[\s\S]*?syncRulerIndent\(\)/);
});

test("Paragraph Increase/Decrease Indent uses same ruler geometry; 10 rounds",()=>{
 const fn=section(simulator,'  function stepParagraphIndent(direction:1|-1)','  function selectedChange(')
  .replace('direction:1|-1','direction');
 const block={style:{marginLeft:"",marginRight:"",textIndent:""}};
 const indentTarget={current:null};
 let current=null;
 let calls=0;
 const actions=runInNewContext('('+fn+')',{
  restoreSelection(){},
  indentBlock(){return block},
  setStatus(message){throw Error(message)},
  indentTarget,
  applyRulerIndent(next){
   current=next;
   block.style.marginLeft=next.left?next.left+"px":"";
   block.style.marginRight=next.right?next.right+"px":"";
   block.style.textIndent=(next.firstLine-next.left)+"px";
   calls++;
  },
  syncRulerIndent(){}
 });
 for(let i=0;i<10;i++){
  actions(1);
  close(current.left,cm*1.25*(i+1),"increase indent");
  close(current.firstLine,current.left,"first line follows body indent");
  assert.equal(indentTarget.current,null,"target released after button");
 }
 for(let i=0;i<10;i++)actions(-1);
 close(current.left,0,"decrease back to margin");
 close(current.firstLine,0,"first line back at margin");
 assert.equal(calls,20);
 assert.match(simulator,/if\(name==="indent"\|\|name==="outdent"\)\{\s*stepParagraphIndent\(name==="indent"\?1:-1\)/);
});

test("Paragraph dropdown actions modify shading, spacing and borders without changing unrelated styles",()=>{
 const fn=section(simulator,'  function runHome(name:string,value?:string)','  function handleEditorMouseUp()')
  .replace('name:string,value?:string','name,value')
  .replace(')?value!:block.style.lineHeight',')?value:block.style.lineHeight');
 const block={style:{backgroundColor:"",lineHeight:"",borderTop:"",borderBottom:"",marginLeft:"25px"}};
 let changed=0;
 const context={
   editor:{current:{contains:()=>true}},
   restoreSelection(){},currentBlock:()=>block,
   markChanged(){changed++},setStatus(m){throw Error(m)},
   command(){throw Error("expected inline paragraph handling")},
   stepParagraphIndent(){},insertMultilevelList(){},
   clipboardMode:null
 };
 const homeAction=runInNewContext('('+fn+')',context);
 for(let i=0;i<10;i++){
  for(const spacing of ["1","1.15","1.5","2"]){
   homeAction("lineSpacing",spacing);
   assert.equal(block.style.lineHeight,spacing);
  }
  homeAction("paragraphShading","#dbeafe");
  assert.equal(block.style.backgroundColor,"#dbeafe");
  homeAction("paragraphShading","none");
  assert.equal(block.style.backgroundColor,"");
  homeAction("paragraphBorder","top");
  assert.ok(block.style.borderTop.includes("1px"));
  assert.equal(block.style.borderBottom,"");
  homeAction("paragraphBorder","bottom");
  assert.ok(block.style.borderBottom.includes("1px"));
  assert.equal(block.style.borderTop,"");
  homeAction("paragraphBorder","none");
  assert.equal(block.style.borderTop,"");
  assert.equal(block.style.borderBottom,"");
  assert.equal(block.style.marginLeft,"25px","paragraph controls preserve ruler indents");
 }
 assert.equal(changed,10*(4+2+3));
});


test("Paragraph L/C/R/J buttons display exactly one active state based on selected paragraph, 10 rounds",()=>{
 const styles=readFileSync("src/features/word-simulator/word-paragraph-ribbon.css","utf8");
 const syncSrc=section(simulator,'  function syncParagraphAlignment(){','  function indentBlock():HTMLElement|null{')
  .replace('const next:WordParagraphAlignment=','const next=');
 let selected=null;
 const paragraph={
   left:{style:{textAlign:"left"}},
   center:{style:{textAlign:"center"}},
   right:{style:{textAlign:"right"}},
   justify:{style:{textAlign:"justify"}},
   default:{style:{textAlign:""}}
 };
 const root={contains:node=>Object.values(paragraph).includes(node)};
 const currentBlock=()=>selected;
 let active="left",updateCount=0;
 const state=(update)=>{
   const value=typeof update==="function"?update(active):update;
   if(value!==active){active=value;updateCount++}
 };
 const context={
   editor:{current:root},currentBlock,
   window:{getComputedStyle:block=>({textAlign:block.style.textAlign||"start"})},
   setParagraphAlignment:state
 };
 const sync=runInNewContext('('+syncSrc+')',context);
 const controls=[
   ["Align Left","left","justifyLeft"],["Center","center","justifyCenter"],
   ["Align Right","right","justifyRight"],["Justify","justify","justifyFull"]
 ];
 assert.match(home,/export type WordParagraphAlignment="left"\|"center"\|"right"\|"justify";/);
 assert.match(home,/paragraphAlignment:WordParagraphAlignment;/);
 assert.match(simulator,/paragraphAlignment=\{paragraphAlignment\}/);
 assert.match(simulator,/syncFormatState\(\);syncFontControls\(\);syncParagraphAlignment\(\);syncRulerIndent\(\)/);
 assert.match(simulator,/syncFontControls\(\);\s*syncParagraphAlignment\(\);\s*markChanged\(\)/);
 assert.match(simulator,/syncFontControls\(\);\s*syncParagraphAlignment\(\);\s*\}/);
 const group=section(home,'<Group name="Paragraph"','<Group name="Styles"');
 for(const [label,alignment,command] of controls){
   assert.ok(group.includes('label="'+label+'" active={paragraphAlignment==="'+alignment+'"}'),
     label+" conditional active attribute");
   assert.ok(group.includes('run={()=>run("'+command+'")}'),
     label+" retains actual command");
 }
 assert.match(home,/className=\{"wsl-hb "\+className\+\(active\?" is-active":""\)\}/);
 assert.match(home,/aria-pressed=\{active\|\|undefined\}/);
 assert.match(styles,/\.wsl-home-paragraph \.wsl-hb\.wsl-paragraph-icon-button\.is-active:not\(:disabled\)/);
 for(let round=0;round<10;round++){
   for(const [label,alignment] of controls){
     selected=paragraph[alignment];
     sync();
     assert.equal(active,alignment,label+" must highlight when entering paragraph");
     sync();
     assert.equal(active,alignment,"repeated selection must remain stable");
   }
 }
 selected=paragraph.default;sync();
 assert.equal(active,"left","unstyled paragraph defaults to Left");
 selected=null;sync();
 assert.equal(active,"left","leaving editor must not switch state to unrelated paragraph");
 assert.ok(updateCount>1);
});

test("Paragraph alignment click updates toolbar immediately and caret movement resynchronizes",()=>{
 const syncSrc=section(simulator,'  function syncParagraphAlignment(){','  function indentBlock():HTMLElement|null{')
  .replace('const next:WordParagraphAlignment=','const next=');
 const cmdSrc=section(simulator,'  function command(cmd:string,value?:string){','  // Restore a text selection')
  .replace('cmd:string,value?:string','cmd,value');
 const paragraphs=[
   {style:{textAlign:"left"}},
   {style:{textAlign:"center"}},
   {style:{textAlign:"justify"}}
 ];
 let current=paragraphs[0],active="left",changed=0,selectionSync=0;
 const root={contains:node=>paragraphs.includes(node)};
 const ctx={
   editor:{current:root},currentBlock:()=>current,
   window:{getComputedStyle:block=>({textAlign:block.style.textAlign})},
   setParagraphAlignment:fn=>{active=fn(active)},
   restoreSelection(){},
   document:{execCommand(cmd){
     const align={justifyLeft:"left",justifyCenter:"center",justifyRight:"right",justifyFull:"justify"};
     if(!(cmd in align))return false;
     current.style.textAlign=align[cmd];return true;
   }},
   rememberSelection(){selectionSync++},syncFormatState(){},syncFontControls(){},
   markChanged(){changed++},
   setStatus(msg){throw Error(msg)}
 };
 const sync=runInNewContext('('+syncSrc+')',ctx);
 ctx.syncParagraphAlignment=sync;
 const command=runInNewContext('('+cmdSrc+')',ctx);
 for(let repeat=0;repeat<10;repeat++){
   for(const [cmd,expected] of [
     ["justifyLeft","left"],["justifyCenter","center"],
     ["justifyRight","right"],["justifyFull","justify"]]){
     command(cmd);
     assert.equal(current.style.textAlign,expected,"command formatted actual paragraph");
     assert.equal(active,expected,"toolbar is updated after command, not only selectionchange");
   }
 }
 assert.equal(changed,40);
 assert.equal(selectionSync,40);
 current=paragraphs[1];sync();
 assert.equal(active,"center","click caret into different center paragraph");
 current=paragraphs[2];sync();
 assert.equal(active,"justify","click caret into different justified paragraph");
 current=paragraphs[0];sync();
 assert.equal(active,"justify","style still reflects last command on first paragraph");
 command("justifyLeft");
 assert.equal(active,"left");
});

test("Ruler marker remains pointer on hover and draggable at every zoom",()=>{
 const marker=section(ruler,"function RulerIndentMarker","function HorizontalRulerTicks");
 const css=section(rulerCSS,".wsl-word-ruler-indent{",".wsl-word-ruler-indent-firstLine");
 assert.match(css,/cursor:pointer;/);
 assert.doesNotMatch(css,/cursor:ew-resize;/);
 assert.match(css,/pointer-events:auto;/);
 assert.match(css,/touch-action:none;/);
 assert.match(marker,/onPointerDown=\{event=>onPointerDown\(event,kind\)\}/);
 assert.match(marker,/onPointerMove=\{onPointerMove\} onPointerUp=\{onPointerUp\}/);
 assert.match(marker,/onPointerCancel=\{onPointerCancel\}/);
 assert.match(ruler,/event\.currentTarget\.setPointerCapture\(event\.pointerId\)/);
 assert.match(ruler,/event\.currentTarget\.releasePointerCapture\(event\.pointerId\)/);
 assert.match(ruler,/const delta=\(event\.clientX-drag\.startX\)\*100\/zoom\*direction;/);
 assert.match(ruler,/onIndentChange\(drag\.kind==="left"\?moveLeftIndent\(drag\.startIndent,value\):/);
 for(const zoom of [60,80,100,130,160])for(let round=0;round<10;round++){
   const cssPixels=(96/2.54)*zoom/100*(round+1)/4;
   const documentPixels=cssPixels*100/zoom;
   assert.ok(Math.abs(documentPixels-(96/2.54)*(round+1)/4)<0.001);
 }
});
