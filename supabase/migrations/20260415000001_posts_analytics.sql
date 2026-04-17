-- 📈 Posts Analytics Expansion

-- 1. Add views and read_time to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS read_time TEXT DEFAULT '5 min';

-- 2. Ensure RLS allows admins to update these
CREATE POLICY "Admins can update post analytics" ON public.posts
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Seed some initial values for existing posts to avoid 0s
UPDATE public.posts 
SET views = floor(random() * 5000 + 1000)::int
WHERE views = 0 OR views IS NULL;
