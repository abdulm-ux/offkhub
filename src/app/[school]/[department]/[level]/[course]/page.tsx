import { supabase } from "@/lib/supabase";
import TitleBlock from "@/components/TitleBlock";
import MaterialCard from "@/components/MaterialCard";
import type { Material } from "@/lib/types";

export const revalidate = 60;

export default async function CoursePage({
  params,
}: {
  params: { school: string; department: string; level: string; course: string };
}) {
  const { data: dept } = await supabase
    .from("departments")
    .select("id, name")
    .eq("slug", params.department)
    .single();

  const codeGuess = params.course.replace(/-/g, " ");
  const { data: course } = await supabase
    .from("courses")
    .select("id, code, title, level")
    .eq("department_id", dept?.id)
    .ilike("code", codeGuess)
    .single();

  if (!course) {
    return <p className="text-paper/60">Course not found.</p>;
  }

  const { data: materials } = (await supabase
    .from("materials")
    .select("*")
    .eq("course_id", course.id)
    .eq("approved", true)
    .order("created_at", { ascending: false })) as { data: Material[] | null };

  return (
    <div>
      <TitleBlock
        code={course.code}
        title={course.title}
        department={dept?.name ?? ""}
        level={course.level}
        materialCount={materials?.length ?? 0}
      />

      <div className="mt-8 space-y-2">
        {materials?.map((m) => {
          const { data } = supabase.storage.from("materials").getPublicUrl(m.file_path);
          return <MaterialCard key={m.id} material={m} fileUrl={data.publicUrl} />;
        })}
        {!materials?.length && (
          <div className="border border-dashed border-blueprint-line rounded-sm p-8 text-center text-paper/50 text-sm">
            No materials uploaded for this course yet. Be the first —{" "}
            <a href="/upload" className="text-tape underline">upload one</a>.
          </div>
        )}
      </div>
    </div>
  );
}
