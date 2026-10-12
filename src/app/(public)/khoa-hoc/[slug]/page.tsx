import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock3, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { courseDetail, courses } from "@/data/mock";
import { isLiveMode } from "@/lib/supabase/config";
import { LiveCourseDetail } from "@/features/courses/components/live-course-detail";
import { excelLessons } from "@/features/learning/content";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (isLiveMode()) return <LiveCourseDetail slug={slug} />;
  const selectedCourse = courses.find((course) => course.slug === slug);
  if (!selectedCourse) notFound();
  if (slug !== "excel-can-ban") return <main className="mx-auto max-w-4xl px-5 py-20">
    <Badge>Khóa học dự kiến</Badge>
    <h1 className="mt-5 text-4xl font-bold">{selectedCourse.title}</h1>
    <p className="mt-5 text-sm leading-7 text-zinc-600">Nội dung khóa học này đang được phát triển. Hiện có thể học thử trọn lộ trình Excel căn bản và luyện trắc nghiệm.</p>
    <Link href="/khoa-hoc/excel-can-ban" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">Khám phá Excel căn bản <ArrowRight size={17} /></Link>
  </main>;
  const c = courseDetail;
  const start = `/student/khoa-hoc/excel-can-ban/${excelLessons[0].slug}`;

  return <main>
    <section className="bg-ink text-white"><div className="grid-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={16} /> Trang chủ / Khóa học</Link>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <Badge className="border-white/20 bg-white/5 text-zinc-300">{c.category} • {c.level}</Badge>
            <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">{c.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">{c.description}</p>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-zinc-300"><span className="flex items-center gap-2"><Clock3 size={17} /> {c.duration}</span><span>{excelLessons.length} bài học thử</span></div>
          </div>
          <Card className="bg-white p-3 text-ink">
            <div className="grid-paper flex aspect-video items-center justify-center rounded-lg bg-[#dff1df]"><span className="text-7xl font-black">fx</span></div>
            <div className="p-5">
              <div className="text-xl font-bold">Học thử miễn phí</div>
              <Link href={start} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-zinc-700">Bắt đầu bài học <ArrowRight size={17} /></Link>
              <div className="mt-5 space-y-3 text-sm text-zinc-600">
                {["9 bài học với nội dung thực hành", "Trắc nghiệm 6 câu có giải thích", "Tiến độ lưu trên trình duyệt hiện tại"].map((text) => <div className="flex items-center gap-2" key={text}><Check size={16} /> {text}</div>)}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div></section>
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.25fr_.75fr] lg:px-8">
      <div>
        <h2 className="text-3xl font-bold">Nội dung khóa học</h2>
        <p className="mt-3 text-sm text-zinc-500">3 chương • {excelLessons.length} bài học • chọn một bài để mở</p>
        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200">
          {c.chapters.map((chapter, chapterIndex) => <div key={chapter.title} className="border-b border-zinc-200 last:border-0">
            <div className="flex items-center justify-between bg-paper px-5 py-4">
              <div className="flex items-center gap-4"><span className="text-xs text-zinc-400">0{chapterIndex + 1}</span><h3 className="font-semibold">{chapter.title}</h3></div>
              <span className="text-xs text-zinc-500">{chapter.lessons.length} bài</span>
            </div>
            {excelLessons.filter((lesson) => lesson.chapter === chapterIndex).map((lesson) => <Link key={lesson.slug}
              href={`/student/khoa-hoc/excel-can-ban/${lesson.slug}`}
              className="flex items-center justify-between gap-3 border-t border-zinc-100 px-5 py-4 text-sm transition hover:bg-zinc-50">
              <span className="flex items-center gap-3"><PlayCircle size={17} className="shrink-0 text-zinc-400" />{lesson.title}</span>
              <span className="shrink-0 text-xs text-zinc-500">{lesson.minutes} phút</span>
            </Link>)}
          </div>)}
        </div>
      </div>
      <aside><Card className="p-6 lg:sticky lg:top-28">
        <Badge>Kết quả đầu ra</Badge><h3 className="mt-5 text-xl font-semibold">Sau khóa học, bạn có thể</h3>
        <ul className="mt-5 space-y-4 text-sm leading-6 text-zinc-600">
          {["Tổ chức dữ liệu rõ ràng và nhất quán", "Sử dụng công thức nền tảng chính xác", "Tạo báo cáo và biểu đồ dễ hiểu", "Hoàn thành một bảng theo dõi thực tế"].map((text) => <li className="flex gap-3" key={text}><Check size={17} className="mt-1 shrink-0" />{text}</li>)}
        </ul>
        <Link href="/student/quiz" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">Ôn tập trắc nghiệm Excel <ArrowRight size={17} /></Link>
      </Card></aside>
    </section>
  </main>;
}
