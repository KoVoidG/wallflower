'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog } from '@/components/ui/dialog';
import { MonthPicker } from '@/components/ui/month-picker';
import { financialSnapshotSchema } from '@/features/business-profile/schemas';

// Refine schema inside the component to include future date validation
const snapshotFormSchema = financialSnapshotSchema.extend({
  month: z.coerce.date().refine((date) => {
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), 1);
    const normalizedInput = new Date(date.getFullYear(), date.getMonth(), 1);
    return normalizedInput <= normalizedToday;
  }, {
    message: 'Reporting month cannot be in the future',
  }),
});

type SnapshotFormValues = z.infer<typeof snapshotFormSchema>;

interface SnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SnapshotFormValues, 'month'> & { month: string }) => void;
  existingMonths: string[]; // Formatted as 'YYYY-MM'
}

const DEFAULT_EXPENSE_CATEGORIES = ['Rent', 'Payroll', 'Materials', 'Utilities', 'Marketing'];

export function SnapshotModal({ isOpen, onClose, onSave, existingMonths }: SnapshotModalProps) {
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [expenseEntries, setExpenseEntries] = useState<{ name: string; amount: string }[]>(
    DEFAULT_EXPENSE_CATEGORIES.map((name) => ({ name, amount: '' }))
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<SnapshotFormValues>({
    resolver: zodResolver(snapshotFormSchema),
    defaultValues: {
      month: undefined,
      revenue: undefined,
      cashReserve: undefined,
      receivables: undefined,
      payables: undefined,
      debt: 0,
      expenseCategories: {},
    },
    mode: 'onTouched',
  });

  const selectedMonth = watch('month');

  const getSelectedMonthStr = (dateVal: Date | string | number | null | undefined): string => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const monthStr = getSelectedMonthStr(selectedMonth);
    if (monthStr && existingMonths.includes(monthStr)) {
      setShowDuplicateWarning(true);
    } else {
      setShowDuplicateWarning(false);
    }
  }, [selectedMonth, existingMonths]);

  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [errors]);

  const handleExpenseChange = (index: number, val: string) => {
    const updated = [...expenseEntries];
    updated[index].amount = val;
    setExpenseEntries(updated);

    const categoriesObj: Record<string, number> = {};
    updated.forEach((entry) => {
      if (entry.name && entry.amount !== '') {
        categoriesObj[entry.name] = Number(entry.amount);
      }
    });
    setValue('expenseCategories', categoriesObj, { shouldValidate: true });
  };

  const onSubmitForm = (values: SnapshotFormValues) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const finalValues = {
        ...values,
        month: getSelectedMonthStr(values.month),
      };

      onSave(finalValues);
      reset();
      onClose();
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title="Record Financial Snapshot" size="md">
      {/* Error Summary for A11y */}
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="mb-4 p-3 bg-danger-soft/50 border border-danger/30 rounded-[var(--radius-md)] focus:outline-none"
        >
          <p className="text-[13px]/[20px] font-semibold text-danger">
            Please correct the following errors:
          </p>
          <ul className="list-disc pl-5 mt-1 text-[12px] text-danger/90">
            {errors.month && <li>Month: {errors.month.message?.toString()}</li>}
            {errors.revenue && <li>Revenue: {errors.revenue.message?.toString()}</li>}
            {errors.cashReserve && <li>Cash Reserve: {errors.cashReserve.message?.toString()}</li>}
            {errors.receivables && <li>Receivables: {errors.receivables.message?.toString()}</li>}
            {errors.payables && <li>Payables: {errors.payables.message?.toString()}</li>}
            {errors.debt && <li>Debt: {errors.debt.message?.toString()}</li>}
            {errors.expenseCategories && <li>Expenses: {errors.expenseCategories.message?.toString()}</li>}
          </ul>
        </div>
      )}

      {/* Duplicate Month Notice */}
      {showDuplicateWarning && (
        <div className="flex gap-2 p-3 mb-4 bg-warning-soft text-warning border border-warning/30 rounded-[var(--radius-md)]">
          <AlertTriangle className="size-5 shrink-0" />
          <div className="text-[12px]">
            <span className="font-semibold">Update Mode:</span> A snapshot already exists for this
            month. Saving will update the existing records.
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        {/* 1. Month Picker */}
        <Controller
          control={control}
          name="month"
          render={({ field }) => (
            <MonthPicker
              value={field.value instanceof Date && !isNaN(field.value.getTime()) ? field.value : null}
              onChange={(date) => field.onChange(date)}
              label="Reporting Month"
              error={errors.month?.message?.toString()}
            />
          )}
        />

        {/* Grid for KPIs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Revenue */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="revenue" className="text-[13px]/[18px] font-[550] text-text-primary">
              Monthly Revenue
            </label>
            <input
              id="revenue"
              type="number"
              step="any"
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              {...register('revenue', { valueAsNumber: true })}
              placeholder="0"
              className={cn(
                'w-full px-3 py-2 border rounded-[var(--radius-md)] bg-transparent text-text-primary text-[14px]',
                'focus:outline-none focus:border-brand-strong',
                errors.revenue ? 'border-danger' : 'border-border'
              )}
            />
            {errors.revenue?.message && (
              <span className="text-[12px]/[18px] font-[450] text-danger" role="alert">
                {errors.revenue.message.toString()}
              </span>
            )}
          </div>

          {/* Cash Reserve */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cashReserve" className="text-[13px]/[18px] font-[550] text-text-primary">
              Cash Reserve
            </label>
            <input
              id="cashReserve"
              type="number"
              step="any"
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              {...register('cashReserve', { valueAsNumber: true })}
              placeholder="0"
              className={cn(
                'w-full px-3 py-2 border rounded-[var(--radius-md)] bg-transparent text-text-primary text-[14px]',
                'focus:outline-none focus:border-brand-strong',
                errors.cashReserve ? 'border-danger' : 'border-border'
              )}
            />
            {errors.cashReserve?.message && (
              <span className="text-[12px]/[18px] font-[450] text-danger" role="alert">
                {errors.cashReserve.message.toString()}
              </span>
            )}
          </div>

          {/* Receivables */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="receivables" className="text-[13px]/[18px] font-[550] text-text-primary">
              Receivables
            </label>
            <input
              id="receivables"
              type="number"
              step="any"
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              {...register('receivables', { valueAsNumber: true })}
              placeholder="0"
              className={cn(
                'w-full px-3 py-2 border rounded-[var(--radius-md)] bg-transparent text-text-primary text-[14px]',
                'focus:outline-none focus:border-brand-strong',
                errors.receivables ? 'border-danger' : 'border-border'
              )}
            />
            {errors.receivables?.message && (
              <span className="text-[12px]/[18px] font-[450] text-danger" role="alert">
                {errors.receivables.message.toString()}
              </span>
            )}
          </div>

          {/* Payables */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="payables" className="text-[13px]/[18px] font-[550] text-text-primary">
              Payables
            </label>
            <input
              id="payables"
              type="number"
              step="any"
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              {...register('payables', { valueAsNumber: true })}
              placeholder="0"
              className={cn(
                'w-full px-3 py-2 border rounded-[var(--radius-md)] bg-transparent text-text-primary text-[14px]',
                'focus:outline-none focus:border-brand-strong',
                errors.payables ? 'border-danger' : 'border-border'
              )}
            />
            {errors.payables?.message && (
              <span className="text-[12px]/[18px] font-[450] text-danger" role="alert">
                {errors.payables.message.toString()}
              </span>
            )}
          </div>
        </div>

        {/* Debt */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="debt" className="text-[13px]/[18px] font-[550] text-text-primary">
            Total Debt
          </label>
          <input
            id="debt"
            type="number"
            step="any"
            onKeyDown={(e) => {
              if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                e.preventDefault();
              }
            }}
            {...register('debt', { valueAsNumber: true })}
            placeholder="0"
            className={cn(
              'w-full px-3 py-2 border rounded-[var(--radius-md)] bg-transparent text-text-primary text-[14px]',
              'focus:outline-none focus:border-brand-strong',
              errors.debt ? 'border-danger' : 'border-border'
            )}
          />
          {errors.debt?.message && (
            <span className="text-[12px]/[18px] font-[450] text-danger" role="alert">
              {errors.debt.message.toString()}
            </span>
          )}
        </div>

        {/* Expense Categories */}
        <div className="border-t border-border pt-4">
          <label className="block mb-2 text-[13px]/[18px] font-[550] text-text-primary">
            Expense Breakdown
          </label>
          <div className="grid grid-cols-2 gap-3">
            {expenseEntries.map((entry, index) => (
              <div key={entry.name} className="flex flex-col gap-1">
                <span className="text-[12px] text-text-secondary">{entry.name}</span>
                <input
                  type="number"
                  step="any"
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  value={entry.amount}
                  onChange={(e) => handleExpenseChange(index, e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-1.5 border border-border rounded-[var(--radius-md)] bg-transparent text-text-primary text-[13px] focus:outline-none focus:border-brand-strong"
                />
              </div>
            ))}
          </div>
          {errors.expenseCategories?.message && (
            <span className="text-[12px]/[18px] font-[450] text-danger block mt-2" role="alert">
              {errors.expenseCategories.message.toString()}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-text-secondary hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending ? 'Saving...' : 'Save Snapshot'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
