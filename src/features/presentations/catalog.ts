import { fileExplorerLesson } from "./data/file-explorer";
import { layoutGallery } from "./data/layout-gallery";
import type { PresentationCourse, PresentationLesson } from "./types";

const lessons: PresentationLesson[] = [
  fileExplorerLesson as PresentationLesson,
  layoutGallery as PresentationLesson,
];

export const presentationCourses: PresentationCourse[] = [{
  id: "tin-hoc-co-ban",
  title: "Tin học cơ bản",
  description: "Bài giảng Windows, Word và Excel, dùng chung cho các lớp học.",
  lessons,
}];

export const presentationClasses = [{
  id: "hl-26-27",
  name: "HL.26-27",
  schoolYear: "2026–2027",
  courseId: "tin-hoc-co-ban",
  lessonIds: ["quan-ly-tep-va-thu-muc"],
}] as const;

/**
 * Public old URLs continue to work, but all new links use topic-based slugs.
 * Only the presentation curriculum changes: quiz/course lesson IDs elsewhere
 * on XCN are independent and must not be rewritten.
 */
export const legacyPresentationLessonIds: Record<string,string> = {
  "buoi-01-file-explorer": "quan-ly-tep-va-thu-muc",
};

export function canonicalPresentationLessonId(id: string) {
  return legacyPresentationLessonIds[id] ?? id;
}

export const allPresentationLessons = presentationCourses.flatMap(course =>
  course.lessons.map(lesson => ({course, lesson}))
);

export function findPresentationLesson(id: string) {
  return allPresentationLessons.find(record => record.lesson.id === canonicalPresentationLessonId(id));
}

export function presentationClassHasLesson(classId: string, courseId: string, lessonId: string) {
  return presentationClasses.some(group =>
    group.id === classId && group.courseId === courseId &&
    (group.lessonIds as readonly string[]).includes(lessonId));
}
