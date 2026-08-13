import { describe, it, expect } from 'vitest';
import {
  calculatePriceIncrease,
  calculateHireEmployee,
  calculateSupplierCostReduction,
  calculateHolidayPromotion,
  calculateEquipmentPurchase,
  calculateInventoryExpansion,
  calculateNewBranch,
  calculateCustomScenario,
  runScenarioCalculation,
} from '@/features/simulations/engine/simulation-engine';
import { BUSINESS_BASELINE } from '@/features/simulations/engine/business-baseline';

describe('Deterministic Simulation Engine', () => {
  it('calculates Price Increase scenario properly', () => {
    const preview = calculatePriceIncrease({
      priceChangePercent: 5,
      demandResponsePercent: -3,
      supplierCostChangePercent: 2,
      marketingSpendChangePercent: 3,
      timeHorizonMonths: 6,
    });

    expect(preview.projectedRevenue).toBeGreaterThan(BUSINESS_BASELINE.monthlyRevenue);
    expect(preview.revenueChangePercent).toBeCloseTo(1.85, 1);
    expect(preview.drivers.positive.length).toBeGreaterThan(0);
    expect(preview.drivers.negative.length).toBeGreaterThan(0);
  });

  it('calculates Hire Employee scenario properly', () => {
    const preview = calculateHireEmployee({
      numberOfEmployees: 1,
      monthlySalary: 18000,
      hiringOnboardingCost: 15000,
      additionalMonthlySales: 60000,
      rampUpMonths: 3,
      timeHorizonMonths: 12,
    });

    expect(preview.projectedRevenue).toBeGreaterThan(BUSINESS_BASELINE.monthlyRevenue);
    expect(preview.breakEvenMonth).toBeDefined();
    expect(preview.roi).toBeDefined();
  });

  it('calculates Supplier Cost Reduction properly', () => {
    const preview = calculateSupplierCostReduction({
      costReductionPercent: 8,
      purchaseVolumeChangePercent: 10,
      timeHorizonMonths: 6,
    });

    expect(preview.projectedProfit).toBeGreaterThan(BUSINESS_BASELINE.monthlyProfit);
    expect(preview.outlookExplanation).toContain('Gross margin');
  });

  it('calculates Holiday Promotion properly', () => {
    const preview = calculateHolidayPromotion({
      marketingBudget: 50000,
      discountPercent: 15,
      campaignDurationWeeks: 4,
      trafficIncreasePercent: 25,
      conversionIncreasePercent: 10,
      averageOrderValueChange: -5,
      repeatCustomerPercent: 20,
    });

    expect(preview.projectedRevenue).toBeGreaterThan(0);
    expect(preview.roi).toBeDefined();
  });

  it('calculates Equipment Purchase properly', () => {
    const preview = calculateEquipmentPurchase({
      purchasePrice: 350000,
      financingMethod: 'loan',
      usefulLifeYears: 5,
      monthlyMaintenanceCost: 2000,
      capacityIncreasePercent: 20,
      laborCostReductionPercent: 10,
      operatingCostReductionPercent: 5,
      timeHorizonMonths: 12,
    });

    expect(preview.paybackPeriodMonths).toBeDefined();
    expect(preview.projectedRevenue).toBeGreaterThan(BUSINESS_BASELINE.monthlyRevenue);
  });

  it('calculates Inventory Expansion properly', () => {
    const preview = calculateInventoryExpansion({
      inventoryIncreasePercent: 20,
      demandIncreasePercent: 15,
      sellThroughRatePercent: 85,
      holdingCostPercent: 2,
      timeHorizonMonths: 6,
    });

    expect(preview.projectedRevenue).toBeGreaterThan(BUSINESS_BASELINE.monthlyRevenue);
  });

  it('calculates Open New Branch properly', () => {
    const preview = calculateNewBranch({
      rentDeposit: 90000,
      renovationCost: 250000,
      equipmentCost: 150000,
      initialInventory: 80000,
      initialMarketing: 30000,
      monthlyRent: 35000,
      monthlyStaffCost: 45000,
      monthlyUtilities: 8000,
      monthlyMarketing: 10000,
      expectedMonthlyRevenue: 350000,
      revenueRampUpMonths: 4,
      timeHorizonMonths: 12,
    });

    expect(preview.projectedRevenue).toBeGreaterThan(BUSINESS_BASELINE.monthlyRevenue);
    expect(preview.breakEvenMonth).toBeDefined();
  });

  it('calculates Custom Scenario properly', () => {
    const preview = calculateCustomScenario([
      { key: 'revenue', currentValue: 1200000, changeValue: 50000, unit: 'currency' },
      { key: 'marketing', currentValue: 40000, changeValue: 10000, unit: 'currency' },
    ]);

    expect(preview.projectedRevenue).toBe(1250000);
    expect(preview.projectedProfit).toBe(BUSINESS_BASELINE.monthlyProfit + 40000);
  });

  it('dispatches to correct scenario calculator with runScenarioCalculation', () => {
    const preview = runScenarioCalculation('price_increase', {
      priceChangePercent: 5,
      demandResponsePercent: -3,
    });

    expect(preview.projectedRevenue).toBeGreaterThan(BUSINESS_BASELINE.monthlyRevenue);
  });
});
