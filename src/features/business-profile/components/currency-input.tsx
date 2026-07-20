'use client';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/typography';

interface CurrencyInputProps {
  id: string;
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable currency input with THB prefix.
 * Formats number display and handles Thai Baht currency inputs.
 */
export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder = '0',
  className,
  disabled = false,
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange('');
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label as="label" className="block">
        <span id={`${id}-label`}>{label}</span>
      </Label>
      <div
        className={cn(
          'flex items-center rounded-[var(--radius-md)] border transition-colors',
          'focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand',
          error ? 'border-danger' : 'border-border dark:border-border-strong',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className="flex items-center px-3 py-2 bg-surface-subtle border-r border-border text-text-muted text-[13px] font-[550] rounded-l-[var(--radius-md)] select-none"
          aria-hidden="true"
        >
          THB
        </span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={value === '' ? '' : value}
          onChange={handleChange}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
              e.preventDefault();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          aria-labelledby={`${id}-label`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'flex-1 px-3 py-2 bg-transparent text-text-primary text-[15px] tabular-nums',
            'placeholder:text-text-muted outline-none',
            'disabled:cursor-not-allowed',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
          )}
        />
      </div>
      {error && (
        <span id={`${id}-error`} className="text-[12px] text-danger" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
