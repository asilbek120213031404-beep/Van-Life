-- Supabase SQL Editor ichida ushbu to'g'rilangan SQL kodni ishga tushiring:

-- 1. Bookings (Ijaralar) jadvalini yaratish
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

-- 2. Row Level Security (RLS) ni yoqish
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 3. Foydalanuvchilar o'z ijaralarini ko'ra olishi uchun policy
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. Autentifikatsiyadan o'tgan foydalanuvchilar yangi ijara qo'sha olishi uchun policy
CREATE POLICY "Users can insert their own bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
