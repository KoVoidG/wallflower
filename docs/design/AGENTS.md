# Wallflower Frontend Agent

## Purpose

Implement a premium enterprise-grade frontend for Wallflower.

Wallflower is an AI-powered decision intelligence platform for Thai retail SMEs.

The interface should communicate trust, clarity and confidence.

It is NOT:

- a crypto dashboard
- accounting software
- a fintech trading terminal

It IS:

- an executive workspace
- a business planning tool
- a decision-support platform

---

## Stack

Next.js

TypeScript

Tailwind CSS

shadcn/ui

Radix UI

React Hook Form

Zod

Framer Motion (subtle only)

Recharts

Lucide Icons

---

## Priorities

1. Information hierarchy
2. Readability
3. Simplicity
4. Consistency
5. Accessibility
6. Responsive design

Never sacrifice usability for aesthetics.

---

## Page Philosophy

Every page must answer one business question.

Avoid decorative UI.

Avoid unnecessary widgets.

Prioritize executive summaries before details.

---

## Cards

Only use cards to group related information.

Avoid card nesting.

Use whitespace generously.

---

## Colors

Follow design.md exactly.

Never introduce additional brand colors.

Status colors are only used for state.

---

## Typography

Space Grotesk

Headings only.

Inter

Body text.

JetBrains Mono

Financial metrics.

Never mix fonts outside these rules.

---

## Components

Always reuse existing components.

Never recreate buttons, cards or inputs.

If a new pattern appears multiple times,

extract it into a reusable component.

---

## Dashboard

The dashboard should feel like an executive briefing.

The first screen should communicate business health within 15 seconds.

---

## AI

AI is an explainer.

Never present AI output before deterministic calculations.

Always separate:

Computed Data

↓

AI Interpretation

---

## Motion

Use subtle transitions.

150–250ms.

No flashy animations.

Avoid excessive scaling.

Prefer opacity and slight movement.

---

## Layout

Desktop first.

Then tablet.

Then mobile.

Maintain consistent spacing.

---

## Charts

Charts support decisions.

Never use charts as decoration.

Every chart should answer a business question.

---

## Accessibility

WCAG AA contrast.

Visible focus states.

Keyboard navigation.

Semantic HTML.

---

## Code Quality

Prefer composition over duplication.

Strong typing.

Reusable hooks.

Reusable components.

Avoid magic numbers.

Maintain consistent naming.
