# Feature Specification: Wallflower MVP

**Feature Branch**: `001-wallflower-mvp`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Build Wallflower, an AI-powered decision-intelligence web application for Thai SMEs that diagnoses business health, detects risks, simulates decisions, explains outcomes, and generates actionable reports."

## Product Definition

Wallflower is a planning and warning platform for Thai SME owners and aspiring entrepreneurs. It helps users replace spreadsheet-only and intuition-based decisions with structured diagnostics, deterministic financial simulations, explainable risk detection, and AI-assisted recommendations.

Wallflower is not an autonomous financial adviser and does not execute business decisions. The MVP focuses on helping users understand their current position, test a small set of decisions, compare likely outcomes, and leave with a practical action plan.

## MVP Scope

### Included

- Public marketing landing page
- Email/password and Google authentication
- Guided business onboarding
- Business profile and financial baseline
- Business-health dashboard
- Rule-based financial and operational risk detection
- Five predefined scenario simulations
- Scenario results with baseline comparison
- Best, expected, and worst cases
- AI-generated explanations based on deterministic results
- Scenario history and side-by-side comparison
- Decision-intelligence report with print/PDF support
- Profile, appearance, language, and security settings
- Responsive light and dark modes

### Deferred

- Banking and accounting integrations
- Spreadsheet ingestion
- Automated legal or regulatory monitoring
- Investor matching
- Multi-branch consolidation
- Monte Carlo forecasting
- Custom machine-learning models
- Native mobile applications
- Automatic execution of recommendations
- Subscription billing
- Multi-user team workspaces

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Trusted Business Baseline (Priority: P1)

A Thai SME owner creates an account, completes a guided onboarding flow, enters essential business and financial information, and receives a usable baseline for future diagnostics and simulations.

**Why this priority**: Every diagnostic, risk, simulation, and recommendation depends on accurate baseline information. Without this story, Wallflower cannot provide meaningful value.

**Independent Test**: Register a new user, complete onboarding with valid data, sign out, sign back in, and verify that the business profile and latest financial snapshot persist.

**Acceptance Scenarios**:

1. **Given** a visitor without an account, **When** they register with valid credentials, **Then** Wallflower creates the account and starts onboarding.
2. **Given** a new user in onboarding, **When** required business and financial fields are completed, **Then** Wallflower validates and saves a business profile and financial snapshot.
3. **Given** an incomplete onboarding form, **When** the user attempts to continue, **Then** Wallflower identifies missing or invalid fields without losing entered data.
4. **Given** a returning user with completed onboarding, **When** they sign in, **Then** Wallflower opens the dashboard instead of restarting onboarding.

---

### User Story 2 - Understand Current Business Health (Priority: P1)

A business owner opens the dashboard and immediately sees the health of the business, including cash runway, profitability, expense pressure, working capital, risk level, recent trends, and the most urgent insight.

**Why this priority**: The dashboard provides immediate standalone value and establishes the context needed before users run simulations.

**Independent Test**: Seed one business with six months of financial snapshots and verify that dashboard metrics, trend charts, status labels, and insight cards are calculated and rendered correctly.

**Acceptance Scenarios**:

1. **Given** a business with valid financial data, **When** the owner opens the dashboard, **Then** Wallflower displays calculated KPI cards and trends.
2. **Given** a business with declining cash reserves, **When** the dashboard loads, **Then** Wallflower highlights cash runway and the relevant warning.
3. **Given** insufficient historical data, **When** the dashboard loads, **Then** Wallflower clearly labels unavailable trends and requests more data rather than inventing values.
4. **Given** light or dark appearance mode, **When** the dashboard is viewed, **Then** all metrics, statuses, charts, and focus states remain readable.

---

### User Story 3 - Detect and Explain Hidden Risks (Priority: P1)

A business owner reviews a prioritized risk center containing financial, operational, growth, and basic compliance-readiness risks, including severity, probability, impact, evidence, and recommended action.

**Why this priority**: Early warning is one of Wallflower's core promises and can be delivered independently before the complete simulation experience.

**Independent Test**: Provide a financial snapshot that triggers known risk rules and confirm that the expected risks, severity levels, evidence, and suggested actions appear.

**Acceptance Scenarios**:

1. **Given** a cash runway below the configured threshold, **When** risk detection runs, **Then** Wallflower creates a high-priority cash-runway risk with supporting values.
2. **Given** multiple detected risks, **When** the owner opens the risk center, **Then** risks are ordered by severity and estimated impact.
3. **Given** a risk card, **When** the owner expands it, **Then** Wallflower shows why it exists, which data supports it, and what action could reduce it.
4. **Given** a rule with missing required inputs, **When** risk detection runs, **Then** Wallflower marks the assessment as incomplete rather than treating the risk as absent.

