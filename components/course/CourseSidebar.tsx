"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, Heart, ShoppingBag } from "lucide-react";
import { Course} from "@/types/course";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CourseSidebar({ course }: { course: Course }) {
  const { add, cart, purchased, wishlist, toggleWishlist, checkingOut } =
    useCart();
  const owned = purchased.some((item) => item.id === course.id);
  const inCart = cart.some((item) => item.id === course.id);
  const favorite = wishlist.some((item) => item.id === course.id);
  const price = course.price;
  return (
    <aside className="panel course-sidebar">
      <span className="section-kicker">سرمایه‌گذاری روی آینده خودت</span>
      <div className="detail-price">
        {price < course.price && <del>{formatPrice(course.price)}</del>}
        <strong>{price ? formatPrice(price) : "رایگان"}</strong>
      </div>
      {owned ? (
        <Link href="/user/courses" className="button button-primary">
          <BookOpen size={18} />
          در دوره‌های من
        </Link>
      ) : inCart ? (
        <Link href="/cart" className="button button-primary">
          <CheckCircle2 size={18} />
          مشاهده سبد خرید
        </Link>
      ) : (
        <Button disabled={checkingOut} onClick={() => add(course)}>
          <ShoppingBag size={18} />
          افزودن به سبد خرید
        </Button>
      )}
      <Button
        variant="secondary"
        aria-pressed={favorite}
        onClick={() => toggleWishlist(course)}
      >
        <Heart size={17} fill={favorite ? "currentColor" : "none"} />
        {favorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      </Button>
      <ul>
        <li>
          <CheckCircle2 size={17} />
          آموزش قدم‌به‌قدم
        </li>
        <li>
          <CheckCircle2 size={17} />
          تمرین‌های پروژه‌محور
        </li>
        <li>
          <CheckCircle2 size={17} />
          یادگیری با سرعت خودت
        </li>
      </ul>
      <p className="demo-note">
        خرید در این نسخه آزمایشی است و وجهی دریافت نمی‌شود.
      </p>
    </aside>
  );
}
