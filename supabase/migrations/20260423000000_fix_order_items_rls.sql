-- Order Items RLS Fix
-- Re-create the missing order_items policies that were dropped

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users insert own order items" ON public.order_items;
    DROP POLICY IF EXISTS "Users view own order items" ON public.order_items;
    DROP POLICY IF EXISTS "orders_items_select_policy" ON public.order_items;
    DROP POLICY IF EXISTS "orders_items_insert_policy" ON public.order_items;
EXCEPTION
    WHEN others THEN null;
END $$;

CREATE POLICY "orders_items_select_policy" ON public.order_items FOR SELECT TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'admin')
    )
  );

CREATE POLICY "orders_items_insert_policy" ON public.order_items FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

NOTIFY pgrst, 'reload schema';
