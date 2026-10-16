"use client";

import {useMemo} from "react";
import {a4Dimensions} from "./word-paper-metrics";

const PIXELS_PER_CM=96/2.54;
const QUARTER_CM=PIXELS_PER_CM/4;

type Props={
  landscape:boolean;
  narrow:boolean;
  zoom:number;
  scrollLeft:number;
  scrollTop:number;
};

function RulerTicks({length,axis,ratio}:{length:number;axis:"horizontal"|"vertical";ratio:number}){
  const marks=useMemo(()=>Array.from({length:Math.floor(length/(QUARTER_CM*ratio))+1},(_,index)=>{
    const value=index*QUARTER_CM*ratio;
    const whole=index%4===0;
    const half=index%2===0;
    return {value,index,whole,half};
  }),[length,ratio]);
  return <svg className={"wsl-word-ruler-ticks wsl-word-ruler-ticks-"+axis}
    viewBox={axis==="horizontal"?`0 0 ${length} 26`:`0 0 23 ${length}`}
    width={axis==="horizontal"?length:23} height={axis==="horizontal"?26:length}
    preserveAspectRatio="none" aria-hidden="true">
    {marks.map(mark=>axis==="horizontal"?
      <line key={mark.index} x1={mark.value} x2={mark.value}
        y1={mark.whole?19:mark.half?21:23} y2={26} stroke="#626269" strokeWidth=".65"/>:
      <line key={mark.index} x1={mark.whole?16:mark.half?18:20} x2={23}
        y1={mark.value} y2={mark.value} stroke="#626269" strokeWidth=".65"/>)}
    {marks.filter(mark=>mark.whole&&mark.index>0).map(mark=>axis==="horizontal"?
      <text key={"label-"+mark.index} x={mark.value} y="11" textAnchor="middle"
        fill="#58595d" fontSize="9" fontFamily="Georgia,serif">{mark.index/4}</text>:
      <text key={"label-"+mark.index} x="11" y={mark.value} textAnchor="middle"
        transform={`rotate(-90 11 ${mark.value})`}
        fill="#58595d" fontSize="9" fontFamily="Georgia,serif">{mark.index/4}</text>)}
  </svg>;
}

function MarginMarker({side}:{side:"left"|"right"}){
  return <svg className="wsl-word-ruler-marker" viewBox="0 0 16 26"
    width="16" height="26" aria-hidden="true" focusable="false">
    {side==="left"?
      <>
        <path d="M2 1H14L8 7Z" fill="#fff" stroke="#71757b" strokeWidth=".8"/>
        <path d="M8 12 2 17v8h12v-8Z" fill="#fff" stroke="#71757b" strokeWidth=".8"/>
      </>:
      <path d="M8 12 2 18v7h12v-7Z" fill="#fff" stroke="#71757b" strokeWidth=".8"/>}
  </svg>;
}

/** Ruler overlays match the same unscaled paper geometry as .wsl-paper. */
export function WordPageRulers({landscape,narrow,zoom,scrollLeft,scrollTop}:Props){
  const {width:paperWidth,height:paperHeight}=a4Dimensions(landscape);
  const hMargin=narrow?48:87;
  const vMargin=narrow?48:86;
  const printableWidth=paperWidth-2*hMargin;
  const printableHeight=paperHeight-2*vMargin;
  const ratio=zoom/100;
  return <>
    <div className="wsl-word-horizontal-ruler" aria-hidden="true">
      <span className="wsl-word-ruler-corner">L</span>
      <div className="wsl-word-ruler-horizontal-window">
        <div className="wsl-word-ruler-horizontal-offset" style={{transform:`translateX(-${scrollLeft}px)`}}>
          <div className="wsl-word-ruler-horizontal-space" style={{width:paperWidth*ratio}}>
            <div className="wsl-word-ruler-horizontal-page" style={{width:paperWidth*ratio}}>
              <div className="wsl-word-ruler-horizontal-printable"
                style={{left:hMargin*ratio,width:printableWidth*ratio}}>
                <RulerTicks length={printableWidth*ratio} axis="horizontal" ratio={ratio}/>
              </div>
              <div className="wsl-word-ruler-left-marker" style={{left:hMargin*ratio-8}}><MarginMarker side="left"/></div>
              <div className="wsl-word-ruler-right-marker" style={{left:(paperWidth-hMargin)*ratio-8}}><MarginMarker side="right"/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="wsl-word-vertical-ruler" aria-hidden="true"
      style={{top:`calc(var(--wsl-page-top-offset, 13px) - ${scrollTop}px)`,height:paperHeight*ratio}}>
      <div className="wsl-word-ruler-vertical-offset">
        <div className="wsl-word-ruler-vertical-space" style={{height:paperHeight*ratio}}>
          <div className="wsl-word-ruler-vertical-page" style={{height:paperHeight*ratio,top:0}}>
            <div className="wsl-word-ruler-vertical-printable"
              style={{top:vMargin*ratio,height:printableHeight*ratio}}>
              <RulerTicks length={printableHeight*ratio} axis="vertical" ratio={ratio}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>;
}
