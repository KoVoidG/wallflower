// src/features/simulations/engine/simulation-engine.ts
// Deterministic frontend simulation engine.
// Pure TypeScript — no API calls, no random numbers.
// All calculations derive outputs from Decision + Assumptions + Baseline.

import { type BusinessBaseline, BUSINESS_BASELINE } from './business-baseline';

// ─── Types ─────────────────────────────────────────────────────────────────

export type OutlookType = 'positive' | 'neutral' | 'negative';

export interface SimulationPreview {
  // Absolute projected values
  projectedRevenue: number;
  projectedProfit: number;
  projectedCashBalance: number;
  projectedCashRunway: number;

  // Change values (delta from baseline)
  revenueChangePercent: number;
  profitChangePercent: number;
  cashBalanceChangePercent: number;
  cashRunwayChangeMonths: number;

  // Decision support
  outlook: OutlookType;
  outlookExplanation: string;
  drivers: { positive: string[]; negative: string[] };
  tip: string;

  // Optional scenario-specific
  roi?: number;
  breakEvenMonth?: number;
  paybackPeriodMonths?: number;
}

// ─── Core Calculation Primitives ───────────────────────────────────────────

export function calculateRevenue(
  baseRevenue: number,
  priceChangePercent: number,
  demandChangePercent: number,
): number {
  const priceFactor = 1 + priceChangePercent / 100;
  const demandFactor = 1 + demandChangePercent / 100;
  return baseRevenue * priceFactor * demandFactor;
}

export function calculateGrossProfit(
  revenue: number,
  cogs: number,
): number {
  return revenue - cogs;
}

export function calculateCashFlow(
  profit: number,
  oneTimeCosts: number,
  months: number,
): number {
  return profit * months - oneTimeCosts;
}

export function calculateCashBalance(
  startingCash: number,
  monthlyCashFlow: number,
  months: number,
): number {
  return startingCash + monthlyCashFlow * months;
}

export function calculateCashRunway(
  cashBalance: number,
  monthlyBurn: number,
): number {
  if (monthlyBurn >= 0) return 99; // Not burning cash
  return Math.max(0, cashBalance / Math.abs(monthlyBurn));
}

export function calculateROI(
  netGain: number,
  totalInvestment: number,
): number {
  if (totalInvestment <= 0) return 0;
  return (netGain / totalInvestment) * 100;
}

export function calculateBreakEven(
  monthlyNetGain: number,
  initialCost: number,
): number {
  if (monthlyNetGain <= 0) return -1; // Never breaks even
  return Math.ceil(initialCost / monthlyNetGain);
}

// ─── Outlook Determination ─────────────────────────────────────────────────

function determineOutlook(
  profitChange: number,
  cashRunwayChange: number,
  cashBalanceChange: number,
): OutlookType {
  const positiveSignals = [
    profitChange > 2,
    cashRunwayChange > 0.3,
    cashBalanceChange > 3,
  ].filter(Boolean).length;

  const negativeSignals = [
    profitChange < -5,
    cashRunwayChange < -0.5,
    cashBalanceChange < -5,
  ].filter(Boolean).length;

  if (negativeSignals >= 2) return 'negative';
  if (positiveSignals >= 2) return 'positive';
  return 'neutral';
}

// ─── Scenario-Specific Calculators ─────────────────────────────────────────

