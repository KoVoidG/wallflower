'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { CurrencyInput } from '@/features/business-profile/components/currency-input';
import { Label } from '@/components/ui/typography';

const schema = z.object({
  headcount: z.number().min(1).max(20),
  salary: z.number().min(15000),
  benefits: z.number().min(0).max(50),
  startMonth: z.number().min(1).max(12),
  rampUpMonths: z.number().min(1).max(12),
});

export type HireEmployeesValues = z.infer<typeof schema>;

interface HireEmployeesFormProps {
  defaultValues?: Partial<HireEmployeesValues>;
  onSubmit: (values: HireEmployeesValues) => void;
  id?: string;
}

export function HireEmployeesForm({ defaultValues, onSubmit, id }: HireEmployeesFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HireEmployeesValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      headcount: 1,
      salary: 25000,
      benefits: 15,
      startMonth: 1,
      rampUpMonths: 3,
      ...defaultValues,
    },
  });

  const salaryValue = watch('salary');

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label as="label" className="block">Number of Hires</Label>
        <input
          type="number"
          min={1}
          max={20}
          {...register('headcount', { valueAsNumber: true })}
          className={cn(
            'w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-[15px] text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors',
            errors.headcount && 'border-danger'
          )}
        />
        {errors.headcount && (
          <span className="text-[12px] text-danger">{errors.headcount.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <CurrencyInput
            id="hire-salary"
            label="Monthly Salary per Person"
            value={salaryValue}
            onChange={(v) => setValue('salary', v === '' ? 0 : v, { shouldValidate: true })}
            error={errors.salary?.message}
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label as="label" className="block">Benefits (% of Salary)</Label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={50}
            {...register('benefits', { valueAsNumber: true })}
            className="flex-1 accent-brand"
          />
          <span className="text-[13px] font-[550] text-text-primary tabular-nums w-10 text-right">
            {watch('benefits')}%
          </span>
        </div>
        {errors.benefits && (
          <span className="text-[12px] text-danger">{errors.benefits.message}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label as="label" className="block">Start Month</Label>
          <input
            type="number"
            min={1}
            max={12}
            {...register('startMonth', { valueAsNumber: true })}
            className={cn(
              'w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-[15px] text-text-primary',
              'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors',
              errors.startMonth && 'border-danger'
            )}
          />
          {errors.startMonth && (
            <span className="text-[12px] text-danger">{errors.startMonth.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label as="label" className="block">Ramp-up Time (Months)</Label>
          <input
            type="number"
            min={1}
            max={12}
            {...register('rampUpMonths', { valueAsNumber: true })}
            className={cn(
              'w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-[15px] text-text-primary',
              'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors',
              errors.rampUpMonths && 'border-danger'
            )}
          />
          {errors.rampUpMonths && (
            <span className="text-[12px] text-danger">{errors.rampUpMonths.message}</span>
          )}
        </div>
      </div>
    </form>
  );
}
