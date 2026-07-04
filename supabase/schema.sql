-- Premium Toy Store – Supabase schema
-- Run in Supabase SQL Editor

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  sale_percentage NUMERIC(5, 2) DEFAULT 0 CHECK (sale_percentage >= 0 AND sale_percentage <= 100),
  image_url TEXT,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  color TEXT,
  tags TEXT[] DEFAULT '{}',
  rating NUMERIC(2, 1) DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  shipping_address TEXT,
  phone_number TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase NUMERIC(10, 2) NOT NULL
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER helper avoids infinite recursion when policies query profiles
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

CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL
  USING (public.is_admin());

-- Seed data
INSERT INTO products (name, description, price, sale_percentage, image_url, category, stock_quantity, color, tags, rating) VALUES
  ('Aurora Playhouse', 'Handcrafted wooden playhouse with premium finishes and safe rounded edges.', 189.00, 15, 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80', 'Playhouses', 12, '#C5A880', ARRAY['handcrafted', 'giftable', 'new'], 4.8),
  ('Studio Rocket', 'Collectible wooden rocket with magnetic stages and display stand.', 142.00, 10, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80', 'Vehicles', 25, '#FF5722', ARRAY['best seller', 'modern'], 4.9),
  ('Harbor Blocks', 'Premium hardwood building blocks in a canvas carry tote.', 97.00, 20, 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80', 'Building', 30, '#1E1E1E', ARRAY['eco', 'classic'], 4.6),
  ('Forest Rider', 'Outdoor balance bike with adjustable seat and rubber grips.', 205.00, 0, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80', 'Outdoor', 8, '#FF5722', ARRAY['outdoor', 'limited'], 4.7),
  ('Cloud Cruiser', 'Smooth-rolling push car with ergonomic handle and soft wheels.', 124.00, 5, 'https://images.unsplash.com/photo-1558060379-5b8d3a4ae237?auto=format&fit=crop&w=900&q=80', 'Vehicles', 18, '#FDFBF7', ARRAY['toys', 'giftable'], 4.5),
  ('Pebble Kitchen', 'Mini kitchen set with utensils, pans, and chalkboard menu.', 168.00, 0, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80', 'Educational', 15, '#C5A880', ARRAY['educational', 'handcrafted'], 4.8)
ON CONFLICT DO NOTHING;
