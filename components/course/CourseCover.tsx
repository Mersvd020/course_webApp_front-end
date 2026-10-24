"use client";

import Image from "next/image";
import { useState } from "react";

export default function CourseCover({
  src,
  title,
  priority = false,
}: {
  src: string;
  title: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const safe =
    typeof src === "string" &&
    (src.startsWith("/") || /^https?:\/\//.test(src));
  return (
    <Image
      src={!failed && safe ? src : "/courses/default.svg"}
      alt="wadwadaw"
      width={800}
      height={460}
      className="course-cover"
      unoptimized
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
