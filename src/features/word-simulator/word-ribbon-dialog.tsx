"use client";

import {useEffect,useRef} from "react";
import {createPortal} from "react-dom";
import {X} from "lucide-react";

export type RibbonDialogAction={label:string;description?:string;run:()=>void};
type Props={name:string;actions:RibbonDialogAction[];onClose:()=>void};

export function WordRibbonDialog({name,actions,onClose}:Props){
  const panel=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    panel.current?.querySelector<HTMLButtonElement>(".wsl-group-dialog-close")?.focus({preventScroll:true});
    function onKey(event:KeyboardEvent){if(event.key==="Escape"){event.preventDefault();event.stopPropagation();onClose();}}
    document.addEventListener("keydown",onKey,true);
    return ()=>document.removeEventListener("keydown",onKey,true);
  },[onClose]);
  return typeof document!=="undefined"&&createPortal(
    <div className="wsl-group-dialog-backdrop" onPointerDown={event=>{if(event.target===event.currentTarget)onClose();}}>
      <div ref={panel} className="wsl-group-dialog" role="dialog" aria-modal="true" aria-label={"Tùy chọn "+name}>
        <header className="wsl-group-dialog-header">
          <strong>{name} — Tùy chọn chi tiết</strong>
          <button type="button" className="wsl-group-dialog-close" onClick={onClose} aria-label="Đóng hộp thoại"><X size={17}/></button>
        </header>
        <div className="wsl-group-dialog-actions">
          {actions.map(action=><button type="button" key={action.label} className="wsl-group-dialog-action"
            onMouseDown={event=>event.preventDefault()}
            onClick={()=>{onClose();action.run();}}>
            <span>{action.label}</span>
            {action.description&&<small>{action.description}</small>}
          </button>)}
        </div>
      </div>
    </div>,document.body
  );
}
