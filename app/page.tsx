import Link from 'next/link';
import { getProducts } from '@/lib/products';
import HeroSlider from '@/components/HeroSlider';
import FeatureBanner from '@/components/FeatureBanner';
import TrustBar from '@/components/TrustBar';
import ProductCard from '@/components/ProductCard';

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <div className="bg-cream">
      <HeroSlider products={products.slice(0, 4)} />
      <FeatureBanner />
      <TrustBar />

      {/* Shop by Category */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black uppercase tracking-wide text-charcoal">Shop by Category</h2>
          <p className="mt-2 text-charcoal/60">Discover the perfect toy tailored for every adventure</p>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-ember" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {['Playhouses', 'Vehicles', 'Building'].map((cat, i) => {
            const bg = i === 0 ? 'bg-charcoal' : 'bg-ember';
            return (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                className={`group relative overflow-hidden rounded-[1.5rem] ${bg} p-8 text-white transition hover:shadow-glow`}
              >
                <h3 className="text-2xl font-black uppercase">{cat}</h3>
                <span className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-charcoal transition group-hover:bg-charcoal group-hover:text-white">
                  Shop Now
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Signature pieces */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Best picks</p>
            <h2 className="text-3xl font-black text-charcoal">Signature Pieces</h2>
          </div>
          <Link href="/products" className="text-sm font-bold uppercase tracking-wider text-ember transition hover:text-emberDark">
            View All
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
