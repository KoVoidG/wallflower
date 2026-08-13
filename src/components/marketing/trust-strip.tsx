'use client';

import { ShieldCheck, CreditCard, Building2, Headphones } from 'lucide-react';

export function TrustStrip() {
  const items = [
    {
      icon: ShieldCheck,
      title: 'Bank-level Security',
      desc: 'Your data is encrypted and protected.',
    },
    {
      icon: CreditCard,
      title: 'No Credit Card Required',
      desc: 'Start free and upgrade when you\'re ready.',
    },
    {
      icon: Building2,
      title: 'Built for SMEs',
      desc: 'Designed specifically for retail businesses.',
    },
    {
      icon: Headphones,
      title: 'Thai Support',
      desc: 'Local support in Thai when you need it.',
    },
  ];

  return (
    <section className="py-10 px-6 sm:px-8 lg:px-12 bg-surface-subtle border-2 border-border-strong rounded-3xl mx-auto max-w-[1400px] my-12 shadow-sm transition-colors text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col items-start space-y-2.5 p-2">
            <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
              <item.icon className="size-6" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-emerald-600 dark:text-emerald-400">{item.title}</h3>
              <p className="text-xs text-text-secondary font-medium leading-relaxed mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
