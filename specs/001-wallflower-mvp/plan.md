# Implementation Plan: Wallflower MVP

**Branch**: `001-wallflower-mvp` | **Date**: 2026-07-18 | **Spec**: `spec.md`

**Input**: Feature specification from `/specs/001-wallflower-mvp/spec.md`

## Summary

Build Wallflower as a responsive Next.js web application for Thai SMEs. The MVP creates a structured business baseline, calculates business-health metrics, detects risks using deterministic rules, simulates five business decisions, compares scenarios, and uses Gemini only to explain calculated results and suggest actions. Neon PostgreSQL stores application data, Prisma provides typed persistence, Better Auth handles authentication, and Vercel hosts the application.

The implementation prioritizes an independently testable decision-intelligence loop:

```text
Business profile
  → financial baseline
  → health diagnostics
  → risk detection
  → scenario simulation
  → comparison and AI explanation
  → report and action plan
```

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 22 LTS

**Primary Dependencies**:

- Next.js 15 App Router
- React 19
- Tailwind CSS 4
- shadcn/ui and Radix UI
- Motion for React
- Prisma ORM
- Better Auth
- Zod
- React Hook Form
- Recharts
- Google Gen AI SDK (`@google/genai` with native Zod `responseSchema` support)
- next-intl
- next-themes
- Lucide React

**Storage**: Neon PostgreSQL; browser-generated PDF for reports; no persistent file storage in MVP

**Testing**:

- Vitest for calculation, risk-rule, schema, and service tests
- React Testing Library for key components and forms
- Playwright for end-to-end journeys
- axe-core/Playwright accessibility checks

**Target Platform**: Modern evergreen browsers; primary desktop layout at 1280 px and above; tablet and functional mobile layouts

**Project Type**: Full-stack web application in one Next.js repository

**Performance Goals**:

- Warm dashboard page LCP under 2.5 seconds
- Non-network interactions under 100 ms perceived response
- Standard server actions under 1 second p95 excluding AI
- Smooth 60 fps interface motion on supported hardware
- AI response timeout and recovery within 20 seconds

**Constraints**:

- Student team and short challenge timeline
- Free or low-cost service tiers
- No autonomous financial decisions
- No language-model arithmetic
- Manual business-data entry
- One business per user in MVP
- Financial correctness and explainability take priority over feature count
- Light, dark, English, Thai-ready, and reduced-motion states must use the same component system

**Scale/Scope**:

- Prototype target: 50–500 test users
- One business per user
- Up to 36 monthly snapshots per business
- Up to 100 simulations per business
- Approximately 12 application screens plus marketing pages
- Five deterministic scenario types

## Architecture Decisions

### ADR-001: Full-stack Next.js

Use Next.js App Router for rendering, route protection, server actions, route handlers, report pages, and API integrations. A separate Express or FastAPI service is not required for the MVP.

### ADR-002: Neon PostgreSQL with Prisma

Use Neon because compute can scale to zero without pausing the entire project after a fixed inactivity period. Use Prisma for schema readability, migrations, relation handling, generated types, and Prisma Studio.

### ADR-003: Better Auth

Use Better Auth with Prisma so account, session, and verification data remain portable in the same PostgreSQL database. Support email/password and Google in MVP.

### ADR-004: Deterministic financial engine

All monetary calculations and risk classifications live in versioned, pure TypeScript modules. The language model receives only structured inputs and calculated outputs.

### ADR-005: Structured AI output

Gemini returns a Zod-validated object with summary, evidence, risks, actions, assumptions, uncertainty, and disclaimer fields. Enforcement is done natively using the official `@google/genai` SDK's Zod `responseSchema` generation configuration. Invalid output triggers one repair attempt and then a graceful fallback.

### ADR-006: Semantic design tokens

Use neutral surfaces with teal as the Wallflower brand color. Blue is reserved for informational and growth contexts, green for positive status, amber for warnings, and red for critical risk. Avoid purple as a primary brand color.

### ADR-007: Browser-first report export

