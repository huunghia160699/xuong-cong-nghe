"use client";

import {useEffect,useId,useRef,useState,type ReactNode,type CSSProperties,type KeyboardEvent as ReactKeyboardEvent} from "react";
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
        title={disabled?undefined:label} aria-label={label} aria-pressed={active||undefined} disabled={disabled}
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

/** Browser-native selection fields are deliberately not used. All
 * dropdown menus share this div-backed, keyboard-operable listbox surface. */
export type WordDropdownOption={value:string;label:string;disabled?:boolean};
export function WordCustomDropdown({
  label,value,options,onChange,className=""
}:{
  label:string;value:string;options:WordDropdownOption[];
  onChange:(value:string)=>void;className?:string;
}){
  const anchor=useRef<HTMLDivElement>(null);
  const menu=useRef<HTMLDivElement>(null);
  const id=useId().replace(/:/g,"");
  const [open,setOpen]=useState(false);
  const [activeIndex,setActiveIndex]=useState(0);
  const [coords,setCoords]=useState<CSSProperties>({top:0,left:0});
  const selectedIndex=options.findIndex(option=>option.value===value);
  const currentLabel=options[selectedIndex]?.label??value;
  const available=options.map((option,index)=>option.disabled?-1:index).filter(index=>index>=0);

  function showMenu(initialIndex=selectedIndex){
    const rect=anchor.current?.getBoundingClientRect();
    if(!rect||!available.length)return;
    const menuWidth=Math.max(rect.width,label==="Font"?166:label==="Font Size"?66:148);
    const left=Math.max(8,Math.min(rect.left,window.innerWidth-menuWidth-8));
    const below=window.innerHeight-rect.bottom;
    const above=rect.top;
    const popupHeight=Math.min(options.length*31+10,Math.min(320,window.innerHeight*.6));
    const openAbove=below<popupHeight&&above>below;
    setCoords({
      left,
      minWidth:menuWidth,
      maxWidth:Math.max(menuWidth,window.innerWidth-16),
      ...(openAbove?{bottom:window.innerHeight-rect.top+3}:{top:rect.bottom+3})
    });
    setActiveIndex(initialIndex>=0&&!options[initialIndex]?.disabled?initialIndex:available[0]);
    setOpen(true);
  }
  function choose(index:number){
    const option=options[index];
    if(!option||option.disabled)return;
    setOpen(false);
    onChange(option.value);
  }
  function onKeyDown(event:ReactKeyboardEvent<HTMLDivElement>){
    if(event.key==="Escape"){
      if(open){event.preventDefault();setOpen(false);}
      return;
    }
    if(event.key==="Tab"){setOpen(false);return;}
    if(event.key==="Enter"||event.key===" "){
      event.preventDefault();
      if(open)choose(activeIndex);else showMenu();
      return;
    }
    if(["ArrowDown","ArrowUp","Home","End"].includes(event.key)){
      event.preventDefault();
      if(!open){showMenu();return;}
      const currentPosition=available.indexOf(activeIndex);
      const next=event.key==="Home"?0:event.key==="End"?available.length-1:
        (currentPosition+(event.key==="ArrowDown"?1:-1)+available.length)%available.length;
      setActiveIndex(available[next]);
    }
  }
  useEffect(()=>{
    if(!open)return;
    function outside(event:PointerEvent){
      if(event.target instanceof Node&&!anchor.current?.contains(event.target)
        &&!menu.current?.contains(event.target))setOpen(false);
    }
    function escape(event:KeyboardEvent){
      if(event.key==="Escape"){
        setOpen(false);
        anchor.current?.focus({preventScroll:true});
      }
    }
    function close(){setOpen(false);}
    document.addEventListener("pointerdown",outside);
    document.addEventListener("keydown",escape);
    window.addEventListener("resize",close);
    document.querySelector(".wsl-ribbon")?.addEventListener("scroll",close);
    return ()=>{
      document.removeEventListener("pointerdown",outside);
      document.removeEventListener("keydown",escape);
      window.removeEventListener("resize",close);
      document.querySelector(".wsl-ribbon")?.removeEventListener("scroll",close);
    };
  },[open]);

  return <>
    <div ref={anchor} className={"wsl-word-dropdown "+className+(open?" is-open":"")}
      role="combobox" aria-label={label} aria-haspopup="listbox"
      aria-expanded={open} aria-controls={open?id:undefined}
      aria-activedescendant={open?id+"-option-"+activeIndex:undefined}
      tabIndex={0} onMouseDown={event=>event.preventDefault()}
      onClick={()=>open?setOpen(false):showMenu()}
      onKeyDown={onKeyDown}>
      <span className="wsl-word-dropdown-value">{currentLabel}</span>
      <ChevronDown size={13} className="wsl-font-select-chevron wsl-word-dropdown-chevron" aria-hidden="true"/>
    </div>
    {open&&typeof document!=="undefined"&&createPortal(
      <div ref={menu} id={id} role="listbox" aria-label={label}
        className="wsl-word-dropdown-menu" style={coords}>
        {options.map((option,index)=>
          <div key={option.value} id={id+"-option-"+index}
            className={"wsl-word-dropdown-option"+(option.value===value?" is-selected":"")+
              (activeIndex===index?" is-highlighted":"")}
            role="option" aria-selected={option.value===value}
            aria-disabled={option.disabled||undefined} tabIndex={-1}
            onMouseDown={event=>event.preventDefault()}
            onMouseEnter={()=>{if(!option.disabled)setActiveIndex(index);}}
            onClick={()=>choose(index)}>
            <span>{option.label}</span>
            {option.value===value&&<span className="wsl-word-dropdown-check" aria-hidden="true">✓</span>}
          </div>)}
      </div>,document.body)}
  </>;
}
