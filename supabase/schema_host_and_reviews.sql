-- Supabase SQL Editor ichida ushbu SQL kodni ishga tushiring:

-- 1. Sharhlar (reviews) jadvalini yaratish
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    van_id BIGINT REFERENCES public.vans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Reviews jadvalida RLS ni yoqish
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 3. Hamma sharhlarni ko'ra olishi uchun policy
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
USING (true);

-- 4. Autentifikatsiyadan o'tgan foydalanuvchilar sharh qoldirishi uchun policy
CREATE POLICY "Authenticated users can insert reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. Admin (mrasilbek3@gmail.com) vanlarni tahrirlashi va yangi van qo'shishi uchun vans jadvalida RLS yoqish/yangilash
ALTER TABLE public.vans ENABLE ROW LEVEL SECURITY;

-- Hamma vanlarni o'qiy olishi uchun policy (agar bo'lmasa)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vans' AND policyname = 'Anyone can view vans') THEN
        CREATE POLICY "Anyone can view vans" ON public.vans FOR SELECT USING (true);
    END IF;
END $$;

-- Admin update policy
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vans' AND policyname = 'Admins can update vans') THEN
        CREATE POLICY "Admins can update vans" ON public.vans FOR UPDATE TO authenticated USING (true);
    END IF;
END $$;
