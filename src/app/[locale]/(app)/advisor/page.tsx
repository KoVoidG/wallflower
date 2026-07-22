'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  Send,
  Calendar,
  Shield,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { H2, H3, Body, BodySmall, Caption } from '@/components/ui/typography';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, FadeInView } from '@/components/motion';
import { Link } from '@/lib/i18n/navigation';
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
  TrendingUp, Users, Scissors, DollarSign,
};

type PageState = 'initial' | 'loading' | 'success' | 'error';
type ErrorVariant = AdvisorErrorType | null;

export default function AdvisorPage() {
  const t = useTranslations('advisor');
  const [state, setState] = useState<PageState>('initial');
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [prompts, setPrompts] = useState<SuggestedPrompt[]>([]);
  const [errorVariant, setErrorVariant] = useState<ErrorVariant>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load prompts on mount
  useEffect(() => {
    getSuggestedPrompts().then(setPrompts);
  }, []);

  const handleAsk = useCallback(async (question: string) => {
    if (!question.trim()) return;
    setActiveQuestion(question);
    setState('loading');
    setErrorVariant(null);
    setInputValue('');

    try {
      const rec = await getAdvisorRecommendation();
      setRecommendation(rec);
      setState('success');
    } catch (err: unknown) {
      const error = err as { type?: AdvisorErrorType } | undefined;
      setErrorVariant(error?.type ?? 'provider_unavailable');
      setState('error');
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (activeQuestion) handleAsk(activeQuestion);
  }, [activeQuestion, handleAsk]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(inputValue);
  };

  return (
    <FadeIn data-tour="advisor-view" className="flex flex-col gap-6 pb-8">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 text-ai" aria-hidden="true" />
          <H2>{t('pageTitle')}</H2>
        </div>
        <Body className="text-text-secondary">{t('subtitle')}</Body>
      </header>

      {/* Business context bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 rounded-[var(--radius-md)] bg-surface-subtle border border-border/60">
        <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
          <Calendar className="size-3.5 text-text-muted" aria-hidden="true" />
          <span>Data through Jan 15, 2025</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
          <Shield className="size-3.5 text-text-muted" aria-hidden="true" />
          <span>6 months of history</span>
        </div>
        <Badge variant="ai" dot>Prototype analysis</Badge>
      </div>

      {/* Main content: split layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Conversation area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Initial state: suggested questions */}
          {state === 'initial' && (
            <FadeInView>
              <section aria-label="Suggested questions" className="flex flex-col gap-4">
                <H3 className="text-[16px]/[22px]">What would you like to understand?</H3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prompts.map((prompt) => {
                    const Icon = ICON_MAP[prompt.icon] ?? TrendingUp;
                    return (
                      <button
                        key={prompt.id}
                        type="button"
                        onClick={() => handleAsk(prompt.title)}
                        className={cn(
                          'text-left rounded-[var(--radius-md)] p-4 border border-border bg-surface',
                          'hover:border-ai/40 hover:bg-ai-soft/20 transition-colors cursor-pointer',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai/40'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-[var(--radius-sm)] bg-ai-soft shrink-0">
                            <Icon className="size-4 text-ai" aria-hidden="true" />
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[14px]/[20px] font-[550] text-text-primary">
                              {prompt.title}
                            </span>
                            <Caption as="span" className="text-text-muted">
                              {prompt.description}
                            </Caption>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </FadeInView>
          )}

          {/* Loading state */}
          {state === 'loading' && (
            <FadeInView>
              <div className="flex flex-col gap-5">
                {activeQuestion && (
                  <div className="self-end max-w-[80%] px-4 py-2.5 rounded-[var(--radius-md)] bg-brand-soft text-[14px] text-text-primary">
                    {activeQuestion}
                  </div>
                )}
                <div className="flex flex-col gap-3 p-5 rounded-[var(--radius-md)] bg-surface border border-border">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-ai animate-pulse motion-reduce:animate-none" />
                    <Caption className="text-ai font-[550]">Reviewing business context...</Caption>
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </FadeInView>
          )}

          {/* Error state */}
          {state === 'error' && (
            <FadeInView>
              <AdvisorError variant={errorVariant!} onRetry={handleRetry} retryLabel={t('retry')} />
            </FadeInView>
          )}

          {/* Success: structured response */}
          {state === 'success' && recommendation && (
            <FadeInView>
              <div className="flex flex-col gap-6">
                {/* User question */}
                {activeQuestion && (
                  <div className="self-end max-w-[80%] px-4 py-2.5 rounded-[var(--radius-md)] bg-brand-soft text-[14px] text-text-primary">
                    {activeQuestion}
                  </div>
                )}

                {/* Direct answer */}
                <div className="rounded-[var(--radius-lg)] border border-ai/20 bg-ai-soft/15 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="ai" dot>Direct answer</Badge>
                    <Caption>{new Date(recommendation.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Caption>
                  </div>
                  <p className="text-[15px]/[26px] text-text-primary font-[450]">
                    {recommendation.summary}
                  </p>
                </div>

                {/* Calculated facts */}
                <section className="flex flex-col gap-3">
                  <H3 className="text-[16px]/[22px]">Calculated facts</H3>
                  <div className="flex flex-col gap-2">
                    {recommendation.evidence
                      .filter((ev) => ev.type === 'calculated')
                      .map((ev, idx) => (
                        <CalculatedFact key={idx} value={ev.value} unit={ev.unit} source={ev.source} />
                      ))}
                  </div>
                </section>

                {/* AI Interpretation */}
                {recommendation.evidence.filter(ev => ev.type === 'ai_interpretation').length > 0 && (
                  <section className="flex flex-col gap-3">
                    <H3 className="text-[16px]/[22px]">Interpretation</H3>
                    {recommendation.evidence
                      .filter((ev) => ev.type === 'ai_interpretation')
                      .map((ev, idx) => (
                        <AIInterpretation key={idx} body={ev.value} disclaimer={ev.source} />
                      ))}
                  </section>
                )}

                {/* Recommended actions */}
                <section className="flex flex-col gap-3">
                  <H3 className="text-[16px]/[22px]">Recommended actions</H3>
                  <div className="flex flex-col gap-2">
                    {recommendation.actions.map((action, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'rounded-[var(--radius-md)] p-4 flex items-start gap-3',
                          idx === 0 ? 'bg-brand-soft/30 border border-brand/15' : 'bg-surface border border-border/60'
                        )}
                      >
                        <span className={cn(
                          'flex items-center justify-center size-6 rounded-full text-[12px] font-[650] shrink-0',
                          idx === 0 ? 'bg-brand text-white' : 'bg-surface-subtle text-text-muted border border-border'
                        )}>
                          {idx + 1}
                        </span>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[14px]/[20px] font-[550] text-text-primary">{action.title}</span>
                          <Caption as="span" className="text-text-secondary">{action.description}</Caption>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/simulations/new"
                    className="inline-flex items-center gap-1.5 self-start text-[13px] font-[550] text-brand hover:text-brand-hover transition-colors cursor-pointer mt-1"
                  >
                    Test a recommendation in the simulator
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </Link>
                </section>

                {/* Assumptions + Uncertainty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <section className="flex flex-col gap-3">
                    <H3 className="text-[16px]/[22px]">Assumptions</H3>
                    <div className="rounded-[var(--radius-md)] bg-surface-subtle p-4">
                      <ul className="flex flex-col gap-1.5 text-[13px]/[20px] text-text-secondary">
                        {recommendation.assumptions.map((a, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="shrink-0 mt-1.5 size-1.5 rounded-full bg-text-muted" aria-hidden="true" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* User inputs */}
                    <div className="flex flex-wrap gap-2">
                      {recommendation.evidence
                        .filter((ev) => ev.type === 'user_input')
                        .map((ev, idx) => (
                          <AssumptionTag key={idx} label={`${ev.label}: ${ev.value}`} />
                        ))}
                    </div>
                  </section>

                  <section className="flex flex-col gap-3">
                    <H3 className="text-[16px]/[22px]">Confidence & limitations</H3>
                    <UncertaintyNotice
                      items={recommendation.uncertainty.items}
                      completeness={recommendation.uncertainty.completeness}
                    />
                  </section>
                </div>

                {/* Disclaimer */}
                <Disclaimer text={recommendation.disclaimer} />

                {/* Follow-up suggestions */}
                <section className="flex flex-col gap-3 pt-4 border-t border-border">
                  <Caption className="text-text-muted font-[550]">Follow up</Caption>
                  <div className="flex flex-wrap gap-2">
                    {['What if receivables are collected this month?', 'Test a smaller hiring plan', 'Which expense changed the most?'].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleAsk(q)}
                        className="px-3 py-1.5 rounded-[var(--radius-md)] border border-border text-[13px] font-[500] text-text-secondary hover:text-text-primary hover:border-ai/40 transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </FadeInView>
          )}

          {/* Input composer */}
          <form onSubmit={handleSubmit} className="sticky bottom-4 mt-auto">
            <div className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border shadow-sm">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your cash flow, risks, or a business decision"
                disabled={state === 'loading'}
                className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none disabled:opacity-50"
                aria-label="Ask the advisor a question"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || state === 'loading'}
                className={cn(
                  'p-2 rounded-[var(--radius-sm)] transition-colors cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai/40',
                  inputValue.trim() ? 'bg-ai text-white hover:bg-ai/90' : 'bg-surface-subtle text-text-muted'
                )}
                aria-label="Send question"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Contextual sidebar (desktop only) */}
        <aside className="hidden lg:block lg:col-span-4" aria-label="Business context">
          <div className="sticky top-6 rounded-[var(--radius-lg)] border border-border bg-surface-subtle/40 p-5 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <Caption className="text-text-muted font-[600] uppercase tracking-wide">Current context</Caption>
              <span className="text-[14px] font-[550] text-text-primary">Cash resilience & operations</span>
            </div>

            <div className="flex flex-col gap-2.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-text-muted">Revenue</span>
                <span className="font-[550] text-text-primary tabular-nums">฿152,400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Expenses</span>
                <span className="font-[550] text-text-primary tabular-nums">฿164,800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Cash runway</span>
                <span className="font-[550] text-warning tabular-nums">2.1 months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Receivables</span>
                <span className="font-[550] text-text-primary tabular-nums">฿53,340</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Active risks</span>
                <span className="font-[550] text-danger tabular-nums">3 critical</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
              <Caption className="text-text-muted">Source: Business baseline · Jan 2025</Caption>
              <Link
                href="/business-health"
                className="inline-flex items-center gap-1 text-[12px] font-[550] text-brand hover:text-brand-hover transition-colors cursor-pointer"
              >
                View full health assessment
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </FadeIn>
  );
}

// ── Error State ─────────────────────────────────────────────────────────────

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
    <div className="flex flex-col items-center text-center py-12 px-6 rounded-[var(--radius-lg)] border border-border bg-surface">
      <div className={cn('mb-3', config.color)} aria-hidden="true">
        <Icon className="size-8" />
      </div>
      <h3 className="text-[16px]/[22px] font-[600] text-text-primary mb-1">{config.title}</h3>
      <p className="text-[13px]/[20px] text-text-muted max-w-sm mb-4">{config.description}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-2 text-[14px] font-[550] text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand cursor-pointer"
      >
        <RefreshCw className="size-4" aria-hidden="true" />
        {retryLabel}
      </button>
      <BodySmall className="mt-3 max-w-xs text-text-muted">
        Your business data and risk assessments remain accessible.
      </BodySmall>
    </div>
  );
}


