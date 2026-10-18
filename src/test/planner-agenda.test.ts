import { describe, expect, it } from "vitest";
import { agendaForDay, type PlannerAgendaItem } from "@/lib/planner-agenda";

const party: PlannerAgendaItem = { id: "party", title: "Feest", event_date: "2026-10-18", start_time: "16:30:00", end_time: null, guests: 40, status: "definitief" };

describe("agenda in roosterplanner", () => {
  it("koppelt een feest met het opgegeven aantal pax alleen aan zijn eigen dag", () => {
    expect(agendaForDay([party], "2026-10-18")[0]?.guests).toBe(40);
    expect(agendaForDay([party], "2026-10-19")).toEqual([]);
  });
  it("neemt concepten en offertes mee maar geen geannuleerde aanvragen", () => {
    const items = ["concept", "offerte_verstuurd", "geannuleerd"].map((status) => ({ ...party, id: status, status }));
    expect(agendaForDay(items, "2026-10-18").map((item) => item.status)).toEqual(["concept", "offerte_verstuurd"]);
  });
});