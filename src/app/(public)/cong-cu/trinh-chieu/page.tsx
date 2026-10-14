import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Layers3, Presentation } from "lucide-react";
import { allPresentationLessons } from "@/features/presentations/catalog";

export const metadata: Metadata = {
  title: "Thư viện trình chiếu",
  description: "Thư viện trình chiếu theo các phần nội dung Tin học, thiết kế đồng bộ Xưởng Công Nghệ.",
};

export default function PresentationLibraryPage() {
  const lessons = allPresentationLessons.filter(entry => entry.lesson.kind !== "showcase");
  const examples = allPresentationLessons.filter(entry => entry.lesson.kind === "showcase");
  return <main className="bg-paper text-ink">
    <div className="xcn-container xcn-page-pad">
      <Link href="/cong-cu" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-ink">
        <ArrowLeft size={16}/> Tất cả công cụ
      </Link>
      <div className="xcn-page-heading border-b border-zinc-200 pb-[clamp(18px,3dvh,30px)]">
        <div>
          <span className="text-xs font-bold uppercase tracking-[.18em] text-zinc-500">CÔNG CỤ / TRÌNH CHIẾU THEO CHỦ ĐỀ</span>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-tight tracking-[-.055em] sm:text-6xl">Thư viện trình chiếu.</h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-zinc-600">
            Chọn chủ đề Tin học để trình chiếu và luyện tương tác. Nhập tên lớp khi mở bài giảng.
          </p>
        </div>

      </div>
      <section className="xcn-section-gap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Chủ đề Tin học</h2>
          <span className="text-sm text-zinc-500">{lessons.length} chủ đề</span>
        </div>
        <div className="mt-4 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lessons.map(({course,lesson})=><Link key={lesson.id} href={"/cong-cu/trinh-chieu/"+lesson.id}
            className="group flex h-full min-w-0 flex-col border border-zinc-200 bg-white p-5 transition hover:border-ink hover:shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <Presentation size={26}/>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-500">{course.title}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{lesson.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{lesson.subtitle}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 pt-4 text-sm">
              <span className="text-zinc-500">{lesson.slides.length} slide · câu hỏi & mô phỏng</span>
              <span className="inline-flex items-center gap-2 font-semibold">Trình chiếu <ArrowRight size={16}/></span>
            </div>
          </Link>)}
        </div>
      </section>
      <section className="xcn-section-gap border-t border-zinc-200 pt-[clamp(18px,3dvh,30px)]">
        <div className="flex items-center gap-2"><Layers3 size={20}/><h2 className="text-2xl font-bold tracking-tight">Thư viện bố cục</h2></div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">Các mẫu này dùng để kiểm tra giao diện và biên soạn bài giảng mới. Không phải chủ đề học.</p>
        {examples.map(({lesson})=><Link key={lesson.id} href={"/cong-cu/trinh-chieu/"+lesson.id}
          className="mt-4 flex flex-wrap items-center justify-between gap-4 border border-zinc-200 bg-white p-4 sm:p-5 hover:border-ink">
          <div className="flex items-center gap-4"><BookOpen size={22}/>
            <div><strong className="text-lg">{lesson.title}</strong><p className="mt-1 text-sm text-zinc-500">{lesson.slides.length} mẫu · dùng chung hệ thiết kế Xưởng Công Nghệ</p></div>
          </div><ArrowRight size={18}/>
        </Link>)}
      </section>
    </div>
  </main>;
}
