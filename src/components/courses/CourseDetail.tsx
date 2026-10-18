import Link from 'next/link';
import { ArrowLeft, Check, ChevronLeft, BookOpen, MonitorPlay, LockKeyhole } from 'lucide-react';
import { type Course, type CourseTopic, coursePrice, persianNumber } from '@/data/courses';
import CourseCard, { CourseArtwork } from './CourseCard';

export default function CourseDetail({ course, topics, topicsError, related }: { course: Course; topics: CourseTopic[]; topicsError?: string; related: Course[] }) {
  const lessons = topics.reduce((total, topic) => total + topic.courseLesson.length, 0);
  return <>
    <section className="detail-banner"><div className="academy-container">
      <div className="breadcrumb"><Link href="/home">خانه</Link><ChevronLeft size={14} /><Link href="/courses">دوره‌های آموزشی</Link><ChevronLeft size={14} /><span>{course.title}</span></div>
      <div className="detail-intro"><span className="detail-category">{course.categories.map(category => category.name).join(' / ') || 'دوره آموزشی'}</span><h1 dir="auto">{course.title}</h1><p>{course.isPublished ? 'دوره منتشرشده' : 'در حال آماده‌سازی'}</p><div className="detail-stats"><span><BookOpen size={17} />{persianNumber(topics.length)} سرفصل</span><span><MonitorPlay size={17} />{persianNumber(lessons)} جلسه</span></div>{course.teacher && <div className="teacher-line"><span className={`avatar avatar-${course.theme}`}>{course.initials}</span><span>با تدریس <strong>{course.teacher}</strong></span></div>}</div>
    </div></section>
    <div className="academy-container detail-layout">
      <div className="detail-main"><nav className="detail-tabs" aria-label="بخش‌های دوره"><a href="#about-course">درباره دوره</a><a href="#curriculum">سرفصل‌ها</a>{course.teacher && <a href="#instructor">مدرس دوره</a>}</nav>
        <section id="about-course" className="detail-section"><span className="eyebrow">قبل از شروع، بیشتر بدان</span><h2>درباره این دوره</h2><p dir="auto" className="course-full-description">{course.description || 'هنوز توضیحی برای این دوره ثبت نشده است.'}</p></section>
        <section id="curriculum" className="detail-section"><div className="section-heading"><h2>سرفصل‌های دوره</h2><span className="muted">{persianNumber(lessons)} جلسه</span></div>
          {topicsError ? <p role="status">{topicsError}</p> : topics.length === 0 ? <p>هنوز سرفصلی برای این دوره ثبت نشده است.</p> : topics.map((topic, index) => <details className="chapter" key={topic.id} open={index === 0}><summary><span className="chapter-number">{persianNumber(index + 1).padStart(2, '۰')}</span><strong dir="auto">{topic.topicName}</strong><small>{persianNumber(topic.courseLesson.length)} جلسه</small><ChevronLeft size={16} /></summary><div className="chapter-content">{topic.courseLesson.length === 0 ? <p className="curriculum-note">هنوز جلسه‌ای در این سرفصل ثبت نشده است.</p> : topic.courseLesson.map(lesson => <div className="lesson-line" key={lesson.id}><MonitorPlay size={16} /><span dir="auto">{lesson.lessonName}</span><LockKeyhole size={14} aria-label="پخش درس فعال نیست" /></div>)}</div></details>)}
          {lessons > 0 && <p className="curriculum-note">فهرست جلسه‌ها قابل مشاهده است؛ پخش و خرید دوره در این بخش هنوز فعال نشده است.</p>}
        </section>
        {course.teacher && <section id="instructor" className="detail-section instructor-section"><span className={`avatar avatar-large avatar-${course.theme}`}>{course.initials}</span><div><span className="eyebrow">مدرس این دوره</span><h2>{course.teacher}</h2></div></section>}
      </div>
      <aside className="enrollment-column"><div className="enrollment-card"><CourseArtwork course={course} /><a className="preview-link" href="#curriculum"><BookOpen size={15} />مشاهده سرفصل‌های دوره</a><div className="enrollment-body"><div className="enrollment-price"><div className="price-group"><strong>{coursePrice(course.price)} <small>{course.price ? 'تومان' : ''}</small></strong></div></div><Link href="/login" className="button button-primary enrollment-button">ورود به حساب رویش<ArrowLeft size={18} /></Link><p className="enrollment-notice">{course.isPublished ? 'خرید دوره هنوز فعال نشده است.' : 'این دوره هنوز منتشر نشده است.'}</p><ul className="course-includes"><li><MonitorPlay size={18} /><span>جلسه‌های ثبت‌شده</span><strong>{persianNumber(lessons)} جلسه</strong></li><li><BookOpen size={18} /><span>سرفصل‌ها</span><strong>{persianNumber(topics.length)} سرفصل</strong></li><li><Check size={18} /><span>وضعیت دوره</span><strong>{course.isPublished ? 'منتشرشده' : 'در حال آماده‌سازی'}</strong></li></ul></div></div><div className="enrollment-help"><Check size={18} /><span>انتخاب آگاهانه، شروع یک مسیر بهتر</span></div></aside>
    </div>
    {related.length > 0 && <section className="featured-section"><div className="academy-container"><div className="section-heading"><div><span className="eyebrow">یادگیری ادامه دارد</span><h2>دوره‌های دیگر</h2></div><Link className="text-link" href="/courses">همه دوره‌ها<ArrowLeft size={17} /></Link></div><div className="course-grid">{related.map(item => <CourseCard key={item.id} course={item} />)}</div></div></section>}
  </>;
}
