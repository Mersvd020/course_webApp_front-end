export type { Course, CourseCategory, CourseTopic, CourseList } from '@/util/service/course-platform/course-contract';

export const persianNumber = (value: number) => value.toLocaleString('fa-IR');
export const coursePrice = (value: number) => value === 0 ? 'رایگان' : persianNumber(value);
