import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FileSpreadsheet, FileText, Presentation } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Công cụ",
  description: "Các công cụ học tập, trình chiếu và thực hành tại Xưởng Công Nghệ.",
};

export default function ToolsPage() {
  return <main className="bg-paper">
    <div className="xcn-container xcn-page-pad">
      <span className="text-xs font-bold uppercase tracking-[.2em] text-zinc-500">Xưởng Công Nghệ / Công cụ</span>
      <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Không gian công cụ</h1>
      <p className="mt-3 max-w-3xl text-base leading-8 text-zinc-600">
        Các công cụ học tập, trình chiếu và thực hành trên cùng nền tảng Xưởng Công Nghệ.
      </p>
      <div className="xcn-section-gap grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link href="/cong-cu/trinh-chieu" className="group flex min-h-0 flex-col border border-zinc-900 bg-ink p-5 text-white transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-start justify-between">
            <Presentation className="text-cyan" size={34}/>
            <Badge className="border-cyan/40 bg-cyan/15 text-cyan">Sử dụng được</Badge>
          </div>
          <div className="mt-5">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">Công cụ trình chiếu</span>
            <h2 className="mt-2 text-2xl font-semibold">Trình chiếu theo phần</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Học theo phần nội dung: quản lý tệp, File Explorer, câu hỏi tương tác và mô phỏng.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-cyan">Mở trình chiếu <ArrowRight size={16}/></div>
          </div>
        </Link>
        <div className="flex min-h-0 flex-col border border-zinc-200 bg-white p-5">
          <FileSpreadsheet size={32}/>
          <div className="mt-5">
            <span className="text-xs text-zinc-500">Đang phát triển</span>
            <h2 className="mt-2 text-2xl font-semibold">Excel Lab</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Luyện thao tác bảng tính và công thức ngay trong trình duyệt.</p>
          </div>
        </div>
        <div className="flex min-h-0 flex-col border border-zinc-200 bg-white p-5">
          <FileText size={32}/>
          <div className="mt-5">
            <span className="text-xs text-zinc-500">Đang phát triển</span>
            <h2 className="mt-2 text-2xl font-semibold">Word Lab</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Thực hành định dạng và biên soạn văn bản theo tình huống.</p>
          </div>
        </div>
      </div>
      <div className="xcn-section-gap flex items-center gap-3 border-t border-zinc-200 pt-4 text-sm text-zinc-500"><BookOpen size={17}/><span>Công cụ trình chiếu được xây dựng theo các phần chủ đề, chưa hỗ trợ xuất tệp .pptx.</span></div>
    </div>
  </main>;
}
