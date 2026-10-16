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

/** Only cm subdivisions are drawn: no white fill, numbers or margin markers.
 * The track is positioned from the actual .wsl-paper DOM rect so centered
 * pages, overflowing pages, scrollbar width and horizontal scrolling align.
 */
function HorizontalRulerTicks({landscape,zoom,scrollLeft}:{landscape:boolean;zoom:number;scrollLeft:number}){
  const rulerRef=useRef<HTMLDivElement>(null);
  const [paperGeometry,setPaperGeometry]=useState({left:0,viewportLeft:0,pixelRatio:1});
  const {width:paperWidth}=a4Dimensions(landscape);
  const scaledWidth=paperWidth*zoom/100;

  useLayoutEffect(()=>{
    const ruler=rulerRef.current;
    const paper=document.querySelector<HTMLElement>(".wsl-word-page-body .wsl-paper");
    const scroller=document.querySelector<HTMLElement>(".wsl-word-page-body .wsl-page-scroll");
    if(!ruler||!paper)return;
    const align=()=>{
      const viewportLeft=paper.getBoundingClientRect().left;
      const left=viewportLeft-ruler.getBoundingClientRect().left;
      const pixelRatio=window.devicePixelRatio||1;
      setPaperGeometry(previous=>
        Math.abs(previous.left-left)<0.01&&
        Math.abs(previous.viewportLeft-viewportLeft)<0.01&&
        previous.pixelRatio===pixelRatio
          ?previous:{left,viewportLeft,pixelRatio});
    };
    align();
    const observer=typeof ResizeObserver!=="undefined"?new ResizeObserver(align):null;
    observer?.observe(ruler);
    observer?.observe(paper);
    if(scroller)observer?.observe(scroller);
    window.addEventListener("resize",align);
    return ()=>{observer?.disconnect();window.removeEventListener("resize",align);};
  },[landscape,zoom,scrollLeft]);

  const ticks=useMemo(()=>{
    const step=PX_PER_QUARTER_CM*zoom/100;
    const count=Math.floor(scaledWidth/step+1e-8);
    return Array.from({length:count+1},(_,index)=>({
      index,
      left:index*step,
      kind:index%4===0?"cm":index%2===0?"half":"quarter"
    })).filter(tick=>tick.left<scaledWidth-1);
  },[scaledWidth,zoom]);

  // Round viewport-space coordinates to physical pixels rather than rounding
  // relative positions: otherwise fractional cm steps create uneven 1px strokes.
  const snapTick=(offset:number)=>{
    const {viewportLeft,pixelRatio}=paperGeometry;
    return Math.round((viewportLeft+offset)*pixelRatio)/pixelRatio-viewportLeft;
  };

  return <div ref={rulerRef} className="wsl-word-horizontal-ruler" aria-hidden="true">
    <div className="wsl-word-ruler-cm-track" style={{left:paperGeometry.left,width:scaledWidth}}>
      {ticks.map(tick=><span key={tick.index}
        className={"wsl-word-ruler-cm-tick wsl-word-ruler-cm-tick-"+tick.kind}
        style={{left:snapTick(tick.left)}}/>)}
      <span className="wsl-word-ruler-cm-tick wsl-word-ruler-cm-tick-cm"
        style={{left:snapTick(Math.max(0,scaledWidth-1))}}/>
    </div>
  </div>;
}

export function WordPageRulers({landscape,zoom,scrollLeft,scrollTop,axis,renderedPaperHeight}:Props){
  const {height:paperHeight}=a4Dimensions(landscape);
  const verticalHeight=renderedPaperHeight??paperHeight*zoom/100;
  if(axis==="horizontal")return <HorizontalRulerTicks landscape={landscape} zoom={zoom} scrollLeft={scrollLeft}/>;
  return <div className="wsl-word-vertical-ruler" aria-hidden="true"
    style={{top:`calc(var(--wsl-page-top-offset, 13px) - ${scrollTop}px)`,height:verticalHeight}}/>;
}
