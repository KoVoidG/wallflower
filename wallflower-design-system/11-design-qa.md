# 11 — Design QA

## Scoring rule

Score each category from 0 to 2.

- **0:** failed or absent
- **1:** partially met
- **2:** fully met

Maximum: **22 points**. A page requires **18/22** and no rejection condition from `12-agent-rules.md`.

## 1. Primary hierarchy

- 0: No clear starting point or multiple competing primary actions
- 1: Priority exists but competes with similar elements
- 2: One obvious starting point and one clear next action

## 2. Product specificity

- 0: Could belong to any SaaS dashboard
- 1: Uses Wallflower copy but generic composition
- 2: Uses Wallflower-specific decision, risk, evidence, or scenario components

## 3. Decision clarity

- 0: Displays data without helping the user decide
- 1: Some interpretation is present
- 2: Clearly connects evidence to a recommendation or next action

## 4. Data context

- 0: Values lack units, periods, or comparisons
- 1: Some values include context
- 2: Important values show unit, period, comparison, source, and meaning

## 5. Trust and explainability

- 0: Calculations, assumptions, and AI are mixed together
- 1: Partial distinction
- 2: Sources, assumptions, confidence, freshness, and AI interpretation are clearly separated

## 6. Visual hierarchy

- 0: Repeated equal cards and timid typography
- 1: Some size and surface variation
- 2: Strong type, spacing, alignment, and surface hierarchy supports task priority

## 7. Component quality

- 0: Generic primitives used everywhere
- 1: One or two specialized components
- 2: Product-specific component contracts are followed consistently

## 8. State completeness

- 0: Only ideal populated state exists
- 1: Some loading or empty states exist
- 2: Loading, empty, partial, stale, error, and success states are designed as applicable

## 9. Responsive behavior

- 0: Desktop layout only or content is merely shrunk
- 1: Layout stacks but priority is weak
- 2: Mobile order preserves conclusion, action, evidence, and usability

## 10. Accessibility

- 0: Major keyboard, contrast, semantics, or chart-access issues
- 1: Basic accessibility exists
- 2: Meets the route requirements and `07-accessibility.md`

## 11. Content quality

- 0: Generic, vague, celebratory, or unsupported language
- 1: Mostly clear with some generic wording
- 2: Specific, quantified, non-judgmental, and honest about uncertainty

## Mandatory visual review questions

- Can a first-time SME owner explain the page’s purpose in five seconds?
- Does the first viewport reveal what changed and what to do?
- Is every important number understandable without opening a tooltip?
- Are calculated values distinguishable from AI commentary?
- Are data-through date and confidence visible?
- Are assumptions exposed?
- Is the page understandable in grayscale?
- Does Thai text fit without clipping?
- Does the page still work at 320px and 200% zoom?
- Is every animation useful?

## Route-specific checks

### Dashboard

- Business Pulse is dominant
- next action is specific
- no more than four primary KPIs
- chart has an annotation and data-through date

### Risk Center

- exposure and urgency appear before filter detail
- critical evidence is visible
- mitigation is measurable
- mitigation can launch a simulation where appropriate

### Simulator

- baseline and user assumptions are distinguishable
- live impact preview exists on desktop
- review sentence summarizes decision
- calculation sequence is meaningful

### Result

- verdict appears first
- sensitivity boundary is visible
- baseline is included
- confidence has an explanation

### Advisor

- prompts are contextual
- evidence supports answer
- calculated fact and AI interpretation differ visually

### Reports

- report period and freshness are visible
- preview is editorial
- export excludes application chrome

## Sign-off template

```md
### Design QA Result

- Score: __ / 22
- Rejection conditions: none / listed below
- Mobile reviewed: yes / no
- Dark mode reviewed: yes / no
- Reduced motion reviewed: yes / no
- Thai sample reviewed: yes / no

#### Remaining deviations

1. ...

#### Required fixes before completion

1. ...
```
