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
