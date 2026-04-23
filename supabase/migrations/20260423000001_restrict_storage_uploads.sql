-- Restrict book-covers storage bucket to vendors and admins only
-- Prevents arbitrary authenticated users from uploading files

DO $$
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can upload book covers" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can update book covers" ON storage.objects;
EXCEPTION
    WHEN others THEN null;
END $$;

-- Only vendors and admins can upload book covers
CREATE POLICY "Vendors and admins can upload book covers"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'book-covers'
    AND (
        public.has_role(auth.uid(), 'vendor')
        OR public.has_role(auth.uid(), 'admin')
    )
);

-- Only vendors and admins can update book covers
CREATE POLICY "Vendors and admins can update book covers"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'book-covers'
    AND (
        public.has_role(auth.uid(), 'vendor')
        OR public.has_role(auth.uid(), 'admin')
    )
);

NOTIFY pgrst, 'reload schema';
