import { Suspense } from "react";
import CourseCatalog from "@/components/course/CourseCatalog";
import CourseLoading from "@/components/course/CourseLoading";

export default function CoursesPage() {
  return (
    <Suspense fallback={<CourseLoading />}>
      <CourseCatalog />
    </Suspense>
  );
}
