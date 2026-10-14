import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Maximize2, Presentation } from "lucide-react";

export const metadata: Metadata = {
  title: "Trình chiếu bài giảng",
  description: "Thư viện trình chiếu Tin học cơ bản với tương tác, mô phỏng File Explorer và ghi chú giảng viên.",
};

const pptBase = "/apps/ppt";
const sessionUrl = pptBase + "/slides.html?course=tin-hoc-co-ban&lesson=buoi-01-file-explorer&class=hl-26-27";
const galleryUrl = pptBase + "/slides.html?course=tin-hoc-co-ban&lesson=layout-gallery";

export default function PresentationToolPage() {
  return <main className="bg-paper">
    <div className="mx-auto max-w-[1680px] px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/cong-cu" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-ink">
        <ArrowLeft size={16}/> Tất cả công cụ
      </Link>
      <div className="mt-6 flex flex-col gap-6 border-b border-zinc-200 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[.14em] text-zinc-500">
            <Presentation size={20} className="text-ink"/> Học liệu tương tác
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Thư viện bài giảng</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
            Một nguồn bài giảng dùng chung cho các lớp. Bộ Tin học cơ bản hiện có 29 slide Buổi 1,
            5 câu hỏi tương tác và thư viện mẫu 15 bố cục. Sử dụng mũi tên để chuyển slide;
            phím N để mở ghi chú và F để trình chiếu toàn màn hình.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={sessionUrl} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold hover:border-zinc-900">
            <Maximize2 size={17}/> Mở Buổi 1
          </a>
          <a href={galleryUrl} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold hover:border-zinc-900">
            15 bố cục mẫu <ExternalLink size={16}/>
          </a>
          <a href={pptBase + "/index.html"} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
            Mở thư viện riêng <ExternalLink size={16}/>
          </a>
        </div>
      </div>
      <div className="mt-7 border border-zinc-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 text-xs font-medium text-zinc-500">
          <span>Bài giảng tương tác được tích hợp trong Xưởng Công Nghệ</span>
          <span className="hidden sm:block">Trình chiếu trực tiếp · HTML</span>
        </div>
        <iframe
          title="Thư viện trình chiếu Tin học cơ bản"
          src={pptBase + "/index.html"}
          className="h-[75dvh] min-h-[620px] w-full border-0"
          allowFullScreen
          loading="eager"
        />
      </div>
      <p className="mt-4 text-xs leading-6 text-zinc-500">
        Bài giảng vẫn giữ nguyên các chức năng tương tác của dự án PPT gốc.
        Công cụ hiện chưa hỗ trợ biên tập kéo thả hoặc tải xuống PowerPoint (.pptx).
      </p>
    </div>
  </main>;
}
