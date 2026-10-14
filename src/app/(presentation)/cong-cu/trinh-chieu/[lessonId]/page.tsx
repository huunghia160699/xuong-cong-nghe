import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { canonicalPresentationLessonId, findPresentationLesson, legacyPresentationLessonIds, presentationClassHasLesson, presentationClasses } from "@/features/presentations/catalog";
import { PresentationPlayer } from "@/features/presentations/components/player";
import "@/features/presentations/presentation.css";

export function generateStaticParams() {
  return ["quan-ly-tep-va-thu-muc","layout-gallery",...Object.keys(legacyPresentationLessonIds)].map(lessonId=>({lessonId}));
}

export async function generateMetadata({params}: {params:Promise<{lessonId:string}>}):Promise<Metadata> {
  const {lessonId}=await params;
  const entry=findPresentationLesson(lessonId);
  return {title: entry ? entry.lesson.title+" · Trình chiếu" : "Bài giảng không tồn tại"};
}

export default async function LessonPresentation({
  params,searchParams,
}:{
  params:Promise<{lessonId:string}>;
  searchParams:Promise<{class?:string}>;
}) {
  const {lessonId}=await params;
  const search=await searchParams;
  const entry=findPresentationLesson(lessonId);
  if(!entry) notFound();
  const group=search.class ? presentationClasses.find(item=>
    item.id===search.class && presentationClassHasLesson(item.id,entry.course.id,entry.lesson.id)) : null;
  const canonicalId=canonicalPresentationLessonId(lessonId);
  if(canonicalId!==lessonId) {
    const query=group ? "?class="+encodeURIComponent(group.id) : "";
    permanentRedirect("/cong-cu/trinh-chieu/"+canonicalId+query);
  }
  return <PresentationPlayer lesson={entry.lesson} courseTitle={entry.course.title} className={group?.name}/>;
}
