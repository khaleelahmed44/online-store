'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/currency';
import { STORE, whatsappLink } from '@/lib/constants';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-charcoal/60">Nothing to checkout.</p>
        <Link href="/products" className="mt-4 inline-block text-ember font-semibold">Continue shopping</Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image_url: i.image_url,
          })),
          shippingAddress,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/cart" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ember">
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 className="text-3xl font-black text-charcoal">Checkout</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        All prices in Pakistani Rupees (PKR). Delivery across {STORE.location}.
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-charcoal">Delivery Address</h2>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="House #, Street, Area, City, Pakistan..."
            rows={3}
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-ember"
          />
        </div>

        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-charcoal">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-charcoal/70">{item.name} × {item.quantity}</span>
              <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="mt-4 flex justify-between border-t border-black/10 pt-4">
            <span className="font-bold text-charcoal">Total</span>
            <span className="text-xl font-black text-ember">{formatPrice(subtotal)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <a
          href={whatsappLink(
            `Hi ${STORE.name}, I'd like to place an order:\n\n${items.map((i) => `• ${i.name} x${i.quantity} — Rs. ${(i.price * i.quantity).toLocaleString('en-PK')}`).join('\n')}\n\nTotal: Rs. ${subtotal.toLocaleString('en-PK')}\n\nDelivery: ${shippingAddress || '(to be confirmed)'}`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 font-bold uppercase tracking-wider text-white transition hover:bg-[#20BD5A]"
        >
          Order via WhatsApp
        </a>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-charcoal py-4 font-bold uppercase tracking-wider text-charcoal transition hover:bg-charcoal hover:text-white disabled:opacity-50"
        >
          <Lock size={16} />
          {loading ? 'Redirecting...' : 'Pay with Stripe (PKR)'}
        </button>
      </div>
    </div>
  );
}