Generate reports as semantic HTML with print CSS. Browser print-to-PDF is the MVP export method to avoid early PDF rendering complexity.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **User value first**: Pass. Each P1 story delivers standalone diagnostic or simulation value.
- **Deterministic financial truth**: Pass. Calculations are isolated from AI generation.
- **Privacy by default**: Pass. Server-side authorization is required for all business data.
- **Explainability**: Pass. Metrics, risk rules, assumptions, and data-through dates are visible.
- **Accessibility**: Pass. WCAG AA, keyboard support, reduced motion, and semantic status design are required.
- **Scope discipline**: Pass. Integrations, billing, autonomous execution, and advanced ML are deferred.
- **Testability**: Pass. Pure calculation modules and independently testable user stories are defined.
- **Design coherence**: Pass. One token-driven design system supports both themes and locales.

## Project Structure

### Documentation (this feature)

```text
specs/001-wallflower-mvp/
├── spec.md
├── plan.md
├── design.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── auth.md
│   ├── business-profile.md
│   ├── simulations.md
│   ├── ai-recommendations.md
│   └── reports.md
└── tasks.md
```

### Source Code (repository root)

```text
wallflower/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── brand/
│   ├── illustrations/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (marketing)/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── features/page.tsx
│   │   │   │   └── about/page.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   ├── onboarding/page.tsx
│   │   │   └── (app)/
│   │   │       ├── layout.tsx
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── business-health/page.tsx
│   │   │       ├── risks/page.tsx
│   │   │       ├── simulations/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/page.tsx
│   │   │       │   ├── compare/page.tsx
│   │   │       │   └── [simulationId]/page.tsx
│   │   │       ├── advisor/page.tsx
│   │   │       ├── reports/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [reportId]/page.tsx
│   │   │       └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts
│   │   │   ├── ai/recommendation/route.ts
│   │   │   └── health/route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── actions/
│   │   ├── business.actions.ts
│   │   ├── financial.actions.ts
│   │   ├── simulation.actions.ts
│   │   └── report.actions.ts
│   ├── components/
│   │   ├── app-shell/
│   │   ├── charts/
│   │   ├── forms/
│   │   ├── metrics/
│   │   ├── motion/
│   │   ├── reports/
│   │   ├── simulations/
│   │   └── ui/
│   ├── db/
│   │   └── prisma.ts
│   ├── features/
│   │   ├── advisor/
│   │   ├── business-profile/
│   │   ├── dashboard/
│   │   ├── reports/
│   │   ├── risks/
│   │   └── simulations/
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── client.ts
│   │   │   ├── prompts.ts
│   │   │   └── schemas.ts
│   │   ├── auth/
│   │   ├── calculations/
│   │   │   ├── money.ts
│   │   │   ├── health.ts
│   │   │   ├── metrics.ts
│   │   │   ├── scenarios/
│   │   │   └── version.ts
│   │   ├── i18n/
│   │   ├── risks/
│   │   │   ├── engine.ts
│   │   │   ├── rules.ts
│   │   │   └── version.ts
│   │   ├── validation/
│   │   └── utils.ts
│   ├── messages/
│   │   ├── en.json
│   │   └── th.json
│   └── types/
├── tests/
│   ├── e2e/
│   ├── fixtures/
│   ├── integration/
│   └── unit/
├── .env.example
├── components.json
├── next.config.ts
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── vitest.config.ts
```

**Structure Decision**: Use one Next.js repository with feature-oriented modules. Database, authentication, calculations, AI, UI, and tests remain separated by responsibility while sharing generated TypeScript types.

## Data Model Direction

Core relationships:

```text
User 1─1 UserPreference
User 1─* Session
User 1─1 Business
Business 1─* FinancialSnapshot
FinancialSnapshot 1─1 MetricSnapshot
FinancialSnapshot 1─* RiskAssessment
RiskAssessment 1─* DetectedRisk
Business 1─* Simulation
Simulation 1─1 SimulationInput
Simulation 1─* SimulationResult
Simulation 1─* AIRecommendation
Business 1─* Report
```

Important rules:

- Financial amounts use Prisma `Decimal`.
- Historical `FinancialSnapshots` are immutable.
- Each simulation references an immutable baseline snapshot used when they were created.
- Deleting a financial snapshot referenced by any simulation is restricted (using Prisma `onDelete: Restrict`).
- Calculation and risk-rule versions are stored with results.
- AI content never overwrites deterministic values.
- Deleting a business cascades to dependent prototype data after confirmation.
- Queries always scope by authenticated user and business ownership.

