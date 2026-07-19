'use client';

import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  TrendingUp,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Pencil,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { H2, H3, Body, Label, Caption } from '@/components/ui/typography';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/motion';
import { Select } from '@/components/ui/select';
import { MonthPicker } from '@/components/ui/month-picker';
import {
  onboardingSchema,
  businessProfileSchema,
  financialSnapshotSchema,
  INDUSTRY_VALUES,
  BUSINESS_TYPE_VALUES,
  STAGE_VALUES,
  SIZE_VALUES,
} from '../schemas';
import type { OnboardingData } from '../schemas';
import { StepIndicator } from './step-indicator';
import { CurrencyInput } from './currency-input';

// --- Constants ---

const STEPS = [
  { label: 'Business Info', description: 'Tell us about your business' },
  { label: 'Financials', description: 'Your financial snapshot' },
  { label: 'Review', description: 'Confirm and submit' },
];

const INDUSTRY_LABELS: Record<string, string> = {
  food_beverage: 'Food & Beverage',
  retail: 'Retail',
  service: 'Service',
  technology: 'Technology',
  manufacturing: 'Manufacturing',
  agriculture: 'Agriculture',
  tourism: 'Tourism & Hospitality',
  healthcare: 'Healthcare',
  education: 'Education',
  other: 'Other',
};

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  sole_proprietor: 'Sole Proprietor',
  partnership: 'Partnership',
  limited_company: 'Limited Company',
  corporation: 'Corporation',
  other: 'Other',
};

const STAGE_LABELS: Record<string, string> = {
  idea: 'Idea Stage',
  startup: 'Startup',
  growing: 'Growing',
  established: 'Established',
  declining: 'Declining',
};

const SIZE_LABELS: Record<string, string> = {
  solo: 'Solo (1 person)',
  micro: 'Micro (2-5 people)',
  small: 'Small (6-30 people)',
  medium: 'Medium (31-100 people)',
};

const COMMON_GOALS = [
  'Increase revenue',
  'Reduce costs',
  'Expand to new markets',
  'Improve cash flow',
  'Hire employees',
  'Get funding',
  'Go digital',
  'Export products',
];

const DEFAULT_EXPENSE_CATEGORIES = ['Rent', 'Payroll', 'Materials', 'Utilities', 'Marketing'];

// --- Props ---

interface OnboardingFormProps {
  onSubmit: (data: OnboardingData) => Promise<void>;
}

// --- Component ---

