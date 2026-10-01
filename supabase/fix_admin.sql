-- Run in Supabase SQL editor so a signed-in Auth user can manage dogs/rounds/votes.
-- Public visitors stay anonymous and are not admins.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(auth.role() = 'authenticated', false);
$$;
