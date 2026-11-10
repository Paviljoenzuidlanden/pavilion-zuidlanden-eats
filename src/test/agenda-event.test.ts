import { describe, expect, it } from "vitest";
import { kerstfreubelEvent } from "@/pages/Agenda";

describe("Kerstfreubelavond", () => {
  it("vindt plaats op 26 november van 19:30 tot 22:30", () => {
    expect(kerstfreubelEvent.date).toBe("26");
    expect(kerstfreubelEvent.month).toBe("Nov");
    expect(kerstfreubelEvent.time).toBe("19:30 – 22:30");
  });
  it("kost 22,50 per persoon", () => {
    expect(kerstfreubelEvent.pricePerPerson).toBe(22.5);
  });
  it("omvat twee consumpties", () => {
    expect(kerstfreubelEvent.includedDrinks).toBe(2);
  });
});