export function calculatePriceIncrease(
  inputs: Record<string, number | string>,
  baseline: BusinessBaseline = BUSINESS_BASELINE,
): SimulationPreview {
  const priceChange = Number(inputs.priceChangePercent) || 0;
  const demandResponse = Number(inputs.demandResponsePercent) || 0;
  const supplierCostChange = Number(inputs.supplierCostChangePercent) || 0;
  const marketingChange = Number(inputs.marketingSpendChangePercent) || 0;
  const months = Number(inputs.timeHorizonMonths) || 6;

  // Derived calculations
  const newRevenue = calculateRevenue(baseline.monthlyRevenue, priceChange, demandResponse);
  const newCOGS = baseline.monthlyCOGS * (1 + supplierCostChange / 100);
  const newMarketing = baseline.monthlyMarketing * (1 + marketingChange / 100);
  const newOpex = baseline.monthlyOpex - baseline.monthlyMarketing + newMarketing;
  const newProfit = newRevenue - newCOGS - newOpex;

  const actualCashBalance = baseline.cashBalance + (newProfit - baseline.monthlyProfit) * months;
  const monthlyBurn = newRevenue - newCOGS - newOpex - baseline.monthlyPayroll;
  const projectedRunway = monthlyBurn < 0
    ? actualCashBalance / Math.abs(monthlyBurn)
    : baseline.cashRunwayMonths + (newProfit - baseline.monthlyProfit) / (baseline.cashBalance / baseline.cashRunwayMonths) * baseline.cashRunwayMonths;

  const revenueChangePercent = ((newRevenue - baseline.monthlyRevenue) / baseline.monthlyRevenue) * 100;
  const profitChangePercent = baseline.monthlyProfit !== 0
    ? ((newProfit - baseline.monthlyProfit) / Math.abs(baseline.monthlyProfit)) * 100
    : newProfit > 0 ? 100 : 0;
  const cashBalChangePercent = ((actualCashBalance - baseline.cashBalance) / baseline.cashBalance) * 100;
  const runwayChange = Math.min(projectedRunway, 20) - baseline.cashRunwayMonths;

  const outlook = determineOutlook(profitChangePercent, runwayChange, cashBalChangePercent);

  const drivers: { positive: string[]; negative: string[] } = { positive: [], negative: [] };
  if (priceChange > 0) drivers.positive.push('Higher average selling price increases revenue per unit');
  if (priceChange > 0 && demandResponse < 0 && (priceChange + demandResponse) > 0)
    drivers.positive.push('Net price effect exceeds demand reduction');
  if (supplierCostChange < 0) drivers.positive.push('Lower supplier costs improve margins');
  if (demandResponse < 0) drivers.negative.push('Expected demand reduction from price sensitivity');
  if (supplierCostChange > 0) drivers.negative.push('Supplier cost increase offsets some margin gains');
  if (marketingChange > 0) drivers.negative.push('Increased marketing spend required to support price change');

  if (drivers.positive.length === 0) drivers.positive.push('No significant positive drivers');
  if (drivers.negative.length === 0) drivers.negative.push('No significant risk factors identified');

  return {
    projectedRevenue: newRevenue,
    projectedProfit: newProfit,
    projectedCashBalance: actualCashBalance,
    projectedCashRunway: Math.min(projectedRunway, 20),
    revenueChangePercent,
    profitChangePercent,
    cashBalanceChangePercent: cashBalChangePercent,
    cashRunwayChangeMonths: runwayChange,
    outlook,
    outlookExplanation: outlook === 'positive'
      ? 'This scenario is projected to improve your profit and cash position while maintaining healthy operational stability.'
      : outlook === 'negative'
        ? 'This scenario may put pressure on profitability and cash reserves. Review the assumptions carefully.'
        : 'This scenario has a mixed impact. Monitor key metrics closely during execution.',
    drivers,
    tip: 'Adjust the demand response assumption to see how sensitive the outcome is to changes in customer behavior.',
  };
}

