import { MATERIAL_TYPE_LABELS, type Material } from "@/lib/types";

const TYPE_COLOR: Record<string, string> = {
  lecture_note: "bg-blueprint-light",
  past_question: "bg-tape",
  textbook: "bg-approved",
  slide: "bg-blueprint-line",
  other: "bg-blueprint-line",
};

export default function MaterialCard({
  material,
  fileUrl,
}: {
  material: Material;
  fileUrl: string;
}) {
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 bg-paper text-ink rounded-sm px-4 py-3 hover:bg-paper/90 transition-colors"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-[10px] uppercase tracking-wide text-paper px-1.5 py-0.5 rounded-sm ${TYPE_COLOR[material.type]}`}
          >
            {MATERIAL_TYPE_LABELS[material.type]}
          </span>
          {material.session && (
            <span className="font-mono text-[11px] text-ink/50">{material.session}</span>
          )}
        </div>
        <div className="font-medium truncate">{material.title}</div>
      </div>
      <span className="font-mono text-xs text-blueprint shrink-0">↓ {material.download_count}</span>
    </a>
  );
}
