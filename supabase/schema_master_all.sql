-- =================================================================
-- VANLIFE LOYIHASI UCHUN TO'LIQ VA BIRLASHTIRILGAN MASTER SQL SKRIPT
-- Supabase SQL Editor bo'limida ushbu kodni ishga tushiring (Run)
-- =================================================================

-- 1. VANS (Avtomobillar) JADVALI VA RLS RUHSATLARI
ALTER TABLE IF EXISTS public.vans ENABLE ROW LEVEL SECURITY;

-- Eski ziddiyatli policy-larni tozalash
DROP POLICY IF EXISTS "Anyone can view vans" ON public.vans;
DROP POLICY IF EXISTS "Enable select for all users" ON public.vans;
DROP POLICY IF EXISTS "Admins can update vans" ON public.vans;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.vans;

-- Hamma vanlarni o'qiy olishi (SELECT) uchun policy
CREATE POLICY "Enable select for all users"
ON public.vans FOR SELECT
USING (true);

-- Tizimga kirgan foydalanuvchilar (Admin) vanlarni tahrirlashi (UPDATE) uchun policy
CREATE POLICY "Enable update for authenticated users"
ON public.vans FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);


-- 2. BOOKINGS (Ijaralar) JADVALI VA RLS RUHSATLARI
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    van_id BIGINT REFERENCES public.vans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings jadvalida RLS yoqish
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy-larni tozalash va qayta yaratish
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

-- Foydalanuvchilar o'z ijaralarini ko'ra olishi uchun policy
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Foydalanuvchilar yangi ijara kiritishi uchun policy
CREATE POLICY "Users can insert their own bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Foydalanuvchilar o'z ijarasini topshirishi / yopishi (UPDATE status) uchun policy
CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- 3. REVIEWS (Sharhlar va Reytinglar) JADVALI VA RLS RUHSATLARI
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    van_id BIGINT REFERENCES public.vans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews jadvalida RLS yoqish
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy-larni tozalash va qayta yaratish
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;

-- Hamma sharhlarni ko'ra olishi uchun policy
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
USING (true);

-- Hamma (mehmonlar va tizimdagilar) sharh qoldira olishi uchun policy
CREATE POLICY "Anyone can insert reviews"
ON public.reviews FOR INSERT
WITH CHECK (true);
