# Wallflower Agent Instructions

This repository follows a specification-driven workflow.

Do not generate architecture independently.

The specification documents are authoritative.

If implementation differs from the specification, ask before changing the specification.

## Project Identity

Wallflower is an AI-powered decision-intelligence platform for Thai SMEs.

Core workflow:

Business Baseline
→ Business Health
→ Risk Detection
→ Scenario Simulation
→ Scenario Comparison
→ AI Explanation
→ Decision Report

Wallflower is a planning and warning platform.

It is NOT:

- an accounting system
- a legal adviser
- a tax adviser
- an investment adviser
- a lender
- an autonomous business operator

Never claim guaranteed outcomes, guaranteed funding, guaranteed compliance, or scientifically validated prediction accuracy.

---

# Source of Truth

Read these files before implementing features:

1. specs/001-wallflower-mvp/spec.md
2. specs/001-wallflower-mvp/plan.md
3. specs/001-wallflower-mvp/design.md
4. specs/001-wallflower-mvp/tasks.md
5. specs/001-wallflower-mvp/progress.md

Priority when conflicts exist:

1. spec.md
2. design.md
3. plan.md
4. tasks.md
5. progress.md

Do not silently modify source-of-truth documents.

---

# Required Technology

Use:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Motion for React
- Neon PostgreSQL
- Prisma ORM
- Better Auth
- React Hook Form
- Zod
- Recharts
- Gemini API
- next-intl
- next-themes
- Vitest
- React Testing Library
- Playwright
- Lucide React

Do not introduce another framework, ORM, database, authentication provider, backend, or AI framework without approval.

---

# Architecture Rules

Use a single full-stack Next.js repository.

Responsibilities:

- src/lib/calculations → deterministic financial calculations
- src/lib/risks → deterministic risk engine
- src/lib/ai → Gemini integration
- src/features → business features
- src/actions → authenticated server actions
- src/components → reusable UI
- prisma → schema & migrations

Rules:

- Never calculate financial values in React components.
- Never expose secrets to the client.
- Never access Prisma from client components.
- Prefer Server Components.
- Reuse shared logic.

---

# Financial Rules

Financial calculations are the source of truth.

Gemini only explains results.

Never use AI to calculate:

- revenue
- expenses
- profit
- cash runway
- ROI
- break-even
- working capital
- scenario outputs

Requirements:

- deterministic TypeScript
- decimal-safe arithmetic
- versioned calculations
- immutable financial snapshots
- assumptions visible
- never fabricate missing data

Write tests before implementing calculations whenever practical.

---

# AI Rules

Gemini receives only relevant structured business data.

Validate every response with Zod.

AI may produce:

- summaries
- explanations
- recommendations
- assumptions
- uncertainty
- action plans

AI must never overwrite deterministic calculations.

If AI fails:

- preserve calculations
- preserve simulation
- offer retry
- log safely

---

# Authentication Rules

Every protected request must:

1. authenticate the user
2. verify business ownership
3. validate input with Zod
4. perform server-side authorization

Never trust IDs supplied by the client.

---

# Design Rules

Follow:

specs/001-wallflower-mvp/design.md

Mandatory:

- Teal is the primary brand color.
- Purple is NOT the primary brand color.
- Blue = information.
- Cyan = AI.
- Green = success.
- Amber = warning.
- Red = danger.
- Geist Sans + Noto Sans Thai.
- Light, dark and system themes.
- Reduced-motion support.
- Reuse shadcn/ui.
- No generic purple AI dashboards.

Every page should include:

- loading state
- empty state
- error state
- mobile layout
- dark mode

---

# Working Workflow

For every implementation request:

1. Read AGENTS.md.
2. Read progress.md.
3. Find relevant task IDs.
4. Inspect repository.
5. Inspect git status.
6. Confirm dependencies.
7. State expected changed files.
8. Implement only requested scope.
9. Run relevant verification.
10. Update tasks.md.
11. Update progress.md.
12. Summarize changes.

Never implement the whole application in one request.

---

# Task Status

Use:

[ ] Not Started
[~] In Progress
[x] Completed & Verified
[?] Implemented but Unverified
[!] Blocked
[-] Deferred

Only mark [x] after implementation and verification.

---

# Progress Tracking

Use:

specs/001-wallflower-mvp/progress.md

At session start:

- read progress.md
- inspect repository
- inspect git status
- compare code with progress
- continue from first incomplete task

Before ending:

- update progress.md
- update tasks.md
- record changed files
- record tests
- record blockers
- set next task

Trust the repository and Git history over stale progress notes.

---

# Verification

Use relevant commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright test
npx prisma validate
npx prisma migrate status
```

Verify:

- desktop
- tablet
- mobile
- light mode
- dark mode
- reduced motion
- authorization
- accessibility

---

# Git Safety

Never run without approval:

- git reset --hard
- git clean -fd
- force push
- delete migrations
- delete user data

Do not commit secrets.

---

# Deferred Scope

Do not implement without approval:

- accounting integrations
- banking integrations
- spreadsheet import
- automated compliance
- subscriptions
- native mobile apps
- ML models
- Monte Carlo simulation

---

# Completion Report

Always finish with:

Completed tasks

Changed files

Verification

Known issues

Blocked items

Next recommended task

---

# Session Start

Before coding:

1. Read source-of-truth files.
2. Inspect repository.
3. Inspect Git state.
4. Compare with progress.md.
5. Identify next task.

---

# Session End

Before finishing:

1. Run verification.
2. Update tasks.md.
3. Update progress.md.
4. Record next task.
5. Leave the project in a buildable state whenever practical.
