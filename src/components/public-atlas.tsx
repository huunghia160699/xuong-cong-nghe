"use client";

import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,BookOpen,GraduationCap,ClipboardCheck,Presentation,FileText,FileSpreadsheet,Code2,Database,Library,FolderKanban,Users,School,Monitor,Gamepad2} from "lucide-react";
import {CATALOG_STATUS_LABEL,PUBLIC_CATALOG,PUBLIC_FILTERS,type CatalogGroup,type CatalogIcon} from "@/config/public-catalog";

const icons:Record<CatalogIcon,typeof BookOpen>={
 book:BookOpen,graduation:GraduationCap,clipboard:ClipboardCheck,presentation:Presentation,
 file:FileText,sheet:FileSpreadsheet,code:Code2,database:Database,library:Library,
 folder:FolderKanban,users:Users,school:School,monitor:Monitor,sparkles:BookOpen,game:Gamepad2
};

export function PublicAtlas({authenticated}:{authenticated:boolean}){
 const [filter,setFilter]=useState<(typeof PUBLIC_FILTERS)[number]>("Tất cả");
 const visible=useMemo(()=>PUBLIC_CATALOG.filter(item=>filter==="Tất cả"||item.group===filter as CatalogGroup),[filter]);
 return <div>
  <div className="xcn-atlas-filters" role="group" aria-label="Lọc công cụ theo nhóm">
   {PUBLIC_FILTERS.map(value=><button key={value} type="button"
    className="xcn-atlas-filter" aria-pressed={filter===value}
    onClick={()=>setFilter(value)}>{value}</button>)}
  </div>
  <p aria-live="polite" className="xcn-atlas-count">Đang hiển thị {visible.length} trong {PUBLIC_CATALOG.length} nhóm công cụ và không gian.</p>
  <div className="xcn-atlas-grid">
   {visible.map(item=>{
    const Icon=icons[item.icon];
    const useHref=item.actionHref
      ? authenticated?item.actionHref:"/dang-nhap?next="+encodeURIComponent(item.actionHref)
      : null;
    return <article key={item.id} className="xcn-atlas-card">
     <div className="xcn-atlas-card-top">
      <span className="xcn-atlas-icon"><Icon size={23} strokeWidth={1.8} aria-hidden="true"/></span>
      <span className="xcn-atlas-status" data-status={item.status}>{CATALOG_STATUS_LABEL[item.status]}</span>
     </div>
     <span className="xcn-atlas-category">{item.group}</span>
     <h3>{item.title}</h3>
     <p>{item.summary}</p>
     <div className="xcn-atlas-tags">{item.features.map(feature=><span key={feature}>{feature}</span>)}</div>
     <div className="xcn-atlas-card-actions">
      <Link href={item.detailHref} className="xcn-atlas-detail">Tìm hiểu <ArrowUpRight size={15} aria-hidden="true"/></Link>
      {item.status==="available"&&useHref&&<Link className="xcn-atlas-use" href={useHref}>Sử dụng <ArrowUpRight size={15} aria-hidden="true"/></Link>}
     </div>
    </article>;
   })}
  </div>
 </div>;
}
