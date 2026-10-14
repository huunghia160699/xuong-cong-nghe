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
  // An opening slide uses a dedicated visual teaching cover rather than
  // the normal heading + block layout.
  if ((cover && blocks[0]?.type === "lessonCover") || blocks[0]?.type === "warmUpComparison") {
    return <section aria-label={"Slide " + (index+1) + ": " + slide.title}
      className={"xcn-slide relative h-full min-h-0 overflow-y-auto overscroll-contain " + (cover ? "bg-ink text-white" : "bg-[#fafaf8] text-ink")}>
      <PresentationBlockView block={blocks[0]}/>
    </section>;
  }
  return <section
    aria-label={"Slide " + (index+1) + ": " + slide.title}
    className={"xcn-slide relative flex h-full min-h-0 w-full flex-col overflow-y-auto overscroll-contain " +
      (cover ? "bg-ink text-white" : "bg-[#fafaf8] text-ink")}>
    <div className={"flex min-h-0 flex-1 flex-col px-5 py-5 pb-24 pr-14 sm:px-8 sm:py-7 sm:pb-28 sm:pr-16 lg:px-10 lg:py-8 lg:pb-28 lg:pr-20 " + (cover ? "justify-center" : "")}>
      <div className={cover ? "max-w-4xl" : "mb-4"}>
        <p className={"text-[11px] font-bold uppercase tracking-[.16em] " + (cover ? "text-lime" : "text-zinc-500")}>{slide.eyebrow ?? "BÀI GIẢNG"}</p>
        {cover ?
          <h1 className="mt-4 max-w-4xl font-bold leading-[1.05] tracking-[-.055em]" style={{fontSize:"clamp(2.8rem, 8dvh, 5.6rem)"}}>{slide.title}</h1> :
          <h2 className="mt-2 font-bold leading-[1.1] tracking-[-.045em]" style={{fontSize:"clamp(2.35rem, 7dvh, 4.65rem)"}}>{slide.title}</h2>}
      </div>
      <div key={slide.id + "-rev-" + reset} className={"xcn-presentation-grid xcn-presentation-layout-" + layout + " mt-3 sm:mt-5"}>
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
      // Space must activate the focused reveal button instead of skipping the slide.
      if(event.key===" " && target?.closest("button,a,[role=button]")) return;
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

  // Subtitles from existing slide data remain available to the teacher, but
  // never appear as tiny repeated lines beneath the main teaching headline.
  const notes=[slide.subtitle,slide.notes].filter(Boolean).join("\n\n");


  return <div ref={hostRef} className="xcn-presentation-viewport relative h-[100dvh] w-full overflow-hidden bg-[#fafaf8] text-ink">
    <main className="xcn-presentation-stage">
      <div className="xcn-presentation-frame">
        <SlideCanvas slide={slide} index={current} count={count} reset={reset}/>
      </div>
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

    {notesOpen && <aside className="xcn-presentation-notes overflow-y-auto border border-zinc-200 bg-white p-5 shadow-lg"
      aria-label="Ghi chú giảng viên">
      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-zinc-500">Ghi chú giảng viên</p>
      <h3 className="mt-4 text-lg font-semibold">{slide.title}</h3>
      <p className="mt-4 text-sm leading-7 text-zinc-600">{notes ? notes.split("\n\n").map((paragraph,i)=><span key={i} className="mb-4 block">{paragraph}</span>) : "Slide này chưa có ghi chú riêng."}</p>
      <p className="mt-7 border-t border-zinc-200 pt-4 text-xs leading-6 text-zinc-500">
        ↑ ↓ chuyển slide · N ghi chú · R làm lại · F toàn màn hình · A–D chọn đáp án.
      </p>
    </aside>}

    <div className="xcn-presentation-toolbar" aria-label="Thanh công cụ trình chiếu">
      <div className="xcn-presentation-context flex min-w-0 items-center gap-1 rounded-full border border-zinc-200 bg-white/95 p-1.5 shadow-lg"
        title={(className || "Lớp chung") + " · " + courseTitle}>
        <Link href="/cong-cu/trinh-chieu" aria-label="Quay lại thư viện" title="Quay lại thư viện"
          className="xcn-presentation-action grid shrink-0 place-items-center rounded-full transition hover:bg-lime">
          <ArrowLeft size={18}/>
        </Link>
        <div className="xcn-presentation-lesson-label flex min-w-0 items-center gap-2 px-2">
          <span className="shrink-0 text-xs font-bold sm:text-sm">{className || "Lớp chung"}</span>
          <span aria-hidden="true" className="h-4 shrink-0 border-l border-zinc-300"/>
          <span className="truncate text-xs font-semibold sm:text-sm">{courseTitle}</span>
        </div>
        <button type="button" onClick={() => setReset(value => value + 1)}
          title="Làm lại tương tác (R)" aria-label="Làm lại tương tác"
          className="xcn-presentation-action grid shrink-0 place-items-center rounded-full transition hover:bg-zinc-100">
          <RotateCcw size={17}/>
        </button>
        <button type="button" onClick={() => setNotesOpen(value => !value)}
          title="Ghi chú giảng viên (N)" aria-label="Ghi chú giảng viên" aria-pressed={notesOpen}
          className={"xcn-presentation-action grid shrink-0 place-items-center rounded-full transition " +
            (notesOpen ? "bg-lime" : "hover:bg-zinc-100")}>
          {notesOpen ? <PanelRightClose size={17}/> : <PanelRightOpen size={17}/>}
        </button>
      </div>

      <nav aria-label="Điều khiển trình chiếu"
        className="xcn-presentation-pill flex shrink-0 items-center justify-center gap-1 rounded-full border border-zinc-200 bg-white/95 p-1.5 shadow-lg">
        <button type="button" onClick={() => move(current - 1)} disabled={current === 0}
          aria-label="Slide trước" title="Slide trước (↑)"
          className="xcn-presentation-action grid shrink-0 place-items-center rounded-full bg-zinc-100 text-ink transition hover:bg-zinc-200 disabled:opacity-35">
          <ArrowUp size={19}/>
        </button>
        <span className="xcn-presentation-page-count px-1 text-center text-sm font-extrabold tabular-nums tracking-tight">
          {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <button type="button" onClick={() => move(current + 1)} disabled={current === count - 1}
          aria-label="Slide sau" title="Slide sau (↓)"
          className="xcn-presentation-action grid shrink-0 place-items-center rounded-full bg-ink text-lime transition hover:bg-zinc-700 disabled:opacity-35">
          <ArrowDown size={19}/>
        </button>
        <button type="button" onClick={() => full ? void document.exitFullscreen() : void hostRef.current?.requestFullscreen?.()}
          title="Toàn màn hình (F)" aria-label={full ? "Thoát toàn màn hình" : "Trình chiếu toàn màn hình"}
          className="xcn-presentation-action grid shrink-0 place-items-center rounded-full bg-zinc-100 text-ink transition hover:bg-zinc-200">
          {full ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}
        </button>
      </nav>
    </div>
  </div>;
}
