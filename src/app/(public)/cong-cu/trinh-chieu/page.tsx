import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, FileText, Layers3, Presentation } from "lucide-react";
import { allPresentationLessons, presentationCourses } from "@/features/presentations/catalog";

export const metadata: Metadata = {
  title: "Thư viện trình chiếu",
  description: "Thư viện trình chiếu theo các phần nội dung Tin học, thiết kế đồng bộ Xưởng Công Nghệ.",
};

export default function PresentationLibraryPage() {
  const lessons = allPresentationLessons.filter(entry => entry.lesson.kind !== "showcase");
  const examples = allPresentationLessons.filter(entry => entry.lesson.kind === "showcase");
  return <main className="min-h-screen bg-paper text-ink">
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <Link href="/cong-cu" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-ink">
        <ArrowLeft size={16}/> Tất cả công cụ
      </Link>
      <div className="mt-10 grid gap-10 border-b border-zinc-200 pb-12 lg:grid-cols-[1fr_340px] lg:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-[.18em] text-zinc-500">CÔNG CỤ / TRÌNH CHIẾU THEO CHỦ ĐỀ</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-[-.055em] sm:text-6xl">Thư viện trình chiếu.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600">
            Tổ chức Tin học theo từng phần kiến thức, không phụ thuộc số buổi dạy. Trình chiếu trực tiếp trên trình duyệt,
            luyện tương tác và dùng chung nội dung cho nhiều lớp.
          </p>
        </div>
        <div className="grid grid-cols-3 border border-zinc-200 bg-white">
          {[{value:presentationCourses.length,label:"Môn học"},
            {value:lessons.length,label:"Chủ đề"},
            {value:lessons.reduce((sum,x)=>sum+x.lesson.slides.length,0),label:"Slide"}].map(item=>
            <div key={item.label} className="border-r border-zinc-200 p-4 last:border-r-0">
              <strong className="text-3xl font-bold tracking-tight">{String(item.value).padStart(2,"0")}</strong>
              <p className="mt-2 text-xs text-zinc-500">{item.label}</p>
            </div>)}
        </div>
      </div>
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">CÁC PHẦN NỘI DUNG</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Học theo từng phần</h2>
          </div>
          <span className="text-sm text-zinc-500">Môn học → Phần nội dung → Slide</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {lessons.map(({course,lesson})=><Link key={lesson.id} href={"/cong-cu/trinh-chieu/"+lesson.id}
            className="group flex min-h-64 flex-col border border-zinc-200 bg-white p-7 transition hover:border-ink hover:shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <Presentation size={26}/>
              
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-zinc-500">{course.title}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{lesson.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{lesson.subtitle}</p>
            <div className="mt-auto flex items-center justify-between border-t border-zinc-200 pt-5 text-sm">
              <span className="text-zinc-500">{lesson.slides.length} slide · câu hỏi & mô phỏng</span>
              <span className="inline-flex items-center gap-2 font-semibold">Trình chiếu <ArrowRight size={16}/></span>
            </div>
          </Link>)}
        </div>
      </section>
      <section className="mt-14 border-t border-zinc-200 pt-10">
        <div className="flex items-center gap-2"><Layers3 size={20}/><h2 className="text-2xl font-bold tracking-tight">Thư viện bố cục</h2></div>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">Các mẫu này dùng để kiểm tra giao diện và biên soạn bài giảng mới. Không tính là phần học chính thức.</p>
        {examples.map(({lesson})=><Link key={lesson.id} href={"/cong-cu/trinh-chieu/"+lesson.id}
          className="mt-5 flex flex-wrap items-center justify-between gap-4 border border-zinc-200 bg-white p-6 hover:border-ink">
          <div className="flex items-center gap-4"><BookOpen size={22}/>
            <div><strong className="text-lg">{lesson.title}</strong><p className="mt-1 text-sm text-zinc-500">{lesson.slides.length} mẫu · dùng chung hệ thiết kế Xưởng Công Nghệ</p></div>
          </div><ArrowRight size={18}/>
        </Link>)}
      </section>
    </div>
  </main>;
}
