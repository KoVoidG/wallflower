// src/features/reports/components/report-library-view.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import {
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
import { FadeInView } from '@/components/motion';
import { useReports } from '../engine/reports-store';

interface ReportLibraryViewProps {
  onSelectReport: (report: ReportItem) => void;
  onNewSimulation?: () => void;
}

export function ReportLibraryView({
  onSelectReport,
}: ReportLibraryViewProps) {
  const { reports, deleteReport } = useReports();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReports = reports.filter((rpt) => {
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
    deleteReport(id);
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & New Simulation Action */}
      <FadeInView offset={10}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Reports Library
            </h1>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 font-medium">
              Access and export all strategic decision reports, simulations, and
              business health reviews.
            </p>
          </div>
        </div>
      </FadeInView>

      {/* Filter and Search Bar */}
      <FadeInView offset={12}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by title or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] focus:outline-hidden focus:border-[#6366F1] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-40">
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

            <div className="w-36">
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
              className="p-2.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638] transition-colors cursor-pointer"
              title="Advanced Filters"
            >
              <SlidersHorizontal className="size-4" />
            </button>
          </div>
        </div>
      </FadeInView>

      {/* Reports List */}
      <FadeInView offset={14}>
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Available Reports ({filteredReports.length})
            </h2>
          </div>

          <div className="space-y-3">
            {filteredReports.map((rpt) => (
              <Card
                key={rpt.id}
                onClick={() => onSelectReport(rpt)}
                className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-[#6366F1]/50 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] shrink-0 group-hover:bg-[#6366F1]/10 dark:group-hover:bg-[#6366F1]/20 group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:border-[#6366F1]/40 transition-all">
                    <FileText className="size-5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-display text-sm sm:text-base font-bold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors truncate">
                        {rpt.title}
                      </h3>

                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide',
                          rpt.confidenceBadge === 'High Confidence'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
                        )}
                      >
                        {rpt.confidenceBadge}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                      {rpt.type}
                    </p>

                    <p className="text-[11px] text-[#94A3B8] font-mono">
                      {rpt.date} • {rpt.horizon}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8 self-end sm:self-center shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-[#1E2638] pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-5 sm:gap-7 text-right">
                    <div>
                      <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
                        Health Score
                      </span>
                      <span className="font-mono text-sm font-bold text-[#0F172A] dark:text-white">
                        {rpt.healthScore}{' '}
                        <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-normal">
                          /100
                        </span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
                        Profit (Monthly)
                      </span>
                      <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {rpt.profit}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
                        Confidence
                      </span>
                      <span className="font-mono text-sm font-bold text-[#0F172A] dark:text-white">
                        {rpt.confidence}%
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(
                          activeMenuId === rpt.id ? null : rpt.id,
                        );
                      }}
                      className="p-2 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638] transition-colors cursor-pointer"
                    >
                      <MoreVertical className="size-4" />
                    </button>

                    {activeMenuId === rpt.id && (
                      <div className="absolute right-0 top-10 z-30 w-40 bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#1E2638] rounded-xl shadow-xl p-1.5 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            onSelectReport(rpt);
                          }}
                          className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E2638] text-[#0F172A] dark:text-white font-medium cursor-pointer"
                        >
                          <Eye className="size-4 text-[#64748B] dark:text-[#94A3B8]" />
                          <span>View Report</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            onSelectReport(rpt);
                          }}
                          className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E2638] text-[#0F172A] dark:text-white font-medium cursor-pointer"
                        >
                          <Download className="size-4 text-[#64748B] dark:text-[#94A3B8]" />
                          <span>Export</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteReport(rpt.id, e)}
                          className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg hover:bg-rose-500/10 text-rose-500 font-medium cursor-pointer"
                        >
                          <Trash2 className="size-4" />
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
      </FadeInView>

      {/* Pagination Footer */}
      <FadeInView offset={16}>
        <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] pt-3 border-t border-slate-100 dark:border-[#1E2638]">
          <span>Showing 1 to {filteredReports.length} of 24 reports</span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638] transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>

            {[1, 2, 3, 4].map((pg) => (
              <button
                key={pg}
                type="button"
                onClick={() => setCurrentPage(pg)}
                className={cn(
                  'size-8 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer',
                  currentPage === pg
                    ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-xs'
                    : 'bg-white dark:bg-[#111622] border border-slate-200/80 dark:border-[#1E2638] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638]',
                )}
              >
                {pg}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(4, currentPage + 1))}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638] transition-colors cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </FadeInView>
    </div>
  );
}
