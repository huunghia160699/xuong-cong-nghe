import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabasePublicConfig, isLiveMode, safeNextPath } from "@/lib/supabase/config";
import type { SupabaseCookieToSet } from "@/lib/supabase/cookie-types";

export async function middleware(request: NextRequest) {
  if (!isLiveMode()) return NextResponse.next({ request });

  let config;
  try {
    config = getSupabasePublicConfig();
  } catch {
    return new NextResponse("Chưa cấu hình Supabase. Vui lòng kiểm tra biến môi trường của máy chủ.", { status: 503 });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(items: SupabaseCookieToSet[]) {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  function redirected(destination: string) {
    const target = request.nextUrl.clone();
    target.pathname = destination.split("?")[0];
    target.search = destination.includes("?") ? destination.slice(destination.indexOf("?")) : "";
    const out = NextResponse.redirect(target);
    response.cookies.getAll().forEach((cookie) => out.cookies.set(cookie));
    return out;
  }

  if (!user || error) {
    if (path === "/doi-mat-khau") return redirected("/dang-nhap?error=session");
    return redirected(`/dang-nhap?next=${encodeURIComponent(safeNextPath(path + request.nextUrl.search))}`);
  }

  // Check the server-owned role even for direct URLs, not just UI CTA links.
  const {data:profile,error:profileError}=await supabase.from("profiles")
    .select("role").eq("id",user.id).single();
  if(profileError||!["admin","student","teacher"].includes(profile?.role??""))
    return redirected("/khong-co-quyen");
  if(path.startsWith("/admin")&&profile?.role!=="admin")
    return redirected("/khong-co-quyen");

  return response;
}

// The presentation lesson listing is public; only the actual lesson player is gated.
export const config = { matcher: [
 "/student/:path*", "/admin/:path*", "/doi-mat-khau",
 "/cong-cu/mo-phong-word/:path*", "/cong-cu/trinh-chieu/:lessonId"
] };
