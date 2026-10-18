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

export function savePageSelection(root:HTMLElement):{start:number;end:number}|null{
  const selected=window.getSelection();
  if(!selected?.rangeCount||!root.contains(selected.anchorNode))return null;
  const range=selected.getRangeAt(0);
  try{
    const prefix=document.createRange();
    prefix.selectNodeContents(root);
    prefix.setEnd(range.startContainer,range.startOffset);
    const start=prefix.toString().length;
    prefix.setEnd(range.endContainer,range.endOffset);
    return {start,end:prefix.toString().length};
  }catch{return null;}
}

export function restorePageSelection(root:HTMLElement,
  saved:{start:number;end:number}|null):void{
  if(!saved)return;
  const selection=window.getSelection();
  if(!selection)return;
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
  if(!root.textContent?.length&&root.querySelectorAll("[data-wsl-page]").length===1){
    const blank=document.createElement("p");
    blank.appendChild(document.createElement("br"));
    page.appendChild(blank);
  }
  restorePageSelection(root,saved);
  return count;
}

export function insertManualWordPageBreak(root:HTMLElement):boolean{
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
