export type QuoteItem = { title: string; description?: string; price: number; perPerson: boolean };

export const agendaQuoteOptions = <T extends { status: string }>(agenda: T[]): T[] =>
  agenda.filter((item) => item.status !== "geannuleerd");

export const agendaQuoteOccasion = (agenda: { occasion: string | null; title: string }) =>
  agenda.occasion || agenda.title;

export function quoteFollowUp(quote: { status: string; sent_at: string | null }, now = new Date()) {
  if (quote.status !== "verstuurd" || !quote.sent_at) return null;
  const deadline = new Date(quote.sent_at);
  deadline.setDate(deadline.getDate() + 14);
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / 86400000);
  return { deadline, daysLeft, due: daysLeft <= 3 };
}

export function copyQuote<T extends { client_name: string; client_email: string | null; agenda_id: string | null; event_date: string | null; start_time: string | null; end_time: string | null; status: string; sent_at: string | null; quote_number: string; id: string; created_at: string; updated_at: string }>(quote: T, number: string) {
  const { id, created_at, updated_at, ...content } = quote;
  return { ...content, quote_number: number, client_name: "", client_email: null, agenda_id: null,
    event_date: null, start_time: null, end_time: null, status: "concept", sent_at: null };
}

export const lineTotal = (i: QuoteItem, guests: number) => (i.perPerson ? i.price * guests : i.price);

export function quoteTotals(items: QuoteItem[], guests: number) {
  const g = Math.max(1, Math.floor(guests || 1));
  const perPerson = items.filter((i) => i.perPerson).reduce((s, i) => s + i.price, 0);
  const total = items.reduce((s, i) => s + lineTotal(i, g), 0);
  return { perPerson: round(perPerson), total: round(total), guests: g };
}

const round = (n: number) => Math.round(n * 100) / 100;

export const euro = (n: number) =>
  "€ " + n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function nextQuoteNumber(existing: string[], year: number) {
  const prefix = `${year}-`;
  const max = existing
    .filter((n) => n.startsWith(prefix))
    .map((n) => parseInt(n.slice(prefix.length), 10))
    .filter((n) => !isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export const DEFAULT_DRINKS = [
  "Dranken op basis van consumptiemunten",
  "Voor de consumpties werken wij met consumptiemunten. Iedere munt vertegenwoordigt de reguliere kassaprijs van een consumptie.",
  "Voor de begroting hanteren we een gemiddelde richtprijs van € 3,00 per consumptie. De gasten kunnen hun munten gebruiken voor het bestellen van dranken aan de bar.",
  "Na afloop worden niet gebruikte munten retour genomen. Hierdoor betalen jullie uitsluitend voor de daadwerkelijk afgenomen consumpties.",
].join("\n\n");

export const DRINK_TOKENS_PER_GUEST = 5;
export const DRINK_TOKEN_PRICE = 3;
export const DRINK_BUDGET_GUESTS = [25, 50, 75, 100];

export const drinkBudget = (guests: number) => ({
  guests,
  tokens: guests * DRINK_TOKENS_PER_GUEST,
  budget: guests * DRINK_TOKENS_PER_GUEST * DRINK_TOKEN_PRICE,
});

export const DEFAULT_NOTES = [
  "Deze offerte is 14 dagen geldig vanaf de verzenddatum.",
  "Het definitieve aantal gasten ontvangen wij graag uiterlijk 3 dagen voor uw feest. De bedragen worden daarop aangepast.",
  "Heeft u gasten met een allergie of dieetwens? Laat het ons tijdig weten, dan houden wij hier rekening mee.",
  "Wij schenken geen alcoholische dranken aan personen onder de 18 jaar. Bij de bar houden wij dit bij met leeftijdsbandjes.",
  "Alle genoemde prijzen zijn in euro’s en inclusief btw. Betaling vindt plaats na afloop van uw feest.",
  "Heeft u vragen of wilt u iets aanpassen? Neem gerust contact met ons op via 0616488069 of info@paviljoenzuidlanden.nl",
].join("\n");
