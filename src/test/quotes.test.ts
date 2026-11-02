import { describe, it, expect } from "vitest";
import { quoteTotals, nextQuoteNumber, DEFAULT_NOTES, agendaQuoteOptions, agendaQuoteOccasion } from "@/lib/quotes";

describe("offertes voor interne activiteiten", () => {
  const activity = { id: "d66", kind: "activiteit", status: "definitief", title: "D66 ledenbijeenkomst", occasion: null, event_date: "2026-11-12" };
  it("maakt de D66 ledenbijeenkomst van 12 november beschikbaar voor een offerte", () => {
    expect(agendaQuoteOptions([activity])).toEqual([activity]);
  });
  it("neemt de activiteitstitel over als gelegenheid", () => {
    expect(agendaQuoteOccasion(activity)).toBe("D66 ledenbijeenkomst");
  });
  it("behoudt feesten en sluit geannuleerde items uit de keuzelijst", () => {
    const feest = { ...activity, id: "feest", kind: "feest", status: "concept" };
    expect(agendaQuoteOptions([feest, { ...activity, status: "geannuleerd" }])).toEqual([feest]);
  });
});

describe("offerte berekening", () => {
  const items = [
    { title: "Koffie", price: 6.5, perPerson: true },
    { title: "Nootjes", price: 0, perPerson: false },
    { title: "Bittergarnituur", price: 4.5, perPerson: true },
    { title: "Zaalhuur", price: 0, perPerson: false },
  ];
  it("telt p.p.-prijzen maal gasten op", () => {
    expect(quoteTotals(items, 20)).toEqual({ perPerson: 11, total: 220, guests: 20 });
  });
  it("vaste bedragen tellen één keer", () => {
    expect(quoteTotals([{ title: "DJ", price: 150, perPerson: false }], 20).total).toBe(150);
  });
  it("offertenummer loopt per jaar door", () => {
    expect(nextQuoteNumber(["2026-001", "2026-007", "2025-020"], 2026)).toBe("2026-008");
    expect(nextQuoteNumber([], 2027)).toBe("2027-001");
  });
  it("standaardnotities bevatten de alcohol-/leeftijdsbandjes-passage", () => {
    expect(DEFAULT_NOTES).toContain("geen alcoholische dranken aan personen onder de 18 jaar");
    expect(DEFAULT_NOTES).toContain("leeftijdsbandjes");
  });
});
