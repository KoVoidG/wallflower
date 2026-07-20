---
description: 'Task list for Wallflower MVP implementation with frontend/backend owner mapping'
---

# Tasks: Wallflower MVP

**Input**: Design documents from `/specs/001-wallflower-mvp/`

**Prerequisites**: `plan.md`, `spec.md`, `design.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: Calculation, risk, authorization, accessibility, and primary user-journey tests are required.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested as an independently valuable increment.

---

## Developer Ownership Roles

### Frontend — Void

Responsible for:

- Theme and appearance UI
- next-intl frontend integration and messages
- Reusable UI components
- Responsive application shell
- Authentication screens
- Onboarding forms and client state
- Dashboard interface
- Charts and metric presentation
- Risk-center interface
- Simulation forms and result presentation
- Comparison interface
- AI-advisor interface
- Reports interface and print styling
- Settings interface
- Responsive behavior
- Accessibility and reduced motion
- Loading, empty, partial-data, and error states

### Backend — Thiha

Responsible for:

- Prisma schema and migrations
- Database queries and persistence
- Better Auth server integration
- Server-side authentication and authorization
- Ownership checks
- Zod server validation
- Server actions
- Feature-specific services
- Financial calculation engine
- Health calculation rules
- Risk engine
- Simulation engine
- AI integration and structured responses
- Report-generation data
- Idempotency
- Backend integration tests
- Security and data-access tests

### Shared Responsibilities

- Contracts and shared types
- End-to-end integration
- Pull-request review
- Conflict resolution
- Final acceptance testing
- Documentation accuracy
- Lint, typecheck, tests, and build before merge

---

## Format: `[ID] [P?] [Story] [Owner] Description`

- **[P]**: Can run in parallel because it affects different files and has no unmet dependency.
- **[Story]**: Maps the task to a user story from `spec.md`.
- **[Owner]**: Specifies either `Void` (Frontend), `Thiha` (Backend), or `Shared`.
- Every implementation task names the expected file or directory.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the application, tooling, and shared project conventions.

- [x] T001 Create the Next.js App Router project and base directory structure from `plan.md` (Next.js 16.2 App Router)
- [x] T002 Install runtime dependencies in `package.json`: Prisma, Better Auth, Zod, React Hook Form, Recharts, Motion, next-intl, next-themes, Lucide React, @google/genai
- [x] T003 [P] Install and configure Vitest, React Testing Library, Playwright, axe-core, and test scripts
- [x] T004 [P] Configure TypeScript strict mode and import aliases in `tsconfig.json`
- [x] T005 [P] Configure ESLint and Prettier
- [x] T006 [P] Initialize shadcn/ui and define component conventions in `components.json`
- [x] T007 Create `.env.example` with database, auth, Google OAuth, Gemini, and application URL variables
- [x] T008 [P] Add CI workflow for lint, typecheck, unit tests, build, and Playwright smoke tests in `.github/workflows/ci.yml`
- [x] T009 Create `specs/001-wallflower-mvp/quickstart.md` with local setup and command instructions

**Checkpoint**: The empty application builds, tests run, and CI can execute.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement database, core validation, error exception rules, and lightweight logging.

### Database and authentication

- [x] T010 Define Better Auth, User, Session, Account, Verification, UserPreference, and Business models in `prisma/schema.prisma`
- [x] T011 Define FinancialSnapshot, MetricSnapshot, RiskAssessment, DetectedRisk, Simulation, SimulationInput, SimulationResult, AIRecommendation, and Report models in `prisma/schema.prisma`
- [x] T012 Create and apply the initial Prisma migration in `prisma/migrations/`
- [x] T013 Create the singleton Prisma client in `src/db/prisma.ts`
- [x] T014 Configure Better Auth server in `src/lib/auth/server.ts`
- [x] T015 Configure Better Auth client in `src/lib/auth/client.ts`
- [x] T016 Implement the auth route handler in `src/app/api/auth/[...all]/route.ts`
- [x] T017 Implement route protection and onboarding redirect helpers in `src/lib/auth/guards.ts`
- [x] T018 [P] Add ownership-scoped data-access helpers in `src/lib/auth/ownership.ts`
- [x] T019 [P] Add authentication and authorization integration tests in `tests/integration/auth.test.ts`
- [x] Add Next.js 16 optimistic routing redirects proxy in `src/proxy.ts`

### Validation, money, and observability

- [x] T020 Define shared decimal, currency, percentage, and date helpers in `src/lib/calculations/money.ts`
- [x] T021 Define application error types in `src/lib/errors.ts`
- [x] T022 Add lightweight server structured logging in `src/lib/logger.ts`
- [x] T023 Define Zod schemas for shared identifiers, pagination, money, and dates in `src/lib/validation/common.ts`
- [ ] T024 Add idempotency helper for simulation and report mutations (Deferred until mutations exist)
- [x] T025 Add calculation and risk-engine version constants in `src/lib/calculations/version.ts` and `src/lib/risks/version.ts`

### Shared data and fixtures

- [ ] T035 Create typed repository helpers for business-scoped reads and writes in `src/features/shared/repository.ts` (Removed in favor of feature-specific helpers)
- [x] T036 Create minimal Thai SME seed data in `prisma/seed.ts`
- [x] T037 Create calculation fixtures in `tests/fixtures/financial.ts`
- [ ] T038 Create Playwright authenticated-state setup in `tests/e2e/auth.setup.ts` (Deferred until authentication flow exists)

**Checkpoint**: Core database migrations applied, backend validations and test integration setup pass cleanly.

---

## Phase 2.5: Frontend Foundation

**Owner**: Void  
**Recommended Branch**: `feature/ui-foundation`  
**Purpose**: Set up theme contexts, routing locales, layout grids, motion primitives, and accessibility checks.

- [x] T028 [P] [Owner: Void] Configure theme provider and system/light/dark persistence in `src/components/providers/theme-provider.tsx`
- [x] T029 [P] [Owner: Void] Configure next-intl routing and English/Thai message files in `src/lib/i18n/` and `src/messages/`
- [x] T030 [Owner: Void] Build reusable typography, surface, status badge, metric value, empty state, error state, and skeleton components in `src/components/ui/`
- [x] T031 [Owner: Void] Build responsive application shell, sidebar, topbar, mobile navigation, and contextual drawer in `src/components/app-shell/`
- [x] T032 [Owner: Void] Build reduced-motion-aware animation primitives in `src/components/motion/`
- [x] T033 [P] [Owner: Void] Add Storybook or a local design-system showcase route at `src/app/[locale]/design-system/page.tsx`
- [x] T034 [P] [Owner: Void] Add automated contrast and accessibility checks for core primitives in `tests/unit/design-system.test.tsx`

**Checkpoint**: Theme, localization routing, layout shells, and core design elements are ready for integration.

---

## Phase 3: User Story 1 — Create a Trusted Business Baseline (Priority: P1) 🎯 MVP

**Goal**: A new user registers, completes onboarding, and saves a versioned business baseline.

**Independent Test**: Complete registration and onboarding, reload, and confirm persisted profile and financial snapshot.

**Recommended Branch for Void**: `feature/onboarding-ui`  
**Recommended Branch for Thiha**: `feature/onboarding-backend`

### Tests for User Story 1

- [ ] T039 [P] [US1] [Owner: Thiha] Write business-profile Zod schema tests in `tests/unit/business-profile.schema.test.ts`
- [ ] T040 [P] [US1] [Owner: Thiha] Write onboarding server-action integration tests in `tests/integration/onboarding.test.ts`
- [ ] T041 [P] [US1] [Owner: Shared] Write onboarding end-to-end test in `tests/e2e/onboarding.spec.ts`

### Implementation for User Story 1

- [ ] T042 [P] [US1] [Owner: Thiha] Define business and financial onboarding schemas in `src/features/business-profile/schemas.ts`
- [x] T043 [P] [US1] [Owner: Void] Build account registration, login, and password-reset pages in `src/app/[locale]/(auth)/`
- [ ] T044 [US1] [Owner: Thiha] Implement business onboarding server action in `src/actions/business.actions.ts`
- [ ] T045 [US1] [Owner: Thiha] Implement financial snapshot creation action in `src/actions/financial.actions.ts`
- [x] T046 [US1] [Owner: Void] Build multi-step onboarding form in `src/features/business-profile/components/onboarding-form.tsx`
- [x] T047 [US1] [Owner: Void] Add autosave-safe client state and validation summary to onboarding
- [x] T048 [US1] [Owner: Void] Build data-privacy and "why we ask" guidance panels
- [x] T049 [US1] [Owner: Void] Implement `src/app/[locale]/onboarding/page.tsx` with redirect behavior
- [x] T050 [US1] [Owner: Void] Add partial, empty, loading, server-error, and duplicate-submission states
- [x] T051 [US1] [Owner: Void] Add English and Thai onboarding messages in `src/messages/en.json` and `src/messages/th.json`

**Checkpoint**: A new account can create a durable baseline and reach the application.

---

## Phase 4: User Story 2 — Understand Current Business Health (Priority: P1)

**Goal**: Calculate and display business-health metrics, trends, and prioritized next action.

**Independent Test**: Load seeded six-month data and verify all dashboard values and chart series.

### Tests for User Story 2

- [ ] T052 [P] [US2] [Owner: Thiha] Write money and rounding tests in `tests/unit/money.test.ts`
- [ ] T053 [P] [US2] [Owner: Thiha] Write financial metric fixture tests in `tests/unit/metrics.test.ts`
- [ ] T054 [P] [US2] [Owner: Thiha] Write health-status rule tests in `tests/unit/health.test.ts`
- [ ] T055 [P] [US2] [Owner: Thiha] Write dashboard integration test in `tests/integration/dashboard.test.ts`
- [ ] T056 [P] [US2] [Owner: Void] Write dashboard accessibility and responsive test in `tests/e2e/dashboard.spec.ts`

### Implementation for User Story 2

- [ ] T057 [P] [US2] [Owner: Thiha] Implement shared financial metrics in `src/lib/calculations/metrics.ts`
- [ ] T058 [P] [US2] [Owner: Thiha] Implement health score and status rules in `src/lib/calculations/health.ts`
- [ ] T059 [US2] [Owner: Thiha] Implement metric-snapshot persistence in `src/features/dashboard/services/metric-snapshot.service.ts`
- [x] T060 [P] [US2] [Owner: Void] Build KPI card and tooltip components in `src/components/metrics/`
- [x] T061 [P] [US2] [Owner: Void] Build accessible line and comparison charts in `src/components/charts/`
- [x] T062 [US2] [Owner: Void] Build Business Pulse and Today's Insights components in `src/features/dashboard/components/`
- [ ] T063 [US2] [Owner: Thiha] Implement dashboard query service in `src/features/dashboard/services/dashboard.service.ts`
- [x] T064 [US2] [Owner: Void] Build `src/app/[locale]/(app)/dashboard/page.tsx`
- [x] T065 [Owner: Void] Build business-health detail tabs in `src/app/[locale]/(app)/business-health/page.tsx`
- [x] T066 [Owner: Void] Add data completeness, stale-data, and missing-history states
- [x] T067 [Owner: Void] Add print-safe data table alternatives for charts
- [x] T067a [US2] [Owner: Void] Build the form/modal to update/create a new monthly financial snapshot, and expose clear entry paths (links/buttons) to it from both the dashboard and simulation pages (FR-039)

**Checkpoint**: The dashboard independently communicates current business health and the next important action.

---

## Phase 5: User Story 3 — Detect and Explain Hidden Risks (Priority: P1)

**Goal**: Generate deterministic risk assessments with evidence and mitigation.

**Independent Test**: Submit known fixtures and verify triggered rules, severity, ordering, and explanations.

### Tests for User Story 3

- [ ] T068 [P] [US3] [Owner: Thiha] Write a failing test for every initial risk rule in `tests/unit/risk-rules.test.ts`
- [ ] T069 [P] [US3] [Owner: Thiha] Write risk-engine ordering and missing-data tests in `tests/unit/risk-engine.test.ts`
- [ ] T070 [P] [US3] [Owner: Thiha] Write risk-center integration test in `tests/integration/risks.test.ts`
- [ ] T071 [P] [US3] [Owner: Void] Write risk-center keyboard and screen-reader test in `tests/e2e/risks.spec.ts`

### Implementation for User Story 3

- [ ] T072 [P] [US3] [Owner: Thiha] Define risk context and output types in `src/lib/risks/types.ts`
- [ ] T073 [P] [US3] [Owner: Thiha] Implement cash-flow, runway, expense-growth, payroll, receivable, liquidity, and data-completeness rules in `src/lib/risks/rules.ts`
- [ ] T074 [US3] [Owner: Thiha] Implement deterministic risk engine in `src/lib/risks/engine.ts`
- [ ] T075 [US3] [Owner: Thiha] Implement risk-assessment persistence in `src/features/risks/services/risk-assessment.service.ts`
- [x] T076 [P] [US3] [Owner: Void] Build risk summary, category card, evidence, and mitigation components in `src/features/risks/components/`
- [x] T077 [US3] [Owner: Void] Build filtering, sorting, and status management for risks
- [x] T078 [US3] [Owner: Void] Build `src/app/[locale]/(app)/risks/page.tsx`
- [x] T079 [US3] [Owner: Void] Add incomplete-assessment and stale-assessment warnings
- [x] T080 [US3] [Owner: Void] Link dashboard risk insights to the relevant risk detail

**Checkpoint**: The risk center independently identifies and explains business risks without AI.

---

## Phase 6: User Story 4 — Simulate a Business Decision (Priority: P1)

**Goal**: Run five deterministic scenarios and display transparent baseline comparisons.

**Independent Test**: Run each scenario against fixtures and confirm exact expected outputs.

### Tests for User Story 4

- [ ] T081 [P] [US4] [Owner: Thiha] Write hire-employees calculator tests in `tests/unit/scenarios/hire-employees.test.ts`
- [ ] T082 [P] [US4] [Owner: Thiha] Write price-change calculator tests in `tests/unit/scenarios/change-price.test.ts`
- [ ] T083 [P] [US4] [Owner: Thiha] Write marketing-investment calculator tests in `tests/unit/scenarios/marketing-investment.test.ts`
- [ ] T084 [P] [US4] [Owner: Thiha] Write equipment-purchase calculator tests in `tests/unit/scenarios/equipment-purchase.test.ts`
- [ ] T085 [P] [US4] [Owner: Thiha] Write payment-delay calculator tests in `tests/unit/scenarios/payment-delay.test.ts`
- [ ] T086 [P] [US4] [Owner: Thiha] Write simulation persistence and ownership tests in `tests/integration/simulations.test.ts`
- [ ] T087 [P] [US4] [Owner: Shared] Write complete simulation journey test in `tests/e2e/simulation.spec.ts`

### Implementation for User Story 4

- [ ] T088 [P] [US4] [Owner: Thiha] Define normalized baseline, scenario input, outcome, case, warning, and result types in `src/lib/calculations/scenarios/types.ts`
- [ ] T089 [P] [US4] [Owner: Thiha] Implement hire-employees calculator in `src/lib/calculations/scenarios/hire-employees.ts`
- [ ] T090 [P] [US4] [Owner: Thiha] Implement price-change calculator in `src/lib/calculations/scenarios/change-price.ts`
- [ ] T091 [P] [US4] [Owner: Thiha] Implement marketing-investment calculator in `src/lib/calculations/scenarios/marketing-investment.ts`
- [ ] T092 [P] [US4] [Owner: Thiha] Implement equipment-purchase calculator in `src/lib/calculations/scenarios/equipment-purchase.ts`
- [ ] T093 [P] [US4] [Owner: Thiha] Implement payment-delay calculator in `src/lib/calculations/scenarios/payment-delay.ts`
- [ ] T094 [US4] [Owner: Thiha] Implement scenario registry and dispatcher in `src/lib/calculations/scenarios/index.ts`
- [ ] T095 [US4] [Owner: Thiha] Implement simulation create, save, rename, duplicate, and delete actions in `src/actions/simulation.actions.ts`
- [x] T096 [P] [US4] [Owner: Void] Build scenario selector cards in `src/components/simulations/scenario-selector.tsx`
- [x] T097 [P] [US4] [Owner: Void] Build scenario-specific dynamic forms in `src/components/simulations/forms/`
- [x] T098 [US4] [Owner: Void] Build simulator wizard in `src/app/[locale]/(app)/simulations/new/page.tsx`
- [x] T099 [P] [US4] [Owner: Void] Build result KPI row, case selector, timeline, assumption panel, and detailed table in `src/components/simulations/results/`
- [x] T100 [US4] [Owner: Void] Build simulation result page in `src/app/[locale]/(app)/simulations/[simulationId]/page.tsx`
- [x] T101 [US4] [Owner: Void] Build simulation history page in `src/app/[locale]/(app)/simulations/page.tsx`
- [x] T102 [US4] [Owner: Void] Add run-progress, idempotency, invalid-value, stale-baseline, empty, and calculation-error states
- [x] T103 [US4] [Owner: Void] Add reduced-motion result transitions and accessible completion announcement

**Checkpoint**: The flagship simulator works end-to-end without requiring AI.

---

## Phase 7: User Story 5 — Compare Options and Receive Actionable Advice (Priority: P2)

**Goal**: Compare scenarios and generate grounded, structured AI explanations.

**Independent Test**: Compare two scenarios and force AI success, malformed output, timeout, and provider-error paths.

### Tests for User Story 5

- [ ] T104 [P] [US5] [Owner: Thiha] Write AI output-schema tests in `tests/unit/ai-schema.test.ts`
- [ ] T105 [P] [US5] [Owner: Thiha] Write prompt context-redaction tests in `tests/unit/ai-context.test.ts`
- [ ] T106 [P] [US5] [Owner: Thiha] Write comparison service tests in `tests/unit/comparison.test.ts`
- [ ] T107 [P] [US5] [Owner: Thiha] Write AI fallback integration tests in `tests/integration/advisor.test.ts`
- [ ] T108 [P] [US5] [Owner: Shared] Write comparison and advisor e2e test in `tests/e2e/advisor.spec.ts`

### Implementation for User Story 5

- [ ] T109 [P] [US5] [Owner: Thiha] Define AI recommendation schemas in `src/lib/ai/schemas.ts`
- [ ] T110 [P] [US5] [Owner: Thiha] Define Wallflower system prompt and scenario templates in `src/lib/ai/prompts.ts`
- [ ] T111 [US5] [Owner: Thiha] Implement Gemini server client using the official `@google/genai` SDK with native Zod `responseSchema` validation, timeout, and retry in `src/lib/ai/client.ts`
- [ ] T112 [US5] [Owner: Thiha] Implement context selector that sends only relevant business values in `src/features/advisor/services/context.service.ts`
- [ ] T113 [US5] [Owner: Thiha] Implement AI recommendation route in `src/app/api/ai/recommendation/route.ts`
- [ ] T114 [US5] [Owner: Thiha] Persist AI recommendations separately from deterministic results
- [x] T115 [P] [US5] [Owner: Void] Build calculated-fact, assumption, AI-interpretation, uncertainty, and disclaimer components in `src/features/advisor/components/`
- [x] T116 [US5] [Owner: Void] Build contextual advisor page in `src/app/[locale]/(app)/advisor/page.tsx`
- [ ] T117 [P] [US5] [Owner: Thiha] Implement scenario comparison service in `src/features/simulations/services/comparison.service.ts`
- [x] T118 [US5] [Owner: Void] Build comparison table and chart view in `src/app/[locale]/(app)/simulations/compare/page.tsx`
- [x] T119 [US5] [Owner: Void] Add insufficient-data, malformed-output, timeout, retry, and provider-unavailable states
- [ ] T120 [US5] [Owner: Thiha] Ensure AI confidence label derives from data completeness and sensitivity, not fabricated probability

**Checkpoint**: Users can compare options and receive grounded advice without losing access to calculations when AI fails.

---

## Phase 8: User Story 6 — Generate and Share a Decision Report (Priority: P2)

**Goal**: Generate a versioned, printable report and 90-day action plan.

**Independent Test**: Generate and print a report from seeded data and verify source dates, sections, page breaks, and missing-data labels.

### Tests for User Story 6

- [ ] T121 [P] [US6] [Owner: Thiha] Write report composition tests in `tests/unit/report.service.test.ts`
- [ ] T122 [P] [US6] [Owner: Thiha] Write report authorization tests in `tests/integration/reports.test.ts`
- [ ] T123 [P] [US6] [Owner: Shared] Write print-layout and PDF smoke test in `tests/e2e/report.spec.ts`

### Implementation for User Story 6

- [ ] T124 [US6] [Owner: Thiha] Implement report composition service in `src/features/reports/services/report.service.ts`
- [ ] T125 [US6] [Owner: Thiha] Implement report create and delete actions in `src/actions/report.actions.ts`
- [x] T126 [P] [US6] [Owner: Void] Build report cover, executive summary, metric table, risk section, simulation section, recommendation section, and action-plan components in `src/components/reports/`
- [x] T127 [US6] [Owner: Void] Build report detail page in `src/app/[locale]/(app)/reports/[reportId]/page.tsx`
- [x] T128 [US6] [Owner: Void] Build report history page in `src/app/[locale]/(app)/reports/page.tsx`
- [x] T129 [US6] [Owner: Void] Implement print stylesheet in `src/app/print.css`
- [x] T130 [US6] [Owner: Void] Add data-through date, calculation version, report version, assumptions, and disclaimer
- [x] T131 [US6] [Owner: Void] Add browser print/PDF action and print-preview mode
- [x] T132 [US6] [Owner: Void] Add incomplete-section and stale-source indicators

**Checkpoint**: Reports are useful in a demo and reproducible from their source records.

---

## Phase 9: User Story 7 — Manage Preferences and Security (Priority: P3)

**Goal**: Users can manage appearance, language, profile, business details, and account security.

**Independent Test**: Change each preference, reload, and verify persistence and authorization.

### Tests for User Story 7

- [ ] T133 [P] [US7] [Owner: Thiha] Write preference persistence tests in `tests/integration/preferences.test.ts`
- [ ] T134 [P] [US7] [Owner: Void] Write settings keyboard and responsive test in `tests/e2e/settings.spec.ts`

### Implementation for User Story 7

- [ ] T135 [P] [US7] [Owner: Thiha] Build profile and preference schemas in `src/features/settings/schemas.ts`
- [ ] T136 [US7] [Owner: Thiha] Implement preference update actions in `src/features/settings/actions.ts`
- [x] T137 [US7] [Owner: Void] Build appearance, language, date, currency, and accessibility settings
- [x] T138 [US7] [Owner: Void] Build profile and business-information settings
- [x] T139 [US7] [Owner: Void] Build password and session-management controls supported by Better Auth
- [x] T140 [US7] [Owner: Void] Build account-deletion confirmation flow
- [x] T141 [US7] [Owner: Void] Build `src/app/[locale]/(app)/settings/page.tsx`
- [x] T142 [US7] [Owner: Void] Add destructive-action and reauthentication error states

**Checkpoint**: Preferences and security controls work without affecting core business data.

---

## Phase 10: Marketing Site and Demo Story

**Purpose**: Present Wallflower clearly without fabricated traction or unsupported claims.

- [x] T143 [Owner: Void] Build marketing navigation and responsive header in `src/app/[locale]/(marketing)/`
- [x] T144 [Owner: Void] Build landing hero using approved copy and a real product-preview composition
- [x] T145 [Owner: Void] Build three-step workflow section: Diagnose, Simulate, Act
- [x] T146 [Owner: Void] Build supported scenario examples section
- [x] T147 [Owner: Void] Build explainability and trust section distinguishing calculations from AI
- [x] T148 [Owner: Void] Build Thai SME context and challenge-alignment section
- [x] T149 [Owner: Void] Build final CTA and footer
- [x] T150 [Owner: Void] Add restrained Motion interactions and reduced-motion alternatives
- [x] T151 [Owner: Void] Remove fabricated customer logos, user counts, ratings, and improvement statistics
- [x] T152 [Owner: Void] Add SEO metadata, Open Graph image, sitemap, and robots configuration
- [ ] T153 [Owner: Void] Add landing-page performance and accessibility test in `tests/e2e/landing.spec.ts`

**Checkpoint**: The public site communicates the product accurately and leads into onboarding or a sample simulation.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Prepare the prototype for judging, user testing, and deployment.

- [x] T154 [P] [Owner: Void] Review every page against `design.md` Design QA Checklist
- [x] T155 [P] [Owner: Void] Complete English copy and Thai-ready translation keys
- [x] T156 [P] [Owner: Void] Verify light, dark, and system themes across all core routes
- [x] T157 [P] [Owner: Void] Verify reduced-motion behavior across marketing and application routes
- [x] T158 [P] [Owner: Void] Add loading, empty, error, partial-data, and offline-message states to all core screens
- [ ] T159 [Owner: Shared] Perform ownership and insecure-direct-object-reference security review
- [ ] T160 [Owner: Shared] Verify secrets and financial payloads are absent from client bundles and logs
- [ ] T161 [Owner: Thiha] Run Prisma migration from a clean database and validate seed process
- [ ] T162 [Owner: Thiha] Run unit coverage and reach at least 90% statement coverage in calculations and risk rules
- [ ] T163 [Owner: Shared] Run complete Playwright suite in desktop, tablet, and mobile projects
- [ ] T164 [Owner: Void] Run WCAG checks and manually verify keyboard navigation
- [ ] T165 [Owner: Void] Profile dashboard and simulation performance and remove avoidable client JavaScript
- [ ] T166 [Owner: Thiha] Verify THB formatting, rounding, date handling, and timezone behavior
- [ ] T167 [Owner: Void] Validate all report print page breaks in Chrome and Edge
- [ ] T168 [Owner: Thiha] Create a polished GreenCafe demo dataset and scripted demo journey
- [ ] T169 [Owner: Shared] Update README with architecture, setup, screenshots, limitations, and demo account instructions
- [ ] T170 [Owner: Shared] Deploy preview to Vercel and connect production Neon branch
- [ ] T171 [Owner: Shared] Run production smoke test for register → onboard → diagnose → simulate → advise → report
- [ ] T172 [Owner: Shared] Tag prototype release and record known limitations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup** has no dependencies.
- **Foundational** depends on Setup and blocks all user stories.
- **US1 Baseline** starts after Foundational.
- **US2 Health** depends on US1 data structures.
- **US3 Risk** depends on US1 and shared metrics from US2.
- **US4 Simulation** depends on US1 and shared financial metrics; most calculator work can run alongside US2/US3 after the normalized baseline is stable.
- **US5 Advice and comparison** depends on saved simulation results.
- **US6 Reports** depends on health, risks, and simulations.
- **US7 Settings** depends only on Foundational and may run in parallel with US2–US6.
- **Marketing** may begin after design foundations and real product components exist.
- **Polish** depends on all selected demo features.

### Parallel Opportunities

- Database/auth, theme/i18n, and test configuration can proceed in parallel during Foundation.
- Individual metric and risk-rule tests can be written in parallel.
- The five scenario calculators and tests are independent after shared types are finalized.
- Report components and AI UI components can proceed in parallel after result contracts are stable.
- Settings and marketing work can run alongside later application stories.

### Implementation Strategy

### MVP First

The smallest strong demo increment is:

1. Setup and Foundation
2. User Story 1: onboarding and baseline
3. User Story 2: dashboard and health
4. User Story 4: one fully tested scenario, beginning with Hire Employees
5. Validate with users and deploy

Then add the remaining four scenarios, risk center, comparison, AI explanation, and report.

### Recommended Two-Person Team Split

**Void — Frontend**
Responsible for:
- Design system
- Theme
- Layout
- Components
- Responsive UI
- Authentication pages
- Dashboard UI
- Risk UI
- Simulation UI
- Reports UI
- Accessibility
- Frontend tests

**Thiha — Backend**
Responsible for:
- Prisma
- Better Auth
- Server Actions
- Calculations
- Risk Engine
- Simulation Engine
- AI Integration
- Persistence
- Backend tests

**Shared**
Responsible for:
- Shared contracts
- Pull requests
- Integration
- Security review
- Deployment
- Final QA
- Documentation


## Notes

- Commit after each task or coherent group.
- Tests for calculations and risk rules must fail before implementation.
- Do not merge AI-generated numbers into deterministic result objects.
- Store calculation versions with every saved result.
- Avoid adding deferred integrations during the MVP.
- A visually complete screen is not complete until its error, loading, empty, dark, mobile, and reduced-motion states exist.
