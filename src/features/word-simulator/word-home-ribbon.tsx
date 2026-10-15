"use client";

import {useState,type ReactNode} from "react";
import {WordSplitButton} from "./word-split-button";
import {WordRibbonDialog,type RibbonDialogAction} from "./word-ribbon-dialog";
import {
  AlignCenter,AlignJustify,AlignLeft,AlignRight,
  ArrowDownRight,ArrowRightToLine,ChevronDown,Clipboard,Copy,Eraser,
  Grid2X2,Highlighter,PaintBucket,
  Paintbrush,Scissors,Search,
  WholeWord
} from "lucide-react";

export type WordFormatKey="bold"|"italic"|"underline"|"strikeThrough"|"subscript"|"superscript";
type Props={
  formatActive:Record<WordFormatKey,boolean>;clipboardMode:"copy"|"cut"|null;
  font:string; fontSize:string; showMarks:boolean; hasSelection:boolean; paintArmed:boolean;
  run:(name:string,value?:string)=>void;
  editFont:(name:string)=>void;editSize:(size:string)=>void;
  changeCase:()=>void;sortLines:()=>void;replaceText:()=>void;
  findText:()=>void;selectAll:()=>void;toggleMarks:()=>void;
  applyStyle:(name:string)=>void;
};

function Group({name,className="",children,onDetails}:{name:string;className?:string;children:ReactNode;onDetails:()=>void}){
  return <section className={"wsl-home-group "+className} aria-label={"Nhóm "+name}>
    <div className="wsl-home-group-content">{children}</div>
    <span className="wsl-home-group-name">{name}</span>
    <button type="button" className="wsl-group-launcher" aria-label={"Mở hộp thoại "+name}
      title={"Tùy chọn chi tiết "+name} onMouseDown={event=>event.preventDefault()}
      onClick={onDetails}><ArrowDownRight size={12} strokeWidth={1.65}/></button>
  </section>;
}
function Btn({label,icon,run,active=false,disabled=false,className="",title}:{label:string;icon:ReactNode;run:()=>void;active?:boolean;disabled?:boolean;className?:string;title?:string}){
  return <button type="button" className={"wsl-hb "+className+(active?" is-active":"")}
    title={disabled?undefined:(title??label)} aria-label={label} aria-pressed={active||undefined} disabled={disabled}
    onMouseDown={event=>event.preventDefault()} onClick={run}>{icon}</button>;
}

function WordListGlyph({kind}:{kind:"bullets"|"numbering"|"multilevel"}){
  return <span className="wsl-paragraph-list-glyph" aria-hidden="true">
    {kind==="multilevel"?
      <svg className="wsl-paragraph-multilevel-mark" viewBox="0 0 26 21" focusable="false">
        <g fill="#1c6da8" fontFamily="Arial,sans-serif" fontSize="7.6" fontWeight="600">
          <text x="0.3" y="6.4">1.</text><text x="4" y="13.2">a.</text><text x="8" y="20">i.</text>
        </g>
        <g stroke="#505c69" strokeWidth="1.45" strokeLinecap="square">
          <path d="M9 4H25M12.5 10.8H25M16 17.5H25"/>
        </g>
      </svg>:
      <svg viewBox="0 0 23 21" focusable="false">
        <path d="M7 4h14M7 10.5h14M7 17h14" stroke="#495663" strokeWidth="1.35"/>
        {kind==="bullets"
          ?<g fill="#1767a8"><circle cx="2.6" cy="4" r="1.45"/><circle cx="2.6" cy="10.5" r="1.45"/><circle cx="2.6" cy="17" r="1.45"/></g>
          :<g fontSize="7" fontFamily="Arial,sans-serif" fontWeight="600" fill="#1767a8">
            <text x="0" y="6.5">1</text><text x="0" y="13">2</text><text x="0" y="19.5">3</text>
          </g>}
      </svg>}
  </span>;
}

