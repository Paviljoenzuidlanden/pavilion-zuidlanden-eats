ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS iban text;

CREATE POLICY "Users upload own ID document" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'id-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users view own ID, admins view all" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'id-documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin'::app_role)));

CREATE POLICY "Users delete own ID, admins delete all" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'id-documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin'::app_role)));