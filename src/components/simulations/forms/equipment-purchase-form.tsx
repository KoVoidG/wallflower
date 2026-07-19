'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { CurrencyInput } from '@/features/business-profile/components/currency-input';
import { Label } from '@/components/ui/typography';

const schema = z.object({
  cost: z.number().min(10000),
  usefulLife: z.number().min(1).max(20),
  maintenance: z.number().min(0),
  financing: z.string().min(1),
});

export type EquipmentPurchaseValues = z.infer<typeof schema>;

interface EquipmentPurchaseFormProps {
  defaultValues?: Partial<EquipmentPurchaseValues>;
  onSubmit: (values: EquipmentPurchaseValues) => void;
  id?: string;
}

export function EquipmentPurchaseForm({ defaultValues, onSubmit, id }: EquipmentPurchaseFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EquipmentPurchaseValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cost: 200000,
      usefulLife: 5,
      maintenance: 12000,
      financing: 'cash',
      ...defaultValues,
    },
  });

  const costValue = watch('cost');
  const maintenanceValue = watch('maintenance');

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <CurrencyInput
        id="equipment-cost"
        label="Equipment Cost"
        value={costValue}
        onChange={(v) => setValue('cost', v === '' ? 0 : v, { shouldValidate: true })}
        error={errors.cost?.message}
      />

      <div className="flex flex-col gap-1.5">
        <Label as="label" className="block">Useful Life (Years)</Label>
        <input
          type="number"
          min={1}
          max={20}
          {...register('usefulLife', { valueAsNumber: true })}
          className={cn(
            'w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-[15px] text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors',
            errors.usefulLife && 'border-danger'
          )}
        />
        {errors.usefulLife && (
          <span className="text-[12px] text-danger">{errors.usefulLife.message}</span>
        )}
      </div>

      <CurrencyInput
        id="annual-maintenance"
        label="Annual Maintenance Cost"
        value={maintenanceValue}
        onChange={(v) => setValue('maintenance', v === '' ? 0 : v, { shouldValidate: true })}
        error={errors.maintenance?.message}
      />

      <div className="flex flex-col gap-1.5">
        <Label as="label" className="block">Financing Method</Label>
        <select
          {...register('financing')}
          className={cn(
            'w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-[15px] text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors'
          )}
        >
          <option value="cash">Cash Purchase</option>
          <option value="loan">Business Loan</option>
          <option value="lease">Lease</option>
        </select>
      </div>
    </form>
  );
}
