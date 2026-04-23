
-- ==========================================
-- NURIA PLATFORM: FULL MASTER SCHEMA (RESET)
-- ==========================================

-- 0. PRE-CLEANUP
DROP TABLE IF EXISTS public.product_views CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
DROP TABLE IF EXISTS public.payouts CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.platform_settings CASCADE;
DROP TABLE IF EXISTS public.loyalty_transactions CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- 1. EXTENSIONS & TYPES
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TYPE public.app_role AS ENUM ('customer', 'vendor', 'admin');

-- 2. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  loyalty_points INTEGER DEFAULT 0,
  needs_role_selection BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RBAC (User Roles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'customer',
  UNIQUE(user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 4. CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed categories with the exact UUIDs used later in your UPDATEs
INSERT INTO public.categories (id, name, slug, description, image_url)
VALUES
  ('3da2ff84-4926-4d9b-8126-68100b17476c', 'Fiction',       'fiction',        NULL, NULL),
  ('744327d5-cbb3-47d2-94b4-1b9e774b690d', 'Religion',      'religion',       NULL, NULL),
  ('bc371ef6-88cd-44fa-ad36-978dc82a4c65', 'Business',      'business',       NULL, NULL),
  ('3396f1ab-7d19-4081-90b5-709d4971a0ff', 'Education',     'education',      NULL, NULL),
  ('4303e9ad-ccb9-40a4-a04b-0b99ca6c57b0', 'Self-Help',    'self-help',     NULL, NULL),
  ('9e848352-15d3-44e9-8210-e44898b33775', 'Children',      'children',       NULL, NULL),
  ('090afa7f-5d7a-4761-bb6e-f240e8ccde35', 'History',       'history',        NULL, NULL),
  ('2781e14d-abf0-4e70-83e5-f0418df77292', 'Technology',    'technology',     NULL, NULL),
  ('1afa1e45-a631-40da-8e0d-f7107fb3a96d', 'Lifestyle',     'lifestyle',      NULL, NULL),
  ('128bc710-81e2-41da-a52c-972fb7f609bf', 'Non-Fiction',  'non-fiction',    NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 5. PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author TEXT,
  isbn TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  category TEXT, -- Compatibility field
  category_id UUID REFERENCES public.categories(id),
  vendor_id UUID REFERENCES auth.users(id),
  stock INTEGER DEFAULT 0,
  image_url TEXT, -- Source image
  images TEXT[] DEFAULT '{}',
  description TEXT,
  format TEXT CHECK (format IN ('physical', 'ebook')) DEFAULT 'physical',
  is_featured BOOLEAN DEFAULT false,
  curation_priority INTEGER DEFAULT 10,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. VENDORS
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  store_name TEXT NOT NULL,
  bio TEXT,
  mpesa_number TEXT,
  commission_rate NUMERIC DEFAULT 10,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. PLATFORM INFRASTRUCTURE
CREATE TABLE public.platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.platform_settings (key, value) VALUES
('maintenance_mode', 'false'),
('free_delivery_threshold', '3000'),
('contact_email', 'nuriakenyabookstore@gmail.com'),
('contact_phone', '0794 233261 / 0729 829697'),
('announcement_text', 'Free delivery on orders over KSh 3,000'),
('announcement_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- 8. ANALYTICS & CMS
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  category TEXT DEFAULT 'Insights',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.product_views (
  product_id UUID PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  gross_sales NUMERIC DEFAULT 0,
  commission NUMERIC DEFAULT 0,
  net_payout NUMERIC DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'paid')) DEFAULT 'pending',
  mpesa_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Products
CREATE POLICY "Products readable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Platform Settings
CREATE POLICY "Public read settings" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.platform_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Vendor analytics
CREATE POLICY "Public views access" ON public.product_views FOR SELECT USING (true);
CREATE POLICY "System update views" ON public.product_views FOR ALL USING (true);

-- Posts
CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage posts" ON public.posts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 10. TRIGGERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, needs_role_selection)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    true
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- INDEXES
CREATE INDEX idx_products_curation ON public.products(curation_priority DESC, created_at DESC);
CREATE INDEX idx_products_slug ON public.products(slug);

-- ==========================================
-- NURIA CATALOG REORGANIZATION: KEYWORD MAPPING
-- ==========================================

-- Note: these UPDATEs assume products already exist.
-- If you run this immediately after reset with no products inserted, they will do nothing.

-- 1. Fiction
UPDATE public.products
SET category_id = '3da2ff84-4926-4d9b-8126-68100b17476c', category = 'Fiction'
WHERE title ILIKE ANY (ARRAY[
  '%novel%','%story%','%fiction%','%stories%','%poem%','%poetry%',
  '%literary%','%shreds%','%bitter%','%stuck here%','%sizzling%',
  '%tamed%','%wa thiong%o%'
]);

-- 2. Religion
UPDATE public.products
SET category_id = '744327d5-cbb3-47d2-94b4-1b9e774b690d', category = 'Religion'
WHERE title ILIKE ANY (ARRAY[
  '%god%','%christ%','%faith%','%bible%','%scripture%','%worshipper%',
  '%eden%','%triune%','%prayer%','%divine%','%providence%',
  '%christian%','%islam%','%spiritual%','%well%'
]);

-- 3. Business
UPDATE public.products
SET category_id = 'bc371ef6-88cd-44fa-ad36-978dc82a4c65', category = 'Business'
WHERE title ILIKE ANY (ARRAY[
  '%business%','%wealth%','%investment%','%fintech%','%ceo%',
  '%leadership%','%accountability%','%market%','%trade%',
  '%liberalization%','%construction%','%industry%','%finance%',
  '%money%','%rich%','%poverty%','%tax%','%profitable%'
]);

-- 4. Education
UPDATE public.products
SET category_id = '3396f1ab-7d19-4081-90b5-709d4971a0ff', category = 'Education'
WHERE title ILIKE ANY (ARRAY[
  '%algebra%','%teach%','%training%','%els 202%','%grade%',
  '%practitioner%','%legislative%','%syllabus%','%notes%',
  '%grammar%','%primary%','%secondary%','%student%','%workbook%',
  '%head start%','%reflector%','%mastery%'
]);

-- 5. Self-Help
UPDATE public.products
SET category_id = '4303e9ad-ccb9-40a4-a04b-0b99ca6c57b0', category = 'Self-Help'
WHERE title ILIKE ANY (ARRAY[
  '%mastery%','%habits%','%success%','%healing%','%growth%',
  '%identity%','%becoming%','%mindset%','%wisdom%','%soul%',
  '%gratitude%','%goals%','%resilience%','%empower%',
  '%productivity%','%rewire%','%ultimate%','%triumph%'
]);

-- 6. Children
UPDATE public.products
SET category_id = '9e848352-15d3-44e9-8210-e44898b33775', category = 'Children'
WHERE title ILIKE ANY (ARRAY[
  '%kids%','%child%','%children%','%baby%','%abc%','%junior%',
  '%toro%','%monkeys%','%nursery%'
]);

-- 7. History
UPDATE public.products
SET category_id = '090afa7f-5d7a-4761-bb6e-f240e8ccde35', category = 'History'
WHERE title ILIKE ANY (ARRAY[
  '%history%','%sociology%','%empire%','%legacy%','%autobiography%',
  '%decolonising%','%origins%','%freedom%','%colony%','%settler%',
  '%kimathi%','%imperialism%','%mau mau%'
]);

-- 8. Technology
UPDATE public.products
SET category_id = '2781e14d-abf0-4e70-83e5-f0418df77292', category = 'Technology'
WHERE title ILIKE ANY (ARRAY[
  '%digital%','%ai%','%machine%','%internet%','%code%','%software%',
  '%computer%','%frontiers%'
]);

-- 9. Lifestyle
UPDATE public.products
SET category_id = '1afa1e45-a631-40da-8e0d-f7107fb3a96d', category = 'Lifestyle'
WHERE title ILIKE ANY (ARRAY[
  '%parenting%','%heart attack%','%food%','%nairobi%','%city%','%guide%',
  '%cook%','%recipe%','%marriage%','%health%','%cancer%',
  '%blood pressure%','%family%','%relationship%','%mums%'
]);

-- 10. Non-Fiction (Catch-all for remaining products)
UPDATE public.products
SET category_id = '128bc710-81e2-41da-a52c-972fb7f609bf', category = 'Non-Fiction'
WHERE category_id IS NULL
   OR category_id NOT IN (
     '3da2ff84-4926-4d9b-8126-68100b17476c',
     '744327d5-cbb3-47d2-94b4-1b9e774b690d',
     'bc371ef6-88cd-44fa-ad36-978dc82a4c65',
     '3396f1ab-7d19-4081-90b5-709d4971a0ff',
     '4303e9ad-ccb9-40a4-a04b-0b99ca6c57b0',
     '9e848352-15d3-44e9-8210-e44898b33775',
     '090afa7f-5d7a-4761-bb6e-f240e8ccde35',
     '2781e14d-abf0-4e70-83e5-f0418df77292',
     '1afa1e45-a631-40da-8e0d-f7107fb3a96d'
   );
