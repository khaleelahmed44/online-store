'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getSalePrice, formatPrice } from '@/lib/currency';
import { useCartStore } from '@/lib/store';
import StockMeter from '@/components/StockMeter';

type ProductDetailClientProps = {
  product: Product;
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);

  const salePrice = getSalePrice(product.price, product.sale_percentage);
  const outOfStock = product.stock_quantity === 0;

  const handleAddToCart = () => {
    const success = addToCart({
      id: product.id,
      name: product.name,
      price: salePrice,
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity,
      quantity,
    });
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const galleryImages = [
    product.image_url,
    product.image_url,
    product.image_url,
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ember transition hover:text-emberDark">
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white shadow-sm">
            {galleryImages[0] && (
              <Image src={galleryImages[0]} alt={product.name} fill className="object-cover" priority sizes="50vw" />
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-black/10">
                <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="15vw" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {product.category && (
            <span className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-ember">{product.category}</span>
          )}
          <h1 className="text-4xl font-black text-charcoal">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black text-ember">{formatPrice(salePrice)}</span>
            {product.sale_percentage > 0 && (
              <>
                <span className="text-lg text-charcoal/40 line-through">{formatPrice(product.price)}</span>
                <span className="rounded-full bg-ember/10 px-3 py-1 text-xs font-bold text-ember">
                  {product.sale_percentage}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-charcoal/70">{product.description}</p>

          <div className="mt-8">
            <StockMeter stock={product.stock_quantity} />
          </div>

          {!outOfStock && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-black/10">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-l-full px-4 py-3 transition hover:bg-cream"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  className="rounded-r-full px-4 py-3 transition hover:bg-cream"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3.5 font-bold uppercase tracking-wider text-white transition hover:bg-ember"
              >
                <ShoppingCart size={18} />
                {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          )}

          {outOfStock && (
            <p className="mt-8 rounded-full bg-charcoal/10 px-6 py-3 text-center text-sm font-semibold text-charcoal/60">
              This item is currently out of stock
            </p>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-cream px-3 py-1 text-xs text-charcoal/60">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
