-- 🛠️ Order & Checkout Security Repair
-- Ensures users can create orders and manage related data during the checkout flow.

-- 1. Orders Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users create own orders" ON public.orders;
    DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
EXCEPTION
    WHEN others THEN null;
END $$;

CREATE POLICY "Users create own orders" ON public.orders 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own orders" ON public.orders 
FOR SELECT USING (auth.uid() = user_id);

-- 2. Order Items Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users insert own order items" ON public.order_items;
    DROP POLICY IF EXISTS "Users view own order items" ON public.order_items;
EXCEPTION
    WHEN others THEN null;
END $$;

-- Policy to allow inserting items into an order that belongs to the user
CREATE POLICY "Users insert own order items" ON public.order_items 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users view own order items" ON public.order_items 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- 3. Loyalty Transactions Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users create own loyalty" ON public.loyalty_transactions;
    DROP POLICY IF EXISTS "Users view own loyalty" ON public.loyalty_transactions;
EXCEPTION
    WHEN others THEN null;
END $$;

CREATE POLICY "Users create own loyalty" ON public.loyalty_transactions 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own loyalty" ON public.loyalty_transactions 
FOR SELECT USING (auth.uid() = user_id);

-- 4. Profile Loyalty Update
-- Ensures users can update their own loyalty totals during checkout
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users update own loyalty balance" ON public.profiles;
EXCEPTION
    WHEN others THEN null;
END $$;

CREATE POLICY "Users update own loyalty balance" ON public.profiles 
FOR UPDATE USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 5. API Refresh
NOTIFY pgrst, 'reload schema';
