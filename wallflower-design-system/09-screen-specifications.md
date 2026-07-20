# 09 — Screen Specifications

Each route specification defines the required hierarchy. Agents must not replace it with a generic card grid.

---

# `/` — Marketing landing page

## User question

What does Wallflower do, and why should I trust it with a business decision?

## Primary action

`Analyze my business`

## Secondary action

`See a sample simulation`

## Required hierarchy

1. Navigation
2. Hero with direct product promise and realistic product demonstration
3. One evolving SME decision example
4. Three-step workflow: understand → test → act
5. Core capabilities
6. Explainability and trust
7. Thai SME context
8. Final CTA
9. Footer

## Hero content

Eyebrow:

> Decision intelligence for Thai SMEs

Headline:

> See the impact before you make the move.

Body:

> Wallflower turns your business data into clear diagnostics, risk warnings, and decision simulations—so you can act with evidence instead of guesswork.

## Required product demonstration

Use a realistic example, such as hiring two employees or increasing price by 20%.

Show at least:

- baseline runway
- expected runway
- profit impact
- working capital requirement
- one risk
- one recommendation

The demonstration should evolve as the user scrolls or interacts.

## Forbidden patterns

- giant empty hero with only copy
- fabricated metrics or customer logos
- generic feature-card grid as the entire page
- abstract AI particles
- fake “99% accuracy” claims

## States

- standard
- reduced motion
- mobile simplified demonstration

---

# `/onboarding` — Business setup

## User question

What information does Wallflower need, and why?

## Primary action

Contextual next step; final step uses `Create business baseline`.

## Required hierarchy

1. Progress and autosave status
2. Current step title and purpose
3. Form group
4. Explanation of why data is requested
5. Data completeness preview
6. Back and next actions

## Steps

1. Business profile
2. Financial baseline
3. Review and confirm

## Required behavior

- two-column desktop layout
- THB units visible
- preserve values after errors
- autosave where practical
- source labels for imported or estimated values
- review summary in plain language

## Completion screen

Show:

- data completeness
- initial cash runway
- missing input count
- first detected risk when available
- primary action: `View business pulse`
- secondary action: `Complete missing data`

## Forbidden patterns

- narrow form floating in a mostly empty desktop page
- unexplained financial fields
- “success” checkmark as the entire completion experience
- goals represented by excessive decorative pills

---

# `/dashboard` — Business pulse

## User question

What needs my attention now?

## Primary action

The most relevant action, usually `Review risk` or `Test a decision`.

## Required hierarchy

1. Page title and data freshness
2. Business Pulse
3. Next recommended action
4. Four core KPI evidence items
5. Financial trend with annotations
6. Risk summary
7. Scenario CTA
8. Recent decisions and reminders

## Required components

- `DataFreshness`
- `BusinessPulse`
- `RecommendationPanel`
- four `MetricDelta` items
- `BusinessTrend`
- compact `RiskExposure` summary

## Core KPIs

Recommended default set:

- cash balance or net cash position
- cash runway
- operating margin
- monthly operating expense or working capital gap

The exact set may adapt to business data, but no more than four receive first-view emphasis.

## Acceptance criteria

- first viewport explains condition, change, and next action
- every KPI has comparison and status
- trend identifies forecast start and one important change
- page does not begin with four equal cards
- no generic greeting dominates the page

---

# `/business-health` — Health analysis

## User question

Why is the business healthy or unhealthy?

## Primary action

`Review contributing metrics` or a context-specific improvement action.

## Required sections

- Financial health
- Operational health
- Growth readiness
- Strengths and weaknesses
- Data completeness

## Required behavior

- every score exposes contributing metrics
- show calculation date and data source
- explain what would improve or reduce the score
- distinguish missing data from poor performance

## Forbidden patterns

- unexplained circular score gauge
- one overall percentage without evidence
- using red for missing data as though it were business failure

---

# `/risks` — Risk Center

## User question

Which risk should I act on first?

## Primary action

`Simulate mitigation` for the highest-priority actionable risk.

## Required hierarchy

1. Risk position statement
2. Estimated total exposure or consequence
3. Most urgent action
4. Compact filters
5. Act now
6. Monitor
7. Resolved

## Risk panel content

- severity and score
- risk statement
- category
- estimated exposure
- likelihood
- horizon
- evidence
- what changed
- mitigation
- owner and state

## Required integration

Where possible, risk mitigation launches the simulator with prefilled assumptions.

