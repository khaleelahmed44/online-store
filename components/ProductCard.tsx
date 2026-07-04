'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getSalePrice, formatPrice } from '@/lib/currency';
import { getProductBadge } from '@/lib/products';
import { useCartStore } from '@/lib/store';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addToCart);
  const salePrice = getSalePrice(product.price, product.sale_percentage);
  const badge = getProductBadge(product);
  const outOfStock = product.stock_quantity === 0;
  const rating = product.rating ?? 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: salePrice,
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity,
      quantity: 1,
    });
  };

  return (
    <article className={`overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm transition hover:shadow-glow ${outOfStock ? 'opacity-60' : ''}`}>
      <Link href={`/products/${product.id}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          {!outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-ember/80 opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="rounded-full bg-white p-3 text-charcoal shadow-lg">
                <Eye size={18} />
              </span>
            </div>
          )}
          {badge && (
            <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white ${badge === 'Sale!' ? 'bg-ember' : 'bg-charcoal'}`}>
              {badge}
            </span>
          )}
          {outOfStock && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-charcoal/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                Out of Stock
              </span>
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center gap-0.5 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} fill={i < Math.round(rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <h4 className="font-bold uppercase tracking-wide text-charcoal">{product.name}</h4>
          {product.category && (
            <p className="mt-1 text-xs text-charcoal/50">{product.category}</p>
          )}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-black text-ember">{formatPrice(salePrice)}</span>
            {product.sale_percentage > 0 && (
              <span className="text-sm text-charcoal/40 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
      {!outOfStock && (
        <div className="border-t border-black/10 p-4">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-charcoal px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-ember"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      )}
    </article>
  );
}
