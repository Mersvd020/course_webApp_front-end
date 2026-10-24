"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { coursePrice } from "@/types/course";
import { formatPrice } from "@/lib/utils";
import CourseCover from "@/components/course/CourseCover";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default function CartPage() {
  const { cart, total, remove, checkout, checkingOut } = useCart();
  const { ready, session } = useAuth();
  const router = useRouter();
  const original = cart.reduce((sum, course) => sum + course.price, 0);
  return (
    <div className="container page-space">
      <div className="page-heading">
        <span className="eyebrow">یک قدم تا شروع</span>
        <h1>سبد یادگیری شما</h1>
        <p>انتخاب‌های امروز، مهارت‌های فردا.</p>
      </div>
      {!ready ? (
        <p role="status">در حال دریافت سبد خرید…</p>
      ) : !cart.length ? (
        <EmptyState
          title="سبد خریدت هنوز خالی است"
          description="یک دوره انتخاب کن و اولین قدم مسیر جدیدت را بردار."
        />
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {cart.map((course) => (
              <article className="panel cart-item" key={course.id}>
                <Link href={`/course/${course.id}`} className="cart-cover">
                  <CourseCover src={course.image} title={course.title} />
                </Link>
                <div>
                  <h2>
                    <Link href={`/course/${course.id}`}>{course.title}</Link>
                  </h2>
                  <p>{course.instructor}</p>
                  <strong>{formatPrice(coursePrice(course))}</strong>
                </div>
                <button
                  className="icon-button remove-button"
                  disabled={checkingOut}
                  aria-label={`حذف ${course.title}`}
                  onClick={() => remove(course.id)}
                >
                  <Trash2 size={19} />
                </button>
              </article>
            ))}
          </div>
          <aside className="panel checkout-panel">
            <h2>خلاصه سفارش</h2>
            <dl>
              <div>
                <dt>تعداد دوره‌ها</dt>
                <dd>{cart.length.toLocaleString("fa-IR")}</dd>
              </div>
              <div>
                <dt>مبلغ دوره‌ها</dt>
                <dd>{formatPrice(original)}</dd>
              </div>
              <div>
                <dt>تخفیف شما</dt>
                <dd className="text-teal-700">
                  {formatPrice(original - total)}
                </dd>
              </div>
              <div className="checkout-total">
                <dt>مجموع</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <Button
              loading={checkingOut}
              onClick={async () => {
                if (await checkout()) router.push("/user/courses");
              }}
            >
              {checkingOut ? "در حال ثبت خرید…" : "تکمیل خرید آزمایشی"}
              {!checkingOut && <ArrowLeft size={18} />}
            </Button>
            <p className="demo-note">
              این پرداخت شبیه‌سازی‌شده است؛ مبلغی از شما دریافت نمی‌شود.
            </p>
            {!session && (
              <p className="muted text-sm">
                خرید مهمان در همین مرورگر ذخیره می‌شود و از خرید حساب‌های کاربری
                جداست.
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
