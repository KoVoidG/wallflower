import { Decimal } from '@prisma/client/runtime/library';

export function toDecimal(val: string | number | Decimal): Decimal {
  if (val instanceof Decimal) return val;
  return new Decimal(val);
}

export function add(a: string | number | Decimal, b: string | number | Decimal): Decimal {
  return toDecimal(a).plus(toDecimal(b));
}

export function subtract(a: string | number | Decimal, b: string | number | Decimal): Decimal {
  return toDecimal(a).minus(toDecimal(b));
}

export function multiply(a: string | number | Decimal, b: string | number | Decimal): Decimal {
  return toDecimal(a).times(toDecimal(b));
}

export function divide(a: string | number | Decimal, b: string | number | Decimal): Decimal {
  const decB = toDecimal(b);
  if (decB.isZero()) return new Decimal(0);
  return toDecimal(a).div(decB);
}

export function formatBaht(amount: string | number | Decimal, includeSymbol = true): string {
  const dec = toDecimal(amount);
  const formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dec.toNumber());
  return includeSymbol ? `฿${formatted}` : formatted;
}

export function formatPercentage(rate: string | number | Decimal): string {
  const dec = toDecimal(rate);
  const formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dec.toNumber());
  return `${formatted}%`;
}
