import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Item = Tables<"internal_agenda">;

const STATUS: Record<string, { label: string; cls: string }> = {
  concept: { label: "Concept", cls: "bg-muted text-muted-foreground border border-dashed border-border" },
  offerte_verstuurd: { label: "Offerte verstuurd", cls: "bg-primary/15 text-primary border border-primary/30" },
  definitief: { label: "Definitief", cls: "bg-accent text-accent-foreground" },
  geannuleerd: { label: "Geannuleerd", cls: "bg-destructive/10 text-destructive line-through" },
};

const empty: Partial<Item> = { kind: "feest", title: "", status: "concept" };

export default function InternalAgenda() {
  const [rows, setRows] = useState<Item[]>([]);
  const [filter, setFilter] = useState<string>("alle");
  const [edit, setEdit] = useState<Partial<Item> | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("internal_agenda").select("*")
      .order("event_date", { ascending: true, nullsFirst: true });
    if (error) toast.error(error.message); else setRows(data ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!edit?.title?.trim()) return toast.error("Vul een titel in");
    const { id, created_at, updated_at, ...rest } = edit as Item;
    const payload = {
      ...rest,
      event_date: rest.event_date || null, start_time: rest.start_time || null, end_time: rest.end_time || null,
      guests: rest.guests ? Number(rest.guests) : null,
      quote_amount: rest.quote_amount === null || (rest.quote_amount as unknown) === "" ? null : Number(rest.quote_amount),
    };
    const { error } = id
      ? await supabase.from("internal_agenda").update(payload).eq("id", id)
      : await supabase.from("internal_agenda").insert(payload as Item);
    if (error) return toast.error(error.message);
    toast.success("Opgeslagen"); setEdit(null); load();
  };

  const setStatus = async (r: Item, status: string) => {
    const { error } = await supabase.from("internal_agenda").update({ status }).eq("id", r.id);
    if (error) toast.error(error.message); else load();
  };

  const remove = async (r: Item) => {
    if (!window.confirm(`"${r.title}" verwijderen?`)) return;
    const { error } = await supabase.from("internal_agenda").delete().eq("id", r.id);
    if (error) toast.error(error.message); else load();
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const shown = rows.filter((r) => filter === "alle" || r.status === filter);
  const groups = shown.reduce<Record<string, Item[]>>((acc, r) => {
    const k = r.event_date ? format(new Date(r.event_date), "MMMM yyyy", { locale: nl }) : "Nog geen datum";
    (acc[k] ||= []).push(r); return acc;
  }, {});
  const f = (k: keyof Item, v: unknown) => setEdit((e) => ({ ...e, [k]: v }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          {["alle", "concept", "offerte_verstuurd", "definitief", "geannuleerd"].map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
              {s === "alle" ? "Alles" : STATUS[s].label} ({s === "alle" ? rows.length : rows.filter((r) => r.status === s).length})
            </Button>
          ))}
        </div>
        <Button size="sm" onClick={() => setEdit({ ...empty })}><Plus className="w-4 h-4 mr-1" />Toevoegen</Button>
      </div>
      <p className="text-xs text-muted-foreground">Aanvragen via het feestformulier komen hier automatisch binnen als concept.</p>

      {!shown.length && <p className="text-muted-foreground py-6">Niets gevonden.</p>}
      {Object.entries(groups).map(([k, list]) => (
        <div key={k}>
          <h3 className="font-display text-lg uppercase tracking-tight mb-2 capitalize">{k}</h3>
          <div className="space-y-2">
            {list.map((r) => {
              const past = !!r.event_date && r.event_date < today;
              return (
                <div key={r.id} className={`rounded-xl border border-border bg-card p-3 flex gap-3 ${past ? "opacity-60" : ""}`}>
                  <div className="w-14 shrink-0 text-center">
                    {r.event_date ? <>
                      <div className="font-display text-2xl leading-none">{format(new Date(r.event_date), "d")}</div>
                      <div className="text-xs uppercase text-muted-foreground">{format(new Date(r.event_date), "EEE", { locale: nl })}</div>
                    </> : <div className="text-xs text-muted-foreground">?</div>}
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{r.title}</span>
                      <Badge variant="outline">{r.kind === "feest" ? "Feest" : "Activiteit"}</Badge>
                      <span className={`text-xs rounded-full px-2 py-0.5 ${STATUS[r.status]?.cls}`}>{STATUS[r.status]?.label}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {r.start_time ? `${r.start_time.slice(0, 5)}${r.end_time ? `–${r.end_time.slice(0, 5)}` : ""} · ` : ""}
                      {r.guests ? `${r.guests} gasten · ` : ""}
                      {r.name ? <>{r.name}{r.email ? <> · <a className="underline" href={`mailto:${r.email}`}>{r.email}</a></> : null}{r.phone ? ` · ${r.phone}` : ""}</> : null}
                    </div>
                    {r.message && <div className="text-xs mt-1 italic">"{r.message}"</div>}
                    {(r.quote_amount != null || r.agreements) && (
                      <div className="text-xs mt-1 rounded-md bg-muted p-2">
                        {r.quote_amount != null && <div><strong>Offerte:</strong> € {Number(r.quote_amount).toFixed(2).replace(".", ",")}</div>}
                        {r.agreements && <div className="whitespace-pre-wrap"><strong>Afspraken:</strong> {r.agreements}</div>}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.status !== "offerte_verstuurd" && r.status !== "definitief" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setStatus(r, "offerte_verstuurd")}>Offerte verstuurd</Button>
                      )}
                      {r.status !== "definitief" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setStatus(r, "definitief")}>Definitief</Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <Button size="icon" variant="ghost" onClick={() => setEdit(r)} aria-label="Bewerken"><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(r)} aria-label="Verwijderen"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{edit?.id ? "Bewerken" : "Toevoegen"}</DialogTitle></DialogHeader>
          {edit && (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Soort</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-2 text-sm" value={edit.kind ?? "feest"} onChange={(e) => f("kind", e.target.value)}>
                    <option value="feest">Feest</option><option value="activiteit">Activiteit</option>
                  </select></div>
                <div><Label>Status</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-2 text-sm" value={edit.status ?? "concept"} onChange={(e) => f("status", e.target.value)}>
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select></div>
              </div>
              <div><Label>Titel</Label><Input value={edit.title ?? ""} onChange={(e) => f("title", e.target.value)} /></div>
              <div className="grid grid-cols-3 gap-2">
                <div><Label>Datum</Label><Input type="date" value={edit.event_date ?? ""} onChange={(e) => f("event_date", e.target.value)} /></div>
                <div><Label>Van</Label><Input type="time" value={edit.start_time?.slice(0, 5) ?? ""} onChange={(e) => f("start_time", e.target.value)} /></div>
                <div><Label>Tot</Label><Input type="time" value={edit.end_time?.slice(0, 5) ?? ""} onChange={(e) => f("end_time", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Contactpersoon</Label><Input value={edit.name ?? ""} onChange={(e) => f("name", e.target.value)} /></div>
                <div><Label>Aantal gasten</Label><Input type="number" value={edit.guests ?? ""} onChange={(e) => f("guests", e.target.value)} /></div>
                <div><Label>E-mail</Label><Input value={edit.email ?? ""} onChange={(e) => f("email", e.target.value)} /></div>
                <div><Label>Telefoon</Label><Input value={edit.phone ?? ""} onChange={(e) => f("phone", e.target.value)} /></div>
              </div>
              <div><Label>Offertebedrag (€)</Label><Input type="number" step="0.01" value={edit.quote_amount ?? ""} onChange={(e) => f("quote_amount", e.target.value)} /></div>
              <div><Label>Offerte / (prijs)afspraken</Label><Textarea rows={4} value={edit.agreements ?? ""} onChange={(e) => f("agreements", e.target.value)} placeholder="Bijv. 40 p. borrelplank, bar tot 23:00, aanbetaling 25%" /></div>
              {edit.message && <p className="text-xs text-muted-foreground">Bericht klant: "{edit.message}"</p>}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEdit(null)}>Annuleren</Button><Button onClick={save}>Opslaan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
