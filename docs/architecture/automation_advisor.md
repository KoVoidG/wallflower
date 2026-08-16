# Wallflower — Automation, Advisor & Playground UI Redesign and Demo Implementation Plan

## 1. Objective

Redesign the **Automation**, **Advisor**, and **Playground** experiences so they feel like coherent Wallflower product features rather than separate developer tools.

The redesign must:

- Preserve the existing concepts and underlying implementations.
- Keep the current demo/implementation focus rather than turning these into completely new systems.
- Make the UI understandable to a non-technical SME/business owner.
- Avoid duplicating the existing **floating Capybot**.
- Add **Advisor** to the main application navigation.
- Keep the existing multi-agent Advisor architecture and demo behavior.
- Keep the current Automation, Advisor, and Playground functionality available for demonstration, while changing the presentation and user-facing purpose.

---

# 2. Product Structure

The three features should have clearly different jobs.

### Automation

**Purpose:** Monitor business conditions and trigger predefined responses.

User mental model:

> "Watch this for me and do something when it happens."

### Advisor

**Purpose:** Deeply investigate a business objective and produce a structured strategic action plan.

User mental model:

> "I have a business problem. Analyze it and tell me what I should do."

### Playground → Strategy / What-If Lab

**Purpose:** Let users explore business questions and hypothetical changes without exposing developer/LLM controls.

User mental model:

> "What happens if I change this?"

### Floating Capybot

Keep the existing floating Capybot as the always-available conversational assistant.

User mental model:

> "I want to ask Wallflower something."

Do **not** merge the floating Capybot and Advisor into one interface.

---

# 3. Navigation Changes

## Add Advisor to the sidebar

Current problem:

- `/advisor` exists but is not directly accessible from the main sidebar.
- `/advisor/playground` is exposed instead.

Change the navigation so the actual strategic Advisor is visible.

Recommended navigation:

```text
Dashboard
Business
Decision Planner / Simulations
Advisor
Automation
Reports
```

Keep the floating Capybot accessible globally from the top bar.

### Advisor navigation label

Use:

**Strategic Advisor**

or simply:

**Advisor**

Recommended:

**Advisor**

with a short supporting tooltip such as:

> Turn a business goal into a quantified action plan.

Do not expose "AI Operations Advisor" as the main branding.

---

# 4. Advisor UI Redesign

## Keep the existing implementation

Do not replace:

- Planner
- Researcher
- Critic
- Synthesizer
- Gemini workflow
- SSE execution
- quantitative analysis
- action-plan generation

Those are the core implementation/demo value of the feature.

The change should primarily be **UI, positioning, and handoff**.

The existing Advisor already accepts business goals and produces projected impact KPIs and action items, while its underlying architecture performs multi-stage reasoning.

---

## Advisor landing state

Replace the developer/research-oriented presentation with a strategic workspace.

### Header

**Strategic Advisor**

Supporting text:

> Turn a business objective into a quantified action plan.

### Main input

Large prompt/input area:

> **What are you trying to improve?**

Placeholder:

> Example: Reduce vendor invoice processing time by 40%.

### Suggested goals

Provide quick-start chips/cards:

- Reduce operating costs
- Improve cash flow
- Reduce inventory
- Find my biggest bottleneck
- Improve invoice processing
- Reduce customer waiting time

These should be demo inputs, not hardcoded fake business results.

---

# 5. Advisor Execution State

Keep the existing multi-agent workflow visualization because it is useful for demonstrating the implementation.

However, make it a **secondary explanation of what Wallflower is doing**, not the main purpose of the page.

Example:

```text
Analyzing your goal

Planner
✓ Completed

Researcher
✓ Completed

Critic
● Reviewing assumptions

Synthesizer
○ Waiting
```

The user should primarily understand:

> "Wallflower is investigating your goal."

They should not need to understand what an agent architecture is.

The ReactFlow visualization can remain visually impressive as a demo component, but it should support the business workflow rather than dominate it.

---

# 6. Advisor Result State

Make the result the main focus.

