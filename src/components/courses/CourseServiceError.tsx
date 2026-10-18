import Link from 'next/link';
import { CloudOff } from 'lucide-react';

export default function CourseServiceError({ message = 'دریافت دوره‌ها ممکن نشد. کمی بعد دوباره تلاش کنید.' }: { message?: string }) {
  return <div className="empty-courses" role="status"><CloudOff size={35} /><h2>اطلاعات دوره‌ها در دسترس نیست</h2><p>{message}</p><Link href="/courses" className="button button-primary">تلاش دوباره</Link></div>;
}
