-- 📚 Authors and Reviews Schema Migration

-- 1. Create Authors Table
CREATE TABLE IF NOT EXISTS public.authors (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    photo_url text,
    bio text,
    tags text[],
    slug text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 2. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamptz DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Authors are public
CREATE POLICY "Authors are viewable by everyone" ON public.authors FOR SELECT USING (true);
-- Reviews are public
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
-- But only authenticated users can write reviews
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Users can only delete/update their own reviews
CREATE POLICY "Users can manage their own reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);

-- 5. Seed Major Authors
INSERT INTO public.authors (name, photo_url, bio, tags, slug)
VALUES 
(
    'Ngũgĩ wa Thiong''o', 
    'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=600&auto=format&fit=crop',
    'Ngũgĩ wa Thiong''o is a Kenyan author and academic who writes primarily in Gikuyu. His work includes novels, plays, short stories, and essays, ranging from literary and social criticism to children''s literature.',
    ARRAY['Fiction', 'Post-colonialism', 'Essays'],
    'ngugi'
),
(
    'Chimamanda Ngozi Adichie',
    'https://images.unsplash.com/photo-1531123414708-f152d5e15961?q=80&w=600&auto=format&fit=crop',
    'Chimamanda Ngozi Adichie is a Nigerian writer whose works range from novels to short stories to nonfiction. She has been described as the most prominent of a new generation of African authors.',
    ARRAY['Feminism', 'Historical Fiction', 'Essays'],
    'chimamanda'
),
(
    'Chinua Achebe',
    'https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?q=80&w=600&auto=format&fit=crop',
    'Chinua Achebe was a Nigerian novelist, poet, and critic who is regarded as the dominant figure of modern African literature. His first novel and magnum opus, Things Fall Apart, occupies a pivotal place in African literature.',
    ARRAY['Classic Literature', 'Poetry', 'Criticism'],
    'chinua-achebe'
),
(
    'Wangari Maathai',
    'https://images.unsplash.com/photo-1554727242-741c14fa561c?q=80&w=600&auto=format&fit=crop',
    'Wangari Muta Maathai was a Kenyan social, environmental, and political activist and the first African woman to win the Nobel Peace Prize. Her writing powerfully advocates for sustainable development, democracy, and peace.',
    ARRAY['Activism', 'Memoir', 'Environment'],
    'wangari-maathai'
)
ON CONFLICT (slug) DO NOTHING;