export function calculateHireEmployee(
  inputs: Record<string, number | string>,
  baseline: BusinessBaseline = BUSINESS_BASELINE,
): SimulationPreview {
  const numEmployees = Number(inputs.numberOfEmployees) || 1;
  const salary = Number(inputs.monthlySalary) || 18000;
  const onboardingCost = Number(inputs.hiringOnboardingCost) || 15000;
  const additionalSales = Number(inputs.additionalMonthlySales) || 60000;
  const rampUp = Number(inputs.rampUpMonths) || 3;
  const months = Number(inputs.timeHorizonMonths) || 12;

  const totalOnboarding = onboardingCost * numEmployees;
  const monthlyPayrollIncrease = salary * numEmployees * 1.15; // 15% benefits overhead

  // Average revenue over the time horizon accounting for ramp-up
  let totalAdditionalRevenue = 0;
  for (let m = 1; m <= months; m++) {
    const rampFactor = Math.min(m / rampUp, 1);
    totalAdditionalRevenue += additionalSales * numEmployees * rampFactor;
  }
  const avgMonthlyAdditionalRevenue = totalAdditionalRevenue / months;

  const newRevenue = baseline.monthlyRevenue + avgMonthlyAdditionalRevenue;
  const newProfit = baseline.monthlyProfit + avgMonthlyAdditionalRevenue - monthlyPayrollIncrease;
  const cashImpact = totalAdditionalRevenue - monthlyPayrollIncrease * months - totalOnboarding;
  const actualCashBalance = baseline.cashBalance + cashImpact;

  const monthlyNetGain = avgMonthlyAdditionalRevenue - monthlyPayrollIncrease;
  const breakEven = calculateBreakEven(monthlyNetGain > 0 ? monthlyNetGain : additionalSales * numEmployees - monthlyPayrollIncrease, totalOnboarding);
  const roi = calculateROI(cashImpact, totalOnboarding + monthlyPayrollIncrease * months);

  const revenueChangePercent = ((newRevenue - baseline.monthlyRevenue) / baseline.monthlyRevenue) * 100;
  const profitChangePercent = baseline.monthlyProfit !== 0
    ? ((newProfit - baseline.monthlyProfit) / Math.abs(baseline.monthlyProfit)) * 100
    : 0;
  const cashBalChangePercent = ((actualCashBalance - baseline.cashBalance) / baseline.cashBalance) * 100;

  const monthlyBurn = newRevenue - baseline.monthlyCOGS - baseline.monthlyOpex - baseline.monthlyPayroll - monthlyPayrollIncrease;
  const projectedRunway = monthlyBurn < 0 ? actualCashBalance / Math.abs(monthlyBurn) : baseline.cashRunwayMonths + 1;
  const runwayChange = Math.min(projectedRunway, 20) - baseline.cashRunwayMonths;

  const outlook = determineOutlook(profitChangePercent, runwayChange, cashBalChangePercent);

  return {
    projectedRevenue: newRevenue,
    projectedProfit: newProfit,
    projectedCashBalance: actualCashBalance,
    projectedCashRunway: Math.min(projectedRunway, 20),
    revenueChangePercent,
    profitChangePercent,
    cashBalanceChangePercent: cashBalChangePercent,
    cashRunwayChangeMonths: runwayChange,
    outlook,
    outlookExplanation: outlook === 'positive'
      ? `New hire(s) are projected to generate sufficient revenue to exceed payroll costs within ${breakEven > 0 ? breakEven : '?'} months.`
      : 'Payroll commitment may exceed revenue gains during the ramp-up period. Ensure sufficient cash buffer.',
    drivers: {
      positive: [
        `Additional revenue capacity of ฿${(additionalSales * numEmployees).toLocaleString()}/mo at full productivity`,
        `${rampUp}-month ramp-up builds revenue gradually`,
      ],
      negative: [
        `Immediate payroll increase of ฿${monthlyPayrollIncrease.toLocaleString()}/mo`,
        `One-time onboarding cost of ฿${totalOnboarding.toLocaleString()}`,
      ],
    },
    tip: `The key question is: when does this employee pay for themselves? Currently projected at month ${breakEven > 0 ? breakEven : '?'}.`,
    roi,
    breakEvenMonth: breakEven > 0 ? breakEven : undefined,
  };
}

