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

### Example

```text
Stable, but cash pressure is increasing
Runway remains above the 4-month threshold, but overdue receivables rose 18% this month.
Data through 18 July 2026 · High confidence
```

---

## `MetricDelta`

### Purpose

Shows one metric with context, comparison, and meaning.

### Required content

- label
- current or projected value
- unit
- comparison value or period
- direction and magnitude of change
- status interpretation
- optional compact visual
- calculation tooltip or details link

### Rules

- never show a naked value without unit or period
- do not place a full chart inside every metric
- use tabular numerals
- positive direction must reflect business meaning; lower expenses can be positive

---

## `DataFreshness`

### Purpose

Shows how current and complete the data is.

### Required content

- data-through date
- source summary
- freshness state: current, aging, stale, mixed, unknown
- missing or disconnected source count when applicable

### Rules

- must appear near page titles or calculated outputs
- stale data must not be hidden in tooltips
- provide an update action when the user can fix the state

---

## `DecisionVerdict`

### Purpose

Communicates the recommended posture for a simulation.

### Required content

- verdict: proceed, proceed cautiously, delay, avoid, or insufficient evidence
- one-sentence rationale
- primary financial consequence
- confidence
- highest-risk assumption
- primary next action

### Rules

- must appear first on simulation result pages
- must include at least one quantified reason
- must not be implemented as a generic KPI card
- must not communicate verdict through color alone
- AI may explain the verdict but must not overwrite calculated results

### Example

```text
Proceed cautiously
The price increase improves monthly profit by approximately ฿31,000, but the gain disappears if sales volume falls by more than 10.8%.
```

---

## `ScenarioComparison`

### Purpose

Compares baseline, best, expected, and worst outcomes.

### Required content

- baseline reference
- best, expected, and worst values
- at least one primary metric
- assumptions or driver that separates cases
- direct labels, not legend-only identification

### Rules

- expected case receives primary emphasis
- baseline remains visible
- mobile shows expected first; best and worst may collapse
- do not rely on color alone
- all scenario values use the same scale and units

---

## `SensitivityBoundary`

### Purpose

Shows where the recommendation changes.

### Required content

- tested variable
- threshold value
- current assumption
- verdict on each side of the threshold
- confidence or calculation coverage

### Example

```text
The decision remains profitable while customer volume declines by less than 10.8%.
Current assumption: 8% decline.
```

### Rules

- use plain language before technical sensitivity terminology
- must identify the exact assumption
- do not display a threshold that was not calculated

---

## `RiskExposure`

### Purpose

Presents a risk as an actionable business object.

### Required content

- risk statement
- severity and numerical score
- category
- estimated exposure or consequence
- likelihood
- likely date or horizon
- evidence
- what changed
- mitigation
- owner and status when available
- action to simulate mitigation where relevant

### Rules

- critical risks show core evidence without requiring expansion
- do not fill the entire panel with danger color
- severity uses icon, label, and numerical score
- separate observed evidence from inferred interpretation

---

## `EvidenceBlock`

### Purpose

Makes the basis of a claim auditable.

### Evidence types

- calculated fact
- source data
- user input
- assumption
- AI interpretation
- missing information
- limitation

### Required content

- type label
- statement or value
- source or calculation reference
- date when relevant

### Rules

- calculated fact and AI interpretation must look different
- source must be visible without hovering
- do not use AI color for deterministic calculations

---

## `AssumptionField`

### Purpose

Collects or displays a simulation assumption while showing its origin.

### Required content

- label
- value and unit
- source badge: baseline, imported, entered by you, estimated, missing
- helper explanation
- validation and reasonable range
- effect preview when possible

### Rules

- imported values remain editable only when the model supports override
- override state must remain visible
- preserve the original baseline for comparison
- do not present estimated defaults as known facts

---

## `ConfidenceIndicator`

### Purpose

Explains result reliability.

### Required content

- label: high, medium, low, or insufficient
- numerical score only when methodology is defined
- reasons that raise or lower confidence
- missing data
- action to improve confidence

### Rules

- never use confidence as decorative metadata
- “medium confidence” without explanation is incomplete
- do not call confidence “prediction accuracy” unless validated

---

## `RecommendationPanel`

### Purpose

Turns analysis into one prioritized next action.

### Required content

- action statement
- quantified rationale
- urgency or timing
- expected effect
- alternative action when appropriate
- link to simulate, assign, or review

### Rules

- one primary recommendation per panel
- no generic advice such as “monitor cash flow” without a measurable action
- language remains non-judgmental

---

## `BusinessTrend`

### Purpose

Shows how a financial metric changes over time and why.

### Required content

- descriptive question-based title
- unit and date range
- current period and comparison
- forecast start if present
- annotated inflection points
- accessible summary and table alternative

### Rules

- do not title charts only “Revenue Trend” when a decision question is available
- do not hide essential values in hover tooltips
- show data gaps explicitly

---

## `CalculationSequence`

### Purpose

Shows meaningful simulation progress.

### Required stages

1. Reading baseline
2. Applying assumptions
3. Calculating scenarios
4. Testing sensitivity
5. Preparing recommendation

### Rules

- stage labels must reflect actual work where possible
- do not fake precise percentages unless progress is measurable
- announce completion and failure through a live region
- respect reduced motion

---

## `ReportPreview`

### Purpose

Represents a report in the report library.

### Required content

- report title and type
- reporting period
- generated date
- data-through date
- confidence or completeness
- key finding
- status
- preview, download, share, or regenerate actions as available

### Rules

- must provide more context than a bare file row
- outdated reports show their stale state
- preview image may be a lightweight document skeleton, not a fabricated chart

---

## `ContextualPrompt`

### Purpose

Provides an AI Advisor question grounded in current business data.

### Required content

- specific question
- referenced metric, risk, or simulation
- expected answer type

### Good examples

- Why did my runway fall this month?
- Which overdue invoice creates the most risk?
- Can I safely hire one employee in September?
- Which assumption most affects my price simulation?

### Forbidden examples

- Ask me anything
- How can I improve my business?
- Generate insights

---

## `EmptyState`

### Required content

- what is unavailable
- why it matters
- what data or action resolves it
- one primary action
- optional realistic example

### Rules

- do not use decorative illustration as the main content
- do not blame the user
- avoid “Nothing here yet” as the complete message

---

## `StatusBadge`

### Purpose

Compact metadata only.

### Rules

- use for severity, category, confidence, or state
- maximum 1–3 words when possible
- must not become the default form control
- status uses at least two signals: color + text, icon + text, or score + text

---

## Generic primitive limits

### `Card`

Allowed for self-contained analytical modules. Forbidden as the automatic wrapper for every section.

### `Badge`

Allowed for compact metadata. Forbidden for large filter systems, goals, and primary navigation when tabs or checkboxes are more appropriate.

### `Alert`

Use only for time-sensitive information, errors, data quality, or action-required notices. Do not use it as decorative introductory text.

### `Accordion`

May hide supporting evidence or secondary risks. Critical summary information must remain visible before expansion.
