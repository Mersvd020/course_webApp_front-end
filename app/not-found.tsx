import Link from "next/link";

export default function NotFound() {
  return (
    <main className="empty-state min-h-screen">
      <span className="eyebrow">۴۰۴</span>
      <h1>این صفحه پیدا نشد</h1>
      <p>ممکن است آدرس تغییر کرده باشد.</p>
      <Link className="button button-primary" href="/">
        بازگشت به خانه
      </Link>
    </main>
  );
}
