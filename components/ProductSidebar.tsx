'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, CheckCircle } from 'lucide-react';
import { PRICE_FILTER } from '@/lib/constants';
import { formatPrice } from '@/lib/currency';

type SidebarProps = {
  categories: string[];
  tags: string[];
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onPriceChange: (max: number) => void;
  onColorChange: (color: string | null) => void;
  selectedCategory: string;
  maxPrice: number;
  selectedColor: string | null;
};

const COLORS = ['#FF5722', '#1E1E1E', '#FDFBF7', '#C5A880', '#F4A261', '#E76F51', '#2A9D8F', '#264653'];

export default function ProductSidebar({
  categories,
  tags,
  onSearch,
  onCategoryChange,
  onPriceChange,
  onColorChange,
  selectedCategory,
  maxPrice,
  selectedColor,
}: SidebarProps) {
  const [search, setSearch] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <aside className="space-y-5">
      <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2.5">
          <Search size={16} className="shrink-0 text-ember" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearch(e.target.value);
            }}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search products..."
          />
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold uppercase tracking-wide text-charcoal">Categories</h3>
          <SlidersHorizontal size={16} className="text-ember" />
        </div>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onCategoryChange(cat)}
                className={`w-full rounded-full px-3 py-2 text-left text-sm transition ${
                  selectedCategory === cat
                    ? 'bg-ember/10 font-semibold text-ember'
                    : 'text-charcoal/70 hover:bg-cream hover:text-ember'
                }`}
              >
                <span className="mr-2 text-ember">•</span>
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-bold uppercase tracking-wide text-charcoal">Price Range</h3>
        <input
          type="range"
          min={PRICE_FILTER.min}
          max={PRICE_FILTER.max}
          step={1000}
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-ember"
        />
        <div className="mt-2 flex justify-between text-xs text-charcoal/60">
          <span>{formatPrice(PRICE_FILTER.min)}</span>
          <span className="font-semibold text-ember">Up to {formatPrice(maxPrice)}</span>
          <span>{formatPrice(PRICE_FILTER.max)}</span>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-bold uppercase tracking-wide text-charcoal">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(selectedColor === color ? null : color)}
              className={`h-8 w-8 rounded-full border-2 transition ${
                selectedColor === color ? 'border-ember ring-2 ring-ember/30' : 'border-black/10'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Filter by color ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
        <h3 className="mb-2 font-bold uppercase tracking-wide text-charcoal">Newsletter</h3>
        <p className="mb-3 text-xs text-charcoal/60">Get early access to new launches.</p>
        {subscribed ? (
          <p className="flex items-center gap-2 text-xs font-semibold text-ember">
            <CheckCircle size={14} /> Subscribed!
          </p>
        ) : (
          <>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email"
              className="mb-3 w-full rounded-full border border-black/10 px-4 py-2 text-sm outline-none focus:border-ember"
            />
            <button
              type="button"
              onClick={() => newsletterEmail.trim() && setSubscribed(true)}
              className="w-full rounded-full bg-ember px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-emberDark"
            >
              Sign Up Now!
            </button>
          </>
        )}
      </div>

      <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-bold uppercase tracking-wide text-charcoal">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="cursor-pointer rounded-full bg-cream px-3 py-1 text-xs text-charcoal/60 transition hover:bg-ember/10 hover:text-ember"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
