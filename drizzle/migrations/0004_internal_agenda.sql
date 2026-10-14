CREATE TABLE public.internal_agenda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'feest',
  title text NOT NULL,
  event_date date,
  start_time time,
  end_time time,
  status text NOT NULL DEFAULT 'concept',
  name text, email text, phone text, occasion text, guests integer, message text,
  quote_amount numeric, agreements text,
  source text NOT NULL DEFAULT 'handmatig',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT internal_agenda_status_chk CHECK (status IN ('concept','offerte_verstuurd','definitief','geannuleerd')),
  CONSTRAINT internal_agenda_kind_chk CHECK (kind IN ('feest','activiteit'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.internal_agenda TO authenticated;
GRANT ALL ON public.internal_agenda TO service_role;
ALTER TABLE public.internal_agenda ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage agenda" ON public.internal_agenda FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER internal_agenda_updated BEFORE UPDATE ON public.internal_agenda
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();