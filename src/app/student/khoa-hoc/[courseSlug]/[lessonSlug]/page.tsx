import { notFound } from "next/navigation";
import { getExcelLesson } from "@/features/learning/content";
import { LessonWorkspace } from "@/features/learning/components/lesson-workspace";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const lesson = courseSlug === "excel-can-ban" ? getExcelLesson(lessonSlug) : undefined;
  if (!lesson) notFound();
  return <LessonWorkspace lesson={lesson} />;
}
