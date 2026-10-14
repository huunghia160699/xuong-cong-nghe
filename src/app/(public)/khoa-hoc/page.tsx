import { CourseCard } from "@/components/course-card";
import { courses as demoCourses } from "@/data/mock";
import { isLiveMode } from "@/lib/supabase/config";
import { getPublishedCourses } from "@/features/courses/live-public";

export default async function CourseCatalogPage() {
  const courses = isLiveMode() ? await getPublishedCourses() : demoCourses;
  return <main className="xcn-container xcn-page-pad">
    <p className="text-xs font-semibold uppercase tracking-[.14em] text-zinc-500">Học theo lộ trình</p>
    <h1 className="mt-3 text-4xl font-bold tracking-tight">Khóa học</h1>
    <p className="mt-4 text-base leading-7 text-zinc-600">{isLiveMode() ? "Danh sách khóa học đã xuất bản từ cơ sở dữ liệu." : "Các khóa học giới thiệu trong chế độ demo."}</p>
    {!courses.length ? <p className="mt-10 rounded-xl border border-dashed border-zinc-200 p-7 text-sm text-zinc-600">Chưa có khóa học được xuất bản.</p> :
      <div className="mt-7 grid gap-5 md:grid-cols-3">{courses.map((course) => <CourseCard key={course.slug} course={course} />)}</div>}
  </main>;
}
