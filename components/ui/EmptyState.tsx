import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function EmptyState({
  title,
  description,
  href = "/course",
  action = "کشف دوره‌ها",
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="empty-state panel">
      <BookOpen size={42} aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="button button-primary" href={href}>
        {action}
      </Link>
    </div>
  );
}
