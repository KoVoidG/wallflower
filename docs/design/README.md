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
