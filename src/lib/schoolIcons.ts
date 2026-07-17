export const SCHOOL_ICONS: Record<string, string> = {
  set: "🏗️",
  seet: "⚙️",
  sict: "💻",
  saat: "🌱",
  sps: "🧪",
  sls: "🔬",
};

export function schoolIcon(slug: string) {
  return SCHOOL_ICONS[slug] ?? "🎓";
}
