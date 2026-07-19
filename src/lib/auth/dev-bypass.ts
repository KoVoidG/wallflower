/**
 * Development-only authentication bypass.
 *
 * Enabled ONLY when BOTH conditions are met:
 * 1. NEXT_PUBLIC_DEV_BYPASS_AUTH=true
 * 2. NODE_ENV=development
 *
 * This module is never active in production builds.
 */

export const DEV_BYPASS_ENABLED =
  process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true' &&
  process.env.NODE_ENV === 'development';

export const DEV_MOCK_USER = {
  id: 'dev-user-001',
  name: 'Dev User',
  email: 'dev@wallflower.local',
  emailVerified: true,
  image: null,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  businessId: 'dev-business-001',
} as const;

export const DEV_MOCK_SESSION = {
  session: {
    id: 'dev-session-001',
    userId: DEV_MOCK_USER.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    token: 'dev-token-001',
    ipAddress: '127.0.0.1',
    userAgent: 'dev-bypass',
  },
  user: DEV_MOCK_USER,
} as const;

export const DEV_MOCK_BUSINESS = {
  id: 'dev-business-001',
  userId: DEV_MOCK_USER.id,
  name: 'Dev Business',
  industry: 'FOOD_BEVERAGE',
  monthlyRevenue: 150000,
  monthlyExpenses: 100000,
  employeeCount: 5,
  businessAge: 24,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
} as const;
