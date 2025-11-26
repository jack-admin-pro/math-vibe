-- Seed script for Math Vibe
-- Inserts the 3 default profiles: Hela, Tata, Mama

INSERT INTO profiles (name, avatar_color)
VALUES 
  ('Hela', '#FF6B9D'),   -- Pink/Coral
  ('Tata', '#4ECDC4'),   -- Teal
  ('Mama', '#9B59B6')    -- Purple
ON CONFLICT (name) DO NOTHING;

