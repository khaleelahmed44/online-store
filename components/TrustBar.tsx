'use client';

import { STORE, whatsappLink } from '@/lib/constants';

const trustItems = [
  { label: 'Quality Guaranteed' },
  { label: 'Secure Payment' },
  { label: `Based in ${STORE.location.split(',')[0]}` },
  { label: '7-Day Returns' },
];

export default function TrustBar() {
  return (
    <section className="border-y border-black/5 bg-white py-4 sm:py-5">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-8 sm:px-6 lg:gap-12 lg:px-8">
        {trustItems.map(({ label }) => (
          <div key={label} className="flex items-center justify-center gap-2 text-center text-xs font-semibold text-charcoal sm:text-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}

export function HelpdeskBanner() {
  return (
    <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[1.5rem] bg-sky-100 p-6 sm:flex-row sm:p-8">
      <div className="text-center sm:text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-sky-600">Support</p>
        <h3 className="mt-1 text-lg font-black text-charcoal sm:text-xl">
          Our team is always ready to help!
        </h3>
        <p className="mt-1 text-sm text-charcoal/60">{STORE.phone} · {STORE.email}</p>
      </div>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#20BD5A] sm:w-auto"
      >
        Chat on WhatsApp
      </a>
    </div>
  );
}
