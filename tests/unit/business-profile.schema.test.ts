import { describe, it, expect } from 'vitest';
import {
  businessProfileSchema,
  financialSnapshotSchema,
  onboardingSchema,
} from '@/features/business-profile/schemas';

// --- Test Data Factories ---

function validBusinessProfile() {
  return {
    name: 'Coffee Corner',
    industry: 'food_beverage' as const,
    type: 'sole_proprietor' as const,
    stage: 'startup' as const,
    size: 'micro' as const,
    location: 'Bangkok, Thailand',
    goals: ['Increase revenue', 'Reduce costs'],
  };
}

function validFinancialSnapshot() {
  return {
    month: '2024-06-01',
    revenue: 150000,
    expenseCategories: { rent: 30000, ingredients: 50000, labor: 40000 },
    cashReserve: 200000,
    receivables: 15000,
    payables: 25000,
    debt: 100000,
  };
}

// --- Business Profile Schema Tests ---

describe('businessProfileSchema', () => {
  it('accepts a valid complete business profile', () => {
    const result = businessProfileSchema.safeParse(validBusinessProfile());
    expect(result.success).toBe(true);
  });

  it('rejects an empty business name', () => {
    const data = { ...validBusinessProfile(), name: '' };
    const result = businessProfileSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects a name exceeding 100 characters', () => {
    const data = { ...validBusinessProfile(), name: 'a'.repeat(101) };
    const result = businessProfileSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects an invalid industry', () => {
    const data = { ...validBusinessProfile(), industry: 'invalid_industry' as const };
    const result = businessProfileSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects empty goals array', () => {
    const data = { ...validBusinessProfile(), goals: [] };
    const result = businessProfileSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('accepts valid optional fields', () => {
    const data = {
      ...validBusinessProfile(),
      userRole: 'Owner',
      revenueModel: 'direct_sales',
      employeeCount: 5,
    };
    const result = businessProfileSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

// --- Financial Snapshot Schema Tests ---

describe('financialSnapshotSchema', () => {
  it('accepts a valid complete financial snapshot', () => {
    const result = financialSnapshotSchema.safeParse(validFinancialSnapshot());
    expect(result.success).toBe(true);
  });

  it('rejects when required fields are missing', () => {
    const result = financialSnapshotSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i: { path: (string | number)[] }) => i.path[0]);
      expect(paths).toContain('revenue');
      expect(paths).toContain('cashReserve');
      expect(paths).toContain('receivables');
      expect(paths).toContain('payables');
      expect(paths).toContain('debt');
    }
  });

  it('rejects negative revenue', () => {
    const data = { ...validFinancialSnapshot(), revenue: -1000 };
    const result = financialSnapshotSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i: { path: (string | number)[] }) => i.path[0] === 'revenue');
      expect(issue).toBeDefined();
      expect(issue!.message).toContain('non-negative');
    }
  });

  it('rejects negative cash reserve', () => {
    const data = { ...validFinancialSnapshot(), cashReserve: -500 };
    const result = financialSnapshotSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i: { path: (string | number)[] }) => i.path[0] === 'cashReserve');
      expect(issue).toBeDefined();
      expect(issue!.message).toContain('non-negative');
    }
  });

  it('rejects negative receivables', () => {
    const data = { ...validFinancialSnapshot(), receivables: -100 };
    const result = financialSnapshotSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i: { path: (string | number)[] }) => i.path[0] === 'receivables');
      expect(issue).toBeDefined();
      expect(issue!.message).toContain('non-negative');
    }
  });

  it('rejects negative payables', () => {
    const data = { ...validFinancialSnapshot(), payables: -200 };
    const result = financialSnapshotSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i: { path: (string | number)[] }) => i.path[0] === 'payables');
      expect(issue).toBeDefined();
      expect(issue!.message).toContain('non-negative');
    }
  });

  it('rejects negative debt', () => {
    const data = { ...validFinancialSnapshot(), debt: -50000 };
    const result = financialSnapshotSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i: { path: (string | number)[] }) => i.path[0] === 'debt');
      expect(issue).toBeDefined();
      expect(issue!.message).toContain('non-negative');
    }
  });

  it('rejects empty expense categories', () => {
    const data = { ...validFinancialSnapshot(), expenseCategories: {} };
    const result = financialSnapshotSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(
        (i: { path: (string | number)[] }) => i.path[0] === 'expenseCategories'
      );
      expect(issue).toBeDefined();
      expect(issue!.message).toContain('At least one expense category');
    }
  });

  it('rejects invalid month (not a valid date)', () => {
    const data = { ...validFinancialSnapshot(), month: 'not-a-date' };
    const result = financialSnapshotSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i: { path: (string | number)[] }) => i.path[0] === 'month');
      expect(issue).toBeDefined();
    }
  });

  it('rejects expense categories with negative values', () => {
    const data = {
      ...validFinancialSnapshot(),
      expenseCategories: { rent: 30000, utilities: -5000 },
    };
    const result = financialSnapshotSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(
        (i: { path: (string | number)[] }) =>
          i.path[0] === 'expenseCategories' ||
          (i.path.length > 1 && i.path[0] === 'expenseCategories')
      );
      expect(issue).toBeDefined();
    }
  });

  it('accepts zero values for monetary fields', () => {
    const data = {
      ...validFinancialSnapshot(),
      revenue: 0,
      cashReserve: 0,
      receivables: 0,
      payables: 0,
      debt: 0,
    };
    const result = financialSnapshotSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('coerces ISO date string to Date object', () => {
    const result = financialSnapshotSchema.safeParse(validFinancialSnapshot());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.month).toBeInstanceOf(Date);
    }
  });
});

// --- Combined Onboarding Schema Tests ---

describe('onboardingSchema', () => {
  it('accepts full valid onboarding data (business + financial)', () => {
    const data = {
      business: validBusinessProfile(),
      financial: validFinancialSnapshot(),
    };
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('provides correct error messages for partial data', () => {
    const result = onboardingSchema.safeParse({
      business: { name: '' },
      financial: { revenue: -1 },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const businessErrors = result.error.issues.filter(
        (i: { path: (string | number)[] }) => i.path[0] === 'business'
      );
      const financialErrors = result.error.issues.filter(
        (i: { path: (string | number)[] }) => i.path[0] === 'financial'
      );
      expect(businessErrors.length).toBeGreaterThan(0);
      expect(financialErrors.length).toBeGreaterThan(0);
    }
  });

  it('rejects when both business and financial are missing', () => {
    const result = onboardingSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i: { path: (string | number)[] }) => i.path[0]);
      expect(paths).toContain('business');
      expect(paths).toContain('financial');
    }
  });
});
