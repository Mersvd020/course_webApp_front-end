import type { Metadata } from 'next';
import Catalog, { CatalogQuery } from '@/components/courses/Catalog';
import { getCategories, getCourses } from '@/util/service/course-platform/courses';
import { CoursePlatformError } from '@/util/service/course-platform/client';
import type { CourseListParams } from '@/util/service/course-platform/api';

export const metadata: Metadata = { title: 'دوره‌های آموزشی | آکادمی رویش', description: 'جست‌وجو و فیلتر دوره‌ها بر اساس موضوع، سطح آموزش و قیمت.' };

export default async function CoursesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query: CatalogQuery = {};
  for (const key of ['search', 'price', 'sort', 'page', 'minPrice', 'maxPrice'] as const) {
    if (typeof params[key] === 'string') query[key] = params[key];
  }
  const positiveInteger = (value?: string) => value && /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : undefined;
  const page = Math.max(1, positiveInteger(query.page) ?? 1);
  const request: CourseListParams = { search: query.search, page, limit: 6 };
  if (query.price === 'free') request.maxPrice = 0;
  else if (query.price === 'paid') request.minPrice = 1;
  else if (query.price === 'under-million') request.maxPrice = 1000000;
  if (query.price !== 'free' && query.price !== 'paid' && query.price !== 'under-million') {
    request.minPrice = positiveInteger(query.minPrice);
    request.maxPrice = positiveInteger(query.maxPrice);
  }
  if (query.sort === 'cheap' || query.sort === 'expensive') {
    request.sortType = 'price';
    request.order = query.sort === 'cheap' ? 'asc' : 'desc';
  } else if (query.sort === 'new') {
    request.sortType = 'createdAt'; request.order = 'desc';
  }
  const [list, categories] = await Promise.allSettled([getCourses(request), getCategories()]);
  return <Catalog query={query} list={list.status === 'fulfilled' ? list.value : { courses: [], page, pageCount: 0, total: 0, limit: 6 }} categories={categories.status === 'fulfilled' ? categories.value : []} error={list.status === 'rejected' ? list.reason instanceof CoursePlatformError ? list.reason.message : 'دریافت دوره‌ها ممکن نشد.' : undefined} />;
}
