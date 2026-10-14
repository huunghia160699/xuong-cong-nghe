"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, PanelRightClose, PanelRightOpen, RotateCcw,
} from "lucide-react";
import type { PresentationLesson, PresentationSlide } from "../types";
import { PRESENTATION_LAYOUTS } from "../types";
import { PresentationBlockView } from "./blocks";

const layoutSet = new Set<string>(PRESENTATION_LAYOUTS);

function SlideCanvas({slide, index, count, reset}: {
  slide: PresentationSlide; index: number; count: number; reset: number;
}) {
  const cover = slide.layout === "cover";
  const layout = layoutSet.has(slide.layout) ? slide.layout : "full";
  const extras = slide.blocks.filter(block => block.type === "notice");
  const blocks = slide.blocks.filter(block => block.type !== "notice");
  return <section
    aria-label={"Slide " + (index+1) + ": " + slide.title}
    className={"xcn-slide relative flex min-h-[480px] w-full flex-col overflow-y-auto sm:min-h-[580px] " +
      (cover ? "bg-ink text-white" : "bg-[#fafaf8] text-ink")}>
    <header className="flex items-center justify-between gap-4 border-b px-6 py-4 text-[11px] font-bold uppercase tracking-[.14em] sm:px-10">
      <span className={cover?"border-white/15 text-zinc-400":"border-zinc-200 text-zinc-500"}>XƯỞNG CÔNG NGHỆ <span className="mx-2">/</span> TRÌNH CHIẾU</span>
      <span className={cover?"text-zinc-400":"text-zinc-500"}>{String(index+1).padStart(2,"0")} / {String(count).padStart(2,"0")}</span>
    </header>
    <div className={"flex min-h-0 flex-1 flex-col px-6 py-7 sm:px-10 sm:py-9 " + (cover?"justify-center":"")}>
      <div className={cover?"max-w-4xl":"mb-5"}>
        <p className={"text-xs font-bold uppercase tracking-[.17em] " + (cover?"text-lime":"text-zinc-500")}>{slide.eyebrow??"BÀI GIẢNG"}</p>
        {cover?<h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-[-.055em] sm:text-6xl xl:text-7xl">{slide.title}</h1>:
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-.045em] sm:text-4xl xl:text-5xl">{slide.title}</h2>}
        {slide.subtitle && <p className={"mt-3 text-sm leading-6 sm:text-lg " + (cover?"text-zinc-300":"text-zinc-600")}>{slide.subtitle}</p>}
      </div>
      <div key={slide.id+"-rev-"+reset} className={"xcn-presentation-grid xcn-presentation-layout-"+layout+" mt-7"}>
        {blocks.map((block,i)=><div key={i} className="xcn-presentation-block min-h-0 min-w-0">
          <PresentationBlockView block={block}/>
        </div>)}
      </div>
      {!!extras.length && <div className="mt-4 space-y-2">
        {extras.map((block,i)=><PresentationBlockView key={i} block={block}/>)}
      </div>}
    </div>
    <div className={"flex items-center justify-between gap-3 border-t px-6 py-3 text-[10px] font-bold uppercase tracking-[.14em] sm:px-10 "+
      (cover?"border-white/15 text-zinc-400":"border-zinc-200 text-zinc-400")}>
      <span>{slide.eyebrow??"KIẾN THỨC ỨNG DỤNG"}</span>
      <span>{String(index+1).padStart(2,"0")}</span>
    </div>
  </section>;
}

