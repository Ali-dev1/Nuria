-- 🛠️ NURIA PLATFORM REPAIR & EXPANSION

-- 1. Repair Posts Table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Insights';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- 2. Expand Products Table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS isbn TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 10;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true;

-- 3. Financial Integrity: Payout Audit Trail
CREATE TABLE IF NOT EXISTS public.payout_order_items (
  payout_id UUID REFERENCES public.payouts(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
  PRIMARY KEY (payout_id, order_item_id)
);

-- 4. Singleton Constraint for Platform Settings
-- This ensures only one row can exist for each key (already handled by PRIMARY KEY on 'key'),
-- but we unify the access logic.
CREATE UNIQUE INDEX IF NOT EXISTS platform_settings_key_idx ON public.platform_settings (key);

-- 5. Restore RLS for Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read published posts" ON public.posts;
CREATE POLICY "Public read published posts" ON public.posts
FOR SELECT USING (is_published = true OR (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
)));
