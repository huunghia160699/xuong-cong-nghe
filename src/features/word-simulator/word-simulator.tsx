"use client";

import {useCallback,useEffect,useRef,useState} from "react";
import {WordHomeRibbon,type WordFormatKey} from "./word-home-ribbon";
import {WordWindowBar} from "./word-window-bar";
import {
  AlignCenter,AlignJustify,AlignLeft,AlignRight,ArrowLeft,BookOpen,Check,ChevronDown,
  Clipboard,Copy,Download,FilePlus2,FileText,FolderOpen,ImagePlus,Italic,
  Link2,List,ListOrdered,Maximize2,Minus,Plus,Printer,Redo2,
  Ruler,Save,Search,Strikethrough,Table2,Type,Underline,Undo2
} from "lucide-react";

type Tab="File"|"Home"|"Insert"|"Design"|"Layout"|"References"|"Mailings"|"Review"|"View"|"Help";
type Orientation="portrait"|"landscape";
type Margins="normal"|"narrow";
type Stats={words:number;characters:number};
type RibbonCommand={id:string;label:string;run:()=>void;icon:React.ReactNode;disabled?:boolean;title?:string};

const STORAGE_KEY="xcn_word_simulator_draft_v1";
const DEFAULT_CONTENT="<p><br></p>";
const TABS:Tab[]=["File","Home","Insert","Design","Layout","References","Mailings","Review","View","Help"];
const MAX_IMPORT_BYTES=1024*1024;
const ALLOWED_TAGS=new Set(["P","BR","DIV","H1","H2","H3","H4","STRONG","B","EM","I","U","S","STRIKE","SUB","SUP","SPAN","BLOCKQUOTE","UL","OL","LI","TABLE","THEAD","TBODY","TR","TH","TD","A","IMG","HR","FONT"]);
const FORBIDDEN_TAGS=new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","SVG","MATH","TEMPLATE","META","LINK","FORM","INPUT","BUTTON","VIDEO","AUDIO","HEAD"]);
const safeName=(name:string)=>name.replace(/[<>:"/\\|?*\u0000-\u001f]/g,"").trim().slice(0,90)||"Tai_lieu";
const textStats=(html:string):Stats=>{
  const holder=document.createElement("div");
  holder.innerHTML=html;
  const text=holder.textContent??"";
  const trimmed=text.replace(/\s+/g," ").trim();
  return {words:trimmed?trimmed.split(" ").length:0,characters:text.length};
};
function sanitize(html:string):string {
  const parsed=new DOMParser().parseFromString(html,"text/html");
  const clean=(element:Element)=>{
    for(const child of Array.from(element.children))clean(child);
    if(element===parsed.body)return;
    if(FORBIDDEN_TAGS.has(element.tagName)){element.remove();return;}
    if(!ALLOWED_TAGS.has(element.tagName)){
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }
    const safeAttrs:Record<string,string>={};
    if(element.tagName==="A"){
      const raw=element.getAttribute("href")??"";
      if(/^(https?:\/\/|mailto:)/i.test(raw))safeAttrs.href=raw.slice(0,2048);
    }
    if(element.tagName==="IMG"){
      const raw=element.getAttribute("src")??"";
      if(/^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(raw)&&raw.length<4_500_000)safeAttrs.src=raw;
      else{element.remove();return;}
      safeAttrs.alt=(element.getAttribute("alt")??"Ảnh minh họa").slice(0,160);
    }
    const style=(element as HTMLElement).style;
    const safeStyles:string[]=[];
    const oldAlign=element.getAttribute("align")??"";
    if(["left","right","center","justify"].includes(oldAlign))safeStyles.push("text-align:"+oldAlign);
    if(element.tagName==="FONT"){
      const face=element.getAttribute("face")??"";
      const size=element.getAttribute("size")??"";
      const colorAttr=element.getAttribute("color")??"";
      if(/^(Arial|Aptos|Calibri|Times New Roman|Georgia|Verdana)$/i.test(face))safeAttrs.face=face;
      if(/^[1-7]$/.test(size))safeAttrs.size=size;
      if(/^#[0-9a-f]{3,8}$/i.test(colorAttr))safeAttrs.color=colorAttr;
    }
    const align=style.textAlign;
    if(["left","right","center","justify"].includes(align))safeStyles.push("text-align:"+align);
    const color=style.color;
    if(/^#[0-9a-f]{3,8}$/i.test(color)||/^rgb\([\d\s,.%]+\)$/i.test(color))safeStyles.push("color:"+color);
    const fontSize=style.fontSize;
    if(/^(?:\d{1,2}(?:\.\d)?)(?:pt|px)$/.test(fontSize))safeStyles.push("font-size:"+fontSize);
    const lineHeight=style.lineHeight;
    if(/^(?:1(?:\.(?:0|15|5))?|2(?:\.0)?)$/.test(lineHeight))safeStyles.push("line-height:"+lineHeight);
    const marginBottom=style.marginBottom;
    if(/^(?:0|\d{1,2}px)$/.test(marginBottom))safeStyles.push("margin-bottom:"+marginBottom);
    const borderBottom=style.borderBottom;
    if(/^1px solid (?:#[0-9a-f]{3,8}|rgb\([\d\s,.%]+\))$/i.test(borderBottom))safeStyles.push("border-bottom:"+borderBottom);
    const borderTop=style.borderTop;
    if(/^1px solid (?:#[0-9a-f]{3,8}|rgb\([\d\s,.%]+\))$/i.test(borderTop))safeStyles.push("border-top:"+borderTop);
    const background=style.backgroundColor;
    if(/^#[0-9a-f]{3,8}$/i.test(background)||/^rgb\([\d\s,.%]+\)$/i.test(background))safeStyles.push("background-color:"+background);
    const font=style.fontFamily;
    if(/^(Arial|Aptos|Calibri|Times New Roman|Georgia|Verdana)(,\s*sans-serif|,\s*serif)?$/i.test(font))safeStyles.push("font-family:"+font);
    for(const attr of Array.from(element.attributes))element.removeAttribute(attr.name);
    for(const [key,value] of Object.entries(safeAttrs))element.setAttribute(key,value);
    if(safeStyles.length)element.setAttribute("style",safeStyles.join(";"));
  };
  clean(parsed.body);
  return parsed.body.innerHTML;
}
function triggerDownload(fileName:string,content:string,type:string){
  const blob=new Blob([content],{type});
  const uri=URL.createObjectURL(blob);
  const anchor=document.createElement("a");
  anchor.href=uri;anchor.download=fileName;document.body.append(anchor);anchor.click();anchor.remove();
  window.setTimeout(()=>URL.revokeObjectURL(uri),1000);
}

function ToolButton({item}:{item:RibbonCommand}){
  return <button type="button" className="wsl-tool" onMouseDown={event=>event.preventDefault()}
    onClick={item.run} disabled={item.disabled} title={item.title??item.label} aria-label={item.label}>
    {item.icon}<span>{item.label}</span>
  </button>;
}
function Group({name,children}:{name:string;children:React.ReactNode}){
  return <div className="wsl-ribbon-group"><div className="wsl-ribbon-items">{children}</div><span className="wsl-ribbon-group-name">{name}</span></div>;
}

export function WordSimulator(){
  const editor=useRef<HTMLDivElement>(null);
  const shell=useRef<HTMLDivElement>(null);
  const fileInput=useRef<HTMLInputElement>(null);
  const imageInput=useRef<HTMLInputElement>(null);
  const savedSelection=useRef<Range|null>(null);
  const stagedClipboard=useRef<string|null>(null);
  const [activeTab,setActiveTab]=useState<Tab>("Home");
  const [filename,setFilename]=useState("Document1");
  const [zoom,setZoom]=useState(100);
  const [orientation,setOrientation]=useState<Orientation>("portrait");
  const [margins,setMargins]=useState<Margins>("normal");
  const [showRuler,setShowRuler]=useState(true);
  const [spellcheck,setSpellcheck]=useState(true);
  const [stats,setStats]=useState<Stats>({words:0,characters:0});
  const [revision,setRevision]=useState(0);
  const [status,setStatus]=useState("Tài liệu mới");
  const [isReady,setIsReady]=useState(false);
  const [font,setFont]=useState("Aptos");
  const [fontSize,setFontSize]=useState("3");
  const [searchOpen,setSearchOpen]=useState(false);
  const [query,setQuery]=useState("");
  const [showMarks,setShowMarks]=useState(false);
  const [hasSelection,setHasSelection]=useState(false);
  const [paintArmed,setPaintArmed]=useState(false);
  const [clipboardMode,setClipboardMode]=useState<"copy"|"cut"|null>(null);
  const [formatActive,setFormatActive]=useState<Record<WordFormatKey,boolean>>({
    bold:false,italic:false,underline:false,strikeThrough:false,subscript:false,superscript:false
  });
  const paintFormat=useRef<{font:string;color:string;bold:boolean;italic:boolean}|null>(null);

  const updateStats=useCallback(()=>{
    if(editor.current)setStats(textStats(editor.current.innerHTML));
  },[]);
  const markChanged=useCallback(()=>{
    updateStats();setRevision(value=>value+1);setStatus("Đang soạn thảo");
  },[updateStats]);
  const setDocument=useCallback((html:string)=>{
    if(!editor.current)return;
    editor.current.innerHTML=sanitize(html);
    savedSelection.current=null;
    setClipboardMode(null);stagedClipboard.current=null;
    updateStats();setRevision(value=>value+1);
  },[updateStats]);

  useEffect(()=>{
    try{
      const raw=window.localStorage.getItem(STORAGE_KEY);
      if(raw){
        const stored=JSON.parse(raw) as {html?:string;name?:string;orientation?:Orientation;margins?:Margins};
        if(stored.html&&editor.current){
          editor.current.innerHTML=sanitize(stored.html);
          setFilename(safeName(stored.name??"Document1"));
          if(stored.orientation==="landscape")setOrientation("landscape");
          if(stored.margins==="narrow")setMargins("narrow");
          setStatus("Đã khôi phục bản nháp");
        }
      }else if(editor.current)editor.current.innerHTML=DEFAULT_CONTENT;
    }catch{
      if(editor.current)editor.current.innerHTML=DEFAULT_CONTENT;
      setStatus("Không thể khôi phục bản nháp");
    }
    updateStats();setIsReady(true);
  },[updateStats]);
  useEffect(()=>{
    if(!isReady)return;
    const handle=window.setTimeout(()=>{
      if(!editor.current)return;
      try{
        window.localStorage.setItem(STORAGE_KEY,JSON.stringify({html:sanitize(editor.current.innerHTML),name:filename,orientation,margins}));
        setStatus("Đã lưu bản nháp trên trình duyệt");
      }catch{setStatus("Bản nháp vượt dung lượng lưu trình duyệt; hãy xuất tệp");}
    },750);
    return ()=>window.clearTimeout(handle);
  },[revision,filename,orientation,margins,isReady]);

  const formatKeys:WordFormatKey[]=["bold","italic","underline","strikeThrough","subscript","superscript"];
  function syncFormatState(){
    const selection=window.getSelection();
    if(!selection?.anchorNode||!editor.current?.contains(selection.anchorNode))return;
    const next={} as Record<WordFormatKey,boolean>;
    for(const key of formatKeys){
      try{next[key]=document.queryCommandState(key);}catch{next[key]=false;}
    }
    setFormatActive(current=>formatKeys.every(key=>current[key]===next[key])?current:next);
  }
  useEffect(()=>{
    const changed=()=>syncFormatState();
    document.addEventListener("selectionchange",changed);
    return ()=>document.removeEventListener("selectionchange",changed);
  });
  useEffect(()=>{
    const escape=(event:KeyboardEvent)=>{
      if(event.key!=="Escape"||(!clipboardMode&&!paintArmed))return;
      event.preventDefault();
      setClipboardMode(null);stagedClipboard.current=null;
      paintFormat.current=null;setPaintArmed(false);
      setStatus("Đã hủy thao tác. Nhấn Copy hoặc Cut để thực hiện lại.");
    };
    document.addEventListener("keydown",escape);
    return ()=>document.removeEventListener("keydown",escape);
  },[clipboardMode,paintArmed]);
  function rememberSelection(){
    const selection=window.getSelection();
    if(selection&&selection.rangeCount&&editor.current?.contains(selection.anchorNode)){
      savedSelection.current=selection.getRangeAt(0).cloneRange();
      setHasSelection(!selection.isCollapsed && Boolean(selection.toString()));
      syncFormatState();
    }
  }
  function restoreSelection(){
    editor.current?.focus();
    if(savedSelection.current){
      const selection=window.getSelection();
      if(selection){selection.removeAllRanges();selection.addRange(savedSelection.current);}
    }
  }
  function command(cmd:string,value?:string){
    restoreSelection();
    const ok=document.execCommand(cmd,false,value);
    if(!ok){
      if(cmd==="undo"||cmd==="redo")setStatus(cmd==="undo"?"Không có thao tác để hoàn tác":"Không có thao tác để làm lại");
      else setStatus("Trình duyệt chưa hỗ trợ lệnh này: "+cmd);
      return;
    }
    rememberSelection();
    syncFormatState();
    markChanged();
  }
  function saveDraft(){
    if(!editor.current)return;
    try{
      window.localStorage.setItem(STORAGE_KEY,JSON.stringify({
        html:sanitize(editor.current.innerHTML),name:safeName(filename),orientation,margins
      }));
      setStatus("Đã lưu bản nháp trên trình duyệt");
    }catch{setStatus("Không đủ dung lượng để lưu bản nháp; hãy tải tệp HTML");}
  }
  function blockCommand(tag:string){command("formatBlock",tag);}
  function editFont(next:string){setFont(next);command("fontName",next);}
  function editSize(next:string){setFontSize(next);command("fontSize",next);}
  function insertTable(){
    const table='<table><tbody><tr><th>STT</th><th>Họ và tên</th><th>Ghi chú</th></tr><tr><td>1</td><td><br></td><td><br></td></tr><tr><td>2</td><td><br></td><td><br></td></tr></tbody></table><p><br></p>';
    command("insertHTML",table);
  }
  function insertLink(){
    const raw=window.prompt("Địa chỉ liên kết (https://...):","https://");
    if(!raw)return;
    if(!/^https?:\/\//i.test(raw)){setStatus("Liên kết phải bắt đầu bằng https:// hoặc http://");return;}
    command("createLink",raw.slice(0,2048));
  }
  function newDocument(){
    if(!window.confirm("Tạo tài liệu mới? Nội dung hiện tại vẫn có thể xuất tệp trước khi thay thế."))return;
    setDocument(DEFAULT_CONTENT);
    setFilename("Document1");
    setOrientation("portrait");setMargins("normal");setStatus("Đã tạo tài liệu mới");setActiveTab("Home");
  }
  function exportHTML(){
    const html=editor.current?sanitize(editor.current.innerHTML):"";
    const documentHTML='<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>'+safeName(filename)+'</title><style>body{max-width:760px;margin:40px auto;font:16px/1.55 Aptos,Arial,sans-serif;color:#222}table{border-collapse:collapse;width:100%}td,th{border:1px solid #777;padding:8px}img{max-width:100%}@media print{body{max-width:none;margin:20mm}}</style></head><body>'+html+'</body></html>';
    triggerDownload(safeName(filename)+".html",documentHTML,"text/html;charset=utf-8");
    setStatus("Đã xuất HTML — chưa phải định dạng DOCX");
  }
  function exportText(){
    triggerDownload(safeName(filename)+".txt",editor.current?.innerText??"","text/plain;charset=utf-8");
    setStatus("Đã xuất văn bản TXT");
  }
  async function importFile(file:File){
    if(file.size>MAX_IMPORT_BYTES){setStatus("Tệp vượt giới hạn 1 MB để nhập nội dung");return;}
    if(!/\.(html?|txt)$/i.test(file.name)){setStatus("Chỉ hỗ trợ mở HTML hoặc TXT; chưa hỗ trợ DOCX");return;}
    try{
      const text=await file.text();
      const html=/\.txt$/i.test(file.name)?'<p>'+text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").split(/\r?\n/).join("</p><p>")+"</p>":text;
      setDocument(html);
      setFilename(safeName(file.name.replace(/\.(html?|txt)$/i,"")));
      setStatus("Đã mở "+file.name);
      setActiveTab("Home");
    }catch{setStatus("Không thể mở tệp đã chọn");}
  }
  async function insertImage(file:File){
    if(!["image/png","image/jpeg","image/webp","image/gif"].includes(file.type)||file.size>2*1024*1024){
      setStatus("Ảnh phải là PNG, JPEG, WebP hoặc GIF và không quá 2 MB");return;
    }
    const reader=new FileReader();
    reader.onload=()=>{
      if(typeof reader.result!=="string")return;
      command("insertHTML",'<img src="'+reader.result+'" alt="Hình ảnh" width="320"><p><br></p>');
    };
    reader.readAsDataURL(file);
  }
  function findText(){
    if(!query.trim())return;
    if(!editor.current)return;
    const walker=document.createTreeWalker(editor.current,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
      const node=walker.currentNode,textValue=node.textContent??"";
      const found=textValue.toLocaleLowerCase("vi").indexOf(query.toLocaleLowerCase("vi"));
      if(found>=0){
        const range=document.createRange();
        range.setStart(node,found);range.setEnd(node,Math.min(textValue.length,found+query.length));
        const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);
        editor.current.focus();rememberSelection();setStatus("Đã tìm thấy: "+query);return;
      }
    }
    setStatus("Không tìm thấy: "+query);
  }

  function currentBlock():HTMLElement|null{
    const node=savedSelection.current?.startContainer??window.getSelection()?.anchorNode;
    if(!node)return null;
    const element=node.nodeType===Node.ELEMENT_NODE?node as Element:node.parentElement;
    return (element?.closest("p,div,li,h1,h2,h3,h4,blockquote,td,th")??null) as HTMLElement|null;
  }
  function selectedChange(fn:(text:string)=>string){
    restoreSelection();
    const selected=window.getSelection()?.toString()??"";
    if(!selected){setStatus("Chọn văn bản trước khi sử dụng lệnh");return;}
    document.execCommand("insertText",false,fn(selected));rememberSelection();markChanged();
  }
  function changeCase(){selectedChange(text=>text===text.toLocaleUpperCase("vi")?text.toLocaleLowerCase("vi"):text.toLocaleUpperCase("vi"));}
  function sortLines(){selectedChange(text=>text.split(/\r?\n/).sort((a,b)=>a.localeCompare(b,"vi")).join("\n"));}
  function applyStyle(name:string){
    const tag:Record<string,string>={"Normal":"p","No Spacing":"p","Heading 1":"h1","Heading 2":"h2","Title":"h1","Subtitle":"h2"};
    blockCommand(tag[name]??"p");
    const block=currentBlock();
    if(block){
      if(name==="No Spacing")block.style.marginBottom="0px";
      if(name==="Title")block.style.fontSize="36px";
      if(name==="Subtitle")block.style.fontSize="20px";
    }
    markChanged();
  }
  function insertMultilevelList(){
    restoreSelection();
    const selected=window.getSelection()?.toString().trim()??"";
    const escapeHTML=(value:string)=>value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
    const lines=selected.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
    const first=lines.length?escapeHTML(lines[0]):"<br>";
    const children=lines.slice(1).length?lines.slice(1).map(line=>"<li>"+escapeHTML(line)+"</li>").join(""):"<li><br></li>";
    command("insertHTML","<ol><li>"+first+"<ol>"+children+"</ol></li></ol>");
  }
  function runHome(name:string,value?:string){
    if(name==="changeCaseMode"){
      if(value==="upper")selectedChange(text=>text.toLocaleUpperCase("vi"));
      else if(value==="lower")selectedChange(text=>text.toLocaleLowerCase("vi"));
      else if(value==="title")selectedChange(text=>text.toLocaleLowerCase("vi").replace(/(^|\s)(\p{L})/gu,(_,space,letter:string)=>space+letter.toLocaleUpperCase("vi")));
      else if(value==="sentence")selectedChange(text=>text.charAt(0).toLocaleUpperCase("vi")+text.slice(1).toLocaleLowerCase("vi"));
      return;
    }
    if(name==="underlineMode"){
      if(value!=="on"&&value!=="off")return;
      restoreSelection();
      if(document.queryCommandState("underline")!==(value==="on"))command("underline");
      return;
    }
    if(name==="removeHighlight"){command("hiliteColor","transparent");return;}
    if(name==="pasteRich"){
      if(clipboardMode&&stagedClipboard.current!==null){
        const content=stagedClipboard.current;
        setClipboardMode(null);stagedClipboard.current=null;
        command("insertText",content);
        return;
      }
      const range=savedSelection.current?.cloneRange()??null;
      if(!navigator.clipboard?.read){setStatus("Trình duyệt không hỗ trợ dán giữ định dạng; hãy dùng Ctrl+V");return;}
      void navigator.clipboard.read().then(async items=>{
        const html=items.find(item=>item.types.includes("text/html"));
        const plain=items.find(item=>item.types.includes("text/plain"));
        if(range&&editor.current?.contains(range.startContainer))savedSelection.current=range;
        if(html){const blob=await html.getType("text/html");command("insertHTML",sanitize(await blob.text()));}
        else if(plain){const blob=await plain.getType("text/plain");command("insertText",await blob.text());}
        else setStatus("Clipboard không có dữ liệu văn bản phù hợp");
      }).catch(()=>setStatus("Không được cấp quyền đọc clipboard; hãy dùng Ctrl+V"));
      return;
    }
    if(name==="paste"){
      if(clipboardMode&&stagedClipboard.current!==null){
        const content=stagedClipboard.current;
        setClipboardMode(null);stagedClipboard.current=null;
        command("insertText",content);
        return;
      }
      const range=savedSelection.current?.cloneRange()??null;
      if(!navigator.clipboard?.readText){setStatus("Dùng Ctrl+V để dán văn bản");return;}
      void navigator.clipboard.readText().then(content=>{
        if(range && editor.current?.contains(range.startContainer))savedSelection.current=range;
        if(content)command("insertText",content);
        else setStatus("Clipboard đang trống");
      }).catch(()=>setStatus("Không được cấp quyền clipboard; dùng Ctrl+V"));return;
    }
    if(name==="cut"||name==="copy"){
      restoreSelection();
      const selected=window.getSelection()?.toString()??"";
      if(!selected){setStatus("Chọn văn bản trước khi "+(name==="copy"?"sao chép":"cắt"));return;}
      stagedClipboard.current=selected;
      const success=document.execCommand(name,false);
      if(name==="cut"){
        if(!success)document.execCommand("delete");
        rememberSelection();markChanged();
      }else{
        window.getSelection()?.collapseToEnd();
        rememberSelection();
        if(!success&&navigator.clipboard?.writeText){
          void navigator.clipboard.writeText(selected).catch(()=>{});
        }
      }
      setClipboardMode(name);
      setPaintArmed(false);paintFormat.current=null;
      setStatus(name==="copy"?"Đã sao chép. Chọn vị trí rồi bấm Paste; Esc để hủy.":"Đã cắt. Chọn vị trí rồi bấm Paste; Esc để hủy.");
      return;
    }
    if(name==="formatPainter"){
      if(!hasSelection){setStatus("Chọn đoạn văn bản làm mẫu định dạng");return;}
      restoreSelection();
      paintFormat.current={
        font:document.queryCommandValue("fontName")||font,
        color:document.queryCommandValue("foreColor")||"#04122d",
        bold:document.queryCommandState("bold"),
        italic:document.queryCommandState("italic")
      };
      setPaintArmed(true);
      setStatus("Đã sao chép định dạng; chọn chữ đích");return;
    }
    if(name==="multilevelList"){insertMultilevelList();return;}
    if(name==="paragraphShading"){
      restoreSelection();
      const block=currentBlock();
      if(!block||!editor.current?.contains(block)){setStatus("Đặt con trỏ trong đoạn văn");return;}
      block.style.backgroundColor=value==="none"?"":value&&/^#[0-9a-f]{6}$/i.test(value)?value:block.style.backgroundColor?"":"#fff2a8";
      markChanged();return;
    }
    if(name==="lineSpacing"||name==="paragraphBorder"){
      restoreSelection();
      const block=currentBlock();
      if(!block||!editor.current?.contains(block)){setStatus("Đặt con trỏ trong đoạn văn");return;}
      if(name==="lineSpacing"){
        block.style.lineHeight=["1","1.15","1.5","2"].includes(value??"")?value!:block.style.lineHeight==="1.5"?"1":"1.5";
      }else if(value==="none"){
        block.style.borderBottom="";block.style.borderTop="";
      }else if(value==="top"){
        block.style.borderTop="1px solid #9ca3af";block.style.borderBottom="";
      }else if(value==="bottom"){
        block.style.borderBottom="1px solid #9ca3af";block.style.borderTop="";
      }else{
        block.style.borderBottom=block.style.borderBottom?"":"1px solid #9ca3af";
      }
      markChanged();return;
    }
    command(name,value);
  }
  function handleEditorMouseUp(){
    rememberSelection();
    const paint=paintFormat.current;
    const selection=window.getSelection();
    if(!paint||!selection||selection.isCollapsed)return;
    paintFormat.current=null;
    setPaintArmed(false);
    restoreSelection();
    if(/^(Aptos|Arial|Calibri|Georgia|Verdana|Times New Roman)$/i.test(paint.font))
      document.execCommand("fontName",false,paint.font);
    if(/^#[0-9a-f]{3,8}$/i.test(paint.color)||/^rgb\([\d\s,.%]+\)$/i.test(paint.color))
      document.execCommand("foreColor",false,paint.color);
    if(document.queryCommandState("bold")!==paint.bold)document.execCommand("bold");
    if(document.queryCommandState("italic")!==paint.italic)document.execCommand("italic");
    markChanged();setStatus("Đã áp dụng định dạng");
  }
  function replaceText(){
    const find=window.prompt("Tìm nội dung:",query);
    if(!find)return;
    const replacement=window.prompt("Thay bằng:","");
    if(replacement===null||!editor.current)return;
    const walker=document.createTreeWalker(editor.current,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
      const node=walker.currentNode,raw=node.textContent??"";
      const at=raw.toLocaleLowerCase("vi").indexOf(find.toLocaleLowerCase("vi"));
      if(at<0)continue;
      const range=document.createRange();range.setStart(node,at);range.setEnd(node,at+find.length);
      const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);
      editor.current.focus();document.execCommand("insertText",false,replacement);
      rememberSelection();markChanged();setStatus("Đã thay thế một kết quả");return;
    }
    setStatus("Không tìm thấy nội dung cần thay");
  }
  function selectAll(){editor.current?.focus();document.execCommand("selectAll");rememberSelection();}

  const commands=(items:RibbonCommand[])=>items.map(item=><ToolButton key={item.id} item={item}/>);
  const fileActions=[
    {icon:<FilePlus2 size={22}/>,label:"Tài liệu mới",action:newDocument},
    {icon:<FolderOpen size={22}/>,label:"Mở tệp HTML/TXT",action:()=>fileInput.current?.click()},
    {icon:<Save size={22}/>,label:"Tải xuống HTML",action:exportHTML},
    {icon:<FileText size={22}/>,label:"Tải xuống TXT",action:exportText},
    {icon:<Printer size={22}/>,label:"In / Lưu PDF",action:()=>window.print()},
  ];
  return <div className="wsl-shell" ref={shell}>
    <input type="file" accept=".html,.htm,.txt,text/html,text/plain" ref={fileInput} hidden onChange={event=>{const file=event.target.files?.[0];if(file)void importFile(file);event.target.value="";}}/>
    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" ref={imageInput} hidden onChange={event=>{const file=event.target.files?.[0];if(file)void insertImage(file);event.target.value="";}}/>
    <WordWindowBar filename={filename}
      onRename={value=>setFilename(value.replace(/[<>:"/\\|?*\u0000-\u001f]/g,"").slice(0,90))}
      onSave={saveDraft} onUndo={()=>command("undo")} onRedo={()=>command("redo")}
      onNew={newDocument} onPrint={()=>window.print()} onClose={saveDraft} status={status}/>
    <nav className="wsl-tabs" aria-label="Các thẻ lệnh Word">
      {TABS.map(tab=><button key={tab} type="button" className={"wsl-tab "+(tab===activeTab?"is-active":"")} aria-current={tab===activeTab?"page":undefined} onClick={()=>setActiveTab(tab)}>{tab}</button>)}
      <span className="wsl-tabs-spacer"/>
    </nav>
    <div className="wsl-ribbon" role="toolbar" aria-label={"Lệnh "+activeTab}>
      {activeTab==="File"&&<Group name="Tệp">{fileActions.map(item=><ToolButton key={item.label} item={{id:item.label,label:item.label,run:item.action,icon:item.icon}}/>)}</Group>}
      {activeTab==="Home"&&<WordHomeRibbon
        font={font} fontSize={fontSize} showMarks={showMarks} hasSelection={hasSelection} paintArmed={paintArmed}
        formatActive={formatActive} clipboardMode={clipboardMode}
        run={runHome} editFont={editFont} editSize={editSize}
        changeCase={changeCase} sortLines={sortLines} replaceText={replaceText}
        findText={()=>setSearchOpen(true)}
        selectAll={selectAll} toggleMarks={()=>setShowMarks(v=>!v)}
        applyStyle={applyStyle}
      />}
      {activeTab==="Insert"&&<>
        <Group name="Trang">{commands([
          {id:"hr",label:"Đường kẻ",run:()=>command("insertHorizontalRule"),icon:<Minus size={23}/>},
          {id:"break",label:"Ngắt trang",run:()=>command("insertHTML",'<div class="wsl-page-break" contenteditable="false">Ngắt trang</div><p><br></p>'),icon:<FilePlus2 size={21}/>}
        ])}</Group>
        <Group name="Bảng và hình">{commands([
          {id:"table",label:"Bảng 3×3",run:insertTable,icon:<Table2 size={23}/>},
          {id:"picture",label:"Hình ảnh",run:()=>imageInput.current?.click(),icon:<ImagePlus size={23}/>},
          {id:"link",label:"Liên kết",run:insertLink,icon:<Link2 size={21}/>}
        ])}</Group>
      </>}
      {activeTab==="Layout"&&<>
        <Group name="Thiết lập trang">
          <label className="wsl-ribbon-field"><span>Hướng trang</span><select value={orientation} onChange={event=>setOrientation(event.target.value as Orientation)}><option value="portrait">Dọc</option><option value="landscape">Ngang</option></select></label>
          <label className="wsl-ribbon-field"><span>Lề trang</span><select value={margins} onChange={event=>setMargins(event.target.value as Margins)}><option value="normal">Thông thường</option><option value="narrow">Hẹp</option></select></label>
          <span className="wsl-page-size-label">A4 · 210 × 297 mm</span>
        </Group>
      </>}
      {activeTab==="Review"&&<>
        <Group name="Kiểm tra"><button type="button" className="wsl-toggle-button" aria-pressed={spellcheck} onClick={()=>setSpellcheck(value=>!value)}><Check size={20}/><span>Kiểm tra chính tả: {spellcheck?"Bật":"Tắt"}</span></button>
          <span className="wsl-ribbon-note">{stats.words} từ · {stats.characters} ký tự</span>
        </Group>
        <Group name="Tìm kiếm"><button className="wsl-tool" type="button" onClick={()=>setSearchOpen(value=>!value)}><Search size={23}/><span>Tìm văn bản</span></button></Group>
      </>}
      {activeTab==="View"&&<>
        <Group name="Hiển thị"><button type="button" className="wsl-toggle-button" aria-pressed={showRuler} onClick={()=>setShowRuler(value=>!value)}><Ruler size={22}/><span>Thước: {showRuler?"Hiện":"Ẩn"}</span></button></Group>
        <Group name="Phóng to">
          <button className="wsl-small-control" onClick={()=>setZoom(v=>Math.max(60,v-10))} aria-label="Thu nhỏ" type="button"><Minus size={20}/></button>
          <output className="wsl-zoom-value">{zoom}%</output>
          <button className="wsl-small-control" onClick={()=>setZoom(v=>Math.min(160,v+10))} aria-label="Phóng to" type="button"><Plus size={20}/></button>
        </Group>
        <Group name="Cửa sổ"><button className="wsl-tool" type="button" onClick={()=>{if(shell.current?.requestFullscreen)void shell.current.requestFullscreen().catch(()=>setStatus("Trình duyệt không cho phép toàn màn hình"));}}><Maximize2 size={22}/><span>Toàn màn hình</span></button></Group>
      </>}
      {(["Design","References","Mailings","Help"] as Tab[]).includes(activeTab)&&<div className="wsl-tab-ribbon-empty">Các công cụ nâng cao chưa được hỗ trợ trong bản luyện tập này.</div>}
    </div>
    {searchOpen&&<form className="wsl-search" onSubmit={event=>{event.preventDefault();findText();}}>
      <Search size={18}/><input value={query} onChange={event=>setQuery(event.target.value)} aria-label="Tìm trong tài liệu" placeholder="Tìm trong tài liệu"/>
      <button type="submit">Tìm</button><button type="button" onClick={()=>setSearchOpen(false)} aria-label="Đóng tìm kiếm">×</button>
    </form>}
    <main className="wsl-workspace">
      <div className="wsl-page-scroll" aria-label="Vùng trang tài liệu">
        <div className="wsl-vertical-ruler" aria-hidden="true">{Array.from({length:15},(_,i)=><span key={i}>{i+1}</span>)}</div>
        <div className="wsl-scale" style={{transform:"scale("+zoom/100+")",transformOrigin:"top center",marginBottom:(zoom-100)*5+"px"}}>
          {showRuler&&<div className="wsl-ruler" aria-hidden="true">{Array.from({length:16},(_,i)=><span key={i}>{i+1}</span>)}</div>}
          <div className={"wsl-paper "+(orientation==="landscape"?"is-landscape ":"")+(margins==="narrow"?"is-narrow":"")}>
            <div ref={editor} className={"wsl-editor "+(showMarks?"show-paragraph-marks":"")} aria-label="Nội dung tài liệu Word" role="textbox" aria-multiline="true" contentEditable suppressContentEditableWarning spellCheck={spellcheck}
              onInput={()=>{rememberSelection();markChanged();}} onKeyUp={rememberSelection} onMouseUp={handleEditorMouseUp}
              onFocus={rememberSelection} onPaste={event=>{event.preventDefault();setClipboardMode(null);stagedClipboard.current=null;command("insertText",event.clipboardData.getData("text/plain"));}}
              onDrop={event=>event.preventDefault()}/>
          </div>
        </div>
      </div>
    </main>
    <footer className="wsl-statusbar">
      <span>Trang 1</span><span>{stats.words} từ</span><span>{stats.characters} ký tự</span>
      <span className="wsl-statusbar-spacer"/>
      <span><BookOpen size={15}/> Bố trí in</span><span>Tiếng Việt</span>
      <button aria-label="Giảm mức phóng" type="button" onClick={()=>setZoom(v=>Math.max(60,v-10))}><Minus size={15}/></button>
      <input type="range" aria-label="Mức phóng trang" min={60} max={160} step={10} value={zoom} onChange={event=>setZoom(Number(event.target.value))}/>
      <span>{zoom}%</span>
      <button aria-label="Tăng mức phóng" type="button" onClick={()=>setZoom(v=>Math.min(160,v+10))}><Plus size={15}/></button>
    </footer>
  </div>;
}