function WordIndentGlyph({direction}:{direction:"decrease"|"increase"}){
  return <svg className="wsl-paragraph-indent-glyph" viewBox="0 0 24 22" aria-hidden="true" focusable="false">
    <g stroke="#43494e" strokeWidth="1.3" strokeLinecap="square" fill="none">
      <path d="M2 3H22M13 8.3H22M13 13.7H22M2 19H22"/>
    </g>
    {/* Scale the arrow to 70% about its original center (6.75, 11). */}
    <g transform="translate(2.025 3.3) scale(0.7)" fill="#168fca">
      {direction==="decrease"
        ?<path d="M1.5 11 8 6.7v2.7h4v3.2H8v2.7Z"/>
        :<path d="M12 11 5.5 6.7v2.7h-4v3.2h4v2.7Z"/>}
    </g>
  </svg>;
}

function WordLineSpacingGlyph(){
  return <svg className="wsl-paragraph-line-glyph" viewBox="0 0 28 22" aria-hidden="true" focusable="false">
    <g stroke="#556170" strokeWidth="1.45" strokeLinecap="square" fill="none">
      <path d="M11.5 3H27"/>
      <path d="M11.5 8.3H27"/>
      <path d="M11.5 13.7H27"/>
      <path d="M11.5 19H27"/>
    </g>
    <g stroke="#157fc4" strokeWidth="1.35" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 19.5V2.5M1.8 5.7 5 2.5l3.2 3.2M1.8 16.3 5 19.5l3.2-3.2"/>
    </g>
  </svg>;
}

function WordSortGlyph(){
  return <svg className="wsl-paragraph-sort-glyph" viewBox="0 0 24 22" aria-hidden="true" focusable="false">
    <g fontFamily="Arial,sans-serif" fontWeight="700" fontSize="11">
      <text x="2" y="9.2" fill="#167fc0">A</text>
      <text x="2" y="19.2" fill="#3f4c5a">Z</text>
    </g>
    <path d="M18 2v15.5m-3.5-3.5 3.5 3.5 3.5-3.5" stroke="#3e4a58" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>;
}

const fontSizes=[["1","8"],["2","10"],["3","12"],["4","14"],["5","18"],["6","24"],["7","36"]];
const FONTS=["Aptos","Arial","Calibri","Times New Roman","Georgia","Verdana"];
// Shared display size for every expand/dropdown chevron in the Home ribbon.
const RIBBON_EXPAND_ARROW_SIZE=13;

