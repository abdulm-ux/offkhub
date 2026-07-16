import { supabase } from "@/lib/supabase";
import CourseCard from "@/components/CourseCard";
import type { Course } from "@/lib/types";

export const revalidate = 3600;

export default async function LevelPage({
  params,
}: {
  params: { school: string; department: string; level: string };
}) {
  const { data: dept } = await supabase
    .from("departments")
    .select("id, name")
    .eq("slug", params.department)
    .single();

  const { data: courses } = (await supabase
    .from("courses")
    .select("id, department_id, level, code, title")
    .eq("department_id", dept?.id)
    .eq("level", Number(params.level))
    .order("code")) as { data: Course[] | null };

  return (
    <div>
      <div className="font-mono text-xs text-tape uppercase tracking-widest mb-2">
        {params.school.toUpperCase()} / {dept?.name} / {params.level}L
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-8">Courses</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {courses?.map((c) => (
          <CourseCard key={c.id} course={c} departmentSlug={`${params.school}/${params.department}`} />
        ))}
        {!courses?.length && (
          <p className="text-paper/50 text-sm col-span-full">
            No courses added for this level yet — add some in{" "}
            <a href="/admin/courses" className="text-tape underline">/admin/courses</a>.
          </p>
        )}
      </div>
    </div>
  );
}
