# Wallflower Design System

**Version**: 1.0  
**Updated**: 2026-07-18  
**Applies to**: Marketing site, authentication, onboarding, application dashboard, simulations, reports, light mode, dark mode, English, and Thai-ready layouts

## 1. Design Direction

Wallflower should look like a calm, premium business decision platform—not a generic purple AI dashboard.

The interface combines:

- Quiet editorial clarity
- Fintech-level trust
- Modern analytical tooling
- Friendly guidance for non-expert SME owners
- Subtle botanical cues from the Wallflower name
- Purposeful motion rather than decorative animation

### Visual personality

- Professional, not corporate-heavy
- Intelligent, not futuristic
- Supportive, not childish
- Data-rich, not visually crowded
- Distinctive, not trend-dependent
- Calm under pressure

### Avoid

- Purple-first AI gradients
- Glassmorphism on every card
- Excessive glowing borders
- Rainbow KPI cards
- Cartoon-heavy illustrations inside the product
- Large empty hero sections with generic slogans
- Overuse of pill-shaped elements
- Excessive rounded corners
- Animating every chart, card, and icon
- Presenting AI content as more authoritative than calculations

## 2. Brand Concept

The Wallflower symbol can use a geometric flower made from overlapping rounded petals. It represents multiple data points forming one clear decision.

Brand language:

> Understand the business. Test the decision. See what changes.

Recommended product tagline:

> Better decisions before they cost your business.

Alternative marketing headline:

> See the impact before you make the move.

## 3. Color System

### 3.1 Light theme

| Token | Hex | Usage |
|---|---:|---|
| `--background` | `#F7FAF9` | Main page background |
| `--surface` | `#FFFFFF` | Cards, dialogs, table surfaces |
| `--surface-subtle` | `#F0F6F4` | Secondary panels and filters |
| `--surface-raised` | `#FFFFFF` | Elevated popovers and sticky surfaces |
| `--border` | `#DCE7E3` | Default borders |
| `--border-strong` | `#B8CCC5` | Focused or emphasized borders |
| `--text-primary` | `#10201D` | Headings and primary copy |
| `--text-secondary` | `#4B625C` | Supporting text |
| `--text-muted` | `#71857F` | Metadata and placeholders |
| `--brand` | `#0F766E` | Primary actions and active navigation |
| `--brand-hover` | `#0B625B` | Primary hover |
| `--brand-soft` | `#DDF3EF` | Selected and highlighted backgrounds |
| `--brand-strong` | `#074E49` | Dark brand details |
| `--info` | `#2563EB` | Informational and growth contexts |
| `--info-soft` | `#E8F0FF` | Informational backgrounds |
| `--success` | `#15803D` | Positive outcome |
| `--success-soft` | `#E7F6EC` | Success background |
| `--warning` | `#D97706` | Warning and medium risk |
| `--warning-soft` | `#FFF3DD` | Warning background |
| `--danger` | `#DC2626` | Critical risk and destructive action |
| `--danger-soft` | `#FDECEC` | Danger background |
| `--ai` | `#0891B2` | AI-generated explanations only |
| `--ai-soft` | `#E5F7FB` | AI panel background |

### 3.2 Dark theme

Dark mode should use deep green-black neutrals rather than pure black or navy.

| Token | Hex | Usage |
|---|---:|---|
| `--background` | `#07110F` | Main background |
| `--surface` | `#0D1916` | Cards |
| `--surface-subtle` | `#11221E` | Secondary panels |
| `--surface-raised` | `#152924` | Popovers and dialogs |
| `--border` | `#223A34` | Default borders |
| `--border-strong` | `#36554D` | Emphasized borders |
| `--text-primary` | `#F2F8F6` | Headings and primary copy |
| `--text-secondary` | `#B6C8C3` | Supporting text |
| `--text-muted` | `#829891` | Metadata |
| `--brand` | `#2DD4BF` | Primary action and active state |
| `--brand-hover` | `#5EEAD4` | Hover |
| `--brand-soft` | `#123A34` | Selected backgrounds |
| `--info` | `#60A5FA` | Information and growth |
| `--success` | `#4ADE80` | Positive outcome |
| `--warning` | `#FBBF24` | Warning |
| `--danger` | `#F87171` | Critical risk |
| `--ai` | `#22D3EE` | AI explanation |

### 3.3 Color roles

