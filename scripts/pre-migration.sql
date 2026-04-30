-- ============================================================
--  PRE-MIGRATION: Run this in the Supabase SQL Editor FIRST
-- ============================================================

-- 1. Add the original_url column (for source_url mapping)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_url TEXT;

-- 2. Create a helper RPC so the script can run TRUNCATE via the API
CREATE OR REPLACE FUNCTION public.exec_sql(query TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE query;
END;
$$;

-- Grant execute to the service_role (used by the migration script)
GRANT EXECUTE ON FUNCTION public.exec_sql(TEXT) TO service_role;
