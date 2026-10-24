export interface Lesson {
  id: string;
  title: string;
  duration?: string;
}

export interface Topic {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  image: string;
  price: number;
  discountedPrice?: number;
  rating?: number;
  views?: number;
  students?: number;
  duration?: string;
  category?: string;
  level?: string;
  topics?: Topic[];
}

export interface CourseResult<T> {
  data: T;
  source: "api" | "mock";
}

export function coursePrice(course: Course) {
  return course.discountedPrice != null &&
    course.discountedPrice >= 0 &&
    course.discountedPrice < course.price
    ? course.discountedPrice
    : course.price;
}
