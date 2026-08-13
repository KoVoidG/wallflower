// src/features/reports/components/export-modal.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import {
  FileText,
  Printer,
  X,
  Download,
  Check,
} from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('size-8 shrink-0', className)}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Document page outline */}
      <path
        d="M10 4 H26 L34 12 V34 C34 36.2 32.2 38 30 38 H10 C7.8 38 6 36.2 6 34 V8 C6 5.8 7.8 4 10 4 Z"
        fill="#FFFFFF"
        stroke="#FF1E1E"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Folded corner line */}
      <path
        d="M26 4 V12 H34"
        fill="none"
        stroke="#FF1E1E"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Grey text lines */}
      <line x1="12" y1="11" x2="24" y2="11" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="12" y1="15" x2="28" y2="15" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="12" y1="19" x2="28" y2="19" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="12" y1="23" x2="28" y2="23" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" />

      {/* Red "PDF" Badge overlapping bottom left */}
      <rect x="4" y="23" width="22" height="12" rx="2" fill="#FF1E1E" />
      <text
        x="15"
        y="32"
        fill="#FFFFFF"
        fontSize="8"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        textAnchor="middle"
      >
        PDF
      </text>
    </svg>
  );
}

function ExcelIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('size-8 shrink-0', className)}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Right Spreadsheet Grid Document */}
      <rect
        x="15"
        y="5"
        width="20"
        height="30"
        rx="2"
        fill="#FFFFFF"
        stroke="#107C41"
        strokeWidth="2.5"
      />
      {/* Grid horizontal row lines */}
      <line x1="21" y1="11" x2="31" y2="11" stroke="#107C41" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="16" x2="31" y2="16" stroke="#107C41" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="21" x2="31" y2="21" stroke="#107C41" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="26" x2="31" y2="26" stroke="#107C41" strokeWidth="2" strokeLinecap="round" />

      {/* Left Green Cover with white 'X' */}
      <path
        d="M4 8 L17 4 V36 L4 32 Z"
        fill="#107C41"
      />
      <text
        x="10.5"
        y="24"
        fill="#FFFFFF"
        fontSize="13"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        textAnchor="middle"
      >
        X
      </text>
    </svg>
  );
}

