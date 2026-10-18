import type { Metadata } from 'next';
import Landing from '@/components/courses/Landing';
import { getCategories, getCourses } from '@/util/service/course-platform/courses';
import { CoursePlatformError } from '@/util/service/course-platform/client';

export const metadata: Metadata = { title: 'رویش | از یادگیری تا ساختن آینده', description: 'دوره‌های کاربردی برنامه‌نویسی، طراحی، بازاریابی و کسب‌وکار. مهارت بعدی خود را در آکادمی رویش پیدا کنید.' };

export default async function HomePage() {
  const [list, categories] = await Promise.allSettled([getCourses({ limit: 3, page: 1 }), getCategories()]);
  return <Landing courses={list.status === 'fulfilled' ? list.value.courses : []} categories={categories.status === 'fulfilled' ? categories.value : []} error={list.status === 'rejected' ? list.reason instanceof CoursePlatformError ? list.reason.message : 'دریافت دوره‌ها ممکن نشد.' : undefined} />;
}
