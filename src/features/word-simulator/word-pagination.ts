// One contentEditable document, physically paginated into fixed A4 page nodes.
// Page wrappers and selection gutters are view-only and must never be serialized.
// The explicit HR page break IS part of the document and survives saving.
export const MANUAL_BREAK_ATTRIBUTE="data-wsl-manual-break";
export const PAGE_ATTRIBUTE="data-wsl-page";

function createPage(root:HTMLElement,index:number):HTMLElement{
  const page=document.createElement("div");
  page.className="wsl-document-page";
  page.setAttribute(PAGE_ATTRIBUTE,String(index+1));
  page.dataset.pageNumber=String(index+1);
  const gutter=document.createElement("div");
  gutter.className="wsl-word-selection-gutter";
  gutter.setAttribute("data-wsl-selection-gutter","true");
  gutter.setAttribute("contenteditable","false");
  gutter.setAttribute("aria-hidden","true");
  page.appendChild(gutter);
  root.appendChild(page);
  return page;
}

function visibleChildren(root:HTMLElement):Node[]{
  const nodes:Node[]=[];
  for(const child of Array.from(root.childNodes)){
    if(child.nodeType===Node.ELEMENT_NODE&&
       (child as Element).hasAttribute(PAGE_ATTRIBUTE)){
      for(const inner of Array.from(child.childNodes)){
        if(inner.nodeType===Node.ELEMENT_NODE&&
          (inner as Element).hasAttribute("data-wsl-selection-gutter"))continue;
        nodes.push(inner);
      }
    }else nodes.push(child);
  }
  return nodes;
}

export type WordPageSelection={
  start:number;end:number;
  startNode:Node;startOffset:number;endNode:Node;endOffset:number;
};

/** Never leave a collapsed typing caret on the editor/page wrapper.
 * Chrome permits ranges between .wsl-document-page nodes; typing there
 * renders at the unpadded outer paper edge instead of the paragraph margin.
 * Preserve every valid inline/table/text range and noncollapsed selection.
 */
export function ensureWordCaretInsideParagraph(
  root:HTMLElement,preferred:HTMLElement|null=null
):boolean{
  const selection=window.getSelection();
  if(!selection?.rangeCount||!selection.isCollapsed)return false;
  const current=selection.getRangeAt(0);
  const container=current.startContainer;
  if(!root.contains(container))return false;
  const element=container.nodeType===Node.ELEMENT_NODE?
    container as Element:container.parentElement;
  if(!element)return false;
  const editableBlock=element.closest("p,h1,h2,h3,h4,blockquote,li,td,th");
  if(editableBlock&&root.contains(editableBlock))return false;
  const page=element.closest("[data-wsl-page]") as HTMLElement|null;
  let target=preferred&&root.contains(preferred)&&
    preferred.matches("p,h1,h2,h3,h4,blockquote,li,td,th")?preferred:null;
  if(!target){
    let targetPage=page;
    if(!targetPage&&container===root){
      const at=Math.min(current.startOffset,root.children.length-1);
      targetPage=root.children[Math.max(0,at)] as HTMLElement|null;
    }
    const matches=targetPage?.querySelectorAll<HTMLElement>(
      "p,h1,h2,h3,h4,blockquote,li,td,th"
    );
    if(matches?.length){
      // A native caret at the END of a page should enter the LAST paragraph,
      // while a caret just after the margin gutter should enter the FIRST.
      const last=page&&current.startOffset>1;
      target=matches[last?matches.length-1:0];
    }
  }
  target??=root.querySelector<HTMLElement>(
    "[data-wsl-page] p,[data-wsl-page] h1,[data-wsl-page] h2,"+
    "[data-wsl-page] h3,[data-wsl-page] li,[data-wsl-page] td"
  );
  if(!target)return false;
  const range=document.createRange();
  range.selectNodeContents(target);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  return true;
}

export function savePageSelection(root:HTMLElement):WordPageSelection|null{
  const selected=window.getSelection();
  if(!selected?.rangeCount||!root.contains(selected.anchorNode))return null;
  const range=selected.getRangeAt(0);
  try{
    const prefix=document.createRange();
    prefix.selectNodeContents(root);
    prefix.setEnd(range.startContainer,range.startOffset);
    const start=prefix.toString().length;
    prefix.setEnd(range.endContainer,range.endOffset);
    return {
      start,end:prefix.toString().length,
      // Keep exact DOM boundary containers. Text offsets alone cannot tell
      // the difference between separate empty <p><br></p> paragraphs, which
      // caused the caret to jump between ¶ markers after each keystroke.
      startNode:range.startContainer,startOffset:range.startOffset,
      endNode:range.endContainer,endOffset:range.endOffset
    };
  }catch{return null;}
}

