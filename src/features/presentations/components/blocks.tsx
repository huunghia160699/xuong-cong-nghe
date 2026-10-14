"use client";

import { useState } from "react";
import {
  ArrowRight, Check, CheckCircle2, Copy, File, FileSpreadsheet, FileText,
  Folder, FolderOpen, Image as ImageIcon, Info, RotateCcw, Search,
  TriangleAlert, X,
} from "lucide-react";
import type { PresentationBlock } from "../types";
import { LessonOpeningCover } from "./lesson-opening-cover";
import { WarmUpComparison } from "./warm-up-comparison";

const panel = "xcn-slide-panel h-full min-w-0 border border-zinc-200 bg-white p-5 sm:p-6 lg:p-7";
const eyebrow = "text-[11px] font-bold uppercase tracking-[.15em] text-zinc-500";
const heading = "xcn-slide-block-title text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl";

function FolderTree({nodes, depth = 0}: {nodes: any[]; depth?: number}) {
  return <ul className={depth ? "ml-5 border-l border-zinc-200 pl-3" : "space-y-1"}>
    {nodes.map((node, i) => <li key={i}>
      <div className="flex items-center gap-2 py-1.5 text-sm text-zinc-800">
        {node.file ? <File size={16} className="shrink-0 text-zinc-500"/> : <Folder size={16} className="shrink-0 text-zinc-900"/>}
        <span className="min-w-0 break-all font-medium">{node.name}</span>
      </div>
      {node.children?.length > 0 && <FolderTree nodes={node.children} depth={depth + 1}/>}
    </li>)}
  </ul>;
}

function InteractiveExplorer({block}: {block: PresentationBlock}) {
  const folders = (block.folders ?? []) as {name: string; files: [string,string][]}[];
  const [folderIndex, setFolderIndex] = useState(Math.max(0, folders.findIndex(item => item.name === block.initial)));
  const active = folders[folderIndex];
  return <div className="flex h-full min-h-52 flex-col overflow-hidden border border-zinc-200 bg-white">
    <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-100 px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-zinc-800"><FolderOpen size={17}/> File Explorer</span>
      <span className="text-xs text-zinc-500">—　□　×</span>
    </div>
    <div className="flex flex-wrap items-center gap-3 border-b border-zinc-200 px-4 py-3">
      <span className="text-zinc-400">←　→　↑</span>
      <span className="flex-1 border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700">
        This PC　/　{active?.name ?? "Documents"}
      </span>
      <Search size={16} className="text-zinc-400"/>
    </div>
    <div className="grid min-h-40 flex-1 grid-cols-[minmax(115px,28%)_1fr]">
      <div className="space-y-1 border-r border-zinc-200 bg-zinc-50 p-2">
        {folders.map((item, i) => <button key={item.name} type="button" onClick={() => setFolderIndex(i)}
          aria-pressed={folderIndex === i}
          className={"flex w-full items-center gap-2 px-2 py-2 text-left text-xs font-medium transition " +
            (i === folderIndex ? "bg-cyan text-ink" : "text-zinc-600 hover:bg-zinc-200")}>
          <Folder size={15} className="shrink-0"/><span className="truncate">{item.name}</span>
        </button>)}
      </div>
      <div className="grid content-start gap-2 p-3 sm:grid-cols-2">
        {(active?.files ?? []).map(([name, kind], i) =>
          <div key={i} className="flex min-w-0 items-start gap-2 border border-zinc-100 p-2">
            {kind === "Thư mục" ? <Folder size={17}/> : <File size={17}/>}
            <div className="min-w-0"><p className="break-all text-xs font-semibold">{name}</p><span className="text-[10px] text-zinc-500">{kind}</span></div>
          </div>)}
        {!active?.files?.length && <span className="text-sm text-zinc-500">Thư mục trống</span>}
      </div>
    </div>
  </div>;
}

