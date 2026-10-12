import { redirect } from "next/navigation";
import Link from "next/link";
import { signUpAction } from "@/features/auth/actions";
import { isLiveMode } from "@/lib/supabase/config";

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!isLiveMode()) redirect("/student");
  const params = await searchParams;
  return <main className="mx-auto max-w-md px-5 py-20">
    <h1 className="text-3xl font-bold">Tạo tài khoản học viên</h1>
    <p className="mt-3 text-sm text-zinc-600">Tài khoản mới chỉ có quyền học viên. Quyền quản trị do hệ thống cấp riêng.</p>
    {params.error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">Không thể đăng ký. Vui lòng kiểm tra thông tin hoặc thử email khác.</p>}
    <form action={signUpAction} className="mt-7 space-y-5">
      <label className="block text-sm font-medium">Họ và tên<input name="display_name" minLength={2} maxLength={100} required autoComplete="name" className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3" /></label>
      <label className="block text-sm font-medium">Email<input name="email" type="email" maxLength={254} required autoComplete="email" className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3" /></label>
      <label className="block text-sm font-medium">Mật khẩu (ít nhất 8 ký tự)<input name="password" type="password" minLength={8} required autoComplete="new-password" className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3" /></label>
      <button type="submit" className="h-11 w-full rounded-full bg-ink text-sm font-semibold text-white">Đăng ký</button>
    </form>
    <p className="mt-6 text-sm text-zinc-600">Đã có tài khoản? <Link href="/dang-nhap" className="font-semibold underline">Đăng nhập</Link></p>
  </main>;
}
