<!-- BEGIN README.md -->

# Wallflower Design System

**Version:** 2.0  
**Purpose:** Agent-enforceable UI/UX and frontend implementation specification  
**Applies to:** Marketing, authentication, onboarding, dashboard, business health, risks, simulations, AI Advisor, reports, settings, responsive layouts, light mode, dark mode, English, and Thai-ready UI

## Why this folder exists

Wallflower must not be implemented as a collection of generic SaaS cards. It is a financial decision-intelligence product for SME owners. Every important screen must help the user understand the business, test a decision, see consequences, and choose a next action.

The files in this folder separate principles from enforceable implementation contracts so that design and coding agents do not improvise new visual systems or fall back to default shadcn patterns.

## Reading order for agents

Before changing any user-facing UI, read:

1. [`00-design-principles.md`](./00-design-principles.md)
2. [`01-design-tokens.md`](./01-design-tokens.md)
3. [`02-layout-system.md`](./02-layout-system.md)
4. [`03-component-contracts.md`](./03-component-contracts.md)
5. The relevant route in [`09-screen-specifications.md`](./09-screen-specifications.md)
6. [`10-state-design.md`](./10-state-design.md)
7. [`12-agent-rules.md`](./12-agent-rules.md)

Read the remaining files whenever the task touches charts, motion, content, accessibility, or responsive behavior.

## Authority order

When instructions conflict, use this order:

1. Route-specific requirements in `09-screen-specifications.md`
2. Component contracts in `03-component-contracts.md`
3. Design tokens in `01-design-tokens.md`
4. Layout and responsive rules
5. General design principles

An agent must explain a deviation before implementing it. Silent deviations are not permitted.

## Core product loop

```text
Business baseline
    ↓
Detected health and risks
    ↓
Decision and assumptions
    ↓
Best / expected / worst scenarios
    ↓
Sensitivity and confidence
    ↓
Recommendation and next action
```

## Definition of complete

A page is complete only when it:

- has one obvious primary user question and primary action
- follows the route hierarchy in `09-screen-specifications.md`
- uses product-specific components rather than generic cards everywhere
- includes loading, empty, error, partial-data, and success states where applicable
- works in light mode, dark mode, mobile, tablet, and desktop
- passes accessibility requirements
- scores at least **18/22** in `11-design-qa.md`
- has no rejection condition from `12-agent-rules.md`

## Migration from the original file

The original `design.md` is preserved at `_archive/design-v1.md`. This folder replaces that single file as the active source of truth. Do not instruct agents to obey both versions simultaneously.

<!-- END README.md -->

<!-- BEGIN 00-design-principles.md -->

# 00 — Design Principles

## Product definition

Wallflower is a decision-intelligence platform for cash-sensitive SMEs. It turns business data into understandable diagnostics, risk warnings, scenario simulations, and evidence-based next actions.

Wallflower is not:

- a generic analytics dashboard
- an accounting ledger
- a chatbot wrapped around a database
- an AI prediction machine claiming certainty
- a decorative startup landing page
- a collection of unrelated productivity tools

## Product promise

> Understand the business. Test the decision. See what changes.

Recommended product line:

> Better decisions before they cost your business.

## Target user

The primary user is an SME owner or operator who:

- understands their business but may not be a finance expert
- has limited time and staff
- worries about cash flow and the consequences of decisions
- needs explanations in plain language
- may have incomplete, delayed, or manually entered data
- expects trustworthy calculations, not AI theatre

The interface must reduce cognitive load without hiding evidence or uncertainty.

## Desired personality

Wallflower should feel:

- calm under pressure
- financially trustworthy
- clear and specific
- modern without looking futuristic
- supportive without sounding childish
- data-rich without visual clutter
- editorial rather than template-driven
- distinctive without relying on visual gimmicks

## Signature experience

The simulator is the defining Wallflower experience.

Every major design decision should reinforce the feeling that the user is changing one business decision and observing its financial consequences.

The simulator must visually connect:

```text
Baseline → Decision → Assumptions → Scenarios → Risk → Recommendation
```

It must not resemble a generic multistep form followed by a generic dashboard.

## Memorable product behavior

Wallflower should be remembered for making consequences visible.

Examples:

- changing hiring assumptions immediately previews runway and profit impact
- a detected risk links directly to a mitigation simulation
- a scenario result identifies the exact assumption where the verdict changes
- an AI explanation references calculated evidence and data sources
- reports preserve the same decision narrative instead of printing dashboard cards

## Visual quality bar

A page is not complete merely because it is clean, responsive, and uses correct tokens.

It must also:

