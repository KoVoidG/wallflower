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

## Design System & Memory Rules (Capybot & Components)

Refer to [`design_system_memory.md`](./design_system_memory.md) for complete details:

1. **AI Identity**:
   - The AI Assistant is named **Capybot** (never "AI Advisor" or generic "AI").
   - **Avatar**: Always use `<BotAvatar />` (`src/components/ui/bot-avatar.tsx`) instead of generic sparkle icons (`Sparkles`).
2. **KPI Stat Cards**:
   - Card container: `p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs flex flex-col justify-between space-y-4`.
   - Monochrome B&W icon box (`size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A]`).
   - Large monospace metric value (`font-mono text-2xl font-bold text-[#0F172A] dark:text-white`).
   - Comparison delta with `ArrowUpRight`/`ArrowDownRight` colored emerald for good, rose for bad.
3. **Charts & Delta Colors**:
   - Positive / Improvements: **Green / Emerald (`#10B981`)**
   - Negative / Deteriorations: **Red / Rose (`#F43F5E`)**
   - Baseline / Neutral: **Slate (`#94A3B8`)**
4. **Number Formatting**:
   - Confidence levels must always be formatted as integer percentages (`Math.round(...)%`, e.g. `80% Confidence`, never unrounded floating point numbers).

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