## Acceptance criteria

- critical risk evidence is visible without expansion
- filters do not dominate the screen
- risk counts are secondary to action and exposure
- each critical risk has a measurable mitigation

---

# `/simulations` — Simulation library

## User question

Which decisions have I tested, and what changed?

## Primary action

`Test a decision`

## Required hierarchy

1. Page title and explanation
2. Primary action
3. Recent or important simulations
4. Comparison controls
5. Saved drafts
6. Archived simulations

## Simulation item content

- decision name
- date
- verdict
- primary impact
- confidence
- status: draft, complete, outdated
- compare and open actions

## Empty state

Explain what a simulation does and provide one realistic sample decision.

---

# `/simulations/new` — Decision builder

## User question

What happens if I make this decision?

## Primary action

`Run simulation`

## Required stages

1. Choose decision
2. Enter assumptions
3. Review and run

## Desktop layout

- decision builder left
- live impact preview right

## Required behavior

- separate baseline values and user assumptions
- source badge on every important field
- live approximate impact where possible
- show missing data and confidence changes
- final review sentence summarizes the complete decision
- values remain editable before run

## Live preview

At minimum show:

- monthly profit delta
- cash runway delta
- break-even change
- risk level
- confidence

## Loading

Use `CalculationSequence`, not generic skeleton cards.

## Forbidden patterns

- generic centered multistep form
- hidden assumptions
- small ordinary final CTA
- treating estimated values as imported facts

---

# `/simulations/[id]` — Simulation result

## User question

Should I proceed, and under what conditions?

## Primary action

Contextual: `Save decision`, `Compare`, or `Test alternative`.

## Required hierarchy

1. `DecisionVerdict`
2. Primary financial consequence
3. `SensitivityBoundary`
4. `ScenarioComparison`
5. Runway or decision timeline
6. Detailed metric table
7. Assumptions and evidence
8. Confidence explanation
9. AI interpretation
10. Save, compare, report

## Required result content

- recommended posture
- expected outcome
- largest upside
- largest downside
- data confidence
- baseline versus expected
- best, expected, worst
- cash runway timeline when relevant
- assumptions and sensitivity

## Acceptance criteria

- recommendation is visible before KPI grid or chart
- identifies the condition where verdict changes
- confidence explains missing data
- chart shows decision and forecast dates
- AI explanation is visually secondary to calculations

---

# `/advisor` — Contextual AI Advisor

## User question

What does my current business data mean?

## Primary action

Submit a contextual question or launch a recommended action.

## Required starting state

Do not start with an empty generic chat. Show contextual prompts based on current business state.

Examples:

- Why did my runway fall this month?
- Which overdue invoice creates the most risk?
- Can I safely hire one employee in September?
- Which assumption most affects my price simulation?

## Answer structure

1. Answer
2. Calculated evidence
3. AI interpretation
4. Missing information
5. Next actions

## Required distinctions

- calculated fact
- source data
- user input
- assumption
- AI interpretation
- disclaimer

## Forbidden patterns

- “Ask me anything” as the main experience
- generic business advice disconnected from data
- citations hidden behind an icon
- AI answer with no evidence

---

# `/reports` — Report library

## User question

Which decision-ready summary should I review or share?

## Primary action

`Generate report`

## Required hierarchy

1. Page title
2. Report type and period controls
3. Report library using `ReportPreview`
4. Drafts and scheduled reports where supported
5. Help explaining report contents

## Report item content

- type
- reporting period
- generated date
- data-through date
- confidence
- key finding
- status
- preview, download, share, regenerate actions

## Forbidden patterns

- bare rows with only title and date
- browser-print output presented as a designed report
- report cards without period or freshness

---

# `/reports/[id]` — Report viewer

## User question

What is the complete decision narrative, and can I share it?

## Required editorial structure

1. Cover and metadata
2. Executive summary
3. Key metrics
4. Health and risk analysis
5. Simulation outcome
6. Recommendation
7. 90-day action plan
8. Assumptions and limitations

## Required behavior

- HTML preview uses editorial layout
- PDF export preserves hierarchy
- dashboard navigation is not printed
- charts include labels and table alternatives
- report shows data-through date and confidence

---

# `/settings`

## User question

How is my data, business profile, and product experience configured?

## Required sections

- Business profile
- Data sources and integrations
- Team and permissions
- Notification preferences
- Language and region
- Theme
- Privacy and data controls

Settings should use structured sections and forms, not a wall of unrelated cards.
