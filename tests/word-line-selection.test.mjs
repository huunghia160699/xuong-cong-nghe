import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const helper=readFileSync("src/features/word-simulator/word-line-selection.ts","utf8");
const editor=readFileSync("src/features/word-simulator/word-simulator.tsx","utf8");
const css=readFileSync("src/features/word-simulator/word-simulator.css","utf8");

function getFunctions(textNodes){
  const js=helper.replace(/export type WordVisualLine=\{[\s\S]*?\};\s*/,"")
    .replaceAll("export function ","function ")
    .replace('root:HTMLElement):WordVisualLine[]','root)')
    .replace('const lines:WordVisualLine[]=[]','const lines=[]')
    .replaceAll(" as Text","")
    .replace('lines:WordVisualLine[],clientY:number):number','lines,clientY)')
    .replace('lines:WordVisualLine[],anchor:number,\n  current:number,selection:Selection|null):boolean',
      'lines,anchor,\n  current,selection)');
  let nodeIndex=0;
  const selected={ranges:[],removeAllRanges(){this.ranges=[]},
    addRange(range){this.ranges.push(range)}};
  const document={
    createTreeWalker(){nodeIndex=0;return{
      currentNode:null,
      nextNode(){this.currentNode=textNodes[nodeIndex++];return Boolean(this.currentNode)}
    }},
    createRange(){return{
      start:null,end:null,
      setStart(node,offset){this.start={node,offset}},
      setEnd(node,offset){this.end={node,offset}},
      getBoundingClientRect(){
        const node=this.start.node;
        const top=node.tops[this.start.offset];
        return {top,bottom:top+18,height:18,left:100,width:9}
      }
    }}
  };
  const result=runInNewContext(js+";({collectWordVisualLines,wordLineAtY,selectWordVisualLines})",
    {document,NodeFilter:{SHOW_TEXT:4}});
  return {...result,selection:selected};
}

test("Left-margin click selects exactly one rendered visual line even when a paragraph wraps",()=>{
 const first={data:"helloWORLD",tops:[100,100,100,100,100,124,124,124,124,124]};
 const formatted={data:"SUP",tops:[124,124,124]};
 const next={data:"third",tops:[148,148,148,148,148]};
 const {collectWordVisualLines,wordLineAtY,selectWordVisualLines,selection}=
   getFunctions([first,formatted,next]);
 const lines=collectWordVisualLines({});
 assert.equal(lines.length,3,"wrapped text and inline marks form three visual rows");
 assert.equal(lines[0].startNode,first);
 assert.equal(lines[0].startOffset,0);
 assert.equal(lines[0].endOffset,5);
 assert.equal(lines[1].startNode,first);
 assert.equal(lines[1].startOffset,5);
 assert.equal(lines[1].endNode,formatted,"inline SUP belongs to the same visual line");
 assert.equal(lines[1].endOffset,3);
 assert.equal(wordLineAtY(lines,107),0);
 assert.equal(wordLineAtY(lines,133),1);
 assert.equal(wordLineAtY(lines,157),2);
 assert.equal(selectWordVisualLines(lines,1,1,selection),true);
 assert.equal(selection.ranges[0].start.node,first);
 assert.equal(selection.ranges[0].start.offset,5);
 assert.equal(selection.ranges[0].end.node,formatted);
 assert.equal(selection.ranges[0].end.offset,3);
});

test("Dragging in left margin selects consecutive lines in either direction",()=>{
 const paragraphs=[
   {data:"aaaa",tops:[70,70,70,70]},
   {data:"bbbb",tops:[96,96,96,96]},
   {data:"cccc",tops:[123,123,123,123]}
 ];
 const {collectWordVisualLines,wordLineAtY,selectWordVisualLines,selection}=
   getFunctions(paragraphs);
 const lines=collectWordVisualLines({});
 assert.equal(lines.length,3);
 for(let repeat=0;repeat<10;repeat++){
   const anchor=wordLineAtY(lines,101);
   selectWordVisualLines(lines,anchor,wordLineAtY(lines,128),selection);
   assert.equal(selection.ranges[0].start.node,paragraphs[1]);
   assert.equal(selection.ranges[0].end.node,paragraphs[2]);
   selectWordVisualLines(lines,anchor,wordLineAtY(lines,76),selection);
   assert.equal(selection.ranges[0].start.node,paragraphs[0]);
   assert.equal(selection.ranges[0].end.node,paragraphs[1]);
 }
 assert.equal(wordLineAtY([],100),-1);
 assert.equal(selectWordVisualLines([],0,0,selection),false);
});

test("Gutter is outside contentEditable and preserves Word's normal editing interactions",()=>{
 assert.match(editor,/import \{collectWordVisualLines,wordLineAtY,selectWordVisualLines,type WordVisualLine\}/);
 assert.match(editor,/className="wsl-word-selection-gutter" role="presentation"/);
 const gutter=editor.indexOf('className="wsl-word-selection-gutter"');
 const editable=editor.indexOf('className={"wsl-editor "',gutter);
 assert.ok(gutter>=0&&editable>gutter,"gutter is sibling of editor");
 assert.match(editor,/onPointerDown=\{beginLineGutterSelection\}/);
 assert.match(editor,/onPointerMove=\{moveLineGutterSelection\}/);
 assert.match(editor,/onPointerUp=\{endLineGutterSelection\}/);
 assert.match(editor,/onPointerCancel=\{endLineGutterSelection\}/);
 assert.match(editor,/event\.currentTarget\.setPointerCapture\(event\.pointerId\)/);
 assert.match(editor,/event\.currentTarget\.releasePointerCapture\(event\.pointerId\)/);
 assert.match(editor,/editor\.current\.focus\(\{preventScroll:true\}\)/);
 assert.match(editor,/rememberSelection\(\)/);
 assert.match(css,/\.wsl-word-layout \.wsl-paper\{position:relative\}/);
 assert.match(css,/\.wsl-word-selection-gutter\{[^}]*position:absolute;[^}]*top:calc\(var\(--wsl-paper-top-margin,86px\) \+ 1px\);[^}]*width:calc\(var\(--wsl-paper-side-margin,87px\) - 2px\);/s);
 assert.match(css,/\.wsl-word-selection-gutter\{[^}]*touch-action:none;/s);
 assert.match(css,/@media print\{\.wsl-word-selection-gutter\{display:none!important\}\}/);
 assert.match(editor,/contentEditable suppressContentEditableWarning spellCheck=\{spellcheck\}/);
});
