"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown, ArrowLeft, ArrowUp, Maximize2, Minimize2,
  FileText, MoreHorizontal, PanelRightClose, PanelRightOpen, RotateCcw, X,
} from "lucide-react";
import type { PresentationLesson, PresentationSlide } from "../types";
import { PRESENTATION_LAYOUTS } from "../types";
import { PresentationBlockView } from "./blocks";
import { WordHomeHero } from "./word-home-hero";
import { WordPurposeSlide } from "./word-purpose-slide";

const layoutSet = new Set<string>(PRESENTATION_LAYOUTS);

function SlideCanvas({slide, index, count, reset, onAdvance, onWordPractice}: {
  slide: PresentationSlide; index: number; count: number; reset: number;
  onAdvance: ()=>void; onWordPractice?: ()=>void;
}) {
  const cover = slide.layout === "cover";
  const layout = layoutSet.has(slide.layout) ? slide.layout : "full";
  const extras = slide.blocks.filter(block => block.type === "notice");
  const blocks = slide.blocks.filter(block => block.type !== "notice");
  // Word lesson 1 reuses the homepage hero rhythm with an accessible working start button.
  if (cover && blocks[0]?.type === "wordHomeHero") {
    return <section aria-label={"Slide " + (index+1) + ": " + slide.title}
      className="xcn-slide relative h-full min-h-0 overflow-y-auto overscroll-contain bg-ink text-white">
      <WordHomeHero block={blocks[0]} onStart={onAdvance}/>
    </section>;
  }
  // Slide 02 of the first Word lesson uses a unique interactive design, not a generic grid.
  if (index === 1 && slide.id === "word-use" && blocks[0]?.type === "wordPurpose") {
    return <section aria-label={"Slide " + (index + 1) + ": " + slide.title}
      className="xcn-slide relative h-full min-h-0 overflow-y-auto overscroll-contain bg-paper text-ink">
      <WordPurposeSlide key={slide.id + "-rev-" + reset}/>
    </section>;
  }
  // An opening slide uses a dedicated visual teaching cover rather than
  // the normal heading + block layout.
  if ((cover && blocks[0]?.type === "lessonCover") || blocks[0]?.type === "warmUpComparison") {
    return <section aria-label={"Slide " + (index+1) + ": " + slide.title}
      className={"xcn-slide relative h-full min-h-0 overflow-y-auto overscroll-contain " + (cover ? "bg-ink text-white" : "bg-paper text-ink")}>
      <PresentationBlockView block={blocks[0]}/>
    </section>;
  }
  return <section
    aria-label={"Slide " + (index+1) + ": " + slide.title}
    className={"xcn-slide relative flex h-full min-h-0 w-full flex-col overflow-y-auto overscroll-contain " +
      (cover ? "bg-ink text-white" : "bg-paper text-ink")}>
    <div className={"flex min-h-0 flex-1 flex-col px-5 py-5 pb-24 pr-14 sm:px-8 sm:py-7 sm:pb-28 sm:pr-16 lg:px-10 lg:py-8 lg:pb-28 lg:pr-20 " + (cover ? "justify-center" : "")}>
      <div className={cover ? "max-w-4xl" : "mb-4"}>
        {cover ?
          <h1 className="max-w-4xl font-bold leading-[1.05] tracking-[-.055em]" style={{fontSize:"clamp(2.8rem, 8dvh, 5.6rem)"}}>{slide.title}</h1> :
          <h2 className="font-bold leading-[1.1] tracking-[-.045em]" style={{fontSize:"clamp(2.35rem, 7dvh, 4.65rem)"}}>{slide.title}</h2>}
      </div>
      <div key={slide.id + "-rev-" + reset} className={"xcn-presentation-grid xcn-presentation-layout-" + layout + " mt-3 sm:mt-5"}>
        {blocks.map((block,i) => <div key={i} className="xcn-presentation-block min-h-0 min-w-0">
          <PresentationBlockView block={block} onOpenWord={onWordPractice}/>
        </div>)}
      </div>
      {!!extras.length && <div className="mt-3 space-y-2">
        {extras.map((block,i) => <PresentationBlockView key={i} block={block}/>)}
      </div>}
    </div>
  </section>;
}

