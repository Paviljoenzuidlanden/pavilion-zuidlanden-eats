import { createClient } from "npm:@supabase/supabase-js@2";

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
      const password = String(body.password ?? "");
      if (!/^\S+@\S+\.\S+$/.test(email) || !name || password.length < 8)
        return json({ error: "Vul naam, geldig e-mailadres en wachtwoord (min. 8 tekens) in" }, 400);
      const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
      if (error) return json({ error: error.message }, 400);
      await admin.from("profiles").insert({ id: data.user.id, display_name: name, email });
      const roles = [{ user_id: data.user.id, role: "staff" }];
      if (body.isAdmin) roles.push({ user_id: data.user.id, role: "admin" });
      await admin.from("user_roles").insert(roles);
      return json({ ok: true });
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
