import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DemoAdminDashboard } from "@/features/admin/components/demo-admin-dashboard";
import { isLiveMode } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  if (!isLiveMode()) return <DemoAdminDashboard />;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin");
  const [{ count: users, error: usersError }, { count: courses, error: coursesError }, { count: attempts, error: attemptsError }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("quiz_attempts").select("id", { count: "exact", head: true }),
  ]);
  if (usersError || coursesError || attemptsError) throw new Error("Không thể thống kê dữ liệu quản trị.");
  return <div className="mx-auto max-w-6xl">
    <Badge>Quản trị • Supabase</Badge>
    <h1 className="mt-4 text-3xl font-bold">Tổng quan hệ thống</h1>
    <p className="mt-3 text-sm text-zinc-600">Dữ liệu thống kê đang đọc từ cơ sở dữ liệu; không còn số liệu mẫu.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {[{label:"Tài khoản",value:users},{label:"Khóa học",value:courses},{label:"Lượt làm bài",value:attempts}].map((item) =>
        <Card className="p-6" key={item.label}><p className="text-sm text-zinc-500">{item.label}</p><p className="mt-4 text-3xl font-bold">{item.value ?? 0}</p></Card>)}
    </div>
    <Card className="mt-7 p-7"><h2 className="text-xl font-semibold">Quản lý khóa học</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-600">Tạo khóa học dạng nháp, xem danh sách và đổi trạng thái xuất bản trực tiếp trong Supabase. Chức năng biên tập chương/bài sẽ được phát triển ở giai đoạn kế tiếp.</p>
      <Link href="/admin/khoa-hoc" className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Mở quản lý khóa học</Link>
    </Card>
  </div>;
}
