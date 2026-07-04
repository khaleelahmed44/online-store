import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
