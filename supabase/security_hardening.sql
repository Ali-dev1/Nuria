-- ==========================================
-- NURIA PLATFORM - COMPREHENSIVE SECURITY & PERFORMANCE HARDENING
-- ==========================================
-- Addresses Supabase Advisor & SonarQube Reports:
-- 1. Security: RLS Enablement, Permissive Policy Restriction, Function search_path
-- 2. Performance: Missing Foreign Key Indexes, RLS optimization
-- ==========================================

BEGIN;

-- 1. CORE SECURITY UTILITIES
-- ------------------------------------------

-- Ensure robust role checking with fixed search_path
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Revoke public execution of sensitive functions
REVOKE EXECUTE ON FUNCTION public.get_auth_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_role() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- 2. DANGEROUS FUNCTIONS RESTRICTION
-- ------------------------------------------

-- exec_sql is extremely dangerous. Revoke all public access.
REVOKE ALL ON FUNCTION public.exec_sql(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.exec_sql(TEXT) TO service_role;

-- Ensure other backend functions have restricted search_path and execution
ALTER FUNCTION public.process_inventory_reduction() SET search_path = public;
ALTER FUNCTION public.process_loyalty_points() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.process_inventory_reduction() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.process_loyalty_points() FROM PUBLIC, anon;

-- 3. RLS ENABLEMENT & HARDENING
-- ------------------------------------------

-- Enable RLS on tables flagged as missing it
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- Categories (Public read, Admin write)
DROP POLICY IF EXISTS "categories_read_public" ON public.categories;
CREATE POLICY "categories_read_public" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "categories_admin_all" ON public.categories;
CREATE POLICY "categories_admin_all" ON public.categories 
  FOR ALL TO authenticated USING (public.is_admin());

-- Hardening Authors (Admin-only for write)
DROP POLICY IF EXISTS "authors_insert" ON public.authors;
DROP POLICY IF EXISTS "authors_update" ON public.authors;
DROP POLICY IF EXISTS "authors_delete" ON public.authors;
DROP POLICY IF EXISTS "authors_insert_admin" ON public.authors;
DROP POLICY IF EXISTS "authors_update_admin" ON public.authors;
DROP POLICY IF EXISTS "authors_delete_admin" ON public.authors;

CREATE POLICY "authors_insert_admin" ON public.authors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "authors_update_admin" ON public.authors FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "authors_delete_admin" ON public.authors FOR DELETE TO authenticated USING (public.is_admin());

-- Hardening Posts (Admin-only for write)
DROP POLICY IF EXISTS "posts_insert" ON public.posts;
DROP POLICY IF EXISTS "posts_update" ON public.posts;
DROP POLICY IF EXISTS "posts_delete" ON public.posts;
DROP POLICY IF EXISTS "posts_insert_admin" ON public.posts;
DROP POLICY IF EXISTS "posts_update_admin" ON public.posts;
DROP POLICY IF EXISTS "posts_delete_admin" ON public.posts;

CREATE POLICY "posts_insert_admin" ON public.posts FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "posts_update_admin" ON public.posts FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "posts_delete_admin" ON public.posts FOR DELETE TO authenticated USING (public.is_admin());

-- Hardening Platform Settings
DROP POLICY IF EXISTS "platform_settings_upsert" ON public.platform_settings;
DROP POLICY IF EXISTS "platform_settings_insert" ON public.platform_settings;
DROP POLICY IF EXISTS "platform_settings_write_admin" ON public.platform_settings;

CREATE POLICY "platform_settings_write_admin" ON public.platform_settings 
  FOR ALL TO authenticated USING (public.is_admin());

-- Hardening User Roles
DROP POLICY IF EXISTS "user_roles_insert" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_delete" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_write_admin" ON public.user_roles;

CREATE POLICY "user_roles_write_admin" ON public.user_roles 
  FOR ALL TO authenticated USING (public.is_admin());

-- Hardening Orders
DROP POLICY IF EXISTS "orders_update_all" ON public.orders;
CREATE POLICY "orders_update_admin" ON public.orders FOR UPDATE TO authenticated USING (public.is_admin());

-- 4. PERFORMANCE: FOREIGN KEY INDEXES
-- ------------------------------------------

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_payouts_vendor_id ON public.payouts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_user_id ON public.loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);

-- Clean up unused index flagged by Advisor
DROP INDEX IF EXISTS public.wishlists.idx_wishlist_product;

-- 5. STORAGE BUCKET PROTECTION
-- ------------------------------------------
-- Listing is usually controlled in Storage UI, but we ensure policies are specific.
-- For author-photos, blog-images, and book-covers, we've already 
-- consolidated the policies to bucket_id checks which is standard.

COMMIT;

NOTIFY pgrst, 'reload schema';