export function PresentationPlayer({lesson, courseTitle, initialClassName = ""}: {
  lesson: PresentationLesson; courseTitle: string; initialClassName?: string;
}) {
  const preview = lesson.kind === "showcase";
  const wordLesson = lesson.id === "word-lam-quen";
  const [wordOpen, setWordOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [reset, setReset] = useState(0);
  const [full, setFull] = useState(false);
  const [className, setClassName] = useState(initialClassName.trim());
  const [classDraft, setClassDraft] = useState(initialClassName.trim());
  const [classEntryOpen, setClassEntryOpen] = useState(!preview);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const count = lesson.slides.length;
  const move = useCallback((next: number) => {
    setCurrent(Math.max(0, Math.min(count - 1, next)));
    setMobileToolsOpen(false);
    // Keep the editor mounted so its document remains intact between slides.
    setWordOpen(false);
  }, [count]);
  const slide = lesson.slides[current];

  useEffect(() => {
    const handleFullscreen = () => setFull(document.fullscreenElement === hostRef.current);
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  useEffect(() => {
    if (classEntryOpen) return; // Typing a class must never advance slides.
    function keyboard(event: KeyboardEvent) {
      // Never hijack editing/navigation keys while the embedded Word tool is open.
      if (wordOpen) {
        if (event.key === "Escape") { event.preventDefault(); setWordOpen(false); }
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target?.closest("input,textarea,select,[contenteditable=true]") || event.altKey || event.metaKey || event.ctrlKey) return;
      // Space should activate an interactive demo button, not change slides.
      if (event.key === " " && target?.closest("button,a,[role=button]")) return;
      const key = event.key.toLowerCase();
      if (["arrowright","arrowdown","pagedown"," "].includes(key)) {
        event.preventDefault(); move(current + 1);
      } else if (["arrowleft","arrowup","pageup"].includes(key)) {
        event.preventDefault(); move(current - 1);
      } else if (key === "home") {event.preventDefault(); move(0);}
      else if (key === "end") {event.preventDefault(); move(count - 1);}
      else if (key === "n") {setNotesOpen(value => !value);}
      else if (key === "r") {setReset(value => value + 1);}
      else if (key === "f") {
        if (document.fullscreenElement === hostRef.current) void document.exitFullscreen();
        else void hostRef.current?.requestFullscreen?.();
      } else if (slide.layout === "quiz" && /^[1-4a-d]$/.test(key)) {
        const i = /^[1-4]$/.test(key) ? Number(key) - 1 : "abcd".indexOf(key);
        hostRef.current?.querySelectorAll<HTMLButtonElement>("[data-native-quiz] [data-choice]")[i]?.click();
      }
    }
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, [classEntryOpen, move, current, count, slide.layout, wordOpen]);

  // Teaching subtitles remain in notes instead of repeating under the heading.
  const notes = [slide.subtitle, slide.notes].filter(Boolean).join("\n\n");

  function changeClass() {
    setClassDraft(className);
    setClassEntryOpen(true);
    setMobileToolsOpen(false);
  }

  return <div ref={hostRef} className={"xcn-presentation-viewport relative h-[100dvh] w-full overflow-hidden bg-paper text-ink" + (wordLesson ? " xcn-word-lesson" : "")}>
    <main className="xcn-presentation-stage">
      <div className="xcn-presentation-frame">
        <SlideCanvas key={slide.id} slide={slide} index={current} count={count} reset={reset}
          onAdvance={() => move(current + 1)}
          onWordPractice={wordLesson ? () => {setNotesOpen(false); setWordOpen(true);} : undefined}/>
      </div>
    </main>

    {wordLesson && <section id="xcn-word-live-lab"
      className={"xcn-word-live-lab" + (wordOpen ? " is-open" : "")}
      aria-label="Trình soạn thảo Word trực tiếp trong bài học"
      aria-hidden={!wordOpen}>
      <div className="xcn-word-live-lab-top">
        <div className="xcn-word-live-lab-heading">
          <span className="xcn-word-live-lab-tag">WORD 01</span>
          <strong>Trình soạn thảo Word</strong>
          <span className="xcn-word-live-lab-context">{slide.title}</span>
        </div>
        <button type="button" onClick={() => setWordOpen(false)}
          className="xcn-word-live-lab-close" aria-label="Đóng công cụ Word và quay về slide">
          <span>Về slide</span><X size={18} aria-hidden="true"/>
        </button>
      </div>
      <div className="xcn-word-live-lab-frame">
        <iframe src="/cong-cu/mo-phong-word" title="Công cụ Word mô phỏng đầy đủ, sử dụng trực tiếp trong slide"
          loading="eager" tabIndex={wordOpen ? 0 : -1}/>
      </div>
    </section>}

    <nav className="xcn-presentation-rail" aria-label="Điều hướng nhanh giữa các slide">
      {lesson.slides.map((entry, index) =>
        <button key={entry.id} type="button" onClick={() => move(index)} disabled={classEntryOpen}
          className={"xcn-presentation-rail-button " + (index === current ? "is-active" : "")}
          title={"Slide " + (index + 1) + ": " + entry.title}
          aria-label={"Đến slide " + (index + 1) + ": " + entry.title}
          aria-current={index === current ? "step" : undefined}>
          <span className="xcn-presentation-rail-dot" aria-hidden="true"/>
        </button>)}
    </nav>

    {notesOpen && !classEntryOpen && <aside className="xcn-presentation-notes overflow-y-auto border border-zinc-200 bg-white p-5 shadow-lg"
      aria-label="Ghi chú giảng viên">
      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-zinc-500">Ghi chú giảng viên</p>
      <h3 className="mt-4 text-lg font-semibold">{slide.title}</h3>
      <p className="mt-4 text-sm leading-7 text-zinc-600">
        {notes ? notes.split("\n\n").map((paragraph,i) => <span key={i} className="mb-4 block">{paragraph}</span>) : "Slide này chưa có ghi chú riêng."}
      </p>
      <p className="mt-7 border-t border-zinc-200 pt-4 text-xs leading-6 text-zinc-500">
        ↑ ↓ chuyển slide · N ghi chú · R làm lại · F toàn màn hình · A–D chọn đáp án.
      </p>
    </aside>}

    <div className="xcn-presentation-toolbar" aria-label="Thanh công cụ trình chiếu">
      <div className="xcn-presentation-context rounded-full border border-zinc-200 bg-white/95 px-4 py-2 shadow-lg"
        title={(preview ? "Xem trước" : className || "Tên lớp") + " · " + courseTitle}>
        <span className="xcn-presentation-class-name" title={preview ? "Xem trước" : className || "Tên lớp"}>
          {preview ? "Xem trước" : className || "Tên lớp"}
        </span>
        <span className="xcn-presentation-subject-divider" aria-hidden="true"/>
        <span className="xcn-presentation-subject-name" title={courseTitle}>{courseTitle}</span>
      </div>

      <nav aria-label="Điều khiển trình chiếu"
        className="xcn-presentation-pill flex shrink-0 items-center justify-center gap-1 rounded-full border border-zinc-200 bg-white/95 p-1.5 shadow-lg">
        <Link href="/cong-cu/trinh-chieu" aria-label="Quay lại thư viện" title="Quay lại thư viện"
          className="xcn-presentation-action xcn-action-secondary grid shrink-0 place-items-center rounded-full text-ink transition hover:bg-zinc-100">
          <ArrowLeft size={18}/>
        </Link>
        <button type="button" onClick={() => setReset(value => value + 1)}
          title="Làm lại tương tác (R)" aria-label="Làm lại tương tác"
          className="xcn-presentation-action xcn-action-secondary grid shrink-0 place-items-center rounded-full text-ink transition hover:bg-zinc-100">
          <RotateCcw size={17}/>
        </button>
        <button type="button" onClick={() => setNotesOpen(value => !value)}
          title="Ghi chú giảng viên (N)" aria-label="Ghi chú giảng viên" aria-pressed={notesOpen}
          className={"xcn-presentation-action xcn-action-secondary grid shrink-0 place-items-center rounded-full transition " +
            (notesOpen ? "bg-cyan" : "hover:bg-zinc-100")}>
          {notesOpen ? <PanelRightClose size={17}/> : <PanelRightOpen size={17}/>}
        </button>
        {!preview && <button type="button" onClick={changeClass}
          title="Đổi tên lớp" aria-label="Đổi tên lớp"
          className="xcn-presentation-action xcn-action-secondary grid shrink-0 place-items-center rounded-full text-ink transition hover:bg-zinc-100">
          <span className="text-[11px] font-bold">Lớp</span>
        </button>}

        <button type="button" onClick={() => setMobileToolsOpen(value => !value)}
          title="Tùy chọn trình chiếu" aria-label="Tùy chọn trình chiếu" aria-expanded={mobileToolsOpen}
          className="xcn-presentation-action xcn-mobile-tools-button grid shrink-0 place-items-center rounded-full text-ink transition hover:bg-zinc-100">
          <MoreHorizontal size={19}/>
        </button>

        {wordLesson && <button type="button" onClick={() => {setNotesOpen(false); setWordOpen(value => !value);}}
          title={wordOpen ? "Về slide bài giảng" : "Mở Word trực tiếp ngay trong slide"}
          aria-label={wordOpen ? "Ẩn công cụ Word" : "Mở công cụ Word để thực hành"}
          aria-controls="xcn-word-live-lab" aria-expanded={wordOpen}
          className={"xcn-word-lab-trigger" + (wordOpen ? " is-active" : "")}>
          <FileText size={18} aria-hidden="true"/><span>Word</span>
        </button>}
        <span className="xcn-presentation-divider" aria-hidden="true"/>
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
          className="xcn-presentation-action grid shrink-0 place-items-center rounded-full bg-ink text-cyan transition hover:bg-zinc-700 disabled:opacity-35">
          <ArrowDown size={19}/>
        </button>
        <button type="button" onClick={() => full ? void document.exitFullscreen() : void hostRef.current?.requestFullscreen?.()}
          title="Toàn màn hình (F)" aria-label={full ? "Thoát toàn màn hình" : "Trình chiếu toàn màn hình"}
          className="xcn-presentation-action grid shrink-0 place-items-center rounded-full bg-zinc-100 text-ink transition hover:bg-zinc-200">
          {full ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}
        </button>
        {mobileToolsOpen && <div className="xcn-mobile-tools-menu" role="group" aria-label="Các chức năng trình chiếu">
          <Link href="/cong-cu/trinh-chieu" className="xcn-mobile-tools-row"><ArrowLeft size={17}/> Quay lại thư viện</Link>
          <button type="button" onClick={() => {setReset(value => value + 1);setMobileToolsOpen(false);}}
            className="xcn-mobile-tools-row"><RotateCcw size={17}/> Làm lại tương tác</button>
          <button type="button" onClick={() => {setNotesOpen(value => !value);setMobileToolsOpen(false);}}
            className="xcn-mobile-tools-row">{notesOpen ? <PanelRightClose size={17}/> : <PanelRightOpen size={17}/>} Ghi chú giảng viên</button>
          {!preview && <button type="button" onClick={changeClass}
            className="xcn-mobile-tools-row">Đổi tên lớp</button>}
          {wordLesson && <button type="button" className="xcn-mobile-tools-row"
            onClick={() => {setWordOpen(value => !value); setMobileToolsOpen(false);}}>
            <FileText size={17}/> {wordOpen ? "Về slide" : "Mở Word trực tiếp"}
          </button>}
        </div>}
      </nav>
    </div>

    {classEntryOpen && <div className="xcn-class-entry-backdrop">
      <div className="xcn-class-entry-card" role="dialog" aria-modal="true" aria-labelledby="class-entry-title">
        <span className="text-xs font-bold uppercase tracking-[.16em] text-zinc-500">{courseTitle}</span>
        <h2 id="class-entry-title" className="mt-3 text-3xl font-bold tracking-tight">Nhập tên lớp</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Tên lớp sẽ hiển thị bên trái màn hình trình chiếu. Có thể thay đổi lại trong thanh công cụ.
        </p>
        <form className="mt-7 flex flex-col gap-4" onSubmit={event => {
          event.preventDefault();
          const next = classDraft.trim();
          if (!next) return;
          setClassName(next);
          setClassEntryOpen(false);
        }}>
          <label htmlFor="presentation-class" className="text-sm font-semibold">Lớp học</label>
          <input id="presentation-class" name="presentation-class" autoFocus autoComplete="off"
            value={classDraft} onChange={event => setClassDraft(event.target.value)}
            maxLength={40} placeholder="Ví dụ: HL.26-27" required
            className="h-12 w-full rounded-none border border-zinc-300 bg-white px-4 text-base outline-none focus:border-ink focus:ring-1 focus:ring-ink"/>
          <div className="mt-2 flex justify-end gap-2">
            {className && <button type="button" onClick={() => setClassEntryOpen(false)}
              className="border border-zinc-200 px-5 py-3 text-sm font-semibold hover:bg-zinc-100">Hủy</button>}
            <button type="submit" disabled={!classDraft.trim()}
              className="bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">
              {className ? "Cập nhật lớp" : "Bắt đầu trình chiếu"}
            </button>
          </div>
        </form>
      </div>
    </div>}
  </div>;
}