export function PresentationPlayer({lesson, courseTitle, className}: {
  lesson: PresentationLesson; courseTitle: string; className?: string;
}) {
  const [current,setCurrent]=useState(0);
  const [notesOpen,setNotesOpen]=useState(false);
  const [reset,setReset]=useState(0);
  const [full,setFull]=useState(false);
  const hostRef=useRef<HTMLDivElement>(null);
  const count=lesson.slides.length;
  const move=useCallback((next:number)=>setCurrent(Math.max(0,Math.min(count-1,next))),[count]);
  const slide=lesson.slides[current];
  useEffect(()=>{
    const onFullScreen=()=>setFull(document.fullscreenElement===hostRef.current);
    document.addEventListener("fullscreenchange",onFullScreen);
    return ()=>document.removeEventListener("fullscreenchange",onFullScreen);
  },[]);
  useEffect(()=>{
    function keyboard(event: KeyboardEvent) {
      const target=event.target as HTMLElement | null;
      if(target?.closest("input,textarea,select,[contenteditable=true]")||event.altKey||event.metaKey||event.ctrlKey) return;
      const key=event.key.toLowerCase();
      if(["arrowright","arrowdown","pagedown"," "].includes(key)) {
        event.preventDefault();move(current+1);
      } else if(["arrowleft","arrowup","pageup"].includes(key)) {
        event.preventDefault();move(current-1);
      } else if(key==="home") {event.preventDefault();move(0);}
      else if(key==="end") {event.preventDefault();move(count-1);}
      else if(key==="n") {setNotesOpen(value=>!value);}
      else if(key==="r") {setReset(value=>value+1);}
      else if(key==="f") {
        if(document.fullscreenElement===hostRef.current) void document.exitFullscreen();
        else void hostRef.current?.requestFullscreen?.();
      } else if(slide.layout==="quiz" && /^[1-4a-d]$/.test(key)) {
        const i=/^[1-4]$/.test(key)?Number(key)-1:"abcd".indexOf(key);
        const choice=hostRef.current?.querySelectorAll<HTMLButtonElement>("[data-native-quiz] [data-choice]")[i];
        choice?.click();
      }
    }
    window.addEventListener("keydown",keyboard);
    return ()=>window.removeEventListener("keydown",keyboard);
  },[move,current,count,slide.layout]);

  const sections=lesson.sections?.length?lesson.sections:[{label:"Bài giảng",start:0}];
  const sectionIndex=sections.reduce((result,section,i)=>current>=section.start?i:result,0);
  const sectionName=sections[sectionIndex]?.label??"Bài giảng";
  const notes=slide.notes??"";
  return <div ref={hostRef} className="flex min-h-screen flex-col bg-[#f1f1ec] text-ink">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-3 lg:px-8">
      <div className="flex items-center gap-3">
        <Link href="/cong-cu/trinh-chieu" aria-label="Quay lại thư viện" title="Quay lại thư viện"
          className="grid h-10 w-10 place-items-center border border-zinc-200 hover:bg-zinc-100"><ArrowLeft size={18}/></Link>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.17em] text-zinc-500">{courseTitle} {className?" / "+className:""}</p>
          <strong className="text-sm font-semibold">{lesson.label} · {lesson.title}</strong>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={()=>setReset(x=>x+1)} title="Làm lại tương tác (R)"
          className="grid h-10 w-10 place-items-center border border-zinc-200 hover:bg-zinc-100"><RotateCcw size={17}/></button>
        <button onClick={()=>setNotesOpen(value=>!value)} title="Ghi chú giảng viên (N)"
          aria-label="Ghi chú giảng viên" aria-pressed={notesOpen}
          className={"flex h-10 items-center gap-2 border px-3 text-xs font-semibold "+(notesOpen?"border-ink bg-lime":"border-zinc-200 bg-white")}>
          {notesOpen?<PanelRightClose size={17}/>:<PanelRightOpen size={17}/>} <span className="hidden sm:inline">Ghi chú</span>
        </button>
        <button onClick={()=>full?void document.exitFullscreen():void hostRef.current?.requestFullscreen?.()}
          title="Toàn màn hình (F)" aria-label={full?"Thoát toàn màn hình":"Trình chiếu toàn màn hình"}
          className="grid h-10 w-10 place-items-center border border-zinc-200 hover:bg-zinc-100">
          {full?<Minimize2 size={18}/>:<Maximize2 size={18}/>}
        </button>
      </div>
    </div>
    <div className="h-1 bg-zinc-200"><div className="h-full bg-ink transition-all duration-300" style={{width:((current+1)/count*100)+"%"}}/></div>
    <div className={"mx-auto grid w-full max-w-[1680px] flex-1 gap-4 p-3 sm:p-5 lg:p-8 "+(notesOpen?"xl:grid-cols-[minmax(0,1fr)_280px]":"")}>
      <div className="min-w-0 self-start border border-zinc-300 bg-white shadow-sm">
        <SlideCanvas slide={slide} index={current} count={count} reset={reset}/>
      </div>
      {notesOpen && <aside className="h-fit border border-zinc-200 bg-white p-5 xl:sticky xl:top-4">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-zinc-500">Ghi chú giảng viên</p>
        <h3 className="mt-4 text-lg font-semibold">{slide.title}</h3>
        <p className="mt-4 text-sm leading-7 text-zinc-600">{notes||"Slide này chưa có ghi chú riêng."}</p>
        <p className="mt-7 border-t border-zinc-200 pt-4 text-xs leading-6 text-zinc-500">Phím tắt: ← → chuyển slide · N ghi chú · R làm lại · F toàn màn hình · A–D chọn đáp án.</p>
      </aside>}
    </div>
    <div className="sticky bottom-0 z-30 border-t border-zinc-200 bg-white/95 px-3 py-3 shadow-sm sm:px-6">
      <div className="mx-auto flex max-w-[1620px] items-center gap-3 sm:gap-5">
        <button type="button" onClick={()=>move(current-1)} disabled={current===0}
          aria-label="Slide trước" className="grid h-11 w-11 shrink-0 place-items-center border border-zinc-200 disabled:opacity-30"><ChevronLeft size={22}/></button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-[11px] font-bold uppercase tracking-widest text-zinc-500">{sectionName}</span>
            <span className="shrink-0 text-xs font-semibold">{current+1} / {count}</span>
          </div>
          <label className="sr-only" htmlFor="slide-selector">Chọn trang trình chiếu</label>
          <input id="slide-selector" type="range" min={1} max={count} value={current+1}
            onChange={e=>move(Number(e.target.value))} className="mt-2 w-full accent-[#151513]"/>
          <div className="mt-1 flex flex-wrap gap-1" aria-label="Đi tới chương">
            {sections.map(section=><button key={section.start} type="button"
              title={"Đi tới "+section.label}
              onClick={()=>move(section.start)}
              className={"h-1.5 min-w-3 flex-1 transition "+(current>=section.start?"bg-ink":"bg-zinc-200")}>
              <span className="sr-only">{section.label}</span>
            </button>)}
          </div>
        </div>
        <button type="button" onClick={()=>move(current+1)} disabled={current===count-1}
          aria-label="Slide sau" className="flex h-11 shrink-0 items-center gap-2 bg-ink px-4 text-sm font-semibold text-white disabled:opacity-30">
          <span className="hidden sm:inline">Tiếp</span><ChevronRight size={19}/></button>
      </div>
    </div>
  </div>;
}
