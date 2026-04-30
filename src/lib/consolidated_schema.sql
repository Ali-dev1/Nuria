-- ============================================================
-- NURIA — Consolidated Production Schema Hardening
-- ============================================================
-- This script synchronizes the production database with the 
-- latest categorization, ranking, and status logic.
-- ============================================================

-- 1. Infrastructure Hardening
ALTER TABLE products ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);

-- 2. Performance Optimization
CREATE INDEX IF NOT EXISTS idx_products_category_quality_score 
ON products(category, quality_score DESC);

CREATE INDEX IF NOT EXISTS idx_products_is_active 
ON products(is_active) WHERE is_active = false;

-- 3. Category System Alignment
-- Ensure 'All Categories' exists and is the primary catch-all
UPDATE categories SET name = 'All Categories', slug = 'all-categories' WHERE slug = 'general-catalog';

-- Merge Children and Education into 'Children Education'
UPDATE categories SET name = 'Children Education', slug = 'children-education' WHERE slug = 'children';
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'children-education') 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'education');
DELETE FROM categories WHERE slug = 'education';

-- 4. RPC for Script Support (Optional but Recommended)
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS void AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
