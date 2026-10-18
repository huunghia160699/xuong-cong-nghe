// Visual-line selection in the left page margin, like Microsoft Word's selection bar.
// Works with wrapped lines and with inline formatting split over multiple text nodes.
export type WordVisualLine={
  top:number;bottom:number;
  startNode:Text;startOffset:number;endNode:Text;endOffset:number;
};

export function collectWordVisualLines(root:HTMLElement):WordVisualLine[]{
  const lines:WordVisualLine[]=[];
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const probe=document.createRange();
  while(walker.nextNode()){
    const node=walker.currentNode as Text;
    if(node.parentElement?.closest('[contenteditable="false"]'))continue;
    let offset=0;
    for(const char of node.data){
      const next=offset+char.length;
      if(char==="\u200B"||char==="\n"||char==="\r"){offset=next;continue;}
      probe.setStart(node,offset);
      probe.setEnd(node,next);
      const rect=probe.getBoundingClientRect();
      if(rect.height<1||!Number.isFinite(rect.top)){offset=next;continue;}
      const previous=lines[lines.length-1];
      // Adjacent inline marks may use different font sizes or superscripts.
      // Vertical overlap identifies the same rendered line despite those marks.
      const overlap=previous?Math.min(previous.bottom,rect.bottom)-Math.max(previous.top,rect.top):0;
      const centerGap=previous?
        Math.abs((previous.top+previous.bottom-rect.top-rect.bottom)/2):Infinity;
      const sameLine=Boolean(previous&&(
        overlap>Math.min(previous.bottom-previous.top,rect.height)*.35||
        centerGap<=Math.min(5,rect.height*.4)
      ));
      if(sameLine&&previous){
        previous.endNode=node;
        previous.endOffset=next;
        previous.top=Math.min(previous.top,rect.top);
        previous.bottom=Math.max(previous.bottom,rect.bottom);
      }else{
        lines.push({top:rect.top,bottom:rect.bottom,
          startNode:node,startOffset:offset,endNode:node,endOffset:next});
      }
      offset=next;
    }
  }
  return lines;
}

export function wordLineAtY(lines:WordVisualLine[],clientY:number):number{
  if(!lines.length)return -1;
  // A click inside a line selects it; between lines choose the nearer row.
  for(let index=0;index<lines.length;index++){
    if(clientY>=lines[index].top&&clientY<=lines[index].bottom)return index;
  }
  let nearest=0;
  let distance=Infinity;
  for(let index=0;index<lines.length;index++){
    const line=lines[index];
    const gap=Math.abs((line.top+line.bottom)/2-clientY);
    if(gap<distance){nearest=index;distance=gap;}
  }
  return nearest;
}

export function selectWordVisualLines(lines:WordVisualLine[],anchor:number,
  current:number,selection:Selection|null):boolean{
  if(!selection||anchor<0||current<0||!lines[anchor]||!lines[current])return false;
  const from=lines[Math.min(anchor,current)];
  const to=lines[Math.max(anchor,current)];
  const range=document.createRange();
  range.setStart(from.startNode,from.startOffset);
  range.setEnd(to.endNode,to.endOffset);
  selection.removeAllRanges();
  selection.addRange(range);
  return true;
}
