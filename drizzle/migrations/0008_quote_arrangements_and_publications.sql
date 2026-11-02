CREATE TABLE public.quote_arrangements (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL,
 items jsonb NOT NULL DEFAULT '[]'::jsonb,
 intro text,
 drinks_text text,
 notes text,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_arrangements TO authenticated;
GRANT ALL ON public.quote_arrangements TO service_role;
ALTER TABLE public.quote_arrangements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage quote arrangements" ON public.quote_arrangements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TABLE public.quote_publications (
 id uuid PRIMARY KEY,
 quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
 access_token text NOT NULL UNIQUE,
 snapshot jsonb NOT NULL,
 expires_at timestamptz NOT NULL DEFAULT (now() + interval '90 days'),
 created_at timestamptz NOT NULL DEFAULT now(),
 sent_at timestamptz
);
GRANT SELECT, DELETE ON public.quote_publications TO authenticated;
GRANT ALL ON public.quote_publications TO service_role;
ALTER TABLE public.quote_publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view published quote documents" ON public.quote_publications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins revoke published quote documents" ON public.quote_publications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
COMMENT ON TABLE public.quote_publications IS 'Immutable customer-visible quote document versions accessed through a high-entropy capability link; not an email queue. No anonymous table grants.';
CREATE INDEX quote_publications_quote_id_idx ON public.quote_publications(quote_id);