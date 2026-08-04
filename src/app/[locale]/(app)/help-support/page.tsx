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
import { AppPage } from '@/components/ui/layout';
import { Card } from '@/components/ui/card';

export default function HelpSupportPage() {
  const t = useTranslations('helpSupportPage');

  return (
    <AppPage>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto text-left animate-in fade-in duration-200">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-tertiary/15 text-tertiary border border-tertiary/30 shrink-0 shadow-2xs">
              <LifeBuoy className="size-6" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                {t('title')}
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary font-medium">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Assistance Cards Grid */}
        <div className="space-y-4">
          <h2 className="font-display text-xs font-bold uppercase tracking-wider text-text-muted">
            {t('quickLinksTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
            {/* FAQ Card */}
            <Link
              href="/faq"
              className="group flex flex-col justify-between rounded-2xl border-2 border-border-strong bg-surface p-5 hover:border-tertiary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-surface-hover text-text-primary border border-border/80 shadow-2xs shrink-0 group-hover:bg-emerald-500/15 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                    <HelpCircle className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-text-muted group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-text-primary group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {t('cards.faq.title')}
                  </h3>
                  <p className="text-xs text-text-secondary font-medium leading-relaxed mt-1">
                    {t('cards.faq.desc')}
                  </p>
                </div>
              </div>
            </Link>

            {/* Guide Card */}
            <Link
              href="/business-health"
              className="group flex flex-col justify-between rounded-2xl border-2 border-border-strong bg-surface p-5 hover:border-tertiary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-surface-hover text-text-primary border border-border/80 shadow-2xs shrink-0 group-hover:bg-emerald-500/15 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                    <BookOpen className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-text-muted group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-text-primary group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {t('cards.guide.title')}
                  </h3>
                  <p className="text-xs text-text-secondary font-medium leading-relaxed mt-1">
                    {t('cards.guide.desc')}
                  </p>
                </div>
              </div>
            </Link>

            {/* Simulation Guide */}
            <Link
              href="/simulations"
              className="group flex flex-col justify-between rounded-2xl border-2 border-border-strong bg-surface p-5 hover:border-tertiary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-surface-hover text-text-primary border border-border/80 shadow-2xs shrink-0 group-hover:bg-emerald-500/15 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                    <FlaskConical className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-text-muted group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-text-primary group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {t('cards.simulations.title')}
                  </h3>
                  <p className="text-xs text-text-secondary font-medium leading-relaxed mt-1">
                    {t('cards.simulations.desc')}
                  </p>
                </div>
              </div>
            </Link>

            {/* Contact Support */}
            <a
              href="mailto:support@wallflower.app"
              className="group flex flex-col justify-between rounded-2xl border-2 border-border-strong bg-surface p-5 hover:border-tertiary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-surface-hover text-text-primary border border-border/80 shadow-2xs shrink-0 group-hover:bg-emerald-500/15 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                    <Mail className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-text-muted group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-text-primary group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {t('cards.contact.title')}
                  </h3>
                  <p className="text-xs text-text-secondary font-medium leading-relaxed mt-1">
                    {t('cards.contact.desc')}
                  </p>
                </div>
              </div>
            </a>

            {/* Replay Product Tour Card */}
            <button
              type="button"
              onClick={replayProductTour}
              className="group flex flex-col justify-between text-left rounded-2xl border-2 border-tertiary/40 bg-tertiary/10 p-5 hover:border-tertiary hover:shadow-xl hover:shadow-tertiary/10 transition-all duration-200 cursor-pointer md:col-span-2 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-tertiary text-on-primary font-bold shadow-2xs">
                    <Sparkles className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-tertiary group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-text-primary group-hover:text-tertiary transition-colors">
                    Replay Product Tour
                  </h3>
                  <p className="text-xs text-text-secondary font-medium leading-relaxed mt-1">
                    Restart the guided tour of Business Pulse, KPIs, Risks, Simulations, and Support.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Direct Help Info Card */}
        <Card className="p-5 border-border-strong bg-surface space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">{t('contactBox.title')}</h3>
            <p className="text-xs text-text-secondary font-medium mt-0.5">
              {t('contactBox.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-subtle">
              <Mail className="size-4 text-tertiary shrink-0" />
              <div>
                <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('contactBox.emailLabel')}</span>
                <a
                  href="mailto:support@wallflower.app"
                  className="font-bold text-text-primary hover:text-tertiary transition-colors"
                >
                  {t('contactBox.emailValue')}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-subtle">
              <Clock className="size-4 text-tertiary shrink-0" />
              <div>
                <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('contactBox.hoursLabel')}</span>
                <span className="font-bold text-text-primary">{t('contactBox.hoursValue')}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppPage>
  );
}
