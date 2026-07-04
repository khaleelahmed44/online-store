-- Convert legacy USD prices to PKR (run once in Supabase SQL Editor)
-- Only updates rows where price looks like USD (< 1000)

UPDATE public.products
SET price = ROUND(price * 280)
WHERE price > 0 AND price < 1000;
