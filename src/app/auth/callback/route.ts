import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLiveMode, safeNextPath } from "@/lib/supabase/config";

export async function GET(request: NextRequest) {
  const base = request.nextUrl.origin;
  if (!isLiveMode()) return NextResponse.redirect(new URL("/student", base));
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  if (!code) return NextResponse.redirect(new URL("/dang-nhap?error=callback", base));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/dang-nhap?error=callback", base));
  return NextResponse.redirect(new URL(next, base));
}