function TransferDemo({block}: {block: PresentationBlock}) {
  const [done,setDone]=useState(false);
  return <div className={panel}>
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
      <div className="min-w-0 border border-zinc-200 bg-zinc-50 p-3 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-700"><Folder size={17}/>{block.source}</div>
        <div className="mt-5 min-h-14 border border-zinc-200 bg-white p-3 text-xs font-semibold text-zinc-800">
          {done && block.mode === "move" ? "Không còn tệp" : <span className="flex items-center gap-2"><FileText size={17}/> {block.filename}</span>}
        </div>
      </div>
      <ArrowRight className="self-center" size={25}/>
      <div className="min-w-0 border border-zinc-200 bg-zinc-50 p-3 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-700"><Folder size={17}/>{block.destination}</div>
        <div className={"mt-5 min-h-14 border p-3 text-xs font-semibold " +
          (done ? "border-cyan bg-cyan text-ink" : "border-zinc-200 bg-white text-zinc-400")}>
          {done ? <span className="flex items-center gap-2"><Check size={16}/>{block.filename}</span> : "Chưa có tệp"}
        </div>
      </div>
    </div>
    <div className="mt-5 flex flex-wrap gap-2">
      <button disabled={done} type="button" onClick={() => setDone(true)}
        className="bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">Thực hiện</button>
      <button type="button" onClick={() => setDone(false)}
        className="flex items-center gap-2 border border-zinc-300 px-5 py-2.5 text-sm font-semibold">
        <RotateCcw size={14}/> Làm lại</button>
    </div>
    {done && <p role="status" className="mt-3 text-sm text-zinc-700">
      {block.mode === "move" ? "Tệp đã được chuyển; vị trí cũ không còn bản gốc." : "Đã sao chép; bản gốc vẫn ở vị trí cũ."}
    </p>}
  </div>;
}

function QuizChoices({block}: {block: PresentationBlock}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answers = (block.answers ?? []) as string[];
  return <div className="flex h-full flex-col gap-3" data-native-quiz="true">
    <div className="grid flex-1 gap-3 md:grid-cols-2">
      {answers.map((answer, i) => {
        const correct = selected !== null && i === block.correctIndex;
        const wrong = selected === i && i !== block.correctIndex;
        return <button type="button" key={i} data-choice={i}
          onClick={() => setSelected(i)} aria-pressed={selected === i}
          className={"group flex min-h-20 items-center gap-4 border p-4 text-left transition sm:p-5 " +
            (correct ? "border-ink bg-cyan text-ink" : wrong ? "border-red-400 bg-red-50 text-red-900" :
              "border-zinc-200 bg-white text-ink hover:border-ink")}>
          <span className={"grid h-10 w-10 shrink-0 place-items-center border text-sm font-black " +
            (correct ? "border-ink" : wrong ? "border-red-400" : "border-zinc-200")}>
            {String.fromCharCode(65 + i)}
          </span>
          <span className="xcn-slide-choice flex-1 text-base font-semibold leading-snug sm:text-xl">{answer}</span>
          {correct && <CheckCircle2 size={20}/>}
          {wrong && <X size={20}/>}
        </button>;
      })}
    </div>
    {selected !== null && <div role="status" aria-live="polite" className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 py-3">
      <div>
        <strong className="text-sm">{selected === block.correctIndex ? "Chính xác" : "Chưa chính xác"}</strong>
        <p className="mt-1 text-sm leading-6 text-zinc-600">{block.explanation}</p>
      </div>
      <button type="button" onClick={() => setSelected(null)} className="flex items-center gap-2 text-xs font-bold underline">
        <RotateCcw size={15}/> Thử lại
      </button>
    </div>}
  </div>;
}

