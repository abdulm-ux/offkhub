import { supabase } from "@/lib/supabase";
import type { CalendarEvent } from "@/lib/types";

export const revalidate = 300;

const CATEGORY_COLOR: Record<string, string> = {
  academic: "bg-blueprint-line",
  exam: "bg-pending",
  registration: "bg-tape",
  holiday: "bg-approved",
  other: "bg-blueprint-line",
};

export default async function CalendarPage() {
  const today = new Date().toISOString().slice(0, 10);
  const { data: events } = (await supabase
    .from("calendar_events")
    .select("id, title, description, category, start_date, end_date")
    .gte("start_date", today)
    .order("start_date")) as { data: CalendarEvent[] | null };

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-8">Academic Calendar</h1>
      <div className="space-y-2 max-w-2xl">
        {events?.map((ev) => (
          <div key={ev.id} className="flex items-start gap-4 bg-paper text-ink rounded-sm px-4 py-3">
            <div className="font-mono text-xs text-blueprint/70 shrink-0 w-24">
              {new Date(ev.start_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
              {ev.end_date && ` – ${new Date(ev.end_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] uppercase text-paper px-1.5 py-0.5 rounded-sm ${CATEGORY_COLOR[ev.category]}`}>
                  {ev.category}
                </span>
                <span className="font-medium">{ev.title}</span>
              </div>
              {ev.description && <p className="text-sm text-ink/60 mt-1">{ev.description}</p>}
            </div>
          </div>
        ))}
        {!events?.length && <p className="text-paper/50 text-sm">No upcoming events on the calendar yet.</p>}
      </div>
    </div>
  );
}
