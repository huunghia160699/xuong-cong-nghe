"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLiveMode } from "@/lib/supabase/config";

async function requireAdmin() {
  if (!isLiveMode()) throw new Error("Chức năng này cần Supabase live mode.");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin/khoa-hoc");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/khong-co-quyen");
  return { supabase, user };
}

export async function createCourseAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim().slice(0, 150);
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const category = String(formData.get("category") ?? "").trim().slice(0, 80);
  if (title.length < 3 || category.length < 2 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) {
    redirect("/admin/khoa-hoc?error=invalid");
  }
  const { error } = await supabase.from("courses").insert({
    title, slug, category, author_id: user.id, status: "draft",
    excerpt: "", description: "", level: "Cơ bản",
  });
  if (error) redirect("/admin/khoa-hoc?error=failed");
  revalidatePath("/admin/khoa-hoc");
  redirect("/admin/khoa-hoc?notice=created");
}

export async function setCourseStatusAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("course_id") ?? "");
  const nextStatus = String(formData.get("status") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["draft","published","archived"].includes(nextStatus)) {
    redirect("/admin/khoa-hoc?error=invalid");
  }
  const { error } = await supabase.from("courses").update({
    status: nextStatus,
    published_at: nextStatus === "published" ? new Date().toISOString() : null,
  }).eq("id", id);
  if (error) redirect("/admin/khoa-hoc?error=failed");
  revalidatePath("/admin/khoa-hoc");
  revalidatePath("/");
  redirect("/admin/khoa-hoc?notice=updated");
}
