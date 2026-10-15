ALTER TABLE public.event_signups ADD COLUMN IF NOT EXISTS reserve boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.quiz_team_count(_event_title text, _event_date text)
 RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT count(*)::int FROM public.event_signups
  WHERE event_title = _event_title AND event_date = _event_date AND team_name IS NOT NULL AND NOT reserve;
$$;

CREATE OR REPLACE FUNCTION public.register_quiz_team(_event_title text, _event_date text, _team_name text, _name text, _email text, _phone text, _team_size integer)
 RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_teams integer; v_reserve boolean;
BEGIN
  IF trim(coalesce(_team_name,'')) = '' OR trim(coalesce(_name,'')) = '' OR trim(coalesce(_email,'')) = '' THEN RETURN 'ontbrekende_gegevens'; END IF;
  IF _team_size IS NULL OR _team_size < 1 OR _team_size > 4 THEN RETURN 'ongeldige_grootte'; END IF;
  IF length(_team_name) > 80 OR length(_name) > 100 OR length(_email) > 255 OR length(coalesce(_phone,'')) > 30 THEN RETURN 'te_lang'; END IF;
  IF EXISTS (SELECT 1 FROM public.event_signups WHERE event_title = _event_title AND event_date = _event_date
    AND team_name IS NOT NULL AND lower(trim(team_name)) = lower(trim(_team_name))) THEN RETURN 'team_bestaat'; END IF;
  SELECT count(*)::int INTO v_teams FROM public.event_signups
  WHERE event_title = _event_title AND event_date = _event_date AND team_name IS NOT NULL AND NOT reserve;
  v_reserve := v_teams >= 12;
  INSERT INTO public.event_signups (event_title, event_date, name, email, phone, team_name, team_size, reserve)
  VALUES (_event_title, _event_date, trim(_name), trim(_email), nullif(trim(coalesce(_phone,'')), ''), trim(_team_name), _team_size, v_reserve);
  RETURN CASE WHEN v_reserve THEN 'reserve' ELSE 'ok' END;
END;
$$;