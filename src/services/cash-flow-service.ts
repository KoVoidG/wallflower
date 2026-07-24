// src/services/cash-flow-service.ts
import type { CashFlowEvent, CashFlowForecast, ReceivableAgingBucket, ExpenseCategoryBreakdown, DataConfidence } from '@/types/domain';

export interface CashPosition {
  totalCash: number;
  reservedCash: number;
  usableCash: number;
  minimumSafeCash: number;
  expectedEndingBalance: number;
  estimatedRunwayMonths: number;
}

export interface CashForecastPoint {
  period: string;
  historicalBalance?: number;
  expectedBalance: number;
  conservativeCase: number;
  optimisticCase: number;
  safeMinimumThreshold: number;
}

export interface CashGapWarning {
  hasGap: boolean;
  gapAmount: number;
  expectedTiming: string;
  mainCause: string;
  confidence: DataConfidence;
  suggestedSimulations: { label: string; href: string }[];
}

export interface UpcomingPayable {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  dueDate: string;
  isHighPressure: boolean;
}

export interface CashFlowServiceResponse {
  position: CashPosition;
  forecastPoints: CashForecastPoint[];
  forecasts: CashFlowForecast[];
  events: CashFlowEvent[];
  gapWarning: CashGapWarning;
  receivablesAging: ReceivableAgingBucket[];
  upcomingPayables: UpcomingPayable[];
  expenseBreakdown: ExpenseCategoryBreakdown[];
  metadata: {
    lastUpdated: string;
    staleDays: number;
    completenessScore: number;
  };
}

