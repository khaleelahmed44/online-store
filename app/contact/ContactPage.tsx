'use client';

import { useState } from 'react';
import { MapPin, Mail, Phone, Send, CheckCircle } from 'lucide-react';
import { STORE, whatsappLink } from '@/lib/constants';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
    );
    window.open(
      `mailto:${STORE.email}?subject=${encodeURIComponent(`Contact from ${form.name} — ${STORE.name}`)}&body=${body}`,
      '_blank'
    );
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Get in Touch</p>
      <h1 className="mt-2 text-3xl font-black text-charcoal sm:text-4xl">Contact {STORE.name}</h1>
      <p className="mt-4 text-charcoal/70">
        Have a question about an order or product? We&apos;d love to hear from you.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
            <MapPin className="mb-3 text-ember" size={24} />
            <h3 className="font-bold text-charcoal">Location</h3>
            <p className="mt-1 text-sm text-charcoal/70">{STORE.location}</p>
          </div>
          <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
            <Mail className="mb-3 text-ember" size={24} />
            <h3 className="font-bold text-charcoal">Email</h3>
            <a href={`mailto:${STORE.email}`} className="mt-1 block break-all text-sm text-ember hover:underline">
              {STORE.email}
            </a>
          </div>
          <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
            <Phone className="mb-3 text-ember" size={24} />
            <h3 className="font-bold text-charcoal">Phone / WhatsApp</h3>
            <a href={`tel:+${STORE.phoneE164}`} className="mt-1 block text-sm text-charcoal/70 hover:text-ember">
              {STORE.phone}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-[#25D366] hover:underline"
            >
              Chat on WhatsApp →
            </a>
          </div>
        </div>

        {sent ? (
          <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-black/10 bg-white p-10 text-center shadow-sm">
            <CheckCircle size={48} className="text-emerald-500" />
            <h3 className="mt-4 text-xl font-bold text-charcoal">Message Ready!</h3>
            <p className="mt-2 text-sm text-charcoal/60">
              Your email client should have opened. You can also reach us instantly on WhatsApp.
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 rounded-full bg-[#25D366] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#20BD5A]"
            >
              Open WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-lg font-bold text-charcoal">Send a Message</h2>
            <div className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text', required: true },
                { key: 'email', label: 'Email', type: 'email', required: true },
                { key: 'phone', label: 'Phone', type: 'tel', required: false },
              ].map(({ key, label, type, required }) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                    {label}
                  </label>
                  <input
                    type={type}
                    required={required}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-ember"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full resize-none rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-ember"
                  placeholder="How can we help you?"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full bg-charcoal py-3.5 font-bold uppercase tracking-wider text-white transition hover:bg-ember"
            >
              <Send size={16} /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
