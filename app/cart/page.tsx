'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/currency';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <ShoppingBag size={48} className="mx-auto text-charcoal/20" />
        <h1 className="mt-4 text-2xl font-black text-charcoal">Your cart is empty</h1>
        <p className="mt-2 text-charcoal/60">Discover our premium collection and add something special.</p>
        <Link href="/products" className="mt-6 inline-block rounded-full bg-ember px-8 py-3 font-bold text-white transition hover:bg-emberDark">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-charcoal">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-sm sm:items-center sm:gap-6 sm:p-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
              {item.image_url && (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="96px" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-charcoal">{item.name}</h3>
                <p className="text-sm text-ember font-semibold">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full border border-black/10">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock_quantity)}
                    className="px-3 py-2 transition hover:bg-cream"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock_quantity)}
                    disabled={item.quantity >= item.stock_quantity}
                    className="px-3 py-2 transition hover:bg-cream disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="hidden text-sm font-bold text-charcoal sm:block">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button onClick={() => removeFromCart(item.id)} className="text-charcoal/40 transition hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between text-lg">
          <span className="font-semibold text-charcoal">Subtotal</span>
          <span className="text-2xl font-black text-ember">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-charcoal/50">Shipping calculated at checkout</p>
        <Link
          href="/checkout"
          className="mt-6 block w-full rounded-full bg-charcoal py-3.5 text-center font-bold uppercase tracking-wider text-white transition hover:bg-ember"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
