-- AUTOMATED INVENTORY & LOYALTY TRIGGERS (REFINED)
-- Synchronized with current codebase column names and types.

-- 1. Inventory Management Trigger
CREATE OR REPLACE FUNCTION public.process_inventory_reduction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Decrease 'stock' for the product (matches CheckoutPage.tsx)
    UPDATE public.products
    SET stock = GREATEST(0, stock - NEW.quantity)
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_order_items_inventory ON public.order_items;
CREATE TRIGGER tr_order_items_inventory
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.process_inventory_reduction();


-- 2. Loyalty Points Automation
CREATE OR REPLACE FUNCTION public.process_loyalty_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    points_to_add INTEGER;
BEGIN
    -- Use the points already calculated by the frontend/stored in orders table
    points_to_add := COALESCE(NEW.loyalty_points_earned, 0);
    
    IF points_to_add > 0 THEN
        -- Update User Profile Loyalty Balance
        UPDATE public.profiles
        SET loyalty_points = loyalty_points + points_to_add
        WHERE user_id = NEW.user_id;
        
        -- Log the 'earned' transaction (matches CheckoutPage.tsx)
        INSERT INTO public.loyalty_transactions (user_id, points, type, order_id)
        VALUES (NEW.user_id, points_to_add, 'earned', NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_orders_loyalty ON public.orders;
CREATE TRIGGER tr_orders_loyalty
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.process_loyalty_points();
