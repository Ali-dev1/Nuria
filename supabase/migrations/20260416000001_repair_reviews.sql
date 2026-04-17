-- 🛠️ NURIA ULTIMATE REPAIR SCRIPT (V5)
-- Safe to run multiple times. Fixes: Redirection, 403 Forbidden, 400 Join Errors.

-- 1. Identity & Admin Setup
INSERT INTO public.profiles (user_id, name, needs_role_selection)
VALUES ('e369ef52-9dbc-4e09-8309-328218af5ea6', 'Nuria Admin', false)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('e369ef52-9dbc-4e09-8309-328218af5ea6', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

UPDATE public.user_roles SET role = 'admin' WHERE user_id = 'e369ef52-9dbc-4e09-8309-328218af5ea6';

-- 2. Ensure ALL Tables Exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  loyalty_points INTEGER DEFAULT 0,
  needs_role_selection BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  store_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS Global
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. CLEANUP & BRIDGE SETUP (Constraints & Hints)
DO $$ 
BEGIN
    -- Drop old constraints to avoid "already exists"
    ALTER TABLE IF EXISTS public.reviews DROP CONSTRAINT IF EXISTS fk_reviews_profile;
    ALTER TABLE IF EXISTS public.user_roles DROP CONSTRAINT IF EXISTS fk_user_roles_profile;

    -- Create Identity Bridges (Fixes 400 Relationship Errors)
    ALTER TABLE public.reviews ADD CONSTRAINT fk_reviews_profile FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
    ALTER TABLE public.user_roles ADD CONSTRAINT fk_user_roles_profile FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

    -- Drop EVERY policy to re-create them cleanly
    DROP POLICY IF EXISTS "Public profiles readable" ON public.profiles;
    DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
    DROP POLICY IF EXISTS "Users can assign own role" ON public.user_roles;
    DROP POLICY IF EXISTS "Users can create own vendor profile" ON public.vendors;
    DROP POLICY IF EXISTS "Vendors can update own profile" ON public.vendors;
    DROP POLICY IF EXISTS "Reviews publicly readable" ON public.reviews;
    DROP POLICY IF EXISTS "Users create own reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Users update own reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Users delete own reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Users can see their own wishlist items" ON public.wishlists;
    DROP POLICY IF EXISTS "Users can add to their own wishlist" ON public.wishlists;
    DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON public.wishlists;
EXCEPTION
    WHEN others THEN null;
END $$;

-- 5. RECREATION: All Policies
-- Profiles
CREATE POLICY "Public profiles readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Roles & Vending (Fixes 403 Forbidden Onboarding)
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can assign own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own vendor profile" ON public.vendors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Vendors can update own profile" ON public.vendors FOR UPDATE USING (auth.uid() = user_id);

-- Wishlists & Reviews
CREATE POLICY "Reviews publicly readable" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users create own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can see their own wishlist items" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their own wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from their own wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- 6. Indexes & API Refresh
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON public.wishlists(product_id);
COMMENT ON COLUMN public.reviews.user_id IS '{"reference": "public.profiles.user_id"}';

-- Direct bridge hint for PostgREST
NOTIFY pgrst, 'reload schema';