export function PresentationBlockView({block}: {block: PresentationBlock}) {
  switch(block.type) {
    case "lessonCover":
      return <LessonOpeningCover block={block}/>;
    case "warmUpComparison":
      return <WarmUpComparison block={block}/>;
    case "heroStats":
      return <div className="grid h-full grid-cols-2 gap-3 lg:grid-cols-4">
        {(block.items ?? []).map(([value,label]: [string,string],i:number)=><div key={i} className="border-t border-current/20 pt-3">
          <strong className="block text-3xl font-black tracking-tight sm:text-5xl">{value}</strong>
          <span className="mt-2 block text-sm leading-snug opacity-80 sm:text-lg">{label}</span>
        </div>)}
      </div>;
    case "card":
      return <article className={panel}>
        <span className={eyebrow}>{block.number ?? "KIẾN THỨC"}</span>
        <h3 className={"mt-4 " + heading}>{block.title}</h3>
        <p className="xcn-slide-body mt-3 text-base leading-relaxed text-zinc-700 sm:text-lg">{block.text}</p>
      </article>;
    case "definition":
      return <article className={panel}>
        <span className={eyebrow}>{block.label ?? "KHÁI NIỆM"}</span>
        <h3 className={"mt-4 " + heading}>{block.title}</h3>
        <p className="xcn-slide-body mt-3 text-base leading-relaxed text-zinc-700 sm:text-lg">{block.text}</p>
        {block.example && <div className="mt-5 break-all bg-zinc-100 p-3 font-mono text-sm font-medium">{block.example}</div>}
      </article>;
    case "fileType":
      return <div className={panel+" flex flex-col gap-3"}>
        <span className="grid h-14 w-20 place-items-center bg-ink text-xl font-black text-cyan">{block.extension}</span>
        <strong className="xcn-slide-file-name mt-auto break-all text-base sm:text-xl">{block.name}</strong>
        <span className="text-base text-zinc-600 sm:text-lg">{block.caption}</span>
      </div>;
    case "filename":
      return <div className={panel+" flex flex-col items-center justify-center"}>
        <p className="break-all text-center font-mono text-2xl font-black tracking-tight sm:text-4xl">{block.name}<span className="bg-cyan">{block.extension}</span></p>
        <div className="mt-7 flex w-full justify-around text-[11px] font-bold tracking-widest text-zinc-500"><span>TÊN TỆP</span><span>PHẦN MỞ RỘNG</span></div>
      </div>;
    case "stack":
      return <div className="flex h-full flex-col justify-center divide-y divide-zinc-200 border border-zinc-200 bg-white px-5">
        {(block.items ?? []).map((child:PresentationBlock,i:number)=><div key={i} className="py-3">
          <strong className="xcn-slide-stack-title text-lg font-semibold sm:text-2xl">{child.title}</strong>
          {child.text && <p className="xcn-slide-stack-text mt-2 text-base leading-snug text-zinc-600 sm:text-lg">{child.text}</p>}
        </div>)}
      </div>;
    case "notice":
      return <div className={"flex items-start gap-3 border-l-4 p-4 text-sm leading-6 " +
        (block.tone==="warning"?"border-amber-500 bg-amber-50 text-amber-900":"border-ink bg-zinc-100 text-zinc-800")}>
        {block.tone==="warning"?<TriangleAlert size={19} className="shrink-0"/>:<Info size={19} className="shrink-0"/>}
        <p>{block.text}</p>
      </div>;
    case "shortcut":
      return <div className={panel+" flex items-center gap-4"}>
        <kbd className="min-w-24 border border-zinc-200 bg-zinc-100 px-3 py-3 text-center font-mono text-sm font-bold sm:text-lg">{block.combo}</kbd>
        <div className="min-w-0">
          <strong className="xcn-slide-shortcut-label text-base font-semibold sm:text-xl">{block.label}</strong>
          {block.detail && <p className="mt-1 text-sm text-zinc-500">{block.detail}</p>}
        </div>
      </div>;
    case "keyCombo":
      return <div className={panel+" flex flex-col items-center justify-center gap-6"}>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(block.keys ?? []).map((key:string,i:number) => key==="+" ?
            <span key={i} className="text-2xl font-light text-zinc-400">+</span> :
            <kbd key={i} className="min-w-20 border-b-4 border-zinc-400 bg-zinc-100 px-5 py-4 text-center font-mono text-xl font-black sm:text-4xl">{key}</kbd>)}
        </div>
        <strong className={"text-center " + eyebrow}>{block.caption}</strong>
      </div>;
    case "folderTree":
      return <div className={panel}><FolderTree nodes={block.nodes ?? []}/></div>;
    case "code":
      return <div className={panel+" flex flex-col justify-center gap-4"}>
        {block.label && <span className={eyebrow}>{block.label}</span>}
        <code className="break-all font-mono text-base font-bold tracking-tight sm:text-2xl">{block.code}</code>
      </div>;
    case "steps":
      return <div className="grid h-full gap-2 sm:grid-cols-2">
        {(block.items ?? []).map((step:{title:string;text:string},i:number)=><div key={i} className="flex items-start gap-3 border border-zinc-200 bg-white p-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center bg-ink text-sm font-bold text-cyan">{String(i+1).padStart(2,"0")}</span>
          <div><strong className="xcn-slide-step-title text-base font-semibold sm:text-xl">{step.title}</strong>
            <p className="xcn-slide-step-text mt-2 text-base leading-snug text-zinc-600 sm:text-lg">{step.text}</p></div>
        </div>)}
      </div>;
    case "explorer":
      return <InteractiveExplorer block={block}/>;
    case "fileTransfer":
      return <TransferDemo block={block}/>;
    case "quiz":
      return <QuizChoices block={block}/>;
    case "formula":
      return <div className={panel+" flex flex-col justify-center gap-5"}>
        <span className={eyebrow}>{block.label ?? "CÔNG THỨC"}</span>
        <code className="break-all bg-cyan p-4 font-mono text-base font-bold sm:text-2xl">{block.value}</code>
        {block.explanation && <p className="text-sm leading-7 text-zinc-600">{block.explanation}</p>}
      </div>;
    case "excelTable":
      return <div className={panel+" overflow-x-auto"}>
        <span className={eyebrow}>{block.name ?? "BẢNG TÍNH"}</span>
        <table className="mt-3 w-full border-collapse text-left text-sm">
          <thead><tr>{(block.headers??[]).map((cell:string,i:number)=><th key={i} className="border border-zinc-300 bg-zinc-100 px-3 py-2">{cell}</th>)}</tr></thead>
          <tbody>{(block.rows??[]).map((row:string[],i:number)=><tr key={i}>{row.map((cell,j)=><td key={j} className="border border-zinc-200 px-3 py-2">{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>;
    case "document":
      return <div className={panel+" bg-zinc-100"}>
        <div className="mb-4 flex items-center justify-between border-b border-zinc-300 pb-2 text-xs text-zinc-500"><span>TRÌNH SOẠN THẢO</span><FileText size={18}/></div>
        <div className="mx-auto max-w-md bg-white px-6 py-8 shadow-sm">
          <h3 className="text-center text-lg font-bold">{block.heading}</h3>
          {(block.paragraphs??[]).map((p:string,i:number)=><p className="mt-4 text-sm leading-7" key={i}>{p}</p>)}
        </div>
      </div>;
    case "compare":
      return <div className="grid gap-4 sm:grid-cols-2">
        {[block.left,block.right].map((item:any,i:number)=><div className={panel} key={i}>
          <span className={eyebrow}>{item?.label ?? "PHƯƠNG ÁN"}</span>
          <h3 className={"mt-3 "+heading}>{item?.title}</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{item?.text}</p>
        </div>)}
      </div>;
    case "image":
      return <figure className={panel+" flex flex-col justify-center"}>
        <img src={block.src} alt={block.alt ?? ""} className="max-h-[40vh] w-full object-contain"/>
        {block.caption && <figcaption className="mt-3 text-center text-xs text-zinc-500">{block.caption}</figcaption>}
      </figure>;
    case "hotspot":
      return <Hotspot block={block}/>;
    default:
      return <div className={panel+" text-sm text-zinc-500"}>Thành phần đang được cập nhật: {block.type}</div>;
  }
}

function Hotspot({block}: {block: PresentationBlock}) {
  const [chosen,setChosen]=useState<number|null>(null);
  return <div className={panel}>
    <strong className="text-lg">{block.title}</strong>
    <div className="mt-5 flex flex-wrap gap-2">
      {(block.points??[]).map((item:{label:string},i:number)=><button key={i} type="button" onClick={()=>setChosen(i)}
        aria-pressed={chosen===i}
        className={"border px-4 py-3 text-sm "+(chosen===i?"border-ink bg-cyan":"border-zinc-300 bg-zinc-50")}>
        {item.label}</button>)}
    </div>
    <p className="mt-5 text-sm leading-7" role="status">
      {chosen===null?"Chọn một khu vực để xem giải thích.":block.points[chosen]?.explanation}
    </p>
  </div>;
}
