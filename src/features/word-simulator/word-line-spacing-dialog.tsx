"use client";

import {useEffect,useRef,useState} from "react";
import {createPortal} from "react-dom";
import {X} from "lucide-react";

export const WORD_LINE_SPACING_VALUES=["1","1.15","1.5","2","2.5","3"] as const;
export type WordParagraphSpacing={line:string;before:number;after:number};
export function lineSpacingLabel(value:string):string{
  return ["1","2","3"].includes(value)?value+".0":value;
}

type Props={
  initial:WordParagraphSpacing;
  onApply:(value:WordParagraphSpacing)=>void;
  onClose:()=>void;
};

/** A custom Word-like paragraph dialog; no browser-native <select>. */
export function WordLineSpacingDialog({initial,onApply,onClose}:Props){
  const panel=useRef<HTMLDivElement>(null);
  const [line,setLine]=useState(initial.line);
  const [before,setBefore]=useState(String(initial.before));
  const [after,setAfter]=useState(String(initial.after));
  const parsedBefore=Number(before),parsedAfter=Number(after);
  const valid=(text:string,value:number)=>/^(?:0|[1-9][0-9]?)$/.test(text)&&Number.isInteger(value);
  const canApply=WORD_LINE_SPACING_VALUES.some(item=>item===line)&&
    valid(before,parsedBefore)&&valid(after,parsedAfter);

  useEffect(()=>{
    panel.current?.querySelector<HTMLButtonElement>(".wsl-spacing-choice.is-active")?.focus({preventScroll:true});
    function onKey(event:KeyboardEvent){
      if(event.key==="Escape"){event.preventDefault();event.stopPropagation();onClose();}
    }
    document.addEventListener("keydown",onKey,true);
    return ()=>document.removeEventListener("keydown",onKey,true);
  },[onClose]);

  return typeof document!=="undefined"&&createPortal(
    <div className="wsl-spacing-dialog-backdrop"
      onPointerDown={event=>{if(event.target===event.currentTarget)onClose();}}>
      <section ref={panel} className="wsl-spacing-dialog" role="dialog" aria-modal="true"
        aria-labelledby="wsl-spacing-dialog-title">
        <header className="wsl-spacing-dialog-header">
          <strong id="wsl-spacing-dialog-title">Paragraph — Line Spacing Options</strong>
          <button type="button" onClick={onClose} aria-label="Close" className="wsl-spacing-dialog-close">
            <X size={18}/>
          </button>
        </header>
        <div className="wsl-spacing-dialog-body">
          <p className="wsl-spacing-dialog-hint">Choose line spacing and the space before or after the selected paragraphs.</p>
          <fieldset className="wsl-spacing-dialog-fieldset">
            <legend>Line spacing</legend>
            <div className="wsl-spacing-dialog-choices">
              {WORD_LINE_SPACING_VALUES.map(value=>
                <button key={value} type="button" className={"wsl-spacing-choice"+(line===value?" is-active":"")}
                  aria-pressed={line===value} onClick={()=>setLine(value)}>{lineSpacingLabel(value)}</button>)}
            </div>
          </fieldset>
          <div className="wsl-spacing-dialog-fields">
            <label htmlFor="wsl-spacing-before">Before paragraph (px)
              <input id="wsl-spacing-before" type="number" min="0" max="99" step="1"
                value={before} onChange={event=>setBefore(event.target.value)}/>
            </label>
            <label htmlFor="wsl-spacing-after">After paragraph (px)
              <input id="wsl-spacing-after" type="number" min="0" max="99" step="1"
                value={after} onChange={event=>setAfter(event.target.value)}/>
            </label>
          </div>
        </div>
        <footer className="wsl-spacing-dialog-footer">
          <button type="button" className="wsl-spacing-dialog-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="wsl-spacing-dialog-apply" disabled={!canApply}
            onClick={()=>{if(canApply){onClose();onApply({line,before:parsedBefore,after:parsedAfter});}}}>OK</button>
        </footer>
      </section>
    </div>,document.body
  );
}
