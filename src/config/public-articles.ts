/** Public news registry: only real, explicitly published editorial articles.
 * No article/CMS has been approved yet, so the registry starts empty.
 * Future publishing must preserve review, stable slugs and author attribution. */
export const NEWS_CATEGORIES=[
 "Tất cả","Hướng dẫn sử dụng","Tin học & ứng dụng",
 "Giáo dục số","AI trong dạy học","Cập nhật sản phẩm","STEM & dự án"
] as const;
export type NewsCategory=Exclude<(typeof NEWS_CATEGORIES)[number],"Tất cả">;
export type PublicArticle={
 slug:string;title:string;summary:string;category:NewsCategory;
 author:string;cover?:string;readingMinutes:number;
 publishedAt:string;status:"draft"|"published";
 tags:readonly string[];
};
const EDITORIAL_ARTICLES:readonly PublicArticle[]=[];
export function getPublishedArticles(now=new Date()):PublicArticle[]{
 return EDITORIAL_ARTICLES.filter(article=>
  article.status==="published" && !!article.publishedAt &&
  Number.isFinite(Date.parse(article.publishedAt)) &&
  Date.parse(article.publishedAt)<=now.getTime()
 ).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
}
export function resolveNewsCategory(value:string|null):typeof NEWS_CATEGORIES[number]{
 return NEWS_CATEGORIES.includes(value as typeof NEWS_CATEGORIES[number])
  ? value as typeof NEWS_CATEGORIES[number]:"Tất cả";
}