export function OnboardingForm({ onSubmit }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customGoal, setCustomGoal] = useState('');

  // Expense categories state: array of {name, amount} for UI management
  const [expenseEntries, setExpenseEntries] = useState<{ name: string; amount: number | '' }[]>(
    DEFAULT_EXPENSE_CATEGORIES.map((name) => ({ name, amount: '' }))
  );

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      business: {
        name: '',
        industry: undefined,
        type: undefined,
        stage: undefined,
        size: undefined,
        location: '',
        goals: [],
      },
      financial: {
        month: new Date(),
        revenue: 0,
        expenseCategories: {},
        cashReserve: 0,
        receivables: 0,
        payables: 0,
        debt: 0,
      },
    },
    mode: 'onTouched',
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const goals = watch('business.goals');

  const fillMockData = useCallback(() => {
    reset({
      business: {
        name: 'Mock Cafe',
        industry: 'food_beverage',
        type: 'sole_proprietor',
        stage: 'startup',
        size: 'micro',
        location: 'Bangkok, Thailand',
        goals: ['Increase revenue', 'Reduce costs', 'Improve cash flow'],
      },
      financial: {
        month: new Date(),
        revenue: 150000,
        expenseCategories: {
          'Rent': 30000,
          'Payroll': 50000,
          'Materials': 40000,
        },
        cashReserve: 200000,
        receivables: 15000,
        payables: 25000,
        debt: 100000,
      }
    });
    setExpenseEntries([
      { name: 'Rent', amount: 30000 },
      { name: 'Payroll', amount: 50000 },
      { name: 'Materials', amount: 40000 },
    ]);
  }, [reset]);

  // --- Sync helpers ---

  const syncExpensesToForm = useCallback(() => {
    const record: Record<string, number> = {};
    for (const entry of expenseEntries) {
      if (entry.name.trim() && entry.amount !== '' && entry.amount >= 0) {
        record[entry.name.trim()] = entry.amount;
      }
    }
    setValue('financial.expenseCategories', record, { shouldValidate: false });
  }, [expenseEntries, setValue]);

  // --- Step validation ---

  const validateCurrentStep = useCallback(async () => {
    if (currentStep === 1) {
      const businessValues = getValues('business');
      const result = businessProfileSchema.safeParse(businessValues);
      if (!result.success) {
        await trigger('business');
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      // Sync expense entries to form before validation
      syncExpensesToForm();
      const financialValues = getValues('financial');
      const result = financialSnapshotSchema.safeParse(financialValues);
      if (!result.success) {
        await trigger('financial');
        return false;
      }
      return true;
    }
    return true;
  }, [currentStep, getValues, trigger, syncExpensesToForm]);

  // --- Navigation ---

  const goNext = async () => {
    const valid = await validateCurrentStep();
    if (valid && currentStep < 3) {
      setCurrentStep((s) => s + 1);
    }
  };

  const goPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // --- Goals management ---

  const addGoal = (goal: string) => {
    const current = getValues('business.goals') || [];
    if (current.length >= 5) return;
    if (current.includes(goal)) return;
    setValue('business.goals', [...current, goal], { shouldValidate: true });
  };

  const removeGoal = (goal: string) => {
    const current = getValues('business.goals') || [];
    setValue(
      'business.goals',
      current.filter((g) => g !== goal),
      { shouldValidate: true }
    );
  };

  const addCustomGoal = () => {
    const trimmed = customGoal.trim();
    if (trimmed && (goals?.length ?? 0) < 5 && !goals?.includes(trimmed)) {
      addGoal(trimmed);
      setCustomGoal('');
    }
  };

  // --- Expense entries management ---

  const addExpenseEntry = () => {
    setExpenseEntries((prev) => [...prev, { name: '', amount: '' }]);
  };

  const removeExpenseEntry = (index: number) => {
    setExpenseEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExpenseEntry = (index: number, field: 'name' | 'amount', value: string | number) => {
    setExpenseEntries((prev) =>
      prev.map((entry, i) => {
        if (i !== index) return entry;
        if (field === 'name') return { ...entry, name: value as string };
        return { ...entry, amount: value === '' ? '' : Number(value) };
      })
    );
  };

  // --- Submit ---

  const onFormSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    syncExpensesToForm();
    await handleSubmit(onFormSubmit)();
  };

  // --- Render helpers ---

  const renderSelectField = (
    name: 'business.industry' | 'business.type' | 'business.stage' | 'business.size',
    label: string,
    options: readonly string[],
    labels: Record<string, string>
  ) => {
    const fieldError = name.split('.').reduce<unknown>((obj, key) => {
      if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[key];
      return undefined;
    }, errors) as { message?: string } | undefined;

    const selectOptions = options.map((opt) => ({
      value: opt,
      label: labels[opt] || opt,
    }));

    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value || ''}
            onChange={(val) => {
              field.onChange(val);
              field.onBlur();
            }}
            options={selectOptions}
            label={label}
            placeholder="Select..."
            error={fieldError?.message}
          />
        )}
      />
    );
  };

  // --- Step 1: Business Information ---

  const renderStep1 = () => (
    <FadeIn>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center size-10 rounded-full bg-brand-soft">
            <Building2 className="size-5 text-brand" />
          </div>
          <div>
            <H3>Business Information</H3>
            <Body>Tell us about your business</Body>
          </div>
        </div>

        {/* Business Name */}
        <div className="flex flex-col gap-1.5">
          <Label as="label" className="block">
            Business Name
          </Label>
          <input
            {...register('business.name')}
            type="text"
            placeholder="e.g. ร้านกาแฟสดชื่น"
            aria-invalid={!!errors.business?.name}
            aria-describedby={errors.business?.name ? 'business-name-error' : undefined}
            className={cn(
              'w-full px-3 py-2 rounded-[var(--radius-md)] border bg-surface text-text-primary text-[15px]',
              'placeholder:text-text-muted outline-none transition-colors',
              'focus:ring-2 focus:ring-brand/20 focus:border-brand',
              errors.business?.name ? 'border-danger' : 'border-border'
            )}
          />
          {errors.business?.name && (
            <span id="business-name-error" className="text-[12px] text-danger" role="alert">
              {errors.business.name.message}
            </span>
          )}
        </div>

        {/* Industry & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSelectField('business.industry', 'Industry', INDUSTRY_VALUES, INDUSTRY_LABELS)}
          {renderSelectField('business.type', 'Business Type', BUSINESS_TYPE_VALUES, BUSINESS_TYPE_LABELS)}
        </div>

        {/* Stage & Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSelectField('business.stage', 'Business Stage', STAGE_VALUES, STAGE_LABELS)}
          {renderSelectField('business.size', 'Business Size', SIZE_VALUES, SIZE_LABELS)}
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <Label as="label" className="block">
            Location
          </Label>
          <input
            {...register('business.location')}
            type="text"
            placeholder="e.g. เชียงใหม่, ประเทศไทย"
            aria-invalid={!!errors.business?.location}
            aria-describedby={errors.business?.location ? 'business-location-error' : undefined}
            className={cn(
              'w-full px-3 py-2 rounded-[var(--radius-md)] border bg-surface text-text-primary text-[15px]',
              'placeholder:text-text-muted outline-none transition-colors',
              'focus:ring-2 focus:ring-brand/20 focus:border-brand',
              errors.business?.location ? 'border-danger' : 'border-border'
            )}
          />
          {errors.business?.location && (
            <span id="business-location-error" className="text-[12px] text-danger" role="alert">
              {errors.business.location.message}
            </span>
          )}
        </div>

        {/* Goals */}
        <div className="flex flex-col gap-2">
          <Label as="label" className="block">
            Business Goals
          </Label>
          <Caption>Select 1-5 goals or add your own</Caption>

          {/* Selected goals */}
          {goals && goals.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2" role="list" aria-label="Selected goals">
              {goals.map((goal) => (
                <Badge key={goal} variant="brand" className="gap-1 pr-1.5">
                  {goal}
                  <button
                    type="button"
                    onClick={() => removeGoal(goal)}
                    aria-label={`Remove goal: ${goal}`}
                    className="ml-1 p-0.5 rounded-full hover:bg-brand/20 transition-colors cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Common goals chips */}
          <div className="flex flex-wrap gap-2">
            {COMMON_GOALS.filter((g) => !goals?.includes(g)).map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => addGoal(goal)}
                disabled={(goals?.length ?? 0) >= 5}
                className={cn(
                  'px-3 py-1 rounded-full text-[13px] border border-border text-text-secondary',
                  'hover:border-brand hover:text-brand transition-colors cursor-pointer',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                {goal}
              </button>
            ))}
          </div>

          {/* Custom goal input */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomGoal();
                }
              }}
              placeholder="Add custom goal..."
              disabled={(goals?.length ?? 0) >= 5}
              className={cn(
                'flex-1 px-3 py-1.5 rounded-[var(--radius-md)] border border-border bg-surface text-text-primary text-[14px]',
                'placeholder:text-text-muted outline-none transition-colors',
                'focus:ring-2 focus:ring-brand/20 focus:border-brand',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
              aria-label="Custom goal"
            />
            <button
              type="button"
              onClick={addCustomGoal}
              disabled={(goals?.length ?? 0) >= 5 || !customGoal.trim()}
              className={cn(
                'px-3 py-1.5 rounded-[var(--radius-md)] bg-brand text-white text-[13px] font-[550]',
                'hover:bg-brand-hover transition-colors cursor-pointer',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            >
              Add
            </button>
          </div>

          {errors.business?.goals && (
            <span className="text-[12px] text-danger" role="alert">
              {errors.business.goals.message}
            </span>
          )}
        </div>
      </div>
    </FadeIn>
  );

  // --- Step 2: Financial Snapshot ---

  const renderStep2 = () => (
    <FadeIn>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center size-10 rounded-full bg-brand-soft">
            <TrendingUp className="size-5 text-brand" />
          </div>
          <div>
            <H3>Financial Snapshot</H3>
            <Body>Your current financial overview</Body>
          </div>
        </div>

        {/* Month Period */}
        <Controller
          control={control}
          name="financial.month"
          render={({ field }) => (
            <MonthPicker
              value={field.value instanceof Date && !isNaN(field.value.getTime()) ? field.value : null}
              onChange={(date) => field.onChange(date)}
              label="Reporting Month"
              error={errors.financial?.month?.message}
            />
          )}
        />

        {/* Revenue */}
        <Controller
          control={control}
          name="financial.revenue"
          render={({ field }) => (
            <CurrencyInput
              id="financial-revenue"
              label="Monthly Revenue"
              value={field.value || ''}
              onChange={(val) => field.onChange(val === '' ? 0 : val)}
              onBlur={field.onBlur}
              error={errors.financial?.revenue?.message}
              placeholder="e.g. 150000"
            />
          )}
        />

        {/* Expense Categories */}
        <Surface variant="subtle" border className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label as="span">Expense Categories</Label>
              <Caption className="block mt-0.5">Add your monthly business expenses</Caption>
            </div>
            <button
              type="button"
              onClick={addExpenseEntry}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 rounded-[var(--radius-md)]',
                'text-[13px] font-[550] text-brand border border-brand/30',
                'hover:bg-brand-soft transition-colors cursor-pointer'
              )}
            >
              <Plus className="size-3.5" />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {expenseEntries.map((entry, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1 flex flex-col gap-1">
                  {index === 0 && <Caption>Category</Caption>}
                  <input
                    type="text"
                    value={entry.name}
                    onChange={(e) => updateExpenseEntry(index, 'name', e.target.value)}
                    placeholder="Category name"
                    aria-label={`Expense category ${index + 1} name`}
                    className={cn(
                      'w-full px-3 py-2 rounded-[var(--radius-md)] border border-border bg-surface text-text-primary text-[14px]',
                      'placeholder:text-text-muted outline-none transition-colors',
                      'focus:ring-2 focus:ring-brand/20 focus:border-brand'
                    )}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  {index === 0 && <Caption>Amount (THB)</Caption>}
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    value={entry.amount === '' ? '' : entry.amount}
                    onChange={(e) => updateExpenseEntry(index, 'amount', e.target.value === '' ? '' : Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="0"
                    aria-label={`Expense category ${index + 1} amount`}
                    className={cn(
                      'w-full px-3 py-2 rounded-[var(--radius-md)] border border-border bg-surface text-text-primary text-[14px] tabular-nums',
                      'placeholder:text-text-muted outline-none transition-colors',
                      'focus:ring-2 focus:ring-brand/20 focus:border-brand',
                      '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExpenseEntry(index)}
                  aria-label={`Remove expense category: ${entry.name || `item ${index + 1}`}`}
                  className={cn(
                    'p-2 rounded-[var(--radius-md)] text-text-muted',
                    'hover:text-danger hover:bg-danger-soft transition-colors cursor-pointer'
                  )}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {errors.financial?.expenseCategories && (
            <span className="text-[12px] text-danger" role="alert">
              {typeof errors.financial.expenseCategories.message === 'string'
                ? errors.financial.expenseCategories.message
                : 'Please add at least one expense category'}
            </span>
          )}
        </Surface>

        {/* Cash & Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="financial.cashReserve"
            render={({ field }) => (
              <CurrencyInput
                id="financial-cash-reserve"
                label="Cash Reserve"
                value={field.value || ''}
                onChange={(val) => field.onChange(val === '' ? 0 : val)}
                onBlur={field.onBlur}
                error={errors.financial?.cashReserve?.message}
                placeholder="e.g. 500000"
              />
            )}
          />
          <Controller
            control={control}
            name="financial.receivables"
            render={({ field }) => (
              <CurrencyInput
                id="financial-receivables"
                label="Receivables"
                value={field.value || ''}
                onChange={(val) => field.onChange(val === '' ? 0 : val)}
                onBlur={field.onBlur}
                error={errors.financial?.receivables?.message}
                placeholder="e.g. 80000"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="financial.payables"
            render={({ field }) => (
              <CurrencyInput
                id="financial-payables"
                label="Payables"
                value={field.value || ''}
                onChange={(val) => field.onChange(val === '' ? 0 : val)}
                onBlur={field.onBlur}
                error={errors.financial?.payables?.message}
                placeholder="e.g. 45000"
              />
            )}
          />
          <Controller
            control={control}
            name="financial.debt"
            render={({ field }) => (
              <CurrencyInput
                id="financial-debt"
                label="Total Debt"
                value={field.value || ''}
                onChange={(val) => field.onChange(val === '' ? 0 : val)}
                onBlur={field.onBlur}
                error={errors.financial?.debt?.message}
                placeholder="e.g. 200000"
              />
            )}
          />
        </div>
      </div>
    </FadeIn>
  );

  // --- Step 3: Review & Submit ---

  const renderStep3 = () => {
    const values = getValues();
    const totalExpenses = Object.values(values.financial.expenseCategories || {}).reduce(
      (sum, val) => sum + (val || 0),
      0
    );

    return (
      <FadeIn>
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center size-10 rounded-full bg-brand-soft">
              <ClipboardCheck className="size-5 text-brand" />
            </div>
            <div>
              <H3>Review & Submit</H3>
              <Body>Confirm your information before submitting</Body>
            </div>
          </div>

          {/* Business Summary */}
          <Surface variant="subtle" border>
            <div className="flex items-center justify-between mb-4">
              <Label as="span" className="flex items-center gap-2">
                <Building2 className="size-4 text-brand" />
                Business Information
              </Label>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="flex items-center gap-1 text-[13px] text-brand hover:text-brand-hover transition-colors cursor-pointer"
              >
                <Pencil className="size-3" />
                Edit
              </button>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[14px]">
              <div>
                <dt className="text-text-muted text-[12px]">Name</dt>
                <dd className="text-text-primary font-[500]">{values.business.name || '—'}</dd>
              </div>
              <div>
                <dt className="text-text-muted text-[12px]">Industry</dt>
                <dd className="text-text-primary font-[500]">
                  {values.business.industry ? INDUSTRY_LABELS[values.business.industry] : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-[12px]">Type</dt>
                <dd className="text-text-primary font-[500]">
                  {values.business.type ? BUSINESS_TYPE_LABELS[values.business.type] : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-[12px]">Stage</dt>
                <dd className="text-text-primary font-[500]">
                  {values.business.stage ? STAGE_LABELS[values.business.stage] : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-[12px]">Size</dt>
                <dd className="text-text-primary font-[500]">
                  {values.business.size ? SIZE_LABELS[values.business.size] : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-[12px]">Location</dt>
                <dd className="text-text-primary font-[500]">{values.business.location || '—'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-text-muted text-[12px]">Goals</dt>
                <dd className="flex flex-wrap gap-1.5 mt-1">
                  {values.business.goals?.length ? (
                    values.business.goals.map((goal) => (
                      <Badge key={goal} variant="brand">{goal}</Badge>
                    ))
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </dd>
              </div>
            </dl>
          </Surface>

          {/* Financial Summary */}
          <Surface variant="subtle" border>
            <div className="flex items-center justify-between mb-4">
              <Label as="span" className="flex items-center gap-2">
                <TrendingUp className="size-4 text-brand" />
                Financial Snapshot
              </Label>
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="flex items-center gap-1 text-[13px] text-brand hover:text-brand-hover transition-colors cursor-pointer"
              >
                <Pencil className="size-3" />
                Edit
              </button>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[14px]">
              <div>
                <dt className="text-text-muted text-[12px]">Reporting Month</dt>
                <dd className="text-text-primary font-[500]">
                  {values.financial.month instanceof Date && !isNaN(values.financial.month.getTime())
                    ? values.financial.month.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-[12px]">Monthly Revenue</dt>
                <dd className="text-text-primary font-[500] tabular-nums">
                  THB {(values.financial.revenue || 0).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-[12px]">Cash Reserve</dt>
                <dd className="text-text-primary font-[500] tabular-nums">
                  THB {(values.financial.cashReserve || 0).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-[12px]">Receivables</dt>
                <dd className="text-text-primary font-[500] tabular-nums">
                  THB {(values.financial.receivables || 0).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-[12px]">Payables</dt>
                <dd className="text-text-primary font-[500] tabular-nums">
                  THB {(values.financial.payables || 0).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-[12px]">Total Debt</dt>
                <dd className="text-text-primary font-[500] tabular-nums">
                  THB {(values.financial.debt || 0).toLocaleString()}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-text-muted text-[12px]">Expenses (Total: THB {totalExpenses.toLocaleString()})</dt>
                <dd className="mt-1">
                  {Object.keys(values.financial.expenseCategories || {}).length > 0 ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {Object.entries(values.financial.expenseCategories || {}).map(([cat, amt]) => (
                        <span key={cat} className="text-text-secondary text-[13px]">
                          {cat}: <span className="tabular-nums font-[500]">THB {(amt || 0).toLocaleString()}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </dd>
              </div>
            </dl>
          </Surface>
        </div>
      </FadeIn>
    );
  };

  // --- Main render ---

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <StepIndicator steps={STEPS} currentStep={currentStep} className="mb-8" />

      {/* Step title */}
      <div className="flex items-center justify-between mb-2">
        <H2>
          Step {currentStep} of {STEPS.length}
        </H2>
        {process.env.NODE_ENV === 'development' && (
          <button
            type="button"
            onClick={fillMockData}
            className="text-[12px] font-semibold text-brand bg-brand-soft px-3 py-1.5 rounded-[var(--radius-sm)] border border-brand/20 hover:bg-brand-soft/60 transition-colors cursor-pointer"
          >
            Dev Bypass: Fill Mock
          </button>
        )}
      </div>

      {/* Form content */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (currentStep === 3) {
            handleFinalSubmit();
          }
        }}
        noValidate
      >
        <Surface border className="p-6 md:p-8 mb-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </Surface>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goPrevious}
            disabled={currentStep === 1}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)]',
              'text-[14px] font-[550] text-text-secondary border border-border',
              'hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer',
              'disabled:opacity-0 disabled:pointer-events-none'
            )}
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)]',
                'text-[14px] font-[550] text-white bg-brand',
                'hover:bg-brand-hover transition-colors cursor-pointer'
              )}
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-md)]',
                'text-[14px] font-[550] text-white bg-brand',
                'hover:bg-brand-hover transition-colors cursor-pointer',
                'disabled:opacity-60 disabled:cursor-not-allowed'
              )}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