## Calculation Modules

### Shared metrics

- Monthly revenue
- Monthly expenses
- Gross profit
- Net profit
- Profit margin
- Monthly burn
- Cash runway
- Working capital
- Current ratio
- Receivable and payable pressure
- Break-even revenue
- Expense-category concentration

### Scenario modules

- `hire-employees.ts`
- `change-price.ts`
- `marketing-investment.ts`
- `equipment-purchase.ts`
- `payment-delay.ts`

Every module accepts a typed baseline and assumptions and returns:

```ts
{
  baseline: ScenarioMetrics;
  cases: {
    worst: ScenarioOutcome;
    expected: ScenarioOutcome;
    best: ScenarioOutcome;
  };
  assumptions: AssumptionNote[];
  warnings: CalculationWarning[];
  calculationVersion: string;
}
```

## Risk Engine Direction

Risk rules are pure functions evaluated against a normalized business context. Initial rules include:

- Cash runway below 3, 6, or 9 months
- Negative monthly cash flow
- Expense growth exceeds revenue growth
- Payroll concentration above configured threshold
- Receivable collection pressure
- Current-ratio weakness
- Customer or supplier concentration when data exists
- Low reserve after planned scenario
- Negative or excessively long payback period
- Missing compliance-readiness information

Each rule returns evidence and a mitigation template. AI may rewrite mitigation into simpler language but cannot alter severity or evidence.

## AI Integration Direction

Input:

- Business type, industry, stage, and goals
- Relevant baseline metrics
- Selected scenario and assumptions
- Calculated outcomes
- Detected risks
- User's specific question

Output schema:

```ts
{
  summary: string;
  recommendation: "proceed" | "proceed_with_caution" | "delay" | "avoid" | "insufficient_data";
  confidenceLabel: "low" | "medium" | "high";
  evidence: Array<{ label: string; value: string; explanation: string }>;
  risks: string[];
  actions: Array<{ title: string; description: string; timeframe: string }>;
  assumptions: string[];
  uncertainty: string;
  disclaimer: string;
}
```

The displayed confidence is an evidence-quality label based on data completeness and scenario sensitivity. It must not be presented as scientifically calibrated prediction accuracy.

## Delivery Phases

### Phase 0 — Research and validation

- Validate user pain points and terminology with SME interviews.
- Finalize five simulation formulas and assumptions.
- Verify required Thai/English content.
- Review privacy, disclaimer, and compliance positioning.
- Confirm Neon, Prisma, Better Auth, and `@google/genai` integration patterns.

### Phase 1 — Foundation

- Initialize project and design tokens.
- Configure database, migrations, authentication, localization, and themes.
- Implement app shell, authorization helpers, validation, error handling, and fixtures.

### Phase 2 — Baseline and diagnostics

- Implement onboarding.
- Implement financial snapshots and calculations.
- Build dashboard and business-health views.
- Implement risk engine and risk center.

### Phase 3 — Simulation MVP

- Implement scenario selector and dynamic forms.
- Implement five scenario calculators.
- Build result views and save/history.
- Add unit and end-to-end tests.

### Phase 4 — Advice, comparison, and reports

- Implement side-by-side comparison.
- Integrate structured AI recommendations via `@google/genai` native Zod validation.
- Build report generation and print mode.
- Add action-plan presentation.

### Phase 5 — Polish and demo readiness

- Complete dark mode and responsive states.
- Add motion and reduced-motion behavior.
- Improve empty/error/loading states.
- Run accessibility, security, performance, and usability checks.
- Seed a polished Thai SME demo account.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Separate deterministic and AI intelligence layers | Financial outputs must be reliable and explainable | Asking a language model to calculate creates inconsistent and unverifiable results |
| Versioned snapshots and calculations | Saved simulations and reports must remain reproducible | Recomputing against mutable current data would change historical decisions |
| Internationalized routing from the start | Thai SME context is central to the product | Adding localization after components are built often causes layout and content rework |
