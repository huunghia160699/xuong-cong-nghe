import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { allPresentationLessons, canonicalPresentationLessonId, findPresentationLesson, legacyPresentationLessonIds } from "@/features/presentations/catalog";
import { PresentationPlayer } from "@/features/presentations/components/player";
import "@/features/presentations/presentation.css";
import "@/features/presentations/word-workspace.css";
import "@/features/presentations/word-purpose.css";
import "@/features/presentations/word-live-lab.css";

export function generateStaticParams() {
  return [...new Set([...allPresentationLessons.map(record=>record.lesson.id),...Object.keys(legacyPresentationLessonIds)])].map(lessonId=>({lessonId}));
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
  // Old bookmarked ?class=hl-26-27 values still prefill the editable class prompt.
  const rawClass=typeof search.class==="string" ? search.class.slice(0,40) : "";
  const initialClassName=rawClass.toLowerCase()==="hl-26-27" ? "HL.26-27" : rawClass;
  const canonicalId=canonicalPresentationLessonId(lessonId);
  if(canonicalId!==lessonId) {
    const query=rawClass ? "?class="+encodeURIComponent(rawClass) : "";
    permanentRedirect("/cong-cu/trinh-chieu/"+canonicalId+query);
  }
  return <PresentationPlayer lesson={entry.lesson} courseTitle={entry.course.title} initialClassName={initialClassName}/>;
}
