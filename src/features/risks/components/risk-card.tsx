'use client';

import { useState } from 'react';
import { ChevronDown, AlertTriangle, AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { Expand } from '@/components/motion';
import type { DetectedRiskData } from '@/features/risks/adapters/risks.adapter';

interface RiskCardProps {
  risk: DetectedRiskData;
  t: {
    whatHappened: string;
    whyMatters: string;
    howSerious: string;
    whatNext: string;
    severity: string;
    probability: string;
    impact: string;
    status: string;
    mitigate: string;
    expand: string;
    collapse: string;
  };
  /** Resolved i18n strings for this risk's ruleId */
  ruleText: {
    title: string;
    whatHappened: string;
    whyMatters: string;
    howSerious: string;
    whatNext: string;
  };
  severityLabel: string;
  probabilityLabel: string;
  impactLabel: string;
  statusLabel: string;
  categoryLabel: string;
}

function interpolate(template: string, values: Record<string, number | string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const val = values[key];
    if (val === undefined) return `{${key}}`;
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return String(val);
  });
}

const severityConfig = {
  critical: {
    variant: 'danger' as const,
    icon: <AlertTriangle className="size-3.5" />,
    borderClass: 'border-l-danger',
  },
  warning: {
    variant: 'warning' as const,
    icon: <AlertCircle className="size-3.5" />,
    borderClass: 'border-l-warning',
  },
};

export function RiskCard({
  risk,
  t,
  ruleText,
  severityLabel,
  probabilityLabel,
  impactLabel,
  statusLabel,
  categoryLabel,
}: RiskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = severityConfig[risk.severity];
  const panelId = `risk-panel-${risk.id}`;
  const isMitigated = risk.status === 'mitigated';

  return (
    <Surface
      variant="default"
      border
      className={cn(
        'p-0 overflow-hidden border-l-4 transition-colors print:border-l-2',
        config.borderClass,
        isMitigated && 'opacity-70'
      )}
    >
      {/* Header — clickable to toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between gap-3 p-4 text-left cursor-pointer',
          'hover:bg-surface-subtle/50 transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand'
        )}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        aria-label={`${ruleText.title}. ${isExpanded ? t.collapse : t.expand}`}
      >
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={config.variant} icon={config.icon}>
              {severityLabel}
            </Badge>
            <Badge variant="default">
              {categoryLabel}
            </Badge>
            {isMitigated && (
              <Badge variant="success" icon={<CheckCircle2 className="size-3.5" />}>
                {statusLabel}
              </Badge>
            )}
          </div>
          {/* Title */}
          <h3 className="text-[15px]/[22px] font-[600] text-text-primary truncate">
            {ruleText.title}
          </h3>
          {/* Brief preview when collapsed */}
          {!isExpanded && (
            <p className="text-[13px]/[20px] text-text-secondary line-clamp-1">
              {interpolate(ruleText.whatHappened, risk.evidenceValues)}
            </p>
          )}
        </div>
        {/* Expand icon — hidden in print */}
        <ChevronDown
          className={cn(
            'size-5 text-text-muted shrink-0 transition-transform duration-200 print:hidden',
            isExpanded && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Expandable detail panel — always expanded in print */}
      <div className="print:!block">
        <Expand open={isExpanded}>
          <div id={panelId} role="region" className="px-4 pb-4 space-y-4 border-t border-border dark:border-border-strong pt-4">
            {/* Question 1: What happened? */}
            <div>
              <h4 className="text-[13px]/[18px] font-[600] text-text-primary mb-1">
                {t.whatHappened}
              </h4>
              <p className="text-[13px]/[20px] text-text-secondary">
                {interpolate(ruleText.whatHappened, risk.evidenceValues)}
              </p>
            </div>

            {/* Question 2: Why does it matter? */}
            <div>
              <h4 className="text-[13px]/[18px] font-[600] text-text-primary mb-1">
                {t.whyMatters}
              </h4>
              <p className="text-[13px]/[20px] text-text-secondary">
                {interpolate(ruleText.whyMatters, risk.evidenceValues)}
              </p>
            </div>

            {/* Question 3: How serious is it? */}
            <div>
              <h4 className="text-[13px]/[18px] font-[600] text-text-primary mb-1">
                {t.howSerious}
              </h4>
              <p className="text-[13px]/[20px] text-text-secondary mb-2">
                {interpolate(ruleText.howSerious, risk.evidenceValues)}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]/[18px]">
                <span>
                  <span className="text-text-muted">{t.severity}:</span>{' '}
                  <span className={cn('font-[550]', risk.severity === 'critical' ? 'text-danger' : 'text-warning')}>
                    {severityLabel}
                  </span>
                </span>
                <span>
                  <span className="text-text-muted">{t.probability}:</span>{' '}
                  <span className="font-[550] text-text-primary">{probabilityLabel}</span>
                </span>
                <span>
                  <span className="text-text-muted">{t.impact}:</span>{' '}
                  <span className="font-[550] text-text-primary">{impactLabel}</span>
                </span>
              </div>
            </div>

            {/* Question 4: What can I do next? */}
            <div>
              <h4 className="text-[13px]/[18px] font-[600] text-text-primary mb-1">
                {t.whatNext}
              </h4>
              <p className="text-[13px]/[20px] text-text-secondary">
                {interpolate(ruleText.whatNext, risk.evidenceValues)}
              </p>
              {risk.mitigationScenario && !isMitigated && (
                <a
                  href={`/simulations/new?scenario=${risk.mitigationScenario}&risk=${risk.ruleId}`}
                  className={cn(
                    'inline-flex items-center gap-1.5 mt-2 px-3 py-1.5',
                    'text-[13px] font-[550] text-brand rounded-[var(--radius-md)]',
                    'border border-brand/30 hover:bg-brand-soft transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand',
                    'print:hidden'
                  )}
                >
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  {t.mitigate}
                </a>
              )}
            </div>
          </div>
        </Expand>
      </div>

      {/* Print-only always-expanded version */}
      <div className="hidden print:block px-4 pb-4 space-y-3 border-t border-border pt-3">
        <div>
          <span className="text-[11px] font-[600]">{t.whatHappened}</span>
          <p className="text-[11px]">{interpolate(ruleText.whatHappened, risk.evidenceValues)}</p>
        </div>
        <div>
          <span className="text-[11px] font-[600]">{t.whyMatters}</span>
          <p className="text-[11px]">{interpolate(ruleText.whyMatters, risk.evidenceValues)}</p>
        </div>
        <div>
          <span className="text-[11px] font-[600]">{t.howSerious}</span>
          <p className="text-[11px]">{interpolate(ruleText.howSerious, risk.evidenceValues)}</p>
        </div>
        <div>
          <span className="text-[11px] font-[600]">{t.whatNext}</span>
          <p className="text-[11px]">{interpolate(ruleText.whatNext, risk.evidenceValues)}</p>
        </div>
      </div>
    </Surface>
  );
}
