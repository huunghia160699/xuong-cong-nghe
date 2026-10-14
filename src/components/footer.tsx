import { Brand } from "@/components/brand";

const columns = [
  { title: "Học", links: ["Khóa học", "Lộ trình", "Luyện tập"] },
  { title: "Khám phá", links: ["Tài nguyên", "Công cụ", "Dự án", "Bài viết"] },
  { title: "Thông tin", links: ["Giới thiệu", "Liên hệ", "Điều khoản", "Bảo mật"] },
];

export function Footer() {
  return <footer className="bg-ink text-white"><div className="xcn-container grid gap-8 py-12 lg:grid-cols-[1.5fr_2fr]"><div><Brand light /><p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">Học kiến thức, luyện kỹ năng và ứng dụng công nghệ vào những dự án thật.</p></div><div className="grid grid-cols-2 gap-8 sm:grid-cols-3">{columns.map((column) => <div key={column.title}><h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{column.title}</h3><ul className="mt-3 space-y-2 text-sm text-zinc-300">{column.links.map((link) => <li key={link}><a href="#" className="hover:text-white">{link}</a></li>)}</ul></div>)}</div></div><div className="xcn-container flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-zinc-500 sm:flex-row sm:justify-between"><span>© 2026 Xưởng Công Nghệ</span><span>Học • Luyện • Ứng dụng</span></div></footer>;
}