---

### User Story 4 - Simulate a Business Decision (Priority: P1)

A business owner selects a scenario, enters assumptions, runs a simulation, and receives transparent results comparing the current baseline with best, expected, and worst outcomes.

**Why this priority**: Scenario simulation is Wallflower's flagship differentiator and the primary demonstration feature for the challenge prototype.

**Independent Test**: Run a "Hire Employees" simulation with known inputs and verify the resulting revenue, cost, profit, cash-flow, runway, ROI/payback, and risk calculations against expected fixtures.

**Acceptance Scenarios**:

1. **Given** a completed business baseline, **When** the user selects a supported scenario, **Then** Wallflower pre-fills applicable current values and requests only scenario-specific assumptions.
2. **Given** valid assumptions, **When** the user runs the simulation, **Then** Wallflower calculates and displays baseline and projected outcomes without relying on the language model for arithmetic.
3. **Given** uncertain assumptions, **When** results are generated, **Then** Wallflower shows best, expected, and worst cases and explains which assumptions drive the range.
4. **Given** invalid or unrealistic values, **When** the user submits the scenario, **Then** Wallflower blocks the run and explains how to correct the inputs.
5. **Given** completed results, **When** the user saves the simulation, **Then** it appears in scenario history and can be reopened.

Supported MVP scenarios:

- Hire employees
- Change product or service price
- Marketing investment
- Purchase equipment
- Customer payment delay

---

### User Story 5 - Compare Options and Receive Actionable Advice (Priority: P2)

A business owner compares saved simulations and asks Wallflower's AI Advisor to explain the trade-offs and recommend practical next steps grounded in the business data and simulation outputs.

**Why this priority**: Comparison and explanation turn raw calculations into a decision-support experience, but they depend on the core simulation engine.

**Independent Test**: Save two scenarios for the same business, compare them, and verify that the advisor references only stored metrics and produces structured recommendations with evidence.

**Acceptance Scenarios**:

1. **Given** two or more saved simulations, **When** the user selects up to three, **Then** Wallflower displays a side-by-side comparison with a current-baseline column.
2. **Given** a completed simulation, **When** the AI explanation is generated, **Then** the response includes a summary, key risks, assumptions, recommended actions, and uncertainty notice.
3. **Given** an AI service failure, **When** the user requests advice, **Then** the deterministic results remain available and Wallflower offers a retry without losing the simulation.
4. **Given** a user question outside available business data, **When** the advisor responds, **Then** it states the missing information instead of fabricating a confident answer.
5. **Given** any financial recommendation, **When** displayed, **Then** it includes a notice that users should verify major decisions and seek professional advice where appropriate.

---

### User Story 6 - Generate and Share a Decision Report (Priority: P2)

A business owner generates a professional report containing the business baseline, health analysis, detected risks, simulation results, recommendations, and a 90-day action plan.

**Why this priority**: Reports make the prototype useful for planning, mentors, lenders, advisers, and challenge demonstrations.

**Independent Test**: Generate a report from a seeded business and saved simulation, print it to PDF, and verify that all required sections and source dates are present.

**Acceptance Scenarios**:

1. **Given** available business and simulation data, **When** the user generates a report, **Then** Wallflower creates a structured report with all selected sections.
2. **Given** a report, **When** the user opens print mode, **Then** navigation and interactive controls are removed and the document remains readable on A4 pages.
3. **Given** incomplete data, **When** a report is generated, **Then** incomplete sections are labelled and no fabricated figures are shown.
4. **Given** a report, **When** the user revisits report history, **Then** Wallflower shows the version date and the underlying business snapshot.

---

### User Story 7 - Manage Preferences and Security (Priority: P3)

A user manages profile information, business settings, language, appearance, password, and account security.

**Why this priority**: These capabilities improve trust and usability but are not required to demonstrate the core decision-intelligence loop.

**Independent Test**: Change appearance and language preferences, reload the application, and verify that preferences persist.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they choose light, dark, or system appearance, **Then** Wallflower persists and applies the selection.
2. **Given** Thai or English language selection, **When** the interface reloads, **Then** supported interface labels use the selected language.
3. **Given** a password account, **When** the user changes the password with valid credentials, **Then** existing sessions follow the configured security policy.
4. **Given** a user requests account deletion, **When** they confirm the destructive action, **Then** Wallflower clearly explains the consequence before deletion.

