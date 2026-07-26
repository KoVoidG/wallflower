'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { useReducedMotion } from '@/components/motion';
import { RotateCcw, AlertTriangle, CheckCircle2, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

export function ProductPreview() {
  const t = useTranslations('landing.heroDemo');
  const prefersReduced = useReducedMotion();
  const [step, setStep] = useState<'baseline' | 'decision' | 'impact' | 'recommendation'>('baseline');
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (prefersReduced || hasAnimated) return;

    // Controlled single sequence: baseline -> decision -> impact -> recommendation
    const t1 = setTimeout(() => setStep('decision'), 800);
    const t2 = setTimeout(() => setStep('impact'), 1700);
    const t3 = setTimeout(() => {
      setStep('recommendation');
      setHasAnimated(true);
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [prefersReduced, hasAnimated]);

  const handleReplay = () => {
    setHasAnimated(false);
    setStep('baseline');
    setTimeout(() => setStep('decision'), 700);
    setTimeout(() => setStep('impact'), 1500);
    setTimeout(() => {
      setStep('recommendation');
      setHasAnimated(true);
    }, 2400);
  };

  const isDecisionApplied = step === 'decision' || step === 'impact' || step === 'recommendation';
  const isImpactVisible = step === 'impact' || step === 'recommendation';
  const isRecVisible = step === 'recommendation';

  return (
    <Surface border className="p-5 md:p-6 rounded-[var(--radius-lg)] shadow-xs bg-surface relative">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Badge variant="brand">{t('badge')}</Badge>
          <span className="text-[12px]/[18px] text-text-muted hidden sm:inline">
            Wallflower Diagnostic Engine
          </span>
        </div>
        <button
          type="button"
          onClick={handleReplay}
          className="inline-flex items-center gap-1 text-[12px] font-[500] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          title={t('replayText')}
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          <span>Replay</span>
        </button>
      </div>

      {/* Decision Card */}
      <div className="flex flex-col gap-4">
        {/* Decision Banner */}
        <div className="p-3.5 rounded-lg bg-surface-subtle border border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-md bg-brand-soft flex items-center justify-center shrink-0">
              <UserPlus className="size-4 text-brand" aria-hidden="true" />
            </div>
            <div>
              <div className="text-[11px]/[16px] font-[600] text-text-muted uppercase tracking-wider">
                {t('decisionLabel')}
              </div>
              <div className="text-[14px]/[20px] font-[600] text-text-primary">
                {t('decisionName')}
              </div>
            </div>
          </div>
          <Badge variant={isDecisionApplied ? 'warning' : 'neutral'}>
            {isDecisionApplied ? 'Simulating' : 'Baseline'}
          </Badge>
        </div>

        {/* Financial Metrics Comparison */}
        <div className="grid grid-cols-2 gap-3">
          {/* Baseline Panel */}
          <div className="p-3.5 rounded-lg border border-border bg-surface flex flex-col gap-2">
            <span className="text-[12px]/[18px] font-[600] text-text-muted">
              {t('beforeLabel')}
            </span>
            <div className="flex flex-col gap-1.5">
              <div>
                <span className="text-[11px]/[16px] text-text-muted block">
                  {t('runwayLabel')}
                </span>
                <span className="text-[18px]/[24px] font-[650] text-text-primary tabular-nums">
                  8.2 months
                </span>
              </div>
              <div>
                <span className="text-[11px]/[16px] text-text-muted block">
                  {t('profitLabel')}
                </span>
                <span className="text-[15px]/[22px] font-[600] text-success tabular-nums">
                  ฿35,000
                </span>
              </div>
            </div>
          </div>

          {/* After Decision Panel */}
          <div
            className={`p-3.5 rounded-lg border transition-all duration-300 flex flex-col gap-2 ${
              isImpactVisible
                ? 'border-amber-300 dark:border-amber-900/60 bg-warning-soft/30'
                : 'border-border bg-surface opacity-70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px]/[18px] font-[600] text-text-muted">
                {t('afterLabel')}
              </span>
              {isImpactVisible && (
                <AlertTriangle className="size-3.5 text-warning shrink-0" aria-hidden="true" />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <div>
                <span className="text-[11px]/[16px] text-text-muted block">
                  {t('runwayLabel')}
                </span>
                <span
                  className={`text-[18px]/[24px] font-[650] tabular-nums ${
                    isImpactVisible ? 'text-warning' : 'text-text-primary'
                  }`}
                >
                  {isImpactVisible ? '5.1 months' : '8.2 months'}
                </span>
              </div>
              <div>
                <span className="text-[11px]/[16px] text-text-muted block">
                  {t('profitLabel')}
                </span>
                <span
                  className={`text-[15px]/[22px] font-[600] tabular-nums ${
                    isImpactVisible ? 'text-danger' : 'text-success'
                  }`}
                >
                  {isImpactVisible ? '-฿12,400' : '฿35,000'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Panel */}
        {prefersReduced ? (
          <div className="p-3.5 rounded-lg border border-brand/30 bg-brand-soft/40 flex items-start gap-3">
            <CheckCircle2 className="size-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="text-[12px]/[18px] font-[650] text-brand uppercase tracking-wider">
                {t('recommendationLabel')}
              </div>
              <p className="text-[13px]/[20px] font-[550] text-text-primary mt-0.5">
                {t('recommendationText')}
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: isRecVisible ? 1 : 0.4, y: isRecVisible ? 0 : 4 }}
            transition={{ duration: 0.25 }}
            className={`p-3.5 rounded-lg border transition-all duration-300 flex items-start gap-3 ${
              isRecVisible
                ? 'border-brand/40 bg-brand-soft/40'
                : 'border-border bg-surface-subtle'
            }`}
          >
            <CheckCircle2
              className={`size-5 shrink-0 mt-0.5 ${
                isRecVisible ? 'text-brand' : 'text-text-muted'
              }`}
              aria-hidden="true"
            />
            <div>
              <div
                className={`text-[12px]/[18px] font-[650] uppercase tracking-wider ${
                  isRecVisible ? 'text-brand' : 'text-text-muted'
                }`}
              >
                {t('recommendationLabel')}
              </div>
              <p className="text-[13px]/[20px] font-[550] text-text-primary mt-0.5">
                {t('recommendationText')}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </Surface>
  );
}
