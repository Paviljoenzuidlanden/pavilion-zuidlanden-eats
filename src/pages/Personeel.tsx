import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, addWeeks, format, startOfWeek } from "date-fns";
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
import { LogOut, Trash2, Send, Plus, KeyRound, ChevronLeft, ChevronRight } from "lucide-react";

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

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">Zet de schakelaar aan op dagen dat je kunt werken en vul je tijden in (tot 4 weken vooruit).</p>
      {days().map((d) => {
        const on = !!rows[d] || !!draft[d];
        const v = get(d);
        return (
          <div key={d} className={`rounded-xl border p-3 flex flex-wrap items-center gap-3 ${rows[d] ? "border-accent bg-accent/10" : "border-border bg-card"}`}>
            <Switch checked={on} onCheckedChange={(c) => (c ? setDraft((p) => ({ ...p, [d]: v })) : rows[d] ? remove(d) : setDraft((p) => { const n = { ...p }; delete n[d]; return n; }))} />
            <span className="w-44 capitalize font-medium text-sm">{nice(d)}</span>
            {on && (
              <>
                <Input type="time" className="w-28" value={v.start} onChange={(e) => setDraft((p) => ({ ...p, [d]: { ...v, start: e.target.value } }))} />
                <span className="text-muted-foreground">–</span>
                <Input type="time" className="w-28" value={v.end} onChange={(e) => setDraft((p) => ({ ...p, [d]: { ...v, end: e.target.value } }))} />
                <Input placeholder="Opmerking" className="flex-1 min-w-[140px]" maxLength={200} value={v.note} onChange={(e) => setDraft((p) => ({ ...p, [d]: { ...v, note: e.target.value } }))} />
                {draft[d] && <Button size="sm" onClick={() => save(d)}>Opslaan</Button>}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Rooster bekijken ---------------- */
function MySchedule({ user, profiles }: { user: User; profiles: Profile[] }) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  useEffect(() => {
    supabase.from("shifts").select("*").eq("published", true).gte("date", days()[0]).order("date").order("start_time")
      .then(({ data }) => setShifts((data ?? []) as Shift[]));
  }, []);
  const name = (id: string) => profiles.find((p) => p.id === id)?.display_name ?? "—";
  const byDate = shifts.reduce<Record<string, Shift[]>>((a, s) => ((a[s.date] ||= []).push(s), a), {});
  if (!shifts.length) return <p className="text-muted-foreground">Er is nog geen rooster gepubliceerd.</p>;
  return (
    <div className="space-y-4">
      {Object.entries(byDate).map(([d, list]) => (
        <div key={d} className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-display uppercase tracking-wider text-primary capitalize mb-2">{nice(d)}</h3>
          {list.map((s) => (
            <div key={s.id} className={`flex justify-between text-sm py-1 ${s.user_id === user.id ? "font-semibold text-accent" : ""}`}>
              <span>{name(s.user_id)}{s.user_id === user.id && " (jij)"}{s.note && <span className="text-muted-foreground font-normal"> · {s.note}</span>}</span>
              <span>{t5(s.start_time)} – {t5(s.end_time)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------------- Rooster maken (beheer) ---------------- */
function Planner({ profiles }: { profiles: Profile[] }) {
  const [date, setDate] = useState(days()[0]);
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
  const dayAvail = avail.filter((a) => a.date === date);
  const dayShifts = shifts.filter((s) => s.date === date);
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
          {days().map((d) => {
            const n = avail.filter((a) => a.date === d).length;
            const sc = shifts.filter((s) => s.date === d).length;
            return (
              <button key={d} onClick={() => setDate(d)} className={`shrink-0 rounded-lg border px-3 py-2 text-xs text-left ${d === date ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
                <div className="capitalize font-semibold">{format(new Date(d + "T12:00"), "EEE d MMM", { locale: nl })}</div>
                <div className="opacity-80">{n} besch. · {sc} dienst</div>
              </button>
            );
          })}
        </div>
      </div>
      <Button onClick={publishAll} disabled={!drafts.length}><Send className="w-4 h-4" /> Publiceer alle concepten ({drafts.length})</Button>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-display uppercase tracking-wider text-primary mb-3">Beschikbaar op {nice(date)}</h3>
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
          <h3 className="font-display uppercase tracking-wider text-primary mb-3">Rooster {nice(date)}</h3>
          {!dayShifts.length && <p className="text-sm text-muted-foreground">Nog geen diensten.</p>}
          {dayShifts.map((s) => (
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

/* ---------------- Pagina ---------------- */
const Personeel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
    if (!user) return;
    supabase.from("user_roles").select("role").eq("user_id", user.id).then(({ data }) => setIsAdmin(!!data?.some((r) => r.role === "admin")));
    loadProfiles();
  }, [user, loadProfiles]);

  const me = useMemo(() => profiles.find((p) => p.id === user?.id), [profiles, user]);

  useEffect(() => { document.title = "Personeel – Paviljoen Zuidlanden"; }, []);

  if (!ready) return null;
  if (!user) return <Login />;

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
        <Tabs defaultValue="beschikbaarheid">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="beschikbaarheid">Mijn beschikbaarheid</TabsTrigger>
            <TabsTrigger value="rooster">Rooster</TabsTrigger>
            {isAdmin && <TabsTrigger value="planner">Rooster maken</TabsTrigger>}
            {isAdmin && <TabsTrigger value="personeel">Personeel</TabsTrigger>}
          </TabsList>
          <TabsContent value="beschikbaarheid"><Availability user={user} /></TabsContent>
          <TabsContent value="rooster"><MySchedule user={user} profiles={profiles} /></TabsContent>
          {isAdmin && <TabsContent value="planner"><Planner profiles={profiles} /></TabsContent>}
          {isAdmin && <TabsContent value="personeel"><StaffAdmin profiles={profiles} reload={loadProfiles} me={user.id} /></TabsContent>}
        </Tabs>
      </main>
    </div>
  );
};

export default Personeel;
