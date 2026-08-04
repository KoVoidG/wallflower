# settings.md

# Settings Architecture

## Purpose

The Settings module is the central location for configuring the user's account, business profile, simulation preferences, security, subscription, and business data.

Unlike the Business module, which focuses on analyzing the business, Settings is responsible for configuring and maintaining everything Wallflower needs to operate correctly.

Settings should feel administrative rather than analytical.

---

# Design Principles

- Organize settings by responsibility.
- Never mix business analytics with configuration.
- Keep navigation persistent.
- Changes should be immediately understandable.
- Dangerous actions must always require confirmation.
- Every setting should have a clear description.

---

# Navigation

Settings

├── Profile & Account
├── Business Profile
├── Business Data
├── Simulation Settings
├── Notifications
├── Appearance & Language
├── Data & Privacy
├── Security
└── Plan & Billing

---

# Layout

Settings

---

Header

Settings

Manage your account, business configuration, simulations, and security.

---

Left Navigation

Profile & Account

Business Profile

Business Data

Simulation Settings

Notifications

Appearance & Language

Data & Privacy

Security

Plan & Billing

---

Right Content

Selected settings page

---

Save button always remains visible.

Unsaved changes should be indicated.

---

# 1. Profile & Account

Purpose

Manage personal account information.

Sections

## Personal Information

Profile Photo

Display Name

Preferred Name

Email

Phone Number

Role

Time Zone

Country

Language

Account Created

---

## Login Information

Email

Linked Login Providers

Google

Microsoft

Password Status

---

## Account Actions

Change Email

Change Password

Delete Account

---

# 2. Business Profile

Purpose

Configure business identity.

This replaces editing onboarding information.

Sections

## Business Information

Business Name

Business Category

Business Size

Business Age

Store Type

Number of Branches

Business Description

Business Logo

---

## Operating Information

Opening Hours

Operating Days

Employees

Average Daily Customers

Average Daily Transactions

Suppliers

---

## Regional Settings

Currency

Tax Rate

Fiscal Year

Locale

---

# 3. Business Data

Purpose

Maintain the baseline business data used by simulations.

This is where users without POS or accounting software manage their business records.

This page becomes the "manual bookkeeping" center.

---

## Financial Snapshot

Monthly Revenue

Operating Expenses

Payroll

Rent

Utilities

Marketing

Other Expenses

Cash on Hand

Bank Balance

Outstanding Loans

Gross Margin

Net Margin

---

## Inventory

Inventory Value

Product Categories

Inventory Turnover

Restock Frequency

Dead Stock

Supplier Lead Time

Inventory Shortage Frequency

---

## Business Operations

Operating Hours

Employees

Average Customers

Average Transactions

---

## Historical Records

Monthly Financial Records

Revenue History

Expense History

Cash Balance History

Inventory Value History

Users can

Add Month

Edit Month

Delete Month

This historical data continuously improves simulation accuracy.

---

# 4. Simulation Settings

Purpose

Configure how Wallflower performs simulations.

Sections

## Global Assumptions

Expected Demand Trend

Supplier Cost Trend

Inflation

Interest Rate

Tax Rate

Exchange Rate

Seasonality

Inventory Growth

Market Competition

---

## Confidence Settings

Use Estimated Values

Allow Partial Simulations

Warn About Missing Data

---

## Default Scenario Settings

Default Time Horizon

Default Currency

Default Confidence Threshold

---

## Reset

Restore Default Simulation Settings

---

# 5. Notifications

Purpose

Control system notifications.

Sections

Email Notifications

Simulation Completed

Reports Generated

AI Recommendations

Business Health Alerts

Security Alerts

Billing

---

In-App Notifications

Enable

Disable

---

Reminder Frequency

Daily

Weekly

Monthly

---

# 6. Appearance & Language

Purpose

Personalize the interface.

Sections

Appearance

Light

Dark

System

---

Accent Color

(Default uses Wallflower green.)

---

Language

English

Thai

Future languages

---

Date Format

Time Format

Number Format

Currency Display

---

Accessibility

Reduce Motion

Compact Layout

Large Text

---

# 7. Data & Privacy

Purpose

Manage personal and business data.

Sections

## Data Export

Download

Business Data

Simulation Data

Reports

Account Data

---

## Data Management

Archive Business

Delete Business

Delete Reports

Delete Simulations

Delete Historical Records

---

## Privacy

Analytics

Crash Reports

AI Usage Consent

Personalized Recommendations

---

## Legal

Privacy Policy

Terms of Service

Licenses

---

# 8. Security

Purpose

Protect the account.

Sections

Password

Two-Factor Authentication

Login Sessions

Recent Devices

Trusted Devices

Recovery Email

Recovery Codes

---

Security Log

Recent Logins

Password Changes

Suspicious Activity

---

Danger Zone

Sign Out All Devices

Delete Account

---

# 9. Plan & Billing

Purpose

Manage subscription.

Sections

Current Plan

Free

Pro

Business

Renewal Date

Usage

Simulation Credits

Reports Generated

Storage Usage

Businesses Managed

---

Billing Information

Payment Method

Invoices

Billing History

Tax Information

---

Upgrade

Downgrade

Cancel Subscription

---

# Business Data Philosophy

Business Data is intentionally placed inside Settings.

Reason

Business is responsible for analysis and visualization.

Settings is responsible for maintaining the data that powers those analyses.

Users update financial records here.

Overview, Business, Decision Planner, AI Advisor, and Reports consume this data.

This creates a single source of truth throughout Wallflower.

---

# Data Flow

Onboarding

↓

Business Data

↓

Business Health

↓

Decision Planner

↓

Simulation

↓

Reports

Every module reads from Business Data.

Only Settings modifies the baseline business records.

---

# UX Rules

Settings never contains dashboards.

Settings never performs business analysis.

Every section should fit within a scrollable page.

Navigation remains fixed while content changes.

Dangerous actions require confirmation.

Business Data supports manual entry for businesses without external systems.

All settings changes are reversible unless explicitly destructive.

The Save Changes button is only enabled when modifications are detected.

Auto-save should not be used for administrative settings.
