"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="empty-state">
      <h1>مشکلی در نمایش صفحه پیش آمد</h1>
      <p>لطفاً دوباره تلاش کنید.</p>
      <button className="button button-primary" onClick={reset}>
        تلاش مجدد
      </button>
    </div>
  );
}
