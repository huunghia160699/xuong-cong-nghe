"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLiveMode, safeNextPath } from "@/lib/supabase/config";

const loginError = (reason: string, next = "/student") =>
  `/dang-nhap?error=${reason}&next=${encodeURIComponent(safeNextPath(next))}`;

export async function signInAction(formData: FormData) {
  if (!isLiveMode()) redirect("/student");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));
  if (!email.includes("@") || !password) redirect(loginError("invalid", next));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(loginError("invalid", next));
  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUpAction(formData: FormData) {
  if (!isLiveMode()) redirect("/student");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("display_name") ?? "").trim().slice(0, 100);
  if (!email.includes("@") || password.length < 8 || displayName.length < 2) redirect("/dang-ky?error=invalid");
  const supabase = await createSupabaseServerClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${appUrl.replace(/\/$/, "")}/auth/callback?next=/student`,
    },
  });
  if (error) redirect("/dang-ky?error=failed");
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/student");
  }
  redirect("/dang-nhap?notice=check-email");
}

export async function requestPasswordResetAction(formData: FormData) {
  if (!isLiveMode()) redirect("/dang-nhap");
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) redirect("/quen-mat-khau?error=invalid");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const supabase = await createSupabaseServerClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl.replace(/\/$/, "")}/auth/callback?next=/doi-mat-khau`,
  });
  // Do not reveal whether this email exists.
  redirect("/quen-mat-khau?notice=sent");
}

export async function changePasswordAction(formData: FormData) {
  if (!isLiveMode()) redirect("/student");
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (password.length < 8 || password !== confirmation) redirect("/doi-mat-khau?error=invalid");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?error=session");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/doi-mat-khau?error=failed");
  redirect("/student");
}

export async function signOutAction() {
  if (isLiveMode()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}
