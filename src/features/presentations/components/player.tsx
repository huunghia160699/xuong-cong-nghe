"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown, ArrowLeft, ArrowUp, Maximize2, Minimize2,
  PanelRightClose, PanelRightOpen, RotateCcw,
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
    className={"xcn-slide relative flex h-full min-h-0 w-full flex-col overflow-y-auto overscroll-contain " +
      (cover ? "bg-ink text-white" : "bg-[#fafaf8] text-ink")}>
    <div className={"flex min-h-0 flex-1 flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-8 " + (cover ? "justify-center" : "")}>
      <div className={cover ? "max-w-4xl" : "mb-4"}>
        <p className={"text-[11px] font-bold uppercase tracking-[.16em] " + (cover ? "text-lime" : "text-zinc-500")}>{slide.eyebrow ?? "BÀI GIẢNG"}</p>
        {cover ?
          <h1 className="mt-4 max-w-4xl font-bold leading-[1.05] tracking-[-.055em]" style={{fontSize:"clamp(2rem, 7vh, 5rem)"}}>{slide.title}</h1> :
          <h2 className="mt-2 font-bold leading-[1.1] tracking-[-.045em]" style={{fontSize:"clamp(1.5rem, 4.8vh, 3.3rem)"}}>{slide.title}</h2>}
        {slide.subtitle && <p className={"mt-2 text-sm leading-6 sm:text-base " + (cover ? "text-zinc-300" : "text-zinc-600")}>{slide.subtitle}</p>}
      </div>
      <div key={slide.id + "-rev-" + reset} className={"xcn-presentation-grid xcn-presentation-layout-" + layout + " mt-4"}>
        {blocks.map((block,i) => <div key={i} className="xcn-presentation-block min-h-0 min-w-0">
          <PresentationBlockView block={block}/>
        </div>)}
      </div>
      {!!extras.length && <div className="mt-3 space-y-2">
        {extras.map((block,i) => <PresentationBlockView key={i} block={block}/>)}
      </div>}
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

  return <div ref={hostRef} className="xcn-presentation-viewport relative h-[100dvh] w-full overflow-hidden bg-[#f1f1ec] text-ink">
    <div className="pointer-events-none absolute inset-x-3 top-3 z-40 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-4">
      <Link href="/cong-cu/trinh-chieu" aria-label="Quay lại thư viện" title="Quay lại thư viện"
        className="pointer-events-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white/95 shadow-sm transition hover:bg-lime">
        <ArrowLeft size={19}/>
      </Link>
      <div className="pointer-events-auto flex shrink-0 items-center gap-1 rounded-full border border-zinc-200 bg-white/95 p-1 shadow-sm">
        <button type="button" onClick={() => setReset(value => value + 1)}
          title="Làm lại tương tác (R)" aria-label="Làm lại tương tác"
          className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-zinc-100">
          <RotateCcw size={17}/>
        </button>
        <button type="button" onClick={() => setNotesOpen(value => !value)}
          title="Ghi chú giảng viên (N)" aria-label="Ghi chú giảng viên" aria-pressed={notesOpen}
          className={"grid h-9 w-9 place-items-center rounded-full transition " + (notesOpen ? "bg-lime" : "hover:bg-zinc-100")}>
          {notesOpen ? <PanelRightClose size={17}/> : <PanelRightOpen size={17}/>}
        </button>
      </div>
    </div>

    <main className={"xcn-presentation-stage grid min-h-0 w-full gap-3 " +
      (notesOpen ? "xl:grid-cols-[minmax(0,1fr)_minmax(250px,23%)]" : "")}>
      <div className="h-full min-h-0 min-w-0 overflow-hidden border border-zinc-300 bg-white shadow-sm">
        <SlideCanvas slide={slide} index={current} count={count} reset={reset}/>
      </div>
      {notesOpen && <aside className="xcn-presentation-notes overflow-y-auto border border-zinc-200 bg-white p-5">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-zinc-500">Ghi chú giảng viên</p>
        <h3 className="mt-4 text-lg font-semibold">{slide.title}</h3>
        <p className="mt-4 text-sm leading-7 text-zinc-600">{notes || "Slide này chưa có ghi chú riêng."}</p>
        <p className="mt-7 border-t border-zinc-200 pt-4 text-xs leading-6 text-zinc-500">
          ↑ ↓ chuyển slide · N ghi chú · R làm lại · F toàn màn hình · A–D chọn đáp án.
        </p>
      </aside>}
    </main>

    <nav className="xcn-presentation-rail" aria-label="Điều hướng nhanh giữa các slide">
      {lesson.slides.map((entry, index) =>
        <button key={entry.id} type="button" onClick={() => move(index)}
          className={"xcn-presentation-rail-button " + (index === current ? "is-active" : "")}
          title={"Slide " + (index + 1) + ": " + entry.title}
          aria-label={"Đến slide " + (index + 1) + ": " + entry.title}
          aria-current={index === current ? "step" : undefined}>
          <span className="xcn-presentation-rail-dot" aria-hidden="true"/>
        </button>)}
    </nav>

    <div className="xcn-presentation-context flex min-w-0 items-center gap-3 rounded-full border border-zinc-200 bg-white/95 px-4 py-2 shadow-md"
      title={lesson.label + " · " + lesson.title + " / " + (className || "Thư viện chung")}>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-semibold uppercase tracking-[.09em] text-zinc-500">
          {courseTitle} · {lesson.label}
        </p>
        <p className="mt-0.5 flex min-w-0 items-center gap-2 text-xs font-bold sm:text-sm">
          <span className="min-w-0 truncate">{lesson.title}</span>
          <span aria-hidden="true" className="h-3 shrink-0 border-l border-zinc-300"/>
          <span className="shrink-0 text-zinc-600">{className || "Thư viện chung"}</span>
        </p>
      </div>
    </div>

    <nav aria-label="Điều khiển trình chiếu"
      className="xcn-presentation-pill flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white/95 p-1.5 shadow-lg">
      <button type="button" onClick={() => move(current - 1)} disabled={current === 0}
        aria-label="Slide trước" title="Slide trước (↑)"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-100 text-ink transition hover:bg-zinc-200 disabled:opacity-35">
        <ArrowUp size={20}/>
      </button>
      <span className="min-w-16 px-1 text-center text-sm font-extrabold tabular-nums tracking-tight">
        {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </span>
      <button type="button" onClick={() => move(current + 1)} disabled={current === count - 1}
        aria-label="Slide sau" title="Slide sau (↓)"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-lime transition hover:bg-zinc-700 disabled:opacity-35">
        <ArrowDown size={20}/>
      </button>
      <button type="button" onClick={() => full ? void document.exitFullscreen() : void hostRef.current?.requestFullscreen?.()}
        title="Toàn màn hình (F)" aria-label={full ? "Thoát toàn màn hình" : "Trình chiếu toàn màn hình"}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-100 text-ink transition hover:bg-zinc-200">
        {full ? <Minimize2 size={19}/> : <Maximize2 size={19}/>}
      </button>
    </nav>
  </div>;
}
