import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,Layers3,Presentation} from "lucide-react";
import {presentationCourses,allPresentationLessons} from "@/features/presentations/catalog";

export const metadata:Metadata = {
  title:"Thư viện trình chiếu",
  description:"Bộ slide Tin học, Word cơ bản và Excel cơ bản theo chủ đề, có trắc nghiệm và bài thực hành."
};

export default function PresentationLibraryPage() {
  const groups=presentationCourses.map(course=>({
    course,lessons:course.lessons.filter(lesson=>lesson.kind!=="showcase")
  })).filter(group=>group.lessons.length);
  const examples=allPresentationLessons.filter(entry=>entry.lesson.kind==="showcase");
  const lessonCount=groups.reduce((sum,group)=>sum+group.lessons.length,0);
  const slideCount=groups.reduce((sum,group)=>sum+group.lessons.reduce((n,l)=>n+l.slides.length,0),0);
  return <main className="bg-paper text-ink">
    <div className="xcn-container xcn-page-pad">
      <Link href="/cong-cu" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-blue">
        <ArrowLeft size={16}/> Tất cả công cụ
      </Link>
      <div className="xcn-page-heading border-b border-zinc-200 pb-[clamp(18px,3dvh,30px)]">
        <span className="text-xs font-bold uppercase tracking-[.18em] text-zinc-500">CÔNG CỤ / BÀI GIẢNG TIN HỌC</span>
        <h1 className="mt-2 max-w-4xl text-4xl font-bold leading-tight tracking-[-.055em] sm:text-6xl">Thư viện trình chiếu.</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-zinc-600">
          Ba nhóm nội dung độc lập: Windows, Word cơ bản và Excel cơ bản. Mỗi chủ đề có kiến thức, ví dụ, bài thực hành và câu hỏi ôn tập.
        </p>
        <p className="mt-4 text-sm font-medium text-ink">{lessonCount} chủ đề · {slideCount} slide học tập · nhập tên lớp khi trình chiếu</p>
      </div>
      {groups.map(({course,lessons})=><section key={course.id} id={course.id} className="xcn-section-gap scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[.16em] text-blue">CHƯƠNG TRÌNH</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{course.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">{course.description}</p>
          </div>
          <span className="whitespace-nowrap text-sm text-zinc-500">{lessons.length} chủ đề · {lessons.reduce((n,l)=>n+l.slides.length,0)} slide</span>
        </div>
        <div className="mt-4 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson,index)=><Link key={lesson.id} href={"/cong-cu/trinh-chieu/"+lesson.id}
            className="group flex h-full min-w-0 flex-col border border-zinc-200 bg-white p-5 transition hover:border-blue hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">
            <div className="flex items-start justify-between gap-3 text-blue">
              <Presentation size={26} aria-hidden="true"/>
              <span className="text-sm font-semibold text-zinc-500">{String(index+1).padStart(2,"0")}</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">{lesson.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{lesson.subtitle}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 pt-4 text-sm">
              <span className="text-zinc-500">{lesson.slides.length} slide · trắc nghiệm & thực hành</span>
              <span className="inline-flex items-center gap-2 font-semibold text-blue">Trình chiếu <ArrowRight size={16}/></span>
            </div>
          </Link>)}
        </div>
      </section>)}
      <section className="xcn-section-gap border-t border-zinc-200 pt-[clamp(18px,3dvh,30px)]">
        <div className="flex items-center gap-2"><Layers3 size={20}/><h2 className="text-2xl font-bold tracking-tight">Thư viện bố cục</h2></div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">Mẫu kiểm tra thành phần trình chiếu. Không nằm trong chương trình học.</p>
        {examples.map(({lesson})=><Link key={lesson.id} href={"/cong-cu/trinh-chieu/"+lesson.id}
          className="mt-4 flex flex-wrap items-center justify-between gap-4 border border-zinc-200 bg-white p-4 hover:border-blue sm:p-5">
          <div className="flex items-center gap-4"><BookOpen size={22}/>
            <div><strong className="text-lg">{lesson.title}</strong><p className="mt-1 text-sm text-zinc-500">{lesson.slides.length} mẫu · dùng chung hệ thiết kế Xưởng Công Nghệ</p></div>
          </div><ArrowRight size={18}/>
        </Link>)}
      </section>
    </div>
  </main>;
}
