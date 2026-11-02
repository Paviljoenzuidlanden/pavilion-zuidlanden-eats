import { format } from "date-fns";
import { nl } from "date-fns/locale";
import logo from "@/assets/logo-offerte.png.asset.json";
import { euro, lineTotal, quoteTotals, type QuoteItem } from "@/lib/quotes";
import type { Tables } from "@/integrations/supabase/types";

export type Quote = Tables<"quotes">;

const Sprig = ({ flip, className = "" }: { flip?: boolean; className?: string }) => (
  <svg viewBox="0 0 60 120" className={className} style={{ transform: flip ? "scaleX(-1)" : undefined }} fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M5 118 C 20 80, 35 40, 55 2" />
    {[20, 40, 60, 80, 100].map((y, i) => (
      <g key={y}>
        <path d={`M${44 - i * 7} ${y - 8} q -14 -2 -18 8 q 12 4 18 -8z`} />
        <path d={`M${44 - i * 7} ${y - 8} q 6 -12 18 -10 q -4 12 -18 10z`} />
      </g>
    ))}
  </svg>
);

const H = ({ children }: { children: React.ReactNode }) => (
  <div className="quote-h">{children}</div>
);

export default function QuoteDocument({ q }: { q: Quote }) {
  const items = (q.items as unknown as QuoteItem[]) ?? [];
  const t = quoteTotals(items, q.guests_count);
  const date = q.event_date ? format(new Date(q.event_date), "EEE d MMMM yyyy", { locale: nl }) : "n.t.b.";
  const time = q.start_time ? `${q.start_time.slice(0, 5)}${q.end_time ? ` tot ${q.end_time.slice(0, 5)}` : ""}` : "n.t.b.";
  const notes = (q.notes ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
  const facts: [string, string][] = [
    ["Klant", q.client_name || "—"], ["Datum", date], ["Tijd", time],
    ["Aantal personen", q.guests_text || String(q.guests_count)], ["Gelegenheid", q.occasion || "—"], ["Locatie", q.location],
  ];

  return (
    <div className="quote-doc">
      <Sprig className="quote-sprig" />
      <Sprig flip className="quote-sprig quote-sprig-r" />
      <div className="quote-head">
        <img src={logo} alt="Paviljoen Zuidlanden" className="quote-logo" />
        <div className="quote-rule"><span /><i /><span /></div>
        <div className="quote-tagline">De plek om samen te komen.</div>
        <div className="quote-title">Offerte</div>
        <div className="quote-meta">Offertenr. {q.quote_number}{q.sent_at ? ` · ${format(new Date(q.sent_at), "d MMMM yyyy", { locale: nl })}` : ""}</div>
      </div>
      <div className="quote-body">
        {q.intro && <p className="quote-intro">{q.intro}</p>}
        <div className="quote-facts">
          {facts.map(([l, v]) => <div key={l}><div className="quote-l">{l}</div><div className="quote-v">{v}</div></div>)}
        </div>

        <H>ARRANGEMENT</H>
        {items.map((i, idx) => (
          <div className="quote-item" key={idx}>
            <div><div className="quote-item-t">{i.title}</div>{i.description && <div className="quote-item-d">{i.description}</div>}</div>
            <div className="quote-amt">
              {i.perPerson ? <>{euro(i.price)} p.p. × {t.guests}<br /><strong>{euro(lineTotal(i, t.guests))}</strong></> : euro(i.price)}
            </div>
          </div>
        ))}
        <div className="quote-totals">
          <div><span>Totaal per persoon</span><strong>{euro(t.perPerson)}</strong></div>
          <div><span>Totaal bij {t.guests} gasten</span><strong>{euro(t.total)}</strong></div>
          {q.drinks_text && <div><span>Dranken aan de bar</span><strong>nacalculatie</strong></div>}
        </div>

        {q.drinks_text && <><H>DRANKEN</H><p className="quote-p">{q.drinks_text}</p></>}
        {notes.length > 0 && <><H>GOED OM TE WETEN</H><ul className="quote-ul">{notes.map((n, i) => <li key={i}>{n}</li>)}</ul></>}
        <p className="quote-p" style={{ marginTop: 10 }}>Met vriendelijke groet, <strong>{q.signed_by}</strong> · paviljoenzuidlanden.nl</p>
        <div className="quote-welcome">Wij heten u graag welkom!</div>
      </div>
      <div className="quote-foot">
        <svg viewBox="0 0 794 110" preserveAspectRatio="none"><path d="M0 30 C 200 0, 400 60, 794 10 L794 110 L0 110Z" fill="currentColor" /></svg>
        <div className="quote-foot-t">— PAVILJOEN ZUIDLANDEN —</div>
      </div>
    </div>
  );
}
