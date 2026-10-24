"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useCourses } from "./useCourses";
import CourseCard from "./CourseCard";
import CourseLoading from "./CourseLoading";
// import { coursePrice } from "@/types/course";
import EmptyState from "@/components/ui/EmptyState";

export default function CourseCatalog() {
  const params = useSearchParams();
  // Keying the filter view keeps state in sync when navigating between category links.
  return (
    <CatalogFilters
      key={params.toString()}
      initialCategory={params.get("category") ?? ""}
      initialSort={params.get("sort") ?? "popular"}
      initialDiscount={params.get("filter") === "discounted"}
    />
  );
}

function CatalogFilters({
  initialCategory,
  initialSort,
  initialDiscount,
}: {
  initialCategory: string;
  initialSort: string;
  initialDiscount: boolean;
}) {
  const result = useCourses();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [discounted, setDiscounted] = useState(initialDiscount);
  if (!result) return <CourseLoading />;
  const categories = [
    ...new Set(result.data.map((course) => course.category).filter(Boolean)),
  ];
  const courses = result.data
    // .filter(
    //   (course) =>
    //     (!category || course.category === category) &&
    //     (!discounted || coursePrice(course) < course.price) &&
    //     `${course.title} ${course.instructor}`
    //       .toLocaleLowerCase("fa")
    //       .includes(search.trim().toLocaleLowerCase("fa")),
    // )
    // .sort((a, b) => {
    //   if (sort === "price-asc") return coursePrice(a) - coursePrice(b);
    //   if (sort === "price-desc") return coursePrice(b) - coursePrice(a);
    //   if (sort === "views") return (b.views ?? 0) - (a.views ?? 0);
    //   return (b.students ?? 0) - (a.students ?? 0);
    // });

  return (
    <div className="container page-space">
      <div className="page-heading">
        <span className="eyebrow">یک انتخاب، یک شروع تازه</span>
        <h1>مسیر یادگیری خودت را پیدا کن</h1>
        <p>آموزش‌های کاربردی برای مهارت‌هایی که به آن‌ها نیاز داری.</p>
      </div>
      {result.source === "mock" && (
        <p className="demo-note">در حال نمایش دوره‌های نمونه هستید.</p>
      )}
      <div className="catalog-toolbar panel">
        <div className="search-field">
          <Search size={19} />
          <input
            aria-label="جستجوی دوره یا مدرس"
            placeholder="نام دوره یا مدرس را جستجو کن…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <label className="select-field">
          <SlidersHorizontal size={17} />
          <select
            aria-label="مرتب‌سازی"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="popular">محبوب‌ترین</option>
            <option value="views">پربازدیدترین</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
          </select>
        </label>
      </div>
      <div className="catalog-filters">
        <div className="filter-chips">
          <button
            className={!category ? "active" : ""}
            onClick={() => setCategory("")}
          >
            همه دوره‌ها
          </button>
          {/* {categories.map((item) => (
            <button
              className={category === item ? "active" : ""}
              key={item}
              onClick={() => setCategory(item!)}
            >
              {item}
            </button>
          ))} */}
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={discounted}
            onChange={(event) => setDiscounted(event.target.checked)}
          />
          فقط تخفیف‌دارها
        </label>
      </div>
      <p className="result-count" role="status">
        {courses.length.toLocaleString("fa-IR")} دوره برای یادگیری
      </p>
      {courses.length ? (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}
        </div>
      ) : (
        <>
          <EmptyState
            title="دوره‌ای پیدا نشد"
            description="عبارت جستجو یا فیلترها را تغییر دهید."
          />
          <button
            className="button button-secondary mt-4"
            onClick={() => {
              setSearch("");
              setCategory("");
              setDiscounted(false);
            }}
          >
            پاک کردن فیلترها
          </button>
        </>
      )}
    </div>
  );
}
