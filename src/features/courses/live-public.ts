import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PublicCourseCard = {
  slug: string;
  category: string;
  title: string;
  lessons: number;
  level: string;
  color: string;
  accent: string;
};

export async function getPublishedCourses(): Promise<PublicCourseCard[]> {
  const supabase = await createSupabaseServerClient();
  const { data: courses, error } = await supabase.from("courses")
    .select("id,slug,title,category,level").eq("status", "published").order("created_at", { ascending: false }).limit(50);
  if (error) throw new Error("Không tải được danh sách khóa học.");
  if (!courses?.length) return [];

  const { data: chapters, error: chapterError } = await supabase.from("chapters")
    .select("id,course_id").in("course_id", courses.map((c) => c.id));
  if (chapterError) throw new Error("Không tải được chương học.");
  const chapterIds = (chapters ?? []).map((chapter) => chapter.id);
  const { data: lessons, error: lessonError } = chapterIds.length ?
    await supabase.from("lessons").select("chapter_id").eq("status", "published").in("chapter_id", chapterIds) :
    { data: [], error: null };
  if (lessonError) throw new Error("Không tải được bài học.");

  const chapterToCourse: Record<string,string> = Object.fromEntries((chapters ?? []).map((c) => [c.id, c.course_id]));
  const lessonCounts: Record<string,number> = {};
  (lessons ?? []).forEach((lesson) => {
    const courseId = chapterToCourse[lesson.chapter_id as string];
    if (courseId) lessonCounts[courseId] = (lessonCounts[courseId] ?? 0) + 1;
  });

  return courses.map((course) => ({
    slug: course.slug, title: course.title, category: course.category,
    level: course.level, lessons: lessonCounts[course.id] ?? 0,
    color: course.category === "Excel" ? "bg-[#dff1df]" : course.category === "AI" ? "bg-[#ece7fb]" : "bg-zinc-900",
    accent: course.category === "Excel" || course.category === "AI" ? "text-zinc-900" : "text-lime",
  }));
}

export async function getPublishedCourse(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data: course, error } = await supabase.from("courses")
    .select("id,slug,title,description,excerpt,level,category")
    .eq("slug", slug).eq("status", "published").maybeSingle();
  if (error || !course) return null;
  const { data: chapters, error: chapterError } = await supabase.from("chapters")
    .select("id,title,position").eq("course_id", course.id).order("position");
  if (chapterError) throw new Error("Không đọc được chương học.");

  const ids = (chapters ?? []).map((chapter) => chapter.id);
  const { data: lessons, error: lessonError } = ids.length ? await supabase.from("lessons")
    .select("id,chapter_id,slug,title,summary,duration_minutes,position")
    .in("chapter_id", ids).eq("status", "published").order("position") : { data: [], error: null };
  if (lessonError) throw new Error("Không đọc được bài học.");
  return { course, chapters: chapters ?? [], lessons: lessons ?? [] };
}
