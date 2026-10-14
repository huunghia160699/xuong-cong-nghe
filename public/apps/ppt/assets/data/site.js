import {courses} from './tin-hoc-co-ban.js';
import {classGroups,classesForCourse} from './classes.js';

const usableLessons = course => Object.values(course.lessons).filter(lesson => lesson.kind !== 'showcase');
export const siteData={
  title:'Thư viện bài giảng',
  subtitle:'Kho nội dung dùng chung cho nhiều lớp và môn học',
  courses:Object.values(courses).map(course=>({
    id:course.id,
    name:course.name,
    description:course.description,
    classes:classesForCourse(course.id).map(group=>({id:group.id,name:group.name})),
    lessons:usableLessons(course).map(lesson=>({
      id:lesson.id,
      title:lesson.title,
      label:lesson.label,
      slideCount:lesson.slides.length,
      subtitle:lesson.subtitle,
      href:`slides.html?course=${encodeURIComponent(course.id)}&lesson=${encodeURIComponent(lesson.id)}`
    }))
  })),
  classes:Object.values(classGroups).map(group=>({
    id:group.id,
    name:group.name,
    schoolYear:group.schoolYear,
    description:group.description,
    offerings:group.offerings.map(offering=>({
      courseId:offering.courseId,
      name:courses[offering.courseId]?.name || offering.courseId,
      lessonIds:offering.lessonIds || usableLessons(courses[offering.courseId] || {lessons:{}}).map(x=>x.id)
    }))
  }))
};
