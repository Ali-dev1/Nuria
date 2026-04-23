
-- ==========================================
-- NURIA TRINITY MASTER MIGRATION
-- ==========================================

-- 1. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS public.platform_settings (
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

-- 2. BLOG / CMS (Nuria Insights)
CREATE TABLE IF NOT EXISTS public.posts (
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

-- 3. PRODUCT VIEWS (Vendor Analytics)
CREATE TABLE IF NOT EXISTS public.product_views (
  product_id UUID PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PAYOUTS
CREATE TABLE IF NOT EXISTS public.payouts (
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

-- 5. PROFILE REFINEMENT
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS needs_role_selection BOOLEAN DEFAULT false;

-- 6. SECURITY: RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Clean start for policies (Prevents "Policy Already Exists" error)
DROP POLICY IF EXISTS "Public read settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins manage settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Settings public readable" ON public.platform_settings;

DROP POLICY IF EXISTS "Public read published posts" ON public.posts;
DROP POLICY IF EXISTS "Admins manage posts" ON public.posts;
DROP POLICY IF EXISTS "Published posts readable" ON public.posts;

DROP POLICY IF EXISTS "Public views access" ON public.product_views;
DROP POLICY IF EXISTS "Public views update" ON public.product_views;
DROP POLICY IF EXISTS "Views readable" ON public.product_views;
DROP POLICY IF EXISTS "System updates views" ON public.product_views;

DROP POLICY IF EXISTS "Vendors view own payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins manage payouts" ON public.payouts;

-- Re-create Policies
CREATE POLICY "Public read settings" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.platform_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read published posts" ON public.posts FOR SELECT USING (is_published = true OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage posts" ON public.posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public views access" ON public.product_views FOR SELECT USING (true);
CREATE POLICY "Public views update" ON public.product_views FOR ALL USING (true);

CREATE POLICY "Vendors view own payouts" ON public.payouts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.vendors WHERE vendors.id = payouts.vendor_id AND vendors.user_id = auth.uid())
);
CREATE POLICY "Admins manage payouts" ON public.payouts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 7. LOGIC: Triggers & RPCs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, needs_role_selection)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    true
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_product_view(prod_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.product_views (product_id, count)
  VALUES (prod_id, 1)
  ON CONFLICT (product_id)
  DO UPDATE SET count = product_views.count + 1, updated_at = now();
END;
$$;