export function WordHomeRibbon({
 font,fontSize,showMarks,hasSelection,paintArmed,formatActive,clipboardMode,run,editFont,editSize,changeCase,sortLines,
 replaceText,findText,selectAll,toggleMarks,applyStyle
}:Props){
 const size=Math.max(1,Math.min(7,Number(fontSize)||3));
 const [highlightColor,setHighlightColor]=useState("#ffff00");
 const [textColor,setTextColor]=useState("#c91c2a");
 const [selectedStyle,setSelectedStyle]=useState("Normal");
 const selectStyle=(style:string)=>{applyStyle(style);setSelectedStyle(style);};
 const [dialog,setDialog]=useState<"Clipboard"|"Font"|"Paragraph"|"Styles"|"Editing"|null>(null);
 const dialogActions:RibbonDialogAction[]=dialog==="Clipboard"?[
   {label:"Dán",run:()=>run("paste")},{label:"Sao chép",run:()=>run("copy")},
   {label:"Cắt",run:()=>run("cut")},{label:"Sao chép định dạng",run:()=>run("formatPainter")}
 ]:dialog==="Font"?[
   {label:"Đậm",run:()=>run("bold")},{label:"Nghiêng",run:()=>run("italic")},
   {label:"Gạch chân",run:()=>run("underline")},{label:"Gạch ngang",run:()=>run("strikeThrough")},
   {label:"Chỉ số dưới",run:()=>run("subscript")},{label:"Chỉ số trên",run:()=>run("superscript")},
   {label:"Xóa định dạng",run:()=>run("removeFormat")},{label:"Chữ hoa / thường",run:changeCase}
 ]:dialog==="Paragraph"?[
   {label:"Căn trái",run:()=>run("justifyLeft")},{label:"Căn giữa",run:()=>run("justifyCenter")},
   {label:"Căn phải",run:()=>run("justifyRight")},{label:"Căn đều",run:()=>run("justifyFull")},
   ...["1","1.15","1.5","2"].map(value=>({label:"Giãn dòng "+value,run:()=>run("lineSpacing",value)})),
   {label:"Tăng thụt lề",run:()=>run("indent")},{label:"Giảm thụt lề",run:()=>run("outdent")}
 ]:dialog==="Styles"?["Normal","No Spacing","Heading 1","Heading 2","Title","Subtitle"]
   .map(style=>({label:style,run:()=>selectStyle(style)}))
 :dialog==="Editing"?[
   {label:"Tìm kiếm",run:findText},{label:"Thay thế",run:replaceText},{label:"Chọn tất cả",run:selectAll}
 ]:[];
 return <><div className="wsl-home-ribbon" aria-label="Ribbon Home">
   <Group name="Clipboard" className="wsl-home-clipboard" onDetails={()=>setDialog("Clipboard")}>
     <div className="wsl-home-paste">
       <WordSplitButton className="wsl-paste-split" vertical label="Paste — Dán"
         icon={<span className="wsl-clipboard-paste-art"><Clipboard size={31} strokeWidth={1.45}/></span>}
         run={()=>run("paste")}
         options={[
           {label:"Dán văn bản",run:()=>run("paste")},
           {label:"Dán giữ định dạng (HTML)",run:()=>run("pasteRich")}
         ]}/>
     </div>
     <div className="wsl-home-clipboard-stack">
       <Btn className="wsl-hb-with-text" label="Cut — Cắt" disabled={!hasSelection} icon={<><Scissors size={14}/><span>Cut</span></>} run={()=>run("cut")}/>
       <Btn className="wsl-hb-with-text" label="Copy — Sao chép" disabled={!hasSelection} icon={<><Copy size={14}/><span>Copy</span></>} run={()=>run("copy")}/>
       <Btn className="wsl-hb-with-text" label="Format Painter — Sao chép định dạng" disabled={!hasSelection} active={paintArmed} icon={<><Paintbrush size={14}/><span>Format Painter</span></>} run={()=>run("formatPainter")} title="Sao chép định dạng vùng đang chọn sang vùng khác"/>
     </div>
   </Group>

   <Group name="Font" className="wsl-home-font" onDetails={()=>setDialog("Font")}>
     <div className="wsl-font-top">
       <label className="wsl-font-select wsl-font-family">
         <span className="sr-only">Phông chữ</span>
         <select aria-label="Font" value={font} onChange={event=>editFont(event.target.value)}>
           {FONTS.map(name=><option value={name} key={name}>{name==="Aptos"?"Aptos (Body)":name}</option>)}
         </select>
         <ChevronDown size={RIBBON_EXPAND_ARROW_SIZE} aria-hidden="true" className="wsl-font-select-chevron"/>
       </label>
       <label className="wsl-font-select wsl-font-size">
         <span className="sr-only">Cỡ chữ</span>
         <select aria-label="Font Size" value={fontSize} onChange={event=>editSize(event.target.value)}>
           {fontSizes.map(([value,text])=><option key={value} value={value}>{text}</option>)}
         </select>
         <ChevronDown size={RIBBON_EXPAND_ARROW_SIZE} aria-hidden="true" className="wsl-font-select-chevron"/>
       </label>
       <Btn className="wsl-font-icon-button" label="Increase Font Size" icon={<span className="wsl-font-size-symbol wsl-font-grow" aria-hidden="true"><span className="wsl-font-size-letter">A<svg className="wsl-font-size-direction" viewBox="0 0 9 8" focusable="false"><path d="M1.4 5.8 4.5 2.7 7.6 5.8" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="square" strokeLinejoin="miter"/></svg></span></span>} run={()=>editSize(String(Math.min(7,size+1)))}/>
       <Btn className="wsl-font-icon-button" label="Decrease Font Size" icon={<span className="wsl-font-size-symbol wsl-font-shrink" aria-hidden="true"><span className="wsl-font-size-letter">A<svg className="wsl-font-size-direction" viewBox="0 0 9 8" focusable="false"><path d="M1.4 2.2 4.5 5.3 7.6 2.2" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="square" strokeLinejoin="miter"/></svg></span></span>} run={()=>editSize(String(Math.max(1,size-1)))}/>
       <span className="wsl-font-divider" aria-hidden="true"/>
       <WordSplitButton className="wsl-font-split wsl-font-change-case-button" label="Change Case"
         icon={<span className="wsl-font-change-case" aria-hidden="true">Aa</span>} run={changeCase}
         options={[
           {label:"CHỮ HOA",run:()=>run("changeCaseMode","upper")},
           {label:"chữ thường",run:()=>run("changeCaseMode","lower")},
           {label:"Viết Hoa Từng Từ",run:()=>run("changeCaseMode","title")},
           {label:"Viết hoa đầu câu",run:()=>run("changeCaseMode","sentence")}
         ]}/>
       <span className="wsl-font-divider" aria-hidden="true"/>
       <Btn className="wsl-font-icon-button" label="Clear All Formatting" icon={<Eraser size={20} strokeWidth={1.75} aria-hidden="true"/>} run={()=>run("removeFormat")}/>
     </div>
     <div className="wsl-font-bottom">
       <Btn className="wsl-font-icon-button" label="Bold" active={formatActive.bold} icon={<span className="wsl-font-bold" aria-hidden="true">B</span>} run={()=>run("bold")}/>
       <Btn className="wsl-font-icon-button" label="Italic" active={formatActive.italic} icon={<span className="wsl-font-italic" aria-hidden="true">I</span>} run={()=>run("italic")}/>
       <WordSplitButton className="wsl-font-split wsl-font-underline-button" label="Underline" active={formatActive.underline}
         icon={<span className="wsl-font-underline" aria-hidden="true">U</span>} run={()=>run("underline")}
         options={[
           {label:"Bật gạch chân",run:()=>run("underlineMode","on")},
           {label:"Bỏ gạch chân",run:()=>run("underlineMode","off")}
         ]}/>
       <Btn className="wsl-font-icon-button" label="Strikethrough" active={formatActive.strikeThrough} icon={<span className="wsl-font-strike" aria-hidden="true">ab</span>} run={()=>run("strikeThrough")}/>
       <Btn className="wsl-font-icon-button" label="Subscript" active={formatActive.subscript} icon={<span className="wsl-font-sub" aria-hidden="true">x<sub>2</sub></span>} run={()=>run("subscript")}/>
       <Btn className="wsl-font-icon-button" label="Superscript" active={formatActive.superscript} icon={<span className="wsl-font-super" aria-hidden="true">x<sup>2</sup></span>} run={()=>run("superscript")}/>
       <span className="wsl-font-divider" aria-hidden="true"/>
       <span className="wsl-font-effect-disabled" aria-hidden="true"><span className="wsl-word-color-effect">A</span></span>
       <WordSplitButton className="wsl-font-split wsl-font-color-split" label="Text Highlight Color"
         icon={<span className="wsl-font-color-art"><Highlighter size={17} strokeWidth={1.8} aria-hidden="true"/><span className="wsl-font-color-swatch" style={{backgroundColor:highlightColor}}/></span>}
         run={()=>run("hiliteColor",highlightColor)}
         options={["#ffff00","#a7f3d0","#bfdbfe","#fecdd3"].map(color=>({
           label:color==="#ffff00"?"Vàng":color==="#a7f3d0"?"Xanh lá":color==="#bfdbfe"?"Xanh dương":"Hồng",
           color,run:()=>{setHighlightColor(color);run("hiliteColor",color);}
         })).concat([{label:"Không tô sáng",color:"#ffffff",run:()=>run("removeHighlight")}])}
         footer={<label className="wsl-split-custom-color">Màu tùy chọn <input type="color" value={highlightColor} onChange={event=>{setHighlightColor(event.target.value);run("hiliteColor",event.target.value);}}/></label>}/>
       <WordSplitButton className="wsl-font-split wsl-font-color-split" label="Font Color"
         icon={<span className="wsl-font-color-art"><span className="wsl-font-color-letter">A</span><span className="wsl-font-color-swatch" style={{backgroundColor:textColor}}/></span>}
         run={()=>run("foreColor",textColor)}
         options={["#111827","#c91c2a","#2563eb","#15803d","#7c3aed"].map(color=>({
           label:color==="#111827"?"Đen":color==="#c91c2a"?"Đỏ":color==="#2563eb"?"Xanh dương":color==="#15803d"?"Xanh lá":"Tím",
           color,run:()=>{setTextColor(color);run("foreColor",color);}
         }))}
         footer={<label className="wsl-split-custom-color">Màu tùy chọn <input type="color" value={textColor} onChange={event=>{setTextColor(event.target.value);run("foreColor",event.target.value);}}/></label>}/>
     </div>
   </Group>

   <Group name="Paragraph" className="wsl-home-paragraph" onDetails={()=>setDialog("Paragraph")}>
     <div className="wsl-paragraph-top">
       <WordSplitButton className="wsl-paragraph-split wsl-paragraph-list-button" label="Bullets"
         icon={<WordListGlyph kind="bullets"/>} run={()=>run("insertUnorderedList")}
         options={[
           {label:"Danh sách dấu đầu dòng",run:()=>run("insertUnorderedList")},
           {label:"Danh sách đánh số",run:()=>run("insertOrderedList")},
           {label:"Danh sách nhiều cấp",run:()=>run("multilevelList")}
         ]}/>
       <WordSplitButton className="wsl-paragraph-split wsl-paragraph-list-button" label="Numbering"
         icon={<WordListGlyph kind="numbering"/>} run={()=>run("insertOrderedList")}
         options={[
           {label:"Danh sách dấu đầu dòng",run:()=>run("insertUnorderedList")},
           {label:"Danh sách đánh số",run:()=>run("insertOrderedList")},
           {label:"Danh sách nhiều cấp",run:()=>run("multilevelList")}
         ]}/>
       <WordSplitButton className="wsl-paragraph-split wsl-paragraph-list-button" label="Multilevel List"
         icon={<WordListGlyph kind="multilevel"/>} run={()=>run("multilevelList")}
         options={[
           {label:"Danh sách dấu đầu dòng",run:()=>run("insertUnorderedList")},
           {label:"Danh sách đánh số",run:()=>run("insertOrderedList")},
           {label:"Danh sách nhiều cấp",run:()=>run("multilevelList")}
         ]}/>
       <span className="wsl-paragraph-divider" aria-hidden="true"/>
       <Btn className="wsl-paragraph-icon-button" label="Decrease Indent" icon={<WordIndentGlyph direction="decrease"/>} run={()=>run("outdent")}/>
       <Btn className="wsl-paragraph-icon-button" label="Increase Indent" icon={<WordIndentGlyph direction="increase"/>} run={()=>run("indent")}/>
       <span className="wsl-paragraph-divider" aria-hidden="true"/>
       <Btn className="wsl-paragraph-icon-button" label="Sort" icon={<WordSortGlyph/>} run={sortLines}/>
       <Btn className="wsl-paragraph-icon-button" label="Show/Hide ¶" icon={<span className="wsl-paragraph-pilcrow">¶</span>} active={showMarks} run={toggleMarks}/>
     </div>
     <div className="wsl-paragraph-bottom">
       <Btn className="wsl-paragraph-icon-button" label="Align Left" icon={<AlignLeft size={18}/>} run={()=>run("justifyLeft")}/>
       <Btn className="wsl-paragraph-icon-button" label="Center" icon={<AlignCenter size={18}/>} run={()=>run("justifyCenter")}/>
       <Btn className="wsl-paragraph-icon-button" label="Align Right" icon={<AlignRight size={18}/>} run={()=>run("justifyRight")}/>
       <Btn className="wsl-paragraph-icon-button" label="Justify" icon={<AlignJustify size={18}/>} run={()=>run("justifyFull")}/>
       <span className="wsl-paragraph-divider" aria-hidden="true"/>
       <WordSplitButton className="wsl-paragraph-split wsl-paragraph-combo-button" label="Line Spacing 1.5"
         icon={<span className="wsl-paragraph-combo wsl-paragraph-line-spacing"><WordLineSpacingGlyph/></span>}
         run={()=>run("lineSpacing")}
         options={["1","1.15","1.5","2"].map(value=>({label:"Giãn dòng "+value,run:()=>run("lineSpacing",value)}))}/>
       <WordSplitButton className="wsl-paragraph-split wsl-paragraph-combo-button" label="Paragraph Shading"
         icon={<span className="wsl-paragraph-combo wsl-paragraph-shading"><PaintBucket size={18}/><span className="wsl-paragraph-shading-swatch"/></span>}
         run={()=>run("paragraphShading")}
         options={[
           {label:"Nền vàng",color:"#fff2a8",run:()=>run("paragraphShading","#fff2a8")},
           {label:"Nền xanh",color:"#dbeafe",run:()=>run("paragraphShading","#dbeafe")},
           {label:"Nền xanh lá",color:"#dcfce7",run:()=>run("paragraphShading","#dcfce7")},
           {label:"Không tô nền",run:()=>run("paragraphShading","none")}
         ]}/>
       <WordSplitButton className="wsl-paragraph-split wsl-paragraph-combo-button" label="Borders"
         icon={<span className="wsl-paragraph-combo wsl-paragraph-borders"><Grid2X2 size={17}/></span>}
         run={()=>run("paragraphBorder")}
         options={[
           {label:"Viền dưới",run:()=>run("paragraphBorder","bottom")},
           {label:"Viền trên",run:()=>run("paragraphBorder","top")},
           {label:"Bỏ viền",run:()=>run("paragraphBorder","none")}
         ]}/>
     </div>
   </Group>

   <Group name="Styles" className="wsl-home-styles" onDetails={()=>setDialog("Styles")}>
     <div className="wsl-style-picker" aria-label="Bộ sưu tập kiểu văn bản">
       <div className="wsl-style-gallery">
         {["Normal","No Spacing","Heading 1","Heading 2"].map(style=>
           <button type="button" key={style}
             className={"wsl-style-tile wsl-style-"+style.replaceAll(" ","-").toLowerCase()}
             onMouseDown={event=>event.preventDefault()} onClick={()=>selectStyle(style)}
             aria-label={"Style: "+style} aria-pressed={selectedStyle===style}
             title={"Áp dụng kiểu "+style}>
             <span>{style}</span>
           </button>)}
       </div>
       <div className="wsl-styles-scroll">
         <WordSplitButton arrowOnly className="wsl-style-menu-button" label="Styles"
           options={["Normal","No Spacing","Heading 1","Heading 2","Title","Subtitle"]
             .map(value=>({label:value,run:()=>selectStyle(value)}))}/>
       </div>
     </div>
   </Group>

   <Group name="Editing" className="wsl-home-editing" onDetails={()=>setDialog("Editing")}>
     <Btn className="wsl-hb-with-text" label="Find — Tìm" icon={<><Search size={15}/><span>Find</span></>} run={findText}/>
     <Btn className="wsl-hb-with-text" label="Replace — Thay thế" icon={<><WholeWord size={15}/><span>Replace</span></>} run={replaceText}/>
     <Btn className="wsl-hb-with-text" label="Select All" icon={<><ArrowRightToLine size={15}/><span>Select</span></>} run={selectAll}/>
   </Group>
 </div>
   {dialog&&<WordRibbonDialog name={dialog} actions={dialogActions} onClose={()=>setDialog(null)}/>}
 </>;
}
