import Link from "next/link";
import { ArrowUpLeft, GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <Link href="/" className="brand">
              <GraduationCap size={30} />
              دانـا
            </Link>
            <p>
              یادگیری، آغاز یک تغییر است.
              <br />
              با مهارت‌های تازه، فرصت‌های تازه بساز.
            </p>
          </div>
          <div>
            <h3>مسیر یادگیری</h3>
            <Link href="/course">همه دوره‌ها</Link>
            <Link href="/course?filter=discounted">دوره‌های تخفیف‌دار</Link>
          </div>
          <div>
            <h3>همراه شما</h3>
            <Link href="/user/courses">دوره‌های من</Link>
            <Link href="/user/wishlist">علاقه‌مندی‌ها</Link>
            <Link href="/user/login">حساب کاربری</Link>
          </div>
          <div className="footer-note">
            <span>از همین امروز شروع کن</span>
            <p>
              قدم بعدی مسیر حرفه‌ای تو،
              <br />
              می‌تواند یک دوره باشد.
            </p>
            <Link href="/course">
              پیدا کردن مسیر من <ArrowUpLeft size={18} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>دانـا؛ سامانه آموزش آنلاین</span>
          <span>ساخته‌شده برای یادگیری، رشد و تجربه</span>
        </div>
      </div>
    </footer>
  );
}
