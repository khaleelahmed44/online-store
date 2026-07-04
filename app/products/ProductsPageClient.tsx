'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import { PRICE_FILTER } from '@/lib/constants';
import { getSalePrice } from '@/lib/currency';
import ProductCard from '@/components/ProductCard';
import ProductSidebar from '@/components/ProductSidebar';
import { HelpdeskBanner } from '@/components/TrustBar';

type ProductsPageProps = {
  initialProducts: Product[];
  categories: string[];
  tags: string[];
};

export default function ProductsPageClient({ initialProducts, categories, tags }: ProductsPageProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_FILTER.defaultMax);
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      const salePrice = getSalePrice(p.price, p.sale_percentage);
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      const matchesPrice = salePrice <= maxPrice;
      const matchesColor = !color || p.color === color;
      return matchesSearch && matchesCategory && matchesPrice && matchesColor;
    });
  }, [initialProducts, search, category, maxPrice, color]);

  const newProducts = filtered.slice(0, 3);
  const bestSellers = filtered.slice(1, 4).length ? filtered.slice(1, 4) : filtered;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Shop Collection</p>
        <h1 className="text-3xl font-black text-charcoal">Premium Toys, Thoughtfully Curated</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ProductSidebar
          categories={categories}
          tags={tags}
          onSearch={setSearch}
          onCategoryChange={setCategory}
          onPriceChange={setMaxPrice}
          onColorChange={setColor}
          selectedCategory={category}
          maxPrice={maxPrice}
          selectedColor={color}
        />

        <div className="space-y-10">
          <section>
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-2xl font-black uppercase text-charcoal">New Products</h2>
              <span className="text-xs text-charcoal/50">{filtered.length} items</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {newProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {newProducts.length === 0 && (
              <p className="py-12 text-center text-charcoal/50">No products match your filters.</p>
            )}
          </section>

          <section>
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-2xl font-black uppercase text-charcoal">Best Sellers</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {bestSellers.map((p) => (
                <ProductCard key={`bs-${p.id}`} product={p} />
              ))}
            </div>
          </section>

          <HelpdeskBanner />
        </div>
      </div>
    </div>
  );
}
