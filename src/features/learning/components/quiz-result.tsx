"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { quizQuestions } from "@/data/mock";
import { useDemoLearning } from "@/features/learning/demo-store";

export function QuizResult({ attemptId }: { attemptId: string }) {
  const { state, ready, clearQuizDraft } = useDemoLearning();
  const attempt = state.attempts.find((item) => item.id === attemptId);
  if (!ready) return <div className="mx-auto max-w-4xl p-8 text-sm text-zinc-500">Đang tải kết quả...</div>;
  if (!attempt) return <Card className="mx-auto max-w-3xl p-8">
    <h1 className="text-2xl font-semibold">Không tìm thấy kết quả</h1>
    <p className="mt-3 text-sm leading-6 text-zinc-500">Kết quả học thử được lưu trên trình duyệt đã nộp bài, không đồng bộ giữa thiết bị.</p>
    <Link href="/student/quiz" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={16} /> Về bài trắc nghiệm</Link>
  </Card>;

  return <div className="mx-auto max-w-4xl">
    <Link href="/student" className="inline-flex items-center gap-2 text-sm text-zinc-500"><ArrowLeft size={16} /> Dashboard học viên</Link>
    <Card className="mt-7 p-7 sm:p-10">
      <Badge>Trắc nghiệm Excel • Kết quả học thử</Badge>
      <h1 className="mt-5 text-3xl font-bold">Kết quả bài làm</h1>
      <div className="mt-7 flex flex-wrap items-end gap-6 border-b border-zinc-200 pb-8">
        <div className="text-6xl font-bold tracking-tight">{(attempt.score / 10).toLocaleString("vi-VN", {maximumFractionDigits: 1})}<span className="text-2xl text-zinc-400">/10</span></div>
        <div className="pb-1 text-sm leading-7 text-zinc-600">{attempt.correct}/{attempt.total} câu đúng<br />{new Date(attempt.submittedAt).toLocaleString("vi-VN")}</div>
      </div>
      <p className="mt-5 text-sm leading-6 text-zinc-600">Xem lại từng đáp án và giải thích để củng cố kiến thức. Đây là điểm thử nghiệm trên thiết bị, chưa phải kết quả của tài khoản học viên.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/student/quiz" onClick={() => clearQuizDraft()} className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white"><RotateCcw size={16} /> Làm bài mới</Link>
        <Link href="/student" className="inline-flex h-11 items-center gap-2 rounded-full border border-zinc-300 px-5 text-sm font-semibold">Về Dashboard <ArrowRight size={16} /></Link>
      </div>
    </Card>
    <h2 className="mt-10 text-xl font-semibold">Xem lại câu hỏi</h2>
    <div className="mt-5 space-y-4">
      {quizQuestions.map((q, i) => {
        const answer = attempt.answers[String(q.id)];
        const correct = answer === q.correctIndex;
        return <Card className="p-6" key={q.id}>
          <div className="flex items-start gap-3">
            {correct ? <CheckCircle2 size={20} className="mt-1 shrink-0 text-emerald-600" /> : <XCircle size={20} className="mt-1 shrink-0 text-red-600" />}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold">Câu {i + 1}. {q.question}</h3>
              <p className="mt-3 text-sm text-zinc-600">Bạn chọn: {answer === undefined ? "Chưa trả lời" : q.options[answer] ?? "Không hợp lệ"}</p>
              <p className="mt-1 text-sm font-medium text-emerald-700">Đáp án đúng: {q.options[q.correctIndex]}</p>
              <p className="mt-3 rounded-lg bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">{q.explanation}</p>
            </div>
          </div>
        </Card>;
      })}
    </div>
  </div>;
}
