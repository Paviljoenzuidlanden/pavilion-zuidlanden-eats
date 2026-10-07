CREATE TABLE public.event_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_title text NOT NULL,
  event_date text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT event_signups_len CHECK (char_length(event_title) <= 200 AND char_length(event_date) <= 50 AND char_length(name) BETWEEN 1 AND 100 AND char_length(email) BETWEEN 3 AND 255 AND (phone IS NULL OR char_length(phone) <= 30))
);
GRANT INSERT ON public.event_signups TO anon, authenticated;
GRANT SELECT, DELETE ON public.event_signups TO authenticated;
GRANT ALL ON public.event_signups TO service_role;
ALTER TABLE public.event_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can sign up" ON public.event_signups FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view signups" ON public.event_signups FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete signups" ON public.event_signups FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));