-- =================================================
-- ADMIN DASHBOARD FIXES: Storage + Vendor Status
-- =================================================
-- Run this to fix image uploads and vendor status confusion

-- =================================================
-- 1. STORAGE BUCKETS FOR AUTHORS & BLOGS
-- =================================================
-- Create missing buckets for author photos and blog images

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('author-photos', 'author-photos', true),
  ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Standard policies for buckets
DO $$ 
DECLARE
  b TEXT;
  buckets TEXT[] := ARRAY['author-photos', 'blog-images'];
BEGIN
  FOREACH b IN ARRAY buckets LOOP
    -- Select (Public)
    EXECUTE format('DROP POLICY IF EXISTS "Public read %s" ON storage.objects', b);
    EXECUTE format('CREATE POLICY "Public read %s" ON storage.objects FOR SELECT USING (bucket_id = %L)', b, b);
    
    -- Insert (Auth)
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated upload %s" ON storage.objects', b);
    EXECUTE format('CREATE POLICY "Authenticated upload %s" ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND auth.role() = %L)', b, b, 'authenticated');
    
    -- Update (Auth)
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated update %s" ON storage.objects', b);
    EXECUTE format('CREATE POLICY "Authenticated update %s" ON storage.objects FOR UPDATE USING (bucket_id = %L AND auth.role() = %L)', b, b, 'authenticated');
  END LOOP;
END $$;

-- =================================================
-- 2. VENDOR STATUS NORMALIZATION
-- =================================================
-- Use ONLY the 'status' column, ignore is_verified

-- Ensure all vendors have proper status values
UPDATE public.vendors 
SET status = 'active' 
WHERE is_verified = true AND (status IS NULL OR status = 'pending');

UPDATE public.vendors 
SET status = 'pending' 
WHERE is_verified = false AND status IS NULL;

-- Add check constraint to prevent invalid statuses
ALTER TABLE public.vendors 
DROP CONSTRAINT IF EXISTS vendors_status_check;

ALTER TABLE public.vendors 
ADD CONSTRAINT vendors_status_check 
CHECK (status IN ('pending', 'active', 'rejected'));

-- =================================================
-- 3. AUTHORS TABLE: Ensure slug is unique
-- =================================================
-- This prevents duplicate author entries

ALTER TABLE public.authors 
DROP CONSTRAINT IF EXISTS authors_slug_key;

ALTER TABLE public.authors 
ADD CONSTRAINT authors_slug_key UNIQUE (slug);

-- =================================================
-- 4. POSTS TABLE: Ensure image_url column exists
-- =================================================
-- Blog posts need this for hero images

ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- =================================================
-- 5. ORDERS: Ensure status column is properly typed
-- =================================================
-- Add check constraint for consistency

ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'));

-- =================================================
-- 6. REFRESH SCHEMA
-- =================================================
NOTIFY pgrst, 'reload schema';

-- =================================================
-- VERIFICATION QUERIES
-- =================================================
-- Run these to confirm everything is set up correctly:

-- Check buckets exist
SELECT id, name, public FROM storage.buckets 
WHERE id IN ('book-covers', 'author-photos', 'blog-images');

-- Check vendor statuses
SELECT store_name, status, is_verified FROM public.vendors LIMIT 10;

-- Check authors have slug constraint
SELECT conname FROM pg_constraint 
WHERE conrelid = 'public.authors'::regclass AND contype = 'u';
