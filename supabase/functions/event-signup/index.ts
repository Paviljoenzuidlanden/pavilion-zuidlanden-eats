import * as React from "npm:react@18.3.1";
import { createClient } from "npm:@supabase/supabase-js@2";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

// Eenvoudige snelheidsbeperking per IP-adres (per function-instantie).
const hits = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now > h.reset) {
    hits.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }
  h.count += 1;
  return h.count > limit;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "onbekend";
  if (rateLimited(ip)) return json({ error: "Te veel aanvragen, probeer later opnieuw" }, 429);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Ongeldige aanvraag" }, 400);
  }

  const eventTitle = clean(body.eventTitle, 120);
  const eventDate = clean(body.eventDate, 40);
  const name = clean(body.name, 100);
  const email = clean(body.email, 255).toLowerCase();
  const phone = clean(body.phone, 30);
  const teamName = clean(body.teamName, 80);
  const teamSize = Number(body.teamSize);

  if (!eventTitle || !eventDate || !name || !/^\S+@\S+\.\S+$/.test(email)) {
    return json({ error: "Vul een geldige naam en e-mail in" }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Aanmelding opslaan (team via de bestaande functie met teamlimiet)
  if (teamName) {
    if (!(teamSize >= 1 && teamSize <= 4)) return json({ status: "ongeldige_grootte" }, 200);
    const { data, error } = await supabase.rpc("register_quiz_team", {
      _event_title: eventTitle,
      _event_date: eventDate,
      _team_name: teamName,
      _name: name,
      _email: email,
      _phone: phone,
      _team_size: teamSize,
    });
    if (error) return json({ error: "Aanmelden mislukt" }, 500);
    if (data !== "ok") return json({ status: data }, 200);
  } else {
    const { error } = await supabase.from("event_signups").insert({
      event_title: eventTitle,
      event_date: eventDate,
      name,
      email,
      phone: phone || null,
    });
    if (error) return json({ error: "Aanmelden mislukt" }, 500);
  }

  // E-mails: beste poging — een mislukte e-mail laat de aanmelding gewoon staan.
  let emailed = false;
  try {
    await sendTemplateEmail("signup-confirmation", email, {
      templateData: { name, eventTitle, eventDate, teamName: teamName || undefined, teamSize: teamName ? teamSize : undefined },
      idempotencyKey: `signup-confirm-${eventTitle}-${eventDate}-${email}-${Date.now()}`,
    });
    emailed = true;
  } catch (e) {
    console.error("signup-confirmation failed:", e);
  }
  try {
    await sendTemplateEmail("signup-notification", email, {
      templateData: { name, email, phone: phone || undefined, eventTitle, eventDate, teamName: teamName || undefined, teamSize: teamName ? teamSize : undefined },
      idempotencyKey: `signup-notify-${eventTitle}-${eventDate}-${email}-${Date.now()}`,
    });
  } catch (e) {
    console.error("signup-notification failed:", e);
  }

  return json({ status: "ok", emailed });
});
