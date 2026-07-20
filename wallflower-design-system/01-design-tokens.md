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
