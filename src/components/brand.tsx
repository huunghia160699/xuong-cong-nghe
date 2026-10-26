import Link from "next/link";

export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" className="xcn-brand group inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap">
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-black ${light ? "border-white/25 bg-white text-ink" : "border-blue/25 bg-ink text-cyan"}`}>X</span>
    <span className={`xcn-brand-name whitespace-nowrap font-extrabold uppercase ${light ? "text-white" : "text-ink"}`}>Xưởng Công Nghệ</span>
  </Link>;
}
