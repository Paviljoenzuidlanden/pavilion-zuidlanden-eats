import * as React from "npm:react@18.3.1";
import { createClient } from "npm:@supabase/supabase-js@2";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const WD = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
const MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

function niceDate(d: string): string {
  const dt = new Date(`${d}T12:00:00`);
  if (isNaN(dt.getTime())) return d;
  return `${WD[dt.getDay()]} ${dt.getDate()} ${MONTHS[dt.getMonth()]}`;
}

const t5 = (t: string) => t.slice(0, 5);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Alleen beheerders mogen dit aanroepen
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const { data: u } = await supabase.auth.getUser(token);
  if (!u?.user) return json({ error: "Niet ingelogd" }, 401);
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
  if (!isAdmin) return json({ error: "Geen toegang" }, 403);

  let body: { shiftIds?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Ongeldige aanvraag" }, 400);
  }

  const shiftIds = Array.isArray(body.shiftIds)
    ? body.shiftIds.map(String).filter((s) => /^[0-9a-f-]{36}$/i.test(s)).slice(0, 200)
    : [];
  if (!shiftIds.length) return json({ sent: 0, skipped: 0 });

  const today = new Date().toISOString().slice(0, 10);
  const { data: shifts, error } = await supabase
    .from("shifts")
    .select("id, user_id, date, start_time, end_time, note, published, profiles:profiles!inner(id, display_name, email)")
    .in("id", shiftIds)
    .eq("published", true)
    .gte("date", today);

  if (error) return json({ error: "Ophalen mislukt" }, 500);

  const byUser = new Map<string, { name: string; email: string; shifts: { date: string; time: string; note?: string }[] }>();
  for (const s of shifts ?? []) {
    const p = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
    if (!p?.email) continue;
    const entry = byUser.get(s.user_id) ?? { name: p.display_name ?? "", email: p.email, shifts: [] };
    entry.shifts.push({ date: niceDate(s.date), time: `${t5(s.start_time)}–${t5(s.end_time)}`, note: s.note ?? undefined });
    byUser.set(s.user_id, entry);
  }

  let sent = 0;
  let skipped = 0;
  const key = [...shiftIds].sort().join(",").slice(0, 60);
  for (const [userId, entry] of byUser) {
    try {
      const result = await sendTemplateEmail("schedule-published", entry.email, {
        templateData: { name: entry.name, shifts: entry.shifts },
        idempotencyKey: `schedpub-${userId}-${key}`,
      });
      if (result.sent) sent += 1;
      else skipped += 1;
    } catch (e) {
      console.error(`schedule-published failed for ${userId}:`, e);
      skipped += 1;
    }
  }

  return json({ sent, skipped });
});
