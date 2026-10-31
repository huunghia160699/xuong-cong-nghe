import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const base="src/features/word-simulator/";
const ribbon=readFileSync(base+"word-home-ribbon.tsx","utf8");
const split=readFileSync(base+"word-split-button.tsx","utf8");
const css=readFileSync(base+"word-split-ribbon.css","utf8");
const dialog=readFileSync(base+"word-line-spacing-dialog.tsx","utf8");
const editor=readFileSync(base+"word-simulator.tsx","utf8");

test("Line Spacing opens a custom Word-like menu, not a native dropdown",()=>{
  assert.match(ribbon,/menuVariant="line-spacing"/);
  assert.match(ribbon,/\.\.\.WORD_LINE_SPACING_VALUES\.map\(value=>\(/);
  assert.match(ribbon,/label:"Line Spacing Options\.\.\."/);
  assert.match(ribbon,/Add Space Before Paragraph/);
  assert.match(ribbon,/Remove Space After Paragraph/);
  assert.match(ribbon,/separatorBefore:true/);
  assert.match(ribbon,/WordParagraphSpaceGlyph kind="before"/);
  assert.match(ribbon,/WordParagraphSpaceGlyph kind="after"/);
  assert.match(dialog,/WORD_LINE_SPACING_VALUES=\["1","1\.15","1\.5","2","2\.5","3"\]/);
  assert.match(dialog,/value\+".0"/);
  assert.match(split,/className=\{"wsl-split-menu"\+\(menuVariant==="line-spacing"/);
  assert.match(split,/role="menu"/);
  assert.match(split,/role="menuitem"/);
  assert.match(split,/aria-current=\{option\.selected/);
  assert.match(split,/\["ArrowDown","ArrowUp","Home","End"\]/);
  assert.match(css,/\.wsl-split-menu\.wsl-line-spacing-menu\{/);
  assert.match(css,/width:264px/);
  assert.match(css,/\.wsl-line-spacing-menu \.wsl-split-menu-item\.is-selected/);
  assert.doesNotMatch(dialog,/<select\s/i,"options dialog must not use native select");
  assert.doesNotMatch(ribbon,/<select\s/i,"ribbon must not use native select");
});

test("Line spacing actions apply to every selected paragraph and survive serialization",()=>{
  const start=editor.indexOf("  function runHome(name:string,value?:string)");
  const end=editor.indexOf("  function handleEditorMouseUp()",start);
  assert.ok(start>=0&&end>start);
  const source=editor.slice(start,end).trim().replace("name:string,value?:string","name,value");
  const one={style:{lineHeight:"",marginTop:"",marginBottom:""}};
  const two={style:{lineHeight:"",marginTop:"",marginBottom:""}};
  let saves=0;
  const ctx={beginHistory(){},
    editor:{current:{contains:()=>true}},
    restoreSelection(){},currentBlock:()=>one,
    selectedParagraphBlocks:()=>[one,two],
    markChanged(){saves++},syncParagraphSpacing(){},
    WORD_LINE_SPACING_VALUES:["1","1.15","1.5","2","2.5","3"],
    paragraphSpacing:{line:"1.15",before:0,after:8},
    setStatus(message){throw Error(message)},
    command(){throw Error("unexpected native execCommand")},
    stepParagraphIndent(){},insertMultilevelList(){},clipboardMode:null
  };
  const run=runInNewContext("("+source+")",ctx);
  for(const value of ["1","1.15","1.5","2","2.5","3"]){
    run("lineSpacing",value);
    assert.equal(one.style.lineHeight,value);
    assert.equal(two.style.lineHeight,value);
  }
  run("paragraphSpacingOptions","1.5|12|18");
  assert.equal(one.style.lineHeight,"1.5");
  assert.equal(two.style.marginTop,"12px");
  assert.equal(two.style.marginBottom,"18px");
  const prior=saves;
  run("paragraphSpacingOptions","4|0|0");
  run("paragraphSpacingOptions","1.5|-1|3");
  assert.equal(saves,prior,"invalid spacing must not mutate paragraphs");
  ctx.paragraphSpacing={line:"1.5",before:12,after:18};
  run("paragraphSpaceBeforeToggle");
  run("paragraphSpaceAfterToggle");
  assert.equal(one.style.marginTop,"0px");
  assert.equal(two.style.marginBottom,"0px");
  ctx.paragraphSpacing={line:"1.5",before:0,after:0};
  run("paragraphSpaceBeforeToggle");
  run("paragraphSpaceAfterToggle");
  assert.equal(one.style.marginTop,"8px");
  assert.equal(two.style.marginBottom,"8px");
  assert.match(editor,/2\(\?:\\\.\(\?:0\|5\)\)\?/,"2.5 must be allowed by sanitization");
  assert.match(editor,/3\(\?:\\\.0\)\?/,"3.0 must be allowed by sanitization");
});

test("Line Spacing Options dialog has custom buttons, editable values and escape handling",()=>{
  assert.match(dialog,/role="dialog" aria-modal="true"/);
  assert.match(dialog,/className=\{"wsl-spacing-choice"\+\(line===value/);
  assert.match(dialog,/aria-pressed=\{line===value\}/);
  assert.match(dialog,/type="number" min="0" max="99"/);
  assert.match(dialog,/onApply\(\{line,before:parsedBefore,after:parsedAfter\}\)/);
  assert.match(dialog,/event\.key==="Escape"/);
  assert.match(ribbon,/onApply=\{next=>run\("paragraphSpacingOptions"/);
  assert.match(editor,/syncParagraphSpacing\(\)/);
});
