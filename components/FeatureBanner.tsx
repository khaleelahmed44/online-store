import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const features = [
  {
    title: 'Safe & Handmade',
    description: 'Every piece is crafted with child-safe materials and artisan attention to detail.',
    icon: ShieldCheck,
    accent: 'bg-ember',
  },
  {
    title: 'Fast Delivery',
    description: 'Express delivery across Islamabad and major cities in Pakistan.',
    icon: Truck,
    accent: 'bg-charcoal',
  },
  {
    title: 'Free Returns',
    description: 'Not delighted? Return within 7 days for a hassle-free refund.',
    icon: RotateCcw,
    accent: 'bg-emberDark',
  },
];

export default function FeatureBanner() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
      {features.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className={`rounded-[1.5rem] ${item.accent} p-6 text-white shadow-glow`}
          >
            <Icon className="mb-4" size={28} />
            <h3 className="text-lg font-bold uppercase tracking-wide">{item.title}</h3>
            <p className="mt-2 text-sm text-white/80">{item.description}</p>
          </div>
        );
      })}
    </section>
  );
}
