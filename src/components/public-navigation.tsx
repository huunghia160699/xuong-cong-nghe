"use client";

import {useEffect,useId,useRef,useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ChevronDown,Menu,X,ArrowUpRight} from "lucide-react";
import {publicNav,publicEcosystemNav} from "@/config/navigation";

type Props={accountHref:string;accountLabel:string};

export function PublicNavigation({accountHref,accountLabel}:Props){
 const pathname=usePathname();
 const [menuOpen,setMenuOpen]=useState(false);
 const [ecosystemOpen,setEcosystemOpen]=useState(false);
 const menuId=useId(),ecosystemId=useId();
 const rootRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  setMenuOpen(false);
  setEcosystemOpen(false);
 },[pathname]);
 useEffect(()=>{
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==="Escape"){
    setEcosystemOpen(false);setMenuOpen(false);
   }
  };
  const onOutside=(event:PointerEvent)=>{
   if(rootRef.current&&!rootRef.current.contains(event.target as Node)){
    setEcosystemOpen(false);setMenuOpen(false);
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
     {publicNav.map(item=>item.label==="Hệ sinh thái"
      ? <button key={item.label} type="button" className="xcn-public-nav-link xcn-public-nav-toggle"
          aria-expanded={ecosystemOpen} aria-controls={ecosystemId} aria-haspopup="true"
          data-active={pathname==="/cong-cu"?"true":undefined}
          onClick={()=>setEcosystemOpen(v=>!v)}>
           {item.label}<ChevronDown size={15} aria-hidden="true" className={ecosystemOpen?"rotate-180":""}/>
        </button>
      : <Link key={item.href} href={item.href} className="xcn-public-nav-link"
          aria-current={current(item.href)?"page":undefined}>{item.label}</Link>)}
   </nav>
   <Link href={accountHref} className="xcn-public-account">{accountLabel}<ArrowUpRight size={16} aria-hidden="true"/></Link>
   <button className="xcn-public-mobile-toggle" type="button" aria-label={menuOpen?"Đóng menu":"Mở menu"}
     aria-expanded={menuOpen} aria-controls={menuId}
     onClick={()=>{setMenuOpen(v=>!v);setEcosystemOpen(false);}}>
     {menuOpen?<X size={21} aria-hidden="true"/>:<Menu size={21} aria-hidden="true"/>}
   </button>
   {ecosystemOpen&&<div className="xcn-public-mega" id={ecosystemId}>
     <div className="xcn-public-mega-header">
       <div><strong>Khám phá hệ sinh thái</strong><p>Học tập, thực hành và các công cụ kết nối với nhau.</p></div>
       <Link href="/cong-cu" onClick={()=>setEcosystemOpen(false)}>Xem công cụ <ArrowUpRight size={15} aria-hidden="true"/></Link>
     </div>
     <div className="xcn-public-mega-grid">
       {publicEcosystemNav.map(item=><Link key={item.label} href={item.href}
         className="xcn-public-mega-item" onClick={()=>setEcosystemOpen(false)}>
         <span className="xcn-public-mega-icon" aria-hidden="true">{item.icon}</span>
         <span><strong>{item.label}</strong><small>{item.description}</small></span>
       </Link>)}
     </div>
   </div>}
   {menuOpen&&<nav className="xcn-public-mobile-panel" id={menuId} aria-label="Điều hướng trên thiết bị nhỏ">
     {publicNav.filter(item=>item.label!=="Hệ sinh thái").map(item=>
      <Link key={item.href} href={item.href} className="xcn-public-mobile-link"
        aria-current={current(item.href)?"page":undefined} onClick={()=>setMenuOpen(false)}>
       {item.label}
      </Link>)}
     <details className="xcn-public-mobile-details">
       <summary>Hệ sinh thái <ChevronDown size={16} aria-hidden="true"/></summary>
       <div className="xcn-public-mobile-subnav">
         {publicEcosystemNav.map(item=><Link key={item.label} href={item.href} onClick={()=>setMenuOpen(false)}>
           {item.label}
         </Link>)}
       </div>
     </details>
     <Link href={accountHref} className="xcn-public-mobile-account" onClick={()=>setMenuOpen(false)}>{accountLabel}</Link>
   </nav>}
 </div>;
}