export function restorePageSelection(root:HTMLElement,
  saved:WordPageSelection|null):void{
  if(!saved)return;
  const selection=window.getSelection();
  if(!selection)return;
  // Pagination moves existing paragraph/text DOM nodes instead of replacing
  // them. Restore the original element/text offsets before attempting any
  // lossy character-count fallback (zero for every empty paragraph).
  if(root.contains(saved.startNode)&&root.contains(saved.endNode)){
    const validOffset=(node:Node,offset:number)=>
      offset>=0&&offset<=(
        node.nodeType===Node.TEXT_NODE?(node.textContent?.length??0):node.childNodes.length
      );
    if(validOffset(saved.startNode,saved.startOffset)&&
       validOffset(saved.endNode,saved.endOffset)){
      try{
        const exact=document.createRange();
        exact.setStart(saved.startNode,saved.startOffset);
        exact.setEnd(saved.endNode,saved.endOffset);
        selection.removeAllRanges();
        selection.addRange(exact);
        return;
      }catch{/* Split paragraph can detach the selected text node. */}
    }
  }
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const textNodes:Text[]=[];
  while(walker.nextNode()){
    const node=walker.currentNode as Text;
    if(!node.parentElement?.closest("[data-wsl-selection-gutter]"))
      textNodes.push(node);
  }
  const find=(position:number):{node:Node;offset:number}=>{
    let remaining=Math.max(0,position);
    for(const node of textNodes){
      if(remaining<=node.length)return {node,offset:remaining};
      remaining-=node.length;
    }
    const last=textNodes[textNodes.length-1];
    if(last)return {node:last,offset:last.length};
    const page=root.querySelector<HTMLElement>("[data-wsl-page]");
    return {node:page??root,offset:page?.childNodes.length??root.childNodes.length};
  };
  const start=find(saved.start),end=find(saved.end);
  const range=document.createRange();
  try{
    range.setStart(start.node,start.offset);
    range.setEnd(end.node,end.offset);
    selection.removeAllRanges();
    selection.addRange(range);
  }catch{/* Empty page or detached selection; keep browser caret. */}
}

function findTextOffset(block:HTMLElement,count:number):{node:Text;offset:number}|null{
  const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT);
  let remaining=count;
  while(walker.nextNode()){
    const node=walker.currentNode as Text;
    if(remaining<=node.length)return {node,offset:remaining};
    remaining-=node.length;
  }
  return null;
}

function breakOversizedParagraph(block:HTMLElement,limit:number):HTMLElement|null{
  if(!/^(P|DIV|H1|H2|H3|H4|BLOCKQUOTE)$/.test(block.tagName)
     ||block.querySelector("table,img,video,[contenteditable=false]"))return null;
  const text=block.textContent??"";
  if(text.length<2)return null;
  const positionFits=(index:number):boolean=>{
    const point=findTextOffset(block,index);
    if(!point)return false;
    const test=document.createRange();
    test.setStart(point.node,Math.max(0,point.offset-1));
    test.setEnd(point.node,point.offset);
    return test.getBoundingClientRect().bottom<=limit+.5;
  };
  let lo=1,hi=text.length-1,best=0;
  while(lo<=hi){
    const mid=Math.floor((lo+hi)/2);
    if(positionFits(mid)){best=mid;lo=mid+1;}
    else hi=mid-1;
  }
  if(!best)return null;
  let split=best;
  // Prefer the nearest preceding word boundary to avoid cutting a word.
  const space=text.lastIndexOf(" ",best);
  if(space>best*.5&&space<best)split=space+1;
  const location=findTextOffset(block,split);
  if(!location)return null;
  const range=document.createRange();
  range.setStart(location.node,location.offset);
  range.selectNodeContents(block); // reset only end below
  range.setStart(location.node,location.offset);
  range.setEnd(block,block.childNodes.length);
  const after=range.extractContents();
  if(!after.hasChildNodes())return null;
  const continuation=block.cloneNode(false) as HTMLElement;
  continuation.appendChild(after);
  block.after(continuation);
  return continuation;
}

