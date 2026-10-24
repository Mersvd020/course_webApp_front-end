"use client";

import Link from "next/link";
import { ArrowUpLeft, Clock3, Heart, Star, Users } from "lucide-react";
import { Course, coursePrice } from "@/types/course";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import CourseCover from "./CourseCover";

export default function CourseCard({ course }: { course: Course }) {
  const { wishlist, toggleWishlist } = useCart();
  const favorite = wishlist.some((item) => item.id === course.id);
  const price = coursePrice(course);
  const discounted = price < course.price;
  return (
    <article className="course-card">
      <div className="course-image-wrap">
        <Link href={`/course/${course.id}`} tabIndex={-1} aria-hidden="true">
          <CourseCover src={course.image} title="" />
        </Link>
        {discounted && (
          <span className="discount-badge">
            {Math.round((1 - price / course.price) * 100).toLocaleString(
              "fa-IR",
            )}
            ٪ تخفیف
          </span>
        )}
        <button
          className={`favorite-button ${favorite ? "is-favorite" : ""}`}
          aria-label={`${favorite ? "حذف از" : "افزودن به"} علاقه‌مندی‌ها: ${course.title}`}
          aria-pressed={favorite}
          onClick={() => toggleWishlist(course)}
        >
          <Heart size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="course-card-body">
        <div className="course-meta">
          <span>{course.category || "تخصصی"}</span>
          {course.rating != null && (
            <span className="rating">
              <Star size={14} fill="currentColor" />
              {course.rating.toLocaleString("fa-IR")}
            </span>
          )}
        </div>
        <h3>
          <Link href={`/course/${course.id}`}>{course.title}</Link>
        </h3>
        <p className="instructor">مدرس: {course.instructor}</p>
        <div className="course-facts">
          <span>
            <Clock3 size={14} />
            {course.duration || "آموزش ویدیویی"}
          </span>
          {course.students != null && (
            <span>
              <Users size={14} />
              {course.students.toLocaleString("fa-IR")} دانشجو
            </span>
          )}
        </div>
        <div className="course-card-bottom">
          <div>
            {discounted && <del>{formatPrice(course.price)}</del>}
            <strong>{price === 0 ? "رایگان" : formatPrice(price)}</strong>
          </div>
          <Link
            href={`/course/${course.id}`}
            className="card-arrow"
            aria-label={`مشاهده ${course.title}`}
          >
            <ArrowUpLeft size={20} />
          </Link>
        </div>
      </div>
    </article>
  );
}
