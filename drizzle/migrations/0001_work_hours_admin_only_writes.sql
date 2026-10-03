DROP POLICY IF EXISTS "Insert own or admin" ON public.work_hours;
DROP POLICY IF EXISTS "Update own or admin" ON public.work_hours;
DROP POLICY IF EXISTS "Delete own or admin" ON public.work_hours;

CREATE POLICY "Admins insert" ON public.work_hours FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update" ON public.work_hours FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete" ON public.work_hours FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));