Use sections such as:

## Strategic Finding

Example:

> **Invoice processing is currently your primary operational constraint.**

Then display:

### Projected impact

- Cycle Time Drop
- Cost Savings
- Quality Improvement
- ROI Payback

Keep the existing KPI calculation/output behavior.

---

## Why this is happening

Show the important findings from the analysis in business language.

Example:

1. Manual invoice extraction
2. Approval queue congestion
3. Purchase-order matching delays

---

## Recommended Plan

Display the existing generated action items as clear cards.

Each card should show:

- Recommendation
- Priority
- Department
- Timeline
- Expected impact

---

# 7. Advisor Primary Actions

Add clear handoffs from Advisor into the rest of Wallflower.

### Primary buttons

**Simulate Recommendation**

Opens the relevant simulation workflow using the Advisor result.

**Save to Action Plan**

Persists the recommendation as an actual tracked action.

### Secondary

**Ask Capybot**

Opens the existing floating Capybot drawer with the Advisor context available.

This is important because it reinforces:

> Advisor = deep strategic analysis
> Capybot = conversational follow-up

Do not build another chat interface inside Advisor.

---

# 8. Advisor Demo Requirements

The Advisor should remain fully demoable even if some production integrations are not implemented yet.

The demo should have:

### Demo goals

- Reduce vendor invoice processing by 40%
- Find the biggest operational bottleneck
- Improve cash flow
- Reduce inventory risk
- Reduce operating costs

The current implementation can continue using its demo organization/business data where required.

The important requirement is that the UI makes it obvious these are **examples of business objectives**, not fake system controls.

---

# 9. Automation UI Redesign

## Keep the Automation concept

Do not remove the pipeline/automation engine underneath.

The current implementation demonstrates:

- deployed pipelines
- execution steps
- telemetry
- execution state
- data/invoice/queue-related workflows

Keep that implementation for demo purposes.

The change should be to present Automation as a **business monitoring and trigger system**.

---

# 10. Automation Landing Page

### Header

**Automation**

Supporting text:

> Let Wallflower monitor important business conditions and respond automatically.

Main section:

## Active Automations

Show automation cards instead of starting with a terminal.

Example:

### Cash Runway Monitor

**Active**

**When:**
Cash runway falls below 3 months

**Wallflower will:**
Alert you and start a cash-risk analysis.

[Edit] [Pause]

---

### Inventory Risk Monitor

**Active**

**When:**
Slow-moving inventory exceeds 20%

**Wallflower will:**
Identify affected inventory and notify you.

[Edit] [Pause]

---

### Invoice Processing Monitor

**Paused**

**When:**
Invoice backlog exceeds 20 items

**Wallflower will:**
Trigger invoice processing analysis.

[Edit] [Resume]

---

## Create Automation

Large:

**+ Create Automation**

Use a simple builder:

```text
WHEN
[ condition ]

DO
[ action ]
```

Optional:

```text
AND
[ additional condition ]
```

---

# 11. Automation Demo Builder

For the implementation/demo version, support a small set of predefined conditions and actions rather than attempting a complete automation platform.

### Example conditions

- Cash runway below X months
- Inventory aging above X%
- Invoice backlog above X
- Department utilization above X%
- Overdue receivables above X
- Risk reaches Critical

### Example actions

- Notify user
- Create action
- Run analysis
- Open simulation
- Ask Capybot to investigate
- Trigger existing demo pipeline

This keeps the functionality demonstrable without pretending a full production automation infrastructure exists.

---

# 12. Automation Execution / Pipeline View

Do not delete the current pipeline UI.

Move it behind an automation's details/execution view.

For example:

User selects:

**Invoice Processing Monitor**

→ **Automation Details**

Then show:

### Trigger

Invoice backlog > 20

### Actions

1. Detect backlog
2. Analyze invoices
3. Run matching workflow

Then optionally:

**Execution History**

with the existing telemetry/log-style output.

This preserves the impressive implementation demo while keeping the main Automation page understandable.

---

