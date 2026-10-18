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
  indent?:RulerIndent;
  onIndentStart?:(kind:RulerIndentPart)=>void;
  onIndentChange?:(value:RulerIndent)=>void;
  onIndentEnd?:()=>void;
};

export type RulerIndent={firstLine:number;left:number;right:number};
type RulerIndentPart=keyof RulerIndent;

type RulerPointerEvent=React.PointerEvent<HTMLButtonElement>;

// The lower Left Indent handle moves the whole paragraph, INCLUDING its
// first-line mark. The top handle adjusts only the first line (Word behavior).
function moveLeftIndent(indent:RulerIndent,nextLeft:number):RulerIndent{
  return {...indent,left:nextLeft,firstLine:Math.max(0,nextLeft+indent.firstLine-indent.left)};
}

/** Three independently draggable indent handles, all 12px wide.
 * First Line (top): short rectangular cap and a down-pointing tip.
 * Left (bottom): same up-pointing body as Right, plus a lower rectangle.
 * Right (bottom): up-pointing tip and shortened rectangular body. */
function RulerIndentMarker({kind,left,onPointerDown,onPointerMove,onPointerUp,onPointerCancel}:{
  kind:RulerIndentPart;
  left:number;
  onPointerDown:(event:RulerPointerEvent,kind:RulerIndentPart)=>void;
  onPointerMove:(event:RulerPointerEvent)=>void;
  onPointerUp:(event:RulerPointerEvent)=>void;
  onPointerCancel:(event:RulerPointerEvent)=>void;
}){
  const label=kind==="firstLine"?"Thụt lề dòng đầu":kind==="left"?"Thụt lề trái":"Thụt lề phải";
  return <button type="button"
    className={"wsl-word-ruler-indent wsl-word-ruler-indent-"+kind}
    style={{left}} aria-label={label} title={label}
    onPointerDown={event=>onPointerDown(event,kind)}
    onPointerMove={onPointerMove} onPointerUp={onPointerUp}
    onPointerCancel={onPointerCancel}>
    <svg className="wsl-word-ruler-indent-svg"
      viewBox={kind==="left"?"0 0 12 14":"0 0 12 10"}
      width="12" height={kind==="left"?14:10} focusable="false" aria-hidden="true">
      {kind==="firstLine"?
        <path d="M.5 .5H11.5V4.5L6 8.5L.5 4.5Z"
          fill="#fff" stroke="#818181" strokeWidth="1" strokeLinejoin="miter"/>:
        <>
          {/* Same short up-pointing house for Left and Right Indent. */}
          <path d="M.5 4.5L6 .5L11.5 4.5V8.5H.5Z"
            fill="#fff" stroke="#818181" strokeWidth="1" strokeLinejoin="miter"/>
          {/* The additional bottom bar distinguishes Left from Right. */}
          {kind==="left"&&<>
            <rect x=".5" y="8.5" width="11" height="5" fill="#fff"/>
            <path d="M.5 8.5V13.5H11.5V8.5" fill="none"
              stroke="#818181" strokeWidth="1"/>
          </>}
        </>}
    </svg>
  </button>;
}
function HorizontalRulerTicks({landscape,narrow,zoom,scrollLeft,indent,onIndentStart,onIndentChange,onIndentEnd}:{
  landscape:boolean;narrow:boolean;zoom:number;scrollLeft:number;
  indent:RulerIndent;
  onIndentStart?:(kind:RulerIndentPart)=>void;
  onIndentChange?:(value:RulerIndent)=>void;
  onIndentEnd?:()=>void;
}){
  const rulerRef=useRef<HTMLDivElement>(null);
  const [paperGeometry,setPaperGeometry]=useState({left:0,viewportLeft:0,pixelRatio:1,editorOffset:0,editorWidth:0});
  const {width:paperWidth}=a4Dimensions(landscape);
  const scaledWidth=paperWidth*zoom/100;
  const dragRef=useRef<{pointerId:number;kind:RulerIndentPart;startX:number;startValue:number;startIndent:RulerIndent}|null>(null);
  const clamped=(value:number,min:number,max:number)=>Math.min(max,Math.max(min,value));
  const onMarkerPointerDown=(event:RulerPointerEvent,kind:RulerIndentPart)=>{
    if(!onIndentChange||!event.isPrimary||event.button!==0)return;
    event.preventDefault();event.stopPropagation();
    onIndentStart?.(kind);
    dragRef.current={pointerId:event.pointerId,kind,startX:event.clientX,startValue:indent[kind],startIndent:{...indent}};
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onMarkerPointerMove=(event:RulerPointerEvent)=>{
    const drag=dragRef.current;
    if(!drag||event.pointerId!==drag.pointerId||!onIndentChange)return;
    event.preventDefault();
    const direction=drag.kind==="right"?-1:1;
    const delta=(event.clientX-drag.startX)*100/zoom*direction;
    const editorWidth=paperGeometry.editorWidth*100/zoom;
    const step=PX_PER_QUARTER_CM;
    const originalFirstOffset=drag.startIndent.firstLine-drag.startIndent.left;
    const minimum=drag.kind==="left"?Math.max(0,-originalFirstOffset):0;
    const maximum=drag.kind==="right"?Math.max(0,editorWidth-indent.left-24):
      drag.kind==="left"?Math.max(minimum,editorWidth-indent.right-24-Math.max(0,originalFirstOffset)):
      Math.max(0,editorWidth-indent.right-24);
    const value=clamped(Math.round((drag.startValue+delta)/step)*step,minimum,maximum);
    if(Math.abs(value-indent[drag.kind])>0.1){
      // Never leave the first line behind when moving the lower left handle.
      onIndentChange(drag.kind==="left"?moveLeftIndent(drag.startIndent,value):
        {...indent,[drag.kind]:value});
    }
  };
  const onMarkerPointerUp=(event:RulerPointerEvent)=>{
    if(dragRef.current?.pointerId!==event.pointerId)return;
    dragRef.current=null;
    if(event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    onIndentEnd?.();
  };

  useLayoutEffect(()=>{
    const ruler=rulerRef.current;
    const paper=document.querySelector<HTMLElement>(".wsl-word-page-body .wsl-paper");
    const editor=document.querySelector<HTMLElement>(".wsl-word-page-body .wsl-editor");
    const scroller=document.querySelector<HTMLElement>(".wsl-word-page-body .wsl-page-scroll");
    if(!ruler||!paper||!editor)return;
    const align=()=>{
      const firstPage=paper.querySelector<HTMLElement>(".wsl-document-page");
      const physical=firstPage??paper;
      const paperRect=physical.getBoundingClientRect();
      const editorRect=editor.getBoundingClientRect();
      const viewportLeft=paperRect.left;
      const left=viewportLeft-ruler.getBoundingClientRect().left;
      const padding=firstPage?parseFloat(getComputedStyle(firstPage).paddingLeft)*zoom/100:0;
      const editorOffset=firstPage?padding:editorRect.left-viewportLeft;
      const editorWidth=firstPage?firstPage.clientWidth*zoom/100-2*padding:editorRect.width;
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

  // The white scale is measured from 0 at the editor margin, but the tick
  // at exactly 0 is intentionally not drawn.
  const contentTicks=useMemo(()=>{
    const step=PX_PER_QUARTER_CM*zoom/100;
    const count=Math.floor(paperGeometry.editorWidth/step+1e-8);
    return Array.from({length:count+1},(_,index)=>({
      index,
      left:index*step,
      kind:index%4===0?"cm":index%2===0?"half":"quarter"
    })).filter(tick=>tick.index>0&&tick.left<paperGeometry.editorWidth-1);
  },[paperGeometry.editorWidth,zoom]);

  // Round viewport-space coordinates to physical pixels rather than rounding
  // relative positions: otherwise fractional cm steps create uneven 1px strokes.
  const snapTick=(offset:number)=>{
    const {viewportLeft,pixelRatio}=paperGeometry;
    return Math.round((viewportLeft+offset)*pixelRatio)/pixelRatio-viewportLeft;
  };

  // Align both white boundaries to device pixels; the ruler origin stays at
  // the editor margin even though its zero tick is hidden.
  const contentStart=snapTick(paperGeometry.editorOffset);
  const contentEnd=snapTick(paperGeometry.editorOffset+paperGeometry.editorWidth);

  return <div ref={rulerRef} className="wsl-word-horizontal-ruler">
    <div className="wsl-word-ruler-cm-track" style={{left:paperGeometry.left,width:scaledWidth}}>
      {ticks.map(tick=><span key={tick.index}
        className={"wsl-word-ruler-cm-tick wsl-word-ruler-cm-tick-"+tick.kind}
        style={{left:snapTick(tick.left)}}/>)}
      <span className="wsl-word-ruler-cm-tick wsl-word-ruler-cm-tick-cm"
        style={{left:snapTick(Math.max(0,scaledWidth-1))}}/>
      <div className="wsl-word-ruler-content-strip"
        style={{left:contentStart,width:Math.max(0,contentEnd-contentStart)}}>
        {contentTicks.map(tick=>tick.kind==="cm"?
          <span key={tick.index} className="wsl-word-ruler-cm-label"
            style={{left:snapTick(paperGeometry.editorOffset+tick.left)-contentStart}}>{tick.index/4}</span>:
          <span key={tick.index}
            className={"wsl-word-ruler-cm-tick wsl-word-ruler-cm-tick-"+tick.kind}
            style={{left:snapTick(paperGeometry.editorOffset+tick.left)-contentStart}}/>)}
      </div>
      {/* Same 12px width, three active controls anchored to editable margins. */}
      {(["firstLine","left","right"] as RulerIndentPart[]).map(kind=>
        <RulerIndentMarker key={kind} kind={kind}
          left={kind==="right"?
            contentEnd-indent.right*zoom/100:
            contentStart+indent[kind]*zoom/100}
          onPointerDown={onMarkerPointerDown}
          onPointerMove={onMarkerPointerMove}
          onPointerUp={onMarkerPointerUp}
          onPointerCancel={onMarkerPointerUp}/>)}
    </div>
  </div>;
}

/** The vertical ruler uses exactly the horizontal ruler's cm/quarter-cm
 * divisions and its own white, margin-relative scale; no indent controls. */
function VerticalRulerTicks({landscape,narrow,zoom,scrollTop,verticalHeight}:{
  landscape:boolean;narrow:boolean;zoom:number;scrollTop:number;verticalHeight:number;
}){
  const rulerRef=useRef<HTMLDivElement>(null);
  const [geometry,setGeometry]=useState({top:0,viewportTop:0,paperHeight:verticalHeight,editorOffset:0,pixelRatio:1});

  useLayoutEffect(()=>{
    const ruler=rulerRef.current;
    const paper=document.querySelector<HTMLElement>(".wsl-word-page-body .wsl-paper");
    const editor=document.querySelector<HTMLElement>(".wsl-word-page-body .wsl-editor");
    if(!ruler||!paper||!editor)return;
    const align=()=>{
      const paperRect=paper.getBoundingClientRect();
      const editorRect=editor.getBoundingClientRect();
      const viewportTop=paperRect.top;
      const top=viewportTop-ruler.getBoundingClientRect().top;
      const paperHeight=paperRect.height;
      const editorOffset=firstPage?parseFloat(getComputedStyle(firstPage).paddingTop)*zoom/100:
        editorRect.top-viewportTop;
      const pixelRatio=window.devicePixelRatio||1;
      setGeometry(old=>
        Math.abs(old.top-top)<0.01&&Math.abs(old.viewportTop-viewportTop)<0.01&&
        Math.abs(old.paperHeight-paperHeight)<0.01&&Math.abs(old.editorOffset-editorOffset)<0.01&&
        old.pixelRatio===pixelRatio?old:{top,viewportTop,paperHeight,editorOffset,pixelRatio});
    };
    align();
    const observer=typeof ResizeObserver!=="undefined"?new ResizeObserver(align):null;
    observer?.observe(ruler);
    observer?.observe(paper);
    observer?.observe(editor);
    window.addEventListener("resize",align);
    return ()=>{observer?.disconnect();window.removeEventListener("resize",align);};
  },[landscape,narrow,zoom,scrollTop,verticalHeight]);

  const pageHeight=geometry.paperHeight;
  const contentHeight=Math.max(0,pageHeight-2*geometry.editorOffset);
  const step=PX_PER_QUARTER_CM*zoom/100;
  const pageTicks=useMemo(()=>{
    const count=Math.floor(pageHeight/step+1e-8);
    return Array.from({length:count+1},(_,index)=>({
      index,top:index*step,kind:index%4===0?"cm":index%2===0?"half":"quarter"
    })).filter(tick=>tick.top<pageHeight-1);
  },[pageHeight,step]);
  const contentTicks=useMemo(()=>{
    const count=Math.floor(contentHeight/step+1e-8);
    return Array.from({length:count+1},(_,index)=>({
      index,top:index*step,kind:index%4===0?"cm":index%2===0?"half":"quarter"
    })).filter(tick=>tick.index>0&&tick.top<contentHeight-1);
  },[contentHeight,step]);
  const snapVerticalTick=(offset:number)=>{
    const {viewportTop,pixelRatio}=geometry;
    return Math.round((viewportTop+offset)*pixelRatio)/pixelRatio-viewportTop;
  };
  const contentStart=snapVerticalTick(geometry.editorOffset);
  const contentEnd=snapVerticalTick(pageHeight-geometry.editorOffset);

  return <div ref={rulerRef} className="wsl-word-vertical-ruler" aria-hidden="true"
    style={{top:`calc(var(--wsl-page-top-offset, 13px) - ${scrollTop}px)`,height:verticalHeight}}>
    <div className="wsl-word-vertical-cm-track" style={{top:geometry.top,height:pageHeight}}>
      {pageTicks.map(tick=><span key={tick.index}
        className={"wsl-word-vertical-cm-tick wsl-word-vertical-cm-tick-"+tick.kind}
        style={{top:snapVerticalTick(tick.top)}}/>)}
      <span className="wsl-word-vertical-cm-tick wsl-word-vertical-cm-tick-cm"
        style={{top:snapVerticalTick(Math.max(0,pageHeight-1))}}/>
      <div className="wsl-word-vertical-content-strip"
        style={{top:contentStart,height:Math.max(0,contentEnd-contentStart)}}>
        {contentTicks.map(tick=>tick.kind==="cm"?
          <span key={tick.index} className="wsl-word-vertical-cm-label"
            style={{top:snapVerticalTick(geometry.editorOffset+tick.top)-contentStart}}>{tick.index/4}</span>:
          <span key={tick.index}
            className={"wsl-word-vertical-cm-tick wsl-word-vertical-cm-tick-"+tick.kind}
            style={{top:snapVerticalTick(geometry.editorOffset+tick.top)-contentStart}}/>)}
      </div>
    </div>
  </div>;
}

export function WordPageRulers({landscape,narrow,zoom,scrollLeft,scrollTop,axis,renderedPaperHeight,indent,onIndentStart,onIndentChange,onIndentEnd}:Props){
  const {height:paperHeight}=a4Dimensions(landscape);
  const verticalHeight=renderedPaperHeight??paperHeight*zoom/100;
  if(axis==="horizontal")return <HorizontalRulerTicks landscape={landscape} narrow={narrow} zoom={zoom} scrollLeft={scrollLeft}
    indent={indent??{firstLine:0,left:0,right:0}} onIndentStart={onIndentStart} onIndentChange={onIndentChange} onIndentEnd={onIndentEnd}/>;
  return <VerticalRulerTicks landscape={landscape} narrow={narrow} zoom={zoom}
    scrollTop={scrollTop} verticalHeight={verticalHeight}/>;
}
