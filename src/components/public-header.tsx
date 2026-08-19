import { Menu, Search } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { publicNav } from "@/config/navigation";

export function PublicHeader() {
  return <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8"><Brand /><nav className="hidden items-center gap-7 lg:flex">{publicNav.map((item) => <a key={item.label} href={item.href} className="text-sm font-medium text-zinc-600 transition hover:text-ink">{item.label}</a>)}</nav><div className="hidden items-center gap-2 md:flex"><button aria-label="Tìm kiếm" className="grid h-10 w-10 place-items-center rounded-full hover:bg-zinc-100"><Search size={18} /></button><Button href="/student" variant="ghost" size="sm">Đăng nhập</Button><Button href="/student" size="sm">Bắt đầu học</Button></div><button aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 md:hidden"><Menu size={18} /></button></div></header>;
}
