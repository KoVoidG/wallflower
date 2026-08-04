# Decision Planner

## Purpose

The Decision Planner is the core feature of Wallflower.

It enables retail SME owners to safely evaluate business decisions before implementing them in the real world.

Users create business scenarios, modify business variables, run deterministic financial simulations, receive AI explanations, compare outcomes, and export reports.

---

# Core Philosophy

A Scenario represents one possible business decision.

Examples:

- Increase prices by 5%
- Hire one employee
- Purchase new equipment
- Launch a holiday promotion
- Expand inventory

A scenario progresses through three stages:

Draft
↓

Simulated
↓

Saved

Only simulated scenarios contain financial results.

---

# Navigation

Decision Planner
│
├── Scenario Library
│
├── Scenario Workspace
│ ├── Edit Mode
│ └── Results Mode
│
├── Compare Simulations
│
└── Global Assumptions

Templates are NOT a permanent page.

Templates only appear when creating a new scenario.

---

# User Journey

## Step 1

User opens Decision Planner.

Default page:

Scenario Library

Example

Current Baseline

Price +5%

Holiday Promotion

Hire Employee

Expand Inventory

A "New Scenario" button is always visible.

---

## Step 2

User clicks

New Scenario

A modal appears.

Choose Starting Template

- Increase Prices
- Hire Employee
- Reduce Costs
- Launch Promotion
- Purchase Equipment
- Expand Inventory
- Open New Branch
- Blank Scenario

Selecting a template creates a Draft Scenario.

---

## Step 3

Scenario Editor opens.

The user edits business variables.

Examples

Scenario Information

- Name
- Goal
- Time Horizon

Business Variables

- Revenue Change %
- Price Change %
- Supplier Cost %
- Payroll %
- Marketing Spend
- Inventory Investment

No calculations happen yet.

The scenario status is

Draft

---

## Step 4

User clicks

Run Simulation

Run Simulation performs:

1. Validate input values
2. Run deterministic financial calculations
3. Update KPI values
4. Calculate Business Health
5. Calculate Risk Score
6. Generate AI explanation
7. Save simulation
8. Deduct one simulation credit (if applicable)

The scenario status becomes

Simulated

---

## Step 5

Simulation Results appear.

Includes

Business Health

Revenue

Profit

Cash Runway

Working Capital

Inventory Turnover

Risk Level

ROI

Charts

AI Summary

Recommendations

Confidence Score

User can

Save

Duplicate

Compare

Export

Delete

---

## Step 6

Scenario is stored inside

Scenario Library

Users may create multiple scenarios.

Example

Current Baseline

Price +5%

Price +8%

Holiday Promotion

Hire Employee

Open Branch

Each scenario stores

Variables

Results

AI Summary

Simulation Date

Version

Status

---

# Scenario Library

Purpose

Central location for every business scenario.

Each scenario card displays

Scenario Name

Status

Template Type

Business Goal

Simulation Date

Business Health

Risk Level

Actions

Open

Duplicate

Delete

Compare

Export

---

# Scenario Status

Draft

Created but never simulated.

Simulated

Simulation completed successfully.

Archived

Hidden from normal view.

---

# Scenario Editor

Purpose

Modify scenario variables.

Sections

Scenario Information

Financial Variables

Operational Variables

Inventory Variables

Scenario Assumptions

Run Simulation

Only editable values appear here.

Results are NOT displayed until simulation finishes.

---

# Run Simulation

Primary CTA.

The most important button in Decision Planner.

Button Text

Run Simulation

Before execution

Display

"This simulation will consume one simulation credit."

Simulation may take several seconds.

During execution

Disable all editing.

Show progress.

After completion

Display

Simulation Results.

---

# Simulation Results

Purpose

Display deterministic outcomes.

Contains

Executive Summary

Business Health

KPI Cards

Trend Charts

Scenario Impact

Risk Analysis

AI Explanation

Recommendations

Confidence Score

Results become read-only.

To modify them

Return to Scenario Editor.

---

# Compare Simulations

Purpose

Compare multiple simulated scenarios.

Only Simulated scenarios are selectable.

Workflow

Select Scenarios

↓

Compare

↓

Results

Comparison includes

Revenue

Profit

Cash Runway

Business Health

Working Capital

Inventory Turnover

Risk Level

ROI

Confidence

Recommended Option

Maximum

4 scenarios.

Minimum

2 scenarios.

Current Baseline is automatically included by default.

---

# Global Assumptions

Purpose

Business-wide assumptions shared by every simulation.

Examples

Expected Inflation

Supplier Cost Growth

Average Demand Trend

Seasonality

Tax Rate

Interest Rate

Currency

Changing Global Assumptions marks all existing simulations as

Outdated

Users should rerun simulations to refresh results.

---

# AI Analysis

AI never performs calculations.

AI receives deterministic outputs only.

AI responsibilities

Explain metrics

Summarize outcomes

Highlight risks

Recommend actions

Describe trade-offs

Never invent financial values.

Always mention uncertainty where appropriate.

---

# Reports

Simulation Results can be exported.

Available formats

PDF

Excel

Print

Reports always include

Business Health

KPIs

Charts

AI Summary

Risk Analysis

Recommendations

Confidence Score

---

# Monetization

Simulation is the premium action.

Editing scenarios is free.

Running simulations consumes credits.

Example Plans

Free

- 5 simulations/month
- 5 saved scenarios
- Basic AI
- Limited exports

Pro

- Unlimited simulations
- Unlimited scenarios
- Advanced AI
- Comparison
- Unlimited exports

Business

- Multiple businesses
- Team collaboration
- Advanced reporting
- Future integrations

---

# UX Principles

Scenarios are assets.

Users should revisit, duplicate, improve and compare scenarios over time.

Templates are starting points, not destinations.

Users spend most of their time inside

Scenario Editor

and

Simulation Results.

Decision Planner should feel like a business laboratory where owners safely experiment before making real-world decisions.