export function calculateSupplierCostReduction(
  inputs: Record<string, number | string>,
  baseline: BusinessBaseline = BUSINESS_BASELINE,
): SimulationPreview {
  const costReduction = Number(inputs.costReductionPercent) || 0;
  const volumeChange = Number(inputs.purchaseVolumeChangePercent) || 0;
  const months = Number(inputs.timeHorizonMonths) || 6;

  const newRevenue = baseline.monthlyRevenue * (1 + volumeChange / 100);
  const newCOGS = baseline.monthlyCOGS * (1 - costReduction / 100) * (1 + volumeChange / 100);
  const newProfit = newRevenue - newCOGS - baseline.monthlyOpex;
  const profitDelta = newProfit - baseline.monthlyProfit;
  const actualCashBalance = baseline.cashBalance + profitDelta * months;
  const newGrossMargin = ((newRevenue - newCOGS) / newRevenue) * 100;

  const revenueChangePercent = volumeChange;
  const profitChangePercent = baseline.monthlyProfit !== 0
    ? (profitDelta / Math.abs(baseline.monthlyProfit)) * 100 : 0;
  const cashBalChangePercent = ((actualCashBalance - baseline.cashBalance) / baseline.cashBalance) * 100;
  const monthlyBurn = newRevenue - newCOGS - baseline.monthlyOpex - baseline.monthlyPayroll;
  const projectedRunway = monthlyBurn < 0 ? actualCashBalance / Math.abs(monthlyBurn) : baseline.cashRunwayMonths + profitDelta / (baseline.cashBalance / baseline.cashRunwayMonths);
  const runwayChange = Math.min(projectedRunway, 20) - baseline.cashRunwayMonths;

  const outlook = determineOutlook(profitChangePercent, runwayChange, cashBalChangePercent);

  return {
    projectedRevenue: baseline.monthlyRevenue,
    projectedProfit: newProfit,
    projectedCashBalance: actualCashBalance,
    projectedCashRunway: Math.min(projectedRunway, 20),
    revenueChangePercent,
    profitChangePercent,
    cashBalanceChangePercent: cashBalChangePercent,
    cashRunwayChangeMonths: runwayChange,
    outlook,
    outlookExplanation: `Gross margin improves from ${baseline.grossMarginPercent.toFixed(1)}% to ${newGrossMargin.toFixed(1)}%.`,
    drivers: {
      positive: [
        `COGS reduction of ${costReduction}% directly improves margins`,
        `Gross margin improves to ${newGrossMargin.toFixed(1)}%`,
      ],
      negative: volumeChange > 0
        ? [`Volume commitment increase of ${volumeChange}% may tie up more working capital`]
        : ['No significant risk factors identified'],
    },
    tip: 'Negotiate longer payment terms to offset the working capital impact of higher minimum order quantities.',
  };
}

