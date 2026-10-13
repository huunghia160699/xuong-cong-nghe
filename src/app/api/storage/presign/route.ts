import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isLiveMode } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signPrivateR2Request, StorageNotConfiguredError } from "@/lib/storage/r2-config";

export const runtime = "nodejs";

/**
 * Admin-only trial uploader. Signed URLs expire in 5 minutes.
 * Max size is validated by the UI/API request but is NOT enforced by R2 at PUT;
 * do not offer this as a general learner upload service until a file-finalization,
 * size/format verification and quota system are implemented.
 */
const allowedTypes: Record<string, string> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
};
const MAX_SIZE = 25 * 1024 * 1024;
const safeHeaders = { "Cache-Control": "private, no-store" };

export async function POST(request: NextRequest) {
  if (!isLiveMode()) return NextResponse.json({ error: "Chỉ hoạt động trong chế độ Supabase." }, { status: 404 });
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Origin không hợp lệ." }, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 4096) return NextResponse.json({ error: "Yêu cầu quá lớn." }, { status: 413 });

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (!user || error) return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Chỉ quản trị viên có quyền tải tệp lên kho." }, { status: 403 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON không hợp lệ." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  const { contentType, size } = body as { contentType?: unknown; size?: unknown };
  if (typeof contentType !== "string" || !Object.hasOwn(allowedTypes, contentType)) return NextResponse.json({ error: "Định dạng tệp chưa được hỗ trợ." }, { status: 400 });
  if (typeof size !== "number" || !Number.isSafeInteger(size) || size < 1 || size > MAX_SIZE) return NextResponse.json({ error: "Tệp vượt giới hạn thử nghiệm 25 MB." }, { status: 400 });

  const key = `private/admin/${user.id}/${randomUUID()}.${allowedTypes[contentType]}`;
  try {
    const url = signPrivateR2Request({ method: "PUT", key, contentType, expiresIn: 300 });
    return NextResponse.json({ url, key, method: "PUT", headers: { "Content-Type": contentType }, expiresIn: 300 }, { headers: safeHeaders });
  } catch (reason) {
    if (reason instanceof StorageNotConfiguredError) return NextResponse.json({ error: "Cloudflare R2 chưa được cấu hình trong Vercel." }, { status: 503 });
    return NextResponse.json({ error: "Không thể tạo liên kết upload." }, { status: 500 });
  }
}
