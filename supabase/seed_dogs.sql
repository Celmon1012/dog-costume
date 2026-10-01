-- Paste into Supabase SQL Editor and click Run.
-- Keeps DOG-001..DOG-004. Inserts DOG-005..DOG-030.
-- Each new dog gets one of your 3 storage photos at random.

INSERT INTO rounds (id, round_number, status, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 2, 'CLOSED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 3, 'CLOSED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (round_number) DO NOTHING;

INSERT INTO dogs (
  id, unique_id, dog_name, owner_name, owner_email, owner_phone,
  photo_url, costume_description, round_number, display_order,
  is_finalist, created_at, updated_at
)
SELECT
  gen_random_uuid()::text,
  d.unique_id,
  d.dog_name,
  d.owner_name,
  d.owner_email,
  d.owner_phone,
  (
    ARRAY[
      'https://dgtymnprpgxwmivoalja.supabase.co/storage/v1/object/public/dog-photos/uploads/1790866447023-e248zslt0qm.jpg',
      'https://dgtymnprpgxwmivoalja.supabase.co/storage/v1/object/public/dog-photos/uploads/1790867182099-awizc2dv5lt.jpg',
      'https://dgtymnprpgxwmivoalja.supabase.co/storage/v1/object/public/dog-photos/uploads/1790867263007-u765w088zf.jpg'
    ]
  )[1 + floor(random() * 3)::int],
  d.costume_description,
  d.round_number,
  d.display_order,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM (
  VALUES
    ('DOG-005', 'Bella', 'Ava Martinez', 'ava.martinez@example.com', '555-0105', 'Pumpkin princess with a velvet cape', 1, 5),
    ('DOG-006', 'Charlie', 'Noah Patel', 'noah.patel@example.com', '555-0106', 'Classic Batman cowl and black cape', 1, 6),
    ('DOG-007', 'Luna', 'Mia Chen', 'mia.chen@example.com', '555-0107', 'Witch hat, broom, and starry bandana', 1, 7),
    ('DOG-008', 'Rocky', 'Ethan Brooks', 'ethan.brooks@example.com', '555-0108', 'Taco Tuesday shell with lettuce ruff', 1, 8),
    ('DOG-009', 'Daisy', 'Sofia Nguyen', 'sofia.nguyen@example.com', '555-0109', 'Elvis jumpsuit with tiny sunglasses', 1, 9),
    ('DOG-010', 'Cooper', 'Liam Walsh', 'liam.walsh@example.com', '555-0110', 'Hot dog bun with mustard stripe', 1, 10),
    ('DOG-011', 'Nala', 'Harper Diaz', 'harper.diaz@example.com', '555-0111', 'Lion King mane and gold chest plate', 2, 1),
    ('DOG-012', 'Milo', 'Owen Carter', 'owen.carter@example.com', '555-0112', 'Astronaut helmet and NASA vest', 2, 2),
    ('DOG-013', 'Sadie', 'Isla Romero', 'isla.romero@example.com', '555-0113', 'Strawberry shortcake with seed spots', 2, 3),
    ('DOG-014', 'Bear', 'Caleb Price', 'caleb.price@example.com', '555-0114', 'Lumberjack flannel and fake beard', 2, 4),
    ('DOG-015', 'Rosie', 'Emma Flores', 'emma.flores@example.com', '555-0115', 'Ladybug wings and black-spot hoodie', 2, 5),
    ('DOG-016', 'Duke', 'Mason Reed', 'mason.reed@example.com', '555-0116', 'Pirate captain hat, patch, and gold chain', 2, 6),
    ('DOG-017', 'Coco', 'Chloe Bennett', 'chloe.bennett@example.com', '555-0117', 'Frida Kahlo flowers and unibrow', 2, 7),
    ('DOG-018', 'Finn', 'Jackson Cole', 'jackson.cole@example.com', '555-0118', 'Shark ninja with fin backpack', 2, 8),
    ('DOG-019', 'Maple', 'Aria Singh', 'aria.singh@example.com', '555-0119', 'Pancake stack hat with syrup drip', 2, 9),
    ('DOG-020', 'Zeus', 'Henry Ortiz', 'henry.ortiz@example.com', '555-0120', 'Greek god toga and lightning bolt', 2, 10),
    ('DOG-021', 'Olive', 'Grace Kim', 'grace.kim@example.com', '555-0121', 'Olive-jar mascot with green ruff', 3, 1),
    ('DOG-022', 'Thor', 'Lucas Hale', 'lucas.hale@example.com', '555-0122', 'Mjolnir collar and red cape', 3, 2),
    ('DOG-023', 'Penny', 'Ella Brooks', 'ella.brooks@example.com', '555-0123', 'Lucky penny slot-machine vest', 3, 3),
    ('DOG-024', 'Rex', 'Leo Vargas', 'leo.vargas@example.com', '555-0124', 'T-rex arms and spotted dinosaur hood', 3, 4),
    ('DOG-025', 'Willow', 'Nora Blake', 'nora.blake@example.com', '555-0125', 'Enchanted forest fairy with leaf wings', 3, 5),
    ('DOG-026', 'Ace', 'Ian Foster', 'ian.foster@example.com', '555-0126', 'Poker-ace tuxedo and bow tie', 3, 6),
    ('DOG-027', 'Pepper', 'Zoe Alvarez', 'zoe.alvarez@example.com', '555-0127', 'Salt-and-pepper shaker duo hat', 3, 7),
    ('DOG-028', 'Moose', 'Ryan Patel', 'ryan.patel@example.com', '555-0128', 'Canadian moose antlers and plaid', 3, 8),
    ('DOG-029', 'Ginger', 'Lily Shaw', 'lily.shaw@example.com', '555-0129', 'Gingerbread house with icing trim', 3, 9),
    ('DOG-030', 'Scout', 'Adam Quinn', 'adam.quinn@example.com', '555-0130', 'Trail-scout sash, compass, and patches', 3, 10)
) AS d(unique_id, dog_name, owner_name, owner_email, owner_phone, costume_description, round_number, display_order)
ON CONFLICT (unique_id) DO NOTHING;

INSERT INTO dog_counters (id, count)
VALUES ('global', 30)
ON CONFLICT (id) DO UPDATE SET count = GREATEST(dog_counters.count, 30);
