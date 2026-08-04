'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import {
  Plus,
  Search,
  SlidersHorizontal,
  FileText,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Trash2,
} from 'lucide-react';
import { ReportItem } from './report-viewer';

const SAMPLE_REPORTS: ReportItem[] = [
  {
    id: 'rpt-1',
    title: 'Price Increase +5%',
    type: 'Executive Summary',
    date: 'Aug 5, 2025 • 10:24 AM',
    horizon: '6 Months Horizon',
    healthScore: 84,
    profit: '฿163,000',
    confidence: 91,
    confidenceBadge: 'High Confidence',
    iconColor: 'emerald',
  },
  {
    id: 'rpt-2',
    title: 'Hire 1 Sales Associate',
    type: 'Executive Summary',
    date: 'Jul 30, 2025 • 02:15 PM',
    horizon: '6 Months Horizon',
    healthScore: 82,
    profit: '฿142,000',
    confidence: 87,
    confidenceBadge: 'High Confidence',
    iconColor: 'blue',
  },
  {
    id: 'rpt-3',
    title: 'Holiday Promotion Campaign',
    type: 'Executive Summary',
    date: 'Jul 26, 2025 • 09:31 AM',
    horizon: '3 Months Horizon',
    healthScore: 78,
    profit: '฿98,000',
    confidence: 85,
    confidenceBadge: 'Medium Confidence',
    iconColor: 'rose',
  },
  {
    id: 'rpt-4',
    title: 'Expand Inventory',
    type: 'Executive Summary',
    date: 'Jul 20, 2025 • 10:11 AM',
    horizon: '6 Months Horizon',
    healthScore: 81,
    profit: '฿128,000',
    confidence: 82,
    confidenceBadge: 'High Confidence',
    iconColor: 'emerald',
  },
  {
    id: 'rpt-5',
    title: 'Pricing Strategy Comparison',
    type: 'Comparison Report',
    date: 'Jul 18, 2025 • 03:50 PM',
    horizon: '6 Months Horizon',
    healthScore: 83,
    profit: '฿154,000',
    confidence: 90,
    confidenceBadge: 'High Confidence',
    iconColor: 'blue',
  },
  {
    id: 'rpt-6',
    title: 'Q2 2025 Performance Review',
    type: 'Business Review',
    date: 'Jul 14, 2025 • 05:30 PM',
    horizon: '3 Months Horizon',
    healthScore: 80,
    profit: '฿135,000',
    confidence: 86,
    confidenceBadge: 'High Confidence',
    iconColor: 'rose',
  },
];

interface ReportLibraryViewProps {
  onSelectReport: (report: ReportItem) => void;
  onNewSimulation: () => void;
}

export function ReportLibraryView({
  onSelectReport,
  onNewSimulation,
}: ReportLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [reportsList, setReportsList] = useState<ReportItem[]>(SAMPLE_REPORTS);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReports = reportsList.filter((rpt) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !rpt.title.toLowerCase().includes(q) &&
        !rpt.type.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (typeFilter !== 'All Types' && rpt.type !== typeFilter) {
      return false;
    }
    return true;
  });

  const handleDeleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReportsList((prev) => prev.filter((r) => r.id !== id));
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Reports
          </h1>
          <p className="text-xs text-text-secondary mt-0.5 font-medium">
            All your decision reports in one place
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onNewSimulation}
          className="gap-2 font-bold text-xs cursor-pointer bg-tertiary text-on-primary hover:bg-tertiary-hover shadow-2xs self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>New Simulation</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-tertiary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-36">
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: 'All Types', label: 'All Types' },
                { value: 'Executive Summary', label: 'Executive Summary' },
                { value: 'Comparison Report', label: 'Comparison Report' },
                { value: 'Business Review', label: 'Business Review' },
              ]}
            />
          </div>

          <div className="w-32">
            <Select
              value={timeFilter}
              onChange={setTimeFilter}
              options={[
                { value: 'All Time', label: 'All Time' },
                { value: 'Last 30 Days', label: 'Last 30 Days' },
                { value: 'Last 90 Days', label: 'Last 90 Days' },
                { value: 'This Year', label: 'This Year' },
              ]}
            />
          </div>

          <button
            type="button"
            className="p-2.5 rounded-xl border border-border bg-surface text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            title="Advanced Filters"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3.5">
        <h2 className="font-display text-xs font-bold uppercase tracking-wider text-text-muted">
          Recent Reports
        </h2>

        <div className="space-y-3">
          {filteredReports.map((rpt) => (
            <Card
              key={rpt.id}
              onClick={() => onSelectReport(rpt)}
              className="group p-4 border-border-strong bg-surface transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:border-tertiary/50 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs relative"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-3 rounded-xl bg-surface-hover text-text-primary border border-border/80 shadow-2xs shrink-0">
                  <FileText className="size-5" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-sm font-bold text-text-primary transition-colors truncate">
                      {rpt.title}
                    </h3>

                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide',
                        rpt.confidenceBadge === 'High Confidence'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
                      )}
                    >
                      {rpt.confidenceBadge}
                    </span>
                  </div>

                  <p className="text-[11px] font-medium text-text-muted">
                    {rpt.type}
                  </p>

                  <p className="text-[11px] text-text-muted font-mono">
                    {rpt.date} • {rpt.horizon}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:gap-8 self-end sm:self-center shrink-0 border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-6 sm:gap-8">
                  <div>
                    <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider block">
                      Business Health
                    </span>
                    <span className="font-mono text-sm font-bold text-text-primary">
                      {rpt.healthScore}{' '}
                      <span className="text-[10px] text-text-muted font-normal">
                        /100
                      </span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider block">
                      Profit (Monthly)
                    </span>
                    <span className="font-mono text-sm font-bold text-text-primary">
                      {rpt.profit}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider block">
                      Confidence
                    </span>
                    <span className="font-mono text-sm font-bold text-text-primary">
                      {rpt.confidence}%
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === rpt.id ? null : rpt.id);
                    }}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
                  >
                    <MoreVertical className="size-4" />
                  </button>

                  {activeMenuId === rpt.id && (
                    <div className="absolute right-0 top-8 z-30 w-36 bg-surface border border-border-strong rounded-xl shadow-xl p-1 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                          onSelectReport(rpt);
                        }}
                        className="flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-hover text-text-primary font-medium cursor-pointer"
                      >
                        <Eye className="size-3.5 text-text-muted" />
                        <span>View Report</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                          onSelectReport(rpt);
                        }}
                        className="flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-hover text-text-primary font-medium cursor-pointer"
                      >
                        <Download className="size-3.5 text-text-muted" />
                        <span>Export</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteReport(rpt.id, e)}
                        className="flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 font-medium cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border/60">
        <span>Showing 1 to {filteredReports.length} of 24 reports</span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="p-1.5 rounded-lg border border-border bg-surface text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-3.5" />
          </button>

          {[1, 2, 3, 4].map((pg) => (
            <button
              key={pg}
              type="button"
              onClick={() => setCurrentPage(pg)}
              className={cn(
                'size-7 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer',
                currentPage === pg
                  ? 'bg-tertiary text-on-primary'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover',
              )}
            >
              {pg}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage(Math.min(4, currentPage + 1))}
            className="p-1.5 rounded-lg border border-border bg-surface text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
