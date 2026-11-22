import { describe, it, expect } from "vitest";
import { recurringDates, shiftWeeks } from "@/lib/availability";

describe("terugkerende beschikbaarheid", () => {
  it("geeft elke vrijdag binnen de periode", () => {
    expect(recurringDates(5, "2026-11-22", "2026-12-13")).toEqual(["2026-11-27", "2026-12-04", "2026-12-11"]);
  });
  it("vorige week kopiëren schuift precies 7 dagen", () => {
    expect(shiftWeeks("2026-11-27", 1)).toBe("2026-12-04");
    expect(shiftWeeks("2026-12-04", -1)).toBe("2026-11-27");
  });
});
