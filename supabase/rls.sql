-- Run in Supabase SQL Editor after Prisma migrate.
-- The Next.js server uses Prisma (DATABASE_URL) and typically bypasses RLS.
-- These policies protect the anon/authenticated keys if used from the browser.

ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE prize_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dog_counters ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(auth.role() = 'authenticated', false);
$$;

DROP POLICY IF EXISTS "dogs_public_read" ON dogs;
CREATE POLICY "dogs_public_read" ON dogs
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "dogs_public_insert" ON dogs;
CREATE POLICY "dogs_public_insert" ON dogs
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "dogs_admin_all" ON dogs;
CREATE POLICY "dogs_admin_all" ON dogs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "rounds_public_read" ON rounds;
CREATE POLICY "rounds_public_read" ON rounds
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "rounds_admin_all" ON rounds;
CREATE POLICY "rounds_admin_all" ON rounds
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "prize_categories_public_read" ON prize_categories;
CREATE POLICY "prize_categories_public_read" ON prize_categories
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "prize_categories_admin_all" ON prize_categories;
CREATE POLICY "prize_categories_admin_all" ON prize_categories
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "votes_public_insert" ON votes;
CREATE POLICY "votes_public_insert" ON votes
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "votes_admin_read" ON votes;
CREATE POLICY "votes_admin_read" ON votes
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "votes_admin_manage" ON votes;
CREATE POLICY "votes_admin_manage" ON votes
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
CREATE POLICY "site_settings_public_read" ON site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "site_settings_admin_all" ON site_settings;
CREATE POLICY "site_settings_admin_all" ON site_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "dog_counters_admin" ON dog_counters;
CREATE POLICY "dog_counters_admin" ON dog_counters
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- After creating bucket `dog-photos` (public), run:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('dog-photos', 'dog-photos', true)
-- ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "dog_photos_public_read" ON storage.objects;
CREATE POLICY "dog_photos_public_read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'dog-photos');

DROP POLICY IF EXISTS "dog_photos_upload" ON storage.objects;
CREATE POLICY "dog_photos_upload"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'dog-photos');
