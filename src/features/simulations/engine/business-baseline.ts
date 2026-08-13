// src/features/simulations/engine/business-baseline.ts
// Central mock business baseline — single source of truth.
// Represents "what Wallflower already knows" about the business.
// Users never re-enter this data; it's shown read-only in the workspace.

export interface BusinessBaseline {
  // Revenue & Profit
  monthlyRevenue: number;
  grossMarginPercent: number;
  monthlyProfit: number;

  // Cash
  cashBalance: number;
  cashRunwayMonths: number;

  // Pricing & Volume
  averagePrice: number;
  monthlyUnitsSold: number;

  // Cost Structure
  monthlyCOGS: number;
  monthlyOpex: number;
  monthlyPayroll: number;
  monthlyMarketing: number;
  monthlyRent: number;

  // People & Operations
  employeeCount: number;
  inventoryValue: number;
  monthlyUtilities: number;
}

/**
 * Mock baseline for the Wallflower demo.
 * Values represent a mid-sized Thai SME (café / retail).
 * In production, this would come from the connected data layer.
 */
export const BUSINESS_BASELINE: BusinessBaseline = {
  monthlyRevenue: 1_200_000,
  grossMarginPercent: 32.0,
  monthlyProfit: 120_000,
  cashBalance: 320_000,
  cashRunwayMonths: 4.2,
  averagePrice: 250,
  monthlyUnitsSold: 4_800,
  monthlyCOGS: 816_000,
  monthlyOpex: 264_000,
  monthlyPayroll: 180_000,
  monthlyMarketing: 40_000,
  monthlyRent: 45_000,
  employeeCount: 8,
  inventoryValue: 200_000,
  monthlyUtilities: 15_000,
};

/** Format a number as Thai Baht with comma separators */
export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return value < 0 ? `-฿${formatted}` : `฿${formatted}`;
}

/** Format a number as a percentage with sign */
export function formatPercent(value: number, decimals = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/** Format a number as months */
export function formatMonths(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)} mo`;
}
