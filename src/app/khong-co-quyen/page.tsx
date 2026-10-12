import Link from "next/link";
export default function AccessDenied() {
  return <main className="mx-auto max-w-xl px-5 py-24"><h1 className="text-3xl font-bold">Không có quyền truy cập</h1>
    <p className="mt-4 text-sm leading-7 text-zinc-600">Tài khoản hiện tại không có quyền quản trị hệ thống.</p>
    <Link href="/student" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Trở về không gian học tập</Link>
  </main>;
}
