
- Personeelsomgeving op /personeel (niet gelinkt); accounts alleen via edge function manage-staff (signups uit) — zodat alleen beheerders personeel aanmaken.
- Urenexport haalt per gekozen maand alle toegestane records in batches op via de bestaande beveiligde tabel en maakt lokaal een CSV — zodat downloads compleet zijn zonder nieuwe serverlogica.
- The roster planner reads only the visible week's internal agenda through existing admin RLS and uses PlannerAgendaNotice for compact day summaries; this keeps planning linked to the original agenda without duplicating records.
- Quiz admission changes use an admin-checked RPC restricted to the reserve flag, never broad table update grants; public registration retains its own capacity rules.
- Quotes live in their own admin-only table linked optionally to any internal_agenda kind and are downloaded via a print stylesheet (Save as PDF); shared agenda mapping supports activities and parties without duplicating records.
- Quote arrangements are admin-only reusable content; copies clear recipient, agenda, dates and send state to prevent accidental disclosure to the original client.
- Quote emails use a fixed feature template and the saved recipient only; immutable quote_publications preserve document versions and their accompanying email message for consistent retries (not an email queue), exposed through high-entropy expiring capability links by view-quote without anonymous table access. The canonical published app hosts customer links.
- Quote follow-up is a local view of unanswered sent quotes and their 14-day validity, never an automated mailing job.
