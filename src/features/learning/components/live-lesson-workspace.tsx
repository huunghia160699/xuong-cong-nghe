"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { excelLessons, getNextExcelLesson, type DemoLesson } from "@/features/learning/content";
import { markLessonCompleteAction } from "@/features/learning/live-actions";

export function LiveLessonWorkspace({ lesson, completed }: { lesson: DemoLesson; completed: Record<string, string> }) {
  const [localCompleted, setCompleted] = useState(completed);
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState("");
  const isComplete = Boolean(localCompleted[lesson.slug]);
  const next = getNextExcelLesson(lesson.slug);
  const count = excelLessons.filter((item) => localCompleted[item.slug]).length;

  function finish() {
    setError("");
    startTransition(async () => {
      try {
        const response = await markLessonCompleteAction(lesson.slug);
        if (response.ok) setCompleted((prev) => ({ ...prev, [lesson.slug]: new Date().toISOString() }));
        else setError(response.error ?? "Không thể lưu tiến độ.");
      } catch { setError("Có lỗi kết nối. Vui lòng thử lại."); }
    });
  }

  return <div className="w-full">
    <Link href="/khoa-hoc/excel-can-ban" className="inline-flex items-center gap-2 text-sm text-zinc-500"><ArrowLeft size={17} /> Nội dung khóa học</Link>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><Badge>Đã đăng nhập • đồng bộ Supabase</Badge><Badge>{count}/{excelLessons.length} bài hoàn thành</Badge></div>
    <Card className="mt-6 p-6 sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[.14em] text-zinc-500">Chương {lesson.chapter + 1} • {lesson.minutes} phút</p>
      <h1 className="mt-5 text-3xl font-bold tracking-tight">{lesson.title}</h1>
      <p className="mt-4 text-base leading-7 text-zinc-600">{lesson.summary}</p>
      <h2 className="mt-9 flex items-center gap-2 text-lg font-semibold"><BookOpen size={19} /> Kiến thức chính</h2>
      <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm leading-7 text-zinc-700">{lesson.points.map((point) => <li key={point}>{point}</li>)}</ol>
      <div className="mt-8 rounded-xl border bg-zinc-50 p-5">
        <h2 className="flex items-center gap-2 font-semibold"><ListChecks size={19} /> Thực hành</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-700">{lesson.practice}</p>
      </div>
      {error && <p role="alert" className="mt-6 text-sm text-red-700">{error}</p>}
      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6">
        {!isComplete ? <button type="button" disabled={busy} onClick={finish} className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-40">
          <CheckCircle2 size={17} /> {busy ? "Đang lưu..." : "Hoàn thành bài học"}
        </button> : <>
          <span className="inline-flex items-center gap-1 text-sm text-emerald-700"><CheckCircle2 size={17} /> Đã lưu tiến độ</span>
          <Link href={next ? `/student/khoa-hoc/excel-can-ban/${next.slug}` : "/student/quiz"}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white">{next ? "Bài tiếp theo" : "Làm quiz"} <ArrowRight size={17} /></Link>
        </>}
      </div>
    </Card>
    <div className="mt-6 flex flex-wrap gap-4 text-sm">
      <Link href="/student" className="font-semibold underline">Xem tiến độ trên Dashboard</Link>
      <Link href="/student/quiz" className="font-semibold underline">Trắc nghiệm Excel</Link>
    </div>
  </div>;
}