export function ExportModal({ open, onClose }: ExportModalProps) {
  const [format, setFormat] = useState<'pdf' | 'excel' | 'print'>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAI, setIncludeAI] = useState(true);
  const [includeRisk, setIncludeRisk] = useState(true);
  const [includeAssumptions, setIncludeAssumptions] = useState(true);
  const [pageSize, setPageSize] = useState('A4 (210 x 297 mm)');
  const [orientation, setOrientation] = useState('Portrait');
  const [isExporting, setIsExporting] = useState(false);

  if (!open) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#1E2638] rounded-2xl shadow-2xl space-y-5 p-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center">
                <FileText className="size-4" />
              </div>
              <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                Export Report
              </h3>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Choose format and customize your exported document.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638] transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Formats Grid */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {/* PDF */}
            <button
              type="button"
              onClick={() => setFormat('pdf')}
              className={cn(
                'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer space-y-1.5',
                format === 'pdf'
                  ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-2xs font-bold'
                  : 'border-slate-200 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] text-[#64748B] dark:text-[#94A3B8] hover:border-rose-400/50 hover:bg-rose-500/5'
              )}
            >
              <PdfIcon />
              <div>
                <span className="text-xs block font-bold text-rose-600 dark:text-rose-400">PDF</span>
                <span className="text-[9px] text-[#94A3B8] font-normal block leading-tight">
                  Print & share
                </span>
              </div>
            </button>

            {/* Excel */}
            <button
              type="button"
              onClick={() => setFormat('excel')}
              className={cn(
                'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer space-y-1.5',
                format === 'excel'
                  ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold'
                  : 'border-slate-200 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] text-[#64748B] dark:text-[#94A3B8] hover:border-emerald-400/50 hover:bg-emerald-500/5'
              )}
            >
              <ExcelIcon />
              <div>
                <span className={cn('text-xs block font-bold', format === 'excel' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#0F172A] dark:text-white')}>
                  Excel
                </span>
                <span className="text-[9px] text-[#94A3B8] font-normal block leading-tight">
                  Data analysis
                </span>
              </div>
            </button>

            {/* Print */}
            <button
              type="button"
              onClick={() => setFormat('print')}
              className={cn(
                'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer space-y-1.5',
                format === 'print'
                  ? 'border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1] dark:text-[#A5B4FC] shadow-2xs font-bold'
                  : 'border-slate-200 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] text-[#64748B] dark:text-[#94A3B8] hover:border-[#6366F1]/40 hover:text-[#0F172A] dark:hover:text-white'
              )}
            >
              <Printer className="size-6 text-[#6366F1] dark:text-[#A5B4FC]" />
              <div>
                <span className="text-xs block font-bold">Print</span>
                <span className="text-[9px] text-[#94A3B8] font-normal block leading-tight">
                  Hard copy
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Include Options */}
        <div className="space-y-2.5 pt-1">
          <label className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
            Include in Report
          </label>

          <div className="space-y-2 text-xs font-medium text-[#0F172A] dark:text-white">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className={cn(
                  'size-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#6366F1]',
                  includeCharts
                    ? 'bg-[#6366F1] border-[#6366F1] text-white'
                    : 'border-slate-300 dark:border-[#2A344A] bg-[#F8FAFC] dark:bg-[#0B0F17]'
                )}
              >
                {includeCharts && <Check className="size-3 stroke-[3]" />}
              </div>
              <span>Include Charts & Sparklines</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAI}
                onChange={(e) => setIncludeAI(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className={cn(
                  'size-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#6366F1]',
                  includeAI
                    ? 'bg-[#6366F1] border-[#6366F1] text-white'
                    : 'border-slate-300 dark:border-[#2A344A] bg-[#F8FAFC] dark:bg-[#0B0F17]'
                )}
              >
                {includeAI && <Check className="size-3 stroke-[3]" />}
              </div>
              <span>Include AI Strategic Insights</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeRisk}
                onChange={(e) => setIncludeRisk(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className={cn(
                  'size-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#6366F1]',
                  includeRisk
                    ? 'bg-[#6366F1] border-[#6366F1] text-white'
                    : 'border-slate-300 dark:border-[#2A344A] bg-[#F8FAFC] dark:bg-[#0B0F17]'
                )}
              >
                {includeRisk && <Check className="size-3 stroke-[3]" />}
              </div>
              <span>Include Risk Assessment Matrix</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAssumptions}
                onChange={(e) => setIncludeAssumptions(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className={cn(
                  'size-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#6366F1]',
                  includeAssumptions
                    ? 'bg-[#6366F1] border-[#6366F1] text-white'
                    : 'border-slate-300 dark:border-[#2A344A] bg-[#F8FAFC] dark:bg-[#0B0F17]'
                )}
              >
                {includeAssumptions && <Check className="size-3 stroke-[3]" />}
              </div>
              <span>Include Model Assumptions</span>
            </label>
          </div>
        </div>

        {/* Page Setup Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-[#1E2638]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
              Page Size
            </span>
            <Select
              value={pageSize}
              onChange={setPageSize}
              options={[
                { value: 'A4 (210 x 297 mm)', label: 'A4 (210 x 297 mm)' },
                { value: 'Letter (8.5 x 11 in)', label: 'Letter (8.5 x 11 in)' },
                { value: 'Legal (8.5 x 14 in)', label: 'Legal (8.5 x 14 in)' },
              ]}
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
              Orientation
            </span>
            <Select
              value={orientation}
              onChange={setOrientation}
              options={[
                { value: 'Portrait', label: 'Portrait' },
                { value: 'Landscape', label: 'Landscape' },
              ]}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1E2638]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md shadow-indigo-500/25 hover:opacity-95 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isExporting ? (
              <>
                <div className="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="size-3.5" />
                <span>Export Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
