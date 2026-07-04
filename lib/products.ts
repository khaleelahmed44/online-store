import { supabase } from './supabase';
import type { Product } from './types';
import { normalizeToPKR } from './currency';

export { formatPrice, getSalePrice } from './currency';

export function getProductBadge(product: Product): string | null {
  if (product.sale_percentage > 0) return 'Sale!';
  const created = new Date(product.created_at);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  if (created > thirtyDaysAgo) return 'New!';
  return null;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aurora Playhouse',
    description: 'Handcrafted wooden playhouse with premium finishes.',
    price: 52900,
    sale_percentage: 15,
    image_url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80',
    category: 'Playhouses',
    stock_quantity: 12,
    color: '#C5A880',
    tags: ['handcrafted', 'giftable'],
    rating: 4.8,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Studio Rocket',
    description: 'Collectible wooden rocket with magnetic stages.',
    price: 39800,
    sale_percentage: 10,
    image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',
    category: 'Vehicles',
    stock_quantity: 25,
    color: '#FF5722',
    tags: ['best seller'],
    rating: 4.9,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Harbor Blocks',
    description: 'Premium hardwood building blocks.',
    price: 27200,
    sale_percentage: 20,
    image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
    category: 'Building',
    stock_quantity: 30,
    color: '#1E1E1E',
    tags: ['eco'],
    rating: 4.6,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Forest Rider',
    description: 'Outdoor balance bike with adjustable seat.',
    price: 57400,
    sale_percentage: 0,
    image_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
    category: 'Outdoor',
    stock_quantity: 8,
    color: '#FF5722',
    tags: ['outdoor'],
    rating: 4.7,
    created_at: new Date().toISOString(),
  },
];

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    price: normalizeToPKR(Number(row.price)),
    sale_percentage: Number(row.sale_percentage ?? 0),
    image_url: row.image_url ? String(row.image_url) : null,
    category: row.category ? String(row.category) : null,
    stock_quantity: Number(row.stock_quantity ?? 0),
    color: row.color ? String(row.color) : null,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : null,
    rating: row.rating ? Number(row.rating) : null,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return FALLBACK_PRODUCTS;

  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error || !data?.length) return FALLBACK_PRODUCTS;
  return data.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return FALLBACK_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error || !data) {
    return FALLBACK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
  return mapProduct(data);
}

export async function getCategories(): Promise<string[]> {
  const products = await getProducts();
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
  return ['All', ...categories];
}

export async function getAllTags(): Promise<string[]> {
  const products = await getProducts();
  const tags = new Set<string>();
  products.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
  return [...tags];
}
