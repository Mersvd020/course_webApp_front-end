import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  Layers3,
  Palette,
  Server,
  Terminal,
} from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import HomeCourses from "@/components/home/HomeCourses";



export default function HomePage() {

  return (
    <>
      <HeroSection />
      <div className="category-strip">
        <div className="container">
          <span>مسیر تو کدام است؟</span>
          {[
            { name: "فرانت‌اند", icon: Code2 },
            { name: "بک‌اند", icon: Server },
            { name: "طراحی", icon: Palette },
            { name: "برنامه‌نویسی", icon: Terminal },
          ].map(({ name, icon: Icon }) => (
            <Link
              key={name}
              href={`/course?category=${encodeURIComponent(name)}`}
            >
              <Icon size={20} />
              {name}
            </Link>
          ))}
          <Link href="/course">
            <Layers3 size={20} />
            همه مسیرها
          </Link>
        </div>
      </div>
      <HomeCourses />
      <section className="container">
        <div className="learning-banner">
          <div>
            <span>فصل تازه‌ای را شروع کن</span>
            <h2>برای قدم بعدی آماده‌ای؟</h2>
            <p>دوره مناسب خودت را پیدا کن و یادگیری را به عادت تبدیل کن.</p>
          </div>
          <Link href="/course" className="button button-light">
            شروع یادگیری <ArrowLeft size={19} />
          </Link>
        </div>
      </section>
    </>
  );
}
