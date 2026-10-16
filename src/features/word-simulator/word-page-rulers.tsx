"use client";

import {useLayoutEffect,useMemo,useRef,useState} from "react";
import {a4Dimensions} from "./word-paper-metrics";

const PX_PER_CM=96/2.54;
const PX_PER_QUARTER_CM=PX_PER_CM/4;

type Props={
  landscape:boolean;
  narrow:boolean;
  zoom:number;
  scrollLeft:number;
  scrollTop:number;
  axis:"horizontal"|"vertical";
  renderedPaperHeight?:number;
};

/** The gray ruler measures from the paper edge. The white editable-area ruler
 * is a separate, opaque layer and measures from its own left edge (0 cm). */
function HorizontalRulerTicks({landscape,narrow,zoom,scrollLeft}:{landscape:boolean;narrow:boolean;zoom:number;scrollLeft:number}){
  const rulerRef=useRef<HTMLDivElement>(null);
  const [paperGeometry,setPaperGeometry]=useState({left:0,viewportLeft:0,pixelRatio:1,editorOffset:0,editorWidth:0});
  const {width:paperWidth}=a4Dimensions(landscape);
  const scaledWidth=paperWidth*zoom/100;

  useLayoutEffect(()=>{
    const ruler=rulerRef.current;
    const paper=document.querySelector<HTMLElement>(".wsl-word-page-body .wsl-paper");
    const editor=document.querySelector<HTMLElement>(".wsl-word-page-body .wsl-editor");
    const scroller=document.querySelector<HTMLElement>(".wsl-word-page-body .wsl-page-scroll");
    if(!ruler||!paper||!editor)return;
    const align=()=>{
      const paperRect=paper.getBoundingClientRect();
      const editorRect=editor.getBoundingClientRect();
      const viewportLeft=paperRect.left;
      const left=viewportLeft-ruler.getBoundingClientRect().left;
      const editorOffset=editorRect.left-viewportLeft;
      const editorWidth=editorRect.width;
      const pixelRatio=window.devicePixelRatio||1;
      setPaperGeometry(previous=>
        Math.abs(previous.left-left)<0.01&&
        Math.abs(previous.viewportLeft-viewportLeft)<0.01&&
        Math.abs(previous.editorOffset-editorOffset)<0.01&&
        Math.abs(previous.editorWidth-editorWidth)<0.01&&
        previous.pixelRatio===pixelRatio
          ?previous:{left,viewportLeft,pixelRatio,editorOffset,editorWidth});
    };
    align();
    const observer=typeof ResizeObserver!=="undefined"?new ResizeObserver(align):null;
    observer?.observe(ruler);
    observer?.observe(paper);
    observer?.observe(editor);
    if(scroller)observer?.observe(scroller);
    window.addEventListener("resize",align);
    return ()=>{observer?.disconnect();window.removeEventListener("resize",align);};
  },[landscape,narrow,zoom,scrollLeft]);

  const ticks=useMemo(()=>{
    const step=PX_PER_QUARTER_CM*zoom/100;
    const count=Math.floor(scaledWidth/step+1e-8);
    return Array.from({length:count+1},(_,index)=>({
      index,
      left:index*step,
      kind:index%4===0?"cm":index%2===0?"half":"quarter"
    })).filter(tick=>tick.left<scaledWidth-1);
  },[scaledWidth,zoom]);

  // The inset white strip gets its own cm scale, restarting at zero on the
  // editable area's left boundary rather than continuing the page-wide scale.
  const contentTicks=useMemo(()=>{
    const step=PX_PER_QUARTER_CM*zoom/100;
    const count=Math.floor(paperGeometry.editorWidth/step+1e-8);
    return Array.from({length:count+1},(_,index)=>({
      index,
      left:index*step,
      kind:index%4===0?"cm":index%2===0?"half":"quarter"
    })).filter(tick=>tick.left<paperGeometry.editorWidth-1);
  },[paperGeometry.editorWidth,zoom]);

  // Round viewport-space coordinates to physical pixels rather than rounding
  // relative positions: otherwise fractional cm steps create uneven 1px strokes.
  const snapTick=(offset:number)=>{
    const {viewportLeft,pixelRatio}=paperGeometry;
    return Math.round((viewportLeft+offset)*pixelRatio)/pixelRatio-viewportLeft;
  };

  // Align both white boundaries to device pixels: the first inset tick is
  // exactly at the strip's left edge while all strokes remain sharp.
  const contentStart=snapTick(paperGeometry.editorOffset);
  const contentEnd=snapTick(paperGeometry.editorOffset+paperGeometry.editorWidth);

  return <div ref={rulerRef} className="wsl-word-horizontal-ruler" aria-hidden="true">
    <div className="wsl-word-ruler-cm-track" style={{left:paperGeometry.left,width:scaledWidth}}>
      {ticks.map(tick=><span key={tick.index}
        className={"wsl-word-ruler-cm-tick wsl-word-ruler-cm-tick-"+tick.kind}
        style={{left:snapTick(tick.left)}}/>)}
      <span className="wsl-word-ruler-cm-tick wsl-word-ruler-cm-tick-cm"
        style={{left:snapTick(Math.max(0,scaledWidth-1))}}/>
      <div className="wsl-word-ruler-content-strip"
        style={{left:contentStart,width:Math.max(0,contentEnd-contentStart)}}>
        {contentTicks.map(tick=><span key={tick.index}
          className={"wsl-word-ruler-cm-tick wsl-word-ruler-cm-tick-"+tick.kind}
          style={{left:snapTick(paperGeometry.editorOffset+tick.left)-contentStart}}/>)}
      </div>
    </div>
  </div>;
}

export function WordPageRulers({landscape,narrow,zoom,scrollLeft,scrollTop,axis,renderedPaperHeight}:Props){
  const {height:paperHeight}=a4Dimensions(landscape);
  const verticalHeight=renderedPaperHeight??paperHeight*zoom/100;
  if(axis==="horizontal")return <HorizontalRulerTicks landscape={landscape} narrow={narrow} zoom={zoom} scrollLeft={scrollLeft}/>;
  return <div className="wsl-word-vertical-ruler" aria-hidden="true"
    style={{top:`calc(var(--wsl-page-top-offset, 13px) - ${scrollTop}px)`,height:verticalHeight}}/>;
}
