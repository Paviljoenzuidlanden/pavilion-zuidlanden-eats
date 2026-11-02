export type QuoteItem = { title: string; description?: string; price: number; perPerson: boolean };

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

export const DEFAULT_DRINKS =
  "Uw gasten kunnen zelf dranken bestellen aan de bar, tegen de prijzen van onze drankenkaart. Een vaste afkoop bieden wij niet aan. De daadwerkelijke consumptie registreren wij in de kassa en wordt afgerekend op basis van het werkelijke verbruik. U betaalt dus nooit meer dan er is geconsumeerd.";

export const DEFAULT_NOTES = [
  "Deze offerte is 14 dagen geldig vanaf de verzenddatum.",
  "Het definitieve aantal gasten ontvangen wij graag uiterlijk 3 dagen voor uw feest. De bedragen worden daarop aangepast.",
  "Heeft u gasten met een allergie of dieetwens? Laat het ons tijdig weten, dan houden wij hier rekening mee.",
  "Wij schenken geen alcoholische dranken aan personen onder de 18 jaar. Bij de bar houden wij dit bij met leeftijdsbandjes.",
  "Alle genoemde prijzen zijn in euro’s en inclusief btw. Betaling vindt plaats na afloop van uw feest.",
  "Heeft u vragen of wilt u iets aanpassen? Neem gerust contact met ons op via 0616488069 of info@paviljoenzuidlanden.nl",
].join("\n");
