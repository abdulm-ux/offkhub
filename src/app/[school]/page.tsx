import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function SchoolPage({ params }: { params: { school: string } }) {
  const { data: school } = await supabase
    .from("schools")
    .select("id, name")
    .eq("slug", params.school)
    .single();

  if (!school) {
    return <p className="text-paper/60">School not found.</p>;
  }

  const { data: departments } = await supabase
    .from("departments")
    .select("id, name, slug")
    .eq("school_id", school.id)
    .order("name");

  return (
    <div>
      <div className="font-mono text-xs text-tape uppercase tracking-widest mb-2">{school.name}</div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-8">Choose a department</h1>

      <div className="grid sm:grid-cols-2 gap-3">
        {departments?.map((d) => (
          <Link
            key={d.id}
            href={`/${params.school}/${d.slug}`}
            className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform"
          >
            <div className="font-display font-semibold">{d.name}</div>
          </Link>
        ))}
        {!departments?.length && (
          <p className="text-paper/50 text-sm">
            No departments added yet — add some in{" "}
            <a href="/admin/departments" className="text-tape underline">/admin/departments</a>.
          </p>
        )}
      </div>
    </div>
  );
}
