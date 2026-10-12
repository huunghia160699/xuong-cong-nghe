import { NextRequest, NextResponse } from "next/server";
import { isLiveMode } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!isLiveMode()) return NextResponse.json({ error: "Demo uses local scoring." }, { status: 404 });
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Origin không hợp lệ." }, { status: 403 });
  const { slug } = await context.params;
  if (!/^[a-z0-9-]{1,100}$/.test(slug)) return NextResponse.json({ error: "Quiz không hợp lệ." }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Phiên đăng nhập hết hạn." }, { status: 401 });
  let payload: unknown;
  try { payload = await request.json(); } catch {
    return NextResponse.json({ error: "Dữ liệu nộp bài không hợp lệ." }, { status: 400 });
  }
  if (!payload || typeof payload !== "object" || !("answers" in payload)) {
    return NextResponse.json({ error: "Thiếu đáp án." }, { status: 400 });
  }
  const answers = (payload as { answers: unknown }).answers;
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return NextResponse.json({ error: "Đáp án không hợp lệ." }, { status: 400 });
  }
  const entries = Object.entries(answers);
  if (entries.length > 100 || entries.some(([question, option]) => !uuidPattern.test(question) || typeof option !== "string" || !uuidPattern.test(option))) {
    return NextResponse.json({ error: "Mã câu hỏi hoặc phương án không hợp lệ." }, { status: 400 });
  }
  const { data, error } = await supabase.rpc("submit_quiz", { p_quiz_slug: slug, p_answers: answers });
  if (error || !data || typeof data !== "object" || !("attemptId" in data)) {
    return NextResponse.json({ error: "Không thể chấm bài. Kiểm tra phiên đăng nhập và migration." }, { status: 422 });
  }
  return NextResponse.json({ attemptId: (data as { attemptId: string }).attemptId }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
