import { createSupabaseServerClient } from "@/lib/supabase/server";
import { excelLessons } from "@/features/learning/content";

// Stable ID used by the development seed. Production catalog will resolve via slug.
export const EXCEL_COURSE_ID = "10000000-0000-0000-0000-000000000001";

export async function getExcelProgress(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: chapters, error: chapterError } = await supabase.from("chapters")
    .select("id").eq("course_id", EXCEL_COURSE_ID);
  if (chapterError) throw new Error("Không đọc được danh sách chương.");
  const ids = (chapters ?? []).map((chapter) => chapter.id as string);
  if (!ids.length) return { completed: {} as Record<string, string>, lessonIds: {} as Record<string, string> };
  const { data: lessons, error: lessonError } = await supabase.from("lessons")
    .select("id,slug").in("chapter_id", ids).eq("status", "published");
  if (lessonError) throw new Error("Không đọc được danh sách bài học.");

  const rows = (lessons ?? []).filter((row) => excelLessons.some((item) => item.slug === row.slug));
  const lessonIds = Object.fromEntries(rows.map((row) => [row.slug as string, row.id as string]));
  const lessonUuidList = rows.map((row) => row.id as string);
  if (!lessonUuidList.length) return { completed: {}, lessonIds };
  const { data: progress, error: progressError } = await supabase.from("lesson_progress")
    .select("lesson_id,completed,completed_at").eq("user_id", userId).in("lesson_id", lessonUuidList);
  if (progressError) throw new Error("Không đọc được tiến độ học.");

  const slugById = Object.fromEntries(rows.map((row) => [row.id, row.slug]));
  const completed: Record<string, string> = {};
  for (const row of progress ?? []) {
    const slug = slugById[row.lesson_id as string];
    if (slug && row.completed) completed[slug] = (row.completed_at as string | null) ?? new Date(0).toISOString();
  }
  return { completed, lessonIds };
}
