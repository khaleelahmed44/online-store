'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, CreditCard } from 'lucide-react';
import { STORE, whatsappLink } from '@/lib/constants';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer className="mt-16">
      <div className="relative">
        <svg viewBox="0 0 1440 40" fill="none" className="w-full text-charcoal" preserveAspectRatio="none">
          <path d="M0 40L60 30C120 20 240 0 360 0C480 0 600 20 720 25C840 30 960 20 1080 15C1200 10 1320 10 1380 10L1440 10V0H0V40Z" fill="currentColor" className="text-charcoal" />
        </svg>
      </div>
      <div className="bg-charcoal py-12 text-sm text-cream/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <h3 className="mb-3 text-lg font-black uppercase tracking-wider text-white">{STORE.name}</h3>
            <p>{STORE.location}</p>
            <a href={`mailto:${STORE.email}`} className="mt-2 block transition hover:text-ember">
              {STORE.email}
            </a>
            <a href={`tel:+${STORE.phoneE164}`} className="mt-1 block transition hover:text-ember">
              {STORE.phone}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-semibold text-[#25D366] transition hover:underline"
            >
              WhatsApp Us
            </a>
          </div>
          <div>
            <h3 className="mb-3 font-bold uppercase tracking-wider text-white">Categories</h3>
            <ul className="space-y-2">
              {['Playhouses', 'Vehicles', 'Building', 'Outdoor'].map((c) => (
                <li key={c}>
                  <Link href={`/products?category=${c}`} className="transition hover:text-ember">{c}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-bold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="transition hover:text-ember">About Us</Link></li>
              <li><Link href="/products" className="transition hover:text-ember">Shop</Link></li>
              <li><Link href="/contact" className="transition hover:text-ember">Contact</Link></li>
              <li><Link href="/cart" className="transition hover:text-ember">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-bold uppercase tracking-wider text-white">Newsletter</h3>
            <p className="mb-3">Sign up for new arrivals and exclusive offers.</p>
            {subscribed ? (
              <p className="rounded-full bg-ember/20 px-4 py-2 text-sm font-semibold text-ember">
                Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="min-w-0 flex-1 rounded-full bg-charcoal/50 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ember"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-ember px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emberDark"
                >
                  →
                </button>
              </form>
            )}
            <div className="mt-4 flex gap-3">
              <a href="https://instagram.com" aria-label="Instagram"><Instagram size={18} className="transition hover:text-ember" /></a>
              <a href="https://facebook.com" aria-label="Facebook"><Facebook size={18} className="transition hover:text-ember" /></a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-4 pt-6 sm:px-6 lg:px-8">
          <p className="text-xs">© {new Date().getFullYear()} {STORE.name}. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <Link href="/contact" className="transition hover:text-ember">Privacy Policy</Link>
            <Link href="/contact" className="transition hover:text-ember">Terms & Conditions</Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-cream/50">
            <CreditCard size={14} /> Cash on Delivery · Bank Transfer
          </div>
        </div>
      </div>
    </footer>
  );
}