---

### Edge Cases

- Revenue is zero while expenses are positive.
- Expenses are zero, causing undefined ratios.
- Monthly net cash flow is zero or positive, so cash runway is not finite.
- Cash reserve is negative.
- Accounts receivable or payable exceeds monthly revenue.
- Historical snapshots contain missing months or duplicate periods.
- Currency values exceed JavaScript safe integer limits.
- A simulation is submitted twice because of a slow connection.
- A user changes baseline data after creating a simulation.
- The AI provider times out, returns malformed output, or refuses a request.
- A report references an older snapshot than the current dashboard.
- A user attempts to access another business by modifying an identifier.
- The browser blocks third-party authentication popups.
- Reduced-motion preference is enabled.
- Dark mode is used with warning, risk, and chart colors.
- The user has not completed onboarding but navigates directly to protected routes.
- Thai text expansion causes labels or buttons to wrap.
- A scenario produces negative revenue, negative headcount, or impossible dates.
- Multiple tabs edit the same business profile simultaneously.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a public landing page explaining Wallflower's value, workflow, supported simulations, and limitations.
- **FR-002**: The system MUST allow account creation and sign-in using email/password and Google.
- **FR-003**: The system MUST provide password reset and sign-out.
- **FR-004**: The system MUST protect application routes and redirect incomplete accounts to onboarding.
- **FR-005**: The system MUST allow each user to create and manage one business in the MVP.
- **FR-006**: The system MUST collect business type, industry, stage, size, location, goals, and core financial inputs.
- **FR-007**: The system MUST validate business and financial inputs on both client and server.
- **FR-008**: The system MUST save versioned financial snapshots rather than silently overwriting historical values.
- **FR-009**: The system MUST calculate cash runway, gross profit, net profit, profit margin, burn rate, working capital, current ratio where data permits, and break-even indicators.
- **FR-010**: The system MUST distinguish calculated metrics from user-entered values and AI-generated explanations.
- **FR-011**: The system MUST calculate a business-health status using documented, deterministic rules.
- **FR-012**: The system MUST display six-month trends when enough historical data exists.
- **FR-013**: The system MUST detect financial, operational, growth, and basic compliance-readiness risks using deterministic rules.
- **FR-014**: Each detected risk MUST include category, severity, probability band, impact band, evidence, status, and recommended mitigation.
- **FR-015**: The system MUST support the five MVP simulation types defined in User Story 4.
- **FR-016**: Simulation calculations MUST be performed by tested TypeScript functions, not by the language model.
- **FR-017**: Each simulation MUST store input assumptions, baseline snapshot reference, calculation version, and results.
- **FR-018**: Simulation results MUST show current baseline versus projected outcome.
- **FR-019**: Simulation results MUST provide best, expected, and worst cases when assumptions permit.
- **FR-020**: The system MUST show input assumptions and calculation notes beside the results.
- **FR-021**: Users MUST be able to save, rename, duplicate, reopen, and delete simulations.
- **FR-022**: Users MUST be able to compare up to three simulations plus the current baseline.
- **FR-023**: The AI Advisor MUST receive structured calculated results and limited relevant context rather than unrestricted database access.
- **FR-024**: AI output MUST follow a validated structure containing summary, evidence, risks, actions, assumptions, and uncertainty.
- **FR-025**: The system MUST preserve deterministic results when AI generation fails.
- **FR-026**: The system MUST identify AI-generated content and display an appropriate decision-support disclaimer.
- **FR-027**: The system MUST generate a decision-intelligence report containing executive summary, health analysis, risks, simulation, recommendations, and 90-day action plan.
- **FR-028**: Reports MUST include creation date, data-through date, selected scenario, and calculation version.
- **FR-029**: Reports MUST provide print-optimized styling and browser PDF export.
- **FR-030**: Users MUST be able to switch among light, dark, and system appearance modes.
- **FR-031**: The system MUST support English and be structured for Thai localization; the MVP SHOULD include key Thai interface translations.
- **FR-032**: The system MUST respect the browser's reduced-motion preference.
- **FR-033**: The system MUST use semantic status colors and must not rely on color alone to communicate meaning.
- **FR-034**: The system MUST isolate all business records by authenticated owner.
- **FR-035**: The system MUST validate authorization on every server mutation and protected data query.
- **FR-036**: The system MUST log calculation failures and AI-provider failures without recording passwords or unnecessary sensitive business content.
- **FR-037**: The system MUST handle loading, empty, validation, success, partial-data, and error states for every core screen.
- **FR-038**: The system MUST be usable on desktop and tablet and remain functional on mobile widths.
- **FR-039**: The system MUST expose a clear "update financial data" path from dashboard and simulation screens.
- **FR-040**: The system MUST not claim guaranteed outcomes, legal compliance, loan approval, or prediction accuracy unsupported by evidence.

