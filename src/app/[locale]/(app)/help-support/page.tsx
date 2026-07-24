'use client';

import { useTranslations } from 'next-intl';
import {
  LifeBuoy,
  HelpCircle,
  BookOpen,
  FlaskConical,
  Mail,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { replayProductTour } from '@/components/app-shell/product-tour';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { SectionTitle, CardTitle } from '@/components/ui/typography';

export default function HelpSupportPage() {
  const t = useTranslations('helpSupportPage');

  return (
    <AppPage>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Header */}
        <PageHeader
          title={
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <LifeBuoy className="size-5" />
              </div>
              <span>{t('title')}</span>
            </div>
          }
          description={t('subtitle')}
        />

        {/* Quick Assistance Cards Grid */}
        <div className="space-y-4">
          <SectionTitle>{t('quickLinksTitle')}</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FAQ Card */}
            <Link
              href="/faq"
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 hover:border-brand/40 hover:bg-surface-subtle transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-brand-soft text-brand">
                    <HelpCircle className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
                </div>
                <CardTitle className="group-hover:text-brand transition-colors">
                  {t('cards.faq.title')}
                </CardTitle>
                <p className="text-xs sm:text-sm text-text-secondary">
                  {t('cards.faq.desc')}
                </p>
              </div>
            </Link>

            {/* Guide Card */}
            <Link
              href="/business-health"
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 hover:border-brand/40 hover:bg-surface-subtle transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-brand-soft text-brand">
                    <BookOpen className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
                </div>
                <CardTitle className="group-hover:text-brand transition-colors">
                  {t('cards.guide.title')}
                </CardTitle>
                <p className="text-xs sm:text-sm text-text-secondary">
                  {t('cards.guide.desc')}
                </p>
              </div>
            </Link>

            {/* Simulation Guide */}
            <Link
              href="/simulations"
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 hover:border-brand/40 hover:bg-surface-subtle transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-brand-soft text-brand">
                    <FlaskConical className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
                </div>
                <CardTitle className="group-hover:text-brand transition-colors">
                  {t('cards.simulations.title')}
                </CardTitle>
                <p className="text-xs sm:text-sm text-text-secondary">
                  {t('cards.simulations.desc')}
                </p>
              </div>
            </Link>

            {/* Contact Support */}
            <a
              href="mailto:support@wallflower.app"
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 hover:border-brand/40 hover:bg-surface-subtle transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-brand-soft text-brand">
                    <Mail className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
                </div>
                <CardTitle className="group-hover:text-brand transition-colors">
                  {t('cards.contact.title')}
                </CardTitle>
                <p className="text-xs sm:text-sm text-text-secondary">
                  {t('cards.contact.desc')}
                </p>
              </div>
            </a>

            {/* Replay Product Tour */}
            <button
              type="button"
              onClick={replayProductTour}
              className="group flex flex-col justify-between text-left rounded-xl border border-brand/40 bg-brand-soft/20 p-5 hover:border-brand hover:bg-brand-soft/40 transition-all cursor-pointer md:col-span-2"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-brand text-white font-bold">
                    <Sparkles className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-brand group-hover:translate-x-0.5 transition-transform" />
                </div>
                <CardTitle className="group-hover:text-brand transition-colors">
                  Replay Product Tour
                </CardTitle>
                <p className="text-xs sm:text-sm text-text-secondary">
                  Restart the guided tour of Business Pulse, KPIs, Risks, Simulations, and Support.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Direct Help Info Box */}
        <div className="rounded-xl border border-border bg-surface-subtle p-5 space-y-4">
          <div>
            <CardTitle>{t('contactBox.title')}</CardTitle>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {t('contactBox.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-border/50">
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 text-brand shrink-0" />
              <div>
                <span className="block text-[11px] text-text-muted">{t('contactBox.emailLabel')}</span>
                <a
                  href="mailto:support@wallflower.app"
                  className="font-semibold text-text-primary hover:text-brand transition-colors"
                >
                  {t('contactBox.emailValue')}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="size-4 text-brand shrink-0" />
              <div>
                <span className="block text-[11px] text-text-muted">{t('contactBox.hoursLabel')}</span>
                <span className="font-semibold text-text-primary">{t('contactBox.hoursValue')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppPage>
  );
}
