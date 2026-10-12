"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDemoLearning } from "@/features/learning/demo-store";
import { excelLessons, getNextExcelLesson, getPreviousExcelLesson, type DemoLesson } from "@/features/learning/content";

const lessonUrl = (slug: string) => `/student/khoa-hoc/excel-can-ban/${slug}`;

export function LessonWorkspace({ lesson }: { lesson: DemoLesson }) {
  const { state, ready, completeLesson } = useDemoLearning();
  const completed = Boolean(state.completedLessons[lesson.slug]);
  const doneCount = excelLessons.filter((item) => state.completedLessons[item.slug]).length;
  const next = getNextExcelLesson(lesson.slug);
  const previous = getPreviousExcelLesson(lesson.slug);
  const canContinue = ready && completed;

  return <div className="mx-auto max-w-5xl">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link href="/khoa-hoc/excel-can-ban" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-ink">
        <ArrowLeft size={16} /> Nội dung khóa học
      </Link>
      <Badge>Chế độ học thử • lưu trên thiết bị</Badge>
    </div>
    <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px]">
      <div className="space-y-6">
        <Card className="p-6 sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[.14em] text-zinc-500">Chương {lesson.chapter + 1} • {lesson.minutes} phút</span>
            {completed && <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={16} /> Đã hoàn thành</span>}
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">{lesson.summary}</p>
          <h2 className="mt-9 flex items-center gap-2 text-lg font-semibold"><BookOpen size={20} /> Nội dung trọng tâm</h2>
          <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm leading-7 text-zinc-700">
            {lesson.points.map((point) => <li key={point}>{point}</li>)}
          </ol>
          <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold"><ListChecks size={19} /> Tự thực hành</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">{lesson.practice}</p>
          </div>
          <div className="mt-9 border-t border-zinc-200 pt-6">
            {!completed && <button type="button" disabled={!ready} onClick={() => completeLesson(lesson.slug)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-40">
              <CheckCircle2 size={18} /> Đánh dấu hoàn thành
            </button>}
            {completed && <div className="mb-4 text-sm text-emerald-700">Đã lưu tiến độ bài học trên trình duyệt này.</div>}
            {canContinue && <Link className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-zinc-700"
              href={next ? lessonUrl(next.slug) : "/student/quiz"}>
              {next ? "Bài tiếp theo" : "Làm bài trắc nghiệm"} <ArrowRight size={17} />
            </Link>}
            {!ready && <p className="mt-2 text-xs text-zinc-500">Đang tải tiến độ học thử...</p>}
          </div>
        </Card>
        <nav className="flex flex-wrap items-center justify-between gap-3 text-sm" aria-label="Điều hướng bài học">
          {previous ? <Link href={lessonUrl(previous.slug)} className="inline-flex items-center gap-2 font-medium"><ArrowLeft size={16} /> Bài trước</Link> : <span />}
          <Link href="/student/quiz" className="inline-flex items-center gap-2 font-medium"><ClipboardCheck size={16} /> Trắc nghiệm Excel</Link>
        </nav>
      </div>
      <aside>
        <Card className="p-5 lg:sticky lg:top-28">
          <div className="text-sm font-semibold">Tiến độ Excel căn bản</div>
          <div className="mt-4"><Progress value={ready ? Math.round(doneCount / excelLessons.length * 100) : 0} label={`${doneCount}/${excelLessons.length} bài hoàn thành`} /></div>
          <div className="mt-5 space-y-1">
            {excelLessons.map((item, index) => <Link key={item.slug} href={lessonUrl(item.slug)}
              aria-current={item.slug === lesson.slug ? "page" : undefined}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${item.slug === lesson.slug ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}>
              <span className="w-5 shrink-0">{state.completedLessons[item.slug] ? "✓" : String(index + 1).padStart(2, "0")}</span>
              <span>{item.title}</span>
            </Link>)}
          </div>
        </Card>
      </aside>
    </div>
  </div>;
}
