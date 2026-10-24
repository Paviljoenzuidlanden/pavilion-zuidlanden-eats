
- Personeelsomgeving op /personeel (niet gelinkt); accounts alleen via edge function manage-staff (signups uit) — zodat alleen beheerders personeel aanmaken.
- Urenexport haalt per gekozen maand alle toegestane records in batches op via de bestaande beveiligde tabel en maakt lokaal een CSV — zodat downloads compleet zijn zonder nieuwe serverlogica.
- The roster planner reads only the visible week's internal agenda through existing admin RLS and uses PlannerAgendaNotice for compact day summaries; this keeps planning linked to the original agenda without duplicating records.
- Quiz admission changes use an admin-checked RPC restricted to the reserve flag, never broad table update grants; public registration retains its own capacity rules.
