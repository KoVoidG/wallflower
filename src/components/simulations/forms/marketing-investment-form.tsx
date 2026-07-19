'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { CurrencyInput } from '@/features/business-profile/components/currency-input';
import { Label } from '@/components/ui/typography';
import { Select } from '@/components/ui/select';

const schema = z.object({
  budget: z.number().min(5000),
  channel: z.string().min(1),
  duration: z.number().min(1).max(12),
  expectedReach: z.number().min(100),
});

export type MarketingInvestmentValues = z.infer<typeof schema>;

interface MarketingInvestmentFormProps {
  defaultValues?: Partial<MarketingInvestmentValues>;
  onSubmit: (values: MarketingInvestmentValues) => void;
  id?: string;
}

export function MarketingInvestmentForm({ defaultValues, onSubmit, id }: MarketingInvestmentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MarketingInvestmentValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      budget: 50000,
      channel: 'social',
      duration: 3,
      expectedReach: 10000,
      ...defaultValues,
    },
  });

  const budgetValue = watch('budget');

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <CurrencyInput
        id="marketing-budget"
        label="Campaign Budget"
        value={budgetValue}
        onChange={(v) => setValue('budget', v === '' ? 0 : v, { shouldValidate: true })}
        error={errors.budget?.message}
      />

      <div className="flex flex-col gap-1.5">
        <Select
          value={watch('channel')}
          onChange={(val) => setValue('channel', val, { shouldValidate: true })}
          options={[
            { value: 'social', label: 'Social Media' },
            { value: 'search', label: 'Search Ads' },
            { value: 'offline', label: 'Offline' },
          ]}
          label="Channel"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label as="label" className="block">Duration (Months)</Label>
        <input
          type="number"
          min={1}
          max={12}
          {...register('duration', { valueAsNumber: true })}
          className={cn(
            'w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-[15px] text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors',
            errors.duration && 'border-danger'
          )}
        />
        {errors.duration && (
          <span className="text-[12px] text-danger">{errors.duration.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label as="label" className="block">Expected Reach (People)</Label>
        <input
          type="number"
          min={100}
          {...register('expectedReach', { valueAsNumber: true })}
          className={cn(
            'w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-[15px] text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors',
            errors.expectedReach && 'border-danger'
          )}
        />
        {errors.expectedReach && (
          <span className="text-[12px] text-danger">{errors.expectedReach.message}</span>
        )}
      </div>
    </form>
  );
}
