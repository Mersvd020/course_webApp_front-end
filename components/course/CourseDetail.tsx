"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock3, GraduationCap, Star, Users } from "lucide-react";
import { getCourse } from "@/services/course.service";
import type { Course, CourseResult } from "@/types/course";
import CourseCover from "./CourseCover";
import CourseSidebar from "./CourseSidebar";
import LessonAccordion from "./LessonAccordion";
import CourseLoading from "./CourseLoading";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

export default function CourseDetail({ id }: { id: string }) {
  const [result, setResult] = useState<CourseResult<Course | null> | null>(
    null,
  );
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    getCourse(id)
      .then((data) => {
        if (active) setResult(data);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [id, attempt]);
  if (error)
    return (
      <div className="container page-space">
        <EmptyState
          title="دریافت دوره ممکن نشد"
          description="اتصال به سرور برقرار نیست. دوباره تلاش کنید یا دوره‌های نمونه را ببینید."
        />
        <Button
          className="mt-4"
          onClick={() => {
            setError(false);
            setAttempt(attempt + 1);
          }}
        >
          تلاش مجدد
        </Button>
      </div>
    );
  if (!result) return <CourseLoading />;
  if (!result.data)
    return (
      <div className="container page-space">
        <EmptyState
          title="دوره پیدا نشد"
          description="این دوره موجود نیست یا از فهرست حذف شده است."
        />
      </div>
    );
  const course = result.data;
  return (
    <div className="container page-space">
      <nav className="breadcrumbs" aria-label="مسیر صفحه">
        <Link href="/">خانه</Link>
        <span>/</span>
        <Link href="/course">دوره‌ها</Link>
        <span>/</span>
        <span>{course.category || "دوره تخصصی"}</span>
      </nav>
      {result.source === "mock" && (
        <p className="demo-note">
          دوره نمونه · اطلاعات و سرفصل‌ها برای نمایش امکانات سامانه هستند.
        </p>
      )}
      <div className="detail-grid">
        <div>
          <div className="detail-heading">
            <span className="eyebrow">
              {course.category} · {course.level || "آموزش تخصصی"}
            </span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className="detail-facts">
              <span>
                <GraduationCap size={19} />
                {course.instructor}
              </span>
              {course.duration && (
                <span>
                  <Clock3 size={18} />
                  {course.duration}
                </span>
              )}
              {course.students != null && (
                <span>
                  <Users size={18} />
                  {course.students.toLocaleString("fa-IR")} دانشجو
                </span>
              )}
              {course.rating != null && (
                <span>
                  <Star size={17} />
                  {course.rating.toLocaleString("fa-IR")}
                </span>
              )}
            </div>
          </div>
          <div className="detail-cover">
            <CourseCover src={course.image} title={course.title} priority />
          </div>
          <section className="panel detail-section">
            <h2>درباره این دوره</h2>
            <p>{course.description}</p>
          </section>
          <section className="panel detail-section">
            <h2>سرفصل‌های دوره</h2>
            <LessonAccordion topics={course.topics ?? []} />
          </section>
        </div>
        <CourseSidebar course={course} />
      </div>
    </div>
  );
}
