import 'server-only';

import { cache } from 'react';
import { z } from 'zod';
import { requestCategories, requestCourse, requestCourseList, requestCourseTopics, type CourseListParams } from './api';
import { CoursePlatformError, getCoursePlatformBaseUrl } from './client';
import { categoriesResponseSchema, courseListResponseSchema, courseResponseSchema, topicsResponseSchema, toCourse, type CourseList } from './course-contract';

function parse<T>(schema: z.ZodType<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) throw new CoursePlatformError('ساختار اطلاعات دریافتی از سرور معتبر نیست.', 502);
  return result.data;
}

export async function getCourses(params: CourseListParams = {}): Promise<CourseList> {
  const { data } = parse(courseListResponseSchema, await requestCourseList(params));
  return { courses: data.data.map(item => toCourse(item, getCoursePlatformBaseUrl())), page: data.pagination.currentPage, pageCount: data.pagination.totalPage, total: data.pagination.totalcourses, limit: data.pagination.limit };
}

export const getCategories = cache(async () => {
  return parse(categoriesResponseSchema, await requestCategories()).data.data;
});

export const getCourse = cache(async (id: string) => {
  const { data } = parse(courseResponseSchema, await requestCourse(id));
  return toCourse(data.course, getCoursePlatformBaseUrl());
});

export const getCourseTopics = cache(async (id: string) => {
  return parse(topicsResponseSchema, await requestCourseTopics(id)).data.topics;
});
