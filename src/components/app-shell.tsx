"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/brand";
import { adminNav, studentNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ role, children }: { role: "student" | "admin"; children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = role === "admin" ? adminNav : studentNav;

  const sidebar = (mobile: boolean) => <div className="flex h-full flex-col">
    <div className="flex items-center justify-between"><Brand />{mobile && <button type="button" onClick={() => setMenuOpen(false)} aria-label="Đóng menu" className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200"><X size={19} /></button>}</div>
    <div className="mt-9 text-[10px] font-bold uppercase tracking-[.2em] text-zinc-400">{role === "admin" ? "Khu vực quản trị (demo)" : "Không gian học tập"}</div>
    <nav className="mt-3 space-y-1" aria-label={role === "admin" ? "Menu quản trị" : "Menu học viên"}>
      {nav.map((item) => {
        const active = item.href.split("#")[0] === pathname && !item.href.includes("#");
        const Icon = item.icon;
        return <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
          className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-ink", active && "bg-ink text-white hover:bg-ink hover:text-white")}>
          <Icon size={17} /><span>{item.label}</span>
        </Link>;
      })}
    </nav>
    <div className="mt-auto rounded-xl border border-zinc-200 bg-paper p-4">
      <div className="text-xs font-semibold">Chế độ trình diễn</div>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{role === "admin" ? "Trang quản trị chưa kết nối tài khoản và phân quyền. Không nhập dữ liệu thực." : "Bài học và kết quả hiện được lưu tại trình duyệt này; chưa đồng bộ tài khoản."}</p>
    </div>
  </div>;

  return <div className="min-h-screen bg-[#f6f6f2]">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-zinc-200 bg-white p-5 lg:flex">{sidebar(false)}</aside>
    {menuOpen && <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" aria-label="Đóng menu điều hướng" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-zinc-950/40" />
      <aside className="relative h-full w-72 max-w-[85vw] overflow-y-auto border-r border-zinc-200 bg-white p-5">{sidebar(true)}</aside>
    </div>}
    <div className="lg:pl-64">
      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-zinc-200 bg-white/95 px-5 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Mở menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 lg:hidden"><Menu size={19} /></button>
          <span className="text-sm font-medium text-zinc-700">{role === "admin" ? "Quản trị" : "Không gian học viên"}</span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-500">Demo</span>
        </div>
        <Link href="/" className="text-xs font-semibold text-zinc-600 hover:text-ink">Về trang chủ</Link>
      </header>
      <main className="p-5 lg:p-8">{children}</main>
    </div>
  </div>;
}
