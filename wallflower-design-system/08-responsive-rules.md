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
