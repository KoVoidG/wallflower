'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  DollarSign,
  FileSpreadsheet,
  Upload,
  Edit3,
  Sparkles,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import { MonthPicker } from '@/components/ui/month-picker';
import { Label, Caption, H2, H3, BodySmall } from '@/components/ui/typography';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { DURATIONS, EASINGS } from '@/components/motion/motion-config';
import {
  OnboardingData,
  BusinessValue,
  createBusinessValue,
  ValueQuality,
  ValueSource,
} from '../schemas';

interface StepAddFinancialsProps {
  data: OnboardingData;
  onChange: (updated: Partial<OnboardingData>) => void;
  onFocusedFieldChange?: (fieldKey: string) => void;
  onLoadSampleData?: () => void;
}

type InputMethod = 'manual' | 'spreadsheet' | 'template' | 'sample';

const FUTURE_INTEGRATIONS = [
  { id: 'google-sheets', label: 'Google Sheets' },
  { id: 'flowaccount', label: 'FlowAccount' },
  { id: 'peak', label: 'PEAK Engine' },
];

const QUALITY_OPTIONS: { value: ValueQuality; label: string }[] = [
  { value: 'actual', label: 'Actual' },
  { value: 'estimate', label: 'Estimated' },
  { value: 'unknown', label: 'Unknown' },
  { value: 'skipped', label: 'Skipped' },
];

