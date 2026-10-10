import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

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

  const name = clean(body.name, 100);
  const email = clean(body.email, 255).toLowerCase();
  const phone = clean(body.phone, 20);
  const occasion = clean(body.occasion, 80);
  const guests = Number(body.guests);
  const date = clean(body.date, 80);
  const message = clean(body.message, 2000);

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !occasion || !(guests >= 1 && guests <= 200)) {
    return json({ error: "Vul alle verplichte velden geldig in" }, 400);
  }

  try {
    await sendTemplateEmail("booking-notification", email, {
      templateData: {
        name,
        email,
        phone: phone || undefined,
        occasion,
        guests,
        date: date || undefined,
        message: message || undefined,
      },
      idempotencyKey: `booking-${email}-${Date.now()}`,
    });
  } catch (e) {
    // De aanvraag zelf is geldig; een mislukte e-mail mag de bezoeker niet blokkeren.
    console.error("booking-notification failed:", e);
    return json({ ok: true, emailed: false });
  }

  return json({ ok: true, emailed: true });
});
