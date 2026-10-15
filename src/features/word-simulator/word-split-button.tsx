"use client";

import {useEffect,useRef,useState,type ReactNode,type CSSProperties} from "react";
import {createPortal} from "react-dom";
import {ChevronDown} from "lucide-react";

export type WordMenuOption={
  label:string;
  run:()=>void;
  color?:string;
  disabled?:boolean;
};

type Props={
  label:string;
  icon?:ReactNode;
  run?:()=>void;
  options:WordMenuOption[];
  className?:string;
  vertical?:boolean;
  arrowOnly?:boolean;
  footer?:ReactNode;
  disabled?:boolean;
  active?:boolean;
};

// Keep the editor selection when any part of a split control is clicked.
// The popup is portaled to body because the Ribbon scrolls horizontally.
export function WordSplitButton({label,icon,run,options,className="",vertical=false,arrowOnly=false,footer,disabled=false,active=false}:Props){
  const anchor=useRef<HTMLDivElement>(null);
  const menu=useRef<HTMLDivElement>(null);
  const [open,setOpen]=useState(false);
  const [coords,setCoords]=useState<CSSProperties>({top:0,left:0});

  function toggle(){
    if(disabled)return;
    if(open){setOpen(false);return;}
    const box=anchor.current?.getBoundingClientRect();
    if(!box)return;
    const width=214;
    const topSpace=box.top;
    const bottomSpace=window.innerHeight-box.bottom;
    const openAbove=bottomSpace<165 && topSpace>bottomSpace;
    setCoords({
      left:Math.max(8,Math.min(box.left,window.innerWidth-width-8)),
      ...(openAbove?{bottom:window.innerHeight-box.top+4}:{top:box.bottom+4}),
      minWidth:width
    });
    setOpen(true);
  }
  useEffect(()=>{
    if(!open)return;
    menu.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus({preventScroll:true});
    function outside(event:PointerEvent){
      if(event.target instanceof Node && !anchor.current?.contains(event.target) && !menu.current?.contains(event.target))setOpen(false);
    }
    function keydown(event:KeyboardEvent){if(event.key==="Escape"){setOpen(false);anchor.current?.querySelector<HTMLButtonElement>(".wsl-split-arrow")?.focus();}}
    function closeOnScroll(){setOpen(false);}
    document.addEventListener("pointerdown",outside);
    document.addEventListener("keydown",keydown);
    window.addEventListener("resize",closeOnScroll);
    document.querySelector(".wsl-ribbon")?.addEventListener("scroll",closeOnScroll);
    return ()=>{
      document.removeEventListener("pointerdown",outside);
      document.removeEventListener("keydown",keydown);
      window.removeEventListener("resize",closeOnScroll);
      document.querySelector(".wsl-ribbon")?.removeEventListener("scroll",closeOnScroll);
    };
  },[open]);

  return <>
    <div ref={anchor} className={"wsl-split "+className+(vertical?" wsl-split-vertical":"")+(arrowOnly?" wsl-split-arrow-only":"")}>
      {!arrowOnly&&<button type="button" className={"wsl-hb wsl-split-main"+(active?" is-active":"")}
        title={disabled?undefined:label} aria-label={label} disabled={disabled}
        onMouseDown={e=>e.preventDefault()} onClick={run}>{icon}</button>}
      <button type="button" className="wsl-hb wsl-split-arrow" disabled={disabled}
        aria-label={"Mở tùy chọn "+label} aria-haspopup="menu" aria-expanded={open}
        title={disabled?undefined:"Tùy chọn "+label}
        onMouseDown={e=>e.preventDefault()} onClick={toggle}
        onKeyDown={e=>{if(e.key==="ArrowDown"){e.preventDefault();if(!open)toggle();}}}>
        {vertical&&<span>Paste</span>}
        <ChevronDown size={13} aria-hidden="true"/>
      </button>
    </div>
    {open&&typeof document!=="undefined"&&createPortal(
      <div ref={menu} className="wsl-split-menu" style={coords} role="menu" aria-label={"Tùy chọn "+label}>
        {options.map(option=><button key={option.label} type="button" role="menuitem"
          disabled={option.disabled} className="wsl-split-menu-item"
          onMouseDown={e=>e.preventDefault()} onClick={()=>{setOpen(false);option.run();}}>
          {option.color&&<span className="wsl-split-menu-swatch" style={{backgroundColor:option.color}} aria-hidden="true"/>}
          <span>{option.label}</span>
        </button>)}
        {footer&&<div className="wsl-split-menu-footer">{footer}</div>}
      </div>,document.body)}
  </>;
}
