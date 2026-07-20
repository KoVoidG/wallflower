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
