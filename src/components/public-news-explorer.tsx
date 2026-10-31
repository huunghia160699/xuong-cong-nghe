"use client";

import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {usePathname,useRouter,useSearchParams} from "next/navigation";
import {ArrowRight,BookOpen,Search,X} from "lucide-react";
import {NEWS_CATEGORIES,resolveNewsCategory,type PublicArticle} from "@/config/public-articles";

function newsHref(query:string,category:string):string{
 const params=new URLSearchParams();
 if(query.trim())params.set("q",query.trim());
 if(category!=="Tất cả")params.set("category",category);
 return "/tin-tuc"+(params.toString()?"?"+params.toString():"");
}

export function PublicNewsExplorer({articles}:{articles:readonly PublicArticle[]}){
 const router=useRouter();
 const pathname=usePathname();
 const search=useSearchParams();
 const urlQuery=search.get("q")??"";
 const category=resolveNewsCategory(search.get("category"));
 const [query,setQuery]=useState(urlQuery);

 useEffect(()=>{setQuery(urlQuery);},[urlQuery]);
 useEffect(()=>{
  if(query.trim()===urlQuery.trim())return;
  const timer=setTimeout(()=>router.replace(newsHref(query,category),{scroll:false}),350);
  return ()=>clearTimeout(timer);
 },[query,urlQuery,category,router]);

 const matching=useMemo(()=>{
  const needle=query.trim().toLocaleLowerCase("vi");
  return articles.filter(article=>
   article.status==="published" &&
   (category==="Tất cả"||article.category===category) &&
   (!needle||[article.title,article.summary,article.category,...article.tags].join(" ").toLocaleLowerCase("vi").includes(needle))
  );
 },[articles,query,category]);

 const clear=()=>{
  setQuery("");
  router.replace(pathname,{scroll:false});
 };
 const choose=(value:string)=>{
  router.replace(newsHref(query,value),{scroll:false});
 };
 return <>
  <div className="xcn-news-controls" role="search">
   <label className="xcn-news-search-label" htmlFor="news-keyword">Tìm trong Tin tức & Tri thức</label>
   <div className="xcn-news-search">
    <Search size={20} aria-hidden="true"/>
    <input id="news-keyword" type="search" value={query} onChange={event=>setQuery(event.target.value)}
     autoComplete="off" placeholder="Tìm bài viết, chủ đề hoặc công cụ..."/>
   </div>
  </div>
  <div className="xcn-news-categories" role="group" aria-label="Lọc bài viết theo chủ đề">
   {NEWS_CATEGORIES.map(value=><button key={value} type="button" className="xcn-news-category"
    aria-pressed={value===category} onClick={()=>choose(value)}>{value}</button>)}
  </div>
  <p className="xcn-news-count" role="status" aria-live="polite">{matching.length} bài viết đã xuất bản phù hợp</p>
  {matching.length>0
   ? <div className="xcn-news-grid">
    {matching.map(article=><article className="xcn-news-card" key={article.slug}>
     <span>{article.category}</span><h2><Link href={"/tin-tuc/"+article.slug}>{article.title}</Link></h2>
     <p>{article.summary}</p>
     <small>{article.author} · {new Intl.DateTimeFormat("vi-VN",{dateStyle:"medium"}).format(new Date(article.publishedAt))} · {article.readingMinutes} phút đọc</small>
     <Link href={"/tin-tuc/"+article.slug}>Đọc bài viết <ArrowRight size={17} aria-hidden="true"/></Link>
    </article>)}
   </div>
   : <div className="xcn-news-empty">
    <span className="xcn-news-empty-icon"><BookOpen size={29} aria-hidden="true"/></span>
    <h2>{articles.length===0?"Bài viết chuyên môn đang được biên soạn.":"Chưa có bài viết phù hợp."}</h2>
    <p>{articles.length===0
     ?"Chưa có bài viết chính thức được xuất bản. Bộ lọc và tìm kiếm đã sẵn sàng khi nội dung được duyệt."
     :"Hãy thử từ khóa hoặc chủ đề khác để tìm nội dung phù hợp."}</p>
    {(query||category!=="Tất cả")&&<button type="button" onClick={clear} className="xcn-news-clear"><X size={17} aria-hidden="true"/> Xóa bộ lọc</button>}
    <Link className="xcn-inline-link" href="/#he-sinh-thai">Khám phá công cụ đang có <ArrowRight size={17} aria-hidden="true"/></Link>
   </div>}
 </>;
}
