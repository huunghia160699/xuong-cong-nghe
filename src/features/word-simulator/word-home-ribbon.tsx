"use client";

import type {ReactNode} from "react";
import {
  AlignCenter,AlignJustify,AlignLeft,AlignRight,ArrowDownAZ,ArrowDownToLine,
  ArrowRightToLine,CaseSensitive,ChevronDown,Clipboard,Copy,Eraser,
  Highlighter,IndentDecrease,IndentIncrease,Italic,List,ListOrdered,
  Paintbrush,Scissors,Search,Strikethrough,Subscript,Superscript,
  Underline,WholeWord
} from "lucide-react";

type Props={
  font:string; fontSize:string; showMarks:boolean; hasSelection:boolean; paintArmed:boolean;
  run:(name:string,value?:string)=>void;
  editFont:(name:string)=>void;editSize:(size:string)=>void;
  changeCase:()=>void;sortLines:()=>void;replaceText:()=>void;
  findText:()=>void;selectAll:()=>void;toggleMarks:()=>void;
  applyStyle:(name:string)=>void;
};

function Group({name,className="",children}:{name:string;className?:string;children:ReactNode}){
  return <section className={"wsl-home-group "+className} aria-label={"Nhóm "+name}>
    <div className="wsl-home-group-content">{children}</div>
    <span className="wsl-home-group-name">{name}</span>
  </section>;
}
function Btn({label,icon,run,active=false,disabled=false,className="",title}:{label:string;icon:ReactNode;run:()=>void;active?:boolean;disabled?:boolean;className?:string;title?:string}){
  return <button type="button" className={"wsl-hb "+className+(active?" is-active":"")}
    title={title??label} aria-label={label} aria-pressed={active||undefined} disabled={disabled}
    onMouseDown={event=>event.preventDefault()} onClick={run}>{icon}</button>;
}
const fontSizes=[["1","8"],["2","10"],["3","12"],["4","14"],["5","18"],["6","24"],["7","36"]];
const FONTS=["Aptos","Arial","Calibri","Times New Roman","Georgia","Verdana"];

