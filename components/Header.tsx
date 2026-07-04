'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Heart,
  User,
  Phone,
  Instagram,
  Facebook,
  Menu,
  X,
  Mail,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { STORE, NAV_LINKS, whatsappLink } from '@/lib/constants';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-cream/95 backdrop-blur-md">
      {/* Utility top bar */}
      <div className="border-b border-black/5 bg-charcoal text-cream/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <a href="https://instagram.com" aria-label="Instagram" className="transition hover:text-ember">
              <Instagram size={14} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="transition hover:text-ember">
              <Facebook size={14} />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 sm:flex transition hover:text-ember"
            >
              <Phone size={13} /> {STORE.phone}
            </a>
            <a
              href={`mailto:${STORE.email}`}
              className="hidden items-center gap-1.5 md:flex transition hover:text-ember"
            >
              <Mail size={13} /> {STORE.email}
            </a>
          </div>
          <div className="flex items-center gap-3 font-semibold uppercase tracking-wider sm:gap-4">
            <Link href="/admin/login" className="transition hover:text-ember">
              Login
            </Link>
            <Link href="/admin/login" className="hidden items-center gap-1 sm:flex transition hover:text-ember">
              <User size={14} /> Profile
            </Link>
            <Link href="/products" className="hidden items-center gap-1 sm:flex transition hover:text-ember">
              <Heart size={14} /> Wishlist
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-1.5 rounded-full bg-ember px-3 py-1.5 text-white transition hover:bg-emberDark"
            >
              <ShoppingBag size={14} />
              <span className="hidden xs:inline">Cart</span>
              {mounted && itemCount > 0 ? ` (${itemCount})` : ''}
            </Link>
          </div>
        </div>
      </div>

      {/* Brand + desktop navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-charcoal transition hover:bg-ember/10 lg:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <Menu size={24} />
        </button>

        <Link href="/" className="group flex-1 text-center lg:flex-none">
          <span className="text-xl font-black uppercase tracking-[0.2em] text-charcoal transition group-hover:text-ember sm:text-2xl lg:text-3xl lg:tracking-[0.35em]">
            {STORE.name}
          </span>
          <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.4em] text-ember sm:text-[10px]">
            {STORE.tagline}
          </span>
        </Link>

        <nav className="hidden flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-[0.15em] text-charcoal/75 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-ember">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="w-10 lg:hidden" aria-hidden />
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div id="mobile-menu" role="dialog" aria-modal="true" className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-cream shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <span className="font-black uppercase tracking-wider text-charcoal">{STORE.name}</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 transition hover:bg-ember/10"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-charcoal transition hover:bg-ember/10 hover:text-ember"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-xl bg-charcoal px-4 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white"
              >
                Cart {mounted && itemCount > 0 ? `(${itemCount})` : ''}
              </Link>
            </nav>
            <div className="mt-auto border-t border-black/10 p-5 text-sm text-charcoal/70">
              <p className="font-semibold text-charcoal">{STORE.location}</p>
              <a href={`tel:+${STORE.phoneE164}`} className="mt-2 block hover:text-ember">
                {STORE.phone}
              </a>
              <a href={`mailto:${STORE.email}`} className="mt-1 block hover:text-ember">
                {STORE.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
