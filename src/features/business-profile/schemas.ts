import { z } from 'zod';

// --- Enum values ---

export const INDUSTRY_VALUES = [
  'food_beverage',
  'retail',
  'service',
  'technology',
  'manufacturing',
  'agriculture',
  'tourism',
  'healthcare',
  'education',
  'other',
] as const;

export const BUSINESS_TYPE_VALUES = [
  'sole_proprietor',
  'partnership',
  'limited_company',
  'corporation',
  'other',
] as const;

export const STAGE_VALUES = [
  'idea',
  'startup',
  'growing',
  'established',
  'declining',
] as const;

export const SIZE_VALUES = ['solo', 'micro', 'small', 'medium'] as const;

// --- Business Profile Schema ---

export const businessProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Business name is required')
    .max(100, 'Business name must be at most 100 characters'),
  industry: z.enum(INDUSTRY_VALUES, {
    invalid_type_error: 'Invalid industry value',
  }),
  type: z.enum(BUSINESS_TYPE_VALUES, {
    invalid_type_error: 'Invalid business type',
  }),
  stage: z.enum(STAGE_VALUES, {
    invalid_type_error: 'Invalid business stage',
  }),
  size: z.enum(SIZE_VALUES, {
    invalid_type_error: 'Invalid business size',
  }),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(200, 'Location must be at most 200 characters'),
  goals: z
    .array(z.string().min(1, 'Goal cannot be empty'))
    .min(1, 'At least one goal is required')
    .max(5, 'Maximum 5 goals allowed'),
});

export type BusinessProfile = z.infer<typeof businessProfileSchema>;

// --- Financial Snapshot Schema ---

export const financialSnapshotSchema = z.object({
  month: z.coerce.date({ invalid_type_error: 'Invalid date' }),
  revenue: z.number().min(0, 'Revenue must be non-negative'),
  expenseCategories: z
    .record(z.string(), z.number().min(0, 'Expense values must be non-negative'))
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'At least one expense category is required',
    }),
  cashReserve: z.number().min(0, 'Cash reserve must be non-negative'),
  receivables: z.number().min(0, 'Receivables must be non-negative'),
  payables: z.number().min(0, 'Payables must be non-negative'),
  debt: z.number().min(0, 'Debt must be non-negative'),
});

export type FinancialSnapshot = z.infer<typeof financialSnapshotSchema>;

// --- Combined Onboarding Schema ---

export const onboardingSchema = z.object({
  business: businessProfileSchema,
  financial: financialSnapshotSchema,
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
