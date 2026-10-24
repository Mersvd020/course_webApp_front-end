import type { Course } from "@/types/course";

// These are demonstration courses, never presented as API records.
export const mockCourses: Course[] = [
  {
    id: "mock-react",
    title: "آموزش جامع React؛ از صفر تا ساخت پروژه",
    instructor: "علی محمدی",
    category: "فرانت‌اند",
    price: 2400000,
    discountedPrice: 1680000,
    rating: 4.9,
    views: 12400,
    students: 1240,
    duration: "۳۲ ساعت",
    level: "مقدماتی تا پیشرفته",
    image: "/courses/react.svg",
    description:
      "با ساخت یک فروشگاه واقعی، کامپوننت‌ها، هوک‌ها، مدیریت وضعیت و اتصال به API را یاد بگیرید و برای ورود به بازار کار آماده شوید.",
  },
  {
    id: "mock-next",
    title: "توسعه وب حرفه‌ای با Next.js",
    instructor: "سارا احمدی",
    category: "فرانت‌اند",
    price: 3200000,
    discountedPrice: 2240000,
    rating: 4.8,
    views: 9800,
    students: 860,
    duration: "۲۸ ساعت",
    level: "متوسط",
    image: "/courses/next.svg",
    description:
      "از مسیریابی و رندر سمت سرور تا بهینه‌سازی عملکرد؛ یک اپلیکیشن کامل و قابل انتشار با Next.js بسازید.",
  },
  {
    id: "mock-typescript",
    title: "TypeScript کاربردی برای توسعه‌دهندگان",
    instructor: "رضا کریمی",
    category: "برنامه‌نویسی",
    price: 1500000,
    discountedPrice: 1050000,
    rating: 4.9,
    views: 8100,
    students: 720,
    duration: "۱۸ ساعت",
    level: "متوسط",
    image: "/courses/typescript.svg",
    description:
      "کد جاوااسکریپت خود را قابل اعتمادتر کنید. تایپ‌ها، جنریک‌ها و الگوهای کاربردی را با تمرین‌های واقعی یاد بگیرید.",
  },
  {
    id: "mock-node",
    title: "ساخت API و بک‌اند با Node.js",
    instructor: "مهدی رضایی",
    category: "بک‌اند",
    price: 2800000,
    discountedPrice: 1960000,
    rating: 4.7,
    views: 11700,
    students: 960,
    duration: "۳۶ ساعت",
    level: "مقدماتی تا پیشرفته",
    image: "/courses/node.svg",
    description:
      "یک API کامل با احراز هویت، دیتابیس و مدیریت خطا بسازید و اصول توسعه بک‌اند را قدم‌به‌قدم تجربه کنید.",
  },
  {
    id: "mock-design",
    title: "طراحی رابط کاربری؛ از ایده تا Figma",
    instructor: "نگار حسینی",
    category: "طراحی",
    price: 1800000,
    rating: 4.8,
    views: 7500,
    students: 640,
    duration: "۲۴ ساعت",
    level: "مقدماتی",
    image: "/courses/design.svg",
    description:
      "اصول رنگ، تایپوگرافی و طراحی واکنش‌گرا را یاد بگیرید و اولین دیزاین سیستم و نمونه تعاملی خود را بسازید.",
  },
  {
    id: "mock-python",
    title: "پایتون؛ اولین قدم در دنیای برنامه‌نویسی",
    instructor: "امیر موسوی",
    category: "برنامه‌نویسی",
    price: 1200000,
    rating: 4.6,
    views: 14300,
    students: 1800,
    duration: "۲۲ ساعت",
    level: "مقدماتی",
    image: "/courses/python.svg",
    description:
      "بدون نیاز به پیش‌زمینه، برنامه‌نویسی را با پایتون شروع کنید؛ از متغیرها و توابع تا ساخت ابزارهای کاربردی روزمره.",
  },
].map((course) => ({
  ...course,
  topics: [
    {
      id: "start",
      title: "شروع مسیر و آماده‌سازی",
      lessons: [
        { id: "intro", title: "معرفی دوره و نقشه راه", duration: "۱۲ دقیقه" },
        {
          id: "setup",
          title: "نصب و آماده‌سازی محیط توسعه",
          duration: "۲۵ دقیقه",
        },
      ],
    },
    {
      id: "core",
      title: "مفاهیم اصلی و تمرین عملی",
      lessons: [
        { id: "basics", title: "آشنایی با مفاهیم پایه", duration: "۴۵ دقیقه" },
        {
          id: "practice",
          title: "حل تمرین و بررسی مثال‌ها",
          duration: "۵۵ دقیقه",
        },
      ],
    },
    {
      id: "project",
      title: "ساخت پروژه نهایی",
      lessons: [
        {
          id: "build",
          title: "پیاده‌سازی پروژه قدم‌به‌قدم",
          duration: "۹۰ دقیقه",
        },
        {
          id: "review",
          title: "جمع‌بندی و مسیر ادامه یادگیری",
          duration: "۲۰ دقیقه",
        },
      ],
    },
  ],
}));
