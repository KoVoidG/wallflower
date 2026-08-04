'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  FileText,
  Printer,
  X,
  Download,
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
      {/* Document page outline with folded top-right corner */}
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
      {/* Grey text lines inside top half of document */}
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
      {/* Grid horizontal row lines inside spreadsheet */}
      <line x1="21" y1="11" x2="31" y2="11" stroke="#107C41" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="16" x2="31" y2="16" stroke="#107C41" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="21" x2="31" y2="21" stroke="#107C41" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="26" x2="31" y2="26" stroke="#107C41" strokeWidth="2" strokeLinecap="round" />

      {/* Left Green Perspective Cover with large white 'X' */}
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
      <div className="relative w-full max-w-md bg-surface border border-border-strong rounded-2xl shadow-2xl space-y-5 p-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-tertiary/15 text-tertiary">
                <FileText className="size-4" />
              </div>
              <h3 className="font-display text-base font-bold text-text-primary">
                Export Report
              </h3>
            </div>
            <p className="text-xs text-text-secondary">
              Choose format and customize your report
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Formats Grid */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
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
                  ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 shadow-2xs font-bold'
                  : 'border-border bg-surface-subtle/50 text-text-secondary hover:border-red-400/50 hover:bg-red-500/5'
              )}
            >
              <PdfIcon />
              <div>
                <span className="text-xs block font-bold text-red-600 dark:text-red-400">PDF</span>
                <span className="text-[9px] text-text-muted font-normal block leading-tight">
                  Best for sharing & printing
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
                  : 'border-border bg-surface-subtle/50 text-text-secondary hover:border-emerald-400/50 hover:bg-emerald-500/5'
              )}
            >
              <ExcelIcon />
              <div>
                <span className={cn('text-xs block font-bold', format === 'excel' ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-primary')}>
                  Excel
                </span>
                <span className="text-[9px] text-text-muted font-normal block leading-tight">
                  Best for data analysis
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
                  ? 'border-tertiary bg-tertiary/10 text-tertiary shadow-2xs font-bold'
                  : 'border-border bg-surface-subtle/50 text-text-secondary hover:border-border-strong hover:text-text-primary'
              )}
            >
              <Printer className="size-5" />
              <div>
                <span className="text-xs block font-bold">Print</span>
                <span className="text-[9px] text-text-muted font-normal block leading-tight">
                  Print-ready format
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Include Options (Checkboxes) */}
        <div className="space-y-2.5 pt-1">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
            Include in Report
          </label>

          <div className="space-y-2 text-xs font-medium text-text-primary">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="size-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span>Include Charts & Graphs</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAI}
                onChange={(e) => setIncludeAI(e.target.checked)}
                className="size-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span>Include AI Insights</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRisk}
                onChange={(e) => setIncludeRisk(e.target.checked)}
                className="size-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span>Include Risk Assessment</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAssumptions}
                onChange={(e) => setIncludeAssumptions(e.target.checked)}
                className="size-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span>Include Assumptions</span>
            </label>
          </div>
        </div>

        {/* Page Setup Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
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
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
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
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold cursor-pointer border-border-strong px-4"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="text-xs font-bold gap-1.5 cursor-pointer bg-tertiary text-on-primary hover:bg-tertiary-hover shadow-2xs px-4"
          >
            {isExporting ? (
              <>
                <div className="size-3.5 rounded-full border-2 border-on-primary border-t-transparent animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="size-3.5" />
                <span>Export Report</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
