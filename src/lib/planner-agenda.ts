import type { Tables } from "@/integrations/supabase/types";

export type PlannerAgendaItem = Pick<Tables<"internal_agenda">, "id" | "title" | "event_date" | "start_time" | "end_time" | "guests" | "status">;

export function agendaForDay(items: PlannerAgendaItem[], date: string) {
  return items.filter((item) => item.event_date === date && item.status !== "geannuleerd");
}