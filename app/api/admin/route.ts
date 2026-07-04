import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, status, created_at');

    const { data: products } = await supabase.from('products').select('id, stock_quantity');

    const paidOrders = orders?.filter((o) => o.status === 'paid') ?? [];
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const activeOrders = orders?.filter((o) => ['pending', 'paid', 'shipped'].includes(o.status)).length ?? 0;
    const totalProducts = products?.length ?? 0;
    const lowStock = products?.filter((p) => p.stock_quantity < 5).length ?? 0;

    return NextResponse.json({
      totalRevenue,
      activeOrders,
      totalOrders: orders?.length ?? 0,
      conversionRate: orders?.length ? Math.round((paidOrders.length / orders.length) * 100) : 0,
      totalProducts,
      lowStock,
    });
  } catch {
    return NextResponse.json({
      totalRevenue: 0,
      activeOrders: 0,
      totalOrders: 0,
      conversionRate: 0,
      totalProducts: 0,
      lowStock: 0,
    });
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const supabase = createServiceClient();

  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createServiceClient();

  const { data, error } = await supabase.from('products').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
