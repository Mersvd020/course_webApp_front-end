"use client";

import CourseSlider from "@/components/course/CourseSlider";
import CourseLoading from "@/components/course/CourseLoading";
import { useCourses} from "@/components/course/useCourses";
// import { coursePrice } from "@/types/course";

export default function HomeCourses() {
  const result = useCourses();
  console.log(result?.data);
  if (!result) return <CourseLoading />;
  const courses = result.data;
  return (
    <>
      {result.source === "mock" && (
        <div className="container">
          <p className="demo-note">
            نسخه نمایشی · دوره‌های نمونه برای تجربه و بررسی سامانه
          </p>
        </div>
      )}
      <CourseSlider
        title="محبوب‌ترین انتخاب‌ها"
        subtitle="از اینجا شروع کن"
        courses={courses}
        href="/course?sort=popular"
      />
      <CourseSlider
        title="یادگیری بیشتر، هزینه کمتر"
        subtitle="فرصت‌های ویژه یادگیری"
        courses={courses}
        href="/course?filter=discounted"
        accent
      />
      <CourseSlider
        title="این روزها همه می‌بینند"
        subtitle="دوره‌های پربازدید"
        courses={courses}
        href="/course?sort=views"
      />
    </>
  );
}
