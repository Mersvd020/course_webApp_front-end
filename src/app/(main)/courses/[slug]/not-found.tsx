import Link from 'next/link';

export default function CourseNotFound() {
  return <section className="academy-container section-space empty-courses"><h1>این دوره پیدا نشد</h1><p>از فهرست دوره‌ها، مسیر دیگری برای یادگیری انتخاب کن.</p><Link href="/courses" className="button button-primary">مشاهده دوره‌ها</Link></section>;
}
