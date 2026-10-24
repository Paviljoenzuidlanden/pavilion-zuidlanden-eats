CREATE OR REPLACE FUNCTION public.set_quiz_team_admission(_signup_id uuid, _admitted boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Geen toegang' USING ERRCODE = '42501';
  END IF;
  IF _admitted IS NULL THEN
    RAISE EXCEPTION 'Kies een geldige status';
  END IF;
  UPDATE public.event_signups SET reserve = NOT _admitted
  WHERE id = _signup_id AND team_name IS NOT NULL;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Teamaanmelding niet gevonden';
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.set_quiz_team_admission(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_quiz_team_admission(uuid, boolean) TO authenticated, service_role;
COMMENT ON FUNCTION public.set_quiz_team_admission(uuid, boolean) IS 'Admin-only admission override; permits more than the public 12-team limit without changing public registration.';