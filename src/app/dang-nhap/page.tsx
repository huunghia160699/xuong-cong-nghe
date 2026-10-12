import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction } from "@/features/auth/actions";
import { isLiveMode, safeNextPath } from "@/lib/supabase/config";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; notice?: string; next?: string }> }) {
  if (!isLiveMode()) redirect("/student");
  const params = await searchParams;
  return <main className="mx-auto max-w-md px-5 py-20">
    <p className="text-xs font-semibold uppercase tracking-[.14em] text-zinc-500">Không gian học tập</p>
    <h1 className="mt-3 text-3xl font-bold">Đăng nhập</h1>
    <p className="mt-3 text-sm text-zinc-600">Sử dụng tài khoản để đồng bộ bài học và kết quả trắc nghiệm.</p>
    {params.error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {params.error === "session" ? "Phiên đăng nhập đã hết hạn." : params.error === "callback" ? "Liên kết xác thực không hợp lệ hoặc đã hết hạn." : "Email hoặc mật khẩu không chính xác."}
    </p>}
    {params.notice && <p role="status" className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm">Nếu địa chỉ email hợp lệ, vui lòng kiểm tra thư để xác nhận tài khoản.</p>}
    <form action={signInAction} className="mt-7 space-y-5">
      <input type="hidden" name="next" value={safeNextPath(params.next)} />
      <label className="block text-sm font-medium">Email<input name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3 outline-none focus:ring-2 focus:ring-ink" /></label>
      <label className="block text-sm font-medium">Mật khẩu<input name="password" type="password" autoComplete="current-password" required className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3 outline-none focus:ring-2 focus:ring-ink" /></label>
      <button type="submit" className="h-11 w-full rounded-full bg-ink px-5 text-sm font-semibold text-white">Đăng nhập</button>
    </form>
    <div className="mt-6 flex justify-between text-sm"><Link className="font-medium underline" href="/dang-ky">Tạo tài khoản</Link><Link className="text-zinc-600 underline" href="/quen-mat-khau">Quên mật khẩu?</Link></div>
  </main>;
}
