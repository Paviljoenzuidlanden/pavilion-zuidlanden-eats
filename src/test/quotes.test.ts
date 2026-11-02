import { describe, it, expect } from "vitest";
import { quoteTotals, nextQuoteNumber, DEFAULT_NOTES } from "@/lib/quotes";

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
});
