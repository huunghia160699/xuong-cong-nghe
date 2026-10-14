import { redirect } from "next/navigation";
import Link from "next/link";
import { requestPasswordResetAction } from "@/features/auth/actions";
import { isLiveMode } from "@/lib/supabase/config";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string; notice?: string }> }) {
  if (!isLiveMode()) redirect("/student");
  const params = await searchParams;
  return <main className="xcn-ui mx-auto max-w-lg px-[var(--xcn-page-gutter)] py-14">
    <h1 className="text-4xl font-bold">Khôi phục mật khẩu</h1>
    <p className="mt-3 text-sm text-zinc-600">Nhập email để nhận liên kết đặt lại mật khẩu.</p>
    {params.error && <p role="alert" className="mt-4 text-sm text-red-700">Email chưa hợp lệ.</p>}
    {params.notice ? <p role="status" className="mt-6 rounded-lg border p-4 text-sm">Nếu email có trong hệ thống, liên kết khôi phục sẽ được gửi đến hộp thư.</p> :
      <form action={requestPasswordResetAction} className="mt-7 space-y-5">
        <label className="block text-sm font-medium">Email<input name="email" type="email" autoComplete="email" maxLength={254} required className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3" /></label>
        <button className="h-11 w-full rounded-full bg-ink text-sm font-semibold text-white">Gửi liên kết</button>
      </form>}
    <Link href="/dang-nhap" className="mt-6 inline-block text-sm font-medium underline">Trở về đăng nhập</Link>
  </main>;
}
