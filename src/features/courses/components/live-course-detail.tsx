import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getExcelLesson } from "@/features/learning/content";
import { getPublishedCourse } from "@/features/courses/live-public";

export async function LiveCourseDetail({ slug }: { slug: string }) {
  const details = await getPublishedCourse(slug);
  if (!details) notFound();
  const { course, chapters, lessons } = details;
  const firstExcelLesson = course.slug === "excel-can-ban" ? lessons.find((l) => getExcelLesson(l.slug)) : undefined;
  return <main>
    <section className="bg-ink text-white">
      <div className="xcn-container xcn-section-pad">
        <Link href="/khoa-hoc" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={17} /> Tất cả khóa học</Link>
        <Badge className="mt-8 block w-fit border-white/20 bg-white/5 text-white">{course.category} • {course.level}</Badge>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{course.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">{course.description || course.excerpt || "Nội dung giới thiệu đang được cập nhật."}</p>
        <div className="mt-5 flex items-center gap-2 text-sm text-zinc-300"><BookOpen size={17} /> {lessons.length} bài đã xuất bản</div>
        {firstExcelLesson && <Link href={`/student/khoa-hoc/excel-can-ban/${firstExcelLesson.slug}`}
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-lime px-6 text-sm font-semibold text-ink">Bắt đầu học <ArrowRight size={17} /></Link>}
      </div>
    </section>
    <div className="xcn-container xcn-section-pad">
      <h2 className="text-2xl font-semibold">Chương trình học</h2>
      {chapters.length === 0 && <Card className="mt-7 p-7 text-sm text-zinc-600">Khóa học đã được giới thiệu nhưng chưa có chương hoặc bài học được xuất bản.</Card>}
      <div className="mt-7 space-y-5">
        {chapters.map((chapter, index) => <Card key={chapter.id} className="overflow-hidden">
          <h3 className="border-b border-zinc-200 bg-paper p-5 font-semibold">Chương {index + 1}. {chapter.title}</h3>
          {lessons.filter((lesson) => lesson.chapter_id === chapter.id).length === 0 ?
            <p className="p-5 text-sm text-zinc-500">Chưa có bài học xuất bản.</p> :
            <div className="divide-y divide-zinc-100">
              {lessons.filter((lesson) => lesson.chapter_id === chapter.id).map((lesson) => {
                const playable = course.slug === "excel-can-ban" && Boolean(getExcelLesson(lesson.slug));
                return <div key={lesson.id} className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm">
                  <span className="font-medium">{lesson.title}</span>
                  <span className="flex items-center gap-3 text-xs text-zinc-500">
                    <Clock3 size={14} /> {lesson.duration_minutes} phút
                    {playable ? <Link className="font-semibold text-zinc-900 underline" href={`/student/khoa-hoc/excel-can-ban/${lesson.slug}`}>Mở bài</Link> : <span>Nội dung đang biên tập</span>}
                  </span>
                </div>;
              })}
            </div>}
        </Card>)}
      </div>
    </div>
  </main>;
}
