export const STORE = {
  name: 'Khaleel Store',
  tagline: 'Premium Toys & Gifts',
  location: 'Islamabad, Pakistan',
  email: 'ahmedkhaleel0313@gmail.com',
  phone: '0331-0452744',
  phoneE164: '923310452744',
  whatsappBase: 'https://wa.me/923310452744',
  whatsappMessage:
    "Hi Khaleel Store, I'm interested in your products/services. Could you please share more details?",
} as const;

export function whatsappLink(message?: string): string {
  const text = encodeURIComponent(message ?? STORE.whatsappMessage);
  return `${STORE.whatsappBase}?text=${text}`;
}

/** @deprecated Use whatsappLink() — kept for backward compatibility */
export const whatsappUrl = whatsappLink();

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/products', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const LEGACY_USD_PRICE_THRESHOLD = 1000;
export const USD_TO_PKR = 280;

export const PRICE_FILTER = {
  min: 1000,
  max: 100000,
  defaultMax: 100000,
} as const;