- have a clearly dominant information priority
- include at least one product-specific component or interaction
- avoid looking like a default shadcn dashboard
- visually communicate the business meaning of the data
- guide the user toward one clear next action
- show context for important numbers
- expose confidence, assumptions, and data freshness

## Hierarchy principles

### One question per screen

Every route must have a primary user question.

Examples:

- Dashboard: “What needs my attention now?”
- Business Health: “Why is the business healthy or unhealthy?”
- Risk Center: “Which risk should I act on first?”
- Simulator: “What happens if I make this decision?”
- Results: “Should I proceed, and under what conditions?”
- Advisor: “What does my current data mean?”
- Reports: “What decision-ready summary should I share?”

### One primary action per panel

A panel may contain secondary actions, but only one action may receive primary visual emphasis.

### Meaning before decoration

Use contrast, layout, type, and data relationships before adding shadows, gradients, illustrations, or animation.

### Progressive disclosure

Show the verdict and key consequence first. Reveal evidence, assumptions, and details second. Never hide essential risk or uncertainty behind hover-only interactions.

## Trust principles

Every key output must make clear:

- what is calculated
- what came from user or imported data
- what is an assumption
- what is AI interpretation
- how fresh the data is
- how confident the result is
- what information is missing
- what could change the conclusion

AI commentary must never appear more authoritative than deterministic calculations.

## Botanical brand cues

The Wallflower name may be expressed through a geometric flower constructed from overlapping rounded petals or data points converging into one decision.

Use botanical cues only for:

- logo and brand mark
- loading and calculation sequence
- data completeness visualization
- subtle empty-state graphics
- marketing transitions

Do not add leaf decorations, floral illustrations, vines, or organic patterns throughout the application.

## Avoid

- purple-first AI gradients
- glassmorphism as a default surface
- glowing borders
- rainbow KPI cards
- excessive card shadows
- giant empty hero sections with generic slogans
- excessive rounded corners
- excessive pills
- cartoon-heavy product illustrations
- animated financial values that keep moving
- celebratory animation for serious financial outcomes
- generic “AI magic” language
- fabricated customer logos or metrics
- charts that exist only to fill space
- hidden units or comparison periods
- color-only status communication

## Decision-first language

Prefer:

> Cash runway may fall from 8.2 to 4.7 months after this hire.

> Consider delaying the hire, reducing initial headcount, or securing at least ฿180,000 in additional working capital.

Avoid:

> Amazing! Your AI-powered insight is ready.

> This decision will definitely grow your business.

<!-- END 00-design-principles.md -->

<!-- BEGIN 01-design-tokens.md -->

# 01 — Design Tokens

## Token governance

- Page components must use semantic tokens, not raw hex values.
- New colors, spacing steps, radii, shadows, or typography sizes require explicit design-system approval.
- Raw color values may appear only in global theme definitions, chart configuration, and exported report styles.
- Dark mode requires independent semantic tokens; do not invert light colors automatically.

## Color system — light

| Token | Value | Usage |
|---|---:|---|
| `--background` | `#F7FAF9` | Main application background |
| `--surface` | `#FFFFFF` | Primary panels, dialogs, tables |
| `--surface-subtle` | `#F0F6F4` | Filters, grouped controls, secondary regions |
| `--surface-raised` | `#FFFFFF` | Popovers and sticky surfaces |
| `--border` | `#DCE7E3` | Default divider and border |
| `--border-strong` | `#B8CCC5` | Selected, focused, or emphasized border |
| `--text-primary` | `#10201D` | Headings and essential values |
| `--text-secondary` | `#4B625C` | Supporting copy |
| `--text-muted` | `#71857F` | Metadata and placeholders |
| `--brand` | `#0F766E` | Primary action and active navigation |
| `--brand-hover` | `#0B625B` | Primary hover |
| `--brand-soft` | `#DDF3EF` | Selection and highlighted region |
| `--brand-strong` | `#074E49` | Brand details and high-emphasis text |
| `--info` | `#2563EB` | Neutral information and comparison |
| `--info-soft` | `#E8F0FF` | Informational region |
| `--success` | `#15803D` | Confirmed positive outcome |
| `--success-soft` | `#E7F6EC` | Positive background |
| `--warning` | `#D97706` | Caution and medium risk |
| `--warning-soft` | `#FFF3DD` | Warning background |
| `--danger` | `#DC2626` | Critical risk and destructive action |
| `--danger-soft` | `#FDECEC` | Critical background |
| `--ai` | `#0891B2` | AI interpretation only |
| `--ai-soft` | `#E5F7FB` | AI interpretation background |

## Color system — dark

