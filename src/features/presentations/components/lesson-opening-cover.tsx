"use client";

import {
  ChevronRight, Download, FileSpreadsheet, FileText, Folder, FolderOpen,
  HardDrive, Image as ImageIcon, Search,
} from "lucide-react";
import type { PresentationBlock } from "../types";

/**
 * Data-driven teaching cover, not a separate brand/landing page.
 * The File Explorer window is a visual teaching illustration, not a screenshot
 * or interactive file browser. Reusable for later Windows lessons.
 */
export function LessonOpeningCover({block}: {block: PresentationBlock}) {
  const goals = (block.goals ?? []) as {verb: string; detail: string}[];
  return <div className="xcn-lesson-opening">
    <div className="xcn-lesson-opening-copy">
      <div className="xcn-lesson-opening-intro">
        <p className="xcn-lesson-opening-eyebrow">{block.eyebrow ?? "BÀI HỌC"}</p>
        <h1 className="xcn-lesson-opening-title">
          {block.heading ?? "Làm quen với File Explorer"}
        </h1>
      </div>
      <div className="xcn-lesson-opening-goals">
        <h2>Học xong, em làm được gì?</h2>
        <ol className="xcn-lesson-opening-goals-list">
          {goals.map((goal, i)=><li key={goal.verb}>
            <span className="xcn-lesson-opening-number">{String(i+1).padStart(2,"0")}</span>
            <p><strong>{goal.verb}</strong><span>{goal.detail}</span></p>
          </li>)}
        </ol>
      </div>
    </div>
    <div className="xcn-lesson-opening-visual">
      <div className="xcn-lesson-opening-app" role="img" aria-label="Minh họa File Explorer: ngăn điều hướng, thanh địa chỉ và các tệp Word, Excel, ảnh">
        <div className="xcn-explorer-titlebar">
          <FolderOpen size={28} strokeWidth={1.75} fill="#f9d66c" color="#ba8535" aria-hidden="true"/>
          <span>File Explorer</span>
          <div className="xcn-explorer-window-controls" aria-hidden="true"><span>−</span><span>□</span><span>×</span></div>
        </div>
        <div className="xcn-explorer-address">
          <span aria-hidden="true">←　→</span>
          <div><HardDrive size={15}/><ChevronRight size={13}/> Documents <ChevronRight size={13}/> <strong>BAI_TAP</strong></div>
          <Search size={17} aria-hidden="true"/>
        </div>
        <div className="xcn-explorer-body">
          <div className="xcn-explorer-sidebar" aria-hidden="true">
            <div><Folder size={18}/> Quick access</div>
            <div><Download size={18}/> Downloads</div>
            <div className="is-active"><Folder size={18}/> Documents</div>
            <div><HardDrive size={18}/> This PC</div>
          </div>
          <div className="xcn-explorer-files">
            <div className="xcn-explorer-file-heading">Tên <span>Loại tệp</span></div>
            <div><FolderOpen size={21} fill="#f9d66c" color="#bc8d36"/> <strong>ON_TAP</strong><span>Thư mục</span></div>
            <div><FileText size={21} color="#2d5cbb"/> <strong>Bai_tap_Word.docx</strong><span>Word</span></div>
            <div><FileSpreadsheet size={21} color="#168458"/> <strong>Bang_diem.xlsx</strong><span>Excel</span></div>
            <div><ImageIcon size={21} color="#7f64bc"/> <strong>Hinh_anh.jpg</strong><span>Hình ảnh</span></div>
          </div>
        </div>
        <div className="xcn-explorer-status">4 mục　·　Documents / BAI_TAP</div>
      </div>
      <div className="xcn-lesson-opening-question">
        <span>KHỞI ĐỘNG</span>
        <p>{block.question ?? "Làm thế nào tìm lại một tệp đã lưu thật nhanh?"}</p>
      </div>
    </div>
  </div>;
}