export function calculateHolidayPromotion(
  inputs: Record<string, number | string>,
  baseline: BusinessBaseline = BUSINESS_BASELINE,
): SimulationPreview {
  const budget = Number(inputs.marketingBudget) || 50000;
  const discount = Number(inputs.discountPercent) || 15;
  const durationWeeks = Number(inputs.campaignDurationWeeks) || 4;
  const trafficIncrease = Number(inputs.trafficIncreasePercent) || 25;
  const conversionIncrease = Number(inputs.conversionIncreasePercent) || 10;
  const aovChange = Number(inputs.averageOrderValueChange) || -5;
  const repeatPercent = Number(inputs.repeatCustomerPercent) || 20;

  const durationMonths = durationWeeks / 4.33;
  const volumeIncrease = (trafficIncrease / 100) * (1 + conversionIncrease / 100);
  const aovFactor = (1 - discount / 100) * (1 + aovChange / 100);
  const promoRevenue = baseline.monthlyRevenue * (1 + volumeIncrease) * aovFactor * durationMonths;
  const normalRevenue = baseline.monthlyRevenue * durationMonths;
  const additionalRevenue = promoRevenue - normalRevenue;
  const repeatRevenue = additionalRevenue * (repeatPercent / 100) * 0.5;
  const totalAdditionalRevenue = additionalRevenue + repeatRevenue;
  const additionalCOGS = totalAdditionalRevenue * (1 - baseline.grossMarginPercent / 100);
  const netProfit = totalAdditionalRevenue - additionalCOGS - budget;
  const marketingROI = calculateROI(netProfit, budget);
  const avgMonthlyImpact = netProfit / Math.max(durationMonths, 1);

  const actualCashBalance = baseline.cashBalance + netProfit;
  const revenueChangePercent = (additionalRevenue / (baseline.monthlyRevenue * durationMonths)) * 100;
  const profitChangePercent = baseline.monthlyProfit !== 0
    ? (avgMonthlyImpact / Math.abs(baseline.monthlyProfit)) * 100 : 0;
  const cashBalChangePercent = ((actualCashBalance - baseline.cashBalance) / baseline.cashBalance) * 100;
  const runwayChange = cashBalChangePercent > 0 ? 0.3 : -0.2;
  const outlook = determineOutlook(profitChangePercent, runwayChange, cashBalChangePercent);

  return {
    projectedRevenue: baseline.monthlyRevenue + avgMonthlyImpact,
    projectedProfit: baseline.monthlyProfit + avgMonthlyImpact,
    projectedCashBalance: actualCashBalance,
    projectedCashRunway: baseline.cashRunwayMonths + runwayChange,
    revenueChangePercent,
    profitChangePercent,
    cashBalanceChangePercent: cashBalChangePercent,
    cashRunwayChangeMonths: runwayChange,
    outlook,
    outlookExplanation: marketingROI > 0
      ? `Marketing ROI is projected at ${marketingROI.toFixed(0)}%. The campaign should generate net positive returns.`
      : 'Marketing spend exceeds projected returns. Consider reducing discount depth or campaign duration.',
    drivers: {
      positive: [
        `${trafficIncrease}% traffic increase drives additional sales volume`,
        `${repeatPercent}% of new customers expected to return`,
      ],
      negative: [
        `${discount}% discount reduces margin per unit`,
        `฿${budget.toLocaleString()} upfront marketing investment required`,
      ],
    },
    tip: 'Focus on converting promotion customers into repeat buyers. Even a small increase in repeat rate significantly improves campaign ROI.',
    roi: marketingROI,
  };
}

export function calculateEquipmentPurchase(
  inputs: Record<string, number | string>,
  baseline: BusinessBaseline = BUSINESS_BASELINE,
): SimulationPreview {
  const price = Number(inputs.purchasePrice) || 350000;
  const maintenance = Number(inputs.monthlyMaintenanceCost) || 2000;
  const capacityIncrease = Number(inputs.capacityIncreasePercent) || 20;
  const laborReduction = Number(inputs.laborCostReductionPercent) || 10;
  const opexReduction = Number(inputs.operatingCostReductionPercent) || 5;
  const months = Number(inputs.timeHorizonMonths) || 12;
  const financing = String(inputs.financingMethod) || 'cash';

  const laborSavings = baseline.monthlyPayroll * (laborReduction / 100);
  const opexSavings = baseline.monthlyOpex * (opexReduction / 100);
  const capacityRevenue = baseline.monthlyRevenue * (capacityIncrease / 100) * 0.5; // 50% utilization assumption
  const monthlySavings = laborSavings + opexSavings + capacityRevenue - maintenance;

  let initialCashImpact: number;
  let monthlyFinancingCost = 0;
  if (financing === 'loan') {
    initialCashImpact = price * 0.2;
    monthlyFinancingCost = (price * 0.8 * 1.07) / (months > 12 ? 60 : 36);
  } else if (financing === 'lease') {
    initialCashImpact = 0;
    monthlyFinancingCost = price / 48;
  } else {
    initialCashImpact = price;
  }

  const netMonthlySavings = monthlySavings - monthlyFinancingCost;
  const payback = calculateBreakEven(netMonthlySavings, initialCashImpact);
  const totalGain = netMonthlySavings * months - initialCashImpact;
  const roi = calculateROI(totalGain, initialCashImpact + monthlyFinancingCost * months);

  const newProfit = baseline.monthlyProfit + netMonthlySavings;
  const actualCashBalance = baseline.cashBalance - initialCashImpact + netMonthlySavings * months;

  const profitChangePercent = baseline.monthlyProfit !== 0
    ? (netMonthlySavings / Math.abs(baseline.monthlyProfit)) * 100 : 0;
  const cashBalChangePercent = ((actualCashBalance - baseline.cashBalance) / baseline.cashBalance) * 100;
  const runwayChange = cashBalChangePercent > 0 ? 0.5 : -0.8;
  const outlook = determineOutlook(profitChangePercent, runwayChange, cashBalChangePercent);

  return {
    projectedRevenue: baseline.monthlyRevenue + capacityRevenue,
    projectedProfit: newProfit,
    projectedCashBalance: actualCashBalance,
    projectedCashRunway: baseline.cashRunwayMonths + runwayChange,
    revenueChangePercent: (capacityRevenue / baseline.monthlyRevenue) * 100,
    profitChangePercent,
    cashBalanceChangePercent: cashBalChangePercent,
    cashRunwayChangeMonths: runwayChange,
    outlook,
    outlookExplanation: payback > 0
      ? `Equipment pays for itself in approximately ${payback} months through combined savings and capacity gains.`
      : 'Monthly costs exceed projected savings. Consider alternative financing or phased implementation.',
    drivers: {
      positive: [
        `Monthly savings of ฿${monthlySavings.toLocaleString()} from efficiency gains`,
        `${capacityIncrease}% capacity increase enables revenue growth`,
      ],
      negative: [
        `Initial cash outlay of ฿${initialCashImpact.toLocaleString()}`,
        `Ongoing maintenance cost of ฿${maintenance.toLocaleString()}/mo`,
      ],
    },
    tip: financing === 'cash'
      ? 'Consider loan financing to preserve cash runway. The monthly savings may exceed loan payments.'
      : 'Ensure monthly savings cover financing payments to maintain positive cash flow.',
    roi,
    paybackPeriodMonths: payback > 0 ? payback : undefined,
  };
}

