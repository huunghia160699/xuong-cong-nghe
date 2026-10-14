import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { publicNav } from "@/config/navigation";
import { isLiveMode } from "@/lib/supabase/config";

export function PublicHeader() {
  const live = isLiveMode();
  return <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95">
    <div className="xcn-container flex min-h-[72px] flex-wrap items-center justify-between gap-3 py-2.5">
      <Brand />
      <nav className="flex max-w-full flex-wrap items-center gap-3 lg:gap-5" aria-label="Điều hướng chính">
        {publicNav.map((item) => <Link key={item.label} href={item.href} className="text-sm font-medium text-zinc-600 hover:text-ink">{item.label}</Link>)}
      </nav>
      <div className="flex items-center gap-2">
        {live && <Button href="/dang-nhap" variant="ghost" size="sm">Đăng nhập</Button>}
        <Button href={live ? "/dang-ky" : "/student"} size="sm">{live ? "Đăng ký" : "Học thử"}</Button>
      </div>
    </div>
  </header>;
}
