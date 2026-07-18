# Wallflower Implementation Progress

## Project Status

* **Current Milestone:** Phase 2.5 — Frontend Foundation & Phase 3 — Baseline Backend Onboarding
* **Last Completed Task:** T037 (Financial calculation fixtures)
* **Next Recommended Task:** T028 (Configure theme provider - Void) & T039 (Write business Zod schema tests - Thiha)
* **Last Updated Date:** 2026-07-18

---

## Shared Foundation

* **Project Setup:** Completed and verified (T001–T009). Next.js 16.2 App Router, Tailwind CSS v4, TypeScript strict compile checks, ESLint Flat Config, and Prettier configurations.
* **Prisma & Neon Database:** Completed and verified (T010–T013). Schema defined, relational UUID models mapped, database migrations applied to Neon, and minimal seed script generated.
* **Better Auth Foundation:** Completed and verified (T014–T016). Server/client configurations, API auth route hooks, and local credentials/OAuth client hooks.
* **Authorization & Ownership:** Completed and verified (T017–T019). Session resolution guards, requireAuth/requireOnboarded redirect controls, resource ownership validators, and integration checks.
* **Shared Validation:** Completed and verified (T023). Common Zod validation rules (UUIDs, pagination parameters, dates, positive money amounts).
* **Money Helpers:** Completed and verified (T020). Decimal-safe arithmetic wrappers (add, subtract, multiply, divide) and currency/percentage formatters.
* **Logging:** Completed and verified (T022). Lightweight Console JSON structured logger with sensitive credential parameter sanitization.
* **Design Tokens:** Completed and verified (T026). Semantic colors (Teal brand, Cyan AI, Green success, Amber warning, Red danger) mapped to CSS variables in globals.css for light/dark themes.
* **Fonts:** Completed and verified (T027). Geist and Noto Sans Thai fonts loaded via App Router layout structure.
* **CI & Testing Foundation:** Completed and verified (T008). GitHub Actions run linting, typescript checking, unit tests, and production compilation on pushes/PRs.

---

## Frontend — Void

* **Current Branch:** `feature/ui-foundation`
* **Current Milestone:** Phase 2.5 — Frontend Foundation
* **Next Task:** T028 (Configure theme provider)
* **Completed Tasks:**
  * T026 Implement light and dark design tokens from `design.md` in `src/app/globals.css`
  * T027 Configure Geist Sans, Geist Mono, and Noto Sans Thai fonts in App layouts
* **In-Progress Tasks:**
  * None
* **Next Tasks (Phase 2.5 UI Foundation):**
  * T028 Configure theme provider and system/light/dark persistence
  * T029 Configure next-intl localization routing and English/Thai message files
  * T030 Build reusable typography, status badges, empty/error panels, and skeleton UI components
  * T031 Build responsive application shell, sidebar navigation, and header topbar
  * T032 Build reduced-motion-aware transition animation primitives
  * T033 Add local design-system showcase route
  * T034 Run automated accessibility and color contrast tests
* **Blockers:**
  * None
* **Waiting on Thiha:**
  * Onboarding UI forms (Phase 3 T046) will depend on the final onboarding schemas and server actions (T042, T044, T045) being finalized.

---

## Backend — Thiha

* **Current Branch:** `feature/onboarding-backend`
* **Current Milestone:** Phase 3 — Create a Trusted Business Baseline (Backend)
* **Next Task:** T039 (Write business-profile Zod schema tests)
* **Completed Tasks (Phase 2 Backend Foundation):**
  * T010 Define authentication and user models in database schema
  * T011 Define business, snapshots, risks, and simulations models
  * T012 Apply initial Prisma schema migrations
  * T013 Setup singleton Prisma client
  * T014 Configure Better Auth server adaptors
  * T015 Configure Better Auth client exports
  * T016 Hook auth API route handlers
  * T017 Write server route guards and redirection rules
  * T018 Write ownership authorization rules
  * T019 Write auth integration test checks
  * T020 Implement money and decimal-safe arithmetic helpers
  * T021 Implement custom application errors
  * T022 Implement structured logging sanitizers
  * T023 Define Zod common schemas
  * T025 Define engine version constants
  * T036 Create minimal seed file (seeds user, business, snapshots)
  * T037 Create mock financial fixtures
