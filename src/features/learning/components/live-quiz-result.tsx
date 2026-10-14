import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type QuestionResult = { id: string; question: string; selected: string | null; correctAnswer: string | null; explanation: string; isCorrect: boolean };
type Result = { attemptId: string; score: number; submittedAt: string; correct: number; total: number; questions: QuestionResult[] };
const uuid = /^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i;

export async function LiveQuizResult({ attemptId }: { attemptId: string }) {
  if (!uuid.test(attemptId)) notFound();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/student");
  const { data, error } = await supabase.rpc("get_quiz_result", { p_attempt_id: attemptId });
  if (error || !data) notFound();
  const result = data as Result;
  return <div className="w-full">
    <Badge>Đã chấm điểm tại server</Badge>
    <Card className="mt-5 p-7 sm:p-10">
      <h1 className="text-3xl font-bold">Kết quả bài trắc nghiệm</h1>
      <div className="mt-6 text-6xl font-bold">{(Number(result.score) / 10).toLocaleString("vi-VN", {maximumFractionDigits:1})}<span className="text-2xl text-zinc-400">/10</span></div>
      <p className="mt-4 text-sm text-zinc-600">{result.correct}/{result.total} câu đúng • {new Date(result.submittedAt).toLocaleString("vi-VN")}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/student/quiz" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Làm bài mới</Link>
        <Link href="/student" className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold">Về Dashboard</Link>
      </div>
    </Card>
    <h2 className="mt-9 text-xl font-semibold">Xem lại đáp án</h2>
    <div className="mt-5 space-y-4">{result.questions.map((question, index) => <Card className="p-6" key={question.id}>
      <div className="flex gap-3">
        {question.isCorrect ? <CheckCircle2 size={20} className="mt-1 shrink-0 text-emerald-700" /> : <XCircle size={20} className="mt-1 shrink-0 text-red-600" />}
        <div><h3 className="font-semibold">Câu {index + 1}. {question.question}</h3>
          <p className="mt-3 text-sm text-zinc-600">Bạn chọn: {question.selected ?? "Chưa trả lời"}</p>
          <p className="mt-2 text-sm text-emerald-700">Đáp án đúng: {question.correctAnswer ?? "Chưa thiết lập"}</p>
          <p className="mt-3 rounded-lg bg-zinc-50 p-4 text-sm leading-7 text-zinc-700">{question.explanation}</p>
        </div>
      </div>
    </Card>)}</div>
  </div>;
}
