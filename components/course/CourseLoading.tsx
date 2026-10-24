export default function CourseLoading() {
  return (
    <div
      className="container loading-grid"
      role="status"
      aria-label="در حال دریافت دوره‌ها"
    >
      {[1, 2, 3, 4].map((item) => (
        <div className="skeleton-card" key={item}>
          <div />
          <span />
          <span />
          <span />
        </div>
      ))}
      <span className="sr-only">در حال دریافت دوره‌ها…</span>
    </div>
  );
}
