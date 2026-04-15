
-- ==========================================
-- NURIA CATALOG REORGANIZATION: KEYWORD MAPPING
-- ==========================================

-- 1. Fiction
UPDATE public.products 
SET category_id = '3da2ff84-4926-4d9b-8126-68100b17476c', category = 'Fiction'
WHERE title ILIKE ANY (ARRAY['%novel%', '%story%', '%fiction%', '%stories%', '%poem%', '%poetry%', '%literary%', '%shreds%', '%bitter%', '%stuck here%', '%sizzling%', '%tamed%', '%wa thiong%o%']);

-- 2. Religion
UPDATE public.products 
SET category_id = '744327d5-cbb3-47d2-94b4-1b9e774b690d', category = 'Religion'
WHERE title ILIKE ANY (ARRAY['%god%', '%christ%', '%faith%', '%bible%', '%scripture%', '%worshipper%', '%eden%', '%triune%', '%prayer%', '%divine%', '%providence%', '%christian%', '%islam%', '%spiritual%', '%well%']);

-- 3. Business
UPDATE public.products 
SET category_id = 'bc371ef6-88cd-44fa-ad36-978dc82a4c65', category = 'Business'
WHERE title ILIKE ANY (ARRAY['%business%', '%wealth%', '%investment%', '%fintech%', '%ceo%', '%leadership%', '%accountability%', '%market%', '%trade%', '%liberalization%', '%construction%', '%industry%', '%finance%', '%money%', '%rich%', '%poverty%', '%tax%', '%profitable%']);

-- 4. Education
UPDATE public.products 
SET category_id = '3396f1ab-7d19-4081-90b5-709d4971a0ff', category = 'Education'
WHERE title ILIKE ANY (ARRAY['%algebra%', '%teach%', '%training%', '%els 202%', '%grade%', '%practitioner%', '%legislative%', '%syllabus%', '%notes%', '%grammar%', '%primary%', '%secondary%', '%student%', '%workbook%', '%head start%', '%reflector%', '%mastery%']);

-- 5. Self-Help
UPDATE public.products 
SET category_id = '4303e9ad-ccb9-40a4-a04b-0b99ca6c57b0', category = 'Self-Help'
WHERE title ILIKE ANY (ARRAY['%mastery%', '%habits%', '%success%', '%healing%', '%growth%', '%identity%', '%becoming%', '%mindset%', '%wisdom%', '%soul%', '%gratitude%', '%goals%', '%resilience%', '%empower%', '%productivity%', '%rewire%', '%ultimate%', '%triumph%']);

-- 6. Children
UPDATE public.products 
SET category_id = '9e848352-15d3-44e9-8210-e44898b33775', category = 'Children'
WHERE title ILIKE ANY (ARRAY['%kids%', '%child%', '%children%', '%baby%', '%abc%', '%junior%', '%toro%', '%monkeys%', '%nursery%']);

-- 7. History
UPDATE public.products 
SET category_id = '090afa7f-5d7a-4761-bb6e-f240e8ccde35', category = 'History'
WHERE title ILIKE ANY (ARRAY['%history%', '%sociology%', '%empire%', '%legacy%', '%autobiography%', '%decolonising%', '%origins%', '%freedom%', '%colony%', '%settler%', '%kimathi%', '%imperialism%', '%mau mau%']);

-- 8. Technology
UPDATE public.products 
SET category_id = '2781e14d-abf0-4e70-83e5-f0418df77292', category = 'Technology'
WHERE title ILIKE ANY (ARRAY['%digital%', '%ai%', '%machine%', '%internet%', '%code%', '%software%', '%computer%', '%frontiers%']);

-- 9. Lifestyle
UPDATE public.products 
SET category_id = '1afa1e45-a631-40da-8e0d-f7107fb3a96d', category = 'Lifestyle'
WHERE title ILIKE ANY (ARRAY['%parenting%', '%heart attack%', '%food%', '%nairobi%', '%city%', '%guide%', '%cook%', '%recipe%', '%marriage%', '%health%', '%cancer%', '%blood pressure%', '%family%', '%relationship%', '%mums%']);

-- 10. Non-Fiction (Catch-all for everything else in General Catalog)
UPDATE public.products 
SET category_id = '128bc710-81e2-41da-a52c-972fb7f609bf', category = 'Non-Fiction'
WHERE category_id = '24eb5c28-4d7d-43cc-8d20-8a01b3d63f5e';
