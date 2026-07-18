import { Decimal } from '@prisma/client/runtime/library';

export const mockFinancialSnapshot = {
  id: 'f8888888-8888-8888-8888-888888888888',
  businessId: 'b9999999-9999-9999-9999-999999999999',
  month: new Date('2026-06-01T00:00:00Z'),
  revenue: new Decimal('150000.00'),
  expenseCategories: {
    salary: '60000.00',
    rent: '20000.00',
    marketing: '15000.00',
    operations: '25000.00',
  },
  cashReserve: new Decimal('400000.00'),
  receivables: new Decimal('30000.00'),
  payables: new Decimal('20000.00'),
  debt: new Decimal('100000.00'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockMetricSnapshot = {
  id: 'm7777777-7777-7777-7777-777777777777',
  snapshotId: 'f8888888-8888-8888-8888-888888888888',
  cashRunway: new Decimal('13.33'),
  grossProfit: new Decimal('150000.00'),
  netProfit: new Decimal('30000.00'),
  profitMargin: new Decimal('20.00'),
  burnRate: new Decimal('30000.00'),
  workingCapital: new Decimal('410000.00'),
  currentRatio: new Decimal('21.50'),
  breakEven: new Decimal('120000.00'),
  createdAt: new Date(),
};
