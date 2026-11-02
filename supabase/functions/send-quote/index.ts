import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { EmailAPIError } from "npm:@lovable.dev/email-js@0.3.1";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";
import { publicQuoteSnapshot } from "../_shared/quote-publication.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const schema = z.object({ quoteId: z.string().uuid(), requestId: z.string().uuid() }).strict();
const SITE = "https://pavilion-zuidlanden-eats.lovable.app";

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return json({ error: "Mailvoorziening niet beschikbaar" }, 500);
  const db = createClient(url, key);
  const { data: auth } = await db.auth.getUser(req.headers.get("Authorization")?.replace(/^Bearer /i, "") || "");
  if (!auth.user) return json({ error: "Niet ingelogd" }, 401);
  const { data: admin } = await db.rpc("has_role", { _user_id: auth.user.id, _role: "admin" });
  if (!admin) return json({ error: "Geen toegang" }, 403);
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Ongeldige offerteaanvraag" }, 400);
    const { quoteId, requestId } = parsed.data;
    const { data: quote, error } = await db.from("quotes").select("*").eq("id", quoteId).single();
    if (error || !quote) return json({ error: "Offerte niet gevonden" }, 404);
    if (!["concept", "verstuurd"].includes(quote.status)) return json({ error: "Alleen concepten en verstuurde offertes kunnen worden gemaild" }, 400);
    if (!z.string().email().safeParse(quote.client_email).success) return json({ error: "Vul eerst een geldig e-mailadres van de klant in" }, 400);
    if (!Array.isArray(quote.items) || !quote.items.length) return json({ error: "Voeg eerst een arrangementregel toe" }, 400);
    const sentAt = new Date().toISOString();
    const accessToken = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join("");
    const snapshot = { ...publicQuoteSnapshot({ ...quote, status: "verstuurd", sent_at: sentAt }), recipient: quote.client_email, source_updated_at: quote.updated_at };
    // The request ID identifies this document publication. Retrying reuses its immutable document and send key.
    const { error: insertError } = await db.from("quote_publications").insert({ id: requestId, quote_id: quoteId, access_token: accessToken, snapshot });
    if (insertError && insertError.code !== "23505") return json({ error: "Offertedocument opslaan mislukt" }, 500);
    const { data: publication } = await db.from("quote_publications").select("*").eq("id", requestId).eq("quote_id", quoteId).single();
    if (!publication) return json({ error: "Ongeldige verzendpoging" }, 409);
    const document = publication.snapshot as Record<string, unknown>;
    if (!publication.sent_at && document.source_updated_at !== quote.updated_at) return json({ error: "De offerte is gewijzigd. Sluit het mailvenster en probeer opnieuw." }, 409);
    if (!publication.sent_at) {
      const validUntil = new Date(String(document.sent_at)); validUntil.setDate(validUntil.getDate() + 14);
      const result = await sendTemplateEmail("quote-offer", String(document.recipient), {
        idempotencyKey: `quote-offer-${publication.id}`,
        replyTo: "info@paviljoenzuidlanden.nl",
        templateData: { name: document.client_name, number: document.quote_number, occasion: document.occasion,
          actionUrl: `${SITE}/#/offerte?token=${publication.access_token}`,
          validUntil: validUntil.toLocaleDateString("nl-NL", { timeZone: "Europe/Amsterdam", day: "numeric", month: "long", year: "numeric" }) },
      });
      if (!result.sent) return json({ error: "Dit adres ontvangt geen mails: afgemeld of eerder onbestelbaar." }, 422);
      const { error: markError } = await db.from("quote_publications").update({ sent_at: String(document.sent_at) }).eq("id", publication.id);
      if (markError) return json({ error: "Mail verstuurd, maar status opslaan mislukt. Probeer dezelfde verzendpoging opnieuw." }, 500);
    }
    const { error: updateError } = await db.from("quotes").update({ status: "verstuurd", sent_at: String(document.sent_at) }).eq("id", quoteId).in("status", ["concept", "verstuurd"]);
    if (updateError) return json({ error: "Mail verstuurd, maar offertestatus opslaan mislukt. Probeer opnieuw." }, 500);
    if (quote.agenda_id) {
      const { error: agendaError } = await db.from("internal_agenda").update({ status: "offerte_verstuurd" }).eq("id", quote.agenda_id).in("status", ["concept", "offerte_verstuurd"]);
      if (agendaError) return json({ error: "Mail verstuurd, maar agendastatus opslaan mislukt. Probeer opnieuw." }, 500);
    }
    return json({ ok: true });
  } catch (error) {
    if (error instanceof EmailAPIError) {
      if (error.status === 429) return json({ error: "Te veel mails kort na elkaar. Probeer later opnieuw." }, 429);
      if (error.code === "domain_not_verified") return json({ error: "Het afzenderdomein is nog niet goedgekeurd." }, 503);
    }
    return json({ error: "Offerte mailen mislukt. Probeer later opnieuw." }, 500);
  }
});