"use client";
import {useState} from "react";
import {Save,Undo2,Redo2,ChevronDown,Minus,Square,X,FileText} from "lucide-react";

export function WordWindowBar({
  filename,onRename,onSave,onUndo,onRedo,onNew,onPrint,onClose,status
}:{
  filename:string;onRename:(value:string)=>void;onSave:()=>void;onUndo:()=>void;onRedo:()=>void;
  onNew:()=>void;onPrint:()=>void;onClose:()=>void;status:string
}){
  const [open,setOpen]=useState(false);
  return <header className="wsl-window-bar">
    <div className="wsl-qat" role="toolbar" aria-label="Quick Access Toolbar">
      <span className="wsl-window-app-icon" aria-hidden="true"><FileText size={14}/><b>W</b></span>
      <button className="wsl-qat-button" type="button" onClick={onSave} aria-label="Save — Lưu bản nháp" title="Save"><Save size={17}/></button>
      <button className="wsl-qat-button" type="button" onMouseDown={e=>e.preventDefault()} onClick={onUndo} aria-label="Undo — Hoàn tác" title="Undo"><Undo2 size={17}/></button>
      <button className="wsl-qat-button" type="button" onMouseDown={e=>e.preventDefault()} onClick={onRedo} aria-label="Redo — Làm lại" title="Redo"><Redo2 size={17}/></button>
      <div className="wsl-qat-menu-anchor">
        <button className="wsl-qat-button" type="button" onClick={()=>setOpen(!open)} aria-label="Tùy chỉnh Quick Access Toolbar" aria-expanded={open}><ChevronDown size={13}/></button>
        {open&&<div className="wsl-qat-menu">
          <button type="button" onClick={()=>{onSave();setOpen(false)}}>Save — Lưu</button>
          <button type="button" onClick={()=>{onNew();setOpen(false)}}>New — Tài liệu mới</button>
          <button type="button" onClick={()=>{onPrint();setOpen(false)}}>Print — In</button>
        </div>}
      </div>
    </div>
    <div className="wsl-window-document"><input value={filename} maxLength={90} spellCheck={false} aria-label="Tên tài liệu" onChange={e=>onRename(e.target.value)} /><span> - Word</span></div>
    <div className="wsl-window-controls">
      <span aria-hidden="true" className="wsl-window-decor"><Minus size={16}/></span>
      <span aria-hidden="true" className="wsl-window-decor"><Square size={13}/></span>
      <a href="/cong-cu" onClick={event=>{
        onClose();
        // When Word lives in the teaching slide, the X returns to the presentation.
        if(window.parent!==window){
          event.preventDefault();
          window.parent.postMessage({type:"xcn-word-lab-close"},window.location.origin);
        }
      }} className="wsl-window-close" aria-label="Close — Thoát công cụ" title="Thoát về Công cụ"><X size={17}/></a>
    </div>
    <span role="status" className="sr-only">{status}</span>
  </header>;
}