| Token | Value | Usage |
|---|---:|---|
| `--background` | `#07110F` | Main background |
| `--surface` | `#0D1916` | Primary panels |
| `--surface-subtle` | `#11221E` | Grouped controls and secondary regions |
| `--surface-raised` | `#152924` | Dialogs and popovers |
| `--border` | `#223A34` | Default border |
| `--border-strong` | `#36554D` | Focus and emphasis |
| `--text-primary` | `#F2F8F6` | Headings and values |
| `--text-secondary` | `#B6C8C3` | Supporting copy |
| `--text-muted` | `#829891` | Metadata |
| `--brand` | `#2DD4BF` | Primary action |
| `--brand-hover` | `#5EEAD4` | Primary hover |
| `--brand-soft` | `#123A34` | Selection background |
| `--info` | `#60A5FA` | Information |
| `--success` | `#4ADE80` | Positive outcome |
| `--warning` | `#FBBF24` | Caution |
| `--danger` | `#F87171` | Critical outcome |
| `--ai` | `#22D3EE` | AI interpretation |

## Semantic color roles

- **Teal:** Wallflower brand, primary action, selected state
- **Cyan:** AI-generated explanation or recommendation
- **Blue:** neutral information, growth, comparison, cash flow
- **Green:** confirmed positive result
- **Amber:** caution and medium risk
- **Red/coral:** critical risk, failure, destructive action, worst case
- **Slate and green-black:** neutral product structure

Color must not be the only carrier of meaning. Pair it with text, icons, numerical severity, line styles, or patterns.

## Chart palette

Ordered series:

1. Teal `#0F766E`
2. Blue `#2563EB`
3. Green `#16A34A`
4. Amber `#D97706`
5. Coral `#E85D5D`
6. Slate `#64748B`

Semantic defaults:

| Meaning | Treatment |
|---|---|
| Revenue | Teal |
| Expenses | Amber or coral |
| Profit | Green |
| Cash flow | Blue |
| Baseline | Slate dashed line |
| Expected scenario | Teal solid line |
| Best case | Green solid line |
| Worst case | Coral solid line |
| Forecast region | Subtle tinted plot background |
| Confidence range | Low-opacity fill with visible boundary |

## Typography

Primary:

```css
font-family: "Geist", "Noto Sans Thai", ui-sans-serif, system-ui, sans-serif;
```

Monospace:

```css
font-family: "Geist Mono", ui-monospace, monospace;
```

Use monospace only for IDs, technical metadata, calculation versions, and structured previews. Never use monospace for ordinary financial values.

| Token | Size / line-height | Weight | Usage |
|---|---|---:|---|
| Display | `64/68`, tablet `44/48`, mobile `38/42` | 650–700 | Landing hero |
| H1 | `36/44` | 650 | Page heading |
| H2 | `28/36` | 650 | Major section |
| H3 | `20/28` | 600 | Panel group |
| Body large | `18/30` | 400 | Marketing body |
| Body | `15/24` | 400 | Application body |
| Body small | `13/20` | 400 | Supporting text |
| Label | `13/18` | 550 | Form and data labels |
| Caption | `12/18` | 450 | Metadata |
| KPI large | `34/40` | 650 | Primary metric |
| Table number | `14/20` | 550 | Financial table values |

Required for financial values:

```css
font-variant-numeric: tabular-nums;
```

Do not use muted color for essential values, form labels, warnings, or primary explanation.

## Spacing

Use a 4px base grid.

| Token | Value |
|---|---:|
| `1` | 4px |
| `2` | 8px |
| `3` | 12px |
| `4` | 16px |
| `5` | 20px |
| `6` | 24px |
| `8` | 32px |
| `10` | 40px |
| `12` | 48px |
| `16` | 64px |
| `20` | 80px |
| `24` | 96px |

Use 24–32px internal padding for major analytical regions. Use 16–20px for compact components. Do not create oversized empty sections to simulate premium spacing.

## Radius

| Token | Value | Usage |
|---|---:|---|
| `--radius-sm` | 6px | Inputs and compact controls |
| `--radius-md` | 10px | Buttons and standard panels |
| `--radius-lg` | 14px | Dialogs and major regions |
| `--radius-xl` | 20px | Marketing artwork only |
| `--radius-full` | 999px | Avatar and compact metadata only |

Do not use 20–24px radius on standard dashboard cards.

## Borders

- Default: 1px semantic border
- Emphasized: strong border or subtle inset ring
- Tables: row dividers, not individually boxed rows
- Active navigation: brand indicator plus surface change
- Critical risk: severity edge or header; do not fill the entire panel red

## Elevation

Light mode:

```css
--shadow-sm: 0 1px 2px rgb(16 32 29 / 0.05);
--shadow-md: 0 10px 30px rgb(16 32 29 / 0.08);
```

Most application surfaces use no shadow. Use `shadow-md` only for floating dialogs, menus, and raised previews. Dark mode relies on border and layered surface contrast.

## Control sizing

| Control | Height |
|---|---:|
| Compact button | 32px |
| Default button | 40px |
| Large button | 48px |
| Default input | 40–44px |
| Mobile touch target | Minimum 44×44px |
| Top bar | 64px |

## Icons

- Compact metadata: 14–16px
- Standard controls: 16–18px
- Navigation: 18–20px
- Empty-state illustration marks: 32–56px
- Use Lucide icons consistently.
- Do not mix filled and outlined icon families without a defined semantic reason.

## Suggested Tailwind mappings

| Semantic role | Utility or token pattern |
|---|---|
| Page background | `bg-background` |
| Primary surface | `bg-card` or `bg-surface` |
| Secondary region | `bg-muted/40` or semantic subtle surface |
| Primary text | `text-foreground` |
| Supporting text | `text-muted-foreground` |
| Default divider | `border-border` |
| Primary action | `bg-primary text-primary-foreground` |
| Focus | `focus-visible:ring-2 focus-visible:ring-ring` |

The project may map tokens differently, but semantic names must remain stable.

<!-- END 01-design-tokens.md -->

<!-- BEGIN 02-layout-system.md -->

# 02 — Layout System

## Layout philosophy

Wallflower should feel structured and purposefully dense, not empty and not crowded. Large blank areas are acceptable only when they improve focus. A narrow generic form centered in a wide desktop canvas is usually a layout failure.

Use the viewport to show relationships between baseline, input, consequence, and action.

## Application shell

| Region | Desktop | Tablet | Mobile |
|---|---:|---:|---:|
| Expanded sidebar | 248px | Collapsible | Hidden |
| Collapsed sidebar | 72px | 72px | N/A |
| Top bar | 64px | 64px | 56–64px |
| Context rail | 320px | Drawer | Full-screen drawer |
| Main max width | 1440px | Fluid | Fluid |
| Page padding | 32px | 24px | 16px |

The contextual rail is optional. Use it only when it helps the current task, such as simulation assumptions, evidence, or AI explanation.

## Grid

Desktop application pages use a 12-column grid with 24px gaps.

Recommended spans:

- Dominant analytical region: 8 columns
- Context or next-action region: 4 columns
- Two equal panels: 6 + 6
- KPI strip: 3 + 3 + 3 + 3
- Main form and live preview: 7 + 5 or 6 + 6

Tablet uses a 6-column grid. Mobile uses one column.

## Page header

Every application route must begin with a page header containing:

- page title
- one-sentence purpose or current state
- data-through date when the page uses business data
- primary action where applicable
- no more than two secondary utility actions

The page header should not consume more than approximately 160px of vertical space on desktop unless it includes a critical decision summary.

## Section rhythm

Recommended vertical spacing:

- Page header to first region: 24–32px
- Major region to major region: 32–48px
- Section heading to content: 16–24px
- Related rows: 8–16px

Do not create repeated sequences of centered heading → subtitle → three cards on application routes.

## Surface strategy

Not every section should be a bordered card.

Use:

- **Unboxed region:** primary page narrative, large chart, report content
- **Subtle grouped surface:** filters, assumption groups, secondary analysis
- **Bordered panel:** self-contained decision or data module
- **Raised surface:** dialog, popover, sticky action panel
- **Divider list/table:** repeated records

Avoid nested cards.

## Dashboard layout

Desktop:

```text
┌─────────────────────────────────────────────┐
│ Page header + data freshness                │
├──────────────────────────────┬──────────────┤
│ Business Pulse (8 cols)      │ Next action  │
│                              │ (4 cols)     │
├─────────────────────────────────────────────┤
│ KPI evidence strip (12 cols)                │
├──────────────────────────────┬──────────────┤
│ Financial trend (8 cols)     │ Risk summary │
│                              │ (4 cols)     │
├──────────────────────────────┴──────────────┤
│ Recent decisions / reminders                │
└─────────────────────────────────────────────┘
```

The first viewport must answer:

1. Is the business stable?
2. What changed?
3. What should the user do next?

## Simulator layout

Desktop uses a split workspace:

```text
┌──────────────────────────┬──────────────────┐
│ Decision builder         │ Live impact      │
│ - decision type          │ - profit delta   │
│ - assumptions            │ - runway delta   │
│ - timing                 │ - break-even     │
│ - review                 │ - risk preview   │
│                          │ - data confidence│
└──────────────────────────┴──────────────────┘
```

