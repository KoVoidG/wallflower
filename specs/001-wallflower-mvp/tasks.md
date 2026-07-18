---
description: "Task list for Wallflower MVP implementation"
---

# Tasks: Wallflower MVP

**Input**: Design documents from `/specs/001-wallflower-mvp/`

**Prerequisites**: `plan.md`, `spec.md`, `design.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: Calculation, risk, authorization, accessibility, and primary user-journey tests are required.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested as an independently valuable increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it affects different files and has no unmet dependency.
- **[Story]**: Maps the task to a user story from `spec.md`.
- Every implementation task names the expected file or directory.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the application, tooling, and shared project conventions.

- [ ] T001 Create the Next.js App Router project and base directory structure from `plan.md` (Next.js 15 App Router)
- [ ] T002 Install runtime dependencies in `package.json`: Prisma, Better Auth, Zod, React Hook Form, Recharts, Motion, next-intl, next-themes, Lucide React, @google/genai
- [ ] T003 [P] Install and configure Vitest, React Testing Library, Playwright, axe-core, and test scripts
- [ ] T004 [P] Configure TypeScript strict mode and import aliases in `tsconfig.json`
- [ ] T005 [P] Configure ESLint, Prettier, and import sorting
- [ ] T006 [P] Initialize shadcn/ui and define component conventions in `components.json`
- [ ] T007 Create `.env.example` with database, auth, Google OAuth, Gemini, and application URL variables
- [ ] T008 [P] Add CI workflow for lint, typecheck, unit tests, build, and Playwright smoke tests in `.github/workflows/ci.yml`
- [ ] T009 Create `specs/001-wallflower-mvp/quickstart.md` with local setup and command instructions

**Checkpoint**: The empty application builds, tests run, and CI can execute.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement infrastructure required by all user stories.

**⚠️ CRITICAL**: No user-story implementation begins until this phase is complete.

### Database and authentication

- [ ] T010 Define Better Auth, User, Session, Account, Verification, UserPreference, Business, and AuditEvent models in `prisma/schema.prisma`
- [ ] T011 Define FinancialSnapshot, MetricSnapshot, RiskAssessment, DetectedRisk, Simulation, SimulationInput, SimulationResult, AIRecommendation, and Report models in `prisma/schema.prisma`
- [ ] T012 Create and apply the initial Prisma migration in `prisma/migrations/`
- [ ] T013 Create the singleton Prisma client in `src/db/prisma.ts`
- [ ] T014 Configure Better Auth server in `src/lib/auth/server.ts`
- [ ] T015 Configure Better Auth client in `src/lib/auth/client.ts`
- [ ] T016 Implement the auth route handler in `src/app/api/auth/[...all]/route.ts`
- [ ] T017 Implement route protection and onboarding redirect helpers in `src/lib/auth/guards.ts`
- [ ] T018 [P] Add ownership-scoped data-access helpers in `src/lib/auth/ownership.ts`
- [ ] T019 [P] Add authentication and authorization integration tests in `tests/integration/auth.test.ts`

### Validation, money, and observability

- [ ] T020 Define shared decimal, currency, percentage, and date helpers in `src/lib/calculations/money.ts`
- [ ] T021 Define application error types in `src/lib/errors.ts`
- [ ] T022 Add server-safe structured logging in `src/lib/logger.ts`
- [ ] T023 Define Zod schemas for shared identifiers, pagination, money, and dates in `src/lib/validation/common.ts`
- [ ] T024 Add idempotency helper for simulation and report mutations in `src/lib/idempotency.ts`
- [ ] T025 Add calculation and risk-engine version constants in `src/lib/calculations/version.ts` and `src/lib/risks/version.ts`

### Design system and shell

- [ ] T026 Implement light and dark design tokens from `design.md` in `src/app/globals.css`
- [ ] T027 [P] Configure Geist Sans, Geist Mono, and Noto Sans Thai in `src/app/layout.tsx`
- [ ] T028 [P] Configure theme provider and system/light/dark persistence in `src/components/providers/theme-provider.tsx`
- [ ] T029 [P] Configure next-intl routing and English/Thai message files in `src/lib/i18n/` and `src/messages/`
- [ ] T030 Build reusable typography, surface, status badge, metric value, empty state, error state, and skeleton components in `src/components/ui/`
- [ ] T031 Build responsive application shell, sidebar, topbar, mobile navigation, and contextual drawer in `src/components/app-shell/`
- [ ] T032 Build reduced-motion-aware animation primitives in `src/components/motion/`
- [ ] T033 [P] Add Storybook or a local design-system showcase route at `src/app/[locale]/design-system/page.tsx`
- [ ] T034 [P] Add automated contrast and accessibility checks for core primitives in `tests/unit/design-system.test.tsx`

### Shared data and fixtures

- [ ] T035 Create typed repository helpers for business-scoped reads and writes in `src/features/shared/repository.ts`
- [ ] T036 Create realistic Thai SME seed data in `prisma/seed.ts`
- [ ] T037 Create calculation fixtures in `tests/fixtures/financial.ts`
- [ ] T038 Create Playwright authenticated-state setup in `tests/e2e/auth.setup.ts`

**Checkpoint**: Authentication, database, app shell, themes, localization, validation, and test foundations are ready.

---

## Phase 3: User Story 1 — Create a Trusted Business Baseline (Priority: P1) 🎯 MVP

**Goal**: A new user registers, completes onboarding, and saves a versioned business baseline.

**Independent Test**: Complete registration and onboarding, reload, and confirm persisted profile and financial snapshot.

### Tests for User Story 1

- [ ] T039 [P] [US1] Write business-profile Zod schema tests in `tests/unit/business-profile.schema.test.ts`
- [ ] T040 [P] [US1] Write onboarding server-action integration tests in `tests/integration/onboarding.test.ts`
- [ ] T041 [P] [US1] Write onboarding end-to-end test in `tests/e2e/onboarding.spec.ts`

### Implementation for User Story 1

- [ ] T042 [P] [US1] Define business and financial onboarding schemas in `src/features/business-profile/schemas.ts`
- [ ] T043 [P] [US1] Build account registration, login, and password-reset pages in `src/app/[locale]/(auth)/`
- [ ] T044 [US1] Implement business onboarding server action in `src/actions/business.actions.ts`
- [ ] T045 [US1] Implement financial snapshot creation action in `src/actions/financial.actions.ts`
- [ ] T046 [US1] Build multi-step onboarding form in `src/features/business-profile/components/onboarding-form.tsx`
- [ ] T047 [US1] Add autosave-safe client state and validation summary to onboarding
- [ ] T048 [US1] Build data-privacy and "why we ask" guidance panels
- [ ] T049 [US1] Implement `src/app/[locale]/onboarding/page.tsx` with redirect behavior
- [ ] T050 [US1] Add partial, empty, loading, server-error, and duplicate-submission states
- [ ] T051 [US1] Add English and Thai onboarding messages in `src/messages/en.json` and `src/messages/th.json`

**Checkpoint**: A new account can create a durable baseline and reach the application.

---

## Phase 4: User Story 2 — Understand Current Business Health (Priority: P1)

**Goal**: Calculate and display business-health metrics, trends, and prioritized next action.

**Independent Test**: Load seeded six-month data and verify all dashboard values and chart series.

### Tests for User Story 2

- [ ] T052 [P] [US2] Write money and rounding tests in `tests/unit/money.test.ts`
- [ ] T053 [P] [US2] Write financial metric fixture tests in `tests/unit/metrics.test.ts`
- [ ] T054 [P] [US2] Write health-status rule tests in `tests/unit/health.test.ts`
- [ ] T055 [P] [US2] Write dashboard integration test in `tests/integration/dashboard.test.ts`
- [ ] T056 [P] [US2] Write dashboard accessibility and responsive test in `tests/e2e/dashboard.spec.ts`

### Implementation for User Story 2

- [ ] T057 [P] [US2] Implement shared financial metrics in `src/lib/calculations/metrics.ts`
- [ ] T058 [P] [US2] Implement health score and status rules in `src/lib/calculations/health.ts`
- [ ] T059 [US2] Implement metric-snapshot persistence in `src/features/dashboard/services/metric-snapshot.service.ts`
- [ ] T060 [P] [US2] Build KPI card and tooltip components in `src/components/metrics/`
- [ ] T061 [P] [US2] Build accessible line and comparison charts in `src/components/charts/`
- [ ] T062 [US2] Build Business Pulse and Today's Insights components in `src/features/dashboard/components/`
- [ ] T063 [US2] Implement dashboard query service in `src/features/dashboard/services/dashboard.service.ts`
- [ ] T064 [US2] Build `src/app/[locale]/(app)/dashboard/page.tsx`
- [ ] T065 Build business-health detail tabs in `src/app/[locale]/(app)/business-health/page.tsx`
- [ ] T066 Add data completeness, stale-data, and missing-history states
- [ ] T067 Add print-safe data table alternatives for charts
- [ ] T067a [US2] Build the form/modal to update/create a new monthly financial snapshot, and expose clear entry paths (links/buttons) to it from both the dashboard and simulation pages (FR-039)

**Checkpoint**: The dashboard independently communicates current business health and the next important action.

---

## Phase 5: User Story 3 — Detect and Explain Hidden Risks (Priority: P1)

**Goal**: Generate deterministic risk assessments with evidence and mitigation.

**Independent Test**: Submit known fixtures and verify triggered rules, severity, ordering, and explanations.

### Tests for User Story 3

- [ ] T068 [P] [US3] Write a failing test for every initial risk rule in `tests/unit/risk-rules.test.ts`
- [ ] T069 [P] [US3] Write risk-engine ordering and missing-data tests in `tests/unit/risk-engine.test.ts`
- [ ] T070 [P] [US3] Write risk-center integration test in `tests/integration/risks.test.ts`
- [ ] T071 [P] [US3] Write risk-center keyboard and screen-reader test in `tests/e2e/risks.spec.ts`

### Implementation for User Story 3

- [ ] T072 [P] [US3] Define risk context and output types in `src/lib/risks/types.ts`
- [ ] T073 [P] [US3] Implement cash-flow, runway, expense-growth, payroll, receivable, liquidity, and data-completeness rules in `src/lib/risks/rules.ts`
- [ ] T074 [US3] Implement deterministic risk engine in `src/lib/risks/engine.ts`
- [ ] T075 [US3] Implement risk-assessment persistence in `src/features/risks/services/risk-assessment.service.ts`
- [ ] T076 [P] [US3] Build risk summary, category card, evidence, and mitigation components in `src/features/risks/components/`
- [ ] T077 [US3] Build filtering, sorting, and status management for risks
- [ ] T078 [US3] Build `src/app/[locale]/(app)/risks/page.tsx`
- [ ] T079 [US3] Add incomplete-assessment and stale-assessment warnings
- [ ] T080 [US3] Link dashboard risk insights to the relevant risk detail

**Checkpoint**: The risk center independently identifies and explains business risks without AI.

---

## Phase 6: User Story 4 — Simulate a Business Decision (Priority: P1)

**Goal**: Run five deterministic scenarios and display transparent baseline comparisons.

**Independent Test**: Run each scenario against fixtures and confirm exact expected outputs.

### Tests for User Story 4

- [ ] T081 [P] [US4] Write hire-employees calculator tests in `tests/unit/scenarios/hire-employees.test.ts`
- [ ] T082 [P] [US4] Write price-change calculator tests in `tests/unit/scenarios/change-price.test.ts`
- [ ] T083 [P] [US4] Write marketing-investment calculator tests in `tests/unit/scenarios/marketing-investment.test.ts`
- [ ] T084 [P] [US4] Write equipment-purchase calculator tests in `tests/unit/scenarios/equipment-purchase.test.ts`
- [ ] T085 [P] [US4] Write payment-delay calculator tests in `tests/unit/scenarios/payment-delay.test.ts`
- [ ] T086 [P] [US4] Write simulation persistence and ownership tests in `tests/integration/simulations.test.ts`
- [ ] T087 [P] [US4] Write complete simulation journey test in `tests/e2e/simulation.spec.ts`

### Implementation for User Story 4

- [ ] T088 [P] [US4] Define normalized baseline, scenario input, outcome, case, warning, and result types in `src/lib/calculations/scenarios/types.ts`
- [ ] T089 [P] [US4] Implement hire-employees calculator in `src/lib/calculations/scenarios/hire-employees.ts`
- [ ] T090 [P] [US4] Implement price-change calculator in `src/lib/calculations/scenarios/change-price.ts`
- [ ] T091 [P] [US4] Implement marketing-investment calculator in `src/lib/calculations/scenarios/marketing-investment.ts`
- [ ] T092 [P] [US4] Implement equipment-purchase calculator in `src/lib/calculations/scenarios/equipment-purchase.ts`
- [ ] T093 [P] [US4] Implement payment-delay calculator in `src/lib/calculations/scenarios/payment-delay.ts`
- [ ] T094 [US4] Implement scenario registry and dispatcher in `src/lib/calculations/scenarios/index.ts`
- [ ] T095 [US4] Implement simulation create, save, rename, duplicate, and delete actions in `src/actions/simulation.actions.ts`
- [ ] T096 [P] [US4] Build scenario selector cards in `src/components/simulations/scenario-selector.tsx`
- [ ] T097 [P] [US4] Build scenario-specific dynamic forms in `src/components/simulations/forms/`
- [ ] T098 [US4] Build simulator wizard in `src/app/[locale]/(app)/simulations/new/page.tsx`
- [ ] T099 [P] [US4] Build result KPI row, case selector, timeline, assumption panel, and detailed table in `src/components/simulations/results/`
- [ ] T100 [US4] Build simulation result page in `src/app/[locale]/(app)/simulations/[simulationId]/page.tsx`
- [ ] T101 [US4] Build simulation history page in `src/app/[locale]/(app)/simulations/page.tsx`
- [ ] T102 [US4] Add run-progress, idempotency, invalid-value, stale-baseline, empty, and calculation-error states
- [ ] T103 [US4] Add reduced-motion result transitions and accessible completion announcement

**Checkpoint**: The flagship simulator works end-to-end without requiring AI.

---

## Phase 7: User Story 5 — Compare Options and Receive Actionable Advice (Priority: P2)

**Goal**: Compare scenarios and generate grounded, structured AI explanations.

**Independent Test**: Compare two scenarios and force AI success, malformed output, timeout, and provider-error paths.

### Tests for User Story 5

- [ ] T104 [P] [US5] Write AI output-schema tests in `tests/unit/ai-schema.test.ts`
- [ ] T105 [P] [US5] Write prompt context-redaction tests in `tests/unit/ai-context.test.ts`
- [ ] T106 [P] [US5] Write comparison service tests in `tests/unit/comparison.test.ts`
- [ ] T107 [P] [US5] Write AI fallback integration tests in `tests/integration/advisor.test.ts`
- [ ] T108 [P] [US5] Write comparison and advisor e2e test in `tests/e2e/advisor.spec.ts`

### Implementation for User Story 5

- [ ] T109 [P] [US5] Define AI recommendation schemas in `src/lib/ai/schemas.ts`
- [ ] T110 [P] [US5] Define Wallflower system prompt and scenario templates in `src/lib/ai/prompts.ts`
- [ ] T111 [US5] Implement Gemini server client using the official `@google/genai` SDK with native Zod `responseSchema` validation, timeout, and retry in `src/lib/ai/client.ts`
- [ ] T112 [US5] Implement context selector that sends only relevant business values in `src/features/advisor/services/context.service.ts`
- [ ] T113 [US5] Implement AI recommendation route in `src/app/api/ai/recommendation/route.ts`
- [ ] T114 [US5] Persist AI recommendations separately from deterministic results
- [ ] T115 [P] [US5] Build calculated-fact, assumption, AI-interpretation, uncertainty, and disclaimer components in `src/features/advisor/components/`
- [ ] T116 [US5] Build contextual advisor page in `src/app/[locale]/(app)/advisor/page.tsx`
- [ ] T117 [P] [US5] Implement scenario comparison service in `src/features/simulations/services/comparison.service.ts`
- [ ] T118 [US5] Build comparison table and chart view in `src/app/[locale]/(app)/simulations/compare/page.tsx`
- [ ] T119 [US5] Add insufficient-data, malformed-output, timeout, retry, and provider-unavailable states
- [ ] T120 [US5] Ensure AI confidence label derives from data completeness and sensitivity, not fabricated probability

**Checkpoint**: Users can compare options and receive grounded advice without losing access to calculations when AI fails.

---

## Phase 8: User Story 6 — Generate and Share a Decision Report (Priority: P2)

**Goal**: Generate a versioned, printable report and 90-day action plan.

**Independent Test**: Generate and print a report from seeded data and verify source dates, sections, page breaks, and missing-data labels.

### Tests for User Story 6

- [ ] T121 [P] [US6] Write report composition tests in `tests/unit/report.service.test.ts`
- [ ] T122 [P] [US6] Write report authorization tests in `tests/integration/reports.test.ts`
- [ ] T123 [P] [US6] Write print-layout and PDF smoke test in `tests/e2e/report.spec.ts`

### Implementation for User Story 6

- [ ] T124 [US6] Implement report composition service in `src/features/reports/services/report.service.ts`
- [ ] T125 [US6] Implement report create and delete actions in `src/actions/report.actions.ts`
- [ ] T126 [P] [US6] Build report cover, executive summary, metric table, risk section, simulation section, recommendation section, and action-plan components in `src/components/reports/`
- [ ] T127 [US6] Build report detail page in `src/app/[locale]/(app)/reports/[reportId]/page.tsx`
- [ ] T128 [US6] Build report history page in `src/app/[locale]/(app)/reports/page.tsx`
- [ ] T129 [US6] Implement print stylesheet in `src/app/print.css`
- [ ] T130 [US6] Add data-through date, calculation version, report version, assumptions, and disclaimer
- [ ] T131 [US6] Add browser print/PDF action and print-preview mode
- [ ] T132 [US6] Add incomplete-section and stale-source indicators

**Checkpoint**: Reports are useful in a demo and reproducible from their source records.

---

## Phase 9: User Story 7 — Manage Preferences and Security (Priority: P3)

**Goal**: Users can manage appearance, language, profile, business details, and account security.

**Independent Test**: Change each preference, reload, and verify persistence and authorization.

### Tests for User Story 7

- [ ] T133 [P] [US7] Write preference persistence tests in `tests/integration/preferences.test.ts`
- [ ] T134 [P] [US7] Write settings keyboard and responsive test in `tests/e2e/settings.spec.ts`

### Implementation for User Story 7

- [ ] T135 [P] [US7] Build profile and preference schemas in `src/features/settings/schemas.ts`
- [ ] T136 [US7] Implement preference update actions in `src/features/settings/actions.ts`
- [ ] T137 [US7] Build appearance, language, date, currency, and accessibility settings
- [ ] T138 [US7] Build profile and business-information settings
- [ ] T139 [US7] Build password and session-management controls supported by Better Auth
- [ ] T140 [US7] Build account-deletion confirmation flow
- [ ] T141 [US7] Build `src/app/[locale]/(app)/settings/page.tsx`
- [ ] T142 [US7] Add destructive-action and reauthentication error states

**Checkpoint**: Preferences and security controls work without affecting core business data.

---

## Phase 10: Marketing Site and Demo Story

**Purpose**: Present Wallflower clearly without fabricated traction or unsupported claims.

- [ ] T143 Build marketing navigation and responsive header in `src/app/[locale]/(marketing)/`
- [ ] T144 Build landing hero using approved copy and a real product-preview composition
- [ ] T145 Build three-step workflow section: Diagnose, Simulate, Act
- [ ] T146 Build supported scenario examples section
- [ ] T147 Build explainability and trust section distinguishing calculations from AI
- [ ] T148 Build Thai SME context and challenge-alignment section
- [ ] T149 Build final CTA and footer
- [ ] T150 Add restrained Motion interactions and reduced-motion alternatives
- [ ] T151 Remove fabricated customer logos, user counts, ratings, and improvement statistics
- [ ] T152 Add SEO metadata, Open Graph image, sitemap, and robots configuration
- [ ] T153 Add landing-page performance and accessibility test in `tests/e2e/landing.spec.ts`

**Checkpoint**: The public site communicates the product accurately and leads into onboarding or a sample simulation.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Prepare the prototype for judging, user testing, and deployment.

- [ ] T154 [P] Review every page against `design.md` Design QA Checklist
- [ ] T155 [P] Complete English copy and Thai-ready translation keys
- [ ] T156 [P] Verify light, dark, and system themes across all core routes
- [ ] T157 [P] Verify reduced-motion behavior across marketing and application routes
- [ ] T158 [P] Add loading, empty, error, partial-data, and offline-message states to all core screens
- [ ] T159 Perform ownership and insecure-direct-object-reference security review
- [ ] T160 Verify secrets and financial payloads are absent from client bundles and logs
- [ ] T161 Run Prisma migration from a clean database and validate seed process
- [ ] T162 Run unit coverage and reach at least 90% statement coverage in calculations and risk rules
- [ ] T163 Run complete Playwright suite in desktop, tablet, and mobile projects
- [ ] T164 Run WCAG checks and manually verify keyboard navigation
- [ ] T165 Profile dashboard and simulation performance and remove avoidable client JavaScript
- [ ] T166 Verify THB formatting, rounding, date handling, and timezone behavior
- [ ] T167 Validate all report print page breaks in Chrome and Edge
- [ ] T168 Create a polished GreenCafe demo dataset and scripted demo journey
- [ ] T169 Update README with architecture, setup, screenshots, limitations, and demo account instructions
- [ ] T170 Deploy preview to Vercel and connect production Neon branch
- [ ] T171 Run production smoke test for register → onboard → diagnose → simulate → advise → report
- [ ] T172 Tag prototype release and record known limitations

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

## Implementation Strategy

### MVP First

The smallest strong demo increment is:

1. Setup and Foundation
2. User Story 1: onboarding and baseline
3. User Story 2: dashboard and health
4. User Story 4: one fully tested scenario, beginning with Hire Employees
5. Validate with users and deploy

Then add the remaining four scenarios, risk center, comparison, AI explanation, and report.

### Recommended Team Split

- **Developer A**: authentication, onboarding, database, settings
- **Developer B**: metrics, risk engine, dashboard
- **Developer C**: scenario engine, results, comparison
- **Developer D or shared responsibility**: AI, reports, QA, deployment
- **Designer**: design system, responsive screens, usability testing, content QA

## Notes

- Commit after each task or coherent group.
- Tests for calculations and risk rules must fail before implementation.
- Do not merge AI-generated numbers into deterministic result objects.
- Store calculation versions with every saved result.
- Avoid adding deferred integrations during the MVP.
- A visually complete screen is not complete until its error, loading, empty, dark, mobile, and reduced-motion states exist.
