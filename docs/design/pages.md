# pages.md

# Wallflower Page Architecture

Version: 1.0

---

# Purpose

This document defines the structure, hierarchy, and user experience of every
major page in Wallflower.

Wallflower is an executive decision workspace that helps Thai retail SME owners
make informed business decisions through deterministic financial analysis and AI
explanations.

Every page should answer one primary business question.

---

# Navigation Structure

```
Overview

Business

Decision Planner

AI Advisor

Reports

Settings
```

Only these pages appear in the sidebar.

Everything else is a child page.

---

# Global Layout

Desktop

```
Sidebar

↓

Header

↓

Page Title

↓

Executive Summary

↓

Primary Content

↓

Supporting Details
```

Tablet

```
Collapsible Sidebar

↓

Header

↓

Content
```

Mobile

```
Top Navigation

↓

Content

↓

Bottom Actions (if needed)
```

---

# Information Hierarchy

Every page follows the same structure.

1 Executive Summary

↓

2 Key Metrics

↓

3 Visual Insights

↓

4 Detailed Information

↓

5 AI Interpretation

↓

6 Recommended Actions

Never display detailed tables before summarizing information.

---

# Overview

Purpose

Answer

"How is my business performing today?"

---

Primary Components

Business Health

Today's Priorities

Key Metrics

Recent Trends

AI Executive Summary

Recent Simulations

---

Layout

```
Business Health
Today's Priorities

↓

KPI Grid

↓

Charts

↓

AI Executive Summary

↓

Recent Activity
```

---

Business Health

Shows

Health Score

Cash Runway

Risk Level

Decision Confidence

This should be the first thing users see.

---

Today's Priorities

Displays actionable tasks.

Examples

Inventory running low

Cash runway below target

Simulation available

Missing financial data

High operating costs

Maximum five items.

---

Key Metrics

Examples

Revenue

Profit

Cash

Working Capital

Inventory Turnover

Gross Margin

Each metric links to more details.

---

Visual Insights

Examples

Revenue Trend

Expense Trend

Cash Trend

Profit Trend

Inventory Trend

Show trends before tables.

---

AI Executive Summary

Purpose

Translate business health into plain language.

Contains

Summary

Risks

Recommendations

Confidence

Always references deterministic calculations.

---

Recent Activity

Displays

Latest Reports

Recent Simulations

Recent Updates

---

# Business

Purpose

Maintain business information required for analysis.

NOT bookkeeping.

NOT accounting.

---

Pages

Business Profile

Financial Snapshot

Operations

Inventory Snapshot

Business Assumptions

---

Layout

```
Business Profile

↓

Financial Snapshot

↓

Operations

↓

Inventory

↓

Assumptions
```

---

Business Profile

Contains

Business Name

Industry

Location

Employees

Store Count

Business Type

---

Financial Snapshot

Contains

Revenue

Expenses

Cash

Debt

Assets

Liabilities

Working Capital

Use grouped sections.

---

Operations

Contains

Staff

Operating Hours

Monthly Fixed Costs

Supplier Overview

Optional Notes

---

Inventory Snapshot

Contains

Inventory Value

Inventory Turnover

Stock Coverage

Supplier Frequency

No inventory management features.

Only business insights.

---

Business Assumptions

Contains

Growth Rate

Expected Inflation

Supplier Cost Increase

Demand Assumption

Seasonality

These values power simulations.

---

# Decision Planner

Purpose

Help business owners evaluate future decisions.

This is Wallflower's primary feature.

---

Flow

```
Choose Goal

↓

Choose Template

↓

Adjust Variables

↓

Review Assumptions

↓

Run Simulation

↓

Compare Results

↓

AI Explanation

↓

Decision
```

---

Sections

Scenario Templates

Custom Scenario

Scenario Comparison

Assumptions

Results

---

Scenario Templates

Examples

Increase Prices

Hire Employee

Reduce Costs

Open New Branch

Holiday Promotion

Purchase Equipment

Expand Inventory

Templates should cover common retail decisions.

---

Custom Scenario

Allows advanced users to modify variables.

---

Assumptions

Always visible.

Examples

Demand unchanged

Rent fixed

Payroll fixed

Supplier costs +5%

Users must know what assumptions are used.

---

Results

Contains

KPI Comparison

Charts

Business Health Impact

Risk Impact

Cash Runway

Profit

Revenue

---

Comparison

Display

Current

Scenario

Difference

Never rely solely on color.

Always show values.

---

AI Recommendation

Summarizes

Expected Outcome

Risks

Trade-offs

Recommended Actions

Never invent financial values.

---

# AI Advisor

Purpose

Allow users to interact with business data naturally.

---

Capabilities

Explain Metrics

Ask Questions

Explain Simulations

Suggest Next Steps

Summarize Reports

---

Examples

Why did my profit decrease?

What happens if supplier costs increase?

How can I improve cash flow?

Can I afford another employee?

---

Layout

```
Chat Interface

↓

Business Context

↓

Suggested Questions

↓

Recent Conversations
```

---

Rules

AI always references deterministic calculations.

Never invent numbers.

Always cite assumptions.

---

# Reports

Purpose

Generate executive-ready reports.

---

Sections

Executive Report

Simulation Reports

Report History

Export

---

Executive Report

Contains

Business Health

KPIs

Charts

Risks

AI Summary

Recommendations

Confidence

---

History

Displays

Generated Reports

Simulation Reports

Archived Reports

Search

Filter

Sort

---

Export

PDF

Excel

Print

Share (future)

---

# Settings

Purpose

Configure the workspace.

Contains

Business Preferences

Currency

Language

Theme

Notifications

User Profile

Security

AI Preferences

Integrations (future)

---

# Empty States

Every page requires one.

Example

No Reports

↓

Explanation

↓

Generate First Report

---

# Loading States

Use skeleton loaders.

Avoid full-page spinners.

Loading should preserve layout.

---

# Error States

Always explain

What happened

Why

How to recover

Avoid technical messages.

---

# Responsive Behavior

Desktop

Full dashboard experience.

Tablet

Collapse sidebar.

Reduce chart density.

Mobile

Single-column layout.

Priority order

Business Health

↓

KPIs

↓

AI Summary

↓

Everything Else

---

# Navigation Rules

Sidebar

Major pages only.

Breadcrumb

Child pages only.

Tabs

Within a page.

Never use tabs as primary navigation.

---

# Design Rules

Every page should answer one business question.

Every page should begin with a summary.

Every detailed section should support that summary.

Every simulation should end with:

Decision

↓

Impact

↓

Risks

↓

AI Explanation

↓

Recommended Actions

---

# Final Philosophy

Wallflower should never feel like accounting software.

Wallflower should never feel like a trading terminal.

Wallflower should feel like sitting down with an experienced business advisor who presents facts clearly, explains what they mean, and helps retail SME owners make confident decisions.
