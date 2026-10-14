import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { excelLessons } from "@/features/learning/content";

type LiveAttempt = { id: string; score: number | null; submitted_at: string | null };
export function LiveDashboard({ name, completed, attempts }: {
  name: string;
  completed: Record<string, string>;
  attempts: LiveAttempt[];
}) {
  const completedCount = excelLessons.filter((lesson) => completed[lesson.slug]).length;
  const next = excelLessons.find((lesson) => !completed[lesson.slug]);
  const progress = Math.round(100 * completedCount / excelLessons.length);
  const submitted = attempts.filter((a) => a.score != null && a.submitted_at);
  const average = submitted.length ? (submitted.reduce((sum, a) => sum + Number(a.score), 0) / submitted.length / 10).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) : "—";
  return <div className="w-full">
    <Badge>Tài khoản đã đăng nhập • Supabase</Badge>
    <h1 className="mt-3 text-4xl font-bold">Không gian học tập</h1>
    <p className="mt-2 text-sm text-zinc-600">Xin chào {name}. Dữ liệu của bạn được lưu trong tài khoản và đồng bộ khi đăng nhập.</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      {[{label:"Bài đã hoàn thành",value:`${completedCount}/${excelLessons.length}`},
        {label:"Điểm quiz trung bình",value:average === "—" ? "—" : `${average}/10`},
        {label:"Lượt nộp quiz",value:String(submitted.length)}].map((stat) =>
        <Card className="p-5" key={stat.label}>
          <div className="text-xs uppercase tracking-wider text-zinc-500">{stat.label}</div>
          <div className="mt-4 text-3xl font-bold">{stat.value}</div>
        </Card>)}
    </div>
    <Card className="mt-6 p-7">
      <div className="flex flex-wrap justify-between gap-6">
        <div><h2 className="text-2xl font-bold">Excel căn bản cho công việc</h2>
          <p className="mt-2 text-sm text-zinc-600">{next ? `Bài tiếp theo: ${next.title}` : "Đã hoàn thành 9 bài học mẫu."}</p></div>
        <span className="text-3xl font-bold">{progress}%</span>
      </div>
      <div className="mt-6 h-2 rounded-full bg-zinc-100"><div className="h-full rounded-full bg-zinc-900" style={{width:`${progress}%`}} /></div>
      <Link className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white" href={next ?
        `/student/khoa-hoc/excel-can-ban/${next.slug}` : "/student/quiz"}>
        {next ? "Tiếp tục bài học" : "Luyện trắc nghiệm"} <ArrowRight size={17} />
      </Link>
    </Card>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card className="p-6" id="courses">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><BookOpen size={19} /> Lộ trình Excel</h2>
        <div className="mt-5 space-y-2">
          {excelLessons.map((lesson, i) => <Link key={lesson.slug} href={`/student/khoa-hoc/excel-can-ban/${lesson.slug}`}
            className="flex items-center gap-3 rounded-lg p-2 text-sm hover:bg-zinc-50">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 text-xs">{completed[lesson.slug] ? "✓" : i + 1}</span>
            <span className="flex-1">{lesson.title}</span><ArrowRight size={16} />
          </Link>)}
        </div>
      </Card>
      <Card className="p-6" id="results">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><ClipboardCheck size={19} /> Kết quả đã nộp</h2>
        {submitted.length === 0 ? <p className="mt-5 text-sm text-zinc-500">Chưa có bài nộp. Hãy làm quiz để xem kết quả.</p> :
          <div className="mt-5 divide-y divide-zinc-100">{submitted.slice(0, 10).map((attempt) => <Link href={`/student/quiz/ket-qua/${attempt.id}`} key={attempt.id} className="flex items-center justify-between gap-3 py-4 text-sm hover:bg-zinc-50">
            <span>Quiz Excel • {attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString("vi-VN") : ""}</span>
            <strong>{(Number(attempt.score)/10).toLocaleString("vi-VN",{maximumFractionDigits:1})}/10</strong>
          </Link>)}</div>}
        <Link href="/student/quiz" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">Làm trắc nghiệm mới <ArrowRight size={16} /></Link>
      </Card>
    </div>
  </div>;
}
