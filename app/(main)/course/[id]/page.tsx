import { Suspense } from "react";
import CourseDetail from "@/components/course/CourseDetail";
import CourseLoading from "@/components/course/CourseLoading";

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CourseDetail key={id} id={id} />;
}

export default function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<CourseLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
