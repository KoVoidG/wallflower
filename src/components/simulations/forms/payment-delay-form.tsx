'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { CurrencyInput } from '@/features/business-profile/components/currency-input';
import { Label } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';

const schema = z.object({
  delayDays: z.number().min(1).max(180),
  affectedPercent: z.number().min(1).max(100),
  currentReceivables: z.number().min(0),
});

export type PaymentDelayValues = z.infer<typeof schema>;

interface PaymentDelayFormProps {
  defaultValues?: Partial<PaymentDelayValues>;
  onSubmit: (values: PaymentDelayValues) => void;
  id?: string;
}

export function PaymentDelayForm({ defaultValues, onSubmit, id }: PaymentDelayFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<PaymentDelayValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      delayDays: 30,
      affectedPercent: 40,
      currentReceivables: 53340,
      ...defaultValues,
    },
  });

  const receivablesValue = useWatch({ control, name: 'currentReceivables' });
  const affectedPercentValue = useWatch({ control, name: 'affectedPercent' });

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label as="label" className="block">Average Delay (Days)</Label>
        <input
          type="number"
          min={1}
          max={180}
          {...register('delayDays', { valueAsNumber: true })}
          className={cn(
            'w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs sm:text-sm text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors',
            errors.delayDays && 'border-danger'
          )}
        />
        {errors.delayDays && (
          <span className="text-xs text-danger">{errors.delayDays.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label as="label" className="block">Affected Customers (%)</Label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={100}
            {...register('affectedPercent', { valueAsNumber: true })}
            className="flex-1 accent-brand"
          />
          <span className="text-xs sm:text-sm font-semibold text-text-primary tabular-nums w-10 text-right">
            {affectedPercentValue}%
          </span>
        </div>
        {errors.affectedPercent && (
          <span className="text-xs text-danger">{errors.affectedPercent.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-muted">Current Receivables</span>
          <Badge variant="info">From baseline</Badge>
        </div>
        <CurrencyInput
          id="current-receivables"
          label=""
          value={receivablesValue}
          onChange={(v) => setValue('currentReceivables', v === '' ? 0 : v, { shouldValidate: true })}
          error={errors.currentReceivables?.message}
        />
      </div>
    </form>
  );
}
