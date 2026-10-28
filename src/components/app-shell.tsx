"use client";

import { Fragment, useState } from "react";
import Link, { useLinkStatus } from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/brand";
import { adminNav, studentNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { isLiveMode } from "@/lib/supabase/config";
import { signOutAction } from "@/features/auth/actions";

function AdminNavigationPending() {
  const { pending } = useLinkStatus();
  return pending ? (
    <span role="status" aria-label="Đang chuyển trang" className="ml-auto h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
  ) : null;
}

export function AppShell({ role, children }: { role: "student" | "admin"; children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = role === "admin";
  const nav = isAdmin ? adminNav : studentNav;
  const live = isLiveMode();

  const sidebar = (mobile: boolean) => <div className={cn("flex h-full min-h-0 flex-col", isAdmin && "xcn-admin-sidebar")}>
    <div className="flex items-center justify-between"><Brand />{mobile && <button type="button" onClick={() => setMenuOpen(false)} aria-label="Đóng menu" className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200"><X size={19} /></button>}</div>
    {!isAdmin && <div className="mt-9 text-[10px] font-bold uppercase tracking-[.2em] text-zinc-400">Không gian học tập</div>}
    <nav className={cn(isAdmin ? "xcn-admin-sidebar-nav" : "mt-3 space-y-1")} aria-label={isAdmin ? "Menu quản trị" : "Menu học viên"}>
      {nav.map((item,index) => {
        const active = item.href.split("#")[0] === pathname && !item.href.includes("#");
        const Icon = item.icon;
        const group = isAdmin ? ({0:"Điều hành",3:"Tài khoản & an toàn",5:"Cấu hình & vận hành",9:"Nội dung",11:"Công cụ"} as Record<number,string>)[index] : undefined;
        return <Fragment key={item.href}>
          {group&&<div className="xcn-admin-sidebar-group font-extrabold uppercase text-slate-400">{group}</div>}
          <Link href={item.href} onClick={() => setMenuOpen(false)}
          className={cn("flex min-w-0 items-center rounded-lg font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-ink", isAdmin ? "xcn-admin-sidebar-link" : "gap-3 px-3 py-2 text-sm", active && "bg-ink text-white hover:bg-ink hover:text-white")}>
          <Icon size={isAdmin ? 19 : 17} className="shrink-0" /><span className="min-w-0 flex-1 truncate">{item.label}</span>
          {isAdmin && <AdminNavigationPending />}
        </Link></Fragment>;
      })}
    </nav>
    {isAdmin ? (
      <div className="xcn-admin-sidebar-footer mt-auto border-t border-zinc-200 px-1">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span className="xcn-admin-sidebar-status inline-flex min-w-0 items-center gap-1.5 font-semibold text-zinc-600" title={live ? "Đang sử dụng chế độ Supabase Live" : "Đang sử dụng dữ liệu trình diễn"}>
            <span aria-hidden="true" className={cn("h-1.5 w-1.5 shrink-0 rounded-full", live ? "bg-emerald-500" : "bg-zinc-400")} />
            {live ? "Supabase · Live" : "Chế độ Demo"}
          </span>
          {live && <form action={signOutAction}><button type="submit" className="xcn-admin-sidebar-status font-semibold text-zinc-600 underline underline-offset-2 hover:text-ink">Đăng xuất</button></form>}
        </div>
      </div>
    ) : (
      <div className="mt-auto rounded-xl border border-zinc-200 bg-paper p-4">
        <div className="text-xs font-semibold">{live ? "Đã kết nối Supabase" : "Chế độ trình diễn"}</div>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{live ? "Tài khoản đã xác thực. Quyền được kiểm tra ở server." : "Bài học và kết quả lưu trên thiết bị; chưa đồng bộ."}</p>
        {live && <form action={signOutAction} className="mt-3"><button type="submit" className="text-xs font-semibold underline">Đăng xuất</button></form>}
      </div>
    )}
  </div>;

  return <div className="xcn-ui min-h-screen bg-paper">
    <aside className={cn("fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-zinc-200 bg-white lg:flex", isAdmin ? "xcn-admin-sidebar-frame" : "overflow-y-auto p-5")}>{sidebar(false)}</aside>
    {menuOpen && <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" aria-label="Đóng menu điều hướng" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-zinc-950/40" />
      <aside className={cn("relative h-full w-72 max-w-[85vw] border-r border-zinc-200 bg-white", isAdmin ? "xcn-admin-sidebar-frame" : "overflow-y-auto p-5")}>{sidebar(true)}</aside>
    </div>}
    <div className="lg:pl-64">
      <header className="xcn-app-header sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-zinc-200 bg-white/95 py-3">
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Mở menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 lg:hidden"><Menu size={19} /></button>
          <span className="text-base font-medium text-zinc-700">{role === "admin" ? "Quản trị" : "Không gian học viên"}</span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-500">{live ? "Supabase" : "Demo"}</span>
        </div>
        <Link href="/" className="text-xs font-semibold text-zinc-600 hover:text-ink">Về trang chủ</Link>
      </header>
      <main className="xcn-app-main">{children}</main>
    </div>
  </div>;
}
