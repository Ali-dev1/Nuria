-- ==========================================
-- NURIA ADMIN DASHBOARD FIX - CONSOLIDATED v2
-- ==========================================
-- IMPORTANT: Create storage buckets in Supabase Dashboard FIRST:
-- 1. Go to Storage > Create new bucket
-- 2. Create: "author-photos" (public), "blog-images" (public), "book-covers" (public)
-- 3. Then run this SQL
-- ==========================================

-- 1. PRODUCTS - Ensure is_featured column exists
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- 2. AUTHORS - Ensure table exists with correct structure
CREATE TABLE IF NOT EXISTS public.authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  bio TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. POSTS - Ensure table exists for blog management
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  category TEXT,
  author TEXT DEFAULT 'Nuria Editorial',
  featured_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VENDORS - Ensure status and is_verified fields exist
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Sync existing vendor data
UPDATE public.vendors SET status = 'active' WHERE is_verified = TRUE;
UPDATE public.vendors SET status = 'pending' WHERE is_verified = FALSE OR status IS NULL;

-- Add social columns to vendors if not exist
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS website_url TEXT;

-- ==========================================
-- STORAGE POLICIES
-- ==========================================

-- Standard policies for public buckets (author-photos, blog-images, book-covers)
DO $$ 
DECLARE
  b TEXT;
  buckets TEXT[] := ARRAY['author-photos', 'blog-images', 'book-covers'];
BEGIN
  FOREACH b IN ARRAY buckets LOOP
    -- Select (Public)
    EXECUTE format('DROP POLICY IF EXISTS "%s-read" ON storage.objects', b);
    EXECUTE format('CREATE POLICY "%s-read" ON storage.objects FOR SELECT USING (bucket_id = %L)', b, b);
    
    -- Insert (Auth)
    EXECUTE format('DROP POLICY IF EXISTS "%s-insert" ON storage.objects', b);
    EXECUTE format('CREATE POLICY "%s-insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = %L)', b, b);
    
    -- Update (Auth)
    EXECUTE format('DROP POLICY IF EXISTS "%s-update" ON storage.objects', b);
    EXECUTE format('CREATE POLICY "%s-update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = %L)', b, b);
    
    -- Delete (Auth)
    EXECUTE format('DROP POLICY IF EXISTS "%s-delete" ON storage.objects', b);
    EXECUTE format('CREATE POLICY "%s-delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = %L)', b, b);
  END LOOP;
END $$;

-- ==========================================
-- DATABASE RLS POLICIES
-- ==========================================

-- Authors RLS
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authors_select_auth" ON public.authors;
CREATE POLICY "authors_select_auth" ON public.authors FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authors_select_anon" ON public.authors;
CREATE POLICY "authors_select_anon" ON public.authors FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "authors_insert" ON public.authors;
CREATE POLICY "authors_insert" ON public.authors FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authors_update" ON public.authors;
CREATE POLICY "authors_update" ON public.authors FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "authors_delete" ON public.authors;
CREATE POLICY "authors_delete" ON public.authors FOR DELETE TO authenticated USING (true);

-- Posts RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_auth" ON public.posts;
CREATE POLICY "posts_select_auth" ON public.posts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "posts_select_anon" ON public.posts;
CREATE POLICY "posts_select_anon" ON public.posts FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "posts_insert" ON public.posts;
CREATE POLICY "posts_insert" ON public.posts FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "posts_update" ON public.posts;
CREATE POLICY "posts_update" ON public.posts FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "posts_delete" ON public.posts;
CREATE POLICY "posts_delete" ON public.posts FOR DELETE TO authenticated USING (true);

-- Vendors RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vendors_select_auth" ON public.vendors;
CREATE POLICY "vendors_select_auth" ON public.vendors FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "vendors_select_anon" ON public.vendors;
CREATE POLICY "vendors_select_anon" ON public.vendors FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "vendors_update" ON public.vendors;
CREATE POLICY "vendors_update" ON public.vendors FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "vendors_insert" ON public.vendors;
CREATE POLICY "vendors_insert" ON public.vendors FOR INSERT TO authenticated WITH CHECK (true);

-- ==========================================
-- USER ROLES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'vendor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_roles_select" ON public.user_roles;
CREATE POLICY "user_roles_select" ON public.user_roles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "user_roles_insert" ON public.user_roles;
CREATE POLICY "user_roles_insert" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "user_roles_delete" ON public.user_roles;
CREATE POLICY "user_roles_delete" ON public.user_roles FOR DELETE TO authenticated USING (true);

-- ==========================================
-- PLATFORM SETTINGS POLICIES (CRITICAL - Enables settings page)
-- ==========================================
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "platform_settings_select" ON public.platform_settings;
CREATE POLICY "platform_settings_select" ON public.platform_settings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "platform_settings_upsert" ON public.platform_settings;
CREATE POLICY "platform_settings_upsert" ON public.platform_settings FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "platform_settings_insert" ON public.platform_settings;
CREATE POLICY "platform_settings_insert" ON public.platform_settings FOR INSERT TO authenticated WITH CHECK (true);

-- ==========================================
-- ONBOARDING TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, needs_role_selection)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New Reader'),
    true
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- ORDER & CHECKOUT POLICIES
-- ==========================================

DROP POLICY IF EXISTS "orders_create_own" ON public.orders;
CREATE POLICY "orders_create_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_update_all" ON public.orders;
CREATE POLICY "orders_update_all" ON public.orders FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "order_items_insert_own" ON public.order_items;
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "order_items_select_own" ON public.order_items;
CREATE POLICY "order_items_select_own" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "loyalty_create_own" ON public.loyalty_transactions;
CREATE POLICY "loyalty_create_own" ON public.loyalty_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "loyalty_select_own" ON public.loyalty_transactions;
CREATE POLICY "loyalty_select_own" ON public.loyalty_transactions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ==========================================
-- REFRESH SCHEMA
-- ==========================================
NOTIFY pgrst, 'reload schema';