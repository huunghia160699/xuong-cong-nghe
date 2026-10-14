"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Question = { id: string; prompt: string; options: { id: string; label: string }[] };
type QuizData = { title: string; questions: Question[] };

export function LiveQuiz() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/quiz/excel-can-ban", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? "Không thể tải quiz.");
        return body as QuizData;
      })
      .then(setQuiz)
      .catch((reason) => { if (!controller.signal.aborted) setError(String(reason?.message ?? reason)); });
    return () => controller.abort();
  }, []);

  const questions = quiz?.questions ?? [];
  const question = questions[index];
  const answered = questions.filter((q) => answers[q.id]).length;

  async function submit() {
    if (!quiz || submitting) return;
    const missing = questions.length - answered;
    if (missing && !window.confirm(`Còn ${missing} câu chưa trả lời. Vẫn nộp bài?`)) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/quiz/excel-can-ban/submit", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await response.json();
      if (!response.ok || !data.attemptId) throw new Error(data.error ?? "Nộp bài thất bại.");
      router.push(`/student/quiz/ket-qua/${data.attemptId}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Lỗi kết nối.");
      setSubmitting(false);
    }
  }

  if (error && !quiz) return <Card className="mx-auto max-w-xl p-7"><h1 className="text-xl font-semibold">Chưa thể tải bài luyện</h1>
    <p role="alert" className="mt-3 text-sm leading-7 text-red-700">{error}</p>
    <p className="mt-3 text-sm text-zinc-500">Hãy kiểm tra Supabase, migration và dữ liệu mẫu của bài quiz.</p></Card>;
  if (!quiz || !question) return <div className="mx-auto max-w-3xl p-8 text-sm text-zinc-600">Đang tải trắc nghiệm đã xuất bản...</div>;

  return <div className="w-full">
    <div className="flex flex-wrap justify-between gap-3">
      <Link href="/student" className="inline-flex items-center gap-2 text-sm text-zinc-500"><ArrowLeft size={16} /> Dashboard</Link>
      <Badge>Đã đăng nhập • chấm điểm tại server</Badge>
    </div>
    <div className="mt-7 h-1.5 rounded-full bg-zinc-200"><div className="h-full rounded-full bg-ink" style={{width:`${answered / questions.length * 100}%`}} /></div>
    <p className="mt-3 text-xs text-zinc-500">Đã trả lời {answered}/{questions.length} • Câu {index + 1}</p>
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_210px]">
      <Card className="p-6 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold leading-snug sm:text-3xl">{question.prompt}</h1>
          <button type="button" aria-pressed={flags.includes(question.id)} aria-label="Đánh dấu câu hỏi" onClick={() => setFlags((current) =>
            current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id])}
            className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg border", flags.includes(question.id) ? "border-amber-500 bg-amber-50" : "border-zinc-200")}>
            <Flag size={18} />
          </button>
        </div>
        <div className="mt-8 grid gap-3">
          {question.options.map((option, oi) => <button type="button" key={option.id} aria-pressed={answers[question.id] === option.id}
            disabled={submitting} onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
            className={cn("flex w-full items-center gap-4 rounded-xl border p-4 text-left text-sm", answers[question.id] === option.id ? "border-ink bg-zinc-100 ring-1 ring-ink" : "border-zinc-200 hover:border-zinc-400")}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-current text-xs font-bold">{String.fromCharCode(65 + oi)}</span>
            <span>{option.label}</span>
          </button>)}
        </div>
        {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6">
          <button type="button" disabled={!answers[question.id] || submitting} onClick={() => setAnswers((current) => {
            const next = { ...current }; delete next[question.id]; return next;
          })} className="text-sm text-zinc-500 disabled:opacity-40">Xóa lựa chọn</button>
          <div className="flex gap-2">
            <button type="button" disabled={index === 0 || submitting} onClick={() => setIndex(index - 1)}
              className="h-11 rounded-full border border-zinc-300 px-4 text-sm disabled:opacity-40">Trước</button>
            {index + 1 < questions.length ? <button type="button" onClick={() => setIndex(index + 1)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm text-white">Tiếp <ArrowRight size={16} /></button> :
              <button type="button" disabled={submitting} onClick={submit} className="h-11 rounded-full bg-ink px-5 text-sm text-white disabled:opacity-40">{submitting ? "Đang chấm..." : "Nộp bài"}</button>}
          </div>
        </div>
      </Card>
      <Card className="h-fit p-5">
        <h2 className="text-sm font-semibold">Danh sách câu</h2>
        <div className="mt-5 grid grid-cols-4 gap-2">
          {questions.map((q, i) => <button key={q.id} type="button" onClick={() => setIndex(i)}
            aria-label={`Đi đến câu ${i + 1}`}
            className={cn("grid h-10 place-items-center rounded-lg border text-sm", i === index && "ring-2 ring-ink", answers[q.id] ? "bg-ink text-white" : "bg-white", flags.includes(q.id) && "border-amber-500")}>{i + 1}</button>)}
        </div>
        <button type="button" disabled={submitting || answered === 0} onClick={submit} className="mt-6 h-11 w-full rounded-full bg-ink text-sm font-medium text-white disabled:opacity-40">Nộp bài</button>
        <p className="mt-3 text-xs leading-5 text-zinc-500">Đáp án chưa được công bố. Điểm và kết quả được lưu trên Supabase sau khi chấm.</p>
      </Card>
    </div>
  </div>;
}
