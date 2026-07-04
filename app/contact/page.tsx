import type { Metadata } from 'next';
import ContactPage from './ContactPage';
import { STORE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Contact — ${STORE.name}`,
  description: `Get in touch with ${STORE.name} in ${STORE.location}. Call ${STORE.phone} or email ${STORE.email}.`,
};

export default function Page() {
  return <ContactPage />;
}
