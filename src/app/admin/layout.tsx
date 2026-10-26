import { redirect } from "next/navigation";
import "./admin.css";
import { AppShell } from "@/components/app-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLiveMode } from "@/lib/supabase/config";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (isLiveMode()) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/dang-nhap?next=/admin");
    const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (error || profile?.role !== "admin") redirect("/khong-co-quyen");
  }
  return <AppShell role="admin">{children}</AppShell>;
}