# 13. Automation Visual Language

Reduce developer terminology in the primary UI.

### Avoid as primary content

- Cron Schedule
- `0 */4 * * *`
- `wss://...`
- Target Endpoint
- LLM Schema Inference
- raw pipeline IDs

### Replace with

- Every 4 hours
- Connected system
- Last run
- Next check
- Trigger
- Action
- Status

Technical details can remain accessible inside:

**Advanced Details**

or

**Execution Details**

This keeps the demo implementation visible without making business users read engineering configuration.

---

# 14. Playground Redesign

## Do not keep the current Playground as an LLM testing console

The current Playground exposes:

- Temperature
- System Prompt
- User Message
- JSON output
- Token counts
- Latency
- raw model output

That is useful for developer testing but conflicts with the Wallflower business-product experience.

Do not expose those controls in the primary user experience.

---

# 15. Rename/Reposition Playground

Recommended name:

**Strategy Lab**

Alternative:

**What-If Lab**

Recommended:

**Strategy Lab**

Purpose:

> Explore business questions and hypothetical decisions using your Wallflower data.

This must not duplicate the existing full Simulation Workspace.

The distinction should be:

### Simulation

Structured and quantitative decision modeling.

### Strategy Lab

Natural-language exploration that can turn a question into a scenario.

---

# 16. Strategy Lab UI

### Header

**Strategy Lab**

Supporting text:

> Explore what could happen before making a business decision.

### Main question input

Large field:

> **What do you want to explore?**

Examples:

> What happens if supplier costs increase by 8%?

> What happens if I hire one more cashier?

> What happens if customer payments are delayed by 30 days?

> What happens if sales increase by 20%?

---

# 17. Strategy Lab Suggested Scenarios

Use the existing demo presets as business questions rather than technical presets.

Replace:

- Bottleneck Summary
- JSON: Dept Health
- Workflow Action Plan
- Casual Chat

with:

- Explore a Bottleneck
- Test a Pricing Change
- Test Hiring
- Explore Cash Flow
- Explore Inventory Risk

---

# 18. Strategy Lab Result

The result should present:

## Scenario Summary

> Supplier costs increase by 8%.

### Estimated impact

Revenue
...

Gross Profit
...

Cash Runway
...

Operating Cost
...

### Key Risk

> Higher supplier costs could materially reduce gross margin if prices remain unchanged.

### Capybot Interpretation

> This scenario appears financially manageable, but the biggest uncertainty is whether current pricing can absorb the supplier increase.

Primary actions:

**Run Detailed Simulation**

**Compare Another Scenario**

**Ask Capybot**

**Save Scenario**

The existing model/API output can continue powering the demo.

---

# 19. What happens to the current developer Playground functionality?

Do not necessarily delete it from the repository.

Instead separate it conceptually:

```text
Strategy Lab
    ↓
business-facing UI

Developer Playground
    ↓
internal development/debugging
```

For the actual Wallflower user experience, only expose Strategy Lab.

If the existing developer controls are still needed during development, keep them behind a development-only route or internal tooling rather than treating them as a core product feature.

---

# 20. Relationship Between the Three

The final UI should communicate this distinction:

### Advisor

**Solve a goal**

> "Reduce invoice processing time by 40%."

→ Deep analysis
→ Action plan

### Strategy Lab

**Explore a question**

> "What happens if supplier prices rise 8%?"

→ Fast scenario exploration
→ Optional detailed simulation

### Automation

**Monitor a condition**

> "Watch my cash runway."

→ Trigger action when the condition occurs

### Capybot

**Ask anything**

> "Why did my runway drop?"

→ Conversational explanation/contextual assistance

---

# 21. Do Not Duplicate Capybot

The existing floating Capybot remains the universal assistant.

Do not add:

- another chat drawer
- another floating AI button
- another persistent AI conversation panel

inside Advisor or Strategy Lab.

Instead, provide **Ask Capybot** actions that open the existing drawer.

The drawer should optionally receive context such as:

```text
context:
  source: advisor
  goal: Reduce invoice processing time by 40%
  recommendation: OCR invoice extraction
```

or:

```text
context:
  source: strategy-lab
  scenario: Supplier costs +8%
```

This gives the existing Capybot more value without competing with it.

---

# 22. Shared Demo Data

All three features should use the same Wallflower demo business context.

Do not make each page feel like it has a completely different business.

For example:

**Business**

Revenue: ฿152.4k
Cash runway: 2.1 months
Overdue receivables: ฿21.3k
Invoice cycle: 71.2h
Invoice error rate: 15%
Finance utilization: 95%
Slow-moving inventory: ฿120k

This aligns with the existing Dashboard and Business Health demo context.
Then:

Advisor discovers the invoice bottleneck.

Simulation tests hiring/automation.

Automation monitors invoice backlog.

Capybot can answer questions about all three.

That will make the entire demo feel connected.

---

# 23. Implementation Priority

## Phase 1 — Navigation and terminology

1. Add Advisor to sidebar.
2. Remove Playground from primary sidebar navigation or rename it to Strategy Lab.
3. Keep floating Capybot unchanged.
4. Establish consistent Wallflower/Capybot branding.

## Phase 2 — Advisor UI

1. Redesign landing state.
2. Keep current goal input.
3. Keep current demo goals.
4. Keep multi-agent execution.
5. Make the generated plan the main result.
6. Add:

   - Simulate Recommendation
   - Save to Action Plan
   - Ask Capybot

## Phase 3 — Automation UI

1. Replace terminal-first landing page with Active Automations.
2. Add business-friendly condition/action cards.
3. Add simple Create Automation flow.
4. Keep existing pipeline execution implementation underneath.
5. Move telemetry into execution/details view.

## Phase 4 — Strategy Lab

1. Replace developer Playground controls.
2. Rename user-facing route/UI.
3. Convert presets into business questions.
4. Keep the existing live/demo AI capability.
5. Add scenario-oriented output.
6. Add:

   - Run Detailed Simulation
   - Compare
   - Ask Capybot
   - Save Scenario

## Phase 5 — Cross-feature handoffs

Connect:

```text
Advisor
   ↓
Simulation
   ↓
Action Plan
   ↓
Automation
```

and allow:

```text
Any page
   ↓
Floating Capybot
```

---

# 24. Important Scope Constraint

Do **not** turn this task into a backend rewrite.

The goal is a **UI/product restructuring and functional demo improvement**.

Prioritize:

- user flow
- page hierarchy
- terminology
- visual hierarchy
- existing demo data
- existing API calls
- existing AI flow
- existing simulation functionality
- clear navigation
- clear handoffs

Do not spend the implementation effort building a production-grade workflow orchestration system, full automation scheduler, or new AI architecture.

Where functionality does not yet exist, use the existing demo/mock implementation consistently and make the state visually honest.

---

# 25. Final Desired Experience

A user should be able to enter Wallflower and understand:

### Dashboard

**"Here's what's happening."**

### Business Health

**"Here's what's wrong."**

### Advisor

**"Here's what Wallflower thinks you should do."**

### Simulation

**"Here's what happens if you do it."**

### Strategy Lab

**"Here's what happens if you explore another idea."**

### Automation

**"Here's what Wallflower can keep watching for you."**

### Reports

**"Here's the formal record of the analysis."**

### Floating Capybot

**"Ask Wallflower anything at any point."**

The redesign should preserve the existing technical concepts and implementation demos while making the product feel like **one connected decision-intelligence platform instead of several AI/developer experiments placed next to each other**.

---

# Success Criteria

The redesign is successful when a first-time SME user can look at the sidebar and immediately understand:

**Advisor = solve a business goal**

**Strategy Lab = explore a what-if**

**Automation = monitor and react**

**Capybot = ask questions**

The existing Advisor multi-agent demo remains intact, the floating Capybot remains intact, the Automation pipeline demo remains available, and the Playground's AI capability is preserved behind a business-focused Strategy Lab experience.
