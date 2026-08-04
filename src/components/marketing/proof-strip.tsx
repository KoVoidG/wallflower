'use client';

import {
  ShoppingBag,
  Store,
  Shirt,
  Utensils,
  Pill,
  Sparkles,
  Laptop,
  Building2,
} from 'lucide-react';

export function ProofStrip() {
  const stores = [
    { icon: ShoppingBag, name: 'Grocery Stores' },
    { icon: Store, name: 'Convenience Stores' },
    { icon: Shirt, name: 'Fashion Shops' },
    { icon: Utensils, name: 'Restaurants' },
    { icon: Pill, name: 'Pharmacies' },
    { icon: Sparkles, name: 'Beauty Stores' },
    { icon: Laptop, name: 'Electronics' },
    { icon: Building2, name: 'Small Chains' },
  ];

  return (
    <section className="py-12 border-b border-border/60 bg-surface-subtle">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-8 text-center">
        <p className="font-display text-xs font-bold uppercase tracking-wider text-text-muted">
          Trusted by retail businesses like yours
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
          {stores.map((s) => (
            <div
              key={s.name}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-surface hover:border-tertiary/40 hover:shadow-sm transition-all cursor-default space-y-2.5"
            >
              <div className="p-2.5 rounded-lg bg-surface-subtle text-tertiary">
                <s.icon className="size-5" />
              </div>
              <span className="text-xs font-bold text-text-primary">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