export function calculateInventoryExpansion(
  inputs: Record<string, number | string>,
  baseline: BusinessBaseline = BUSINESS_BASELINE,
): SimulationPreview {
  const increase = Number(inputs.inventoryIncreasePercent) || 20;
  const demandIncrease = Number(inputs.demandIncreasePercent) || 15;
  const sellThrough = Number(inputs.sellThroughRatePercent) || 85;
  const holdingCost = Number(inputs.holdingCostPercent) || 2;
  const months = Number(inputs.timeHorizonMonths) || 6;

  const additionalInventory = baseline.inventoryValue * (increase / 100);
  const monthlyHoldingCost = additionalInventory * (holdingCost / 100);
  const additionalRevenue = baseline.monthlyRevenue * (demandIncrease / 100) * (sellThrough / 100);
  const additionalProfit = additionalRevenue * (baseline.grossMarginPercent / 100) - monthlyHoldingCost;

  const actualCashBalance = baseline.cashBalance - additionalInventory + additionalProfit * months;
  const newProfit = baseline.monthlyProfit + additionalProfit;

  const profitChangePercent = baseline.monthlyProfit !== 0
    ? (additionalProfit / Math.abs(baseline.monthlyProfit)) * 100 : 0;
  const cashBalChangePercent = ((actualCashBalance - baseline.cashBalance) / baseline.cashBalance) * 100;
  const runwayChange = cashBalChangePercent > 0 ? 0.2 : -0.6;
  const outlook = determineOutlook(profitChangePercent, runwayChange, cashBalChangePercent);

  return {
    projectedRevenue: baseline.monthlyRevenue + additionalRevenue,
    projectedProfit: newProfit,
    projectedCashBalance: actualCashBalance,
    projectedCashRunway: baseline.cashRunwayMonths + runwayChange,
    revenueChangePercent: (additionalRevenue / baseline.monthlyRevenue) * 100,
    profitChangePercent,
    cashBalanceChangePercent: cashBalChangePercent,
    cashRunwayChangeMonths: runwayChange,
    outlook,
    outlookExplanation: sellThrough >= 80
      ? 'Strong sell-through rate supports the inventory expansion with acceptable holding costs.'
      : 'Lower sell-through rate increases overstock risk. Monitor inventory turnover closely.',
    drivers: {
      positive: [
        `${demandIncrease}% demand increase captured with higher stock availability`,
        `Additional revenue of ฿${additionalRevenue.toLocaleString()}/mo`,
      ],
      negative: [
        `฿${additionalInventory.toLocaleString()} cash tied up in inventory`,
        `Monthly holding cost of ฿${monthlyHoldingCost.toLocaleString()}`,
      ],
    },
    tip: 'Cash flow is the critical factor here. The inventory investment ties up cash immediately, while revenue comes in gradually.',
  };
}

