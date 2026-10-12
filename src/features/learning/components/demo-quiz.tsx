"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { quizQuestions } from "@/data/mock";
import { useDemoLearning } from "@/features/learning/demo-store";
import { cn } from "@/lib/utils";

export default function DemoQuiz() {
  const router = useRouter();
  const { state, ready, setQuizAnswer, submitQuiz } = useDemoLearning();
  const [index, setIndex] = useState(0);
  const [flagged, setFlagged] = useState<number[]>([]);
  const [error, setError] = useState("");
  const question = quizQuestions[index];
  const selected = state.quizDraft[String(question.id)];
  const answered = quizQuestions.filter((item) => state.quizDraft[String(item.id)] !== undefined).length;
  const remaining = quizQuestions.length - answered;

  function finish() {
    if (remaining > 0 && !window.confirm(`Còn ${remaining} câu chưa trả lời. Bạn vẫn muốn nộp bài?`)) return;
    const attemptId = submitQuiz();
    if (!attemptId) {
      setError("Không thể lưu bài làm trên thiết bị. Hãy kiểm tra dung lượng lưu trữ hoặc quyền trình duyệt.");
      return;
    }
    router.push(`/student/quiz/ket-qua/${attemptId}`);
  }

  return <div className="mx-auto max-w-5xl">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link href="/student" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-ink"><ArrowLeft size={16} /> Trở về Dashboard</Link>
      <div className="flex items-center gap-2"><Badge>Excel căn bản</Badge><Badge>Chế độ học thử</Badge></div>
    </div>
    <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-zinc-200">
      <div className="h-full bg-ink transition-all" style={{ width: `${answered / quizQuestions.length * 100}%` }} />
    </div>
    <div className="mt-3 flex justify-between gap-4 text-xs text-zinc-500">
      <span>Câu {index + 1}/{quizQuestions.length}</span>
      <span>Đã trả lời {answered}/{quizQuestions.length}</span>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <Card className="p-6 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-zinc-500">Câu hỏi {String(index + 1).padStart(2, "0")}</p>
            <h1 className="mt-5 text-2xl font-semibold leading-snug sm:text-3xl">{question.question}</h1>
          </div>
          <button type="button" aria-label="Đánh dấu để xem lại" aria-pressed={flagged.includes(question.id)}
            onClick={() => setFlagged((prev) => prev.includes(question.id) ? prev.filter((id) => id !== question.id) : [...prev, question.id])}
            className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg border", flagged.includes(question.id) ? "border-amber-400 bg-amber-50" : "border-zinc-200 hover:bg-zinc-50")}>
            <Flag size={18} />
          </button>
        </div>
        <fieldset className="mt-8 grid gap-3" disabled={!ready}>
          <legend className="sr-only">Chọn một phương án</legend>
          {question.options.map((option, oi) => <button type="button" key={oi} aria-pressed={selected === oi}
            onClick={() => setQuizAnswer(question.id, oi)}
            className={cn("flex w-full items-center gap-4 rounded-xl border p-4 text-left text-sm transition sm:p-5", selected === oi ? "border-ink bg-zinc-100 ring-1 ring-ink" : "border-zinc-200 hover:border-zinc-400")}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-current text-xs font-bold">{String.fromCharCode(65 + oi)}</span>
            <span className="font-medium">{option}</span>
          </button>)}
        </fieldset>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-6">
          <button type="button" disabled={!ready || selected === undefined} onClick={() => setQuizAnswer(question.id, null)}
            className="text-sm font-medium text-zinc-500 hover:text-ink disabled:opacity-40">Xóa lựa chọn</button>
          <div className="flex gap-2">
            <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}
              className="h-11 rounded-full border border-zinc-300 px-4 text-sm disabled:opacity-30">Câu trước</button>
            {index < quizQuestions.length - 1 ?
              <button type="button" onClick={() => setIndex(index + 1)} className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm text-white">
                Câu tiếp <ArrowRight size={16} /></button> :
              <button type="button" disabled={!ready} onClick={finish} className="h-11 rounded-full bg-ink px-5 text-sm text-white disabled:opacity-40">Nộp bài</button>}
          </div>
        </div>
      </Card>
      <aside>
        <Card className="p-5 lg:sticky lg:top-28">
          <h2 className="text-sm font-semibold">Danh sách câu hỏi</h2>
          <p className="mt-2 text-xs leading-5 text-zinc-500">Chọn số câu để quay lại và chỉnh sửa đáp án trước khi nộp.</p>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {quizQuestions.map((item, i) => <button key={item.id} type="button" aria-label={`Đi đến câu ${i + 1}`} aria-current={index === i ? "step" : undefined}
              onClick={() => setIndex(i)}
              className={cn("relative grid h-10 place-items-center rounded-lg border text-sm", index === i ? "border-ink ring-1 ring-ink" : "border-zinc-200", state.quizDraft[String(item.id)] !== undefined && "bg-zinc-900 text-white", flagged.includes(item.id) && "border-amber-500")}>
              {i + 1}
            </button>)}
          </div>
          <button type="button" disabled={!ready || answered === 0} onClick={finish}
            className="mt-6 h-11 w-full rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-40">Nộp bài ({answered}/{quizQuestions.length})</button>
          <p className="mt-3 text-xs leading-5 text-zinc-500">Điểm chỉ được công bố sau khi nộp. Bài làm lưu cục bộ trên thiết bị này.</p>
        </Card>
      </aside>
    </div>
  </div>;
}
