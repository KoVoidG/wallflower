# 12 — Agent Rules

## Source of truth

Before editing user-facing UI, read:

1. `00-design-principles.md`
2. `01-design-tokens.md`
3. `02-layout-system.md`
4. `03-component-contracts.md`
5. the target route in `09-screen-specifications.md`
6. `10-state-design.md`
7. this file

Read chart, motion, content, accessibility, and responsive files when relevant.

## Mandatory planning before code

Before implementation, state:

1. the primary user question
2. the primary action
3. the required hierarchy
4. the product-specific components to use or create
5. the data states that must be supported
6. desktop, tablet, and mobile behavior
7. any required deviation and reason

Do not begin with code before this brief is established.

## Non-negotiable rules

- Do not create a generic shadcn dashboard.
- Do not use `Card` as the default wrapper for every section.
- Do not introduce new colors, radii, shadows, spacing, or typography values.
- Do not use raw hex colors in page components.
- Do not use purple as a brand or AI color.
- Do not use gradients unless a route specification explicitly requires one.
- Do not use glassmorphism as an application surface.
- Do not put a full chart inside every KPI card.
- Do not use pills as the default filter, navigation, or form pattern.
- Do not show important metrics without unit, period, comparison, and meaning.
- Do not present AI interpretation as calculated fact.
- Do not hide assumptions, confidence, or stale data.
- Do not use fabricated customer logos, testimonials, or performance claims.
- Do not use placeholder financial values in production states.
- Do not declare a page complete without loading, empty, partial, error, and success states where applicable.
- Do not declare a page complete without mobile and dark-mode review.
- Do not animate serious warnings or continuously animate financial values.
- Do not silently deviate from a component contract or screen specification.

## Required product relationships

Preserve these relationships in UX and code:

```text
Risk → Evidence → Mitigation → Simulation

Simulation → Assumptions → Scenarios → Sensitivity → Verdict

Advisor answer → Calculated evidence → Interpretation → Action

Report → Data freshness → Findings → Recommendation → 90-day plan
```

## Component creation rule

When a pattern carries business meaning, create or reuse a product-specific component.

Prefer:

- `BusinessPulse`
- `MetricDelta`
- `DecisionVerdict`
- `ScenarioComparison`
- `SensitivityBoundary`
- `RiskExposure`
- `EvidenceBlock`
- `AssumptionField`
- `ConfidenceIndicator`
- `RecommendationPanel`
- `DataFreshness`

Do not solve these patterns only by passing different class names into a generic card.

## Implementation procedure

### Before coding

- inspect current components and tokens
- identify reusable product components
- write route hierarchy
- list required states
- confirm data source labels
- identify accessibility behavior

### During coding

- use semantic HTML
- preserve visible labels
- use tabular numerals
- use one primary action per panel
- test keyboard focus
- keep calculated fact and AI interpretation separate
- avoid arbitrary CSS values

### After coding

1. Compare implementation with `09-screen-specifications.md`.
2. Compare components with `03-component-contracts.md`.
3. Review loading, empty, stale, partial, error, and success states.
4. Test desktop, tablet, and mobile.
5. Test light and dark themes.
6. Test keyboard navigation and reduced motion.
7. Score the page using `11-design-qa.md`.
8. List and fix deviations below the acceptance threshold.

## Rejection conditions

Reject and revise the implementation when any of the following is true:

- every major section is a white bordered card
- the first viewport has no dominant information
- the page could belong to a generic analytics product
- the page begins with equal KPI cards when a conclusion should lead
- metrics are shown without context or comparison
- a simulation result lacks a recommendation
- a simulation result lacks a sensitivity boundary when calculable
- baseline and assumptions are visually indistinguishable
- an AI response lacks calculated evidence
- critical risks lack quantified consequence or measurable mitigation
- filters are more visually prominent than the content they filter
- the primary action is not visually obvious
- confidence is displayed without explanation
- stale data is hidden
- mobile is only a compressed desktop layout
- essential information exists only on hover
- page score is below 18/22

## Expected response format after implementation

```md
## Implementation summary

- Primary user question:
- Primary action:
- Product-specific components used:
- States implemented:
- Responsive behavior:

## Design QA

- Score: __ / 22
- Accessibility reviewed: yes / no
- Dark mode reviewed: yes / no
- Reduced motion reviewed: yes / no
- Thai-ready reviewed: yes / no

## Deviations

- None

or

1. Deviation, reason, and impact.
```

## Example task instruction

```text
Use docs/design as the source of truth.

Before coding, read the required files and summarize the route hierarchy,
primary user question, primary action, product-specific components, states,
and responsive behavior.

Do not introduce new design tokens or use generic Card components for every
section. Implement all relevant loading, empty, stale, partial, error, and
success states. Separate calculated facts, assumptions, and AI interpretation.
After implementation, score the result with 11-design-qa.md and revise any
rejection condition before declaring the task complete.
```
