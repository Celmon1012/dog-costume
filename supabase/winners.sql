-- Run in Supabase SQL Editor so admin can pick 5 prize winners.
ALTER TABLE prize_categories ADD COLUMN IF NOT EXISTS winner_dog_id text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS winners_announced boolean NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'prize_categories_winner_dog_id_fkey'
  ) THEN
    ALTER TABLE prize_categories
      ADD CONSTRAINT prize_categories_winner_dog_id_fkey
      FOREIGN KEY (winner_dog_id) REFERENCES dogs(id) ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
