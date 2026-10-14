import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createCourseAction, setCourseStatusAction } from "@/features/admin/course-actions";
import { isLiveMode } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const labels: Record<string,string> = { draft:"Bản nháp", published:"Đã xuất bản", archived:"Lưu trữ" };

export default async function AdminCourses({ searchParams }: { searchParams: Promise<{error?:string; notice?:string}> }) {
  if (!isLiveMode()) return <main className="mx-auto max-w-3xl p-5"><h1 className="text-2xl font-bold">Quản lý khóa học</h1>
    <p className="mt-4 text-sm text-zinc-600">Chức năng tạo và xuất bản khóa học yêu cầu cấu hình Supabase. Chế độ hiện tại chỉ trình diễn giao diện.</p>
    <Link href="/admin" className="mt-5 inline-block text-sm underline">Về tổng quan</Link></main>;
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin/khoa-hoc");
  const { data: courses, error } = await supabase.from("courses")
    .select("id,slug,title,category,status,created_at").order("created_at", { ascending:false });
  if (error) throw new Error("Không thể tải khóa học. Kiểm tra chính sách RLS.");
  return <div className="w-full">
    <div className="flex items-center justify-between gap-4"><div><Badge>Quản trị nội dung</Badge>
      <h1 className="mt-3 text-4xl font-bold">Khóa học</h1>
      <p className="mt-2 text-sm text-zinc-600">Tạo và thay đổi trạng thái xuất bản của khóa học.</p></div>
      <Link href="/admin" className="text-sm font-medium underline">Tổng quan</Link>
    </div>
    {params.error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Không thể thực hiện yêu cầu. Kiểm tra thông tin, slug trùng hoặc quyền quản trị.</p>}
    {params.notice && <p role="status" className="mt-5 rounded-lg border border-zinc-200 bg-white p-4 text-sm">Thay đổi đã được lưu.</p>}
    <Card className="mt-6 p-5"><h2 className="text-lg font-semibold">Tạo khóa học mới</h2>
      <form action={createCourseAction} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
        <label className="text-sm font-medium">Tên khóa học<input name="title" minLength={3} maxLength={150} required className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3" /></label>
        <label className="text-sm font-medium">Slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="excel-nang-cao" className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3" /></label>
        <label className="text-sm font-medium">Danh mục<input name="category" required placeholder="Excel" className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3" /></label>
        <button type="submit" className="h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white">Tạo bản nháp</button>
      </form>
    </Card>
    <Card className="mt-7 overflow-hidden">
      <div className="border-b border-zinc-200 p-5"><h2 className="text-lg font-semibold">Danh sách ({courses?.length ?? 0})</h2></div>
      {(courses ?? []).length === 0 ? <p className="p-6 text-sm text-zinc-600">Chưa có khóa học.</p> :
        <div className="divide-y divide-zinc-100">{courses?.map((course) => <div key={course.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="min-w-0"><h3 className="font-semibold">{course.title}</h3><p className="mt-1 text-xs text-zinc-500">{course.category} • /{course.slug}</p></div>
          <div className="flex flex-wrap items-center gap-3"><Badge>{labels[course.status] ?? course.status}</Badge>
            <form action={setCourseStatusAction}><input type="hidden" name="course_id" value={course.id} />
              <input type="hidden" name="status" value={course.status === "published" ? "draft" : "published"} />
              <button type="submit" className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold">{course.status === "published" ? "Đưa về nháp" : "Xuất bản"}</button>
            </form>
          </div>
        </div>)}</div>}
    </Card>
  </div>;
}