### Non-Functional Requirements

- **NFR-001**: Core pages SHOULD reach Largest Contentful Paint under 2.5 seconds on a typical broadband connection after warm start.
- **NFR-002**: User interactions SHOULD respond within 100 milliseconds where no network request is required.
- **NFR-003**: Standard server actions SHOULD complete within 1 second at p95 excluding external AI latency.
- **NFR-004**: AI generation SHOULD time out gracefully within 20 seconds.
- **NFR-005**: The application SHOULD meet WCAG 2.2 AA for core journeys.
- **NFR-006**: Financial calculations MUST use decimal-safe handling and documented rounding rules.
- **NFR-007**: Core calculation and risk-rule modules MUST achieve at least 90% statement coverage.
- **NFR-008**: The primary onboarding-to-simulation journey MUST have automated end-to-end coverage.
- **NFR-009**: Application secrets MUST remain server-side.
- **NFR-010**: The design MUST remain coherent in English and Thai, light and dark modes, and reduced-motion mode.

### Key Entities *(include if feature involves data)*

- **User**: Authenticated Wallflower account owner; includes identity and preference references.
- **Account**: External or credential-based authentication account associated with a user.
- **Session**: Active authenticated session with expiry and security metadata.
- **Business**: SME profile including name, industry, type, stage, size, location, goals, and ownership.
- **FinancialSnapshot**: Versioned financial baseline for a period, including revenue, expense categories, reserve, receivables, payables, debt, and operational inputs.
- **MetricSnapshot**: Calculated health metrics derived from a financial snapshot and a calculation version.
- **RiskAssessment**: A dated assessment for a business and snapshot.
- **DetectedRisk**: Individual risk with rule identifier, severity, likelihood, impact, evidence, mitigation, and status.
- **Simulation**: Saved decision scenario tied to a business and baseline snapshot.
- **SimulationInput**: Structured scenario-specific assumptions.
- **SimulationResult**: Baseline and projected outcomes for best, expected, and worst cases.
- **AIRecommendation**: Validated explanation and actions generated from structured business results.
- **Report**: Versioned decision-intelligence report tied to specific source records.
- **UserPreference**: Appearance, language, date, currency, and accessibility preferences.
- **AuditEvent**: Security- and calculation-relevant event without sensitive payloads.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 80% of first-time test users complete onboarding in under 5 minutes without assistance.
- **SC-002**: At least 90% of test users correctly identify the business's primary risk from the dashboard or risk center.
- **SC-003**: Users can run a predefined simulation and understand the main financial impact in under 3 minutes.
- **SC-004**: All reference simulation fixtures produce expected values within documented rounding tolerance.
- **SC-005**: At least 85% of usability-test participants can explain the difference between baseline and projected results.
- **SC-006**: At least 80% of users can compare two saved scenarios without guidance.
- **SC-007**: At least 90% of generated AI responses pass the required structured-output validation in test runs.
- **SC-008**: A failed AI request never removes or corrupts calculated simulation results.
- **SC-009**: Reports print to A4/PDF without clipped critical content on supported browsers.
- **SC-010**: Core text and interactive controls meet WCAG AA contrast in both themes.
- **SC-011**: No authenticated user can retrieve or modify another user's business records in authorization tests.
- **SC-012**: The complete demo flow—register, onboard, diagnose, simulate, review recommendation, generate report—can be completed in under 10 minutes.

## Assumptions

- Target users are Thai SME owners and aspiring entrepreneurs with basic business knowledge but limited financial-analysis expertise.
- The MVP supports one business per user.
- The primary currency is THB; architecture will permit additional currencies later.
- Users manually enter their business data during the prototype phase.
- Users have stable internet connectivity; offline mode is out of scope.
- Financial inputs are monthly unless explicitly labelled otherwise.
- Wallflower provides decision support, not accounting, legal, tax, lending, or investment advice.
- Compliance functionality in the MVP is a readiness checklist and educational assistant, not authoritative legal monitoring.
- The app uses a managed PostgreSQL database and external language-model API.
- Thai localization may be partial in the first demo, but layout and content architecture must support it.
- Browser PDF printing is sufficient for the MVP.
- Desktop is the primary demo target; tablet and mobile remain supported.
