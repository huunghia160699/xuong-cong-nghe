import { redirect } from "next/navigation";
import { DemoDashboard } from "@/features/learning/components/demo-dashboard";
import { LiveDashboard } from "@/features/learning/components/live-dashboard";
import { getExcelProgress } from "@/features/learning/live-service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLiveMode } from "@/lib/supabase/config";

export default async function StudentDashboard() {
  if (!isLiveMode()) return <DemoDashboard />;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/student");
  const [{ data: profile }, { completed }, { data: attempts, error }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
    getExcelProgress(user.id),
    supabase.from("quiz_attempts").select("id,score,submitted_at").eq("user_id", user.id)
      .not("submitted_at", "is", null).order("submitted_at", { ascending: false }).limit(30),
  ]);
  if (error) throw new Error("Không thể đọc kết quả quiz. Hãy kiểm tra migration của Supabase.");
  return <LiveDashboard
    name={profile?.display_name || user.email?.split("@")[0] || "Học viên"}
    completed={completed} attempts={attempts ?? []}
  />;
}
