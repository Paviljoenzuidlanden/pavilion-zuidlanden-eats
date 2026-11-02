import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { publicQuoteSnapshot, publicationIsAccessible } from "../_shared/quote-publication.ts";
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: {
  ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer",
} });
Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Alleen POST" }, 405);
  try {
    const body = await req.json();
    if (typeof body.token !== "string" || !/^[a-f0-9]{64}$/.test(body.token)) return json({ error: "Ongeldige link" }, 404);
    const url = Deno.env.get("SUPABASE_URL"); const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return json({ error: "Offerte niet beschikbaar" }, 503);
    const db = createClient(url, key);
    const { data } = await db.from("quote_publications").select("snapshot, sent_at, expires_at").eq("access_token", body.token).maybeSingle();
    if (!data || !publicationIsAccessible(data)) return json({ error: "Ongeldige of verlopen link" }, 404);
    return json({ quote: publicQuoteSnapshot(data.snapshot as Record<string, unknown>) });
  } catch { return json({ error: "Ongeldige link" }, 400); }
});