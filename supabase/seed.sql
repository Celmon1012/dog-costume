-- Run in the Supabase SQL editor after migration.sql and rls.sql.
-- Seeds contest data and a registration function the public form can call.

ALTER TABLE dogs ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE dogs ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE rounds ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE rounds ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE votes ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE prize_categories ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE site_settings ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

INSERT INTO site_settings (id, voting_open, updated_at)
VALUES ('default', false, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO dog_counters (id, count)
VALUES ('global', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO rounds (id, round_number, status, created_at, updated_at)
VALUES (gen_random_uuid()::text, 1, 'OPEN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (round_number) DO NOTHING;

INSERT INTO prize_categories (id, name, subcategory, sort_order)
SELECT gen_random_uuid()::text, v.name, v.subcategory, v.sort_order
FROM (
  VALUES
    ('Fur-right Night Award', 'Spookiest Costume', 1),
    ('The Best Furiends Award', 'Best Duo or Group', 2),
    ('Paws-itively Hilarious', 'Most Hilarious Costume', 3),
    ('Pup Culture Award', 'Best TV, Film, Music, Celebrity Costume', 4),
    ('Best in Show', 'Overall Winner', 5)
) AS v(name, subcategory, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM prize_categories p WHERE p.sort_order = v.sort_order
);

CREATE OR REPLACE FUNCTION public.register_contestant(
  p_dog_name text,
  p_owner_name text,
  p_owner_email text,
  p_owner_phone text,
  p_photo_url text,
  p_costume_description text
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
    photo_url, costume_description, round_number, display_order,
    is_finalist, created_at, updated_at
  ) VALUES (
    v_id, v_unique_id, p_dog_name, p_owner_name, p_owner_email, p_owner_phone,
    p_photo_url, p_costume_description, v_round, v_order,
    false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
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

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dog-photos',
  'dog-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET public = true;

GRANT EXECUTE ON FUNCTION public.register_contestant(
  text, text, text, text, text, text
) TO anon, authenticated;
