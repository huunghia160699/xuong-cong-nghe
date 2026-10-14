import { redirect } from "next/navigation";
import { changePasswordAction } from "@/features/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLiveMode } from "@/lib/supabase/config";

export default async function NewPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!isLiveMode()) redirect("/student");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?error=session");
  const params = await searchParams;
  return <main className="xcn-ui mx-auto max-w-lg px-[var(--xcn-page-gutter)] py-14">
    <h1 className="text-4xl font-bold">Đặt lại mật khẩu</h1>
    {params.error && <p role="alert" className="mt-5 text-sm text-red-700">Mật khẩu phải có ít nhất 8 ký tự và hai lần nhập phải trùng nhau.</p>}
    <form action={changePasswordAction} className="mt-7 space-y-5">
      <label className="block text-sm font-medium">Mật khẩu mới<input name="password" type="password" minLength={8} autoComplete="new-password" required className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3" /></label>
      <label className="block text-sm font-medium">Xác nhận mật khẩu<input name="confirmation" type="password" minLength={8} autoComplete="new-password" required className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3" /></label>
      <button type="submit" className="h-11 w-full rounded-full bg-ink text-sm font-semibold text-white">Lưu mật khẩu</button>
    </form>
  </main>;
}
