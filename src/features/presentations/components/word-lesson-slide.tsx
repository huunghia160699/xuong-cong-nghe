"use client";

import {useLayoutEffect,useRef,useState} from "react";
import {
  ArrowDown,ArrowRight,Check,CheckCircle2,
  CornerDownRight,RotateCcw,X
} from "lucide-react";
import type {PresentationBlock,PresentationSlide} from "../types";

type Step = {title:string;text?:string;detail?:string;tab?:string;command?:string;result?:string};
type Goal = {title:string;detail:string};
type Pair = {title:string;text:string};

const pad = (value:number) => String(value).padStart(2,"0");
const purpose:Pair[] = [
  {title:"Soạn thảo",text:"Tạo và chỉnh sửa chữ, bảng, hình ảnh trong tài liệu."},
  {title:"Trình bày",text:"Định dạng nội dung rõ ràng để in hoặc chia sẻ."}
];
const asSteps = (items:unknown):Step[] => Array.isArray(items)?items as Step[]:[];

/** Keep every lesson title on one line at any width, without clipping content.
 * A very long title stays scrollable if the last readable font size still cannot fit.
 */
function SingleLineTitle({text,cover=false}:{text:string;cover?:boolean}){
  const containerRef=useRef<HTMLDivElement>(null);
  const titleRef=useRef<HTMLHeadingElement>(null);
  useLayoutEffect(()=>{
    const container=containerRef.current;
    const heading=titleRef.current;
    if(!container||!heading)return;
    const fit=()=>{
      heading.style.fontSize="";
      const available=container.clientWidth;
      if(!available)return;
      const preferred=parseFloat(getComputedStyle(heading).fontSize);
      const min=cover?16:15;
      if(heading.scrollWidth<=available||!Number.isFinite(preferred))return;
      let size=Math.max(min,Math.floor(preferred*available/heading.scrollWidth));
      heading.style.fontSize=size+"px";
      while(size>min&&heading.scrollWidth>available){
        size-=1;
        heading.style.fontSize=size+"px";
      }
    };
    const observer=new ResizeObserver(fit);
    observer.observe(container);
    const frame=requestAnimationFrame(fit);
    void document.fonts?.ready.then(fit);
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();};
  },[text,cover]);
  return <div className="w01-fitted-title" ref={containerRef}>
    {cover?<h1 ref={titleRef}>Làm quen với <span>Microsoft Word</span></h1>
      :<h2 ref={titleRef}>{text}</h2>}
  </div>;
}

function WordCover({slide,onAdvance}:{
  slide:PresentationSlide;onAdvance:()=>void;
}){
  const goals=(slide.blocks[0]?.goals??[]) as Goal[];
  return <div className="w01-cover-layout">
    <div className="w01-cover-copy">
      <span className="w01-cover-kicker">WORD CƠ BẢN <span aria-hidden="true">/</span> CHỦ ĐỀ 01</span>
      <SingleLineTitle text={slide.title} cover/>
      <p>Từ trang giấy trắng đến văn bản đầu tiên: nhập nội dung, chỉnh sửa và lưu tài liệu.</p>
      <div className="w01-cover-actions">
        <button type="button" className="w01-start" onClick={onAdvance}>
          Vào bài học <ArrowRight size={21} aria-hidden="true"/>
        </button>
      </div>
    </div>
    <div className="w01-cover-goals" aria-label="Ba nội dung chính">
      <span className="w01-cover-wordmark" aria-hidden="true">W.</span>
      <ol>
        {goals.map((goal,i)=><li key={goal.title} style={{animationDelay:(.13+i*.09)+"s"}}>
          <span className="w01-goal-number">{pad(i+1)}</span>
          <div><strong>{goal.title}</strong><p>{goal.detail}</p></div>
          <Check size={18} aria-hidden="true"/>
        </li>)}
      </ol>
    </div>
  </div>;
}

