import { api } from "@/lib/api";

import { mockCourses } from "@/lib/mock-courses";
import type { Course, CourseResult, Topic } from "@/types/course";
import { number, record, text, unwrap } from "./response";

const requestOptions = { timeout: 5000 };

export function normalizeCourse(value: unknown): Course | null {
  const item = record(value);
  const id = text(item.id ?? item.courseId ?? item._id);
  const title = text(item.title ?? item.name);
  const price = number(item.price);
  if (!id || !title || price === undefined) return null;
  const teacher = record(item.teacher ?? item.instructor);
  return {
    id,
    title,
    price,
    description: text(
      item.description,
      "توضیحات این دوره به‌زودی تکمیل می‌شود.",
    ),
    instructor: text(
      item.instructor ?? item.teacherName,
      text(teacher.fullName ?? teacher.name, "مدرس دوره"),
    ),
    image: text(
      item.image ?? item.imageUrl ?? item.cover,
      "/courses/default.svg",
    ),
    discountedPrice: number(item.discountedPrice ?? item.discountPrice),
    rating: number(item.rating),
    views: number(item.views ?? item.viewCount),
    students: number(item.students ?? item.studentCount),
    duration: text(item.duration),
    category: text(item.category, text(record(item.category).name, "تخصصی")),
    level: text(item.level),
  };
}

function normalizeTopics(value: unknown): Topic[] {
  const data = unwrap(value);
  const items = Array.isArray(data) ? data : record(data).topics;
  if (!Array.isArray(items)) return [];
  return items.map((entry, index) => {
    const topic = record(entry);
    const lessons = topic.lessons ?? topic.videos;
    return {
      id: text(topic.id, String(index)),
      title: text(topic.title ?? topic.name, "سرفصل دوره"),
      lessons: Array.isArray(lessons)
        ? lessons.map((entry, index) => {
            const lesson = record(entry);
            return {
              id: text(lesson.id, String(index)),
              title: text(lesson.title ?? lesson.name, "جلسه آموزشی"),
              duration: text(lesson.duration),
            };
          })
        : [],
    };
  });
}

export async function getCourses(): Promise<CourseResult<Course[]>> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true")
    return { data: mockCourses, source: "mock" };
  try {
    const response = await api.get("/course/getAllCourseWithPagination", {
      ...requestOptions,
      params: {
        search: "",
        limit: 100,
        page: 1,
        sortType: "null",
        order: "asc",
        minPrice: "null",
        maxPrice: "null",
      },
    });
    const data = unwrap(response.data);
    const items = Array.isArray(data)
      ? data
      : (record(data).courses ?? record(data).items ?? record(data).data);
    const courses = Array.isArray(items)
      ? items
          .map(normalizeCourse)
          .filter((course): course is Course => course !== null)
      : [];
    if (courses.length) return { data: courses, source: "api" };
  } catch {
    // An unavailable or empty catalog intentionally falls back to the demo catalog.
  }
  return { data: mockCourses, source: "mock" };
}

export async function getCourse(
  id: string,
): Promise<CourseResult<Course | null>> {
  const mock = mockCourses.find((course) => course.id === id);
  if (mock) return { data: mock, source: "mock" };
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true")
    return { data: null, source: "mock" };
  try {
    const response = await api.get(
      `/course/${encodeURIComponent(id)}`,
      requestOptions,
    );
    const data = unwrap(response.data);
    const course = normalizeCourse(record(data).course ?? data);
    if (!course) return { data: null, source: "api" };
    try {
      const topics = await api.get(
        `/course/${encodeURIComponent(id)}/topics`,
        requestOptions,
      );
      course.topics = normalizeTopics(topics.data);
    } catch {
      course.topics = [];
    }
    return { data: course, source: "api" };
  } catch (error) {
    if (record(record(error).response).status === 404)
      return { data: null, source: "api" };
    throw new Error("دریافت دوره امکان‌پذیر نیست. دوباره تلاش کنید.");
  }
}
