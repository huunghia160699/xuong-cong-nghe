import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {ArrowLeft,ArrowRight,Clock,CalendarDays} from "lucide-react";
import {getPublishedArticle,getPublishedArticles} from "@/config/public-articles";

export const dynamicParams=false;
export function generateStaticParams(){return getPublishedArticles(new Date("2100-01-01T00:00:00Z")).map(article=>({slug:article.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const article=getPublishedArticle(slug);
 if(!article)return {title:"Bài viết không tồn tại",robots:{index:false}};
 return {title:article.title,description:article.summary,
  alternates:{canonical:"/tin-tuc/"+slug},
  openGraph:{type:"article",title:article.title,description:article.summary,url:"/tin-tuc/"+slug,publishedTime:article.publishedAt,modifiedTime:article.updatedAt,authors:[article.author]}};
}
export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const article=getPublishedArticle(slug);
 if(!article)notFound();
 const jsonLd={
  "@context":"https://schema.org","@type":"Article",headline:article.title,
  description:article.summary,datePublished:article.publishedAt,
  dateModified:article.updatedAt,author:{"@type":"Organization",name:article.author},
  publisher:{"@type":"Organization",name:"Xưởng Công Nghệ"}
 };
 return <main className="xcn-marketing-main">
  <article>
   <header className="xcn-marketing-page-hero xcn-news-hero"><div className="xcn-container">
    <Link className="xcn-article-back" href="/tin-tuc"><ArrowLeft size={17} aria-hidden="true"/> Tin tức & Tri thức</Link>
    <p className="xcn-kicker">{article.category} / Xưởng Công Nghệ</p>
    <h1>{article.title}</h1><p>{article.summary}</p>
    <div className="xcn-article-meta"><span>{article.author}</span><span><CalendarDays size={15} aria-hidden="true"/> {new Intl.DateTimeFormat("vi-VN",{dateStyle:"long"}).format(new Date(article.publishedAt))}</span><span><Clock size={15} aria-hidden="true"/> {article.readingMinutes} phút đọc</span></div>
   </div></header>
   <div className="xcn-container xcn-article-layout">
    <nav className="xcn-article-toc" aria-label="Các phần trong bài"><strong>Trong bài viết</strong>
     <ol>{article.sections.map((section,index)=><li key={section.heading}><a href={"#phan-"+(index+1)}>{section.heading}</a></li>)}</ol>
    </nav>
    <div className="xcn-article-body">{article.sections.map((section,index)=><section key={section.heading} id={"phan-"+(index+1)}>
     <h2>{section.heading}</h2>{section.paragraphs.map((paragraph,i)=><p key={i}>{paragraph}</p>)}
     {section.steps&&<ol>{section.steps.map(step=><li key={step}>{step}</li>)}</ol>}
    </section>)}
    <div className="xcn-article-end"><p>Nội dung do Xưởng Công Nghệ biên soạn dựa trên chức năng hiện có và lộ trình phát triển. Các công cụ có thể được cập nhật.</p>
     <Link href="/tin-tuc">Trở lại thư viện bài viết <ArrowRight size={17} aria-hidden="true"/></Link></div></div>
   </div>
  </article>
 </main>;
}