Color must mean something:

- Teal: Wallflower brand, selected state, primary action
- Cyan: AI explanation or generated recommendation
- Blue: neutral information, growth, comparison
- Green: confirmed positive status
- Amber: caution or medium risk
- Red: high risk, failure, destructive action
- Slate/green-black: neutral UI structure

Blue fits the system when it is used selectively. It should not compete with teal as the main brand color.

### 3.4 Chart palette

Recommended ordered chart series:

1. Teal `#0F766E`
2. Blue `#2563EB`
3. Green `#16A34A`
4. Amber `#D97706`
5. Coral `#E85D5D`
6. Slate `#64748B`

Chart semantic mapping:

- Revenue: teal
- Expenses: amber or coral
- Profit: green
- Cash flow: blue
- Baseline: slate
- Expected scenario: teal
- Best case: green
- Worst case: coral

Do not communicate outcomes using color alone. Use labels, line styles, icons, and values.

## 4. Typography

### Primary font

**Geist Sans**

Use for all application UI, marketing copy, numbers, forms, and reports. It is modern, compact, legible, and appropriate for dense financial interfaces.

Fallback:

```css
font-family: "Geist", "Noto Sans Thai", ui-sans-serif, system-ui, sans-serif;
```

### Thai font

**Noto Sans Thai**

Load when Thai content is present. Test line-height and button height separately because Thai glyphs require more vertical room.

### Monospace font

**Geist Mono**

Use sparingly for:

- Calculation versions
- IDs in development/admin contexts
- Structured data previews
- Technical metadata

Never use monospace for ordinary financial values.

### Type scale

| Style | Size / Line height | Weight | Usage |
|---|---|---:|---|
| Display | 64/68 desktop, 44/48 tablet, 38/42 mobile | 650–700 | Landing hero |
| H1 | 36/44 | 650 | Page heading |
| H2 | 28/36 | 650 | Major section |
| H3 | 20/28 | 600 | Card group or panel |
| Body large | 18/30 | 400 | Marketing body |
| Body | 15/24 | 400 | Application body |
| Body small | 13/20 | 400 | Supporting text |
| Label | 13/18 | 550 | Inputs and card labels |
| Caption | 12/18 | 450 | Metadata |
| KPI large | 34/40 | 650 | Primary metrics |
| Table number | 14/20 | 550 | Financial tables |

Use tabular numerals for metrics:

```css
font-variant-numeric: tabular-nums;
```

## 5. Spacing and Layout

Use a 4 px base grid.

Spacing scale:

```text
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
```

### Application shell

- Expanded sidebar: 248 px
- Collapsed sidebar: 72 px
- Right contextual rail: 320 px, only when useful
- Main content max width: 1440 px
- Desktop page padding: 32 px
- Tablet page padding: 24 px
- Mobile page padding: 16 px
- Top bar height: 64 px

Do not force a right AI rail on every screen. Use it only where contextual questions or recommendations help. On narrower screens, it becomes a drawer.

### Marketing container

- Maximum width: 1280 px
- Horizontal padding: 24–32 px
- Hero minimum height: approximately 760 px on desktop
- Avoid placing unverified customer logos or fabricated metrics in the live landing page

## 6. Shape, Border, and Elevation

### Radius

| Token | Value | Usage |
|---|---:|---|
| `--radius-sm` | 6 px | Inputs, small controls |
| `--radius-md` | 10 px | Buttons, cards |
| `--radius-lg` | 14 px | Major panels and dialogs |
| `--radius-xl` | 20 px | Marketing artwork only |
| `--radius-full` | 999 px | Avatars, tags, status indicators |

Avoid 20–24 px radius on every dashboard card. Financial tools should feel structured rather than toy-like.

### Borders

- Most cards use a 1 px border and no shadow.
- Active cards may use `brand` border plus a subtle inset ring.
- Tables use dividers rather than individual boxed rows.

### Shadows

Light mode:

```css
--shadow-sm: 0 1px 2px rgb(16 32 29 / 0.05);
--shadow-md: 0 10px 30px rgb(16 32 29 / 0.08);
```

Dark mode should rely mostly on borders and surface contrast, not dark shadows.

## 7. Component Principles

### Buttons

Primary:

- Teal background
- White text in light mode
- Dark text only when contrast passes in dark mode
- One primary action per panel

Secondary:

- Neutral surface
- Strong border
- No color fill unless selected

Destructive:

- Red only for confirmed destructive actions

Sizes:

- Small: 32 px
- Default: 40 px
- Large: 48 px

### Cards

Every card must answer one clear question. A KPI card contains:

- Metric label
- Current value
- Unit
- Status text
- Change and comparison period
- Optional compact visual
- Tooltip explaining calculation

Do not put a full chart inside every KPI card.

### Forms

- Labels always remain visible.
- Currency fields show `THB` as prefix or suffix.
- Group related financial fields.
- Explain why sensitive data is requested.
- Support autosave for multi-step onboarding where practical.
- Preserve entered values after validation errors.
- Use examples relevant to Thai SMEs.

### Tables

- Right-align numeric values.
- Keep units in headers.
- Use tabular numerals.
- Sticky headers for long tables.
- Include empty and loading states.
- Allow horizontal scroll on mobile instead of crushing columns.

### Status

Every status includes at least two of:

- Color
- Icon
- Label
- Numeric severity
- Pattern or line style

Example:

```text
High risk · 82/100
```

not merely a red circle.

## 8. Screen Guidance

### Landing page

Recommended structure:

1. Navigation
2. Hero with direct product promise
3. Interactive or animated product preview
4. Three-step decision workflow
5. Core capabilities
6. Scenario examples
7. Explainability and trust section
8. Thai SME context
9. Final call to action
10. Footer

Hero copy:

**Eyebrow**  
Decision intelligence for Thai SMEs

**Headline**  
See the impact before you make the move.

**Body**  
Wallflower turns your business data into clear diagnostics, risk warnings, and decision simulations—so you can act with evidence instead of guesswork.

**Primary CTA**  
Analyze my business

**Secondary CTA**  
See a sample simulation

Avoid "free trial" until pricing and account limits are real.

### Dashboard

Priority order:

1. Business pulse and data-through date
2. Urgent risks and next recommended action
3. Four core KPIs
4. Revenue, expense, profit, and cash-flow trend
5. Scenario call-to-action
6. Recent decisions and reminders

The dashboard should guide the next action rather than show every available feature.

### Business health

Use tabs or sections:

- Financial health
- Operational health
- Growth readiness
- Strengths and weaknesses
- Data completeness

Every score must expose its contributing metrics.

### Risk center

Risk cards show:

- Severity and category
- Risk statement
- Evidence
- Likelihood
- Estimated impact
- What changed
- Mitigation
- Status and owner

### Simulator

Use a three-stage layout:

1. Choose decision
2. Enter assumptions
3. Review and run

Show which fields come from the business baseline and which are user assumptions.

### Simulation results

Top summary:

- Recommended posture
- Expected outcome
- Largest upside
- Largest downside
- Data confidence label

Then:

- Baseline vs expected
- Best/expected/worst cases
- Cash runway timeline
- Detailed metric table
- Assumptions and sensitivity
- AI explanation
- Save, compare, report

### AI Advisor

The advisor is contextual, not a generic chatbot. Suggested prompts should reference the current screen and business data. AI messages must visually distinguish:

- Calculated fact
- User input
- AI interpretation
- Missing information
- Disclaimer

### Reports

Reports use a more editorial layout than the dashboard:

- Cover and report metadata
- Executive summary
- Key metrics
- Health and risk analysis
- Simulation outcome
- Recommendation
- 90-day action plan
- Assumptions and limitations

## 9. Motion System

Use Motion for React.

Motion should:

- Establish hierarchy
- Explain state changes
- Connect simulator input to result
- Reduce perceived loading time
- Make the landing page memorable

Motion should not:

- Delay task completion
- Move financial values unnecessarily
- Bounce serious warnings
- animate every hover target
- create motion sickness

### Timing

| Interaction | Duration |
|---|---:|
| Hover and press | 120–160 ms |
| Tooltip/popover | 140–180 ms |
| Card or panel transition | 180–240 ms |
| Drawer/dialog | 220–300 ms |
| Page content reveal | 280–420 ms |
| Simulation result sequence | 400–650 ms |

Preferred easing:

```text
[0.22, 1, 0.36, 1]
```

Use restrained springs:

```text
stiffness: 260
damping: 28
mass: 0.8
```

### Landing motion

