"use client";
import {useState} from "react";
import {ArrowLeft,ArrowRight,CheckCircle2,ChevronDown,FileText,Image as ImageIcon} from "lucide-react";
import type {PresentationBlock} from "../types";

type DemoStep={tab:string;command:string;title:string;detail:string;result?:string};
type Demo=PresentationBlock&{scene:string;filename?:string;heading?:string;paragraphs?:string[];bullets?:string[];
  table?:{headers:string[];rows:string[][]};steps:DemoStep[];tip?:string};
const ribbon:Record<string,{group:string;commands:string[]}[]>={
 Home:[{group:"Clipboard",commands:["Paste","Cut","Copy","Format Painter"]},{group:"Font",commands:["Font","Font Size","Bold","Italic","Underline","Font Color"]},{group:"Paragraph",commands:["Bullets","Numbering","Align Left","Center","Justify","Line Spacing"]},{group:"Styles",commands:["Normal","Heading 1"]}],
 Insert:[{group:"Pages",commands:["Blank Page","Page Break"]},{group:"Tables",commands:["Table"]},{group:"Illustrations",commands:["Pictures","Shapes"]},{group:"Header & Footer",commands:["Header","Footer","Page Number"]},{group:"Links",commands:["Link"]}],
 Layout:[{group:"Page Setup",commands:["Margins","Orientation","Size","Breaks"]},{group:"Paragraph",commands:["Indent","Spacing"]}],
 References:[{group:"Table of Contents",commands:["Table of Contents","Update Table"]},{group:"Footnotes",commands:["Insert Footnote"]}],
 Review:[{group:"Proofing",commands:["Editor","Check Accessibility"]},{group:"Comments",commands:["New Comment"]},{group:"Tracking",commands:["Track Changes","Accept","Reject"]}],
 View:[{group:"Views",commands:["Print Layout","Read Mode"]},{group:"Show",commands:["Ruler","Navigation Pane"]},{group:"Zoom",commands:["Zoom"]}],
 File:[{group:"Document",commands:["New","Open","Save","Save As"]},{group:"Output",commands:["Print","Export","PDF"]}]
};
const tabs=Object.keys(ribbon);
function Ribbon({tab,step,steps,onJump}:{tab:string;step:DemoStep;steps:DemoStep[];onJump:(i:number)=>void}) {
 return <div className="xcn-word-ribbon" aria-label={"Thanh lệnh Word mô phỏng: "+tab}>
  {(ribbon[tab]??[]).map(group=><div className="xcn-word-ribbon-group" key={group.group}>
   <div className="xcn-word-ribbon-tools">{group.commands.map(command=>{
    const linked=steps.findIndex(item=>item.tab===tab&&item.command===command);
    const active=step.tab===tab&&step.command===command;
    const label=<><span className="xcn-word-tool-icon" aria-hidden="true">{command==="Table"?"▦":command==="Pictures"?"▧":command==="Bold"?"B":command==="Italic"?"I":command==="Underline"?"U":command==="Save"?"▣":command==="Center"?"≡":command==="Page Number"?"#":command==="Font Color"?"A":command==="Bullets"?"•":command==="Numbering"?"1.":"▤"}</span><span>{command}</span></>;
    return linked!==-1?<button type="button" key={command} className={"xcn-word-tool "+(active?"is-target":"")} onClick={()=>onJump(linked)} aria-pressed={active} title={"Xem thao tác: "+command}>{label}</button>:<span key={command} className="xcn-word-tool" aria-hidden="true">{label}</span>;
   })}</div><span className="xcn-word-group-label">{group.group}</span>
  </div>)}
 </div>;
}
function Paper({data,at}:{data:Demo;at:number}) {
 const scene=data.scene,progressed=at>=Math.ceil(data.steps.length/2);
 const paragraphs=data.paragraphs?.length?data.paragraphs:["Lớp học thực hành soạn thảo và trình bày văn bản với Microsoft Word.","Học viên hoàn thành nội dung, kiểm tra định dạng và lưu đúng tệp."];
 return <div className="xcn-word-paper-wrap">
  <div className="xcn-word-ruler" aria-hidden="true">{Array.from({length:15},(_,i)=><span key={i}>{i+1}</span>)}</div>
  <div className={"xcn-word-paper "+(scene==="layout"&&progressed?"has-wide-margin ":"")+(scene==="paragraph"&&progressed?"has-paragraph-spacing":"")} aria-label="Trang văn bản mô phỏng">
   {(scene==="header"||scene==="pageNumber")&&<div className="xcn-word-paper-header">{at>0?"TRUNG TÂM HỌC TẬP":"Đầu trang (Header)"}</div>}
   {scene==="toc"?<div className="xcn-word-toc"><strong>MỤC LỤC</strong><p>1. Giới thiệu <span>1</span></p><p>2. Thực hành <span>2</span></p><p>3. Kết luận <span>3</span></p></div>:<>
    <h3 className={"xcn-word-paper-title "+((scene==="font"||scene==="paragraph"||scene==="styles")&&progressed?"is-formatted":"")}>{data.heading??"THÔNG BÁO"}</h3>
    {paragraphs.map((p,i)=><p key={i} className={"xcn-word-paper-paragraph "+(at>0&&i===0&&(scene==="font"||scene==="paragraph")?"is-highlighted":"")}>{p}</p>)}
    {data.bullets?.length?<ul className="xcn-word-paper-list">{data.bullets.map((v,i)=><li key={i}><span>{scene==="lists"&&progressed?String(i+1)+".":"•"}</span>{v}</li>)}</ul>:null}
    {data.table&&<table className="xcn-word-document-table"><thead><tr>{data.table.headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>{data.table.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table>}
    {(scene==="image"||scene==="wrap")&&<div className={"xcn-word-image-placeholder "+(scene==="wrap"&&progressed?"is-wrapped":"")} role="img" aria-label="Hình minh họa dựng bằng CSS"><div className="xcn-word-image-sun"/><div className="xcn-word-image-hill"/><ImageIcon size={19} aria-hidden="true"/><span>Hình minh họa</span></div>}
    {scene==="section"&&at>0&&<div className="xcn-word-pagebreak">Section Break (Next Page)</div>}
    {scene==="break"&&at>0&&<div className="xcn-word-pagebreak">Page Break</div>}
    {scene==="review"&&at>0&&<p className="xcn-word-tracked">Đề xuất chỉnh sửa: nội dung đã được rà soát.</p>}
   </>}
   {(scene==="pageNumber"||scene==="header")&&<div className="xcn-word-paper-footer">{at>0?"Trang 1":""}</div>}
  </div>
 </div>;
}
export function WordWorkspace({block,onOpenWord}:{block:PresentationBlock;onOpenWord?:()=>void}) {
 const data=block as Demo;const steps=data.steps??[];
 const [index,setIndex]=useState(0);const [tabOverride,setTabOverride]=useState<string|null>(null);
 const step=steps[index]??{tab:"Home",command:"Normal",title:"Quan sát",detail:"Nhận diện giao diện Word."};
 const tab=tabOverride??step.tab;
 const backstage=["save","open","print","export"].includes(data.scene)&&(tab==="File"||["print","export"].includes(data.scene));
 function go(next:number){setIndex(Math.max(0,Math.min(steps.length-1,next)));setTabOverride(null);}
 return <div className="xcn-word-teaching" data-word-workspace="true">
  <div className="xcn-word-window">
   <div className="xcn-word-titlebar"><span className="xcn-word-product-logo" aria-label="Word mô phỏng">W</span><span className="xcn-word-window-name">{data.filename??"Bai_thuc_hanh.docx"}</span><span className="xcn-word-window-chrome" aria-hidden="true">—　□　×</span></div>
   <div className="xcn-word-tabs" role="tablist" aria-label="Thẻ Ribbon mô phỏng">{tabs.map(item=><button type="button" role="tab" key={item} aria-selected={tab===item} className={"xcn-word-tab "+(tab===item?"is-active":"")} onClick={()=>setTabOverride(item)}>{item}</button>)}</div>
   <Ribbon tab={tab} step={step} steps={steps} onJump={go}/>
   <div className="xcn-word-content">{backstage?<div className="xcn-word-backstage">
    <div className="xcn-word-backstage-nav"><strong>File</strong>{["New","Open","Save","Save As","Print","Export"].map(v=><span key={v} className={step.command===v?"is-active":""}>{v}</span>)}</div>
    <div className="xcn-word-backstage-pane"><h3>{data.scene==="print"?"Print":data.scene==="export"?"Export":data.scene==="open"?"Open":"Save As"}</h3><div className="xcn-word-file-option"><FileText size={29} aria-hidden="true"/><div><strong>{data.filename??"Bai_thuc_hanh.docx"}</strong><span>Documents / TIN_HOC / WORD</span></div></div><div className="xcn-word-backstage-note">{data.scene==="print"?"Print Preview · A4 · Portrait":data.scene==="export"?"Create PDF/XPS · PDF (.pdf)":data.scene==="open"?"Browse · Chọn tệp .docx tin cậy":"Chọn vị trí lưu · Đặt tên · Xác nhận Save"}</div></div>
   </div>:<Paper data={data} at={index}/>}</div>
   <div className="xcn-word-status"><span>Trang 1 / 1</span><span>Ngôn ngữ: Tiếng Việt</span><span>100%　━━━━●━━</span></div>
  </div>
  <aside className="xcn-word-guide">
   <div className="xcn-word-guide-head"><span className="sr-only">Tiến trình các bước</span><strong>{index+1}/{steps.length}</strong></div>
   <div className="xcn-word-step-controls" aria-label="Các bước minh họa">{steps.map((item,i)=><button type="button" key={i} className={"xcn-word-step-chip "+(i===index?"is-active":"")} aria-current={i===index?"step":undefined} onClick={()=>go(i)} title={item.title}>{i+1}</button>)}</div>
   <div className="xcn-word-step-detail" aria-live="polite"><span className="xcn-word-command-path">{step.tab} <ChevronDown size={12} aria-hidden="true"/> {step.command}</span><h3>{step.title}</h3><p>{step.detail}</p>{step.result&&<div className="xcn-word-result"><CheckCircle2 size={17} aria-hidden="true"/><span>{step.result}</span></div>}</div>
   <div className="xcn-word-guide-actions"><button type="button" onClick={()=>go(index-1)} disabled={index===0}><ArrowLeft size={16}/> Trước</button><button type="button" onClick={()=>go(index+1)} disabled={index===steps.length-1}>Tiếp <ArrowRight size={16}/></button></div>
   {onOpenWord&&<button type="button" className="xcn-word-live-launch" onClick={onOpenWord}>
      <FileText size={19} aria-hidden="true"/><span>Thực hành trên Word trực tiếp</span><ArrowRight size={18} aria-hidden="true"/>
    </button>}
  </aside>
 </div>;
}
