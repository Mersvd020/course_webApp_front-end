import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourse, getCourseTopics, getCourses } from '@/util/service/course-platform/courses';
import { CoursePlatformError } from '@/util/service/course-platform/client';
import CourseDetail from '@/components/courses/CourseDetail';
import CourseServiceError from '@/components/courses/CourseServiceError';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const course = await getCourse(slug);
    return { title: `${course.title} | آکادمی رویش`, description: course.description };
  } catch { return { title: 'جزئیات دوره | آکادمی رویش' }; }
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  let course;
  try { course = await getCourse(slug); }
  catch (error) {
    if (error instanceof CoursePlatformError && error.status === 404) notFound();
    return <section className="academy-container section-space"><CourseServiceError message={error instanceof CoursePlatformError ? error.message : undefined} /></section>;
  }
  const [topics, related] = await Promise.allSettled([getCourseTopics(slug), getCourses({ limit: 4, page: 1 })]);
  return <CourseDetail course={course} topics={topics.status === 'fulfilled' ? topics.value : []} topicsError={topics.status === 'rejected' ? 'دریافت سرفصل‌ها ممکن نشد. دوباره تلاش کنید.' : undefined} related={related.status === 'fulfilled' ? related.value.courses.filter(item => item.id !== course.id).slice(0, 3) : []} />;
}
