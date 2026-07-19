'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { RiskSummary } from './risk-summary';
import { RiskFilters, type SortOption } from './risk-filters';
import { RiskCard } from './risk-card';
import { RiskEmpty } from './risk-empty';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn, StaggerChildren } from '@/components/motion';
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

const SEVERITY_ORDER: Record<RiskSeverity, number> = { critical: 0, warning: 1 };
const IMPACT_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function RisksView({ initialData }: RisksViewProps) {
  const t = useTranslations('risks');

  // ── State ─────────────────────────────────────────────────────
  const [data, setData] = useState<RisksData>(initialData);
  const [error, setError] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<RiskSeverity | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<RiskCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<RiskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('severity');

  // ── Derived values ────────────────────────────────────────────

  // Dynamic categories from data
  const availableCategories = useMemo(() => {
    const cats = new Set<RiskCategory>();
    data.risks.forEach((r) => cats.add(r.category));
    return Array.from(cats).sort();
  }, [data.risks]);

  // i18n label maps
  const categoryLabels = useMemo(
    () => ({
      financial: t('categories.financial'),
      operational: t('categories.operational'),
      growth: t('categories.growth'),
      compliance: t('categories.compliance'),
    }),
    [t]
  );

  const severityLabels = useMemo(
    () => ({
      critical: t('severity.critical'),
      warning: t('severity.warning'),
    }),
    [t]
  );

  const probabilityLabels = useMemo(
    () => ({
      high: t('probability.high'),
      medium: t('probability.medium'),
      low: t('probability.low'),
    }),
    [t]
  );

  const impactLabels = useMemo(
    () => ({
      high: t('impact.high'),
      medium: t('impact.medium'),
      low: t('impact.low'),
    }),
    [t]
  );

  const statusLabels = useMemo(
    () => ({
      active: t('status.active'),
      mitigated: t('status.mitigated'),
    }),
    [t]
  );

  // Filter + sort
  const filteredRisks = useMemo(() => {
    let result = [...data.risks];

    // Severity
    if (severityFilter !== 'all') {
      result = result.filter((r) => r.severity === severityFilter);
    }

    // Category
    if (categoryFilter !== 'all') {
      result = result.filter((r) => r.category === categoryFilter);
    }

    // Status
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Search — match against i18n-resolved title and whatHappened
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((r) => {
        let title: string;
        let whatHappened: string;
        try { title = t(`rules.${r.ruleId}.title`, r.evidenceValues); } catch { title = r.ruleId; }
        try { whatHappened = t(`rules.${r.ruleId}.whatHappened`, r.evidenceValues); } catch { whatHappened = ''; }
        return title.toLowerCase().includes(query) || whatHappened.toLowerCase().includes(query) || r.ruleId.toLowerCase().includes(query);
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'severity') {
        const diff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
        if (diff !== 0) return diff;
        return IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact];
      }
      // impact
      const diff = IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact];
      if (diff !== 0) return diff;
      return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    });

    return result;
  }, [data.risks, severityFilter, categoryFilter, statusFilter, searchQuery, sortBy, t]);

  const hasActiveFilters =
    severityFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all' || searchQuery.trim() !== '';

  // ── Helpers ───────────────────────────────────────────────────

  function getRuleText(ruleId: string, field: string, evidenceValues: Record<string, number | string> = {}): string {
    try {
      return t(`rules.${ruleId}.${field}`, evidenceValues);
    } catch {
      return ruleId;
    }
  }

  function getRuleTexts(ruleId: string, evidenceValues: Record<string, number | string> = {}) {
    return {
      title: getRuleText(ruleId, 'title', evidenceValues),
      whatHappened: getRuleText(ruleId, 'whatHappened', evidenceValues),
      whyMatters: getRuleText(ruleId, 'whyMatters', evidenceValues),
      howSerious: getRuleText(ruleId, 'howSerious', evidenceValues),
      whatNext: getRuleText(ruleId, 'whatNext', evidenceValues),
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

  // ── Render ────────────────────────────────────────────────────

  if (error) {
    return <ErrorState onRetry={handleRetry} />;
  }

  const noRisksAtAll = data.risks.length === 0;

  return (
    <FadeIn>
      <div className="flex flex-col gap-6">
        {/* Page title */}
        <h1 className="text-[28px]/[36px] font-[650] text-text-primary">
          {t('pageTitle')}
        </h1>

        {/* Summary */}
        <RiskSummary
          summary={data.summary}
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

            {/* Risk cards or no-results */}
            {filteredRisks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[15px]/[24px] text-text-muted mb-3">
                  {t('filters.noResults')}
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[14px] font-[550] text-brand hover:text-brand-hover cursor-pointer transition-colors"
                >
                  {t('filters.clearFilters')}
                </button>
              </div>
            ) : (
              <StaggerChildren triggerOnView className="flex flex-col gap-3">
                {filteredRisks.map((risk) => (
                  <RiskCard
                    key={risk.id}
                    risk={risk}
                    t={{
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
                    }}
                    ruleText={getRuleTexts(risk.ruleId, risk.evidenceValues)}
                    severityLabel={severityLabels[risk.severity]}
                    probabilityLabel={probabilityLabels[risk.probability]}
                    impactLabel={impactLabels[risk.impact]}
                    statusLabel={statusLabels[risk.status]}
                    categoryLabel={categoryLabels[risk.category]}
                  />
                ))}
              </StaggerChildren>
            )}
          </>
        )}
      </div>
    </FadeIn>
  );
}