export function WordHomeRibbon({
 font,fontSize,showMarks,hasSelection,paintArmed,run,editFont,editSize,changeCase,sortLines,
 replaceText,findText,selectAll,toggleMarks,applyStyle
}:Props){
 const size=Math.max(1,Math.min(7,Number(fontSize)||3));
 return <div className="wsl-home-ribbon" aria-label="Ribbon Home">
   <Group name="Clipboard" className="wsl-home-clipboard">
     <div className="wsl-home-paste">
       <Btn className="wsl-hb-paste" label="Paste — Dán" icon={<span className="wsl-clipboard-paste-art"><Clipboard size={31} strokeWidth={1.45}/></span>} run={()=>run("paste")}/>
       <span>Paste <ChevronDown size={10}/></span>
     </div>
     <div className="wsl-home-clipboard-stack">
       <Btn className="wsl-hb-with-text" label="Cut — Cắt" disabled={!hasSelection} icon={<><Scissors size={14}/><span>Cut</span></>} run={()=>run("cut")}/>
       <Btn className="wsl-hb-with-text" label="Copy — Sao chép" disabled={!hasSelection} icon={<><Copy size={14}/><span>Copy</span></>} run={()=>run("copy")}/>
       <Btn className="wsl-hb-with-text" label="Format Painter — Sao chép định dạng" disabled={!hasSelection} active={paintArmed} icon={<><Paintbrush size={14}/><span>Format Painter</span></>} run={()=>run("formatPainter")} title="Sao chép định dạng vùng đang chọn sang vùng khác"/>
     </div>
   </Group>

   <Group name="Font" className="wsl-home-font">
     <div className="wsl-font-top">
       <label className="wsl-compact-select wsl-compact-font">
         <span className="sr-only">Tên phông chữ</span>
         <select aria-label="Font" value={font} onChange={event=>editFont(event.target.value)}>
           {FONTS.map(name=><option value={name} key={name}>{name==="Aptos"?"Aptos (Body)":name}</option>)}
         </select>
       </label>
       <label className="wsl-compact-select wsl-compact-size">
         <span className="sr-only">Cỡ chữ</span>
         <select aria-label="Font Size" value={fontSize} onChange={event=>editSize(event.target.value)}>
           {fontSizes.map(([value,text])=><option key={value} value={value}>{text}</option>)}
         </select>
       </label>
       <Btn label="Increase Font Size" icon={<span className="wsl-font-letter">A<sup>↑</sup></span>} run={()=>editSize(String(Math.min(7,size+1)))}/>
       <Btn label="Decrease Font Size" icon={<span className="wsl-font-letter">A<sup>↓</sup></span>} run={()=>editSize(String(Math.max(1,size-1)))}/>
       <Btn label="Change Case" icon={<CaseSensitive size={18}/>} run={changeCase}/>
       <Btn label="Clear All Formatting" icon={<Eraser size={16}/>} run={()=>run("removeFormat")}/>
     </div>
     <div className="wsl-font-bottom">
       <Btn label="Bold" icon={<b>B</b>} run={()=>run("bold")}/>
       <Btn label="Italic" icon={<Italic size={15}/>} run={()=>run("italic")}/>
       <Btn label="Underline" icon={<><Underline size={16}/><ChevronDown size={9}/></>} run={()=>run("underline")} className="wsl-underline-dropdown"/>
       <Btn label="Strikethrough" icon={<Strikethrough size={16}/>} run={()=>run("strikeThrough")}/>
       <Btn label="Subscript" icon={<Subscript size={16}/>} run={()=>run("subscript")}/>
       <Btn label="Superscript" icon={<Superscript size={16}/>} run={()=>run("superscript")}/>
       <span className="wsl-font-effect-disabled" title="Text Effects chưa hỗ trợ" aria-hidden="true"><span className="wsl-word-color-effect">A</span></span>
       <label className="wsl-color-compact"><Highlighter size={17} color="#c39b02"/><input aria-label="Text Highlight Color" type="color" defaultValue="#ffff00" onChange={event=>run("hiliteColor",event.target.value)}/></label>
       <label className="wsl-color-compact"><span className="wsl-letter-black">A</span><input aria-label="Font Color" type="color" defaultValue="#04122d" onChange={event=>run("foreColor",event.target.value)}/></label>
     </div>
   </Group>

   <Group name="Paragraph" className="wsl-home-paragraph">
     <div className="wsl-paragraph-row">
       <Btn label="Bullets" icon={<List size={18}/>} run={()=>run("insertUnorderedList")}/>
       <Btn label="Numbering" icon={<ListOrdered size={18}/>} run={()=>run("insertOrderedList")}/>
       <Btn label="Multilevel List" icon={<span className="wsl-multi-list">1.<small>1.1</small></span>} run={()=>run("indent")} title="Thụt danh sách sang cấp tiếp theo"/>
       <span className="wsl-group-rule"/>
       <Btn label="Decrease Indent" icon={<IndentDecrease size={18}/>} run={()=>run("outdent")}/>
       <Btn label="Increase Indent" icon={<IndentIncrease size={18}/>} run={()=>run("indent")}/>
       <Btn label="Sort" icon={<ArrowDownAZ size={18}/>} run={sortLines}/>
       <Btn label="Show/Hide ¶" icon={<span className="wsl-pilcrow">¶</span>} active={showMarks} run={toggleMarks}/>
     </div>
     <div className="wsl-paragraph-row">
       <Btn label="Align Left" icon={<AlignLeft size={18}/>} run={()=>run("justifyLeft")}/>
       <Btn label="Center" icon={<AlignCenter size={18}/>} run={()=>run("justifyCenter")}/>
       <Btn label="Align Right" icon={<AlignRight size={18}/>} run={()=>run("justifyRight")}/>
       <Btn label="Justify" icon={<AlignJustify size={18}/>} run={()=>run("justifyFull")}/>
       <span className="wsl-group-rule"/>
       <Btn label="Line Spacing 1.5" icon={<ArrowDownToLine size={18}/>} run={()=>run("lineSpacing")} title="Giãn dòng 1.5"/>
       <Btn label="Paragraph Shading" icon={<span className="wsl-shading-symbol">▨</span>} run={()=>run("backColor","#f0f6fd")}/>
       <Btn label="Borders" icon={<span className="wsl-border-symbol">▦</span>} run={()=>run("paragraphBorder")}/>
     </div>
   </Group>

   <Group name="Styles" className="wsl-home-styles">
     <div className="wsl-style-gallery">
       {[
         ["Normal","Normal"],
         ["No Spacing","No Spacing"],
         ["Heading 1","Heading 1"],
         ["Heading 2","Heading 2"],
         ["Title","Title"],
         ["Subtitle","Subtitle"]
       ].map(([style,label])=><button type="button" key={style} className={"wsl-style-tile wsl-style-"+style.replaceAll(" ","-").toLowerCase()}
         onMouseDown={event=>event.preventDefault()} onClick={()=>applyStyle(style)}
         aria-label={"Style: "+label} title={"Apply style: "+label}>
         <span>{label}</span>
       </button>)}
     </div>
     <div className="wsl-styles-scroll" aria-hidden="true"><ChevronDown size={13}/></div>
   </Group>

   <Group name="Editing" className="wsl-home-editing">
     <Btn className="wsl-hb-with-text" label="Find — Tìm" icon={<><Search size={15}/><span>Find</span></>} run={findText}/>
     <Btn className="wsl-hb-with-text" label="Replace — Thay thế" icon={<><WholeWord size={15}/><span>Replace</span></>} run={replaceText}/>
     <Btn className="wsl-hb-with-text" label="Select All" icon={<><ArrowRightToLine size={15}/><span>Select</span></>} run={selectAll}/>
   </Group>
 </div>;
}
