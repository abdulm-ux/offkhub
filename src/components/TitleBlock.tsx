// Signature element: every technical drawing carries a "title block" in its
// corner — code, title, scale, date, drawn-by. We borrow that vernacular
// directly for the course header instead of a generic hero banner.

export default function TitleBlock({
  code,
  title,
  department,
  level,
  materialCount,
}: {
  code: string;
  title: string;
  department: string;
  level: number;
  materialCount: number;
}) {
  return (
    <div className="crop-marks border border-blueprint-line bg-blueprint-light/30 rounded-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-blueprint-line">
        <Field label="Course No." value={code} mono />
        <Field label="Level" value={`${level}L`} mono />
        <Field label="Dept." value={department} />
        <Field label="Sheets" value={`${materialCount} files`} mono />
      </div>
      <div className="border-t border-blueprint-line px-4 py-3">
        <h1 className="font-display text-xl sm:text-2xl font-semibold text-paper">{title}</h1>
      </div>
    </div>
  );
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-paper/50">{label}</div>
      <div className={`text-sm text-paper ${mono ? "font-mono" : "font-medium"}`}>{value}</div>
    </div>
  );
}
