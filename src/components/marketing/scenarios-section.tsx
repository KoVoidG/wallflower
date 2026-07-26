'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { H2, BodyLarge } from '@/components/ui/typography';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  UserPlus,
  Tag,
  Megaphone,
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

type ScenarioKey = 'hire' | 'pricing' | 'marketing' | 'equipment' | 'paymentDelay';

const scenarioKeys: { key: ScenarioKey; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'hire', icon: UserPlus },
  { key: 'pricing', icon: Tag },
  { key: 'marketing', icon: Megaphone },
  { key: 'equipment', icon: Wrench },
  { key: 'paymentDelay', icon: Clock },
];

export function ScenariosSection() {
  const t = useTranslations('landing.scenarios');
  const [selectedKey, setSelectedKey] = useState<ScenarioKey>('hire');

  const activeIcon = scenarioKeys.find((s) => s.key === selectedKey)?.icon || UserPlus;
  const ActiveIconComp = activeIcon;

  const selectOptions = scenarioKeys.map((s) => ({
    value: s.key,
    label: t(`items.${s.key}.title`),
  }));

  return (
    <section id="decisions" className="py-16 sm:py-20 lg:py-24 border-b border-border bg-surface-subtle">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <H2 className="text-[26px]/[34px] sm:text-[32px]/[40px] font-[700] text-text-primary tracking-tight">
            {t('title')}
          </H2>
          <BodyLarge className="mt-3 text-text-secondary text-[15px]/[24px] sm:text-[16px]/[26px]">
            {t('subtitle')}
          </BodyLarge>
        </div>

        {/* Mobile Scenario Selector */}
        <div className="block md:hidden mb-6">
          <Select
            value={selectedKey}
            onChange={(val) => setSelectedKey(val as ScenarioKey)}
            options={selectOptions}
            placeholder={t('selectPlaceholder')}
          />
        </div>

        {/* Desktop Scenario Selector Tabs */}
        <div className="hidden md:flex items-center justify-center gap-2 mb-8 flex-wrap">
          {scenarioKeys.map((item) => {
            const isSelected = selectedKey === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedKey(item.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px]/[20px] font-[600] transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-surface border-brand text-brand shadow-xs'
                    : 'bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-surface/50'
                }`}
              >
                <Icon
                  className={`size-4 ${isSelected ? 'text-brand' : 'text-text-muted'}`}
                  aria-hidden="true"
                />
                <span>{t(`items.${item.key}.title`)}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Scenario Inspector Detail Card */}
        <Surface border className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-surface shadow-xs max-w-4xl mx-auto">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
                <ActiveIconComp className="size-5 text-brand" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[12px]/[18px] font-[650] text-brand uppercase tracking-wider block">
                  {t(`items.${selectedKey}.category`)}
                </span>
                <h3 className="text-[20px]/[28px] font-[700] text-text-primary">
                  {t(`items.${selectedKey}.title`)}
                </h3>
              </div>
            </div>
            <Badge variant="neutral">
              {t('decisionTested')}
            </Badge>
          </div>

          {/* Decision description */}
          <div className="p-4 rounded-lg bg-surface-subtle border border-border mb-6">
            <span className="text-[12px]/[18px] font-[600] text-text-muted block mb-1">
              {t('decisionTested')}:
            </span>
            <p className="text-[14px]/[22px] font-[550] text-text-primary">
              {t(`items.${selectedKey}.decision`)}
            </p>
          </div>

          {/* Current vs Projected metrics */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Current state */}
            <div className="p-4 rounded-lg border border-border bg-surface flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px]/[18px] font-[600] text-text-muted">
                  {t('currentState')}
                </span>
                <Badge variant="neutral">{t('currentState')}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[11px]/[16px] text-text-muted block">Runway</span>
                  <span className="text-[18px]/[24px] font-[700] text-text-primary tabular-nums">
                    {t(`items.${selectedKey}.currentRunway`)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px]/[16px] text-text-muted block">Profit</span>
                  <span className="text-[15px]/[22px] font-[600] text-success tabular-nums">
                    {t(`items.${selectedKey}.currentProfit`)}
                  </span>
                </div>
              </div>
            </div>

            {/* Projected state */}
            <div className="p-4 rounded-lg border border-brand/30 bg-brand-soft/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px]/[18px] font-[600] text-brand">
                  {t('projectedState')}
                </span>
                <Badge variant="brand">{t('projectedState')}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[11px]/[16px] text-text-muted block">Runway</span>
                  <span className="text-[18px]/[24px] font-[700] text-text-primary tabular-nums">
                    {t(`items.${selectedKey}.projectedRunway`)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px]/[16px] text-text-muted block">Profit</span>
                  <span className="text-[15px]/[22px] font-[600] text-text-primary tabular-nums">
                    {t(`items.${selectedKey}.projectedProfit`)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk & Recommendation Grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Risk warning */}
            <div className="p-4 rounded-lg border border-amber-300 dark:border-amber-900/60 bg-warning-soft/40 flex items-start gap-3">
              <AlertTriangle className="size-5 text-warning shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-[12px]/[18px] font-[650] text-warning uppercase tracking-wider block">
                  {t('primaryRisk')}
                </span>
                <p className="text-[13px]/[20px] text-text-secondary mt-1">
                  {t(`items.${selectedKey}.risk`)}
                </p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 rounded-lg border border-brand/40 bg-brand-soft/30 flex items-start gap-3">
              <CheckCircle2 className="size-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-[12px]/[18px] font-[650] text-brand uppercase tracking-wider block">
                  {t('recommendation')}
                </span>
                <p className="text-[13px]/[20px] font-[550] text-text-primary mt-1">
                  {t(`items.${selectedKey}.recommendation`)}
                </p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-2">
            <Button asChild size="md" variant="primary">
              <Link href="/simulation">
                {t('exploreCta')}
                <ArrowRight className="size-4 ml-1" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Surface>
      </div>
    </section>
  );
}
