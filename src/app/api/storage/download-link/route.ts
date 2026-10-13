import { NextRequest, NextResponse } from "next/server";
import { isLiveMode } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signPrivateR2Request, StorageNotConfiguredError } from "@/lib/storage/r2-config";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isLiveMode()) return NextResponse.json({ error: "Chế độ demo không sử dụng R2." }, { status: 404 });
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Origin không hợp lệ." }, { status: 403 });
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON không hợp lệ." }, { status: 400 }); }
  const key = body && typeof body === "object" && "key" in body ? (body as { key: unknown }).key : null;
  if (typeof key !== "string" || key.length > 250 || !key.startsWith("private/admin/") ||
    key.split("/").some((segment) => segment === "." || segment === ".." || !segment)) {
    return NextResponse.json({ error: "Khóa tệp không hợp lệ." }, { status: 400 });
  }
  try {
    const url = signPrivateR2Request({ method: "GET", key, expiresIn: 120 });
    return NextResponse.json({ url, expiresIn: 120 }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (reason) {
    if (reason instanceof StorageNotConfiguredError) return NextResponse.json({ error: "Cloudflare R2 chưa được cấu hình." }, { status: 503 });
    return NextResponse.json({ error: "Không thể tạo liên kết tải tệp." }, { status: 500 });
  }
}
