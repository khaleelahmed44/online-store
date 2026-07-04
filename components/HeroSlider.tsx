'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Plus, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getSalePrice, formatPrice } from '@/lib/currency';
import { STORE } from '@/lib/constants';
import { useCartStore } from '@/lib/store';

type HeroSliderProps = {
  products: Product[];
};

export default function HeroSlider({ products }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const addToCart = useCartStore((s) => s.addToCart);
  const slides = products.length ? products : [];
  const current = slides[index] ?? slides[0];

  if (!current) return null;

  const salePrice = getSalePrice(current.price, current.sale_percentage);

  const prev = () => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  const handleAddToCart = () => {
    addToCart({
      id: current.id,
      name: current.name,
      price: salePrice,
      image_url: current.image_url || '',
      stock_quantity: current.stock_quantity,
      quantity: 1,
    });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative bg-gradient-to-br from-ember via-emberDark to-ember">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          {/* Left: copy + CTAs */}
          <div className="relative z-10 text-white">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-white/70">
              Featured Collection
            </p>
            <h2 className="text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl">
              {current.name}
            </h2>
          <p className="mt-4 max-w-md text-base text-white/80 sm:text-lg">
            {current.description || `Premium quality from ${STORE.name}, Islamabad.`}
          </p>

            {/* Price callout bubble */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-xl">
              <span className="text-3xl font-black text-ember">{formatPrice(salePrice)}</span>
              {current.sale_percentage > 0 && (
                <span className="text-sm text-charcoal/40 line-through">{formatPrice(current.price)}</span>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-3 rounded-full bg-charcoal px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-charcoal"
              >
                Add to Cart
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ember">
                  <Plus size={16} />
                </span>
              </button>
              <Link
                href={`/products/${current.id}`}
                className="flex items-center gap-3 rounded-full border-2 border-white/60 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-charcoal"
              >
                Read More
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ember">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right: product cutout */}
          <div className="relative flex items-center justify-center">
            {current.image_url && (
              <div className="relative h-72 w-full sm:h-96 lg:h-[28rem]">
                <Image
                  src={current.image_url}
                  alt={current.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                  sizes="(max-width: 1024px) 80vw, 40vw"
                />
              </div>
            )}
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 60L60 45C120 30 240 0 360 0C480 0 600 30 720 37.5C840 45 960 30 1080 22.5C1200 15 1320 15 1380 15L1440 15V60H0Z" fill="#FDFBF7" />
          </svg>
        </div>

        {/* Slider controls */}
        <div className="absolute bottom-16 left-4 flex gap-2 sm:left-8 lg:bottom-20">
          <button onClick={prev} aria-label="Previous slide" className="rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white hover:text-ember">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} aria-label="Next slide" className="rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white hover:text-ember">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 gap-2 lg:bottom-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
