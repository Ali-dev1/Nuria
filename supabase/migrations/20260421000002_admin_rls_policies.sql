-- Admin RLS Policy Fix: Allow admins to see ALL orders and order_items
-- Without this, admin dashboard only shows the admin's own orders

-- 1. Orders: Allow admin to SELECT all orders
DO $$
BEGIN
  -- Drop existing select policy if it only allows own orders
  DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
  DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;
  
  -- Re-create: users see own orders
  CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);
  
  -- Admin sees ALL orders
  CREATE POLICY "Admin can view all orders" ON public.orders
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );

  -- Admin can update any order (for status changes)
  DROP POLICY IF EXISTS "Admin can update all orders" ON public.orders;
  CREATE POLICY "Admin can update all orders" ON public.orders
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
END $$;

-- 2. Order Items: Allow admin to SELECT all order items
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
  DROP POLICY IF EXISTS "Admin can view all order items" ON public.order_items;
  
  CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
      )
    );
  
  CREATE POLICY "Admin can view all order items" ON public.order_items
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
END $$;

-- 3. Profiles: Allow admin to SELECT all profiles  
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
  
  CREATE POLICY "Admin can view all profiles" ON public.profiles
    FOR SELECT USING (
      auth.uid() = user_id
      OR EXISTS (
        SELECT 1 FROM public.profiles AS p
        WHERE p.user_id = auth.uid() 
        AND p.role = 'admin'
      )
    );
END $$;
