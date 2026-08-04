# Reports

## Purpose

The Reports module transforms completed simulations into professional decision reports that business owners can review, share, and export.

Unlike the Decision Planner, Reports is a read-only module. Users do not edit business variables here—they review finalized business analyses.

Reports are automatically generated after every successful simulation.

---

# Core Philosophy

Every completed simulation generates one Decision Report.

A Decision Report is a snapshot of:

- Business decision
- Financial outcomes
- Business Health
- Risk assessment
- AI explanation
- Strategic recommendations

Reports are immutable records.

If a scenario is re-simulated, a new report is generated instead of modifying the previous one.

---

# Navigation

Reports

├── Report Library
└── Report Viewer

Export is NOT a page.

Export is accessed through a modal/popover inside the Report Viewer.

---

# User Journey

## Step 1

User opens Reports.

Landing page is Report Library.

Shows every generated report.

Example

Price Increase +5%

Hire Employee

Holiday Promotion

Expand Inventory

Open New Branch

Newest reports appear first.

---

## Step 2

User opens a report.

Report Viewer opens.

Displays the complete decision report.

Includes

Executive Summary

Business Health

KPIs

Charts

Risk Analysis

AI Insights

Recommendations

Confidence Score

The report is read-only.

---

## Step 3

If the user wants to share the report,

they click

Export

An Export popover appears.

Options

PDF

Excel

Print

Users select options and export.

The user remains on the same page.

---

# Report Library

## Purpose

Central repository of every generated Decision Report.

---

## Layout

Header

Reports

Search

Filters

Sort

---

Report Cards

Each report displays

- Report Name
- Scenario Name
- Report Type
- Business Health
- Confidence
- Generated Date
- Time Horizon

Quick Actions

- Open
- Export
- Delete

---

## Search

Search by

- Report Name
- Scenario Name

---

## Filters

- All Reports
- High Confidence
- Medium Confidence
- Low Confidence

---

## Sorting

Newest First

Oldest First

Business Health

Confidence

Alphabetical

---

## Empty State

No reports generated yet.

Run your first simulation to create a Decision Report.

---

# Report Viewer

## Purpose

Display a complete business decision report.

This is the primary page inside Reports.

---

## Sections

### Report Header

Contains

- Report Name
- Scenario Name
- Generated Date
- Time Horizon
- Report Status

Actions

Export

Print

Delete

---

### Executive Summary

Short AI-generated overview.

Example

Increasing prices by 5% is expected to improve profitability while maintaining a healthy cash position.

---

### Business Health

Overall score

Health badge

Comparison with baseline

---

### KPI Summary

Includes

Revenue

Profit

Cash Runway

Working Capital

Inventory Turnover

ROI

Business Health

---

### Charts

Revenue Projection

Profit Projection

Cash Balance

Inventory Trend

---

### Risk Assessment

Overall Risk

Risk Score

Risk Categories

Financial Risk

Operational Risk

Inventory Risk

Market Risk

---

### AI Insights

Business explanation

Trade-offs

Strategic recommendations

Potential concerns

Confidence explanation

---

### Report Metadata

Scenario

Simulation Date

Generated Date

Business

Time Horizon

AI Model Version

---

# Export

Export is accessed through a popover.

It is NOT a separate page.

---

## Export Formats

PDF

Excel

Print

---

## Export Options

Include Charts

Include AI Insights

Include Risk Analysis

Include Assumptions

---

## Layout Options

Paper Size

A4

Letter

Orientation

Portrait

Landscape

---

## Actions

Cancel

Export Report

---

# Report Types

Decision Report

Generated after every simulation.

Comparison Report

Generated after comparing multiple simulated scenarios.

Future report types may be added later.

---

# Report Lifecycle

Simulation Completed

↓

Decision Report Generated

↓

Stored in Report Library

↓

Viewed

↓

Exported (optional)

↓

Archived or Deleted

---

# Relationship with Decision Planner

Decision Planner creates simulations.

Reports display simulation outcomes.

Reports never modify scenarios.

Every report is linked to exactly one simulation (or one comparison report).

---

# UX Principles

Reports are read-only.

Users should never edit financial data inside Reports.

Decision reports should resemble professional executive briefs rather than dashboards.

Export should be frictionless and always accessible from the Report Viewer.

The Report Library should function like a document library, allowing users to quickly locate, review, and share previous reports.
