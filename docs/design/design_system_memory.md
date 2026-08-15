# Wallflower Design System & Memory Guidelines

This document serves as the persistent design and architectural memory for all future development, page modifications, component redesigns, and AI integrations across Wallflower.

---

## 1. AI Identity & Avatar Rules

- **Assistant Name**: **Capybot** (never "AI Advisor", "AI advisor", or generic "AI").
  - Use "Ask Capybot", "Capybot Executive Verdict", "Capybot Intelligence".
- **Avatar Component**: **`<BotAvatar />`** (`src/components/ui/bot-avatar.tsx`).
  - **NEVER** use generic `Sparkles` icon as the main visual representation for Wallflower AI.
  - **ALWAYS** use `<BotAvatar size={...} />` (the signature Capybara bot avatar with radiant glow aura) whenever AI is speaking, providing executive verdicts, or acting as a trigger.
  - Sizes:
    - Small buttons / callouts: `size={20}` or `size={24}`
    - Section headers / cards: `size={36}`, `size={40}`, or `size={42}`
    - Floating trigger / modals: `size={36}` or `size={48}`

---

## 2. KPI Metric Cards Design Standard

All KPI stat cards across **Dashboard**, **Business Health**, **Simulations**, and **Reports** must follow this unified structural pattern:

```tsx
<Card className="flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
  {/* Top Row: Monochrome B&W Icon Box + Label */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
        <Icon className="size-3.5" />
      </div>
      <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
        {metric.label}
      </span>
    </div>
  </div>

  {/* Bottom Row: Large Monospace Value + Directional Delta */}
  <div className="space-y-1">
    <div className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
      {metric.value}
    </div>
    <div className={cn(
      'flex items-center gap-1 text-xs font-semibold',
      isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
    )}>
      {isGood ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      <span>{deltaText}</span>
    </div>
  </div>
</Card>
```

---

## 3. Chart Color & Dynamic Delta Rules

When comparing **Current Baseline vs. Projected / Simulated** values in Recharts:
- **Baseline / Current Bar**: Neutral Slate (`#94A3B8` / `#64748B`).
- **Projected Bar / Value**:
  - **Positive Outcome / Improvement** (`+` throughput, `-` cycle time, `+` profit, `+` satisfaction):
    - Fill: **Green / Emerald (`#10B981`)**
    - Text / Pill: `text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40`
  - **Negative Outcome / Deterioration** (`-` throughput, `+` cycle time, `-` profit, `+` unnecessary costs):
    - Fill: **Red / Rose (`#F43F5E`)**
    - Text / Pill: `text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40`

---

## 4. Number & Confidence Formatting Rules

- **Confidence Scores**:
  - Must ALWAYS be formatted as clean rounded integers:
    ```ts
    const confidencePct = Math.round(score <= 1 ? score * 100 : score);
    // Returns e.g. "80% Confidence" (NEVER "0.8042591913270156%")
    ```
- **Financial Numbers**: Format with standard currency notation (`฿` or `$`) and comma delimiters (`toLocaleString()`).

---

## 5. Spacing, Padding, and Vertical Rhythm

- **Page Root**: Use `AppPage` with `space-y-5 sm:space-y-6`.
- **Bottom Padding**: Keep bottom padding compact (`pb-4`). Avoid stacking large paddings (`pb-16` / `pb-12`).
- **Section Numbering**: When presenting step-by-step decision inputs:
  - `1`: Primary Decision Variables
  - `2`: Scenario Assumptions
  - `3`: Business Baseline Reference
- **Separation of Concerns**: Selection components (e.g. 8 scenario cards grid) and configuration workspaces (inputs + live preview) must live in **separate container cards**, not crammed into a single div.
