-- Run in Supabase SQL Editor (needed for breed / MC notes / optional photo).

ALTER TABLE dogs ADD COLUMN IF NOT EXISTS breed text NOT NULL DEFAULT '';
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS inspiration text NOT NULL DEFAULT '';
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS funny_fact text NOT NULL DEFAULT '';
ALTER TABLE dogs ALTER COLUMN photo_url SET DEFAULT '';

DROP FUNCTION IF EXISTS public.register_contestant(text, text, text, text, text, text);

CREATE OR REPLACE FUNCTION public.register_contestant(
  p_dog_name text,
  p_owner_name text,
  p_owner_email text,
  p_owner_phone text,
  p_photo_url text,
  p_costume_description text,
  p_breed text DEFAULT '',
  p_inspiration text DEFAULT '',
  p_funny_fact text DEFAULT ''
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_unique_id text;
  v_round integer;
  v_order integer;
  v_id text;
BEGIN
  INSERT INTO dog_counters (id, count)
  VALUES ('global', 1)
  ON CONFLICT (id) DO UPDATE
    SET count = dog_counters.count + 1
  RETURNING count INTO v_count;

  v_unique_id := 'DOG-' || lpad(v_count::text, 3, '0');
  v_round := floor((v_count - 1)::numeric / 10)::integer + 1;
  v_order := ((v_count - 1) % 10) + 1;
  v_id := gen_random_uuid()::text;

  INSERT INTO rounds (id, round_number, status, created_at, updated_at)
  VALUES (
    gen_random_uuid()::text,
    v_round,
    CASE WHEN v_round = 1 THEN 'OPEN'::"RoundStatus" ELSE 'CLOSED'::"RoundStatus" END,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
  ON CONFLICT (round_number) DO NOTHING;

  INSERT INTO dogs (
    id, unique_id, dog_name, owner_name, owner_email, owner_phone,
    photo_url, costume_description, breed, inspiration, funny_fact,
    round_number, display_order, is_finalist, created_at, updated_at
  ) VALUES (
    v_id, v_unique_id, p_dog_name, p_owner_name, p_owner_email, p_owner_phone,
    coalesce(p_photo_url, ''), p_costume_description,
    coalesce(p_breed, ''), coalesce(p_inspiration, ''), coalesce(p_funny_fact, ''),
    v_round, v_order, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );

  RETURN json_build_object(
    'id', v_id,
    'unique_id', v_unique_id,
    'dog_name', p_dog_name,
    'round_number', v_round,
    'display_order', v_order
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_contestant(
  text, text, text, text, text, text, text, text, text
) TO anon, authenticated;
