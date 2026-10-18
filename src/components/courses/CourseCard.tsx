import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpLeft, BookOpen, Code2 } from 'lucide-react';
import { Course, coursePrice, persianNumber } from '@/data/courses';

export function CourseArtwork({ course }: { course: Course }) {
  return <div className={`course-art art-${course.theme}`} aria-hidden="true">
    {course.coverUrl && <Image src={course.coverUrl} alt="" fill unoptimized className="course-cover-image" sizes="(max-width: 650px) 100vw, 400px" />}
    <span className="art-grid" /><span className="art-orbit orbit-one" /><span className="art-orbit orbit-two" />
    <span className="art-tag">{course.isPublished ? 'دوره آموزشی' : 'در حال آماده‌سازی'}</span>{!course.coverUrl && <div className="art-symbol"><Code2 strokeWidth={1.3} /><b dir="auto">{course.title.slice(0, 20)}</b></div>}
    <span className="art-caption">LEARN. BUILD. GROW.</span><span className="art-spark">✳</span>
  </div>;
}

export default function CourseCard({ course }: { course: Course }) {
  return <article className="course-card">
    <Link href={`/courses/${course.id}`} className="course-art-link" aria-label={`مشاهده دوره ${course.title}`}><CourseArtwork course={course} /></Link>
    <div className="course-card-body">
      <div className="card-eyebrow"><span>{course.categories.map(item => item.name).join('، ') || 'آموزش مهارت'}</span><BookOpen size={14} /></div>
      <h3><Link href={`/courses/${course.id}`}>{course.title}</Link></h3>
      <p className="card-subtitle course-description-clamp" dir="auto">{course.description}</p>
      {course.teacher && <div className="teacher-line"><span className={`avatar avatar-${course.theme}`}>{course.initials}</span><span>{course.teacher}</span></div>}
      <div className="card-meta"><span>{course.isPublished ? 'منتشرشده' : 'در حال تکمیل محتوا'}</span>{course.topics.length > 0 && <span>{persianNumber(course.topics.length)} سرفصل</span>}</div>
      <div className="card-bottom"><div className="price-group"><strong>{coursePrice(course.price)} <small>{course.price > 0 ? 'تومان' : ''}</small></strong></div><Link className="card-arrow" href={`/courses/${course.id}`} aria-label={`جزئیات ${course.title}`}><ArrowUpLeft size={21} /></Link></div>
    </div>
  </article>;
}
