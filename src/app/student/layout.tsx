import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLiveMode } from "@/lib/supabase/config";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  if (isLiveMode()) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/dang-nhap?next=/student");
  }
  return <AppShell role="student">{children}</AppShell>;
}
