import { describe, expect, it } from "vitest";
import { groupEventSignups, signupTotals, type EventSignup } from "../lib/event-signups";

const signup = (id: string, overrides: Partial<EventSignup> = {}): EventSignup => ({
  id, event_title: "Pubquiz", event_date: "10 december", name: "Test", email: "test@example.com",
  phone: null, team_name: id, team_size: 4, reserve: false, created_at: "2026-10-24T19:48:00Z", ...overrides,
});

describe("Aanmeldingenbeheer", () => {
  it("telt ook 13 toegelaten teams, boven de openbare limiet van 12", () => {
    expect(signupTotals(Array.from({ length: 13 }, (_, i) => signup(String(i))))).toEqual({ admitted: 13, reserve: 0, people: 52 });
  });
  it("telt een toegelaten reserveteam bij de toegelaten teams", () => {
    const rows = [signup("a"), signup("b", { reserve: true })];
    expect(signupTotals(rows)).toEqual({ admitted: 1, reserve: 1, people: 4 });
    expect(signupTotals(rows.map((row) => row.id === "b" ? { ...row, reserve: false } : row))).toEqual({ admitted: 2, reserve: 0, people: 8 });
  });
  it("houdt verschillende evenementen en verschillende datums apart", () => {
    const groups = groupEventSignups([signup("a"), signup("b", { event_title: "Wijnproeverij" }), signup("c", { event_date: "12 maart" })]);
    expect(groups.map((group) => group.rows.map((row) => row.id))).toEqual([["a"], ["b"], ["c"]]);
  });
});