export function StepAddFinancials({
  data,
  onChange,
  onFocusedFieldChange,
  onLoadSampleData,
}: StepAddFinancialsProps) {
  const [method, setMethod] = useState<InputMethod>('manual');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    revenue: '',
    expenses: '',
    cash: '',
    receivables: '',
    payables: '',
    debt: '',
  });

  const prefersReduced = useReducedMotion();
  const financials = data.financials;
  const sectionQuality = financials.revenueQuality || 'actual';

  const getReportingDate = (): Date => {
    if (financials.reportingPeriod) {
      const parsed = new Date(`${financials.reportingPeriod}-01`);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  };

  const handleMonthPickerChange = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const str = `${year}-${month}`;
    onChange({
      financials: { ...financials, reportingPeriod: str },
    });
  };

  const setSectionQuality = (quality: ValueQuality) => {
    onChange({
      financials: {
        ...financials,
        revenueQuality: quality === 'estimate' ? 'estimate' : 'actual',
      },
    });
  };

  const updateFinancialValue = (
    key: keyof OnboardingData['financials'],
    numericVal: number | null,
    quality: ValueQuality = sectionQuality,
    source: ValueSource = 'manual'
  ) => {
    onFocusedFieldChange?.(key as string);
    const existing = (financials[key] as BusinessValue) || createBusinessValue();
    onChange({
      financials: {
        ...financials,
        [key]: {
          ...existing,
          value: numericVal,
          quality,
          source,
          confirmedByUser: true,
        },
      },
    });
  };

  const updateExpenseCategory = (
    catName: string,
    numericVal: number | null,
    quality: ValueQuality = sectionQuality
  ) => {
    onFocusedFieldChange?.('expenses');
    const existingBreakdown = financials.expenseBreakdown || {};
    const updatedBreakdown = {
      ...existingBreakdown,
      [catName]: createBusinessValue(numericVal, quality, 'manual'),
    };

    let total = 0;
    let hasVal = false;
    Object.values(updatedBreakdown).forEach((bv) => {
      if (bv.value !== null && !isNaN(bv.value)) {
        total += bv.value;
        hasVal = true;
      }
    });

    onChange({
      financials: {
        ...financials,
        expenseBreakdown: updatedBreakdown,
        monthlyExpenses: createBusinessValue(hasVal ? total : null, quality, 'manual'),
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length > 0) {
        const headers = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
        const rows = lines.slice(1).map((line) => line.split(',').map((cell) => cell.replace(/^["']|["']$/g, '').trim()));
        setParsedHeaders(headers);
        setParsedRows(rows);

        const autoMap: Record<string, string> = { ...columnMapping };
        headers.forEach((h) => {
          const lower = h.toLowerCase();
          if (lower.includes('rev') || lower.includes('income')) autoMap.revenue = h;
          if (lower.includes('exp') || lower.includes('cost')) autoMap.expenses = h;
          if (lower.includes('cash') || lower.includes('bank')) autoMap.cash = h;
          if (lower.includes('receiv') || lower.includes('ar')) autoMap.receivables = h;
          if (lower.includes('payab') || lower.includes('ap')) autoMap.payables = h;
          if (lower.includes('debt') || lower.includes('loan')) autoMap.debt = h;
        });
        setColumnMapping(autoMap);
      }
    };
    reader.readAsText(file);
  };

  const applySpreadsheetImport = () => {
    if (parsedRows.length === 0) return;
    const firstRow = parsedRows[0];

    const getVal = (colName: string): number | null => {
      const idx = parsedHeaders.indexOf(colName);
      if (idx === -1 || !firstRow[idx]) return null;
      const num = parseFloat(firstRow[idx].replace(/[^0-9.-]+/g, ''));
      return isNaN(num) ? null : num;
    };

    const rev = getVal(columnMapping.revenue);
    const exp = getVal(columnMapping.expenses);
    const cash = getVal(columnMapping.cash);
    const rec = getVal(columnMapping.receivables);
    const pay = getVal(columnMapping.payables);
    const debt = getVal(columnMapping.debt);

    onChange({
      financials: {
        ...financials,
        monthlyRevenue: createBusinessValue(rev, 'actual', 'spreadsheet'),
        typicalRevenue: createBusinessValue(rev, 'actual', 'spreadsheet'),
        monthlyExpenses: createBusinessValue(exp, 'actual', 'spreadsheet'),
        availableCash: createBusinessValue(cash, 'actual', 'spreadsheet'),
        receivables: createBusinessValue(rec, 'actual', 'spreadsheet'),
        upcomingPayables: createBusinessValue(pay, 'actual', 'spreadsheet'),
        totalDebt: createBusinessValue(debt, 'actual', 'spreadsheet'),
      },
    });
    setMethod('manual');
  };

  const downloadWallflowerTemplate = () => {
    const csvContent =
      'Reporting Period,Monthly Revenue (THB),Monthly Expenses (THB),Available Cash (THB),Receivables (THB),Payables Due (THB),Total Debt (THB)\n' +
      `${new Date().toISOString().substring(0, 7)},280000,195000,420000,65000,48000,260000\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wallflower_baseline_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand font-bold text-sm">
            2
          </div>
          <div>
            <H2 className="text-xl font-bold text-text-primary">Financial Data Baseline</H2>
            <BodySmall className="text-text-secondary">
              Provide your core monthly figures (in THB) to compute runway and risk exposure.
            </BodySmall>
          </div>
        </div>
      </div>

      {/* Input Method Selector Cards */}
      <div className="space-y-3">
        <Label className="block text-xs font-semibold uppercase tracking-wide">
          Choose Entry Method
        </Label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setMethod('manual')}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3.5 text-left transition-all cursor-pointer select-none',
              method === 'manual'
                ? 'border-brand bg-brand-soft/20 text-brand shadow-2xs font-semibold'
                : 'border-border bg-surface text-text-primary hover:bg-surface-subtle'
            )}
          >
            <div className="flex size-7 items-center justify-center rounded-md bg-brand-soft text-brand">
              <Edit3 className="size-3.5" />
            </div>
            <div>
              <Label className="text-xs font-bold block">Enter Manually</Label>
              <Caption className="text-[11px] text-text-muted">Type figures directly with field quality chips.</Caption>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMethod('spreadsheet')}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3.5 text-left transition-all cursor-pointer select-none',
              method === 'spreadsheet'
                ? 'border-brand bg-brand-soft/20 text-brand shadow-2xs font-semibold'
                : 'border-border bg-surface text-text-primary hover:bg-surface-subtle'
            )}
          >
            <div className="flex size-7 items-center justify-center rounded-md bg-brand-soft text-brand">
              <Upload className="size-3.5" />
            </div>
            <div>
              <Label className="text-xs font-bold block">Upload CSV</Label>
              <Caption className="text-[11px] text-text-muted">Upload & auto-map spreadsheet columns.</Caption>
            </div>
          </button>

          <button
            type="button"
            onClick={downloadWallflowerTemplate}
            className="flex flex-col items-start gap-2 rounded-lg border border-border bg-surface p-3.5 text-left hover:bg-surface-subtle transition-colors cursor-pointer select-none"
          >
            <div className="flex size-7 items-center justify-center rounded-md bg-brand-soft text-brand">
              <Download className="size-3.5" />
            </div>
            <div>
              <Label className="text-xs font-bold text-text-primary block">CSV Template</Label>
              <Caption className="text-[11px] text-text-muted">Download pre-formatted CSV template.</Caption>
            </div>
          </button>

          <button
            type="button"
            onClick={onLoadSampleData}
            className="flex flex-col items-start gap-2 rounded-lg border border-border bg-surface p-3.5 text-left hover:bg-surface-subtle transition-colors cursor-pointer select-none"
          >
            <div className="flex size-7 items-center justify-center rounded-md bg-brand-soft text-brand">
              <Sparkles className="size-3.5" />
            </div>
            <div>
              <Label className="text-xs font-bold text-text-primary block">Sample Business</Label>
              <Caption className="text-[11px] text-text-muted">Populate with realistic sample figures.</Caption>
            </div>
          </button>
        </div>

        {/* Future Integration Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Caption className="text-text-muted text-[11px]">Direct Connections:</Caption>
          {FUTURE_INTEGRATIONS.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-surface-subtle/50 px-2 py-0.5 text-[11px] text-text-muted"
            >
              <span>{item.label}</span>
              <span className="rounded bg-border px-1 py-0.2 text-[9px] uppercase font-bold">
                Coming later
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Spreadsheet Upload & Mapping Section */}
      {method === 'spreadsheet' && (
        <div className="rounded-lg border border-brand/40 bg-surface p-4 space-y-4">
          <div className="flex items-center justify-between">
            <H3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-brand" />
              Spreadsheet Column Mapper
            </H3>
            <Caption className="text-text-muted text-[11px]">Processed locally in browser</Caption>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-5 text-center space-y-2">
            <Upload className="size-5 text-brand mx-auto" />
            <BodySmall className="text-xs text-text-primary font-medium">Select a CSV file from your computer</BodySmall>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block mx-auto text-xs text-text-muted file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-brand-soft file:text-brand cursor-pointer"
            />
          </div>

          {parsedHeaders.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-border/60">
              <Label className="block text-xs font-semibold uppercase tracking-wide">
                Map Columns to Wallflower Fields
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.keys(columnMapping).map((key) => (
                  <div key={key}>
                    <Select
                      label={`${key.charAt(0).toUpperCase() + key.slice(1)} Field`}
                      value={columnMapping[key]}
                      onChange={(val) => setColumnMapping({ ...columnMapping, [key]: val })}
                      options={parsedHeaders.map((h) => ({ value: h, label: h }))}
                      placeholder="Select column..."
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={applySpreadsheetImport}
                  className="rounded bg-brand px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-hover transition-colors cursor-pointer"
                >
                  Apply Field Mapping
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Financial Data Entry */}
      <div className="space-y-6">
        {/* Section Header + Default Quality Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border bg-surface-subtle/40 p-3.5">
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 text-brand" />
            <div>
              <H3 className="text-sm font-bold text-text-primary">Financial Figures (THB)</H3>
              <Caption className="text-[11px]">Values format automatically with thousands separators.</Caption>
            </div>
          </div>

          {/* Section Default Quality Segmented Selector */}
          <div className="flex items-center gap-2">
            <Caption className="text-[11px] font-semibold text-text-muted shrink-0">
              Default Quality:
            </Caption>
            <div className="inline-flex rounded-md border border-border bg-surface p-0.5">
              <button
                type="button"
                onClick={() => setSectionQuality('actual')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer',
                  sectionQuality === 'actual'
                    ? 'bg-brand text-white'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                Actual Records
              </button>
              <button
                type="button"
                onClick={() => setSectionQuality('estimate')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer',
                  sectionQuality === 'estimate'
                    ? 'bg-brand text-white'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                Best Estimates
              </button>
            </div>
          </div>
        </div>

        {/* Month Selector */}
        <div className="w-full sm:w-72">
          <MonthPicker
            label="Reporting Month & Year"
            value={getReportingDate()}
            onChange={handleMonthPickerChange}
          />
        </div>

        {/* Core Financial Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormattedCurrencyField
            label="Monthly Revenue (THB)"
            businessValue={financials.monthlyRevenue || createBusinessValue(150000, sectionQuality)}
            onChangeVal={(val, quality, source) => updateFinancialValue('monthlyRevenue', val, quality, source)}
            onFocus={() => onFocusedFieldChange?.('revenue')}
            placeholder="150,000"
          />

          <FormattedCurrencyField
            label="Typical Monthly Revenue (THB)"
            businessValue={financials.typicalRevenue || createBusinessValue(150000, sectionQuality)}
            onChangeVal={(val, quality, source) => updateFinancialValue('typicalRevenue', val, quality, source)}
            onFocus={() => onFocusedFieldChange?.('revenue')}
            placeholder="150,000"
          />

          <FormattedCurrencyField
            label="Monthly Operating Expenses (THB)"
            businessValue={financials.monthlyExpenses || createBusinessValue(105000, sectionQuality)}
            onChangeVal={(val, quality, source) => updateFinancialValue('monthlyExpenses', val, quality, source)}
            onFocus={() => onFocusedFieldChange?.('expenses')}
            placeholder="105,000"
          />

          <FormattedCurrencyField
            label="Available Cash Reserves (THB)"
            businessValue={financials.availableCash || createBusinessValue(240000, sectionQuality)}
            onChangeVal={(val, quality, source) => updateFinancialValue('availableCash', val, quality, source)}
            onFocus={() => onFocusedFieldChange?.('cash')}
            placeholder="240,000"
          />

          <FormattedCurrencyField
            label="Outstanding Receivables (THB)"
            businessValue={financials.receivables || createBusinessValue(35000, sectionQuality)}
            onChangeVal={(val, quality, source) => updateFinancialValue('receivables', val, quality, source)}
            onFocus={() => onFocusedFieldChange?.('receivables')}
            placeholder="35,000"
          />

          <FormattedCurrencyField
            label="Overdue Receivables (THB)"
            businessValue={financials.overdueReceivables || createBusinessValue(10000, sectionQuality)}
            onChangeVal={(val, quality, source) => updateFinancialValue('overdueReceivables', val, quality, source)}
            onFocus={() => onFocusedFieldChange?.('receivables')}
            placeholder="10,000"
          />

          <FormattedCurrencyField
            label="Payables Due Within 30 Days (THB)"
            businessValue={financials.upcomingPayables || createBusinessValue(28000, sectionQuality)}
            onChangeVal={(val, quality, source) => updateFinancialValue('upcomingPayables', val, quality, source)}
            onFocus={() => onFocusedFieldChange?.('payables')}
            placeholder="28,000"
          />

          <FormattedCurrencyField
            label="Total Outstanding Debt (THB)"
            businessValue={financials.totalDebt || createBusinessValue(140000, sectionQuality)}
            onChangeVal={(val, quality, source) => updateFinancialValue('totalDebt', val, quality, source)}
            onFocus={() => onFocusedFieldChange?.('debt')}
            placeholder="140,000"
          />
        </div>

        {/* Expandable Expense Breakdown Section with Motion Collapse/Expand */}
        <div className="rounded-lg border border-border/70 bg-surface p-4 space-y-3 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowBreakdown((prev) => !prev)}
            className="flex items-center justify-between w-full text-left cursor-pointer"
          >
            <div>
              <Label className="text-xs font-bold text-text-primary uppercase tracking-wide block">
                Detailed Expense Breakdown (Optional)
              </Label>
              <Caption className="text-[11px] text-text-muted">
                Specify payroll, rent, materials, utilities, marketing, or other cost lines.
              </Caption>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
              <span>{showBreakdown ? 'Hide breakdown' : 'Add expense breakdown'}</span>
              {showBreakdown ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {showBreakdown && (
              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
                animate={prefersReduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                exit={prefersReduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { duration: DURATIONS.cardPanel, ease: EASINGS.default }
                }
                className="overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-border/60"
              >
                {['Payroll', 'Rent', 'Materials', 'Utilities', 'Marketing', 'Other'].map((cat) => {
                  const itemBv =
                    financials.expenseBreakdown?.[cat] || createBusinessValue(null, sectionQuality);
                  return (
                    <FormattedCurrencyField
                      key={cat}
                      label={`${cat} (THB)`}
                      businessValue={itemBv}
                      onChangeVal={(val, quality) => updateExpenseCategory(cat, val, quality)}
                      onFocus={() => onFocusedFieldChange?.('expenses')}
                      placeholder="0"
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Formatted Currency Input Field Component (Fully Reactive) ───────────────

interface FormattedCurrencyFieldProps {
  label: string;
  businessValue: BusinessValue;
  onChangeVal: (value: number | null, quality: ValueQuality, source: ValueSource) => void;
  onFocus?: () => void;
  placeholder?: string;
}

function FormattedCurrencyField({
  label,
  businessValue,
  onChangeVal,
  onFocus,
  placeholder = '0',
}: FormattedCurrencyFieldProps) {
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const isUnknownOrSkipped =
    businessValue.quality === 'unknown' || businessValue.quality === 'skipped';

  // Derive displayed formatted value directly from props so it never goes stale!
  const displayValue =
    isUnknownOrSkipped
      ? ''
      : businessValue.value !== null && !isNaN(businessValue.value)
      ? new Intl.NumberFormat('en-US').format(businessValue.value)
      : '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') {
      onChangeVal(null, businessValue.quality, businessValue.source);
    } else {
      const num = parseInt(val, 10);
      onChangeVal(num, businessValue.quality, businessValue.source);
    }
  };

  const getQualityBadgeLabel = (): string => {
    if (businessValue.source === 'spreadsheet') return 'Imported';
    if (businessValue.source === 'sample') return 'Sample';
    if (businessValue.quality === 'actual') return 'Actual';
    if (businessValue.quality === 'estimate') return 'Estimated';
    if (businessValue.quality === 'unknown') return 'Unknown';
    return 'Skipped';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-text-primary cursor-pointer">{label}</label>

        {/* Small Clickable Quality / Source Override Chip */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowQualityMenu((prev) => !prev)}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer',
              businessValue.quality === 'actual' && 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
              businessValue.quality === 'estimate' && 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30',
              businessValue.quality === 'unknown' && 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30',
              businessValue.quality === 'skipped' && 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30',
              businessValue.source === 'spreadsheet' && 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/30'
            )}
          >
            <span>{getQualityBadgeLabel()}</span>
            <ChevronDown className="size-2.5" />
          </button>

          {/* Quality Selector Popover Menu */}
          {showQualityMenu && (
            <div className="absolute right-0 z-50 mt-1 w-32 rounded-md border border-border bg-surface p-1 shadow-lg text-left">
              {QUALITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setShowQualityMenu(false);
                    if (opt.value === 'unknown' || opt.value === 'skipped') {
                      onChangeVal(null, opt.value, 'manual');
                    } else {
                      onChangeVal(businessValue.value || 0, opt.value, 'manual');
                    }
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded px-2 py-1 text-xs font-medium cursor-pointer',
                    businessValue.quality === opt.value
                      ? 'bg-brand-soft text-brand font-semibold'
                      : 'text-text-primary hover:bg-surface-subtle'
                  )}
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* THB Currency Prefix Input */}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-xs font-bold text-text-muted select-none">
          THB ฿
        </span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          disabled={isUnknownOrSkipped}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={onFocus}
          placeholder={isUnknownOrSkipped ? '—' : placeholder}
          className={cn(
            'w-full rounded-md border border-border bg-surface pl-16 pr-3 py-2 text-xs sm:text-sm font-semibold text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none tabular-nums',
            isUnknownOrSkipped && 'bg-surface-subtle opacity-60 cursor-not-allowed'
          )}
        />
      </div>
    </div>
  );
}
