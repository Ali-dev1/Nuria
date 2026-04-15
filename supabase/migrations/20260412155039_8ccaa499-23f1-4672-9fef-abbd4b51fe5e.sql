
-- Payouts table
CREATE TABLE public.payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  month TEXT NOT NULL,
  gross_sales NUMERIC NOT NULL DEFAULT 0,
  commission NUMERIC NOT NULL DEFAULT 0,
  net_payout NUMERIC NOT NULL DEFAULT 0,
  mpesa_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors view own payouts" ON public.payouts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.vendors WHERE vendors.id = payouts.vendor_id AND vendors.user_id = auth.uid())
);
CREATE POLICY "Admins manage all payouts" ON public.payouts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Platform settings table
CREATE TABLE public.platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.platform_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Seed default settings
INSERT INTO public.platform_settings (key, value) VALUES
  ('free_delivery_threshold', '10000'),
  ('default_commission_rate', '10'),
  ('announcement_text', ''),
  ('announcement_enabled', 'false'),
  ('contact_email', 'hello@nuria.co.ke'),
  ('contact_phone', '+254 700 000 000'),
  ('maintenance_mode', 'false');

-- Add vendor columns
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Add is_active to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Admin can update orders
CREATE POLICY "Admins update all orders" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Admin can update any order items (for status changes)
CREATE POLICY "Admins view all order items" ON public.order_items FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
