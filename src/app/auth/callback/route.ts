import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLiveMode, safeNextPath } from "@/lib/supabase/config";
import { postLoginDestination } from "@/features/auth/post-login";

export async function GET(request: NextRequest) {
  const base = request.nextUrl.origin;
  if (!isLiveMode()) return NextResponse.redirect(new URL("/student", base));
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNextPath(request.nextUrl.searchParams.get("next"), "");
  if (!code) return NextResponse.redirect(new URL("/dang-nhap?error=callback", base));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/dang-nhap?error=callback", base));
  // Honor explicit safe destinations (e.g. password reset and sign-up confirmation).
  if (next) return NextResponse.redirect(new URL(next, base));
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();
  if (sessionError || !user) return NextResponse.redirect(new URL("/dang-nhap?error=session", base));
  const { data: profile, error: profileError } = await supabase.from("profiles")
    .select("role").eq("id", user.id).single();
  const destination = profileError ? null : postLoginDestination(profile?.role, null);
  if (!destination) return NextResponse.redirect(new URL("/dang-nhap?error=profile", base));
  return NextResponse.redirect(new URL(destination, base));
}