function PurposeSlide(){
  return <div className="w01-purpose">
    {purpose.map((item,i)=><article key={item.title} className={"w01-purpose-half"+(i===0?" is-first":"")}>
      <div className="w01-purpose-number">{pad(i+1)}</div>
      <div><h3>{item.title}</h3><p>{item.text}</p></div>
      <span aria-hidden="true" className="w01-purpose-mark">{i===0?"Aa":"≡"}</span>
    </article>)}
  </div>;
}

function ProcessSteps({items,variant,commands=false,practice=false}:{
  items:Step[];variant:"path"|"list"|"stair";commands?:boolean;practice?:boolean;
}){
  return <ol className={"w01-process w01-process-"+variant+(commands?" has-commands":"")+(practice?" is-practice":"")}>
    {items.map((item,i)=><li key={i} className="w01-step" style={{animationDelay:(.07+i*.075)+"s"}}>
      <span className="w01-step-index">{pad(i+1)}</span>
      <div className="w01-step-text">
        {commands && <span className="w01-command">
          <span>{item.tab}</span><CornerDownRight size={23} strokeWidth={2.5} aria-hidden="true"/><b>{item.command}</b>
        </span>}
        <h3>{item.title}</h3>
        {(item.detail||item.text)&&<p>{item.detail||item.text}</p>}
        {item.result&&<span className="w01-step-result"><CheckCircle2 size={16} aria-hidden="true"/>{item.result}</span>}
      </div>
      {i<items.length-1&&<>
        <ArrowRight className="w01-step-link" size={42} strokeWidth={2.6} aria-hidden="true"/>
        <ArrowDown className="w01-step-link-down" size={40} strokeWidth={2.6} aria-hidden="true"/>
      </>}
    </li>)}
  </ol>;
}

function IdeaCards({blocks,variant}:{
  blocks:PresentationBlock[];variant:"editorial"|"strip"|"tiles";
}){
  return <div className={"w01-ideas w01-ideas-"+variant}>
    {blocks.map((block,i)=><article className="w01-idea" key={i} style={{animationDelay:(.05+i*.075)+"s"}}>
      <span className="w01-idea-number">{pad(i+1)}</span>
      <h3>{block.title}</h3>
      <p>{block.text}</p>
    </article>)}
  </div>;
}

function Comparison({items}: {items:PresentationBlock[]}){
  return <div className="w01-compare">
    {items.map((item,i)=><article className={"w01-compare-side"+(i===0?" is-primary":"")} key={i}>
      <span className="w01-compare-index">{pad(i+1)}</span>
      <div><h3>{item.title}</h3><p>{item.text}</p></div>
    </article>)}
  </div>;
}

function Shortcuts({items}:{items:PresentationBlock[]}){
  return <div className="w01-shortcut-grid">
    {items.map((item,i)=><article className="w01-shortcut-item" key={i}
      style={{animationDelay:(.05+i*.075)+"s"}}>
      <kbd>{item.combo}</kbd><strong>{item.label}</strong>
      {item.detail&&<p>{item.detail}</p>}
    </article>)}
  </div>;
}

function SampleText({blocks}:{blocks:PresentationBlock[]}){
  const sample=blocks.find(b=>b.type==="document");
  const stack=blocks.find(b=>b.type==="stack");
  const insights=(stack?.items??[]) as Step[];
  return <div className="w01-sample-layout">
    <article className="w01-sample-text">
      <h3>{sample?.heading}</h3>
      {((sample?.paragraphs??[]) as string[]).map((paragraph,i)=><p key={i}>{paragraph}</p>)}
    </article>
    <div className="w01-sample-points">
      {insights.map((item,i)=><div key={i} className="w01-sample-point">
        <span>{pad(i+1)}</span><div><strong>{item.title}</strong><p>{item.text}</p></div>
      </div>)}
    </div>
  </div>;
}

