"use client";

import {ArrowRight,CheckCircle2,FileText} from "lucide-react";
import type {PresentationBlock} from "../types";

/** The Word lesson 1 cover mirrors the public homepage hero, without adding a site header. */
export function WordHomeHero({block,onStart}:{block:PresentationBlock;onStart:()=>void}){
 const goals=(block.goals??[]) as {title:string;detail:string}[];
 return <div className="grid-paper min-h-full w-full overflow-hidden bg-ink text-white" data-word-home-hero="true">
  <div className="xcn-container grid min-h-[100dvh] items-center gap-9 pb-28 pt-10 lg:grid-cols-[1.12fr_.88fr] lg:gap-10 lg:pr-20">
   <div className="min-w-0">
    <span className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 sm:text-base">{block.eyebrow??"WORD CƠ BẢN · CHỦ ĐỀ 01"}</span>
    <h1 className="mt-7 font-bold leading-[1.02] tracking-[-.065em] text-[clamp(2.4rem,8vw,3.5rem)] sm:mt-8 sm:text-[clamp(3.4rem,6.6vw,6.7rem)]">
     Làm quen với<br/><span className="text-cyan">Microsoft Word</span>
    </h1>
    <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-200 sm:text-[clamp(1.25rem,1.65vw,1.75rem)] sm:leading-[1.55]">
     Từ trang giấy trắng đến văn bản đầu tiên: làm quen giao diện, nhập nội dung, chỉnh sửa và lưu tài liệu đúng cách.
    </p>
    <div className="mt-9 flex flex-wrap items-center gap-4">
     <button type="button" onClick={onStart}
      className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue px-8 py-4 text-lg font-semibold sm:text-xl text-white transition hover:bg-cyan hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan">
      Bắt đầu bài học <ArrowRight size={24} aria-hidden="true"/>
     </button>
    </div>
   </div>
   <div className="relative mx-auto h-[430px] w-full max-w-[650px] sm:h-[490px] lg:h-[570px]">
    <div className="absolute left-0 top-[6%] w-[88%] rotate-[-4deg] overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 shadow-2xl">
     <div className="flex h-12 items-center gap-2 bg-[#17458b] px-4 text-sm text-white">
      <span className="grid h-8 w-8 place-items-center bg-[#092d67] text-lg font-black">W</span>
      <span className="min-w-0 truncate font-medium">Thong_bao_lop.docx</span>
      <span className="ml-auto shrink-0 opacity-80" aria-hidden="true">− □ ×</span>
     </div>
     <div className="flex gap-4 overflow-hidden bg-white px-4 py-3 text-xs text-zinc-600 sm:text-sm">
      <span>File</span><strong className="border-b-2 border-blue text-blue">Home</strong><span>Insert</span><span>Layout</span><span>Review</span>
     </div>
     <div className="flex gap-4 overflow-hidden bg-paper px-4 py-4 text-xs text-ink sm:text-sm">
      <span className="font-bold">B</span><span className="italic">I</span><span className="underline">U</span><span className="border border-zinc-200 bg-white px-2">12</span>
      <span className="border-l border-zinc-300 pl-3">☷</span><span>≡</span><span>•</span><span className="border-l border-zinc-300 pl-3">Normal</span>
     </div>
     <div className="h-44 overflow-hidden bg-[#dbe3ef] px-7 pt-3 sm:h-56">
      <div className="mb-2 text-center text-xs tracking-[.4em] text-zinc-500" aria-hidden="true">1 2 3 4 5 6 7 8 9</div>
      <div className="mx-auto min-h-52 w-[80%] bg-white px-[13%] py-6 shadow-md">
       <p className="text-center text-sm font-bold tracking-wide text-ink sm:text-lg">THÔNG BÁO</p>
       <div className="mt-5 space-y-2" aria-hidden="true">
        <div className="h-1 w-full rounded bg-zinc-300"/><div className="h-1 w-[90%] rounded bg-zinc-300"/>
        <div className="h-1 w-[72%] rounded bg-zinc-300"/><div className="h-1 w-full rounded bg-zinc-300"/>
       </div>
      </div>
     </div>
     <div className="flex justify-between bg-white px-4 py-2 text-xs text-zinc-500"><span>Trang 1 / 1</span><span>100%</span></div>
    </div>
    <div className="absolute bottom-[3%] right-0 w-[88%] rotate-[3deg] rounded-2xl bg-white p-6 text-ink shadow-2xl sm:p-6">
     <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-sm font-bold text-blue"><FileText size={18} aria-hidden="true"/> WORD CƠ BẢN</span>
      <span className="text-xs font-semibold tracking-widest text-zinc-500 sm:text-sm">BÀI MỞ ĐẦU</span>
     </div>
     <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">Học xong, có thể...</h2>
     <ol className="mt-4 space-y-3">
      {goals.map((goal,i)=><li key={goal.title} className="flex items-start gap-3 border-t border-zinc-200 pt-3">
       <span className="shrink-0 text-xl font-black text-blue sm:text-2xl">{String(i+1).padStart(2,"0")}</span>
       <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <strong className="text-base font-bold leading-snug sm:text-lg">{goal.title}</strong>
        <span className="text-sm leading-snug text-zinc-600 sm:text-base">{goal.detail}</span>
       </span><CheckCircle2 className="mt-1 shrink-0 text-blue" size={20} aria-hidden="true"/>
      </li>)}
     </ol>
    </div>
    <span className="number-outline pointer-events-none absolute -right-2 -top-9 z-0 text-[clamp(4.6rem,9vw,9rem)] font-black leading-none tracking-[-.065em]" aria-hidden="true">WORD</span>
   </div>
  </div>
 </div>;
}