export function calculateNewBranch(
  inputs: Record<string, number | string>,
  baseline: BusinessBaseline = BUSINESS_BASELINE,
): SimulationPreview {
  const rentDeposit = Number(inputs.rentDeposit) || 90000;
  const renovation = Number(inputs.renovationCost) || 250000;
  const equipment = Number(inputs.equipmentCost) || 150000;
  const initialInventory = Number(inputs.initialInventory) || 80000;
  const initialMarketing = Number(inputs.initialMarketing) || 30000;
  const monthlyRent = Number(inputs.monthlyRent) || 35000;
  const monthlyStaff = Number(inputs.monthlyStaffCost) || 45000;
  const monthlyUtilities = Number(inputs.monthlyUtilities) || 8000;
  const monthlyMktg = Number(inputs.monthlyMarketing) || 10000;
  const expectedRevenue = Number(inputs.expectedMonthlyRevenue) || 350000;
  const rampUp = Number(inputs.revenueRampUpMonths) || 4;
  const months = Number(inputs.timeHorizonMonths) || 12;

  const initialCash = rentDeposit + renovation + equipment + initialInventory + initialMarketing;
  const monthlyBurn = monthlyRent + monthlyStaff + monthlyUtilities + monthlyMktg;

  let totalRevenue = 0;
  for (let m = 1; m <= months; m++) {
    const rampFactor = Math.min(m / rampUp, 1);
    totalRevenue += expectedRevenue * rampFactor;
  }
  const avgMonthlyRevenue = totalRevenue / months;
  const branchProfit = avgMonthlyRevenue * (baseline.grossMarginPercent / 100) - monthlyBurn;
  const totalCashImpact = -initialCash + (branchProfit * months);
  const actualCashBalance = baseline.cashBalance + totalCashImpact;

  const breakEven = calculateBreakEven(
    expectedRevenue * (baseline.grossMarginPercent / 100) - monthlyBurn,
    initialCash,
  );
  const roi = calculateROI(totalCashImpact, initialCash);

  const profitChangePercent = baseline.monthlyProfit !== 0
    ? (branchProfit / Math.abs(baseline.monthlyProfit)) * 100 : 0;
  const cashBalChangePercent = ((actualCashBalance - baseline.cashBalance) / baseline.cashBalance) * 100;
  const runwayChange = totalCashImpact > 0 ? 0.5 : -1.2;
  const outlook = determineOutlook(profitChangePercent, runwayChange, cashBalChangePercent);

  return {
    projectedRevenue: baseline.monthlyRevenue + avgMonthlyRevenue,
    projectedProfit: baseline.monthlyProfit + branchProfit,
    projectedCashBalance: actualCashBalance,
    projectedCashRunway: baseline.cashRunwayMonths + runwayChange,
    revenueChangePercent: (avgMonthlyRevenue / baseline.monthlyRevenue) * 100,
    profitChangePercent,
    cashBalanceChangePercent: cashBalChangePercent,
    cashRunwayChangeMonths: runwayChange,
    outlook,
    outlookExplanation: breakEven > 0
      ? `New branch is projected to break even in month ${breakEven}. Initial investment of ฿${initialCash.toLocaleString()} is required.`
      : 'Branch monthly costs exceed projected revenue. Review staffing levels or location costs.',
    drivers: {
      positive: [
        `Expected revenue of ฿${expectedRevenue.toLocaleString()}/mo at full capacity`,
        `Market expansion increases business resilience`,
      ],
      negative: [
        `Initial investment of ฿${initialCash.toLocaleString()} required`,
        `Monthly fixed costs of ฿${monthlyBurn.toLocaleString()} begin immediately`,
        `Revenue ramp-up takes ${rampUp} months`,
      ],
    },
    tip: `Ensure you have at least ฿${(initialCash + monthlyBurn * rampUp).toLocaleString()} available to cover setup costs and operating expenses during the ramp-up period.`,
    roi,
    breakEvenMonth: breakEven > 0 ? breakEven : undefined,
  };
}