function WordQuiz({block}:{block:PresentationBlock}){
  const [selected,setSelected]=useState<number|null>(null);
  const answers=(block.answers??[]) as string[];
  const correct=Number(block.correctIndex);
  return <div className="w01-quiz" data-native-quiz="true">
    <div className="w01-quiz-options">
      {answers.map((answer,i)=><button type="button" key={i} data-choice={i}
        aria-pressed={selected===i} onClick={()=>setSelected(i)}
        className={"w01-quiz-option"+(selected===i?" is-picked":"")+(selected!==null&&i===correct?" is-correct":"")}>
        <span>{String.fromCharCode(65+i)}</span><strong>{answer}</strong>
        {selected!==null&&i===correct&&<CheckCircle2 size={23} aria-hidden="true"/>}
        {selected===i&&i!==correct&&<X size={22} aria-hidden="true"/>}
      </button>)}
    </div>
    {selected!==null&&<div role="status" aria-live="polite" className="w01-quiz-feedback">
      <div><strong>{selected===correct?"Chính xác":"Chưa chính xác"}</strong>
        <p>{block.explanation}</p></div>
      <button type="button" onClick={()=>setSelected(null)} aria-label="Làm lại câu hỏi"><RotateCcw size={18}/></button>
    </div>}
  </div>;
}

function WordDemo({block,index}: {block:PresentationBlock;index:number}) {
  const steps=asSteps(block.steps);
  const variant=index%3===0?"stair":index%2===0?"path":"list";
  return <ProcessSteps items={steps} commands variant={variant}/>;
}

export function WordLessonSlide({slide,index,onAdvance}:{
  slide:PresentationSlide;index:number;
  onAdvance:()=>void;
}){
  const block=slide.blocks[0];
  const type=block?.type??"";
  const demo=type==="wordWorkspace";
  const cover=type==="wordHomeHero";
  const isQuiz=type==="quiz";
  const isProcess=type==="steps";
  const isCards=type==="card";
  const isCompare=type==="definition";
  const isShortcut=type==="shortcut";
  const isDocument=type==="document";
  const variant=demo?"demo":cover?"cover":type==="wordPurpose"?"purpose":
    isQuiz?"quiz":isProcess?"process":isCards?"ideas":isCompare?"comparison":
    isShortcut?"shortcuts":isDocument?"sample":"other";
  const dark=cover||isShortcut||(demo&&index%4===0);
  const blocks=slide.blocks.filter(b=>b.type!=="notice");
  const notice=slide.blocks.find(b=>b.type==="notice");
  const className="w01-slide w01-"+variant+(dark?" is-dark":"")+
    (index%2===0?" is-even":" is-odd")+(demo?" w01-demo-"+index%3:"");
  const items=blocks.filter(b=>b.type==="card");
  const ideaVariant=index%3===0?"strip":index%2===0?"editorial":"tiles";
  return <section className={className} data-word-lesson-slide={slide.id}
    aria-label={"Slide "+(index+1)+": "+slide.title}>
    <div className="w01-grain" aria-hidden="true"/>
    {cover?<WordCover slide={slide} onAdvance={onAdvance}/>:
    <div className="w01-slide-inner">
      <header className="w01-header">
        <SingleLineTitle text={slide.title}/>
        {demo&&<span className="w01-demo-mark" aria-hidden="true">
          <span/><span/><span/>
        </span>}
      </header>
      <div className="w01-main">
        {type==="wordPurpose"&&<PurposeSlide/>}
        {demo&&<WordDemo block={block} index={index}/>}
        {isProcess&&<ProcessSteps items={asSteps(block.items)}
          practice={slide.id.startsWith("practice")} variant={index%2===0?"path":"list"}/>}
        {isCards&&<IdeaCards blocks={items} variant={ideaVariant}/>}
        {isCompare&&<Comparison items={blocks}/>}
        {isShortcut&&<Shortcuts items={blocks}/>}
        {isDocument&&<SampleText blocks={blocks}/>}
        {isQuiz&&<WordQuiz block={block}/>}
        {variant==="other"&&<div className="w01-unknown">{slide.title}</div>}
      </div>
      {notice&&<div className="w01-outcome"><CheckCircle2 size={19} aria-hidden="true"/>{notice.text}</div>}
    </div>}
  </section>;
}
