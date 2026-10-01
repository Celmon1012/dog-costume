-- Run in Supabase SQL Editor so email + device uniqueness works.

ALTER TABLE votes ADD COLUMN IF NOT EXISTS voter_email text;

CREATE UNIQUE INDEX IF NOT EXISTS votes_category_email_key
  ON votes (prize_category_id, voter_email)
  WHERE voter_email IS NOT NULL;
