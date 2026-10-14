import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FileSpreadsheet, FileText, Presentation } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Công cụ",
  description: "Các công cụ học tập, trình chiếu và thực hành tại Xưởng Công Nghệ.",
};

export default function ToolsPage() {
  return <main className="min-h-[75vh] bg-paper">
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <span className="text-xs font-bold uppercase tracking-[.2em] text-zinc-500">Xưởng Công Nghệ / Công cụ</span>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Không gian công cụ</h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600">
        Tập hợp những sản phẩm và công cụ thực hành đang được phát triển tại Xưởng Công Nghệ.
        Mỗi công cụ hoạt động ngay trên website, không cần chuyển sang một hệ thống riêng.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/cong-cu/trinh-chieu" className="group flex min-h-[320px] flex-col border border-zinc-900 bg-ink p-7 text-white transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-start justify-between">
            <Presentation className="text-lime" size={34}/>
            <Badge className="border-lime/40 bg-lime/15 text-lime">Sử dụng được</Badge>
          </div>
          <div className="mt-auto">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">Công cụ trình chiếu</span>
            <h2 className="mt-3 text-2xl font-semibold">Thư viện bài giảng</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              29 slide Tin học cơ bản, câu hỏi tương tác, mô phỏng thao tác, thư viện 15 bố cục và ghi chú giảng viên.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-lime">Mở trình chiếu <ArrowRight size={16}/></div>
          </div>
        </Link>
        <div className="flex min-h-[320px] flex-col border border-zinc-200 bg-white p-7">
          <FileSpreadsheet size={32}/>
          <div className="mt-auto">
            <span className="text-xs text-zinc-500">Đang phát triển</span>
            <h2 className="mt-3 text-2xl font-semibold">Excel Lab</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">Luyện thao tác bảng tính và công thức ngay trong trình duyệt.</p>
          </div>
        </div>
        <div className="flex min-h-[320px] flex-col border border-zinc-200 bg-white p-7">
          <FileText size={32}/>
          <div className="mt-auto">
            <span className="text-xs text-zinc-500">Đang phát triển</span>
            <h2 className="mt-3 text-2xl font-semibold">Word Lab</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">Thực hành định dạng và biên soạn văn bản theo tình huống.</p>
          </div>
        </div>
      </div>
      <div className="mt-10 flex items-center gap-3 text-sm text-zinc-500"><BookOpen size={17}/><span>Thư viện bài giảng giữ nguyên nội dung dự án PPT gốc, chưa hỗ trợ xuất tệp .pptx.</span></div>
    </div>
  </main>;
}
