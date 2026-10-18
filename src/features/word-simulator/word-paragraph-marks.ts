/** Paragraph marks are decorations, not document content.
 * Match the rendered size of the final inline text (including a pending
 * font-size span in an otherwise blank paragraph), without changing the
 * rich-text nodes or overriding the browser's native caret height.
 */
export function syncWordParagraphMarkSizes(root:HTMLElement):void{
  const blocks=root.querySelectorAll<HTMLElement>("p,h1,h2");
  for(const block of blocks){
    const findLastText=(element:Element):Element|null=>{
      for(let index=element.childNodes.length-1;index>=0;index--){
        const child=element.childNodes[index];
        if(child.nodeType===Node.TEXT_NODE){
          if(child.textContent?.length)return child.parentElement;
        }else if(child.nodeType===Node.ELEMENT_NODE){
          const nested=child as Element;
          if(nested.matches("[data-wsl-selection-gutter], [data-wsl-manual-break]"))
            continue;
          const found=findLastText(nested);
          if(found)return found;
        }
      }
      return null;
    };
    const textOwner=findLastText(block);
    const size=getComputedStyle(textOwner??block).fontSize;
    if(!size||!/^\d+(?:\.\d+)?px$/.test(size))continue;
    if(block.style.getPropertyValue("--wsl-paragraph-mark-size")!==size)
      block.style.setProperty("--wsl-paragraph-mark-size",size);
  }
}
