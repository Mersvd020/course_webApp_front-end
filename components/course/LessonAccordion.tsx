import { ChevronDown, PlayCircle } from "lucide-react";
import type { Topic } from "@/types/course";

export default function LessonAccordion({ topics }: { topics: Topic[] }) {
  if (!topics.length)
    return <p className="muted">سرفصل‌های این دوره هنوز منتشر نشده‌اند.</p>;
  return (
    <div className="topics">
      {topics.map((topic, index) => (
        <details key={topic.id} open={index === 0}>
          <summary>
            <span>
              <b>{(index + 1).toLocaleString("fa-IR")}</b>
              {topic.title}
            </span>
            <span>
              {topic.lessons.length.toLocaleString("fa-IR")} جلسه{" "}
              <ChevronDown size={17} />
            </span>
          </summary>
          <ul>
            {topic.lessons.map((lesson) => (
              <li key={lesson.id}>
                <span>
                  <PlayCircle size={17} />
                  {lesson.title}
                </span>
                <small>{lesson.duration}</small>
              </li>
            ))}
          </ul>
          {!topic.lessons.length && (
            <p className="muted p-4">جلسات این فصل به‌زودی اعلام می‌شود.</p>
          )}
        </details>
      ))}
    </div>
  );
}
