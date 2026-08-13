// src/lib/calculations/money.ts

/**
 * Represents a numeric-like value: could be a number, string representation,
 * or a Prisma Decimal object (which has .plus(), .minus(), .toNumber() etc.)
 */
type NumericLike = string | number | { toNumber: () => number; plus?: (v: unknown) => unknown; minus?: (v: unknown) => unknown; times?: (v: unknown) => unknown; div?: (v: unknown) => unknown; isZero?: () => boolean };

// Dynamically load Prisma's Decimal on server side to prevent bundling in client components
let DecimalClass: (new (val: string | number) => NumericLike) | null = null;
if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    DecimalClass = require('@prisma/client/runtime/library').Decimal;
  } catch {
    // Fallback if not available
  }
}

export function toDecimal(val: NumericLike): number | NumericLike {
  if (DecimalClass) {
    if (val && typeof val === 'object' && 'toNumber' in val) return val;
    return new DecimalClass(val as string | number);
  }
  return Number(val);
}

export function add(a: NumericLike, b: NumericLike): number | NumericLike {
  const decA = toDecimal(a);
  const decB = toDecimal(b);
  if (DecimalClass && typeof decA === 'object' && decA.plus) {
    return decA.plus(decB) as NumericLike;
  }
  return Number(decA) + Number(decB);
}

export function subtract(a: NumericLike, b: NumericLike): number | NumericLike {
  const decA = toDecimal(a);
  const decB = toDecimal(b);
  if (DecimalClass && typeof decA === 'object' && decA.minus) {
    return decA.minus(decB) as NumericLike;
  }
  return Number(decA) - Number(decB);
}

export function multiply(a: NumericLike, b: NumericLike): number | NumericLike {
  const decA = toDecimal(a);
  const decB = toDecimal(b);
  if (DecimalClass && typeof decA === 'object' && decA.times) {
    return decA.times(decB) as NumericLike;
  }
  return Number(decA) * Number(decB);
}

export function divide(a: NumericLike, b: NumericLike): number | NumericLike {
  const decA = toDecimal(a);
  const decB = toDecimal(b);
  if (DecimalClass && typeof decA === 'object' && decA.div) {
    if (typeof decB === 'object' && decB.isZero && decB.isZero()) {
      return new DecimalClass!(0);
    }
    return decA.div(decB) as NumericLike;
  }
  const numB = Number(decB);
  if (numB === 0) return 0;
  return Number(decA) / numB;
}

export function formatBaht(amount: NumericLike, includeSymbol = true): string {
  let num: number;
  if (typeof amount === 'number') {
    num = amount;
  } else if (amount && typeof amount === 'object' && 'toNumber' in amount) {
    num = amount.toNumber();
  } else {
    num = Number(amount);
  }
  if (isNaN(num)) num = 0;

  const formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
  return includeSymbol ? `฿${formatted}` : formatted;
}

export function formatPercentage(rate: NumericLike): string {
  let num: number;
  if (typeof rate === 'number') {
    num = rate;
  } else if (rate && typeof rate === 'object' && 'toNumber' in rate) {
    num = rate.toNumber();
  } else {
    num = Number(rate);
  }
  if (isNaN(num)) num = 0;

  const formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
  return `${formatted}%`;
}