The live impact panel may become sticky after the user begins entering assumptions. It must not obscure the final review or primary action.

## Simulation result layout

Desktop order:

1. Decision verdict — full width
2. Primary consequence and sensitivity boundary — 7 + 5
3. Scenario comparison — full width
4. Timeline / runway visualization — full width or 8 + 4 with context
5. Detailed metric table
6. Assumptions and evidence
7. AI interpretation
8. Save, compare, export

Do not lead with four equal KPI cards.

## Risk Center layout

Desktop:

- Risk position summary: 8 columns
- Exposure and urgent action: 4 columns
- Filters: compact horizontal bar or collapsible region
- Risk groups: full-width sections for Act now, Monitor, Resolved

Filters must not occupy more visual priority than the risks.

## Business Health layout

Use section navigation or tabs for:

- Financial health
- Operational health
- Growth readiness
- Strengths and weaknesses
- Data completeness

Each health score must show its contributing metrics and calculation date.

## AI Advisor layout

Preferred structure:

- contextual prompt area
- active answer thread
- evidence and sources region
- related actions

Desktop may use an 8 + 4 split: answer on the left, evidence on the right. Mobile stacks evidence immediately after the claim it supports.

## Reports layout

The report library uses a list or grid of previewable report objects, not bare table rows.

The report viewer uses an editorial reading width of approximately 760–900px inside the application shell, with metadata and export controls outside the report page.

## Onboarding layout

Desktop uses two columns:

- Form: 7 columns
- Explanation and progress: 5 columns

The right column explains why data is requested, shows progress, autosave status, and data completeness. On mobile, progress appears before the form; explanations appear inline.

## Marketing container

- Maximum width: 1280px
- Horizontal padding: 24–32px desktop, 16px mobile
- Hero minimum height: approximately 680–760px desktop only when a real product demonstration occupies the space
- Alternate section alignment and composition; do not repeat identical card grids throughout

## Sticky behavior

Allowed:

- simulator impact preview
- report export controls
- long table headers
- mobile primary simulator action
- contextual risk action rail

Forbidden:

- multiple competing sticky panels
- sticky elements that hide page content
- permanent AI rail on every route

## Density guidance

Use compact layouts for:

- filters
- metadata
- tabular financial records
- evidence rows
- report library controls

Use spacious layouts for:

- decision verdict
- critical risk summary
- marketing hero
- onboarding explanation

Premium does not mean empty. Every large region must contain meaningful information or interaction.

<!-- END 02-layout-system.md -->

<!-- BEGIN 03-component-contracts.md -->

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

<!-- END 03-component-contracts.md -->

<!-- BEGIN 04-data-visualization.md -->

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

<!-- END 04-data-visualization.md -->

<!-- BEGIN 05-motion-system.md -->

# 05 — Motion System

## Purpose

Motion should explain hierarchy and state change. It must not decorate serious financial content.

Use Motion for React where motion materially improves understanding.

## Motion principles

Motion should:

- connect simulator input to resulting impact
- show calculation stages
- establish route and panel hierarchy
- reduce perceived loading time
- make the marketing product demonstration memorable
- clarify expanded and collapsed evidence

Motion should not:

- delay task completion
- animate every hover target
- bounce warnings
- continuously move financial values
- imply certainty or success
- cause motion sickness

## Timing

| Interaction | Duration |
|---|---:|
| Hover and press | 120–160ms |
| Tooltip or popover | 140–180ms |
| Card or panel transition | 180–240ms |
| Drawer or dialog | 220–300ms |
| Page content reveal | 280–420ms |
| Simulation result sequence | 400–650ms |

Preferred easing:

```ts
[0.22, 1, 0.36, 1]
```

Restrained spring:

```ts
{
  stiffness: 260,
  damping: 28,
  mass: 0.8
}
```

## Route transitions

- preserve application shell
- fade and translate page content by no more than 8–12px
- do not animate sidebar width on every navigation
- active indicator may move between routes
- focus must move to the new page heading after navigation when appropriate

## Simulator input feedback

When a user changes an assumption:

1. highlight the changed field briefly
2. update the affected metric in the live preview
3. show the delta from the previous value
4. update confidence when data quality changes
5. avoid animating unrelated metrics

Recommended transition: 180–240ms cross-fade or number replacement. Do not count through every intermediate value.

## Simulation run sequence

Required sequence:

1. Lock editable assumptions.
2. Summarize the decision in plain language.
3. Show calculation stages:
   - Reading baseline
   - Applying assumptions
   - Calculating scenarios
   - Testing sensitivity
   - Preparing recommendation
