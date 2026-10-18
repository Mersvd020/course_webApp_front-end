import { z } from 'zod';

const categorySchema = z.object({ id: z.number(), name: z.string() });
const lessonSchema = z.object({ id: z.string(), lessonName: z.string() });
const topicSchema = z.object({ id: z.number(), topicName: z.string(), courseLesson: z.array(lessonSchema) });
const courseSchema = z.object({
  id: z.string().min(1), title: z.string(), description: z.string(), price: z.number().nonnegative(),
  teacherName: z.string().nullable().optional(), courseCoverUrl: z.string().nullable().optional(),
  isPublished: z.boolean(), createdAt: z.string(),
  category: z.array(categorySchema).optional(), courseTopic: z.array(topicSchema).optional(),
});

export const courseListResponseSchema = z.object({ data: z.object({
  pagination: z.object({ currentPage: z.number().int().positive(), limit: z.number().int().positive(), totalcourses: z.number().int().nonnegative(), totalPage: z.number().int().nonnegative() }),
  data: z.array(courseSchema),
}) });
export const courseResponseSchema = z.object({ data: z.object({ course: courseSchema }) });
export const categoriesResponseSchema = z.object({ data: z.object({ data: z.array(categorySchema) }) });
export const topicsResponseSchema = z.object({ data: z.object({ topics: z.array(topicSchema) }) });

export type PlatformCourse = z.infer<typeof courseSchema>;
export type CourseCategory = z.infer<typeof categorySchema>;
export type CourseTopic = z.infer<typeof topicSchema>;
export type CourseList = { courses: Course[]; page: number; pageCount: number; total: number; limit: number };
export type Course = {
  id: string; title: string; description: string; price: number; teacher: string | null;
  coverUrl: string | null; isPublished: boolean; categories: CourseCategory[];
  topics: CourseTopic[]; theme: string; initials: string;
};

export function toCourse(source: PlatformCourse, baseUrl: string): Course {
  let coverUrl: string | null = null;
  if (source.courseCoverUrl) {
    try {
      const asset = new URL(source.courseCoverUrl, `${baseUrl}/`);
      if (asset.origin === new URL(baseUrl).origin && ['http:', 'https:'].includes(asset.protocol)) coverUrl = asset.toString();
    } catch { /* Invalid covers use the artwork fallback. */ }
  }
  const teacher = source.teacherName?.trim() || null;
  const colorIndex = [...source.id].reduce((total, char) => total + char.charCodeAt(0), 0) % 6;
  return {
    id: source.id, title: source.title, description: source.description, price: source.price,
    teacher, coverUrl, isPublished: source.isPublished, categories: source.category ?? [],
    topics: source.courseTopic ?? [], theme: ['violet', 'peach', 'mint', 'pink', 'yellow', 'blue'][colorIndex],
    initials: teacher ? teacher.split(/\s+/).slice(0, 2).map(part => part[0]).join(' ') : 'م',
  };
}
