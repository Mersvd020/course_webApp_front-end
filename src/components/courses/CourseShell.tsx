'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, BookOpen, GraduationCap, Menu, X } from 'lucide-react';
import './courses.css';
import { logoutCourseAccount } from '@/util/service/course-platform/auth-actions';

export function CourseBrand() {
  return <Link href="/home" className="course-brand"><span className="brand-icon"><GraduationCap size={25} /></span><span>رویش<span className="brand-dot">.</span><small>آکادمی یادگیری مهارت</small></span></Link>;
}

export default function CourseShell({ children, legacyHeader, legacyFooter, signedIn }: { children: React.ReactNode; legacyHeader: React.ReactNode; legacyFooter: React.ReactNode; signedIn: boolean }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const isCoursePage = pathname === '/home' || pathname.startsWith('/courses') || pathname.startsWith('/detailPage') || pathname === '/RentAndMortgage' || pathname === '/houseListReservePage';
  if (!isCoursePage) return <><header className="w-full py-[50px]">{legacyHeader}</header><main className="content">{children}</main><footer className="w-full px-16 py-6">{legacyFooter}</footer></>;
  return <div className="academy" dir="rtl">
    <div className="announcement"><span>یک مهارت تازه، یک فرصت تازه</span><span className="announcement-divider">|</span><Link href="/courses?price=free">یادگیری را رایگان شروع کن <ArrowLeft size={13} /></Link></div>
    <header className="academy-header"><div className="academy-container header-inner"><CourseBrand /><nav aria-label="منوی اصلی" className={menu ? 'academy-nav nav-open' : 'academy-nav'}>
      <Link onClick={() => setMenu(false)} className={pathname === '/home' ? 'active' : ''} href="/home">خانه</Link><Link onClick={() => setMenu(false)} className={pathname.startsWith('/courses') ? 'active' : ''} href="/courses">دوره‌های آموزشی</Link><Link onClick={() => setMenu(false)} href="/courses?price=free">یادگیری رایگان</Link><Link onClick={() => setMenu(false)} href="/home#learning-path">مسیر یادگیری</Link>
    </nav><div className="header-actions">{signedIn && <form action={logoutCourseAccount}><button className="course-logout" type="submit">خروج</button></form>}<Link className="button button-primary button-small" href={signedIn ? '/courses' : '/login'}>{signedIn ? 'ادامه یادگیری' : 'ورود / ثبت‌نام'}<ArrowLeft size={16} /></Link><button className="mobile-menu" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label={menu ? 'بستن منو' : 'باز کردن منو'}>{menu ? <X /> : <Menu />}</button></div></div></header>
    <main>{children}</main>
    <footer className="academy-footer"><div className="academy-container"><div className="footer-top"><div><CourseBrand /><p>یادگیری، آغاز یک تغییر است.<br />کنارت هستیم تا مهارت بسازی و مسیر خودت را پیدا کنی.</p></div><div><h3>کشف کن</h3><Link href="/courses">همه دوره‌ها</Link><Link href="/courses?price=free">دوره‌های رایگان</Link><Link href="/home#learning-path">مسیر یادگیری</Link></div><div><h3>حساب کاربری</h3><Link href="/login">ورود به حساب</Link><Link href="/register">ساخت حساب کاربری</Link><Link href="/forgetPassword">بازیابی رمز عبور</Link></div><div className="footer-note"><BookOpen size={25} /><strong>امروز، یک قدم جلوتر.</strong><p>با دوره‌های کاربردی و تمرین‌محور،<br />روی آینده‌ات سرمایه‌گذاری کن.</p></div></div><div className="footer-bottom"><span>© آکادمی رویش؛ برای آن‌هایی که از یاد گرفتن دست نمی‌کشند.</span><span>با اشتیاق برای یادگیری <span className="brand-dot">✳</span></span></div></div></footer>
  </div>;
}
