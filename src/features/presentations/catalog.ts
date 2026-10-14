import {fileExplorerLesson} from "./data/file-explorer";
import {layoutGallery} from "./data/layout-gallery";
import {wordBasicsLessons} from "./data/word-basics";
import {excelBasicsLessons} from "./data/excel-basics";
import type {PresentationCourse,PresentationLesson} from "./types";

export const presentationCourses:PresentationCourse[] = [
  {
    id:"tin-hoc-co-ban",
    title:"Tin học cơ bản",
    description:"Quản lý tệp và thư mục trên Windows, nền tảng trước khi học Word và Excel.",
    lessons:[fileExplorerLesson,layoutGallery] as PresentationLesson[]
  },
  {
    id:"word-co-ban",
    title:"Word cơ bản",
    description:"Soạn thảo, định dạng văn bản, bố cục trang, bảng, hình ảnh, rà soát và xuất bản.",
    lessons:wordBasicsLessons
  },
  {
    id:"excel-co-ban",
    title:"Excel cơ bản",
    description:"Bảng tính, định dạng dữ liệu, công thức và hàm, lọc/sắp xếp, biểu đồ và bài thực hành tổng hợp.",
    lessons:excelBasicsLessons
  }
];

/** Preserve old bookmarked presentation links; never rewrite other course IDs. */
export const legacyPresentationLessonIds:Record<string,string> = {
  "buoi-01-file-explorer": "quan-ly-tep-va-thu-muc"
};
export function canonicalPresentationLessonId(id:string) {
  return legacyPresentationLessonIds[id]??id;
}
export const allPresentationLessons=presentationCourses.flatMap(course=>
  course.lessons.map(lesson=>({course,lesson}))
);
export function findPresentationLesson(id:string) {
  return allPresentationLessons.find(record=>record.lesson.id===canonicalPresentationLessonId(id));
}
