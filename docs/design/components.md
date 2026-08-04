# components.md

# Wallflower Component System

Version: 1.0

---

# Purpose

This document defines every reusable UI component used throughout
Wallflower.

Wallflower is an executive decision workspace for Thai retail SMEs.

Components should emphasize:

- clarity
- consistency
- readability
- information hierarchy
- trust

NOT decoration.

Every reusable UI element should follow this document.

---

# Component Philosophy

Every component should answer one question.

Do not build generic components that try to solve everything.

Prefer many focused reusable components over one massive configurable component.

---

# Component Priorities

1. Readability
2. Consistency
3. Accessibility
4. Reusability
5. Simplicity

---

# Buttons

## Primary Button

Purpose

Primary action on the screen.

Examples

- Run Simulation
- Save Changes
- Generate Report

Rules

- Only ONE primary button should exist in a major section.
- Uses tertiary color.
- Filled style.

---

## Secondary Button

Purpose

Supporting actions.

Examples

- Cancel
- Edit
- View Details

Rules

Outlined.

Never compete visually with Primary.

---

## Ghost Button

Purpose

Low priority actions.

Examples

- Back
- Learn More
- View History

Transparent background.

---

## Danger Button

Purpose

Destructive actions.

Examples

Delete Scenario

Delete Report

Remove Business

Uses danger color only.

---

## Loading Button

Disabled while processing.

Always show spinner.

Never allow duplicate submissions.

---

# KPI Cards

Purpose

Display important business metrics.

Examples

Revenue

Cash Runway

Profit Margin

Inventory Turnover

Working Capital

Rules

Large number.

Small title.

Optional trend.

Optional status.

Should be glanceable in under 2 seconds.

---

# Status Cards

Purpose

Communicate business health.

Variants

Healthy

Warning

Critical

Uses semantic colors.

Never use brand accent.

---

# AI Insight Card

Purpose

Display AI interpretation.

Contains

Summary

Explanation

Recommendations

Confidence

Never display raw calculations.

AI explains deterministic outputs only.

---

# Risk Card

Purpose

Highlight detected risks.

Contains

Risk title

Severity

Impact

Suggested Action

Severity

Low

Medium

High

Critical

---

# Decision Card

Purpose

Represent a business decision.

Examples

Increase Price

Hire Employee

Open Branch

Contains

Decision

Expected Outcome

Risk Level

Confidence

---

# Scenario Card

Purpose

Display scenario summary.

Contains

Scenario Name

Business Goal

Assumptions

Expected Profit

Expected Risk

Comparison Button

---

# Comparison Card

Purpose

Compare baseline vs scenario.

Should highlight

Increase

Decrease

No Change

Never rely on color alone.

Always display numerical difference.

---

# Forms

General Rules

Group inputs logically.

Avoid long vertical forms.

Prefer sections.

Always validate immediately.

Never allow impossible values.

---

## Text Input

Use for

Business Name

Owner Name

Store Name

---

## Number Input

Use for

Employees

Revenue

Expenses

Inventory

Never use free text.

---

## Currency Input

Always display currency symbol.

Right aligned.

Supports separators.

---

## Percentage Input

Accepts

0–100

Display %

---

## Dropdown

Use when options are known.

Examples

Business Type

Industry

Province

---

## Date Picker

Use only when historical date matters.

---

## Textarea

Only for notes.

Never for structured data.

---

# Tables

Purpose

Display detailed financial information.

Rules

Dense layout.

Sticky headers.

Sortable.

Searchable.

Pagination when necessary.

Never display large tables without filtering.

---

# Charts

Charts exist to answer questions.

Never as decoration.

---

## Line Chart

Use

Historical trends

Revenue

Profit

Cash

---

## Bar Chart

Use

Comparisons

Expenses

Categories

Scenarios

---

## Pie Chart

Use sparingly.

Only for composition.

Maximum six segments.

---

## Gauge Chart

Use

Business Health

Decision Confidence

Risk Score

---

## Comparison Chart

Purpose

Baseline vs Scenario.

Should clearly show

Current

Future

Difference

---

# Navigation

## Sidebar

Contains only major sections.

Overview

Business

Decision Planner

AI Advisor

Reports

Settings

Active page clearly visible.

Collapsed on tablet/mobile.

---

## Breadcrumb

Only for deep navigation.

Avoid excessive nesting.

---

# Tabs

Use inside pages.

Never replace sidebar.

Maximum five tabs.

---

# Search

Use for

Reports

Scenarios

History

Tables

Should support keyboard focus.

---

# Modals

Use only when necessary.

Examples

Delete Confirmation

Create Scenario

Export Report

Never place long forms inside modal.

---

# Drawer

Preferred over modal for editing.

Especially on desktop.

---

# Toast

Purpose

Short feedback.

Examples

Scenario Saved

Report Exported

Business Updated

Disappear automatically.

Never use for errors requiring action.

---

# Alert

Purpose

Require user attention.

Examples

Simulation Failed

Missing Data

Invalid Financial Values

---

# Empty States

Every page must have one.

Should include

Friendly illustration (optional)

Explanation

Primary Action

Example

"No scenarios yet"

Button

Create Scenario

---

# Loading States

Never show blank pages.

Use

Skeleton loaders

Progress indicators

Loading buttons

Avoid spinners for long pages.

---

# Error States

Always explain

What happened

Why

What user can do

Avoid technical language.

---

# Status Badges

Variants

Healthy

Warning

Critical

Draft

Completed

Archived

Never rely only on color.

Include icon or label.

---

# Tooltips

Use only for

Financial terminology

Advanced metrics

Abbreviations

Keep under two sentences.

---

# Metric Display

Every financial metric should contain

Label

Value

Unit

Trend

Optional explanation

Example

Revenue

฿1,250,000

▲ 8.4%

---

# Confidence Indicator

Unique Wallflower Component.

Displays

Decision Confidence

Data Completeness

Simulation Confidence

Levels

Very High

High

Medium

Low

Very Low

Always explain why.

---

# Component Reuse Rules

Before creating a component ask:

Can an existing component be reused?

If yes

Reuse.

If no

Create reusable component.

Never duplicate UI.

---

# Naming Convention

BusinessCard

MetricCard

RiskCard

AIInsightCard

ScenarioCard

ComparisonCard

DecisionCard

FinancialTable

BusinessHealthGauge

DecisionConfidenceGauge

ScenarioComparisonChart

ExportDialog

DeleteDialog

BusinessForm

ScenarioForm

---

# Components to Avoid

Do NOT build:

Generic Card

Universal Table

Mega Form

All-in-One Modal

Huge Dashboard Widget

They become difficult to maintain.

Build focused components.

---

# Final Principle

Every component should help a retail SME answer one question:

"What does this mean for my business?"

If the component does not improve decision-making,
it probably does not belong in Wallflower.
