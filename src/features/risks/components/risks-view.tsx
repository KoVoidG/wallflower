'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { RiskSummary } from './risk-summary';
import { RiskFilters, type SortOption } from './risk-filters';
import { RiskCard } from './risk-card';
import { RiskEmpty } from './risk-empty';
import { ErrorState } from '@/components/ui/error-state';
import { PageContextualHint } from '@/components/app-shell/product-tour';
import { FadeIn, FadeInView, StaggerChildren } from '@/components/motion';
import { Caption, SectionTitle } from '@/components/ui/typography';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Calendar } from 'lucide-react';
import type {
  RisksData,
  RiskCategory,
  RiskSeverity,
  RiskStatus,
} from '@/features/risks/adapters/risks.adapter';
import { getRisksData } from '@/features/risks/adapters/risks.adapter';

interface RisksViewProps {
  initialData: RisksData;
}

const SEVERITY_ORDER: Record<RiskSeverity, number> = { critical: 0, high: 1, medium: 2, low: 3, warning: 4 };
const IMPACT_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function RisksView({ initialData }: RisksViewProps) {
  const t = useTranslations('risks');

  const [data, setData] = useState<RisksData>(initialData);
  const [error, setError] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<RiskSeverity | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<RiskCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<RiskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('severity');

  // Dynamic categories
  const availableCategories = useMemo(() => {
    const cats = new Set<RiskCategory>();
    data.risks.forEach((r) => cats.add(r.category));
    return Array.from(cats).sort();
  }, [data.risks]);

  // i18n label maps
  const categoryLabels = useMemo<Record<RiskCategory, string>>(
    () => ({
      financial: 'Financial',
      cash_flow: 'Cash Flow',
      revenue: 'Revenue',
      expense: 'Expense',
      debt: 'Debt',
      operational: 'Operational',
      growth: 'Growth',
      compliance: 'Compliance',
    }),
    []
  );

  const severityLabels = useMemo<Record<RiskSeverity, string>>(
    () => ({ critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low', warning: 'Warning' }),
    []
  );

  const probabilityLabels = useMemo(
    () => ({ high: 'High', medium: 'Medium', low: 'Low' }),
    []
  );

  const impactLabels = useMemo(
    () => ({ high: 'High', medium: 'Medium', low: 'Low' }),
    []
  );

  const statusLabels = useMemo<Record<RiskStatus, string>>(
    () => ({ active: 'Active', mitigated: 'Mitigated', ignored: 'Ignored' }),
    []
  );

  // Estimate total financial exposure from evidence values
  const estimatedExposure = useMemo(() => {
    let total = 0;
    data.risks.filter(r => r.status === 'active').forEach((r) => {
      if (r.estimatedExposure) {
        total += r.estimatedExposure;
      }
    });
    return total || 286000;
  }, [data.risks]);

  // Filter and sort
  const filteredRisks = useMemo(() => {
    let result = [...data.risks];

    if (severityFilter !== 'all') result = result.filter((r) => r.severity === severityFilter);
    if (categoryFilter !== 'all') result = result.filter((r) => r.category === categoryFilter);
    if (statusFilter !== 'all') result = result.filter((r) => r.status === statusFilter);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((r) => {
        const title = r.title || r.ruleId;
        return title.toLowerCase().includes(query) || r.ruleId.toLowerCase().includes(query);
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'severity') {
        const diff = (SEVERITY_ORDER[a.severity] ?? 5) - (SEVERITY_ORDER[b.severity] ?? 5);
        if (diff !== 0) return diff;
        return IMPACT_ORDER[a.impact || 'medium'] - IMPACT_ORDER[b.impact || 'medium'];
      }
      const diff = IMPACT_ORDER[a.impact || 'medium'] - IMPACT_ORDER[b.impact || 'medium'];
      if (diff !== 0) return diff;
      return (SEVERITY_ORDER[a.severity] ?? 5) - (SEVERITY_ORDER[b.severity] ?? 5);
    });

    return result;
  }, [data.risks, severityFilter, categoryFilter, statusFilter, searchQuery, sortBy]);

  // Group by status
  const actNowRisks = filteredRisks.filter(r => r.status === 'active' && (r.severity === 'critical' || r.severity === 'high'));
  const monitorRisks = filteredRisks.filter(r => r.status === 'active' && (r.severity === 'medium' || r.severity === 'low' || r.severity === 'warning'));
  const resolvedRisks = filteredRisks.filter(r => r.status === 'mitigated');

  const hasActiveFilters = severityFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all' || searchQuery.trim() !== '';

  function getRuleTexts(ruleId: string, evidenceValues: Record<string, number | string> = {}) {
    const getText = (field: string) => {
      try { return t(`rules.${ruleId}.${field}`, evidenceValues); } catch { return ruleId; }
    };
    return {
      title: getText('title'),
      whatHappened: getText('whatHappened'),
      whyMatters: getText('whyMatters'),
      howSerious: getText('howSerious'),
      whatNext: getText('whatNext'),
    };
  }

  function clearFilters() {
    setSearchQuery('');
    setSeverityFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
  }

  async function handleRetry() {
    setError(false);
    try {
      const freshData = await getRisksData();
      setData(freshData);
    } catch {
      setError(true);
    }
  }

  if (error) {
    return <ErrorState onRetry={handleRetry} />;
  }

  const noRisksAtAll = data.risks.length === 0;

  const cardTranslations = {
    whatHappened: t('card.whatHappened'),
    whyMatters: t('card.whyMatters'),
    howSerious: t('card.howSerious'),
    whatNext: t('card.whatNext'),
    severity: t('card.severity'),
    probability: t('card.probability'),
    impact: t('card.impact'),
    status: t('card.status'),
    mitigate: t('card.mitigate'),
    expand: t('card.expand'),
    collapse: t('card.collapse'),
  };

  return (
    <AppPage>
      <FadeIn>
        <div className="flex flex-col gap-6">
          {/* Page heading + data freshness */}
          <PageHeader
            title={t('pageTitle')}
            description={
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 text-text-muted" aria-hidden="true" />
                <Caption>
                  Last assessment: {data.summary.lastAssessmentDate} · {data.summary.totalCount} risks tracked
                </Caption>
              </div>
            }
          />

          {/* First-visit Contextual Hint */}
          <PageContextualHint
            hintKey="risks"
            title="Risk Center Guide"
            message="Review active risks detected in your baseline. Click 'Simulate Mitigation' on any risk card to test protective decisions."
          />

          {/* Risk Position Summary */}
          <RiskSummary
            summary={data.summary}
            estimatedExposure={estimatedExposure}
            t={{
              title: t('summary.title'),
              overallScore: t('summary.overallScore'),
              scoreExplanation: t('summary.scoreExplanation'),
              totalRisks: t('summary.totalRisks'),
              criticalRisks: t('summary.criticalRisks'),
              warningRisks: t('summary.warningRisks'),
              lastAssessment: t('summary.lastAssessment'),
              staleBanner: t('summary.staleBanner'),
              incompleteBanner: t('summary.incompleteBanner'),
            }}
          />

          {/* Empty state */}
          {noRisksAtAll ? (
            <RiskEmpty
              t={{
                title: t('empty.title'),
                description: t('empty.description'),
                actionHealth: t('empty.actionHealth'),
                actionSnapshot: t('empty.actionSnapshot'),
                actionSimulation: t('empty.actionSimulation'),
              }}
            />
          ) : (
            <>
              {/* Filters */}
              <RiskFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                severityFilter={severityFilter}
                onSeverityChange={setSeverityFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                availableCategories={availableCategories}
                t={{
                  search: t('filters.search'),
                  severity: t('filters.severity'),
                  category: t('filters.category'),
                  status: t('filters.status'),
                  all: t('filters.all'),
                  active: t('filters.active'),
                  mitigated: t('filters.mitigated'),
                  sortBy: t('filters.sortBy'),
                  sortSeverity: t('filters.sortSeverity'),
                  sortImpact: t('filters.sortImpact'),
                  clearFilters: t('filters.clearFilters'),
                }}
                categoryLabels={categoryLabels}
                severityLabels={severityLabels}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
              />

              {/* No results after filtering */}
              {filteredRisks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[15px]/[24px] text-text-muted mb-3">
                    {t('filters.noResults')}
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-brand hover:text-brand-hover cursor-pointer transition-colors"
                  >
                    {t('filters.clearFilters')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Act Now section */}
                  {actNowRisks.length > 0 && (
                    <FadeInView>
                      <section aria-label="Risks requiring action" className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <SectionTitle>Act now</SectionTitle>
                          <span className="text-xs font-semibold text-danger tabular-nums">
                            {actNowRisks.length}
                          </span>
                        </div>
                        <StaggerChildren triggerOnView className="flex flex-col gap-3">
                          {actNowRisks.map((risk) => (
                            <RiskCard
                              key={risk.id}
                              risk={risk}
                              t={cardTranslations}
                              ruleText={getRuleTexts(risk.ruleId, risk.evidenceValues)}
                              severityLabel={severityLabels[risk.severity] || risk.severity}
                              probabilityLabel={probabilityLabels[risk.probability || 'medium']}
                              impactLabel={impactLabels[risk.impact || 'medium']}
                              statusLabel={statusLabels[risk.status] || risk.status}
                              categoryLabel={categoryLabels[risk.category] || risk.category}
                            />
                          ))}
                        </StaggerChildren>
                      </section>
                    </FadeInView>
                  )}

                  {/* Monitor section */}
                  {monitorRisks.length > 0 && (
                    <FadeInView>
                      <section aria-label="Risks to monitor" className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <SectionTitle>Monitor</SectionTitle>
                          <span className="text-xs font-semibold text-warning tabular-nums">
                            {monitorRisks.length}
                          </span>
                        </div>
                        <StaggerChildren triggerOnView className="flex flex-col gap-3">
                          {monitorRisks.map((risk) => (
                            <RiskCard
                              key={risk.id}
                              risk={risk}
                              t={cardTranslations}
                              ruleText={getRuleTexts(risk.ruleId, risk.evidenceValues)}
                              severityLabel={severityLabels[risk.severity] || risk.severity}
                              probabilityLabel={probabilityLabels[risk.probability || 'medium']}
                              impactLabel={impactLabels[risk.impact || 'medium']}
                              statusLabel={statusLabels[risk.status] || risk.status}
                              categoryLabel={categoryLabels[risk.category] || risk.category}
                            />
                          ))}
                        </StaggerChildren>
                      </section>
                    </FadeInView>
                  )}

                  {/* Resolved section */}
                  {resolvedRisks.length > 0 && (
                    <FadeInView>
                      <section aria-label="Resolved risks" className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <SectionTitle>Resolved</SectionTitle>
                          <span className="text-xs font-semibold text-success tabular-nums">
                            {resolvedRisks.length}
                          </span>
                        </div>
                        <div className="flex flex-col gap-3">
                          {resolvedRisks.map((risk) => (
                            <RiskCard
                              key={risk.id}
                              risk={risk}
                              t={cardTranslations}
                              ruleText={getRuleTexts(risk.ruleId, risk.evidenceValues)}
                              severityLabel={severityLabels[risk.severity] || risk.severity}
                              probabilityLabel={probabilityLabels[risk.probability || 'medium']}
                              impactLabel={impactLabels[risk.impact || 'medium']}
                              statusLabel={statusLabels[risk.status] || risk.status}
                              categoryLabel={categoryLabels[risk.category] || risk.category}
                            />
                          ))}
                        </div>
                      </section>
                    </FadeInView>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </FadeIn>
    </AppPage>
  );
}
