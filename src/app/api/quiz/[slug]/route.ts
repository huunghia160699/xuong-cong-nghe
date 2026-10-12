import { NextRequest, NextResponse } from "next/server";
import { isLiveMode } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!isLiveMode()) return NextResponse.json({ error: "Demo uses local quiz." }, { status: 404 });
  const { slug } = await context.params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
  const { data: quiz, error: quizError } = await supabase.from("quizzes")
    .select("id,title").eq("slug", slug).eq("status", "published").maybeSingle();
  if (quizError || !quiz) return NextResponse.json({ error: "Không tìm thấy bài quiz đã xuất bản." }, { status: 404 });

  const { data: questions, error: questionsError } = await supabase.from("questions")
    .select("id,prompt,position").eq("quiz_id", quiz.id).order("position");
  if (questionsError) return NextResponse.json({ error: "Không đọc được câu hỏi." }, { status: 500 });
  const questionIds = (questions ?? []).map((q) => q.id as string);
  if (!questionIds.length) return NextResponse.json({ error: "Bài quiz chưa có câu hỏi." }, { status: 404 });
  const { data: options, error: optionsError } = await supabase.from("question_options")
    .select("id,question_id,label,position").in("question_id", questionIds).order("position");
  if (optionsError) return NextResponse.json({ error: "Không đọc được các phương án." }, { status: 500 });
  const result = (questions ?? []).map((q) => ({
    id: q.id, prompt: q.prompt,
    options: (options ?? []).filter((o) => o.question_id === q.id).map((o) => ({ id: o.id, label: o.label })),
  }));
  return NextResponse.json({ title: quiz.title, questions: result }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
