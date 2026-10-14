"use client";

import {ArrowRight,CheckCircle2,FileText} from "lucide-react";
import type {PresentationBlock} from "../types";

/** The Word lesson 1 cover mirrors the public homepage hero, without adding a site header. */
export function WordHomeHero({block,onStart}:{block:PresentationBlock;onStart:()=>void}){
 const goals=(block.goals??[]) as {title:string;detail:string}[];
 return <div className="grid-paper min-h-full w-full overflow-hidden bg-ink text-white" data-word-home-hero="true">
  <div className="xcn-container grid min-h-[100dvh] items-center gap-7 pb-28 pt-10 lg:grid-cols-[1.12fr_.88fr] lg:gap-10 lg:pr-20">
   <div className="min-w-0">
    <span className="inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300">{block.eyebrow??"WORD CƠ BẢN · CHỦ ĐỀ 01"}</span>
    <h1 className="mt-6 font-bold leading-[1.02] tracking-[-.055em] text-[clamp(2.1rem,5.8vw,5.15rem)] sm:mt-7">
     Làm quen với<br/>Microsoft Word<br/><span className="text-cyan">qua thực hành.</span>
    </h1>
    <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
     Từ trang giấy trắng đến văn bản đầu tiên: làm quen giao diện, nhập nội dung, chỉnh sửa và lưu tài liệu đúng cách.
    </p>
    <div className="mt-8 flex flex-wrap items-center gap-4">
     <button type="button" onClick={onStart}
      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-blue px-6 py-3 text-base font-semibold text-white transition hover:bg-cyan hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan">
      Bắt đầu bài học <ArrowRight size={19} aria-hidden="true"/>
     </button>
     <span className="text-sm font-medium leading-6 text-zinc-400">Nhập liệu · Chỉnh sửa · Lưu văn bản</span>
    </div>
   </div>
   <div className="relative mx-auto h-[355px] w-full max-w-[580px] sm:h-[430px] lg:h-[510px]">
    <div className="absolute left-0 top-[6%] w-[83%] rotate-[-4deg] overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 shadow-2xl">
     <div className="flex h-10 items-center gap-2 bg-[#17458b] px-3 text-xs text-white">
      <span className="grid h-6 w-6 place-items-center bg-[#092d67] font-black">W</span>
      <span className="min-w-0 truncate font-medium">Thong_bao_lop.docx</span>
      <span className="ml-auto shrink-0 opacity-80" aria-hidden="true">− □ ×</span>
     </div>
     <div className="flex gap-3 overflow-hidden bg-white px-3 py-2 text-[11px] text-zinc-600">
      <span>File</span><strong className="border-b-2 border-blue text-blue">Home</strong><span>Insert</span><span>Layout</span><span>Review</span>
     </div>
     <div className="flex gap-3 overflow-hidden bg-paper px-3 py-3 text-[11px] text-ink">
      <span className="font-bold">B</span><span className="italic">I</span><span className="underline">U</span><span className="border border-zinc-200 bg-white px-2">12</span>
      <span className="border-l border-zinc-300 pl-3">☷</span><span>≡</span><span>•</span><span className="border-l border-zinc-300 pl-3">Normal</span>
     </div>
     <div className="h-36 overflow-hidden bg-[#dbe3ef] px-7 pt-3 sm:h-48">
      <div className="mb-2 text-center text-[10px] tracking-[.6em] text-zinc-500" aria-hidden="true">1 2 3 4 5 6 7 8 9</div>
      <div className="mx-auto min-h-52 w-[80%] bg-white px-[13%] py-6 shadow-md">
       <p className="text-center text-xs font-bold tracking-wide text-ink sm:text-sm">THÔNG BÁO</p>
       <div className="mt-5 space-y-2" aria-hidden="true">
        <div className="h-1 w-full rounded bg-zinc-300"/><div className="h-1 w-[90%] rounded bg-zinc-300"/>
        <div className="h-1 w-[72%] rounded bg-zinc-300"/><div className="h-1 w-full rounded bg-zinc-300"/>
       </div>
      </div>
     </div>
     <div className="flex justify-between bg-white px-3 py-1.5 text-[10px] text-zinc-500"><span>Trang 1 / 1</span><span>100%</span></div>
    </div>
    <div className="absolute bottom-[3%] right-0 w-[80%] rotate-[3deg] rounded-2xl bg-white p-5 text-ink shadow-2xl sm:p-6">
     <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-blue"><FileText size={15} aria-hidden="true"/> WORD CƠ BẢN</span>
      <span className="text-[11px] font-semibold tracking-widest text-zinc-400">CHỦ ĐỀ 01</span>
     </div>
     <h2 className="mt-4 text-xl font-bold leading-7 tracking-tight sm:mt-5 sm:text-2xl">Học xong, có thể...</h2>
     <ol className="mt-3 space-y-2.5">
      {goals.map((goal,i)=><li key={goal.title} className="flex items-start gap-3 border-t border-zinc-200 pt-2.5">
       <span className="shrink-0 text-base font-black text-blue sm:text-lg">{String(i+1).padStart(2,"0")}</span>
       <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <strong className="text-sm font-bold leading-snug sm:text-base">{goal.title}</strong>
        <span className="text-xs leading-snug text-zinc-500 sm:text-sm">{goal.detail}</span>
       </span><CheckCircle2 className="mt-1 shrink-0 text-blue" size={17} aria-hidden="true"/>
      </li>)}
     </ol>
    </div>
    <span className="number-outline pointer-events-none absolute -right-2 -top-7 -z-0 text-[145px] font-black leading-none sm:text-[170px]" aria-hidden="true">01</span>
   </div>
  </div>
 </div>;
}
