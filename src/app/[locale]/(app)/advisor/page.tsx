'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  TrendingUp,
  Users,
  Scissors,
  DollarSign,
  RefreshCw,
  DatabaseZap,
  WifiOff,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { H2, H3, Body, BodySmall, Caption } from '@/components/ui/typography';
import { Skeleton, SkeletonText, SkeletonCard } from '@/components/ui/skeleton';
import { FadeIn, StaggerChildren } from '@/components/motion';
import {
  CalculatedFact,
  AssumptionTag,
  AIInterpretation,
  UncertaintyNotice,
  Disclaimer,
} from '@/features/advisor/components';
import {
  getAdvisorRecommendation,
  getSuggestedPrompts,
  type AIRecommendation,
  type SuggestedPrompt,
  type AdvisorErrorType,
} from '@/features/advisor/adapters/advisor.adapter';

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp,
  Users,
  Scissors,
  DollarSign,
};

type PageState = 'loading' | 'success' | 'error';
type ErrorVariant = AdvisorErrorType | null;

export default function AdvisorPage() {
  const t = useTranslations('advisor');
  const [state, setState] = useState<PageState>('loading');
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [prompts, setPrompts] = useState<SuggestedPrompt[]>([]);
  const [errorVariant, setErrorVariant] = useState<ErrorVariant>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setState('loading');
      setErrorVariant(null);
      try {
        const [rec, suggested] = await Promise.all([
          getAdvisorRecommendation(),
          getSuggestedPrompts(),
        ]);
        if (!cancelled) {
          setRecommendation(rec);
          setPrompts(suggested);
          setState('success');
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const error = err as { type?: AdvisorErrorType } | undefined;
          setErrorVariant(error?.type ?? 'provider_unavailable');
          setState('error');
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [fetchKey]);

  const handleRetry = useCallback(() => {
    setFetchKey((k) => k + 1);
  }, []);

  if (state === 'loading') {
    return <AdvisorSkeleton />;
  }

  if (state === 'error') {
    return (
      <AdvisorError
        variant={errorVariant!}
        onRetry={handleRetry}
        retryLabel={t('retry')}
      />
    );
  }

  return (
    <FadeIn className="space-y-8">
      {/* Header */}
      <div>
        <H2>{t('pageTitle')}</H2>
        <Body className="mt-1">{t('subtitle')}</Body>
      </div>

      {/* Suggested Prompts */}
      <section aria-labelledby="suggested-prompts">
        <h3 className="text-[20px]/[28px] font-[600] text-text-primary mb-4" id="suggested-prompts">
          {t('suggestedPrompts')}
        </h3>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prompts.map((prompt) => {
            const Icon = ICON_MAP[prompt.icon] ?? TrendingUp;
            return (
              <StaggerChildren.Item key={prompt.id}>
                <Surface
                  variant="default"
                  border
                  className="cursor-pointer hover:border-brand transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-[var(--radius-sm)] bg-brand-soft">
                      <Icon className="size-4 text-brand" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px]/[20px] font-[550] text-text-primary">
                        {prompt.title}
                      </p>
                      <p className="text-[13px]/[18px] text-text-muted mt-0.5">
                        {prompt.description}
                      </p>
                    </div>
                  </div>
                </Surface>
              </StaggerChildren.Item>
            );
          })}
        </StaggerChildren>
      </section>

      {/* AI Recommendation */}
      {recommendation && (
        <section aria-labelledby="recommendation-section" className="space-y-6">
          <div>
            <h3 className="text-[20px]/[28px] font-[600] text-text-primary" id="recommendation-section">{t('recommendation')}</h3>
            <Caption className="mt-1">
              {t('generatedAt', { date: new Date(recommendation.createdAt).toLocaleDateString() })}
            </Caption>
          </div>

          {/* Summary */}
          <Surface variant="raised" border className="space-y-3">
            <Badge variant="ai" icon={null} dot>
              {t('aiSummary')}
            </Badge>
            <p className="text-[15px]/[26px] text-text-primary font-[450]">
              {recommendation.summary}
            </p>
          </Surface>

          {/* Evidence */}
          <div>
            <H3 className="text-[16px] mb-3">{t('evidence')}</H3>
            <StaggerChildren className="space-y-3">
              {recommendation.evidence.map((ev, idx) => (
                <StaggerChildren.Item key={idx}>
                  {ev.type === 'calculated' && (
                    <CalculatedFact
                      value={ev.value}
                      unit={ev.unit}
                      source={ev.source}
                    />
                  )}
                  {ev.type === 'ai_interpretation' && (
                    <AIInterpretation
                      body={ev.value}
                      disclaimer={ev.source}
                    />
                  )}
                </StaggerChildren.Item>
              ))}
              {/* Assumptions tags */}
              <StaggerChildren.Item>
                <div className="flex flex-wrap gap-2 pt-2">
                  {recommendation.evidence
                    .filter((ev) => ev.type === 'user_input')
                    .map((ev, idx) => (
                      <AssumptionTag key={idx} label={`${ev.label}: ${ev.value}`} />
                    ))}
                </div>
              </StaggerChildren.Item>
            </StaggerChildren>
          </div>

          {/* Risks */}
          <div>
            <H3 className="text-[16px] mb-3">{t('risks')}</H3>
            <div className="space-y-2">
              {recommendation.risks.map((risk, idx) => (
                <Surface key={idx} variant="default" border>
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={risk.severity === 'high' ? 'danger' : risk.severity === 'medium' ? 'warning' : 'info'}
                      className="shrink-0 mt-0.5"
                    >
                      {risk.severity}
                    </Badge>
                    <div>
                      <p className="text-[14px]/[20px] font-[550] text-text-primary">{risk.title}</p>
                      <p className="text-[13px]/[20px] text-text-muted mt-0.5">{risk.description}</p>
                    </div>
                  </div>
                </Surface>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <H3 className="text-[16px] mb-3">{t('actions')}</H3>
            <StaggerChildren className="space-y-2">
              {recommendation.actions.map((action, idx) => (
                <StaggerChildren.Item key={idx}>
                  <Surface variant="default" border>
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center size-6 rounded-full bg-brand-soft text-brand text-[12px] font-[600] shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-[14px]/[20px] font-[550] text-text-primary">{action.title}</p>
                        <p className="text-[13px]/[20px] text-text-muted mt-0.5">{action.description}</p>
                      </div>
                    </div>
                  </Surface>
                </StaggerChildren.Item>
              ))}
            </StaggerChildren>
          </div>

          {/* Assumptions */}
          <div>
            <H3 className="text-[16px] mb-3">{t('assumptionsTitle')}</H3>
            <Surface variant="subtle">
              <ul className="space-y-1.5 text-[13px]/[20px] text-text-secondary" role="list">
                {recommendation.assumptions.map((a, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="shrink-0 mt-1.5 size-1.5 rounded-full bg-text-muted" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            </Surface>
          </div>

          {/* Uncertainty */}
          <UncertaintyNotice
            items={recommendation.uncertainty.items}
            completeness={recommendation.uncertainty.completeness}
          />

          {/* Disclaimer */}
          <Disclaimer text={recommendation.disclaimer} />
        </section>
      )}
    </FadeIn>
  );
}

// ── Loading Skeleton ────────────────────────────────────────────────────────

function AdvisorSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading advisor">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <SkeletonText lines={4} />
      </div>
    </div>
  );
}

// ── Error States ────────────────────────────────────────────────────────────

function AdvisorError({
  variant,
  onRetry,
  retryLabel,
}: {
  variant: AdvisorErrorType;
  onRetry: () => void;
  retryLabel: string;
}) {
  const t = useTranslations('advisor');

  const errorConfig: Record<
    AdvisorErrorType,
    { icon: React.ElementType; title: string; description: string; color: string }
  > = {
    insufficient_data: {
      icon: DatabaseZap,
      title: t('errors.insufficientData.title'),
      description: t('errors.insufficientData.description'),
      color: 'text-warning',
    },
    malformed_output: {
      icon: AlertTriangle,
      title: t('errors.malformedOutput.title'),
      description: t('errors.malformedOutput.description'),
      color: 'text-danger',
    },
    timeout: {
      icon: Clock,
      title: t('errors.timeout.title'),
      description: t('errors.timeout.description'),
      color: 'text-warning',
    },
    provider_unavailable: {
      icon: WifiOff,
      title: t('errors.providerUnavailable.title'),
      description: t('errors.providerUnavailable.description'),
      color: 'text-danger',
    },
  };

  const config = errorConfig[variant];
  const Icon = config.icon;

  return (
    <FadeIn className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className={cn('mb-4', config.color)} aria-hidden="true">
        <Icon className="size-12" />
      </div>
      <h3 className="text-[20px]/[28px] font-[600] text-text-primary mb-1">
        {config.title}
      </h3>
      <p className="text-[15px]/[24px] text-text-muted max-w-md mb-6">
        {config.description}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-2 text-[14px] font-[550] text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand cursor-pointer"
      >
        <RefreshCw className="size-4" aria-hidden="true" />
        {retryLabel}
      </button>
      <BodySmall className="mt-4 max-w-sm">
        {t('errors.preserveNote')}
      </BodySmall>
    </FadeIn>
  );
}
