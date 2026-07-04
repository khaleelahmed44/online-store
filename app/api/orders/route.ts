import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('stripe_session_id', sessionId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json(order);
}
