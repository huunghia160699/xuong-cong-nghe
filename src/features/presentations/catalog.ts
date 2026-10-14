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
  lessonIds: ["buoi-01-file-explorer"],
}] as const;

export const allPresentationLessons = presentationCourses.flatMap(course =>
  course.lessons.map(lesson => ({course, lesson}))
);

export function findPresentationLesson(id: string) {
  return allPresentationLessons.find(record => record.lesson.id === id);
}

export function presentationClassHasLesson(classId: string, courseId: string, lessonId: string) {
  return presentationClasses.some(group =>
    group.id === classId && group.courseId === courseId &&
    (group.lessonIds as readonly string[]).includes(lessonId));
}
