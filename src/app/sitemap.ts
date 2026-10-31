import type {MetadataRoute} from "next";
import {getPublishedArticles} from "@/config/public-articles";

export default function sitemap():MetadataRoute.Sitemap{
 const base=process.env.NEXT_PUBLIC_APP_URL??"http://localhost:3000";
 const paths=["/","/gioi-thieu","/bang-gia","/tin-tuc","/lien-he","/khoa-hoc","/cong-cu","/cong-cu/trinh-chieu"];
 return [
  ...paths.map(path=>({
   url:new URL(path,base).toString(),
   changeFrequency:"monthly" as const,
   priority:path==="/"?1:path==="/khoa-hoc"?0.8:0.65
  })),
  ...getPublishedArticles().map(article=>({
   url:new URL("/tin-tuc/"+article.slug,base).toString(),
   lastModified:new Date(article.updatedAt),
   changeFrequency:"monthly" as const,priority:0.7
  }))
 ];
}
