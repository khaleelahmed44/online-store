import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';
import type { CheckoutItem } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: CheckoutItem[] = body.items;
    const shippingAddress: string = body.shippingAddress || '';
    const userId: string | null = body.userId || null;

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const supabase = createServiceClient();

    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock_quantity, price, sale_percentage, name')
        .eq('id', item.id)
        .single();

      if (product && item.quantity > product.stock_quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'pkr',
        product_data: {
          name: item.name,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const stripe = getStripe();
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: { allowed_countries: ['PK'] },
      metadata: {
        user_id: userId || '',
        shipping_address: shippingAddress,
      },
    });

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        stripe_session_id: session.id,
        total_amount: totalAmount,
        status: 'pending',
        shipping_address: shippingAddress,
        tracking_number: `TRK-${Date.now().toString(36).toUpperCase()}`,
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
    }

    if (order) {
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));
      await supabase.from('order_items').insert(orderItems);
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
