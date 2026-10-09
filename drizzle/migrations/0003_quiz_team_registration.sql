-- Teamregistratie voor de Zuidlanden Pubquiz: max. 12 teams van max. 4 personen
ALTER TABLE public.event_signups
  ADD COLUMN IF NOT EXISTS team_name text,
  ADD COLUMN IF NOT EXISTS team_size integer;

-- Veilig aantal teams dat al vaststaat voor een activiteit (ook zonder inlog te lezen)
CREATE OR REPLACE FUNCTION public.quiz_team_count(_event_title text, _event_date text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::int
  FROM public.event_signups
  WHERE event_title = _event_title
    AND event_date = _event_date
    AND team_name IS NOT NULL;
$$;

-- Team inschrijven: controleert de limiet van 12 teams en dubbele teamnamen, en slaat op
CREATE OR REPLACE FUNCTION public.register_quiz_team(
  _event_title text,
  _event_date text,
  _team_name text,
  _name text,
  _email text,
  _phone text,
  _team_size integer
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_teams integer;
BEGIN
  IF trim(coalesce(_team_name,'')) = '' OR trim(coalesce(_name,'')) = '' OR trim(coalesce(_email,'')) = '' THEN
    RETURN 'ontbrekende_gegevens';
  END IF;
  IF _team_size IS NULL OR _team_size < 1 OR _team_size > 4 THEN
    RETURN 'ongeldige_grootte';
  END IF;
  IF length(_team_name) > 80 OR length(_name) > 100 OR length(_email) > 255 OR length(coalesce(_phone,'')) > 30 THEN
    RETURN 'te_lang';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.event_signups
    WHERE event_title = _event_title
      AND event_date = _event_date
      AND team_name IS NOT NULL
      AND lower(trim(team_name)) = lower(trim(_team_name))
  ) THEN
    RETURN 'team_bestaat';
  END IF;
  SELECT count(*)::int INTO v_teams
  FROM public.event_signups
  WHERE event_title = _event_title
    AND event_date = _event_date
    AND team_name IS NOT NULL;
  IF v_teams >= 12 THEN
    RETURN 'vol';
  END IF;
  INSERT INTO public.event_signups (event_title, event_date, name, email, phone, team_name, team_size)
  VALUES (
    _event_title, _event_date, trim(_name), trim(_email),
    nullif(trim(coalesce(_phone,'')), ''), trim(_team_name), _team_size
  );
  RETURN 'ok';
END;
$$;

GRANT EXECUTE ON FUNCTION public.quiz_team_count(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_quiz_team(text, text, text, text, text, text, integer) TO anon, authenticated;
GRANT INSERT ON public.event_signups TO anon;
GRANT ALL ON public.event_signups TO service_role;