4. Transition to results.
5. Reveal verdict first.
6. Reveal primary consequence and sensitivity second.
7. Reveal scenario and detailed analysis last.

Do not show fake percentages unless the backend exposes meaningful progress.

## Result transitions

When switching scenarios:

- cross-fade lines or bars
- preserve axes and scale
- update labels and values together
- keep baseline stable
- duration 180–300ms

When comparing saved simulations, animate only changed rows or marks.

## Expand and collapse

Risk evidence and assumption detail may expand using height and opacity.

- duration: 180–240ms
- keep trigger in place
- preserve focus
- do not collapse critical summary information

## Landing motion

Allowed:

- Wallflower mark forming from data points
- headline reveal by line, not letter
- product preview responding subtly to scroll or pointer
- workflow demonstrating diagnosis → simulation → action
- scenario lines changing after a visible assumption changes

Forbidden:

- continuous background particles
- endless floating cards
- parallax that harms reading
- dramatic 3D effects unrelated to the product

## Loading states

Use skeletons only when content shape is known and waiting is brief.

For analytical operations, prefer meaningful progress labels. A simulation loader should look different from a report loader.

## Error motion

- do not shake entire forms
- move focus to the error summary
- use subtle local emphasis on the affected field
- serious failures should appear immediately, not after an animation delay

## Reduced motion

When `prefers-reduced-motion: reduce` is active:

- replace movement with instant state changes or short fades
- disable pointer parallax
- disable count-up effects
- preserve progress text
- preserve focus transitions
- do not remove meaningful state feedback

## Framer Motion implementation guardrails

- use shared variants for repeated transition types
- avoid per-component arbitrary easing and timing
- do not animate layout for large data tables
- do not use spring animation for financial values
- stop animation after first reveal
- test route changes with keyboard and screen readers

## Motion QA

Every animation must answer one of these:

- What changed?
- Where did this content come from?
- What is happening now?
- What should the user notice first?

Remove any animation that cannot answer one.

<!-- END 05-motion-system.md -->

<!-- BEGIN 06-content-guidelines.md -->

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

<!-- END 06-content-guidelines.md -->

<!-- BEGIN 07-accessibility.md -->

# 07 — Accessibility

## Standard

Wallflower must meet WCAG 2.2 AA at minimum.

Accessibility is part of definition of complete, not a later polish phase.

## Keyboard

All interactive functionality must be keyboard-operable, including:

- navigation
- menus
- dialogs
- tabs
- filters
- accordions
- chart controls
- simulator steps
- scenario switching
- report preview and export

Requirements:

- visible focus ring
- logical tab order
- no keyboard traps
- Escape closes dismissible overlays
- focus returns to trigger after closing
- focus moves to error summary after failed submission
- focus moves to result heading after simulation completion when appropriate

Do not add positive `tabindex` values.

## Focus appearance

Focus must remain visible in light and dark modes. Do not remove native outlines unless replaced with an equally visible custom focus indicator.

## Structure

- one `h1` per page
- headings follow logical order
- landmarks: header, nav, main, aside, footer
- skip-to-content link
- lists and tables use semantic elements
- buttons perform actions; links navigate

## Forms

- labels always remain visible
- instructions are associated with controls
- required state is announced
- error text is connected with `aria-describedby`
- invalid fields use `aria-invalid`
- an error summary links to affected fields
- entered values remain after validation errors
- currency and units are announced clearly
- estimated defaults are labeled

## Status and alerts

Do not communicate status by color alone.

Use at least two signals:

- icon + label
- label + severity score
- pattern + label
- line style + direct label

Use live regions for:

- simulation completion
- simulation failure
- autosave status
- dynamically updated result summary
- connection status changes

Do not announce every keystroke-driven metric change; announce a concise summary after a controlled update or debounce.

## Charts

Every important chart needs:

- accessible name
- text summary
- units and date range
- data table alternative
- keyboard-operable controls when interactive
- no essential hover-only information
- non-color distinction between scenario lines

Canvas-only charts require a parallel accessible representation.

## Dialogs and drawers

- use semantic dialog behavior
- trap focus while open
- label dialog title and description
- close button has accessible name
- background content is inert
- destructive confirmation names the object and consequence

## Motion

Respect `prefers-reduced-motion`.

- disable parallax and decorative movement
- replace movement with short fades or instant changes
- preserve progress and state communication
- no flashing content

## Touch

- minimum 44×44px touch target
- enough space between destructive and safe actions
- no hover-only controls
- mobile sticky actions must not cover form fields or system controls

## Contrast

- body text and controls meet AA
- muted text cannot carry essential information
- chart labels and grid lines remain readable
- status soft backgrounds maintain readable foreground contrast
- focus rings contrast with both surface and adjacent controls

