# 04 — Data Visualization

## Principle

Every visualization must answer a business or decision question. A chart is not a decorative container for numbers.

Bad title:

> Revenue Trend

Better title:

> Will cash remain above the 4-month safety threshold after hiring?

## Choosing a visualization

| Question | Preferred form |
|---|---|
| How has one metric changed over time? | Line chart |
| How do categories contribute to a total? | Sorted bar chart |
| What caused a value to increase or decrease? | Waterfall chart |
| How do baseline and scenarios compare? | Direct comparison chart or structured table |
| When will runway cross a threshold? | Timeline or line chart with threshold |
| Which assumptions affect the result most? | Sensitivity bars or tornado chart |
| What is the exact financial detail? | Table |
| What happened in sequence? | Annotated timeline |

Avoid pie and donut charts when precise comparison matters. Use them only for a small part-to-whole composition with no more than five categories and direct labels.

## Chart anatomy

Every chart must include:

- question-based title
- short interpretation or subtitle
- units
- date range
- direct labels or accessible legend
- current value where relevant
- source and data-through date
- annotated important change
- empty and partial-data states
- screen-reader summary
- table alternative for important financial data

## Scenario encoding

| Scenario | Style |
|---|---|
| Baseline | Slate dashed line |
| Expected | Teal solid line, strongest emphasis |
| Best | Green solid line |
| Worst | Coral solid line |

Rules:

- use identical axes and units
- show baseline in every scenario comparison
- directly label line ends when space permits
- use tinted forecast region after the forecast-start date
- mark the decision date
- show the assumption driving each scenario
- mobile may display one selected scenario at a time but must preserve comparison values nearby

## Forecast and observed data

Observed and forecast values must be visually different.

Recommended treatment:

- observed: solid line or full-opacity bar
- forecast: lighter area, dashed continuation, or tinted region
- missing data: gap, not interpolated as though observed
- estimated data: explicit marker or pattern

Never imply historical certainty for a forecast.

## Thresholds

Thresholds should include:

- label
- value and unit
- explanation of why it matters
- visible crossing point

Example:

```text
4-month operating safety threshold
Runway crosses below this level in September.
```

Do not add arbitrary red lines without methodology.

## Annotations

Annotate only meaningful events:

- new employee cost begins
- major customer payment delayed
- price increase starts
- inventory purchase occurs
- forecast begins
- runway crosses threshold
- scenario turns unprofitable

Avoid labeling every point.

## Tooltips

Tooltips may show precision and supporting context but must not contain the only version of essential information.

A tooltip should include:

- date or category
- exact value and unit
- scenario
- change from baseline
- data status when estimated

## Tables

Financial tables must:

- right-align numeric values
- keep units in headers or values
- use tabular numerals
- show totals and subtotals clearly
- use row dividers rather than boxed rows
- use sticky headers for long tables
- support horizontal scroll on mobile
- freeze the first column where practical
- include accessible column headers

## KPI visuals

A metric may include a compact sparkline only when it helps show direction. The sparkline must not replace comparison text.

A KPI should still state:

```text
฿152,400
Up ฿18,200 from June · Stable
```

## Sensitivity visualization

Sensitivity analysis should reveal which input changes the outcome most.

Each variable row should show:

- variable name
- tested range
- impact on primary result
- recommendation-changing threshold
- current assumption

The most influential variable appears first.

## Confidence visualization

Confidence is explanatory, not ornamental.

Show:

- confidence level
- data completeness
- missing variables
- model coverage
- steps to improve confidence

Do not show an unexplained circular gauge.

## Color and accessibility

- never encode outcomes with color alone
- use labels, line styles, icons, or patterns
- maintain WCAG AA contrast for labels and annotations
- avoid red/green-only comparisons
- provide textual summaries
- ensure chart interaction is keyboard-accessible where interaction is essential

## Motion

Allowed:

- cross-fade between scenarios
- one-time line reveal after calculation
- animated threshold transition when assumptions change

Forbidden:

- looping charts
- bouncing points
- counting values on every render
- motion that delays reading

## Chart QA

Before approving a chart, confirm:

- Does the title ask or answer a business question?
- Can the user identify the important conclusion in five seconds?
- Are baseline and forecast distinguishable?
- Are units and date range visible?
- Is an important change annotated?
- Can the chart be understood without color?
- Is essential information available without hover?
- Is there a text or table alternative?
