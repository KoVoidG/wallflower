'use client';

import { Link } from '@/lib/i18n/navigation';
import { H2, BodyLarge } from '@/components/ui/typography';
import { FadeIn } from '@/components/motion';

export function CtaSection() {
  return (
    <section id="cta" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <FadeIn>
          <div className="flex flex-col items-center text-center gap-6 max-w-xl mx-auto">
            <H2>Start understanding your business</H2>
            <BodyLarge>
              Turn uncertainty into evidence. Make your next decision with
              clarity, not guesswork.
            </BodyLarge>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-[var(--radius-md)] bg-brand text-white text-[16px]/[24px] font-[550] hover:bg-brand-hover transition-colors mt-2"
            >
              Analyze my business
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
