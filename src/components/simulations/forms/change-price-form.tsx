'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CurrencyInput } from '@/features/business-profile/components/currency-input';
import { Label } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';

const schema = z.object({
  product: z.string().min(1),
  currentPrice: z.number().min(0),
  newPrice: z.number().min(0),
  elasticity: z.number().min(0).max(3),
});

export type ChangePriceValues = z.infer<typeof schema>;

interface ChangePriceFormProps {
  defaultValues?: Partial<ChangePriceValues>;
  onSubmit: (values: ChangePriceValues) => void;
  id?: string;
}

export function ChangePriceForm({ defaultValues, onSubmit, id }: ChangePriceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ChangePriceValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      product: 'main',
      currentPrice: 1500,
      newPrice: 1800,
      elasticity: 1.2,
      ...defaultValues,
    },
  });

  const currentPriceValue = watch('currentPrice');
  const newPriceValue = watch('newPrice');

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Select
          value={watch('product')}
          onChange={(val) => setValue('product', val, { shouldValidate: true })}
          options={[
            { value: 'main', label: 'Main Product' },
            { value: 'secondary', label: 'Secondary Service' },
          ]}
          label="Product/Service"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-[550] text-text-muted">Current Price</span>
          <Badge variant="info">From baseline</Badge>
        </div>
        <CurrencyInput
          id="current-price"
          label=""
          value={currentPriceValue}
          onChange={(v) => setValue('currentPrice', v === '' ? 0 : v, { shouldValidate: true })}
          error={errors.currentPrice?.message}
        />
      </div>

      <CurrencyInput
        id="new-price"
        label="New Price"
        value={newPriceValue}
        onChange={(v) => setValue('newPrice', v === '' ? 0 : v, { shouldValidate: true })}
        error={errors.newPrice?.message}
      />

      <div className="flex flex-col gap-1.5">
        <Label as="label" className="block">Demand Elasticity</Label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            {...register('elasticity', { valueAsNumber: true })}
            className="flex-1 accent-brand"
          />
          <span className="text-[13px] font-[550] text-text-primary tabular-nums w-10 text-right">
            {watch('elasticity')}
          </span>
        </div>
        <span className="text-[12px] text-text-muted">
          Higher elasticity = more demand sensitivity to price change
        </span>
        {errors.elasticity && (
          <span className="text-[12px] text-danger">{errors.elasticity.message}</span>
        )}
      </div>
    </form>
  );
}
