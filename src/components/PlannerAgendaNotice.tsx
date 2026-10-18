import { CalendarDays } from "lucide-react";
import { agendaForDay, type PlannerAgendaItem } from "@/lib/planner-agenda";

const statusLabels: Record<string, string> = {
  concept: "Concept",
  offerte_verstuurd: "Offerte verstuurd",
  definitief: "Definitief",
};

export default function PlannerAgendaNotice({ items, date }: { items: PlannerAgendaItem[]; date: string }) {
  const events = agendaForDay(items, date);
  if (!events.length) return null;

  return (
    <div className="mb-2 space-y-1 border-l-2 border-primary bg-primary/10 px-2 py-1.5 text-xs text-foreground">
      {events.map((event) => (
        <div key={event.id} className="min-w-0 space-y-0.5">
          <div className="flex items-start gap-1">
            <CalendarDays className="mt-0.5 h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0 break-words font-semibold">{event.title}</span>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            <span className="font-semibold">{event.guests != null ? `${event.guests} pax` : "Pax onbekend"}</span>
            {event.start_time && <span className="tabular-nums">{event.start_time.slice(0, 5)}{event.end_time ? `–${event.end_time.slice(0, 5)}` : ""}</span>}
          </div>
          <div className="text-muted-foreground">{statusLabels[event.status] ?? event.status}</div>
        </div>
      ))}
    </div>
  );
}