"use client";

import {useState,type ReactNode} from "react";
import {
  AlignCenter,AlignJustify,AlignLeft,AlignRight,ArrowDownAZ,ArrowDownToLine,
  ArrowRightToLine,ChevronDown,Clipboard,Copy,Eraser,
  Highlighter,IndentDecrease,IndentIncrease,List,ListOrdered,
  Paintbrush,Scissors,Search,
  WholeWord
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
    title={disabled?undefined:(title??label)} aria-label={label} aria-pressed={active||undefined} disabled={disabled}
    onMouseDown={event=>event.preventDefault()} onClick={run}>{icon}</button>;
}
const fontSizes=[["1","8"],["2","10"],["3","12"],["4","14"],["5","18"],["6","24"],["7","36"]];
const FONTS=["Aptos","Arial","Calibri","Times New Roman","Georgia","Verdana"];

export function WordHomeRibbon({
 font,fontSize,showMarks,hasSelection,paintArmed,run,editFont,editSize,changeCase,sortLines,
 replaceText,findText,selectAll,toggleMarks,applyStyle
}:Props){
 const size=Math.max(1,Math.min(7,Number(fontSize)||3));
 const [highlightColor,setHighlightColor]=useState("#ffff00");
 const [textColor,setTextColor]=useState("#c91c2a");
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
       <label className="wsl-font-select wsl-font-family">
         <span className="sr-only">Phông chữ</span>
         <select aria-label="Font" value={font} onChange={event=>editFont(event.target.value)}>
           {FONTS.map(name=><option value={name} key={name}>{name==="Aptos"?"Aptos (Body)":name}</option>)}
         </select>
         <ChevronDown size={12} aria-hidden="true" className="wsl-font-select-chevron"/>
       </label>
       <label className="wsl-font-select wsl-font-size">
         <span className="sr-only">Cỡ chữ</span>
         <select aria-label="Font Size" value={fontSize} onChange={event=>editSize(event.target.value)}>
           {fontSizes.map(([value,text])=><option key={value} value={value}>{text}</option>)}
         </select>
         <ChevronDown size={11} aria-hidden="true" className="wsl-font-select-chevron"/>
       </label>
       <Btn className="wsl-font-icon-button" label="Increase Font Size" icon={<span className="wsl-font-size-symbol wsl-font-grow" aria-hidden="true"><span className="wsl-font-size-letter">A</span><span className="wsl-font-size-direction">↑</span></span>} run={()=>editSize(String(Math.min(7,size+1)))}/>
       <Btn className="wsl-font-icon-button" label="Decrease Font Size" icon={<span className="wsl-font-size-symbol wsl-font-shrink" aria-hidden="true"><span className="wsl-font-size-letter">A</span><span className="wsl-font-size-direction">↓</span></span>} run={()=>editSize(String(Math.max(1,size-1)))}/>
       <span className="wsl-font-divider" aria-hidden="true"/>
       <Btn className="wsl-font-icon-button" label="Change Case" icon={<span className="wsl-font-change-case" aria-hidden="true">Aa<ChevronDown size={9}/></span>} run={changeCase}/>
       <span className="wsl-font-divider" aria-hidden="true"/>
       <Btn className="wsl-font-icon-button" label="Clear All Formatting" icon={<Eraser size={20} strokeWidth={1.75} aria-hidden="true"/>} run={()=>run("removeFormat")}/>
     </div>
     <div className="wsl-font-bottom">
       <Btn className="wsl-font-icon-button" label="Bold" icon={<span className="wsl-font-bold" aria-hidden="true">B</span>} run={()=>run("bold")}/>
       <Btn className="wsl-font-icon-button" label="Italic" icon={<span className="wsl-font-italic" aria-hidden="true">I</span>} run={()=>run("italic")}/>
       <Btn className="wsl-font-icon-button wsl-font-underline-button" label="Underline" icon={<span className="wsl-font-underline" aria-hidden="true">U<ChevronDown size={9}/></span>} run={()=>run("underline")}/>
       <Btn className="wsl-font-icon-button" label="Strikethrough" icon={<span className="wsl-font-strike" aria-hidden="true">ab</span>} run={()=>run("strikeThrough")}/>
       <Btn className="wsl-font-icon-button" label="Subscript" icon={<span className="wsl-font-sub" aria-hidden="true">x<sub>2</sub></span>} run={()=>run("subscript")}/>
       <Btn className="wsl-font-icon-button" label="Superscript" icon={<span className="wsl-font-super" aria-hidden="true">x<sup>2</sup></span>} run={()=>run("superscript")}/>
       <span className="wsl-font-divider" aria-hidden="true"/>
       <span className="wsl-font-effect-disabled" aria-hidden="true"><span className="wsl-word-color-effect">A</span></span>
       <label className="wsl-font-color-control" aria-label="Text Highlight Color">
         <Highlighter size={17} strokeWidth={1.8} aria-hidden="true"/>
         <span className="wsl-font-color-swatch" style={{backgroundColor:highlightColor}} aria-hidden="true"/>
         <ChevronDown size={9} className="wsl-font-color-chevron" aria-hidden="true"/>
         <input type="color" value={highlightColor} aria-label="Text Highlight Color" onChange={event=>{setHighlightColor(event.target.value);run("hiliteColor",event.target.value);}}/>
       </label>
       <label className="wsl-font-color-control" aria-label="Font Color">
         <span className="wsl-font-color-letter" aria-hidden="true">A</span>
         <span className="wsl-font-color-swatch" style={{backgroundColor:textColor}} aria-hidden="true"/>
         <ChevronDown size={9} className="wsl-font-color-chevron" aria-hidden="true"/>
         <input type="color" value={textColor} aria-label="Font Color" onChange={event=>{setTextColor(event.target.value);run("foreColor",event.target.value);}}/>
       </label>
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
