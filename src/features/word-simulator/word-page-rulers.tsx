"use client";

import {a4Dimensions} from "./word-paper-metrics";

type Props={
  landscape:boolean;
  narrow:boolean;
  zoom:number;
  scrollLeft:number;
  scrollTop:number;
  axis:"horizontal"|"vertical";
  renderedPaperHeight?:number;
};

/** Empty ruler containers. Their interiors are intentionally reserved for a
 * future design; retain the page-relative dimensions and scroll alignment. */
export function WordPageRulers({landscape,zoom,scrollTop,axis,renderedPaperHeight}:Props){
  const {height:paperHeight}=a4Dimensions(landscape);
  const verticalHeight=renderedPaperHeight??paperHeight*zoom/100;
  if(axis==="horizontal")return <div className="wsl-word-horizontal-ruler" aria-hidden="true"/>;
  return <div className="wsl-word-vertical-ruler" aria-hidden="true"
    style={{top:`calc(var(--wsl-page-top-offset, 13px) - ${scrollTop}px)`,height:verticalHeight}}/>;
}
