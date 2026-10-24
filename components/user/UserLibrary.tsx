"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import CourseCard from "@/components/course/CourseCard";
import EmptyState from "@/components/ui/EmptyState";

export default function UserLibrary({
  mode,
}: {
  mode: "courses" | "wishlist";
}) {
  const { purchased, wishlist } = useCart();
  const { ready, session } = useAuth();
  const courses = mode === "courses" ? purchased : wishlist;
  return (
    <div className="container page-space">
      <div className="page-heading">
        <span className="eyebrow">فضای یادگیری شما</span>
        <h1>{mode === "courses" ? "دوره‌های من" : "علاقه‌مندی‌های من"}</h1>
        <p>
          {mode === "courses"
            ? "همه انتخاب‌های شما برای ادامه مسیر یادگیری."
            : "دوره‌هایی که برای قدم‌های بعدی کنار گذاشته‌اید."}
        </p>
      </div>
      {!session && (
        <p className="demo-note">
          کتابخانه مهمان · این اطلاعات فقط در همین مرورگر نگهداری می‌شود.
        </p>
      )}
      {mode === "courses" && courses.length > 0 && (
        <p className="demo-note">
          خریدها آزمایشی هستند. پخش ویدیو در این نسخه ارائه نشده است.
        </p>
      )}
      {!ready ? (
        <p role="status">در حال دریافت اطلاعات…</p>
      ) : courses.length ? (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            mode === "courses"
              ? "هنوز دوره‌ای نخریده‌اید"
              : "هنوز دوره‌ای ذخیره نکرده‌اید"
          }
          description={
            mode === "courses"
              ? "با انتخاب اولین دوره، مسیر یادگیری خود را شروع کنید."
              : "با زدن قلب کنار هر دوره، آن را به این فهرست اضافه کنید."
          }
        />
      )}
    </div>
  );
}
