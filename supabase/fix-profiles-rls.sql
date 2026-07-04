-- Fix: infinite recursion in profiles RLS policies
-- Run this entire script in Supabase SQL Editor

-- Helper bypasses RLS when checking admin status (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Drop policies that cause recursion on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;

-- Profiles: users see/edit own row; admins see all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Products
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.is_admin());

-- Orders
CREATE POLICY "Admins can manage all orders"
  ON public.orders FOR ALL
  USING (public.is_admin());

-- Order items
CREATE POLICY "Admins can manage order items"
  ON public.order_items FOR ALL
  USING (public.is_admin());

-- Re-apply admin for your account
INSERT INTO public.profiles (id, full_name, is_admin)
SELECT id, split_part(email, '@', 1), true
FROM auth.users
WHERE email = 'ahmedkhaleel0313@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = true;