- Flower mark forms from data points.
- Hero headline reveals by line, not letter.
- Product preview responds subtly to pointer position.
- Workflow steps animate as data moving through diagnosis, simulation, and action.
- No continuous background particles.

### App motion

- Sidebar active indicator transitions between routes.
- KPI values may count once on first reveal, then remain stable.
- Chart series cross-fade between scenarios.
- Risk details expand with height and opacity.
- Simulation run shows a clear calculation sequence.
- Respect `prefers-reduced-motion`; reduce to fades or instant transitions.

## 10. Dark Mode

Dark mode is not a simple color inversion.

Rules:

- Use layered green-black surfaces.
- Reduce saturated fills and use color mainly for key data.
- Increase border visibility.
- Avoid pure white text; use soft off-white.
- Keep charts readable with brighter strokes and restrained area fills.
- AI cyan should not dominate teal brand actions.
- Warning and danger colors need separate dark-theme tokens.
- Test every semantic status independently.

Theme choices:

- System
- Light
- Dark

The theme selector belongs in the topbar shortcut and settings.

## 11. Accessibility

Minimum requirements:

- WCAG 2.2 AA contrast
- Visible keyboard focus
- Skip-to-content link
- Semantic headings
- Form error association
- Screen-reader labels for charts and icons
- Data table alternatives for charts
- No color-only status
- Minimum 44×44 px touch targets on mobile
- Reduced-motion support
- Keyboard-operable dialogs, menus, tabs, and simulator
- Announce simulation completion and errors using live regions
- Thai labels tested with screen readers where possible

## 12. Responsive Behaviour

### Desktop

- Persistent sidebar
- Optional contextual right rail
- Multi-column dashboard
- Side-by-side scenario comparison

### Tablet

- Collapsible sidebar
- Two-column KPI grid
- Context rail becomes drawer
- Charts stack where necessary

### Mobile

- Bottom navigation for Dashboard, Risks, Simulate, Reports, More
- One-column content
- Sticky primary action for simulator
- Full-screen drawers
- KPI cards may horizontally scroll only when comparison is necessary
- Tables use horizontal scrolling with frozen first column where practical

## 13. Content and Voice

Wallflower speaks like a calm business analyst.

### Voice qualities

- Clear
- Specific
- Non-judgmental
- Evidence-based
- Action-oriented
- Honest about uncertainty

### Preferred

> Your cash runway may fall from 8.2 to 4.7 months after this hire.

> Consider delaying the hire, reducing the initial headcount, or securing at least ฿180,000 in additional working capital.

### Avoid

> Amazing! Your AI-powered insights are ready!

> This decision will definitely grow your business.

### Terminology

Use:

- Business health
- Risk
- Scenario
- Assumption
- Expected case
- Best case
- Worst case
- Recommendation
- Data completeness

Avoid:

- Prediction accuracy unless scientifically validated
- Guaranteed
- Fail-proof
- AI knows
- Perfect decision

## 14. UI UX Pro Max Usage

Use UI UX Pro Max as a design-review and implementation-guidance skill, not as a runtime dependency.

Recommended workflow:

1. Provide this `design.md` as the non-negotiable design system.
2. Ask for page-specific hierarchy and responsive recommendations.
3. Ask it to identify generic SaaS patterns and propose alternatives.
4. Check accessibility, empty states, and dark mode.
5. Require all generated UI to use existing tokens and components.
6. Reject page-specific palettes, arbitrary gradients, and new radius scales.
7. Review generated pages against the screen guidance in this file.

Example instruction:

```text
Use specs/001-wallflower-mvp/design.md as the source of truth.
Do not introduce purple as a brand color, new color tokens, or a different
type scale. Build the page with existing shadcn/ui primitives, Wallflower
tokens, responsive states, dark mode, reduced motion, loading, empty, and
error states. Explain any deviation before implementing it.
```

## 15. Design QA Checklist

Before a page is complete:

- Does the page have one obvious primary action?
- Can a new SME owner understand the page without financial jargon?
- Are calculated values distinguishable from AI commentary?
- Are units and data-through dates visible?
- Are assumptions exposed?
- Are empty, loading, error, and partial-data states designed?
- Does it work in light and dark modes?
- Does it work with reduced motion?
- Does Thai text fit?
- Is keyboard focus visible?
- Do status colors retain meaning?
- Is the page still understandable in grayscale?
- Does the page avoid generic purple AI styling?
- Is every animation useful?
