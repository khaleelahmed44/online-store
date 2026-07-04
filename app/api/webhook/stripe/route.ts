import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook configuration' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createServiceClient();

    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', session.id)
      .single();

    if (order) {
      await supabase.from('orders').update({ status: 'paid' }).eq('id', order.id);

      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', order.id);

      if (orderItems) {
        for (const item of orderItems) {
          const { data: product } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item.product_id)
            .single();

          if (product) {
            await supabase
              .from('products')
              .update({ stock_quantity: Math.max(0, product.stock_quantity - item.quantity) })
              .eq('id', item.product_id);
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
