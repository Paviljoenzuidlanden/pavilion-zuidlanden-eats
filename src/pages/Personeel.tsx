import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, addMonths, addWeeks, endOfMonth, format, startOfMonth, startOfWeek } from "date-fns";
import { nl } from "date-fns/locale";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { LogOut, Trash2, Send, Plus, KeyRound, ChevronLeft, ChevronRight, Download } from "lucide-react";

type Profile = { id: string; display_name: string; email: string };
type Avail = { id: string; user_id: string; date: string; start_time: string; end_time: string; note: string | null };
type Shift = { id: string; user_id: string; date: string; start_time: string; end_time: string; note: string | null; published: boolean };

const days = () => Array.from({ length: 29 }, (_, i) => format(addDays(new Date(), i), "yyyy-MM-dd"));
const nice = (d: string) => format(new Date(d + "T12:00"), "EEEE d MMMM", { locale: nl });
const t5 = (t: string) => t.slice(0, 5);

async function staffFn(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("manage-staff", { body });
  if (error) {
    let msg = error.message;
    try { msg = (await (error as { context: Response }).context.json()).error ?? msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  return data;
}

/* ---------------- Login ---------------- */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => { staffFn({ action: "needs_bootstrap" }).then((d) => setNeedsSetup(!!d?.needs)).catch(() => {}); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (needsSetup) {
        await staffFn({ action: "bootstrap", password });
        toast.success("Beheeraccount aangemaakt");
        setNeedsSetup(false);
        await supabase.auth.signInWithPassword({ email: "info@paviljoenzuidlanden.nl", password });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw new Error("E-mailadres of wachtwoord onjuist");
      }
    } catch (err) { toast.error((err as Error).message); }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-sm space-y-5">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-primary">Personeel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {needsSetup ? "Eerste keer: kies een wachtwoord voor info@paviljoenzuidlanden.nl" : "Log in met je account"}
          </p>
        </div>
        {!needsSetup && (
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="pw">Wachtwoord</Label>
          <Input id="pw" type="password" minLength={needsSetup ? 8 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>{needsSetup ? "Beheeraccount aanmaken" : "Inloggen"}</Button>
        {!needsSetup && <p className="text-xs text-muted-foreground">Wachtwoord vergeten? Vraag de beheerder om een nieuw wachtwoord.</p>}
      </form>
    </div>
  );
}

/* ---------------- Beschikbaarheid ---------------- */
function Availability({ user }: { user: User }) {
  const [rows, setRows] = useState<Record<string, Avail>>({});
  const [draft, setDraft] = useState<Record<string, { start: string; end: string; note: string }>>({});
  const [week, setWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [view, setView] = useState<"week" | "month">("month");

  const load = useCallback(async () => {
    const { data } = await supabase.from("availability").select("*").eq("user_id", user.id).gte("date", days()[0]);
    const map: Record<string, Avail> = {};
    (data ?? []).forEach((a) => (map[a.date] = a as Avail));
    setRows(map);
  }, [user.id]);
  useEffect(() => { load(); }, [load]);

  const get = (d: string) => draft[d] ?? (rows[d] ? { start: t5(rows[d].start_time), end: t5(rows[d].end_time), note: rows[d].note ?? "" } : { start: "16:00", end: "22:00", note: "" });

  const save = async (d: string) => {
    const v = get(d);
    const { error } = await supabase.from("availability").upsert(
      { user_id: user.id, date: d, start_time: v.start, end_time: v.end, note: v.note.slice(0, 200) || null },
      { onConflict: "user_id,date" },
    );
    if (error) return toast.error(error.message);
    setDraft((p) => { const n = { ...p }; delete n[d]; return n; });
    toast.success("Opgeslagen"); load();
  };
  const remove = async (d: string) => {
    await supabase.from("availability").delete().eq("user_id", user.id).eq("date", d);
    load();
  };

  const isOpen = (d: string) => [0, 4, 5, 6].includes(new Date(d + "T12:00").getDay());
  const maxDate = days()[days().length - 1];
  const withinWindow = (d: string) => d >= days()[0] && d <= maxDate;
  const isOn = (d: string) => !!rows[d] || !!draft[d];

  const toggleQuick = async (d: string) => {
    if (isOn(d)) {
      if (rows[d]) return remove(d);
      return setDraft((p) => { const n = { ...p }; delete n[d]; return n; });
    }
    const { error } = await supabase.from("availability").upsert(
      { user_id: user.id, date: d, start_time: "16:00", end_time: "22:00", note: null },
      { onConflict: "user_id,date" },
    );
    if (error) return toast.error(error.message);
    toast.success("Beschikbaarheid doorgegeven — pas de tijden aan in de weekweergave");
    load();
  };

  const monthStart = startOfWeek(month, { weekStartsOn: 1 });
  const monthEnd = addDays(startOfWeek(endOfMonth(month), { weekStartsOn: 1 }), 6);
  const monthDays = Array.from({ length: Math.round((monthEnd.getTime() - monthStart.getTime()) / 86400000) + 1 }, (_, i) => format(addDays(monthStart, i), "yyyy-MM-dd"));
  const weekDays = Array.from({ length: 7 }, (_, i) => format(addDays(week, i), "yyyy-MM-dd"));

  const monthCell = (d: string) => {
    const outside = !d.startsWith(format(month, "yyyy-MM"));
    const open = isOpen(d);
    const allowed = open && withinWindow(d);
    const on = isOn(d);
    const v = get(d);
    const today = d === days()[0];
    return (
      <div key={d} className={`border rounded-md p-1 sm:p-2 min-h-14 sm:min-h-24 min-w-0 flex flex-col gap-1 ${outside ? "bg-muted/40 border-border" : today ? "bg-accent/10 border-accent" : "bg-card border-border"}`}>
        <div className={`capitalize text-[11px] sm:text-xs font-semibold leading-none ${outside ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
          {format(new Date(d + "T12:00"), "d MMM", { locale: nl })}
        </div>
        {!open && <span className="hidden sm:inline text-xs text-muted-foreground/60">Gesloten</span>}
        {open && !allowed && <span className="hidden sm:inline text-xs text-muted-foreground/50">—</span>}
        {allowed && (
          <button
            onClick={() => toggleQuick(d)}
            className={`mt-auto w-full text-left rounded-md px-1.5 sm:px-2 py-1 sm:py-1.5 text-[11px] sm:text-xs leading-tight transition-colors truncate ${on ? "bg-accent text-accent-foreground font-semibold" : "border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary/50"}`}
          >
            {on ? (<>
              <span className="sm:hidden">✓</span>
              <span className="hidden sm:inline">{t5(v.start)}–{t5(v.end)}{v.note ? ` · ${v.note}` : ""}</span>
            </>) : (<>
              <span className="sm:hidden">+</span>
              <span className="hidden sm:inline">+ beschikbaar</span>
            </>)}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Geef aan wanneer je kunt werken op donderdag t/m zondag (tot 4 weken vooruit). In de maandweergave klik je op een dag om je aan/af te melden; tijden en opmerkingen stel je in de weekweergave in.</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1" aria-label="Beschikbaarheidweergave">
          <Button size="sm" variant={view === "month" ? "default" : "outline"} onClick={() => setView("month")}>Maand</Button>
          <Button size="sm" variant={view === "week" ? "default" : "outline"} onClick={() => setView("week")}>Week</Button>
        </div>
        {view === "month" && <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={() => setMonth(addMonths(month, -1))} aria-label="Vorige maand"><ChevronLeft className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" onClick={() => setMonth(startOfMonth(new Date()))}>Deze maand</Button>
          <Button size="icon" variant="outline" onClick={() => setMonth(addMonths(month, 1))} aria-label="Volgende maand"><ChevronRight className="w-4 h-4" /></Button>
          <span className="font-display uppercase text-primary capitalize w-full sm:w-auto">{format(month, "MMMM yyyy", { locale: nl })}</span>
        </div>}
      </div>
      {view === "week" && <WeekNav week={week} setWeek={setWeek} />}
      {view === "month" && (
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1" aria-label="Maandbeschikbaarheid">
          {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((d) => <div key={d} className="text-center text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground py-1 sm:py-2">{d}</div>)}
          {monthDays.map((d) => monthCell(d))}
        </div>
      )}
      {view === "week" && (
        <div className="space-y-2">
          {weekDays.filter((d) => isOpen(d)).map((d) => {
            const allowed = withinWindow(d);
            const on = isOn(d);
            const v = get(d);
            return (
              <div key={d} className={`rounded-xl border p-3 flex flex-wrap items-center gap-3 ${on ? "border-accent bg-accent/10" : "border-border bg-card"} ${!allowed ? "opacity-50" : ""}`}>
                <Switch disabled={!allowed} checked={on} onCheckedChange={(c) => (c ? setDraft((p) => ({ ...p, [d]: v })) : rows[d] ? remove(d) : setDraft((p) => { const n = { ...p }; delete n[d]; return n; }))} />
                <span className="w-44 capitalize font-medium text-sm">{nice(d)}</span>
                {on && allowed && (
                  <>
                    <Input type="time" className="w-28" value={v.start} onChange={(e) => setDraft((p) => ({ ...p, [d]: { ...v, start: e.target.value } }))} />
                    <span className="text-muted-foreground">–</span>
                    <Input type="time" className="w-28" value={v.end} onChange={(e) => setDraft((p) => ({ ...p, [d]: { ...v, end: e.target.value } }))} />
                    <Input placeholder="Opmerking" className="flex-1 min-w-[140px]" maxLength={200} value={v.note} onChange={(e) => setDraft((p) => ({ ...p, [d]: { ...v, note: e.target.value } }))} />
                    {draft[d] && <Button size="sm" onClick={() => save(d)}>Opslaan</Button>}
                  </>
                )}
                {on && !allowed && <span className="text-xs text-muted-foreground italic">Buiten de aanmeldperiode</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------- Weeknavigatie ---------------- */
function WeekNav({ week, setWeek, children }: { week: Date; setWeek: (d: Date) => void; children?: React.ReactNode }) {
  const end = addDays(week, 6);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" onClick={() => setWeek(addWeeks(week, -1))} aria-label="Vorige week"><ChevronLeft className="w-4 h-4" /></Button>
        <Button size="sm" variant="outline" onClick={() => setWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))}>Deze week</Button>
        <Button size="icon" variant="outline" onClick={() => setWeek(addWeeks(week, 1))} aria-label="Volgende week"><ChevronRight className="w-4 h-4" /></Button>
        <span className="font-display uppercase tracking-wider text-primary sm:ml-2 capitalize w-full sm:w-auto">
          {format(week, "d MMM", { locale: nl })} – {format(end, "d MMM yyyy", { locale: nl })}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ---------------- Rooster bekijken (agenda) ---------------- */
function MySchedule({ user, profiles }: { user: User; profiles: Profile[] }) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [week, setWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [view, setView] = useState<"week" | "month">("month");
  const [loading, setLoading] = useState(false);
  const monthStart = startOfWeek(month, { weekStartsOn: 1 });
  const monthEnd = addDays(startOfWeek(endOfMonth(month), { weekStartsOn: 1 }), 6);
  const monthDays = Array.from({ length: Math.round((monthEnd.getTime() - monthStart.getTime()) / 86400000) + 1 }, (_, i) => format(addDays(monthStart, i), "yyyy-MM-dd"));
  const weekDays = Array.from({ length: 7 }, (_, i) => format(addDays(week, i), "yyyy-MM-dd"));
  const visibleDays = view === "month" ? monthDays : weekDays;
  useEffect(() => {
    let active = true;
    setLoading(true);
    supabase.from("shifts").select("*").eq("published", true)
      .gte("date", visibleDays[0]).lte("date", visibleDays[visibleDays.length - 1])
      .order("date").order("start_time")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) toast.error("Rooster kon niet worden geladen");
        setShifts((data ?? []) as Shift[]);
        setLoading(false);
      });
    return () => { active = false; };
  }, [view, week, month]);
  const name = (id: string) => profiles.find((p) => p.id === id)?.display_name ?? "—";
  const dayCell = (d: string, compact: boolean) => {
    const list = shifts.filter((s) => s.date === d);
    const own = list.filter((s) => s.user_id === user.id);
    const colleagues = list.filter((s) => s.user_id !== user.id);
    const today = d === days()[0];
    const outside = compact && !d.startsWith(format(month, "yyyy-MM"));
    return (
      <div key={d} className={`border border-border rounded-md p-1 sm:p-2 min-w-0 flex flex-col gap-1 ${compact ? "min-h-16 sm:min-h-28" : "min-h-[120px]"} ${today ? "bg-accent/10 border-accent" : outside ? "bg-muted/40" : "bg-card"}`}>
        <div className={`capitalize text-[11px] sm:text-xs font-semibold leading-none ${outside ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
          {format(new Date(d + "T12:00"), compact ? "d MMM" : "EEE d MMM", { locale: nl })}
        </div>
        {!list.length && <span className="hidden sm:inline text-xs text-muted-foreground/60">—</span>}
        {own.map((s) => (
          <div key={s.id} className="rounded-md px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs bg-accent text-accent-foreground font-semibold break-words">
            <div className="sm:hidden leading-tight">Jij<br />{t5(s.start_time)}<br />–{t5(s.end_time)}</div>
            <div className="hidden sm:block">Jij · {t5(s.start_time)}–{t5(s.end_time)}</div>
            {s.note && <div className="hidden sm:block font-normal break-words">{s.note}</div>}
          </div>
        ))}
        {colleagues.length > 0 && (
          <div className="border-t border-border pt-1 mt-auto">
            <div className="sm:hidden text-[10px] text-muted-foreground leading-tight">{colleagues.length} {colleagues.length > 1 ? "collega's" : "collega"}</div>
            {colleagues.map((s) => (
              <div key={s.id} className="hidden sm:block text-xs py-1 break-words">
                <div className="font-medium text-foreground">{name(s.user_id)}</div>
                <div className="text-muted-foreground">{t5(s.start_time)}–{t5(s.end_time)}{s.note && ` · ${s.note}`}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1" aria-label="Roosterweergave">
          <Button size="sm" variant={view === "month" ? "default" : "outline"} onClick={() => setView("month")}>Maand</Button>
          <Button size="sm" variant={view === "week" ? "default" : "outline"} onClick={() => setView("week")}>Week</Button>
        </div>
        {view === "month" && <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={() => setMonth(addMonths(month, -1))} aria-label="Vorige maand"><ChevronLeft className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" onClick={() => setMonth(startOfMonth(new Date()))}>Deze maand</Button>
          <Button size="icon" variant="outline" onClick={() => setMonth(addMonths(month, 1))} aria-label="Volgende maand"><ChevronRight className="w-4 h-4" /></Button>
          <span className="font-display uppercase text-primary capitalize w-full sm:w-auto">{format(month, "MMMM yyyy", { locale: nl })}</span>
        </div>}
      </div>
      {view === "week" && <WeekNav week={week} setWeek={setWeek} />}
      {loading && <p className="text-sm text-muted-foreground">Rooster laden…</p>}
      {!loading && !shifts.length && <p className="text-sm text-muted-foreground">Voor deze periode is nog geen rooster gepubliceerd.</p>}
      {view === "month" ? (
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1" aria-label="Maandrooster">
          {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((d) => <div key={d} className="text-center text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground py-1 sm:py-2">{d}</div>)}
          {monthDays.map((d) => dayCell(d, true))}
        </div>
      ) : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">{weekDays.map((d) => dayCell(d, false))}</div>}
    </div>
  );
}

/* ---------------- Rooster maken (beheer, agenda) ---------------- */
function Planner({ profiles }: { profiles: Profile[] }) {
  const [date, setDate] = useState(days()[0]);
  const [week, setWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [avail, setAvail] = useState<Avail[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [form, setForm] = useState({ user_id: "", start: "16:00", end: "22:00", note: "" });

  const load = useCallback(async () => {
    const [a, s] = await Promise.all([
      supabase.from("availability").select("*").gte("date", days()[0]),
      supabase.from("shifts").select("*").gte("date", days()[0]).order("start_time"),
    ]);
    setAvail((a.data ?? []) as Avail[]); setShifts((s.data ?? []) as Shift[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const name = (id: string) => profiles.find((p) => p.id === id)?.display_name ?? "—";
  const weekDays = Array.from({ length: 7 }, (_, i) => format(addDays(week, i), "yyyy-MM-dd"));
  const dayAvail = avail.filter((a) => a.date === date);
  const drafts = shifts.filter((s) => !s.published);

  const add = async (v = form) => {
    if (!v.user_id) return toast.error("Kies een medewerker");
    const { error } = await supabase.from("shifts").insert({ user_id: v.user_id, date, start_time: v.start, end_time: v.end, note: v.note || null });
    if (error) return toast.error(error.message);
    load();
  };
  const del = async (id: string) => { await supabase.from("shifts").delete().eq("id", id); load(); };
  const togglePub = async (s: Shift) => { await supabase.from("shifts").update({ published: !s.published }).eq("id", s.id); load(); };
  const publishAll = async () => {
    const { error } = await supabase.from("shifts").update({ published: true }).eq("published", false);
    if (error) return toast.error(error.message);
    toast.success("Rooster gepubliceerd"); load();
  };

  return (
    <div className="space-y-4">
      <WeekNav week={week} setWeek={setWeek}>
        <Button onClick={publishAll} disabled={!drafts.length}><Send className="w-4 h-4" /> Publiceer concepten ({drafts.length})</Button>
      </WeekNav>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
        {weekDays.map((d) => {
          const list = shifts.filter((s) => s.date === d);
          const nAvail = avail.filter((a) => a.date === d).length;
          const selected = d === date;
          const today = d === days()[0];
          return (
            <button key={d} onClick={() => setDate(d)} className={`rounded-xl border p-3 min-h-[120px] text-left transition-colors ${selected ? "border-primary ring-2 ring-primary/30 bg-card" : today ? "border-accent bg-accent/5" : "border-border bg-card"}`}>
              <div className="capitalize text-xs font-semibold text-muted-foreground mb-0.5">
                {format(new Date(d + "T12:00"), "EEE d MMM", { locale: nl })}
              </div>
              <div className="text-[11px] text-muted-foreground mb-2">{nAvail} beschikbaar</div>
              {list.map((s) => (
                <div key={s.id} className={`rounded-lg px-2 py-1.5 mb-1.5 text-xs ${s.published ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border border-dashed border-muted-foreground/40"}`}>
                  <div className="font-semibold">{name(s.user_id)}</div>
                  <div className="opacity-80">{t5(s.start_time)}–{t5(s.end_time)}{s.note && ` · ${s.note}`}</div>
                  {!s.published && <div className="opacity-70 italic">concept</div>}
                </div>
              ))}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-display uppercase tracking-wider text-primary mb-3 capitalize">Beschikbaar op {nice(date)}</h3>
          {!dayAvail.length && <p className="text-sm text-muted-foreground">Niemand heeft zich beschikbaar gesteld.</p>}
          {dayAvail.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-1.5 text-sm border-b border-border last:border-0">
              <span>{name(a.user_id)} <span className="text-muted-foreground">{t5(a.start_time)}–{t5(a.end_time)}{a.note && ` · ${a.note}`}</span></span>
              <Button size="sm" variant="outline" onClick={() => add({ user_id: a.user_id, start: t5(a.start_time), end: t5(a.end_time), note: "" })}><Plus className="w-3 h-3" /> Inplannen</Button>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Handmatig inplannen</p>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })}>
              <option value="">Kies medewerker…</option>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
            </select>
            <div className="flex gap-2">
              <Input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
              <Input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
            </div>
            <Input placeholder="Taak / opmerking (bijv. bar, keuken)" maxLength={200} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            <Button size="sm" onClick={() => add()}>Toevoegen</Button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-display uppercase tracking-wider text-primary mb-3 capitalize">Diensten op {nice(date)}</h3>
          {!shifts.filter((s) => s.date === date).length && <p className="text-sm text-muted-foreground">Nog geen diensten.</p>}
          {shifts.filter((s) => s.date === date).map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-2 py-1.5 text-sm border-b border-border last:border-0">
              <span>{name(s.user_id)} <span className="text-muted-foreground">{t5(s.start_time)}–{t5(s.end_time)}{s.note && ` · ${s.note}`}</span></span>
              <span className="flex items-center gap-2">
                <button onClick={() => togglePub(s)}><Badge variant={s.published ? "default" : "outline"}>{s.published ? "Gepubliceerd" : "Concept"}</Badge></button>
                <Button size="icon" variant="ghost" onClick={() => del(s.id)} aria-label="Verwijderen"><Trash2 className="w-4 h-4" /></Button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Personeelsbeheer ---------------- */
function StaffAdmin({ profiles, reload, me }: { profiles: Profile[]; reload: () => void; me: string }) {
  const [f, setF] = useState({ name: "", email: "", password: "", isAdmin: false });
  const [busy, setBusy] = useState(false);
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await staffFn({ action: "create", ...f }); toast.success("Medewerker toegevoegd"); setF({ name: "", email: "", password: "", isAdmin: false }); reload(); }
    catch (err) { toast.error((err as Error).message); }
    setBusy(false);
  };
  const reset = async (p: Profile) => {
    const pw = window.prompt(`Nieuw wachtwoord voor ${p.display_name} (min. 8 tekens):`);
    if (!pw) return;
    try { await staffFn({ action: "reset_password", userId: p.id, password: pw }); toast.success("Wachtwoord gewijzigd"); }
    catch (err) { toast.error((err as Error).message); }
  };
  const remove = async (p: Profile) => {
    if (!window.confirm(`${p.display_name} verwijderen?`)) return;
    try { await staffFn({ action: "delete", userId: p.id }); reload(); } catch (err) { toast.error((err as Error).message); }
  };
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={create} className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-display uppercase tracking-wider text-primary">Medewerker toevoegen</h3>
        <Input placeholder="Naam" maxLength={100} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
        <Input type="email" placeholder="E-mailadres" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
        <Input type="text" placeholder="Wachtwoord (min. 8 tekens)" minLength={8} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
        <label className="flex items-center gap-2 text-sm"><Switch checked={f.isAdmin} onCheckedChange={(c) => setF({ ...f, isAdmin: c })} /> Ook beheerder</label>
        <Button type="submit" disabled={busy}>Toevoegen</Button>
        <p className="text-xs text-muted-foreground">Geef de medewerker het e-mailadres en wachtwoord door.</p>
      </form>
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-display uppercase tracking-wider text-primary mb-3">Personeel ({profiles.length})</h3>
        {profiles.map((p) => (
          <div key={p.id} className="flex items-center justify-between py-1.5 text-sm border-b border-border last:border-0">
            <span>{p.display_name} <span className="text-muted-foreground">{p.email}</span></span>
            <span className="flex">
              <Button size="icon" variant="ghost" onClick={() => reset(p)} aria-label="Wachtwoord wijzigen"><KeyRound className="w-4 h-4" /></Button>
              {p.id !== me && <Button size="icon" variant="ghost" onClick={() => remove(p)} aria-label="Verwijderen"><Trash2 className="w-4 h-4" /></Button>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Urenregistratie ---------------- */
type WorkHour = { id: string; user_id: string; date: string; start_time: string; end_time: string; note: string | null };

const hoursOf = (w: WorkHour) => {
  const [sh, sm] = w.start_time.split(":").map(Number);
  const [eh, em] = w.end_time.split(":").map(Number);
  return Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
};
const fmtH = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")} u`;

function MyHours({ user, profiles, isAdmin }: { user: User; profiles: Profile[]; isAdmin: boolean }) {
  const [rows, setRows] = useState<WorkHour[]>([]);
  const [form, setForm] = useState({ user_id: "", date: days()[0], start: "16:00", end: "22:00", note: "" });
  const [exportMonth, setExportMonth] = useState(() => format(new Date(), "yyyy-MM"));
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    const q = supabase.from("work_hours").select("*").order("date", { ascending: false }).order("start_time");
    const { data } = isAdmin ? await q : await q.eq("user_id", user.id);
    setRows((data ?? []) as WorkHour[]);
  }, [user.id, isAdmin]);
  useEffect(() => { load(); }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !form.user_id || form.user_id === user.id) return toast.error("Kies een medewerker");
    if (form.end <= form.start) return toast.error("Eindtijd moet na begintijd liggen");
    const { error } = await supabase.from("work_hours").insert({
      user_id: form.user_id, date: form.date, start_time: form.start, end_time: form.end, note: form.note.slice(0, 200) || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Uren opgeslagen");
    setForm({ ...form, note: "" });
    load();
  };
  const del = async (id: string) => { await supabase.from("work_hours").delete().eq("id", id); load(); };

  const exportCsv = async () => {
    if (!isAdmin || !/^\d{4}-(0[1-9]|1[0-2])$/.test(exportMonth)) return;
    setExporting(true);
    try {
      const from = `${exportMonth}-01`;
      const until = format(addMonths(new Date(`${from}T12:00:00`), 1), "yyyy-MM-dd");
      const all: WorkHour[] = [];
      // Fetch in batches so months with more than the default result limit are complete.
      for (let offset = 0; ; offset += 500) {
        const { data, error } = await supabase.from("work_hours")
          .select("id, user_id, date, start_time, end_time, note")
          .gte("date", from).lt("date", until)
          .order("date").order("start_time").order("id")
          .range(offset, offset + 499);
        if (error) throw error;
        all.push(...((data ?? []) as WorkHour[]));
        if (!data || data.length < 500) break;
      }
      if (!all.length) { toast.info("Geen geregistreerde uren in deze maand"); return; }

      // Quote all cells and neutralize spreadsheet formulas in staff-provided text.
      const cell = (value: string) => {
        const safe = /^[\s]*[=+\-@]/.test(value) ? `'${value}` : value;
        return `"${safe.replace(/"/g, '""')}"`;
      };
      const header = ["Medewerker", "E-mailadres", "Datum", "Begintijd", "Eindtijd", "Uren (decimaal)", "Opmerking"];
      const lines = all.map((r) => {
        const person = profiles.find((p) => p.id === r.user_id);
        return [person?.display_name ?? "Onbekend", person?.email ?? "", r.date, t5(r.start_time), t5(r.end_time), hoursOf(r).toFixed(2).replace(".", ","), r.note ?? ""].map(cell).join(";");
      });
      const blob = new Blob(["\uFEFF", header.map(cell).join(";"), "\r\n", lines.join("\r\n"), "\r\n"], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gewerkte-uren-${exportMonth}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { toast.error("Exporteren mislukt. Probeer het opnieuw."); }
    finally { setExporting(false); }
  };

  const name = (id: string) => profiles.find((p) => p.id === id)?.display_name ?? "—";
  const today = days()[0];
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const monthStart = format(new Date(), "yyyy-MM-01");
  const mine = rows.filter((r) => r.user_id === user.id);
  const sum = (list: WorkHour[]) => list.reduce((a, r) => a + hoursOf(r), 0);
  const totDay = sum(mine.filter((r) => r.date === today));
  const totWeek = sum(mine.filter((r) => r.date >= weekStart));
  const totMonth = sum(mine.filter((r) => r.date >= monthStart));

  return (
    <div className="space-y-6">
      {!isAdmin && <div className="grid grid-cols-3 gap-3">
        {[["Vandaag", totDay], ["Deze week", totWeek], ["Deze maand", totMonth]].map(([label, v]) => (
          <div key={label as string} className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="font-display text-2xl text-primary mt-1">{fmtH(v as number)}</div>
          </div>
        ))}
      </div>}

      {isAdmin && (
        <form onSubmit={add} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="font-display uppercase tracking-wider text-primary">Uren invoeren</h3>
          <select aria-label="Medewerker" required className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })}>
            <option value="">Kies medewerker…</option>
            {profiles.filter((p) => p.id !== user.id).map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
          </select>
          <div className="flex flex-wrap gap-2">
            <Input type="date" className="w-40" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <Input type="time" className="w-28" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} required />
            <span className="self-center text-muted-foreground">–</span>
            <Input type="time" className="w-28" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} required />
          </div>
          <Input placeholder="Opmerking (optioneel)" maxLength={200} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <Button type="submit" disabled={!form.user_id}><Plus className="w-4 h-4" /> Opslaan</Button>
        </form>
      )}

      {isAdmin && (
        <div className="flex flex-wrap items-end gap-3 border-y border-border py-4">
          <div className="space-y-2">
            <Label htmlFor="export-month">Maand voor salarisverwerking</Label>
            <Input id="export-month" type="month" className="w-44" value={exportMonth} onChange={(e) => setExportMonth(e.target.value)} />
          </div>
          <Button type="button" variant="outline" onClick={exportCsv} disabled={exporting || !exportMonth}>
            <Download className="w-4 h-4" /> {exporting ? "Exporteren…" : "Download CSV"}
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-display uppercase tracking-wider text-primary mb-3">Geregistreerde uren</h3>
        {!rows.length && <p className="text-sm text-muted-foreground">Nog geen uren geregistreerd.</p>}
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-2 py-1.5 text-sm border-b border-border last:border-0">
            <span className="capitalize">{nice(r.date)}</span>
            <span className="text-muted-foreground">
              {isAdmin && <span className="text-foreground font-medium mr-2">{name(r.user_id)}</span>}
              {t5(r.start_time)}–{t5(r.end_time)} · {fmtH(hoursOf(r))}{r.note && ` · ${r.note}`}
            </span>
            {isAdmin && <Button size="icon" variant="ghost" onClick={() => del(r.id)} aria-label="Verwijderen"><Trash2 className="w-4 h-4" /></Button>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Pagina ---------------- */
const Personeel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleReady, setRoleReady] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadProfiles = useCallback(async () => {
    const { data } = await supabase.from("profiles").select("id, display_name, email").order("display_name");
    setProfiles((data ?? []) as Profile[]);
  }, []);

  useEffect(() => {
    if (!user) { setRoleReady(false); setIsAdmin(false); return; }
    let active = true;
    setRoleReady(false);
    supabase.from("user_roles").select("role").eq("user_id", user.id).then(({ data, error }) => {
      if (!active) return;
      if (error) { toast.error("Je toegangsrechten konden niet worden geladen"); return; }
      setIsAdmin(!!data?.some((r) => r.role === "admin"));
      setRoleReady(true);
    });
    loadProfiles();
    return () => { active = false; };
  }, [user, loadProfiles]);

  const me = useMemo(() => profiles.find((p) => p.id === user?.id), [profiles, user]);

  useEffect(() => { document.title = "Personeel – Paviljoen Zuidlanden"; }, []);

  if (!ready) return null;
  if (!user) return <Login />;
  if (!roleReady) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display uppercase tracking-[0.2em] text-primary">Paviljoen · Personeel</span>
          <span className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-muted-foreground">{me?.display_name}</span>
            <Button size="sm" variant="outline" onClick={() => supabase.auth.signOut()}><LogOut className="w-4 h-4" /> Uitloggen</Button>
          </span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue={isAdmin ? "planner" : "beschikbaarheid"}>
          <TabsList className="mb-6 flex-wrap h-auto">
            {!isAdmin && <TabsTrigger value="beschikbaarheid">Mijn beschikbaarheid</TabsTrigger>}
            {!isAdmin && <TabsTrigger value="rooster">Rooster</TabsTrigger>}
            {isAdmin && <TabsTrigger value="planner">Rooster maken</TabsTrigger>}
            <TabsTrigger value="uren">{isAdmin ? "Urenregistratie" : "Mijn uren"}</TabsTrigger>
            {isAdmin && <TabsTrigger value="personeel">Personeel</TabsTrigger>}
          </TabsList>
          {!isAdmin && <TabsContent value="beschikbaarheid"><Availability user={user} /></TabsContent>}
          {!isAdmin && <TabsContent value="rooster"><MySchedule user={user} profiles={profiles} /></TabsContent>}
          <TabsContent value="uren"><MyHours user={user} profiles={profiles} isAdmin={isAdmin} /></TabsContent>
          {isAdmin && <TabsContent value="planner"><Planner profiles={profiles} /></TabsContent>}
          {isAdmin && <TabsContent value="personeel"><StaffAdmin profiles={profiles} reload={loadProfiles} me={user.id} /></TabsContent>}
        </Tabs>
      </main>
    </div>
  );
};

export default Personeel;