* **In-Progress Tasks:**
  * None
* **Next Tasks (Phase 3 Backend Onboarding):**
  * T039 Write business-profile Zod schema tests
  * T040 Write onboarding server-action integration tests
  * T042 Define business and financial onboarding schemas
  * T044 Implement business onboarding server action
  * T045 Implement financial snapshot creation action
* **Blockers:**
  * None
* **Waiting on Void:**
  * Registration/login/reset UI forms (T043) and onboarding UI form components (T046) to integrate backend actions.

---

## Integration Status

* **Current User Story:** US1 — Create a Trusted Business Baseline
* **Frontend Onboarding UI Readiness:** Not started (Pending Phase 2.5 UI Foundation setup by Void)
* **Backend Onboarding Service Readiness:** Not started (Pending Phase 3 Backend setup by Thiha)
* **Integration Status:** Waiting (Awaiting baseline UI components and backend actions to connect)
* **E2E Test Readiness:** Waiting (Awaiting implementation of sign-in, signup, and onboarding pages)
* **Next Merge Point:** Complete registration, sign-in pages, and onboarding wizard actions.

---

## Verification Record

| Task | Verification | Result | Date |
|---|---|---|---|
| T001–T009 | `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` | Pass | 2026-07-18 |
| T010–T023, T025–T027, T036–T037 | Prisma validation/migrations, CLI seed scripts, Vitest integration checks, and Turbopack builds | Pass | 2026-07-18 |

---

## Security Checklist

* **Shared Foundation Checkpoints:**
  - [x] Secrets are server-side only
  - [x] `.env` files are ignored by Git
  - [x] Protected routes require authentication
  - [x] Database queries verify business ownership
  - [x] User input is validated with Zod
  - [x] Financial amounts use decimal-safe handling
  - [x] Logs exclude passwords, tokens, and sensitive payloads
  - [x] IDOR tests pass
  - [x] Dependency audit reviewed
* **Pending Feature Checkpoints:**
  - [ ] Server actions validate authorization (Thiha)
  - [ ] AI receives only necessary business context (Thiha)
  - [ ] AI cannot alter calculated financial results (Thiha)
  - [ ] Destructive actions require confirmation (Void)
  - [ ] Production environment variables verified (Shared)

---

## Design Checklist (Void)

- [ ] Uses Wallflower design tokens
- [ ] Teal remains the main brand color
- [ ] No generic purple AI styling
- [ ] Light mode verified
- [ ] Dark mode verified
- [ ] Mobile layout verified
- [ ] Tablet layout verified
- [ ] Loading state included
- [ ] Empty state included
- [ ] Error state included
- [ ] Partial-data state included
- [ ] Keyboard navigation verified
- [ ] Reduced motion supported
- [ ] Thai text layout checked
- [ ] Status is not communicated through color alone

---

## Deferred Items

- Accounting integrations
- Bank integrations
- Automated compliance monitoring
- Subscription billing
- Native mobile application
- Custom machine-learning models
- Audit logging (AuditEvent and log triggers postponed)
- T024 Idempotency helper (Deferred until mutations exist)
- T035 Generic repository helpers (Removed)
- T038 Playwright auth setup (Deferred until authentication flow exists)

---

## Last Session Notes

Completed Phase 2 Foundational backend layers:
1. Created unified PostgreSQL database schemas mapping official Better Auth credentials and custom client snapshots with `onDelete: Restrict` baseline rules.
2. Ran migrations, created seed file, and verified database inserts.
3. Created Better Auth server and client integrations, routes, and integration verification tests.
4. Created Money, Errors, lightweight console structured Logger, Zod, and calculations version files.
5. Configured Next.js 16 optimistic routing proxy redirects.
6. Reorganized project tasks and progress tracking files to outline Frontend (Void) and Backend (Thiha) ownership boundaries.

---

## Next Session Instructions

1. Read `AGENTS.md`.
2. Read this file.
3. Void should checkout `feature/ui-foundation` and complete the UI Milestones (T028–T034).
4. Thiha should checkout `feature/onboarding-backend` and complete the Backend Milestones (T039–T040, T042, T044–T045).
5. Ensure to pull updated `main` before integrating, and run all checks before submitting pull requests.