import Link from "next/link";
import { Menu } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { publicNav } from "@/config/navigation";
import { isLiveMode } from "@/lib/supabase/config";

export function PublicHeader() {
  const live = isLiveMode();
  return <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95">
    <div className="xcn-container xcn-header-inner">
      <Brand />
      <nav className="xcn-header-nav" aria-label="Điều hướng chính">
        {publicNav.map((item) => <Link key={item.label} href={item.href} className="text-sm font-medium text-zinc-600 hover:text-ink">{item.label}</Link>)}
      </nav>
      <div className="xcn-header-actions flex shrink-0 items-center gap-2">
        {live && <Button href="/dang-nhap" variant="ghost" size="sm">Đăng nhập</Button>}
        <Button href={live ? "/dang-ky" : "/student"} size="sm">{live ? "Đăng ký" : "Học thử"}</Button>
      </div>
      <details className="xcn-header-menu">
        <summary className="xcn-header-menu-toggle" aria-label="Mở menu điều hướng">
          <Menu size={20} aria-hidden="true" />
        </summary>
        <nav className="xcn-header-menu-panel" aria-label="Điều hướng trên điện thoại">
          {publicNav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          <div className="xcn-header-menu-divider" />
          {live && <Link href="/dang-nhap">Đăng nhập</Link>}
          <Link href={live ? "/dang-ky" : "/student"}>{live ? "Đăng ký" : "Học thử"}</Link>
        </nav>
      </details>
    </div>
  </header>;
}
