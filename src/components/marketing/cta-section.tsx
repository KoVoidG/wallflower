'use client';

import { Link } from '@/lib/i18n/navigation';

export function CtaSection() {
  return (
    <section className="py-20 bg-background text-center">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12 space-y-6">
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
          Ready to make smarter business decisions?
        </h2>
        <p className="text-base sm:text-lg text-text-secondary font-medium max-w-xl mx-auto">
          Start building your digital business model today.
        </p>

        <div className="pt-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </section>
  );
}
