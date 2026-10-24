"use client";

import { useEffect, useState } from "react";
import { getCourses } from "@/services/course.service";
import type { Course, CourseResult } from "@/types/course";

export function useCourses() {
  const [result, setResult] = useState<CourseResult<Course[]> | null>(null);
  useEffect(() => {
    let active = true;
    getCourses().then((data) => {
      if (active) setResult(data);
    });
    return () => {
      active = false;
    };
  }, []);
  return result;
}
