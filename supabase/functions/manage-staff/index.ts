import { createClient } from "npm:@supabase/supabase-js@2";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const BOOTSTRAP_ADMIN = "info@paviljoenzuidlanden.nl";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body = await req.json();
    const action = String(body.action ?? "");

    // Eenmalige eerste beheerder aanmaken
    if (action === "bootstrap") {
      const { count } = await admin.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
      if ((count ?? 0) > 0) return json({ error: "Er is al een beheerder" }, 403);
      const password = String(body.password ?? "");
      if (password.length < 8) return json({ error: "Wachtwoord minimaal 8 tekens" }, 400);
      const { data, error } = await admin.auth.admin.createUser({ email: BOOTSTRAP_ADMIN, password, email_confirm: true });
      if (error) return json({ error: error.message }, 400);
      await admin.from("profiles").insert({ id: data.user.id, display_name: "Beheer", email: BOOTSTRAP_ADMIN });
      await admin.from("user_roles").insert([{ user_id: data.user.id, role: "admin" }, { user_id: data.user.id, role: "staff" }]);
      return json({ ok: true });
    }
    if (action === "needs_bootstrap") {
      const { count } = await admin.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
      return json({ needs: (count ?? 0) === 0 });
    }

    // Overige acties: alleen beheerders
    const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
    const { data: u } = await admin.auth.getUser(token);
    if (!u?.user) return json({ error: "Niet ingelogd" }, 401);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Geen toegang" }, 403);

    if (action === "create") {
      const email = String(body.email ?? "").trim().toLowerCase();
      const name = String(body.name ?? "").trim().slice(0, 100);
      if (!/^\S+@\S+\.\S+$/.test(email) || !name)
        return json({ error: "Vul naam en geldig e-mailadres in" }, 400);
      const tempPassword = crypto.randomUUID() + crypto.randomUUID();
      const { data, error } = await admin.auth.admin.createUser({ email, password: tempPassword, email_confirm: true });
      if (error) return json({ error: error.message }, 400);
      await admin.from("profiles").insert({ id: data.user.id, display_name: name, email });
      const roles = [{ user_id: data.user.id, role: "staff" }];
      if (body.isAdmin) roles.push({ user_id: data.user.id, role: "admin" });
      await admin.from("user_roles").insert(roles);
      // Welkomstmail met link om zelf een wachtwoord in te stellen
      let mailSent = false;
      try {
        const origin = String(body.origin ?? "").slice(0, 200) || "https://pavilion-zuidlanden-eats.lovable.app";
        const { data: link } = await admin.auth.admin.generateLink({
          type: "recovery",
          email,
          options: { redirectTo: `${origin}/#/personeel` },
        });
        const actionUrl = link?.properties?.action_link ?? "";
        if (actionUrl) {
          const res = await sendTemplateEmail("staff-welcome", email, {
            templateData: { name, actionUrl },
            idempotencyKey: `staff-welcome-${data.user.id}`,
          });
          mailSent = res.sent;
        }
      } catch { /* mail is best-effort; account bestaat al */ }
      return json({ ok: true, mailSent });
    }
    if (action === "list") {
      // Laatste inlogmoment per gebruiker (voor beheerdersoverzicht)
      const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
      if (error) return json({ error: error.message }, 400);
      const users = (data?.users ?? []).map((usr) => ({ id: usr.id, last_sign_in_at: usr.last_sign_in_at ?? null }));
      return json({ users });
    }
    if (action === "send_reset") {
      // Stuur opnieuw een wachtwoord-instel-link naar een medewerker
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "Ongeldig e-mailadres" }, 400);
      const origin = String(body.origin ?? "").slice(0, 200) || "https://pavilion-zuidlanden-eats.lovable.app";
      const { data: link, error } = await admin.auth.admin.generateLink({
        type: "recovery",
        email,
        options: { redirectTo: `${origin}/#/personeel` },
      });
      if (error) return json({ error: error.message }, 400);
      const actionUrl = link?.properties?.action_link ?? "";
      if (!actionUrl) return json({ error: "Kon geen link maken" }, 500);
      const name = String(body.name ?? "").slice(0, 100);
      const res = await sendTemplateEmail("staff-welcome", email, {
        templateData: { name, actionUrl },
        idempotencyKey: `staff-reset-${email}-${Date.now()}`,
      });
      return json({ ok: true, mailSent: res.sent });
    }
    if (action === "reset_password") {
      const password = String(body.password ?? "");
      if (password.length < 8) return json({ error: "Wachtwoord minimaal 8 tekens" }, 400);
      const { error } = await admin.auth.admin.updateUserById(String(body.userId), { password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }
    if (action === "delete") {
      if (body.userId === u.user.id) return json({ error: "Je kunt jezelf niet verwijderen" }, 400);
      const { error } = await admin.auth.admin.deleteUser(String(body.userId));
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }
    return json({ error: "Onbekende actie" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
