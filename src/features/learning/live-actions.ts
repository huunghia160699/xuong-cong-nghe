"use server";

import { revalidatePath } from "next/cache";
import { isLiveMode } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getExcelLesson } from "@/features/learning/content";
import { getExcelProgress } from "@/features/learning/live-service";

export async function markLessonCompleteAction(slug: string): Promise<{ ok: boolean; error?: string }> {
  if (!isLiveMode() || !getExcelLesson(slug)) return { ok: false, error: "Bài học không hợp lệ." };
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) return { ok: false, error: "Phiên đăng nhập đã hết hạn." };

  const { lessonIds } = await getExcelProgress(user.id);
  const lessonId = lessonIds[slug];
  if (!lessonId) return { ok: false, error: "Bài học chưa được xuất bản trong cơ sở dữ liệu." };

  const { error } = await supabase.from("lesson_progress").upsert({
    user_id: user.id, lesson_id: lessonId, completed: true,
    progress_percent: 100, completed_at: new Date().toISOString(),
    last_viewed_at: new Date().toISOString(),
  }, { onConflict: "user_id,lesson_id" });
  if (error) return { ok: false, error: "Không lưu được tiến độ. Kiểm tra chính sách RLS." };

  revalidatePath("/student");
  revalidatePath(`/student/khoa-hoc/excel-can-ban/${slug}`);
  return { ok: true };
}
