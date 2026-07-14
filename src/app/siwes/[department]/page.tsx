import { supabase } from "@/lib/supabase";
import MaterialCard from "@/components/MaterialCard";
import type { Material } from "@/lib/types";

export const revalidate = 60;

export default async function SiwesDepartmentPage({ params }: { params: { department: string } }) {
  const { data: dept } = await supabase.from("departments").select("id, name").eq("slug", params.department).single();

  const { data: materials } = (await supabase
    .from("materials")
    .select("*")
    .eq("department_id", dept?.id)
    .eq("type", "siwes")
    .eq("approved", true)
    .order("created_at", { ascending: false })) as { data: Material[] | null };

  return (
    <div>
      <div className="font-mono text-xs text-tape uppercase tracking-widest mb-2">SIWES / {dept?.name}</div>
      <h1 className="font-display text-2xl font-semibold text-paper mb-8">Resources</h1>

      <div className="space-y-2">
        {materials?.map((m) => {
          const { data } = supabase.storage.from("materials").getPublicUrl(m.file_path);
          return <MaterialCard key={m.id} material={m} fileUrl={data.publicUrl} />;
        })}
        {!materials?.length && (
          <div className="border border-dashed border-blueprint-line rounded-sm p-8 text-center text-paper/50 text-sm">
            Nothing uploaded yet for this department —{" "}
            <a href="/upload" className="text-tape underline">upload one</a>.
          </div>
        )}
      </div>
    </div>
  );
}
