import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Mail, Phone, ShieldCheck, Truck, Heart } from 'lucide-react';
import { STORE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About — ${STORE.name}`,
  description: `Learn about ${STORE.name}, your trusted toy store in ${STORE.location}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Our Story</p>
      <h1 className="mt-2 text-4xl font-black text-charcoal">About {STORE.name}</h1>
      <p className="mt-6 text-lg leading-relaxed text-charcoal/70">
        Welcome to {STORE.name} — Islamabad&apos;s destination for premium toys, gifts, and playful treasures.
        We handpick every product for quality, safety, and joy, serving families across Pakistan with care
        and fast local delivery.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, title: 'Safe & Trusted', text: 'Every item meets strict safety standards for peace of mind.' },
          { icon: Truck, title: 'Nationwide Delivery', text: 'Fast shipping across Islamabad and all major cities in Pakistan.' },
          { icon: Heart, title: 'Family First', text: 'Built by parents, for parents — quality you can count on.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
            <Icon className="mb-3 text-ember" size={28} />
            <h3 className="font-bold text-charcoal">{title}</h3>
            <p className="mt-2 text-sm text-charcoal/60">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-[1.5rem] bg-charcoal p-8 text-cream">
        <h2 className="text-xl font-black">Visit Us</h2>
        <div className="mt-4 space-y-3 text-sm text-cream/80">
          <p className="flex items-center gap-2"><MapPin size={16} className="text-ember" /> {STORE.location}</p>
          <p className="flex items-center gap-2"><Mail size={16} className="text-ember" /> {STORE.email}</p>
          <p className="flex items-center gap-2"><Phone size={16} className="text-ember" /> {STORE.phone}</p>
        </div>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-ember px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-emberDark"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
