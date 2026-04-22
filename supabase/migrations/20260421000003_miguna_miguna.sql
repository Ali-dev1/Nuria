-- 🛠️ Author Spotlight Fix: Miguna Miguna
-- This version uses ON CONFLICT to prevent duplicate key errors and ensures Miguna is first.

-- 1. Insert or Update Miguna Miguna
INSERT INTO public.authors (id, name, slug, photo_url, bio, created_at)
VALUES (
    gen_random_uuid(),
    'Miguna Miguna',
    'miguna-miguna',
    NULL,
    'Miguna Miguna is a Kenyan-Canadian lawyer, author, and political activist. Known for his outspoken nature and his books detailing Kenyan politics.',
    now()
)
ON CONFLICT (slug) DO UPDATE
SET 
    name = EXCLUDED.name,
    photo_url = EXCLUDED.photo_url,
    bio = EXCLUDED.bio,
    created_at = EXCLUDED.created_at;

-- 2. Remove Wangari Maathai if she still exists (as her slot is being taken)
DELETE FROM public.authors 
WHERE slug = 'wangari-maathai';
