"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDemoLearning } from "@/features/learning/demo-store";
import { excelLessons } from "@/features/learning/content";

export default function StudentDashboard() {
  const { state, ready } = useDemoLearning();
  const completed = excelLessons.filter((lesson) => state.completedLessons[lesson.slug]).length;
  const percentage = Math.round(completed / excelLessons.length * 100);
  const nextLesson = excelLessons.find((lesson) => !state.completedLessons[lesson.slug]);
  const quizCount = state.attempts.length;
  const avgScore = quizCount ? (state.attempts.reduce((total, item) => total + item.score, 0) / quizCount / 10).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) : "—";
  const recent = [
    ...Object.entries(state.completedLessons).map(([slug, date]) => ({
      key: `lesson-${slug}`, date, title: `Hoàn thành: ${excelLessons.find((lesson) => lesson.slug === slug)?.title ?? "Bài học"}`,
      href: `/student/khoa-hoc/excel-can-ban/${slug}`, type: "Bài học",
    })),
    ...state.attempts.map((attempt) => ({
      key: attempt.id, date: attempt.submittedAt, title: `Trắc nghiệm Excel: ${(attempt.score / 10).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}/10`,
      href: `/student/quiz/ket-qua/${attempt.id}`, type: "Trắc nghiệm",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return <div className="mx-auto max-w-[1400px]">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Badge>Không gian học thử • dữ liệu trên thiết bị</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Hành trình học tập của bạn</h1>
        <p className="mt-2 text-sm text-zinc-500">Tiếp tục bài học hoặc thực hành trắc nghiệm để củng cố kiến thức.</p>
      </div>
      <Button href="/student/quiz" variant="outline"><Play size={16} className="mr-2" /> Luyện trắc nghiệm</Button>
    </div>

    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "Khóa đang học", value: "01", note: "Excel căn bản" },
        { label: "Bài hoàn thành", value: ready ? `${completed}/${excelLessons.length}` : "—", note: "Lưu trên trình duyệt này" },
        { label: "Điểm trung bình", value: ready ? avgScore : "—", note: quizCount ? "Thang điểm 10" : "Chưa có bài nộp" },
        { label: "Lượt làm quiz", value: ready ? String(quizCount) : "—", note: "Bài kiểm tra Excel" },
      ].map((stat) => <Card key={stat.label} className="p-5">
        <div className="text-xs font-medium uppercase tracking-[.1em] text-zinc-500">{stat.label}</div>
        <div className="mt-4 text-3xl font-bold">{stat.value}</div>
        <div className="mt-2 text-xs text-zinc-500">{stat.note}</div>
      </Card>)}
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
      <Card className="overflow-hidden bg-ink text-white">
        <div className="grid-paper flex min-h-72 flex-col p-7">
          <Badge className="w-fit border-white/20 bg-white/5 text-zinc-300">{completed === excelLessons.length ? "Đã hoàn tất lộ trình" : "Tiếp tục học"}</Badge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight">Excel căn bản<br />cho công việc</h2>
          <p className="mt-3 text-sm text-zinc-400">{nextLesson ? `Bài tiếp theo: ${nextLesson.title}` : "Bạn đã hoàn thành tất cả 9 bài học mẫu."}</p>
          <div className="mt-auto max-w-md pt-8">
            <div className="flex justify-between text-xs text-zinc-300"><span>Tiến độ khóa học</span><span>{ready ? percentage : 0}%</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-lime transition-all" style={{width:`${ready ? percentage : 0}%`}} /></div>
            <Link href={nextLesson ? `/student/khoa-hoc/excel-can-ban/${nextLesson.slug}` : "/student/quiz"}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-lime px-5 text-sm font-semibold text-ink hover:bg-white">
              {nextLesson ? "Tiếp tục bài học" : "Ôn tập bằng trắc nghiệm"} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Mốc học tập</h2><BookOpen size={19} /></div>
        <div className="mt-7 text-4xl font-bold">{ready ? completed : "—"}<span className="text-lg font-medium text-zinc-400">/{excelLessons.length} bài</span></div>
        <p className="mt-3 text-sm leading-6 text-zinc-600">{completed === 0 ? "Bắt đầu bài đầu tiên để ghi nhận tiến độ." : completed === excelLessons.length ? "Đã hoàn thành khóa học mẫu. Hãy kiểm tra kiến thức!" : "Tiếp tục hoàn thành các bài còn lại theo lộ trình."}</p>
        <div className="mt-6"><Progress value={ready ? percentage : 0} /></div>
        <Button href="/khoa-hoc/excel-can-ban" className="mt-6 w-full" variant="outline">Xem toàn bộ bài học</Button>
      </Card>
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
      <Card className="p-6" id="courses">
        <h2 className="text-lg font-semibold">Nội dung đang học</h2>
        <div className="mt-5 space-y-2">
          {excelLessons.slice(0, 5).map((lesson, index) => <Link key={lesson.slug} href={`/student/khoa-hoc/excel-can-ban/${lesson.slug}`}
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-zinc-50">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-xs">{state.completedLessons[lesson.slug] ? <CheckCircle2 size={16} className="text-emerald-700" /> : index + 1}</span>
            <span className="flex-1">{lesson.title}</span><ArrowRight size={15} className="text-zinc-400" />
          </Link>)}
        </div>
      </Card>
      <Card className="p-6" id="results">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Hoạt động gần đây</h2><ClipboardCheck size={19} /></div>
        {!ready ? <p className="mt-6 text-sm text-zinc-500">Đang tải hoạt động...</p> : recent.length === 0 ?
          <div className="mt-6 rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
            Chưa có hoạt động. <Link href={`/student/khoa-hoc/excel-can-ban/${excelLessons[0].slug}`} className="font-semibold underline">Bắt đầu bài đầu tiên</Link> để ghi nhận kết quả.
          </div> :
          <div className="mt-5 divide-y divide-zinc-100">{recent.map((entry) => <Link href={entry.href} key={entry.key} className="flex items-center gap-4 py-4 hover:bg-zinc-50">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-100">{entry.type === "Bài học" ? <BookOpen size={18} /> : <ClipboardCheck size={18} />}</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{entry.title}</span><span className="mt-1 block text-xs text-zinc-500">{new Date(entry.date).toLocaleString("vi-VN")}</span></span>
            <ArrowRight size={16} className="shrink-0 text-zinc-400" />
          </Link>)}</div>}
      </Card>
    </div>
  </div>;
}
