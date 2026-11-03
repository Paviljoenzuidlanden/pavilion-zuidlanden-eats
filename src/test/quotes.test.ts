import { describe, it, expect } from "vitest";
import { quoteTotals, nextQuoteNumber, DEFAULT_NOTES, DEFAULT_DRINKS, DRINK_BUDGET_GUESTS, DRINK_TOKENS_PER_GUEST, drinkBudget, QUOTE_PRESETS, agendaQuoteOptions, agendaQuoteOccasion, copyQuote, quoteFollowUp } from "@/lib/quotes";

describe("offerte kopiëren en opvolgen", () => {
  it("kopieert inhoud maar wist klant, koppeling en verzendstatus", () => {
    const result = copyQuote({ id: 'old', created_at: 'old', updated_at: 'old', client_name: 'Klant', client_email: 'klant@example.com', agenda_id: 'agenda', event_date: '2026-11-12', start_time: '19:00', end_time: '22:00', status: 'verstuurd', sent_at: '2026-11-02', quote_number: '2026-001', items: [{ title: 'Koffie', price: 6.5, perPerson: true }] }, '2026-002');
    expect(result).toMatchObject({ quote_number: '2026-002', client_name: '', client_email: null, agenda_id: null, event_date: null, start_time: null, end_time: null, status: 'concept', sent_at: null, items: [{ title: 'Koffie', price: 6.5, perPerson: true }] });
    expect(result).not.toHaveProperty('id');
  });
  it("berekent geldigheid van 14 dagen na versturen", () => {
    expect(quoteFollowUp({ status: 'verstuurd', sent_at: '2026-11-02T12:00:00Z' }, new Date('2026-11-02T12:00:00Z'))?.daysLeft).toBe(14);
  });
  it("markeert onbeantwoorde offertes vanaf drie dagen voor verlopen", () => {
    expect(quoteFollowUp({ status: 'verstuurd', sent_at: '2026-11-02T12:00:00Z' }, new Date('2026-11-13T12:00:00Z'))?.due).toBe(true);
    expect(quoteFollowUp({ status: 'verstuurd', sent_at: '2026-11-02T12:00:00Z' }, new Date('2026-11-12T12:00:00Z'))?.due).toBe(false);
  });
  it("volgt geaccepteerde offertes niet op", () => {
    expect(quoteFollowUp({ status: 'geaccepteerd', sent_at: '2026-11-02T12:00:00Z' }, new Date('2026-12-01T12:00:00Z'))).toBeNull();
  });
});

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
  it("biedt standaardopties met ondertekst aan", () => {
    expect(QUOTE_PRESETS.map((p) => p.title)).toEqual(["Koffie/Thee met oranjekoek", "Extra koffie, thee of cappuccino", "Welkomstdrankje Prosecco of alcoholvrij alternatief"]);
    expect(QUOTE_PRESETS.map((p) => p.price)).toEqual([5.25, 2.5, 5.95]);
    expect(QUOTE_PRESETS.every((p) => p.perPerson)).toBe(true);
    expect(QUOTE_PRESETS[0].description).toContain("crème");
    expect(QUOTE_PRESETS[1].description).toContain("cappuccino");
    expect(QUOTE_PRESETS[2].description).toContain("alcoholvrij");
  });
});

describe("dranken op basis van consumptiemunten", () => {
  it("standaarddrankentekst noemt consumptiemunten en de richtprijs van 3 euro", () => {
    expect(DEFAULT_DRINKS).toContain("Dranken op basis van consumptiemunten");
    expect(DEFAULT_DRINKS).toContain("€ 3,00 per consumptie");
    expect(DEFAULT_DRINKS).toContain("niet gebruikte munten retour genomen");
  });
  it("indicatieve begroting is standaard 5 munten p.p. tegen 3 euro per munt", () => {
    expect(DRINK_TOKENS_PER_GUEST).toBe(5);
    expect(DRINK_BUDGET_GUESTS).toEqual([25, 50, 75, 100]);
    expect(drinkBudget(25)).toEqual({ guests: 25, tokens: 125, budget: 375 });
    expect(drinkBudget(50)).toEqual({ guests: 50, tokens: 250, budget: 750 });
    expect(drinkBudget(75)).toEqual({ guests: 75, tokens: 375, budget: 1125 });
    expect(drinkBudget(100)).toEqual({ guests: 100, tokens: 500, budget: 1500 });
  });
  it("kan met een ander aantal munten per persoon rekenen, bijvoorbeeld 3", () => {
    expect(drinkBudget(25, 3)).toEqual({ guests: 25, tokens: 75, budget: 225 });
    expect(drinkBudget(50, 3)).toEqual({ guests: 50, tokens: 150, budget: 450 });
    expect(drinkBudget(100, 3)).toEqual({ guests: 100, tokens: 300, budget: 900 });
  });
});
