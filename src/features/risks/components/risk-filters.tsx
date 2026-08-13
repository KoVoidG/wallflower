'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import type { RiskCategory, RiskSeverity, RiskStatus } from '@/features/risks/adapters/risks.adapter';

export type SortOption = 'severity' | 'impact';

interface RiskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  severityFilter: RiskSeverity | 'all';
  onSeverityChange: (severity: RiskSeverity | 'all') => void;
  categoryFilter: RiskCategory | 'all';
  onCategoryChange: (category: RiskCategory | 'all') => void;
  statusFilter: RiskStatus | 'all';
  onStatusChange: (status: RiskStatus | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  /** Dynamically derived from current data */
  availableCategories: RiskCategory[];
  t: {
    search: string;
    severity: string;
    category: string;
    status: string;
    all: string;
    active: string;
    mitigated: string;
    sortBy: string;
    sortSeverity: string;
    sortImpact: string;
    clearFilters: string;
  };
  categoryLabels: Record<string, string>;
  severityLabels: Record<string, string>;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

function SegmentedButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1 text-[13px]/[18px] font-[500] rounded-full transition-colors cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand',
        active
          ? 'bg-brand text-white'
          : 'bg-surface-subtle text-text-secondary hover:bg-surface-subtle/80 border border-border'
      )}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export function RiskFilters({
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  availableCategories,
  t,
  categoryLabels,
  severityLabels,
  hasActiveFilters,
  onClearFilters,
}: RiskFiltersProps) {
  return (
    <div className="flex flex-col gap-3 print:hidden" role="search" aria-label={t.search}>
      {/* Row 1: Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.search}
          className={cn(
            'w-full pl-9 pr-9 py-2 border border-border rounded-[var(--radius-md)]',
            'bg-transparent text-text-primary text-[14px] placeholder:text-text-muted',
            'focus:outline-none focus:border-brand-strong transition-colors'
          )}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Row 2: Filters + Sort */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
        {/* Severity */}
        <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label={t.severity}>
          <span className="text-[12px]/[18px] font-[550] text-text-muted mr-1">{t.severity}:</span>
          <SegmentedButton active={severityFilter === 'all'} onClick={() => onSeverityChange('all')}>
            {t.all}
          </SegmentedButton>
          <SegmentedButton active={severityFilter === 'critical'} onClick={() => onSeverityChange('critical')}>
            {severityLabels.critical || 'Critical'}
          </SegmentedButton>
          <SegmentedButton active={severityFilter === 'warning'} onClick={() => onSeverityChange('warning')}>
            {severityLabels.warning || 'Warning'}
          </SegmentedButton>
        </div>

        {/* Category — dynamic */}
        <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label={t.category}>
          <span className="text-[12px]/[18px] font-[550] text-text-muted mr-1">{t.category}:</span>
          <SegmentedButton active={categoryFilter === 'all'} onClick={() => onCategoryChange('all')}>
            {t.all}
          </SegmentedButton>
          {availableCategories.map((cat) => (
            <SegmentedButton key={cat} active={categoryFilter === cat} onClick={() => onCategoryChange(cat)}>
              {categoryLabels[cat] || cat}
            </SegmentedButton>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label={t.status}>
          <span className="text-[12px]/[18px] font-[550] text-text-muted mr-1">{t.status}:</span>
          <SegmentedButton active={statusFilter === 'all'} onClick={() => onStatusChange('all')}>
            {t.all}
          </SegmentedButton>
          <SegmentedButton active={statusFilter === 'active'} onClick={() => onStatusChange('active')}>
            {t.active}
          </SegmentedButton>
          <SegmentedButton active={statusFilter === 'mitigated'} onClick={() => onStatusChange('mitigated')}>
            {t.mitigated}
          </SegmentedButton>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 sm:ml-auto">
          <span className="text-[12px]/[18px] font-[550] text-text-muted">
            {t.sortBy}:
          </span>
          <Select
            value={sortBy}
            onChange={(val) => onSortChange(val as SortOption)}
            options={[
              { value: 'severity', label: t.sortSeverity },
              { value: 'impact', label: t.sortImpact },
            ]}
            className="w-[180px]"
          />
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="self-start text-[13px] text-brand hover:text-brand-hover font-[500] cursor-pointer transition-colors"
        >
          {t.clearFilters}
        </button>
      )}
    </div>
  );
}
