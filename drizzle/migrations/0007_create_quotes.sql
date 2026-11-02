CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agenda_id uuid REFERENCES public.internal_agenda(id) ON DELETE SET NULL,
  quote_number text NOT NULL,
  status text NOT NULL DEFAULT 'concept',
  client_name text NOT NULL DEFAULT '',
  client_email text,
  event_date date,
  start_time time,
  end_time time,
  guests_text text,
  guests_count integer NOT NULL DEFAULT 1,
  occasion text,
  location text NOT NULL DEFAULT 'It Boumantsje 4, Leeuwarden',
  intro text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  drinks_text text,
  notes text,
  signed_by text NOT NULL DEFAULT 'Arnold Nicolai',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotes TO authenticated;
GRANT ALL ON public.quotes TO service_role;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage quotes" ON public.quotes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX quotes_agenda_id_idx ON public.quotes(agenda_id);