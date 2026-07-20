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