export function paginateWordEditor(root:HTMLElement):number{
  // Fix root/page-wrapper ranges BEFORE collecting selection offsets. Without
  // this, moving pages can restore an editable caret at the outer paper edge.
  ensureWordCaretInsideParagraph(root);
  // Do not detach/reinsert the editor DOM on every typed character while a
  // single page still fits. That disrupts the native caret and undo history.
  const existingPage=root.children.length===1?
    root.firstElementChild as HTMLElement|null:null;
  if(existingPage?.hasAttribute(PAGE_ATTRIBUTE)&&
     !existingPage.querySelector("["+MANUAL_BREAK_ATTRIBUTE+"]")){
    const content=Array.from(existingPage.children).filter(child=>
      !child.hasAttribute("data-wsl-selection-gutter"));
    const last=content[content.length-1];
    const bounds=existingPage.getBoundingClientRect();
    const padding=parseFloat(getComputedStyle(existingPage).paddingBottom)||0;
    const scale=bounds.height/Math.max(1,existingPage.offsetHeight);
    const bottom=bounds.bottom-padding*scale;
    if(last&&last.getBoundingClientRect().bottom<=bottom+1){
      ensureWordCaretInsideParagraph(root);
      return 1;
    }
  }
  const saved=savePageSelection(root);
  const children=visibleChildren(root);
  const fragment=document.createDocumentFragment();
  for(const child of children)fragment.appendChild(child);
  root.replaceChildren();
  let count=1;
  let page=createPage(root,0);
  const nextPage=()=>{
    page=createPage(root,count);
    count++;
  };
  const hasBody=()=>Array.from(page.children).some(child=>
    !child.hasAttribute("data-wsl-selection-gutter")&&!child.hasAttribute(MANUAL_BREAK_ATTRIBUTE));
  // In CSS the page has a fixed height, with editable content between margins.
  const endOfPage=()=>{
    const bounds=page.getBoundingClientRect();
    const bottomPadding=parseFloat(getComputedStyle(page).paddingBottom)||0;
    const scale=bounds.height/Math.max(1,page.offsetHeight);
    return bounds.bottom-bottomPadding*scale;
  };
  while(fragment.firstChild){
    const node=fragment.firstChild;
    if(node.nodeType===Node.ELEMENT_NODE&&
       (node as Element).hasAttribute(MANUAL_BREAK_ATTRIBUTE)){
      // Restored drafts pass through HTML sanitization. Reinstate the
      // non-editable break marker whenever the editor is repaginated.
      (node as HTMLElement).contentEditable="false";
      page.appendChild(node);
      nextPage();
      continue;
    }
    page.appendChild(node);
    if(node.nodeType!==Node.ELEMENT_NODE)continue;
    const element=node as HTMLElement;
    if(element.getBoundingClientRect().bottom<=endOfPage()+1)continue;
    if(hasBody()&&page.children.length>2){
      fragment.insertBefore(element,fragment.firstChild);
      nextPage();
      continue;
    }
    // A single paragraph can be longer than one page. Split at the last
    // fitting character, preserving all inline <b>/<i>/<sup> node formatting.
    const tail=breakOversizedParagraph(element,endOfPage());
    if(tail){
      fragment.insertBefore(tail,fragment.firstChild);
      nextPage();
    }
  }
  // An existing <p><br></p> is already a real empty paragraph. Checking
  // root.textContent here appended a SECOND paragraph every time pagination
  // ran, because BR/empty paragraphs do not contribute textContent.
  if(children.length===0){
    const blank=document.createElement("p");
    blank.appendChild(document.createElement("br"));
    page.appendChild(blank);
  }
  restorePageSelection(root,saved);
  ensureWordCaretInsideParagraph(root);
  return count;
}

export function insertManualWordPageBreak(root:HTMLElement):boolean{
  // Ctrl+Enter must split an actual paragraph, never the page or editor
  // wrapper. Otherwise the next typing caret appears outside the A4 margin.
  ensureWordCaretInsideParagraph(root);
  const selection=window.getSelection();
  if(!selection?.rangeCount||!root.contains(selection.anchorNode))return false;
  const range=selection.getRangeAt(0);
  range.deleteContents();
  const element=range.startContainer.nodeType===Node.ELEMENT_NODE?
    range.startContainer as Element:range.startContainer.parentElement;
  const paragraph=element?.closest("p,h1,h2,h3,h4,blockquote") as HTMLElement|null;
  const hr=document.createElement("hr");
  hr.setAttribute(MANUAL_BREAK_ATTRIBUTE,"true");
  hr.setAttribute("contenteditable","false");
  const next=document.createElement("p");
  const end=document.createRange();
  if(paragraph&&root.contains(paragraph)){
    end.setStart(range.startContainer,range.startOffset);
    end.setEnd(paragraph,paragraph.childNodes.length);
    next.appendChild(end.extractContents());
    if(!next.hasChildNodes())next.appendChild(document.createElement("br"));
    if(!paragraph.hasChildNodes())paragraph.appendChild(document.createElement("br"));
    paragraph.after(hr,next);
  }else{
    range.insertNode(hr);
    hr.after(next);
    next.appendChild(document.createElement("br"));
  }
  const caret=document.createRange();
  caret.selectNodeContents(next);
  caret.collapse(true);
  selection.removeAllRanges();
  selection.addRange(caret);
  return true;
}

/** Scroll only the document viewport; never move the app header/window.
 * Client rectangles already include page zoom, so don't apply zoom twice. */
export function scrollWordPageIntoView(
  scroller:HTMLElement,page:HTMLElement
):void{
  const viewport=scroller.getBoundingClientRect();
  const pageRect=page.getBoundingClientRect();
  const desired=scroller.scrollTop+pageRect.top-viewport.top-12;
  const maxScroll=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
  scroller.scrollTo({
    top:Math.max(0,Math.min(maxScroll,desired)),
    behavior:"smooth"
  });
}
