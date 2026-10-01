-- Run in Supabase SQL Editor for round (introduction) voting.

CREATE TABLE IF NOT EXISTS round_votes (
  id text PRIMARY KEY,
  dog_id text NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  round_number integer NOT NULL,
  voter_identifier text NOT NULL,
  created_at timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS round_votes_round_voter_key
  ON round_votes (round_number, voter_identifier);

CREATE INDEX IF NOT EXISTS round_votes_dog_id_idx ON round_votes (dog_id);

ALTER TABLE round_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "round_votes_public_insert" ON round_votes;
CREATE POLICY "round_votes_public_insert" ON round_votes
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "round_votes_admin_read" ON round_votes;
CREATE POLICY "round_votes_admin_read" ON round_votes
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "round_votes_admin_manage" ON round_votes;
CREATE POLICY "round_votes_admin_manage" ON round_votes
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.get_round_vote(p_round integer, p_voter text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT dog_id
  FROM round_votes
  WHERE round_number = p_round
    AND voter_identifier = p_voter
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_round_vote(integer, text) TO anon, authenticated;
