import { Suspense } from 'react';
import { getProducts, getCategories, getAllTags } from '@/lib/products';
import ProductsPageClient from './ProductsPageClient';

export default async function ProductsPage() {
  const [products, categories, tags] = await Promise.all([
    getProducts(),
    getCategories(),
    getAllTags(),
  ]);

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading shop...</div>}>
      <ProductsPageClient
        initialProducts={products}
        categories={categories}
        tags={tags}
      />
    </Suspense>
  );
}
