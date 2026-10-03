DROP POLICY IF EXISTS "Users upload own ID document" ON storage.objects;
DROP POLICY IF EXISTS "Users view own ID, admins view all" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own ID, admins delete all" ON storage.objects;
COMMENT ON COLUMN public.profiles.iban IS 'DEPRECATED: niet in gebruik — bankgegevens worden bewust niet opgeslagen';