export class CashFlowService {
  static async fetchCashFlowData(simulatedDelayMs = 0, triggerError = false): Promise<CashFlowServiceResponse> {
    if (simulatedDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));
    }

    if (triggerError) {
      throw new Error('Failed to load cash flow workspace data. Please check baseline inputs.');
    }

    return {
      position: {
        totalCash: 345000,
        reservedCash: 100000,
        usableCash: 245000,
        minimumSafeCash: 164800,
        expectedEndingBalance: 302600,
        estimatedRunwayMonths: 2.1,
      },
      forecastPoints: [
        { period: 'Nov 2024', historicalBalance: 380000, expectedBalance: 380000, conservativeCase: 380000, optimisticCase: 380000, safeMinimumThreshold: 160000 },
        { period: 'Dec 2024', historicalBalance: 360000, expectedBalance: 360000, conservativeCase: 360000, optimisticCase: 360000, safeMinimumThreshold: 160000 },
        { period: 'Jan 2025', historicalBalance: 345000, expectedBalance: 345000, conservativeCase: 345000, optimisticCase: 345000, safeMinimumThreshold: 164800 },
        { period: 'Feb 2025', expectedBalance: 332600, conservativeCase: 310000, optimisticCase: 350000, safeMinimumThreshold: 164800 },
        { period: 'Mar 2025', expectedBalance: 319600, conservativeCase: 285000, optimisticCase: 342000, safeMinimumThreshold: 164800 },
        { period: 'Apr 2025', expectedBalance: 314600, conservativeCase: 270000, optimisticCase: 340000, safeMinimumThreshold: 164800 },
        { period: 'May 2025', expectedBalance: 302600, conservativeCase: 240000, optimisticCase: 335000, safeMinimumThreshold: 164800 },
      ],
      forecasts: [
        { period: 'Feb 2025', baselineCash: 345000, expectedInflow: 152400, expectedOutflow: 164800, projectedEndingCash: 332600, runwayMonths: 2.0, isDeficit: true },
        { period: 'Mar 2025', baselineCash: 332600, expectedInflow: 155000, expectedOutflow: 168000, projectedEndingCash: 319600, runwayMonths: 1.9, isDeficit: true },
        { period: 'Apr 2025', baselineCash: 319600, expectedInflow: 160000, expectedOutflow: 165000, projectedEndingCash: 314600, runwayMonths: 1.9, isDeficit: true },
        { period: 'May 2025', baselineCash: 314600, expectedInflow: 158000, expectedOutflow: 170000, projectedEndingCash: 302600, runwayMonths: 1.8, isDeficit: true },
      ],
      events: [
        { id: 'ev-1', title: 'Office Rent & Facilities', amount: 32000, type: 'outflow', category: 'Rent', expectedDate: '2025-02-01', status: 'confirmed', quality: 'actual' },
        { id: 'ev-2', title: 'Client Invoice #1042 Payment', amount: 35000, type: 'inflow', category: 'Customer Payment', expectedDate: '2025-02-05', status: 'expected', quality: 'actual' },
        { id: 'ev-3', title: 'Supplier Raw Materials Payment', amount: 28400, type: 'outflow', category: 'Supplier Payment', expectedDate: '2025-02-12', status: 'confirmed', quality: 'actual' },
        { id: 'ev-4', title: 'Equipment Maintenance Invoice', amount: 12500, type: 'outflow', category: 'Planned Expense', expectedDate: '2025-02-15', status: 'at_risk', quality: 'estimated' },
        { id: 'ev-5', title: 'Staff Payroll', amount: 85000, type: 'outflow', category: 'Payroll', expectedDate: '2025-02-28', status: 'confirmed', quality: 'actual' },
        { id: 'ev-6', title: 'SME Bank Loan Installment', amount: 15000, type: 'outflow', category: 'Loan Payment', expectedDate: '2025-02-28', status: 'confirmed', quality: 'actual' },
      ],
      gapWarning: {
        hasGap: true,
        gapAmount: 12400,
        expectedTiming: 'Late February 2025',
        mainCause: 'Monthly operating expenses (฿164,800) currently exceed customer inflows (฿152,400) combined with overdue receivables.',
        confidence: 'high',
        suggestedSimulations: [
          { label: 'Simulate Payment Delay', href: '/simulations/new?type=payment_delay' },
          { label: 'Simulate Equipment Financing', href: '/simulations/new?type=purchase_equipment' },
          { label: 'Create Action Plan Item', href: '/actions' },
        ],
      },
      receivablesAging: [
        { bucket: 'current', label: 'Current (0-30 days)', amount: 32000, invoiceCount: 3, riskLevel: 'low' },
        { bucket: '31_60_days', label: '31-60 days overdue', amount: 14340, invoiceCount: 2, riskLevel: 'medium' },
        { bucket: '61_90_days', label: '61-90 days overdue', amount: 7000, invoiceCount: 1, riskLevel: 'high' },
        { bucket: 'over_90_days', label: 'Over 90 days', amount: 0, invoiceCount: 0, riskLevel: 'critical' },
      ],
      upcomingPayables: [
        { id: 'pay-1', vendor: 'Bangkok Commercial Properties', category: 'Rent', amount: 32000, dueDate: '2025-02-01', isHighPressure: true },
        { id: 'pay-2', vendor: 'Siam Materials Co.', category: 'Supplies', amount: 28400, dueDate: '2025-02-12', isHighPressure: false },
        { id: 'pay-3', vendor: 'Kasikorn Thai SME Loan', category: 'Debt', amount: 15000, dueDate: '2025-02-28', isHighPressure: true },
      ],
      expenseBreakdown: [
        { category: 'payroll', label: 'Payroll & Salaries', amount: 85000, percentageOfTotal: 51.6, quality: 'actual', isEssential: true },
        { category: 'rent', label: 'Rent & Facilities', amount: 32000, percentageOfTotal: 19.4, quality: 'actual', isEssential: true },
        { category: 'inventory', label: 'Raw Materials & Supplies', amount: 28400, percentageOfTotal: 17.2, quality: 'actual', isEssential: true },
        { category: 'marketing', label: 'Marketing & Ads', amount: 12000, percentageOfTotal: 7.3, quality: 'estimated', isEssential: false },
        { category: 'utilities', label: 'Utilities & Software', amount: 7400, percentageOfTotal: 4.5, quality: 'actual', isEssential: true },
      ],
      metadata: {
        lastUpdated: '2025-01-15',
        staleDays: 5,
        completenessScore: 90,
      },
    };
  }
}
