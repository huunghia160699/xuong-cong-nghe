import Link from "next/link";

export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" className="group flex items-center gap-3"><span className={`grid h-9 w-9 place-items-center rounded-full border text-xs font-black ${light ? "border-white/25 bg-white text-ink" : "border-zinc-300 bg-ink text-white"}`}>X</span><span className={`text-base font-extrabold uppercase tracking-[0.1em] ${light ? "text-white" : "text-ink"}`}>Xưởng Công Nghệ</span></Link>;
}
