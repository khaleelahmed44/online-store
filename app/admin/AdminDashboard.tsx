'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { DollarSign, Package, TrendingUp, AlertTriangle, LogOut, Save, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getSalePrice, formatPrice, normalizeToPKR } from '@/lib/currency';
import { STORE } from '@/lib/constants';
import type { Product } from '@/lib/types';

type Analytics = {
  totalRevenue: number;
  activeOrders: number;
  totalOrders: number;
  conversionRate: number;
  totalProducts: number;
  lowStock: number;
};

export default function AdminDashboard() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [editing, setEditing] = useState<Record<string, Partial<Product>>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) {
      setProducts(
        data.map((r) => ({
          ...r,
          price: normalizeToPKR(Number(r.price)),
          sale_percentage: Number(r.sale_percentage ?? 0),
          stock_quantity: Number(r.stock_quantity),
          rating: Number(r.rating ?? 5),
        }))
      );
    }

    try {
      const res = await fetch('/api/admin');
      if (res.ok) setAnalytics(await res.json());
    } catch {
      /* API optional */
    }
  };

  const handleFieldChange = (id: string, field: keyof Product, value: string | number) => {
    setEditing((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const getValue = (product: Product, field: keyof Product) => {
    const edit = editing[product.id];
    if (edit && field in edit) return edit[field];
    return product[field];
  };

  const saveProduct = async (product: Product) => {
    setSaving(product.id);
    const updates = editing[product.id] || {};
    const payload = { id: product.id, ...updates };

    const res = await fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, ...updated, price: Number(updated.price), sale_percentage: Number(updated.sale_percentage) }
            : p
        )
      );
      setEditing((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    }
    setSaving(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  const stats = [
    { label: 'Total Revenue', value: formatPrice(analytics?.totalRevenue ?? 0), icon: DollarSign, color: 'text-emerald-600' },
    { label: 'Active Orders', value: String(analytics?.activeOrders ?? 0), icon: Package, color: 'text-ember' },
    { label: 'Conversion Rate', value: `${analytics?.conversionRate ?? 0}%`, icon: TrendingUp, color: 'text-sky-600' },
    { label: 'Low Stock Items', value: String(analytics?.lowStock ?? 0), icon: AlertTriangle, color: 'text-amber-600' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-charcoal">{STORE.name} — Admin</h1>
          <p className="text-sm text-charcoal/60">Manage inventory, pricing, and view sales analytics</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:border-ember hover:text-ember"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50">{label}</p>
              <Icon size={18} className={color} />
            </div>
            <p className="mt-2 text-2xl font-black text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-black/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <h2 className="text-lg font-black text-charcoal">Product Inventory</h2>
          <span className="text-xs text-charcoal/50">{products.length} products</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-cream/50 text-left text-xs font-bold uppercase tracking-wider text-charcoal/50">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Sale %</th>
                <th className="px-4 py-3">Display Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const price = Number(getValue(product, 'price'));
                const salePct = Number(getValue(product, 'sale_percentage'));
                const displayPrice = getSalePrice(price, salePct);
                const hasChanges = !!editing[product.id];

                return (
                  <tr key={product.id} className="border-b border-black/5 hover:bg-cream/30">
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                        {product.image_url && (
                          <Image
                            src={String(getValue(product, 'image_url') || product.image_url)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={String(getValue(product, 'name') ?? '')}
                        onChange={(e) => handleFieldChange(product.id, 'name', e.target.value)}
                        className="w-full min-w-[120px] rounded-lg border border-transparent bg-transparent px-2 py-1 outline-none focus:border-ember"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => handleFieldChange(product.id, 'price', Number(e.target.value))}
                        className="w-20 rounded-lg border border-black/10 px-2 py-1 outline-none focus:border-ember"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={salePct}
                        onChange={(e) => handleFieldChange(product.id, 'sale_percentage', Number(e.target.value))}
                        className="w-16 rounded-lg border border-black/10 px-2 py-1 outline-none focus:border-ember"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-ember">{formatPrice(displayPrice)}</span>
                      {salePct > 0 && (
                        <span className="ml-1 rounded bg-ember/10 px-1.5 py-0.5 text-[10px] font-bold text-ember">SALE!</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        value={Number(getValue(product, 'stock_quantity'))}
                        onChange={(e) => handleFieldChange(product.id, 'stock_quantity', Number(e.target.value))}
                        className="w-16 rounded-lg border border-black/10 px-2 py-1 outline-none focus:border-ember"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={String(getValue(product, 'category') ?? '')}
                        onChange={(e) => handleFieldChange(product.id, 'category', e.target.value)}
                        className="w-full min-w-[80px] rounded-lg border border-transparent bg-transparent px-2 py-1 outline-none focus:border-ember"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => saveProduct(product)}
                        disabled={!hasChanges || saving === product.id}
                        className="flex items-center gap-1 rounded-full bg-charcoal px-3 py-1.5 text-xs font-bold text-white transition hover:bg-ember disabled:opacity-30"
                      >
                        <Save size={12} /> {saving === product.id ? '...' : 'Save'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="py-16 text-center text-charcoal/50">
            <Plus size={32} className="mx-auto mb-2 opacity-30" />
            <p>No products found. Run the Supabase schema seed or add products via the API.</p>
          </div>
        )}
      </div>
    </div>
  );
}
