# 06 — Content Guidelines

## Voice

Wallflower speaks like a calm business analyst.

The voice is:

- clear
- specific
- non-judgmental
- evidence-based
- action-oriented
- honest about uncertainty
- understandable to non-finance experts

## Writing structure

For important findings, use:

1. finding
2. evidence
3. consequence
4. action
5. uncertainty or condition

Example:

> Cash reserves currently cover approximately 2.8 months of operating expenses, below the 4-month safety threshold. A two-week customer payment delay could reduce runway to 2.1 months. Consider collecting at least ฿120,000 in overdue receivables before adding new recurring expenses.

## Preferred terms

- Business health
- Risk
- Scenario
- Assumption
- Baseline
- Expected case
- Best case
- Worst case
- Recommendation
- Data completeness
- Data through
- Estimated impact
- Confidence
- Working capital
- Cash runway
- Break-even

## Avoid

- Prediction accuracy unless scientifically validated
- Guaranteed
- Fail-proof
- AI knows
- Perfect decision
- Magic
- Revolutionary insight
- Amazing result
- Your business is bad
- You failed

## Titles

Use question-based or conclusion-based titles.

Weak:

- Revenue Trend
- Risk Overview
- Simulation Result

Better:

- Will cash remain above the safety threshold?
- Three risks require action this month
- The price increase is profitable only above 89% of current volume

## KPI copy

Every KPI should include:

- value
- unit
- comparison period
- interpretation

Example:

```text
4.2 months
Down 0.8 months since June · Watch
```

Do not use unlabeled arrows without comparison text.

## Risk copy

Risk statements must describe the condition and consequence.

Weak:

> Cash flow risk

Better:

> Cash may fall below the payroll requirement in September.

Mitigations must be measurable.

Weak:

> Monitor expenses.

Better:

> Delay ฿60,000 of planned inventory purchases or collect at least ฿90,000 in overdue receivables before 25 August.

## Simulation copy

The review step must summarize the decision in one sentence.

Example:

> You are testing a 20% price increase beginning in August, assuming sales volume falls by 8% and operating costs remain unchanged.

Result verdicts:

- Proceed
- Proceed cautiously
- Delay
- Avoid
- Insufficient evidence

Never use “success” or “failure” as the only verdict.

## Confidence copy

Weak:

> Medium confidence

Complete:

> Medium confidence. Revenue and expense data are current, but customer volume elasticity is estimated. Add three months of sales-volume data to improve confidence.

## AI Advisor response format

Use visible sections:

### Answer

Direct recommendation or explanation.

### Calculated evidence

Values produced by the financial engine.

### Interpretation

AI explanation of why the evidence matters.

### Missing information

Unknown inputs that could change the answer.

### Next actions

One to three actions linked to the application.

## Empty states

Empty states must explain value and resolution.

Weak:

> No simulations yet.

Better:

> You have not tested a business decision yet. Create a scenario to compare its effect on profit, cash runway, and risk before acting.

Primary action: `Test a decision`

## Errors

Errors should state:

- what failed
- whether data was saved
- what the user can do
- whether the calculation is still valid

Example:

> The simulation could not be completed because receivable data is missing. Your assumptions were saved. Add the missing balance or continue with a clearly marked estimate.

## Financial formatting

- Currency: `฿152,400`
- Negative currency: `−฿18,200`, not `฿-18,200`
- Percentage: `18.5%`
- Months: `4.2 months`
- Dates in English UI: `18 July 2026`
- Compact table dates may use `18 Jul 2026`
- Use tabular numerals
- Define whether values include VAT where relevant
- Do not use excessive decimal precision

## Thai-ready content

- Avoid fixed-height text containers
- Allow longer labels and line wrapping
- Do not concatenate translated strings from fragments
- Test currency and date formatting in Thai locale
- Keep financial terminology consistent in the glossary
- Use Noto Sans Thai and verify control height

## Calls to action

Use verbs tied to outcomes:

- Test a decision
- Review evidence
- Simulate mitigation
- Complete missing data
- Compare scenarios
- Generate report
- Update business data

Avoid vague CTAs:

- Continue
- Learn more
- Get insights
- Try AI

“Continue” is acceptable only inside a clearly labeled multistep flow.
