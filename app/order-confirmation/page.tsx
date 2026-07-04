'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import type { OrderWithItems } from '@/lib/types';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setOrder(data);
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return <div className="py-20 text-center text-charcoal/60">Loading order details...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <CheckCircle size={64} className="mx-auto text-emerald-500" />
      <h1 className="mt-6 text-3xl font-black text-charcoal">Order Confirmed!</h1>
      <p className="mt-2 text-charcoal/60">Thank you for your purchase. We&apos;re preparing your order now.</p>

      {order && (
        <div className="mt-10 rounded-[1.5rem] border border-black/10 bg-white p-6 text-left shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50">Order ID</p>
              <p className="mt-1 font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50">Total</p>
              <p className="mt-1 text-xl font-black text-ember">{formatPrice(Number(order.total_amount))}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50">Status</p>
              <p className="mt-1 flex items-center gap-1.5 font-semibold capitalize text-charcoal">
                <Package size={14} className="text-ember" /> {order.status}
              </p>
            </div>
            {order.tracking_number && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50">Tracking</p>
                <p className="mt-1 flex items-center gap-1.5 font-mono text-sm">
                  <Truck size={14} className="text-ember" /> {order.tracking_number}
                </p>
              </div>
            )}
          </div>

          {order.shipping_address && (
            <div className="mt-6 border-t border-black/10 pt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50">Shipping To</p>
              <p className="mt-1 text-sm text-charcoal/70">{order.shipping_address}</p>
            </div>
          )}

          {order.order_items && order.order_items.length > 0 && (
            <div className="mt-6 border-t border-black/10 pt-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-charcoal/50">Items</p>
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between py-1.5 text-sm">
                  <span className="text-charcoal/70">
                    {(item as { products?: { name: string } }).products?.name || 'Product'} × {item.quantity}
                  </span>
                  <span className="font-semibold">{formatPrice(Number(item.price_at_purchase) * item.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Link
        href="/products"
        className="mt-8 inline-block rounded-full bg-ember px-8 py-3 font-bold text-white transition hover:bg-emberDark"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
