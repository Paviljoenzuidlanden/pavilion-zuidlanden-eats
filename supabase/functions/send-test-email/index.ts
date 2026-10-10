import { createClient } from "npm:@supabase/supabase-js@2";
import { EmailAPIError, listEmailLogs } from "npm:@lovable.dev/email-js@0.3.1";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const TO = "info@paviljoenzuidlanden.nl";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const { data: u } = await supabase.auth.getUser(token);
  if (!u?.user) return json({ error: "Niet ingelogd" }, 401);
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
  if (!isAdmin) return json({ error: "Geen toegang" }, 403);

  let action = "status";
  try { const b = await req.json(); if (b?.action === "send") action = "send"; } catch { /* status */ }

  let sendResult: { ok: boolean; message: string } | null = null;
  if (action === "send") {
    try {
      const sentAt = new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" });
      const r = await sendTemplateEmail("test-notification", TO, {
        templateData: { sentAt, by: u.user.email },
      });
      sendResult = r.sent
        ? { ok: true, message: "Testmelding verstuurd." }
        : { ok: false, message: "Dit adres staat geblokkeerd (afgemeld of eerder onbestelbaar)." };
    } catch (e) {
      const code = e instanceof EmailAPIError ? e.code : "";
      const msg = code === "domain_not_verified"
        ? "Het afzenderdomein is nog niet gecontroleerd (DNS-instellingen ontbreken)."
        : code === "emails_disabled"
        ? "E-mails staan uitgeschakeld."
        : e instanceof EmailAPIError && e.status === 429
        ? "Te veel mails kort na elkaar, probeer het over een minuut opnieuw."
        : "Versturen mislukt.";
      console.error("send-test-email", e);
      sendResult = { ok: false, message: msg };
    }
  }

  let events: unknown[] = [];
  try {
    const since = new Date(Date.now() - 7 * 864e5).toISOString();
    const logs = await listEmailLogs({ recipient: TO, since, limit: 10 }, { apiKey: Deno.env.get("LOVABLE_API_KEY")! });
    events = logs.data;
  } catch (e) {
    console.error("logs", e);
  }
  return json({ send: sendResult, events });
});