export function calculateCustomScenario(
  variables: { key: string; currentValue: number; changeValue: number; unit: string }[],
  baseline: BusinessBaseline = BUSINESS_BASELINE,
): SimulationPreview {
  let revenueImpact = 0;
  let costImpact = 0;

  for (const v of variables) {
    const delta = v.unit === 'percent' ? (v.currentValue * v.changeValue / 100) : v.changeValue;
    if (['revenue', 'price', 'volume', 'demand'].includes(v.key)) {
      revenueImpact += delta;
    } else {
      costImpact += delta;
    }
  }

  const newRevenue = baseline.monthlyRevenue + revenueImpact;
  const profitDelta = revenueImpact - costImpact;
  const newProfit = baseline.monthlyProfit + profitDelta;
  const actualCashBalance = baseline.cashBalance + profitDelta * 6;

  const revenueChangePercent = (revenueImpact / baseline.monthlyRevenue) * 100;
  const profitChangePercent = baseline.monthlyProfit !== 0
    ? (profitDelta / Math.abs(baseline.monthlyProfit)) * 100 : 0;
  const cashBalChangePercent = ((actualCashBalance - baseline.cashBalance) / baseline.cashBalance) * 100;
  const runwayChange = profitDelta > 0 ? 0.4 : -0.3;
  const outlook = determineOutlook(profitChangePercent, runwayChange, cashBalChangePercent);

  return {
    projectedRevenue: newRevenue,
    projectedProfit: newProfit,
    projectedCashBalance: actualCashBalance,
    projectedCashRunway: baseline.cashRunwayMonths + runwayChange,
    revenueChangePercent,
    profitChangePercent,
    cashBalanceChangePercent: cashBalChangePercent,
    cashRunwayChangeMonths: runwayChange,
    outlook,
    outlookExplanation: profitDelta > 0
      ? 'Your custom changes are projected to improve profitability.'
      : 'Your custom changes may reduce profitability. Review the variables carefully.',
    drivers: {
      positive: revenueImpact > 0
        ? [`Revenue impact of +฿${revenueImpact.toLocaleString()}/mo`]
        : ['No revenue improvement configured'],
      negative: costImpact > 0
        ? [`Cost impact of +฿${costImpact.toLocaleString()}/mo`]
        : ['No additional costs configured'],
    },
    tip: 'Add more variables to build a comprehensive picture of your business decision.',
  };
}

// ─── Dispatcher ────────────────────────────────────────────────────────────

export function runScenarioCalculation(
  templateId: string,
  inputs: Record<string, number | string>,
  baseline: BusinessBaseline = BUSINESS_BASELINE,
): SimulationPreview {
  switch (templateId) {
    case 'price_increase':
      return calculatePriceIncrease(inputs, baseline);
    case 'hire_employee':
      return calculateHireEmployee(inputs, baseline);
    case 'cost_reduction':
      return calculateSupplierCostReduction(inputs, baseline);
    case 'holiday_promo':
      return calculateHolidayPromotion(inputs, baseline);
    case 'equipment_purchase':
      return calculateEquipmentPurchase(inputs, baseline);
    case 'inventory_expansion':
      return calculateInventoryExpansion(inputs, baseline);
    case 'new_branch':
      return calculateNewBranch(inputs, baseline);
    default:
      // Fallback: price increase with given inputs
      return calculatePriceIncrease(inputs, baseline);
  }
}
