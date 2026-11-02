import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CalendarDays, Copy, Download, Eye, Mail, Pencil, Plus, Send, Trash2, X } from "lucide-react";
import QuoteDocument, { type Quote } from "@/components/QuoteDocument";
import QuoteArrangements, { type Arrangement } from "@/components/QuoteArrangements";
import { DEFAULT_DRINKS, DEFAULT_NOTES, agendaQuoteOptions, agendaQuoteOccasion, copyQuote, quoteFollowUp, euro, nextQuoteNumber, quoteTotals, type QuoteItem } from "@/lib/quotes";

type Agenda = Tables<"internal_agenda">;

const STATUS: Record<string, { label: string; cls: string }> = {
  concept: { label: "Concept", cls: "bg-muted text-muted-foreground border border-dashed border-border" },
  verstuurd: { label: "Verstuurd", cls: "bg-primary/15 text-primary border border-primary/30" },
  geaccepteerd: { label: "Geaccepteerd", cls: "bg-accent text-accent-foreground" },
  afgewezen: { label: "Afgewezen", cls: "bg-destructive/10 text-destructive" },
};

const QUARTERS = Array.from({ length: 96 }, (_, i) => `${String(Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`);

type Draft = Partial<Quote> & { itemsArr: QuoteItem[] };

export default function Quotes({ agendaRequest, onOpenAgenda, onHandled }: {
  agendaRequest?: string | null; onOpenAgenda: (id: string) => void; onHandled: () => void;
}) {
  const [rows, setRows] = useState<Quote[]>([]);
  const [agenda, setAgenda] = useState<Agenda[]>([]);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState<Draft | null>(null);
  const [view, setView] = useState<Quote | null>(null);
  const [printQ, setPrintQ] = useState<Quote | null>(null);
  const [arrangements, setArrangements] = useState<Arrangement[]>([]);
  const [filter, setFilter] = useState("alle");
  const [mail, setMail] = useState<{ quote: Quote; requestId: string } | null>(null);
  const [mailBusy, setMailBusy] = useState(false);
  const [mailError, setMailError] = useState("");

  const load = useCallback(async () => {
    const [q, a, arrangementsResult] = await Promise.all([
      supabase.from("quotes").select("*").order("created_at", { ascending: false }),
      supabase.from("internal_agenda").select("*").order("event_date", { ascending: true }),
      supabase.from("quote_arrangements").select("*").order("name"),
    ]);
    if (q.error) toast.error(q.error.message); else setRows(q.data ?? []);
    if (!a.error) setAgenda(a.data ?? []);
    if (arrangementsResult.error) toast.error(arrangementsResult.error.message); else setArrangements(arrangementsResult.data ?? []);
    return { quotes: q.data ?? [], agenda: a.data ?? [] };
  }, []);
  useEffect(() => { load(); }, [load]);

  const fromAgenda = (a: Agenda | undefined, base: Draft): Draft => a ? {
    ...base, agenda_id: a.id, client_name: a.name ?? base.client_name, client_email: a.email ?? base.client_email,
    event_date: a.event_date, start_time: a.start_time, end_time: a.end_time,
    guests_count: a.guests ?? base.guests_count, guests_text: a.guests ? String(a.guests) : base.guests_text,
    occasion: agendaQuoteOccasion(a),
  } : base;

  const newDraft = (quotes: Quote[], agendaId?: string, ag: Agenda[] = agenda): Draft => {
    const base: Draft = {
      quote_number: nextQuoteNumber(quotes.map((r) => r.quote_number), new Date().getFullYear()),
      status: "concept", client_name: "", guests_count: 20, location: "It Boumantsje 4, Leeuwarden",
      intro: "Hartelijk dank voor uw aanvraag. Graag bieden wij u onderstaand arrangement aan voor uw feest.",
      drinks_text: DEFAULT_DRINKS, notes: DEFAULT_NOTES, signed_by: "Arnold Nicolai",
      itemsArr: [{ title: "", description: "", price: 0, perPerson: true }],
    };
    return fromAgenda(ag.find((x) => x.id === agendaId), base);
  };

  // Vanuit de interne agenda: bestaande offerte openen of nieuwe maken
  useEffect(() => {
    if (!agendaRequest) return;
    (async () => {
      const { quotes, agenda: ag } = await load();
      const existing = quotes.find((q) => q.agenda_id === agendaRequest);
      if (existing) setView(existing); else setEdit(newDraft(quotes, agendaRequest, ag));
      onHandled();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agendaRequest]);

  const save = async () => {
    if (!edit) return;
    if (!edit.client_name?.trim()) return toast.error("Vul de naam van de klant in");
    if (!edit.quote_number) return toast.error("Offertenummer ontbreekt");
    if (edit.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(edit.client_email.trim())) return toast.error("Vul een geldig e-mailadres in");
    const items = edit.itemsArr.filter((i) => i.title.trim()).map((i) => ({ ...i, price: Number(i.price) || 0 }));
    const { itemsArr, id, created_at, updated_at, ...rest } = edit;
    const payload = {
      ...rest, quote_number: edit.quote_number, client_name: edit.client_name.trim(), client_email: edit.client_email?.trim() || null,
      items: items as unknown as Quote["items"], guests_count: Math.max(1, Number(rest.guests_count) || 1),
      event_date: rest.event_date || null, start_time: rest.start_time || null, end_time: rest.end_time || null,
      agenda_id: rest.agenda_id || null,
    };
    const res = id
      ? await supabase.from("quotes").update(payload).eq("id", id).select().single()
      : await supabase.from("quotes").insert(payload).select().single();
    if (res.error) return toast.error(res.error.message);
    if (payload.agenda_id) {
      const t = quoteTotals(items, payload.guests_count);
      await supabase.from("internal_agenda").update({ quote_amount: t.total }).eq("id", payload.agenda_id);
    }
    toast.success("Offerte opgeslagen"); setEdit(null); load(); setView(res.data);
  };

  const markSent = async (q: Quote) => {
    const { data, error } = await supabase.from("quotes").update({ status: "verstuurd", sent_at: new Date().toISOString() }).eq("id", q.id).select().single();
    if (error) return toast.error(error.message);
    if (q.agenda_id) await supabase.from("internal_agenda").update({ status: "offerte_verstuurd" }).eq("id", q.agenda_id);
    toast.success("Gemarkeerd als verstuurd"); load(); if (view?.id === q.id) setView(data);
  };

  const duplicate = (q: Quote) => {
    setView(null);
    setEdit({ ...copyQuote(q, nextQuoteNumber(rows.map(r => r.quote_number), new Date().getFullYear())),
      itemsArr: structuredClone((q.items as unknown as QuoteItem[]) ?? []) });
  };
  const openMail = (q: Quote) => { setMailError(""); setMail({ quote: q, requestId: crypto.randomUUID() }); };
  const sendMail = async () => {
    if (!mail || mailBusy) return;
    setMailBusy(true); setMailError("");
    try {
      const { data, error } = await supabase.functions.invoke("send-quote", { body: { quoteId: mail.quote.id, requestId: mail.requestId } });
      if (error || !data?.ok) {
        let message = data?.error || "Offerte mailen mislukt. Probeer later opnieuw.";
        if (error && "context" in error && error.context instanceof Response) {
          try { message = (await error.context.json()).error || message; } catch { /* fallback */ }
        }
        setMailError(message); return;
      }
      toast.success("Offerte per e-mail verstuurd"); setMail(null);
      const loaded = await load();
      if (view?.id === mail.quote.id) setView(loaded.quotes.find(q => q.id === mail.quote.id) ?? null);
    } catch { setMailError("Offerte mailen mislukt. Probeer later opnieuw."); }
    finally { setMailBusy(false); }
  };

  const setStatus = async (q: Quote, status: string) => {
    const { error } = await supabase.from("quotes").update({ status }).eq("id", q.id);
    if (error) return toast.error(error.message);
    if (q.agenda_id && status === "geaccepteerd") await supabase.from("internal_agenda").update({ status: "definitief" }).eq("id", q.agenda_id);
    load();
  };

  const remove = async (q: Quote) => {
    if (!window.confirm(`Offerte ${q.quote_number} verwijderen?`)) return;
    const { error } = await supabase.from("quotes").delete().eq("id", q.id);
    if (error) toast.error(error.message); else { setView(null); load(); }
  };

  const download = (q: Quote) => {
    setPrintQ(q);
    const prev = document.title;
    setTimeout(() => {
      document.title = `Offerte ${q.quote_number} ${q.client_name}`;
      document.body.classList.add("printing-quote");
      const done = () => { document.body.classList.remove("printing-quote"); document.title = prev; window.removeEventListener("afterprint", done); };
      window.addEventListener("afterprint", done);
      window.print();
      setTimeout(done, 1000);
    }, 300);
  };

  const s = search.toLowerCase();
  const dueCount = rows.filter(r => quoteFollowUp(r)?.due).length;
  const shown = rows.filter((r) => (!s || `${r.quote_number} ${r.client_name} ${r.occasion ?? ""}`.toLowerCase().includes(s)) &&
    (filter === "alle" || (filter === "opvolgen" ? quoteFollowUp(r)?.due : r.status === filter)));
  const agendaTitle = (id: string | null) => agenda.find((a) => a.id === id);
  const f = (k: keyof Draft, v: unknown) => setEdit((e) => e && ({ ...e, [k]: v }));
  const setItem = (i: number, patch: Partial<QuoteItem>) => setEdit((e) => e && ({ ...e, itemsArr: e.itemsArr.map((it, j) => j === i ? { ...it, ...patch } : it) }));
  const agendaOptions = agendaQuoteOptions(agenda);
  const draftTotals = edit ? quoteTotals(edit.itemsArr.map((i) => ({ ...i, price: Number(i.price) || 0 })), Number(edit.guests_count) || 1) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <Input className="max-w-xs" placeholder="Zoek op klant of nummer…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button size="sm" onClick={() => setEdit(newDraft(rows))}><Plus className="w-4 h-4 mr-1" />Nieuwe offerte</Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {[['alle', 'Alles'], ['concept', 'Concept'], ['verstuurd', 'Verstuurd'], ['opvolgen', `Opvolgen (${dueCount})`], ['geaccepteerd', 'Geaccepteerd'], ['afgewezen', 'Afgewezen']].map(([value, label]) =>
          <Button key={value} size="sm" variant={filter === value ? "default" : "outline"} onClick={() => setFilter(value)}>{label}</Button>)}
      </div>

      {!shown.length && <p className="text-muted-foreground py-6">Nog geen offertes.</p>}
      <div className="space-y-2">
        {shown.map((q) => {
          const t = quoteTotals((q.items as unknown as QuoteItem[]) ?? [], q.guests_count);
          const a = agendaTitle(q.agenda_id);
          const followUp = quoteFollowUp(q);
          return (
            <div key={q.id} className="rounded-xl border border-border bg-card p-3 flex flex-wrap gap-3 items-center">
              <div className="min-w-0 flex-1 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{q.client_name}</span>
                  <span className="text-xs text-muted-foreground">#{q.quote_number}</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${STATUS[q.status]?.cls}`}>{STATUS[q.status]?.label ?? q.status}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {q.event_date ? format(new Date(q.event_date), "EEE d MMM yyyy", { locale: nl }) : "Geen datum"} · {q.guests_count} gasten · <strong className="text-foreground">{euro(t.total)}</strong>
                  {q.sent_at && ` · verstuurd ${format(new Date(q.sent_at), "d MMM", { locale: nl })}`}
                </div>
                {followUp && <div className={`text-xs mt-1 ${followUp.due ? "text-destructive" : "text-muted-foreground"}`}>
                  {followUp.daysLeft < 0 ? "Verlopen · wacht op antwoord" : followUp.daysLeft === 0 ? "Verloopt vandaag · wacht op antwoord" : `Geldig t/m ${format(followUp.deadline, "d MMM", { locale: nl })} · ${followUp.daysLeft} dagen over`}
                </div>}
                {a && <Button variant="link" className="h-auto p-0 text-xs mt-1" onClick={() => onOpenAgenda(a.id)}><CalendarDays className="w-3 h-3 mr-1" />{a.title}</Button>}
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" aria-label="Bekijken" onClick={() => setView(q)}><Eye className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" aria-label="Downloaden" onClick={() => download(q)}><Download className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" aria-label="Bewerken" onClick={() => setEdit({ ...q, itemsArr: (q.items as unknown as QuoteItem[]) ?? [] })}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" aria-label="Offerte kopiëren" title="Offerte kopiëren" onClick={() => duplicate(q)}><Copy className="w-4 h-4" /></Button>
                {['concept', 'verstuurd'].includes(q.status) && <Button size="icon" variant="ghost" aria-label="Offerte mailen" title="Offerte mailen" onClick={() => openMail(q)}><Mail className="w-4 h-4" /></Button>}
                <Button size="icon" variant="ghost" aria-label="Verwijderen" onClick={() => remove(q)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bekijken */}
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-[860px] max-h-[92vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Offerte {view?.quote_number}</DialogTitle></DialogHeader>
          {view && <>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => download(view)}><Download className="w-4 h-4 mr-1" />Download PDF</Button>
              {['concept', 'verstuurd'].includes(view.status) && <Button size="sm" variant="outline" onClick={() => openMail(view)}><Mail className="w-4 h-4 mr-1" />Offerte mailen</Button>}
              <Button size="sm" variant="outline" onClick={() => duplicate(view)}><Copy className="w-4 h-4 mr-1" />Kopiëren</Button>
              <Button size="sm" variant="outline" onClick={() => { setEdit({ ...view, itemsArr: (view.items as unknown as QuoteItem[]) ?? [] }); setView(null); }}><Pencil className="w-4 h-4 mr-1" />Bewerken</Button>
              {view.status === "concept" && <Button size="sm" variant="outline" onClick={() => markSent(view)}><Send className="w-4 h-4 mr-1" />Markeer als verstuurd</Button>}
              {view.status === "verstuurd" && <>
                <Button size="sm" variant="outline" onClick={() => { setStatus(view, "geaccepteerd"); setView({ ...view, status: "geaccepteerd" }); }}>Geaccepteerd</Button>
                <Button size="sm" variant="outline" onClick={() => { setStatus(view, "afgewezen"); setView({ ...view, status: "afgewezen" }); }}>Afgewezen</Button>
              </>}
            </div>
            <div className="overflow-x-auto rounded-md border border-border"><QuoteDocument q={view} /></div>
          </>}
        </DialogContent>
      </Dialog>

      {/* Bewerken */}
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{edit?.id ? `Offerte ${edit.quote_number} bewerken` : "Nieuwe offerte"}</DialogTitle></DialogHeader>
          {edit && (
            <div className="grid gap-3">
              <QuoteArrangements arrangements={arrangements} draft={edit} onReload={load} onApply={a => setEdit(d => d && ({ ...d,
                itemsArr: structuredClone(a.items as unknown as QuoteItem[]), intro: a.intro, drinks_text: a.drinks_text, notes: a.notes }))} />
              <div><Label>Koppelen aan interne agenda</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-2 text-sm" value={edit.agenda_id ?? ""}
                  onChange={(e) => setEdit((d) => d && (e.target.value ? fromAgenda(agenda.find((a) => a.id === e.target.value), d) : { ...d, agenda_id: null }))}>
                  <option value="">— Niet gekoppeld —</option>
                  {agendaOptions.map((a) => <option key={a.id} value={a.id}>{a.event_date ? format(new Date(a.event_date), "d MMM yyyy", { locale: nl }) : "?"} · {a.title}{a.name ? ` (${a.name})` : ""}</option>)}
                </select></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Klant</Label><Input value={edit.client_name ?? ""} onChange={(e) => f("client_name", e.target.value)} /></div>
                <div><Label>Gelegenheid</Label><Input value={edit.occasion ?? ""} onChange={(e) => f("occasion", e.target.value)} placeholder="Verjaardagsfeest" /></div>
              </div>
              <div><Label htmlFor="quote-client-email">E-mailadres klant</Label><Input id="quote-client-email" type="email" value={edit.client_email ?? ""} onChange={e => f("client_email", e.target.value)} /></div>
              <div className="grid grid-cols-3 gap-2">
                <div><Label>Datum</Label><Input type="date" value={edit.event_date ?? ""} onChange={(e) => f("event_date", e.target.value)} /></div>
                <div><Label>Van</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-2 text-sm" value={edit.start_time?.slice(0, 5) ?? ""} onChange={(e) => f("start_time", e.target.value)}>
                    <option value="">—</option>{QUARTERS.map((t) => <option key={t}>{t}</option>)}</select></div>
                <div><Label>Tot</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-2 text-sm" value={edit.end_time?.slice(0, 5) ?? ""} onChange={(e) => f("end_time", e.target.value)}>
                    <option value="">—</option>{QUARTERS.map((t) => <option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div><Label>Rekenen met gasten</Label><Input type="number" min={1} value={edit.guests_count ?? ""} onChange={(e) => f("guests_count", e.target.value)} /></div>
                <div><Label>Tekst aantal personen</Label><Input value={edit.guests_text ?? ""} onChange={(e) => f("guests_text", e.target.value)} placeholder="20 tot 25" /></div>
                <div><Label>Locatie</Label><Input value={edit.location ?? ""} onChange={(e) => f("location", e.target.value)} /></div>
              </div>
              <div><Label>Inleiding</Label><Textarea rows={2} value={edit.intro ?? ""} onChange={(e) => f("intro", e.target.value)} /></div>

              <div>
                <Label>Arrangement</Label>
                <div className="space-y-2 mt-1">
                  {edit.itemsArr.map((it, i) => (
                    <div key={i} className="rounded-md border border-border p-2 grid gap-2">
                      <div className="flex gap-2">
                        <Input placeholder="Onderdeel, bv. Bittergarnituur" value={it.title} onChange={(e) => setItem(i, { title: e.target.value })} />
                        <Button size="icon" variant="ghost" aria-label="Regel verwijderen" onClick={() => setEdit((d) => d && ({ ...d, itemsArr: d.itemsArr.filter((_, j) => j !== i) }))}><X className="w-4 h-4" /></Button>
                      </div>
                      <Input placeholder="Toelichting (optioneel)" value={it.description ?? ""} onChange={(e) => setItem(i, { description: e.target.value })} />
                      <div className="flex gap-2 items-center">
                        <Input type="number" step="0.05" className="w-28" value={it.price} onChange={(e) => setItem(i, { price: e.target.value as unknown as number })} />
                        <select className="h-10 rounded-md border border-input bg-background px-2 text-sm" value={it.perPerson ? "pp" : "vast"} onChange={(e) => setItem(i, { perPerson: e.target.value === "pp" })}>
                          <option value="pp">per persoon</option><option value="vast">vast bedrag</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => setEdit((d) => d && ({ ...d, itemsArr: [...d.itemsArr, { title: "", description: "", price: 0, perPerson: true }] }))}><Plus className="w-4 h-4 mr-1" />Regel toevoegen</Button>
                </div>
                {draftTotals && <p className="text-sm mt-2">Per persoon <strong>{euro(draftTotals.perPerson)}</strong> · Totaal bij {draftTotals.guests} gasten <strong>{euro(draftTotals.total)}</strong></p>}
              </div>

              <div><Label>Dranken (leeg = blok weglaten)</Label><Textarea rows={3} value={edit.drinks_text ?? ""} onChange={(e) => f("drinks_text", e.target.value)} /></div>
              <div><Label>Goed om te weten (één punt per regel)</Label><Textarea rows={5} value={edit.notes ?? ""} onChange={(e) => f("notes", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Ondertekend door</Label><Input value={edit.signed_by ?? ""} onChange={(e) => f("signed_by", e.target.value)} /></div>
                <div><Label>Status</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-2 text-sm" value={edit.status ?? "concept"} onChange={(e) => f("status", e.target.value)}>
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select></div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEdit(null)}>Annuleren</Button><Button onClick={save}>Opslaan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!mail} onOpenChange={o => { if (!o && !mailBusy) setMail(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Offerte mailen</DialogTitle></DialogHeader>
          <p className="text-sm">Offerte {mail?.quote.quote_number} voor {mail?.quote.client_name}</p>
          <p className="text-sm">Aan: <strong>{mail?.quote.client_email || 'Geen e-mailadres ingevuld'}</strong></p>
          <p className="text-sm text-muted-foreground">De klant ontvangt een beveiligde link om deze offerte te bekijken en als PDF op te slaan, geen bijlage. De link blijft 90 dagen beschikbaar; de offerte is 14 dagen geldig. Antwoorden komen bij info@paviljoenzuidlanden.nl.</p>
          {!mail?.quote.client_email && <p className="text-sm text-destructive">Vul het e-mailadres eerst in bij Bewerken en sla de offerte op.</p>}
          {mailError && <p role="alert" className="text-sm text-destructive">{mailError}</p>}
          <DialogFooter><Button variant="outline" disabled={mailBusy} onClick={() => setMail(null)}>Annuleren</Button><Button disabled={mailBusy || !mail?.quote.client_email} onClick={sendMail}><Mail className="w-4 h-4 mr-1" />{mailBusy ? 'Versturen…' : 'Versturen'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {printQ && createPortal(<div id="quote-print"><QuoteDocument q={printQ} /></div>, document.body)}
    </div>
  );
}