Test dark mode separately.

## Tables

- use `th` for headers
- include scope where needed
- caption or accessible name explains table purpose
- numeric alignment remains visual only; reading order is logical
- horizontal scrolling keeps headers available
- frozen columns must not duplicate screen-reader content

## Thai support

- use Noto Sans Thai fallback
- test line height and clipping
- avoid fixed button height when Thai labels wrap
- verify screen-reader pronunciation where possible
- do not place meaning in Latin abbreviations alone

## Testing checklist

Required before release:

- keyboard-only route walkthrough
- screen-reader smoke test
- 200% zoom
- 320px viewport
- reduced-motion mode
- light and dark contrast scan
- error-state walkthrough
- Thai sample content
- chart data-table access

<!-- END 07-accessibility.md -->

<!-- BEGIN 08-responsive-rules.md -->

# 08 — Responsive Rules

## Breakpoint intent

Responsive behavior is defined by available space and task priority, not by shrinking the desktop design.

Suggested breakpoints may follow the project’s Tailwind configuration, but behavior must match this file.

## Global rules

### Desktop

- persistent sidebar
- optional contextual rail
- 12-column content grid
- side-by-side comparison where useful
- sticky analytical context allowed

### Tablet

- collapsible sidebar
- 6-column grid
- two-column KPI layout
- contextual rail becomes drawer or lower section
- charts stack when labels would become cramped

### Mobile

- one-column content
- bottom navigation for Dashboard, Risks, Simulate, Reports, More
- full-screen drawers
- sticky primary action only for active task flows
- horizontal table scrolling when necessary
- no desktop sidebar miniaturized into a thin strip

## Content priority

Mobile order must follow user decision priority, not desktop DOM convenience.

For every route, preserve:

1. conclusion or current state
2. primary action
3. most important evidence
4. secondary detail
5. utilities and metadata

## Dashboard

Desktop:

- Business Pulse and Next Action side by side
- four KPI evidence items in one row
- trend and risk summary side by side

Tablet:

- Business Pulse full width
- Next Action full width or 2-column with critical metric
- KPIs in two columns
- trend full width

Mobile:

- Business Pulse
- primary next action
- top two KPIs
- remaining KPIs
- risk summary
- trend
- recent decisions

Do not hide the data-through date.

## Simulator

Desktop:

- builder and live preview side by side
- live preview may be sticky

Tablet:

- form above
- compact live preview below each assumption group or as a collapsible summary

Mobile:

- one assumption group at a time
- persistent compact impact summary
- full live preview accessible through a drawer
- sticky `Review decision` or `Run simulation` action
- no side-by-side input columns that reduce readability

## Scenario comparison

Desktop:

- expected, best, and worst side by side with baseline reference

Tablet:

- expected full width
- best and worst below in two columns

Mobile:

- expected expanded first
- best and worst collapsed or selectable
- visible comparison table remains available
- no horizontal scroll for primary verdict

## Risk Center

Desktop:

- compact filter bar
- grouped risk panels

Mobile:

- filter button opens full-screen drawer
- active filter summary appears as text
- critical risk shows exposure and action before metadata
- secondary evidence may collapse

## Business Health

Desktop uses tabs or side navigation. Mobile uses horizontally scrollable tabs only when labels remain legible; otherwise use a native select or compact section menu.

Scores must keep contributing metrics accessible.

## Advisor

Desktop may use answer + evidence columns. Mobile interleaves evidence directly after the statement it supports.

The prompt composer stays above the keyboard and does not obscure the latest response.

## Reports

Desktop report library may use two-column previews. Mobile uses one-column report cards.

Report viewer:

- fit content to viewport
- move export controls to an action menu or sticky bottom region
- do not scale desktop PDF pages down until text is unreadable
- allow document sections to reflow in HTML preview

## Tables

Before enabling horizontal scroll:

1. remove low-priority columns
2. convert metadata into secondary row text
3. shorten labels
4. preserve primary identifier and essential financial values

When scrolling is still required:

- keep a visible affordance
- freeze first column where practical
- do not place page-level horizontal scrolling on the body

## Forms

- stack label, control, helper, and error text
- avoid two-column form fields below tablet width unless fields are naturally paired
- buttons may become full width on mobile
- do not place two equally styled primary actions side by side
- preserve entered values across step changes

## Typography

Use the defined responsive display scale. Application H1 may reduce from 36px to approximately 28–32px on mobile if necessary. Do not shrink body text below 15px merely to fit content.

## Touch and safe areas

