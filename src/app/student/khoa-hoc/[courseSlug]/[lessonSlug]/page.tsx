import { notFound, redirect } from "next/navigation";
import { getExcelLesson } from "@/features/learning/content";
import { LessonWorkspace } from "@/features/learning/components/lesson-workspace";
import { LiveLessonWorkspace } from "@/features/learning/components/live-lesson-workspace";
import { getExcelProgress } from "@/features/learning/live-service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLiveMode } from "@/lib/supabase/config";

export default async function LessonPage({params}:{
  params: Promise<{ courseSlug:string; lessonSlug:string }>;
}) {
  const {courseSlug,lessonSlug}=await params;
  const lesson=courseSlug==="excel-can-ban" ? getExcelLesson(lessonSlug) : undefined;
  if(!lesson) notFound();
  if(!isLiveMode()) return <LessonWorkspace lesson={lesson} />;
  const supabase=await createSupabaseServerClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/dang-nhap?next=/student");
  const {completed,lessonIds}=await getExcelProgress(user.id);
  if(!lessonIds[lesson.slug]) notFound();
  return <LiveLessonWorkspace lesson={lesson} completed={completed} />;
}
