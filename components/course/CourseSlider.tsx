"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Course } from "@/types/course";
import CourseCard from "./CourseCard";

export default function CourseSlider({
  title,
  subtitle,
  courses,
  href,
  accent = false,
}: {
  title: string;
  subtitle: string;
  courses: Course[];
  href: string;
  accent?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      setPosition(Math.abs(element.scrollLeft));
      setEnd(
        Math.abs(element.scrollLeft) + element.clientWidth >=
          element.scrollWidth - 4,
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [courses.length]);

  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    element.scrollBy({
      left:
        direction *
        (element.firstElementChild?.getBoundingClientRect().width ?? 300),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  if (!courses.length) return null;
  return (
    <section className={`course-section ${accent ? "accent-section" : ""}`}>
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{subtitle}</span>
            <h2>{title}</h2>
          </div>
          <Link href={href} className="text-link">
            مشاهده همه <ArrowLeft size={17} />
          </Link>
        </div>
        <div
          ref={track}
          className="course-track"
          tabIndex={0}
          aria-label={title}
          onScroll={() => {
            const element = track.current!;
            setPosition(Math.abs(element.scrollLeft));
            setEnd(
              Math.abs(element.scrollLeft) + element.clientWidth >=
                element.scrollWidth - 4,
            );
          }}
        >
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        <div className="slider-controls">
          <span className="slider-line" />
          <button
            className="icon-button"
            disabled={position < 2}
            aria-label={`دوره‌های قبلی ${title}`}
            onClick={() => move(1)}
          >
            <ChevronRight size={20} />
          </button>
          <button
            className="icon-button"
            disabled={end}
            aria-label={`دوره‌های بعدی ${title}`}
            onClick={() => move(-1)}
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
