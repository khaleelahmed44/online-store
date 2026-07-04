import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { STORE } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${STORE.name} — Premium Toys & Gifts | Islamabad, Pakistan`,
  description: `Shop premium toys and gifts at ${STORE.name} in Islamabad, Pakistan. Fast delivery, secure checkout, and friendly support via WhatsApp.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream text-charcoal`}>
        <Header />
        <main className="min-h-[60vh] pb-20">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