- minimum 44×44px targets
- sticky bottom actions include safe-area padding
- bottom navigation and sticky simulator action must not overlap
- drawers support content heights smaller than the viewport

## Responsive QA widths

At minimum test:

- 320px
- 375px
- 430px
- 768px
- 1024px
- 1280px
- 1440px

Also test 200% browser zoom.

<!-- END 08-responsive-rules.md -->

<!-- BEGIN 09-screen-specifications.md -->

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

<!-- END 09-screen-specifications.md -->

<!-- BEGIN 10-state-design.md -->

# 10 — State Design

Every data-driven feature must define states before implementation. Do not design only the ideal populated screen.

## State anatomy

Each state should specify:

- title
- explanation
- impact on current analysis
- primary action
- secondary action when useful
- visual treatment
- accessibility announcement where needed

## Loading states

### Page loading

Use skeletons only for stable content structure. Preserve page header and navigation.

### Simulation loading

Use `CalculationSequence`:

1. Reading baseline
2. Applying assumptions
3. Calculating scenarios
4. Testing sensitivity
5. Preparing recommendation

Announce completion or failure.

### Report generation

Explain which sections are being prepared. Do not imply a report is complete before export succeeds.

## Empty business data

Title:

> Add business data to create your baseline

Explanation:

> Wallflower needs revenue, operating expenses, and available cash before it can calculate runway or test decisions.

Primary action: `Add business data`

Optional secondary action: `Use sample business`

## Partial business data

Show:

- what can be calculated
- what cannot be calculated
- confidence impact
- missing fields

Example:

> Runway can be estimated, but working-capital risk is incomplete because receivables and payables are missing.

Primary action: `Complete missing data`

## Stale data

Show a visible freshness warning near outputs.

Example:

> Results use data through 30 May 2026. Revenue and expense data may no longer represent the current business.

Actions:

- `Update data`
- `Continue with stale data` when safe, with visible disclaimer

## Mixed data freshness

Identify which source is stale. Do not label the entire dataset current because one source updated.

## No risks detected

Avoid implying guaranteed safety.

Title:

> No material risks detected in the available data

Explanation:

> Current checks did not identify a risk above the alert threshold. Continue monitoring data freshness and upcoming obligations.

Primary action: `Review health details`

## No simulations

Title:

> Test a decision before acting

Explanation:

> Compare expected, best, and worst outcomes for hiring, pricing, inventory, financing, or another business change.

Primary action: `Test a decision`

Provide one realistic sample.

## Simulation draft

Show incomplete stage, last saved time, missing assumptions, and `Continue setup`.

## Simulation failure

State:

- what prevented calculation
- whether assumptions were saved
- whether partial results exist
- exact recovery action

Example:

> The simulation could not calculate cash runway because monthly expense data is missing. Your decision assumptions were saved.

Actions:

- `Add expense data`
- `Use an estimate`

## Low-confidence result

Keep the result visible but label limitations prominently.

Show:

- missing or estimated inputs
- which conclusion may change
- action to improve confidence

Do not hide the result behind a generic warning modal.

## No reports

Explain report value and available types. Primary action: `Generate first report`.

## Outdated report

Show:

- original data-through date
- newer data availability
- whether report conclusions may have changed
- `Regenerate report`

## AI unavailable

The financial engine and historical calculated evidence should remain accessible.

Title:

> AI explanation is temporarily unavailable

Explanation:

> Calculated results remain available. Wallflower could not generate the plain-language interpretation.

Action: `Try explanation again`

Do not block the entire result page.

## Integration disconnected

Show:

- affected source
- last successful sync
- affected calculations
- reconnect action

## Permission denied

Explain required role and safe next action. Do not reveal hidden business data.

## Error states

### Inline field error

- appears near field
- specific correction
- preserve value

### Section error

- keep unaffected sections available
- show retry action

### Page error

- preserve shell
- explain whether data is safe
- provide retry and navigation action

## Success states

Success messages should confirm what changed and where to go next.

Weak:

> Success!

Better:

> Business data updated through 18 July 2026. Runway and risk calculations have been refreshed.

## Destructive confirmation

Name the object and consequence.

Example:

> Delete “Hire two sales staff” simulation? This removes the saved assumptions and result comparison. It will not change business data.

Use red only on the final destructive action.

## Offline or network interruption

When supported:

- preserve local form values
- show save status
- disable actions requiring server calculation
- retry automatically only when safe
- never claim a simulation was saved without confirmation

<!-- END 10-state-design.md -->

<!-- BEGIN 11-design-qa.md -->

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

<!-- END 11-design-qa.md -->

<!-- BEGIN 12-agent-rules.md -->

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

<!-- END 12-agent-rules.md -->
