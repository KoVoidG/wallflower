# 03 — Component Contracts

## Why component contracts matter

Generic primitives such as `Card`, `Badge`, and `Button` are implementation tools, not product components. Wallflower needs components that encode business meaning and prevent every screen from becoming a grid of identical white boxes.

Each contract below defines required content and behavior. The exact code API may vary, but the product semantics must remain.

---

## `BusinessPulse`

### Purpose

Answers: “What is the current overall business condition, what changed, and why?”

### Required content

- posture: stable, watch, pressured, critical, or insufficient data
- one-sentence interpretation
- one quantified reason
- data-through date
- confidence or data completeness
- link to supporting details

### Rules

- must be visually dominant on the dashboard
- must not reduce health to an unexplained percentage
- must not use celebratory language
- must show the most important change since the comparison period
- must remain understandable in grayscale

---

## `MetricDelta` & `KpiCard`

### Purpose

Shows one metric with context, comparison, and business meaning.

### Required content

- label
- current or projected value (using `<FinancialValue />` for monetary figures)
- unit
- comparison value or period
- direction and magnitude of change
- status interpretation (`healthy`, `warning`, `danger`)
- optional compact sparkline
- calculation tooltip or details link

### Rules

- never show a naked value without unit or period
- do not place a full chart inside every metric
- use tabular numerals (`tabular-nums`)
- positive direction must reflect business meaning; lower expenses can be positive

---

## Canonical Controls & Input Contracts

### 1. `Select` (`src/components/ui/select.tsx`)
- Standard dropdown selector for single-choice option lists.
- Height: 40px default, 44px touch target on mobile.
- Supports keyboard navigation (Up/Down arrows, Enter, Space, Escape).
- Features focus-visible rings (`focus-visible:ring-2 focus-visible:ring-brand/40`).

### 2. `MonthPicker` (`src/components/ui/month-picker.tsx`)
- Standard picker for reporting periods and historical months.
- Replaces raw browser `type="month"` inputs across all features.
- Includes quick-selector year dropdowns and locale-aware month formatting.

### 3. `FinancialValue` (`src/components/ui/domain-values.tsx`)
- Domain component for formatting all currency amounts in THB (`฿`).
- Enforces tabular numerals (`tabular-nums font-semibold text-text-primary`).

### 4. `QualityBadge`, `FreshnessIndicator`, `CompletenessIndicator`
- Provenance markers displaying data status (`actual`, `estimated`, `imported`, `sample`, `missing`).

---

## `DataFreshness`

### Purpose

Shows how current and complete the data is.

### Required content

- data-through date
- source summary
- freshness state: current, aging, stale, mixed, unknown
- missing or disconnected source count when applicable

---

## `DecisionVerdict`

### Purpose

Communicates the recommended posture for a simulation.

### Required content

- verdict: proceed, proceed cautiously, delay, avoid, or insufficient evidence
- one-sentence rationale
- main constraint or risk factor
- key assumptions
- links to sensitivity analysis and action creation
