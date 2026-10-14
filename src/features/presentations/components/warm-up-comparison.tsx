"use client";

import { useState } from "react";
import {
  ArrowRight, FileSpreadsheet, FileText, FolderOpen, Image as ImageIcon,
  Monitor, MousePointer2, RotateCcw, Search,
} from "lucide-react";
import type { PresentationBlock } from "../types";

const scattered = [
  {name:"Bai_van.docx",icon:"word",x:6,y:8},
  {name:"Anh_lop.jpg",icon:"image",x:38,y:6},
  {name:"Bang_diem.xlsx",icon:"excel",x:71,y:10},
  {name:"Bai_tap_1.docx",icon:"word",x:18,y:34},
  {name:"Anh_02.jpg",icon:"image",x:53,y:40},
  {name:"Bai_cu.docx",icon:"word",x:78,y:59},
  {name:"Ke_hoach.xlsx",icon:"excel",x:13,y:66},
  {name:"De_on_tap.docx",icon:"word",x:48,y:72},
] as const;

function DesktopIcon({type}: {type:"word"|"image"|"excel"}) {
  if(type==="word")return <FileText size={30} color="#9cbeff" strokeWidth={1.7}/>;
  if(type==="image")return <ImageIcon size={30} color="#e2b9ff" strokeWidth={1.7}/>;
  return <FileSpreadsheet size={30} color="#9af0c4" strokeWidth={1.7}/>;
}

export function WarmUpComparison({block}: {block:PresentationBlock}) {
  const [revealed,setRevealed]=useState(false);
  return <div className="xcn-warmup">
    <header>
      <p className="xcn-warmup-kicker">QUẢN LÝ TỆP VÀ THƯ MỤC</p>
      <h1 className="xcn-warmup-heading">Khởi động</h1>
    </header>
    <div className="xcn-warmup-comparison">
      <section className="xcn-warmup-situation" aria-label="Tình huống: màn hình Desktop bừa bộn">
        <header className="xcn-warmup-situation-header">
          <strong>{block.messyHeading ?? "BỪA BỘN"}</strong>
          <span>VẤN ĐỀ</span>
        </header>
        <div className="xcn-warmup-visual xcn-warmup-desktop" role="img"
          aria-label="Minh họa màn hình Desktop có nhiều tệp Word, Excel và ảnh rải rác">
          {scattered.map(entry=><div key={entry.name} className="xcn-warmup-desktop-file"
            style={{left:entry.x+"%",top:entry.y+"%"}}>
            <DesktopIcon type={entry.icon}/><span>{entry.name}</span>
          </div>)}
          <span className="xcn-warmup-desktop-label"><Monitor size={14} className="inline"/> DESKTOP</span>
        </div>
        <p className="xcn-warmup-caption is-problem">{block.messyText}</p>
      </section>

      <section className="xcn-warmup-situation" aria-label="Giải pháp: tổ chức theo thư mục">
        <header className="xcn-warmup-situation-header">
          <strong>{block.tidyHeading ?? "NGĂN NẮP"}</strong>
          <span>GIẢI PHÁP</span>
        </header>
        <div className={"xcn-warmup-visual xcn-warmup-solution" + (revealed?" is-revealed":"")}>
          {revealed ?
            <div className="xcn-warmup-solution-files" role="img"
              aria-label="Minh họa danh mục File Explorer: Word, Excel, Hình ảnh được xếp thành các thư mục riêng">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
                <FolderOpen size={18} color="#b58e38"/> Documents <ArrowRight size={15}/> HỌC TẬP
              </div>
              {[
                {name:"WORD",meta:"Bài văn, bài tập"},
                {name:"EXCEL",meta:"Bảng điểm"},
                {name:"HÌNH ẢNH",meta:"Ảnh học tập"},
              ].map(row=><div key={row.name} className="xcn-warmup-folder">
                <FolderOpen size={26} color="#b58e38" fill="#f4d978"/>
                <strong>{row.name}</strong><span>{row.meta}</span>
              </div>)}
              <div className="flex justify-end text-xs font-medium text-zinc-500">
                <Search size={15} className="mr-1"/> Dễ tìm, dễ kiểm tra
              </div>
            </div> :
            <div className="xcn-warmup-solution-cover">
              <MousePointer2 size={38} color="#71717a" strokeWidth={1.4}/>
              <button type="button" onClick={()=>setRevealed(true)}
                className="xcn-warmup-reveal" aria-label="Hiện cách sắp xếp dữ liệu ngăn nắp">
                {block.revealLabel ?? "Hiện cách sắp xếp"} <ArrowRight size={20}/>
              </button>
              <p className="text-sm text-zinc-600">Bấm để xuất hiện giải pháp</p>
            </div>}
        </div>
        <div className="xcn-warmup-caption is-positive flex items-center justify-between gap-3">
          <span>{revealed ? block.tidyText : "Có cách nào tốt hơn?"}</span>
          {revealed && <button type="button" onClick={()=>setRevealed(false)}
            aria-label="Ẩn giải pháp và bắt đầu lại" title="Bắt đầu lại"
            className="grid h-8 w-8 shrink-0 place-items-center border border-[#c4db8d] hover:bg-white">
            <RotateCcw size={16}/>
          </button>}
        </div>
      </section>
    </div>
    <div className="xcn-warmup-discussion" aria-live="polite">
      <p>{block.prompt ?? "Máy tính của em giống bên nào hơn?"}</p>
      {revealed && <span>{block.discussion ?? "Em sẽ tìm lại tệp đã lưu bằng cách nào?"}</span>}
    </div>
  </div>;
}
