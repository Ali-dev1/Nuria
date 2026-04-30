-- Add quality_score column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT 0;

-- Create an index on category and quality_score for faster filtering and sorting
CREATE INDEX IF NOT EXISTS idx_products_category_quality_score ON products(category, quality_score DESC);

-- Update categories table to match new system
-- 1. Merge 'Children' and 'Education' into 'Children Education'
UPDATE categories SET name = 'Children Education', slug = 'children-education' WHERE slug = 'children';
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'children-education') WHERE category_id = (SELECT id FROM categories WHERE slug = 'education');
DELETE FROM categories WHERE slug = 'education';

-- 2. Rename 'General Catalog' to 'All Categories'
UPDATE categories SET name = 'All Categories', slug = 'all-categories' WHERE slug = 'general-catalog';
