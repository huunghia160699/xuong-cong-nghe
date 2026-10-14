import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findPresentationLesson, presentationClassHasLesson, presentationClasses } from "@/features/presentations/catalog";
import { PresentationPlayer } from "@/features/presentations/components/player";
import "@/features/presentations/presentation.css";

export function generateStaticParams() {
  return ["buoi-01-file-explorer","layout-gallery"].map(lessonId=>({lessonId}));
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
  return <PresentationPlayer lesson={entry.lesson} courseTitle={entry.course.title} className={group?.name}/>;
}
