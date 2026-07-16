import Link from "next/link";
import type { Course } from "@/lib/types";

export default function CourseCard({
  course,
  departmentSlug,
}: {
  course: Course;
  departmentSlug: string; // e.g. "set/architecture"
}) {
  return (
    <Link
      href={`/${departmentSlug}/${course.level}/${course.code.replace(/\s+/g, "-").toLowerCase()}`}
      className="crop-marks block bg-paper text-ink rounded-sm p-4 hover:-translate-y-0.5 transition-transform"
    >
      <div className="font-mono text-xs text-blueprint/70">{course.code}</div>
      <div className="font-display font-semibold mt-1">{course.title}</div>
    </Link>
  );
}
