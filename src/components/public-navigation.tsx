"use client";

import {useEffect,useId,useRef,useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Menu,X,ArrowUpRight} from "lucide-react";
import {publicNav} from "@/config/navigation";

type Props={accountHref:string;accountLabel:string};

export function PublicNavigation({accountHref,accountLabel}:Props){
 const pathname=usePathname();
 const [menuOpen,setMenuOpen]=useState(false);
 const menuId=useId();
 const rootRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  setMenuOpen(false);
 },[pathname]);
 useEffect(()=>{
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==="Escape"){
    setMenuOpen(false);
   }
  };
  const onOutside=(event:PointerEvent)=>{
   if(rootRef.current&&!rootRef.current.contains(event.target as Node)){
    setMenuOpen(false);
   }
  };
  document.addEventListener("keydown",onKey);
  document.addEventListener("pointerdown",onOutside);
  return ()=>{
   document.removeEventListener("keydown",onKey);
   document.removeEventListener("pointerdown",onOutside);
  };
 },[]);
 const current=(href:string)=>{
  if(href==="/")return pathname==="/";
  return pathname===href||pathname.startsWith(href+"/");
 };
 return <div ref={rootRef} className="xcn-public-navigation">
   <nav className="xcn-public-desktop-nav" aria-label="Điều hướng chính">
     {publicNav.map(item=><Link key={item.href} href={item.href} className="xcn-public-nav-link"
          aria-current={current(item.href)?"page":undefined}>{item.label}</Link>)}
   </nav>
   <Link href={accountHref} className="xcn-public-account">{accountLabel}<ArrowUpRight size={16} aria-hidden="true"/></Link>
   <button className="xcn-public-mobile-toggle" type="button" aria-label={menuOpen?"Đóng menu":"Mở menu"}
     aria-expanded={menuOpen} aria-controls={menuId}
     onClick={()=>setMenuOpen(v=>!v)}>
     {menuOpen?<X size={21} aria-hidden="true"/>:<Menu size={21} aria-hidden="true"/>}
   </button>
   {menuOpen&&<nav className="xcn-public-mobile-panel" id={menuId} aria-label="Điều hướng trên thiết bị nhỏ">
     {publicNav.map(item=>
      <Link key={item.href} href={item.href} className="xcn-public-mobile-link"
        aria-current={current(item.href)?"page":undefined} onClick={()=>setMenuOpen(false)}>
       {item.label}
      </Link>)}
     <Link href={accountHref} className="xcn-public-mobile-account" onClick={()=>setMenuOpen(false)}>{accountLabel}</Link>
   </nav>}
 </div>;
}
