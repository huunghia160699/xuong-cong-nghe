/** Independent class catalog; lesson content is shared across classes. */
export const classGroups = {
  'hl-26-27': {
    id: 'hl-26-27',
    name: 'HL.26-27',
    description: 'Lớp vừa làm vừa học',
    schoolYear: '2026–2027',
    offerings: [
      { courseId: 'tin-hoc-co-ban', lessonIds: ['buoi-01-file-explorer'] }
    ]
  }
};

export function classesForCourse(courseId) {
  return Object.values(classGroups).filter(group =>
    group.offerings.some(offering => offering.courseId === courseId));
}

export function classHasLesson(group, courseId, lessonId) {
  if (!group) return false;
  const offering = group.offerings.find(item => item.courseId === courseId);
  return !!offering && (!offering.lessonIds || offering.lessonIds.includes(lessonId));
}
