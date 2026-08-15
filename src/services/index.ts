// src/services/index.ts
/**
 * Cross-feature frontend services.
 * Feature-specific services/adapters remain inside their respective feature folders:
 * - src/features/dashboard/adapters/dashboard.adapter.ts
 * - src/features/business-health/adapters/business-health.adapter.ts
 * - src/features/business-health/adapters/risks.adapter.ts
 * - src/features/simulations/adapters/simulations.adapter.ts
 * - src/features/advisor/adapters/advisor.adapter.ts
 * - src/features/reports/adapters/reports.adapter.ts
 */

export * from './cash-flow-service';
export * from './actions-service';
export * from './data-sources-service';
