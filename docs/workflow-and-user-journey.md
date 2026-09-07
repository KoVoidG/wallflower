# Wallflower — User Journey & System Workflow Specification

> This document defines the **User Journey** and **System Workflow** of **Wallflower**, derived directly from the active codebase.
> 
> * **User Journey**: Structured in a slide-optimized 2-row layout representing the founder's interactive path.
> * **System Workflow**: Formatted as a **horizontal closed-loop decision cycle** to fit widescreen presentation slides.

---

## 1. User Journey (Slide-Optimized 2-Row Layout)

```mermaid
flowchart TB
    %% ── Row 1: Setup, Diagnostics, Simulations & Automation (Left to Right) ──
    subgraph U_ROW_1 ["1️⃣ SETUP, HEALTH DIAGNOSTICS, SIMULATION & AUTOMATION BUILDER"]
        direction LR
        U_START(["👤 User Starts"]):::terminal --> U_ENTER["Access Wallflower<br/><i>(Marketing or Sign In)</i>"]:::process
        U_ENTER --> U_SETUP["Complete Business Setup<br/>• Profile & Industry Type<br/>• Operations & Headcount<br/>• Monthly Financial Snapshot"]:::process
        U_SETUP --> U_DASH["Open Dashboard Cockpit<br/>• Inspect Business Pulse<br/>• Check 4 KPIs & 6-Mo Trends"]:::process
        U_DASH --> U_HEALTH["Explore Business Health<br/>• Review 5 Diagnostic Tabs<br/>• 6 Dimension Scores (0-100)<br/>• Spot Active Risks in Center"]:::process
        
        U_HEALTH --> U_INTENT{"What is User's<br/>Current Goal?"}:::decision
        
        U_INTENT -->|Mitigate Risk| U_RISK["Select Active Risk Alert<br/><i>(e.g., Overdue Receivables)</i>"]:::process
        U_INTENT -->|Plan Growth| U_PLAN["Open Decision Planner<br/><i>(Hiring, Capex, Pricing, etc.)</i>"]:::process
        U_INTENT -->|Build Automation| U_AUTO["Open Automation Builder<br/>• Visual Node Canvas (XYFlow)<br/>• Set Triggers, Capybot AI & Alerts"]:::purpleHighlight
        
        U_RISK --> U_WORKSPACE["Scenario Workspace<br/>Adjust Cost, Salary & Sliders"]:::process
        U_PLAN --> U_WORKSPACE
        
        U_WORKSPACE --> U_RESULTS["Review Simulation Results<br/>• Multi-Case Cash Timelines<br/>• Break-Even Month & ROI %<br/>• Safety Guardrail Alerts"]:::purpleHighlight
        
        U_RESULTS --> U_COMPARE_DEC{"Compare Alternative<br/>Options?"}:::decision
        U_COMPARE_DEC -->|Yes| U_COMPARE["Scenario Comparison View<br/>Loan vs. Cash vs. Lease"]:::process
        U_COMPARE --> U_WORKSPACE
    end

    %% ── Row 2: AI Advisory, Reporting & Decision Execution (Left to Right) ──
    subgraph U_ROW_2 ["2️⃣ AI STRATEGIC ADVISORY, FORMAL REPORTING & EXECUTION"]
        direction LR
        U_AI_DEC{"Consult AI for<br/>Explanation?"}:::decision
        
        U_AI_DEC -->|Quick Verdict| U_CAPYBOT["Ask Capybot AI on Page<br/>• Executive Verdict & Tips<br/>• Attributed Evidence List<br/>• Prioritized Action Checklist"]:::purpleHighlight
        U_AI_DEC -->|Strategic Plan| U_STRATEGIC["Open Strategic Advisor<br/>• Multi-Agent Goal Planner<br/>• 30/60/90-Day Action Plan"]:::purpleHighlight
        U_AI_DEC -->|Skip AI| U_REPORT["Open Report Center<br/>Generate Decision Memo<br/>or Comprehensive Audit"]:::process
        
        U_CAPYBOT --> U_REPORT
        U_STRATEGIC --> U_REPORT
        
        U_REPORT --> U_PDF["Export Print-Ready PDF<br/>Share with Team & Bank"]:::process
        U_PDF --> U_EXECUTE["Execute Real-World Decision<br/>& Record Next Month Actuals"]:::process
        U_EXECUTE --> U_END(["✅ Confident Growth & Protected Runway"]):::terminal
    end

    %% ── Inter-Row Connections ──
    U_COMPARE_DEC ==>|No / Ready| U_AI_DEC
    U_RESULTS -.->|Direct AI Review| U_AI_DEC
    U_AUTO ==>|Deploy Automated Rule| U_AI_DEC

    %% Brand Styling
    classDef terminal fill:#EF4444,stroke:#DC2626,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef process fill:#0F172A,stroke:#6366F1,stroke-width:1.5px,color:#F8FAFC;
    classDef decision fill:#312E81,stroke:#818CF8,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef purpleHighlight fill:#6366F1,stroke:#A5B4FC,stroke-width:2px,color:#FFFFFF,font-weight:bold;
```

---

## 2. System Workflow: Closed-Loop Decision Engine (Horizontal Racetrack Oval)

```mermaid
flowchart TD

    %% ── TOP ROW: 1 → 2 → 3 ──
    subgraph TOP_LANE [" "]
        direction LR

        S1["📥 1. Ingest Business Data<br/>P&L, Cash Reserves &<br/>Profile"]:::process
        S2["🩺 2. Health & Risk Engine<br/>6 Dimensions &<br/>Priority Alerts"]:::process
        S3["🔀 3. What-If Sim Engine<br/>Multi-Case Projections &<br/>Guardrails"]:::purpleHighlight

        S1 --> S2 --> S3
    end

    %% ── BOTTOM ROW: 6 ← 5 ← 4 ──
    subgraph BOTTOM_LANE [" "]
        direction RL

        S4["🧠 4. Capybot AI Strategy<br/>Gemini Reasoning &<br/>Action Roadmap"]:::purpleHighlight
        S5["📋 5. Decision Memos & PDF<br/>1-Page Formal Records for<br/>Team/Bank"]:::process
        S6["🔄 6. Closed-Loop Sync<br/>Updates Baseline for<br/>Next Cycle"]:::process

        S4 --> S5 --> S6
    end

    %% ── CORNER TURNS ──
    S3 ==> |"Pass Decision Context"| S4
    S6 ==> |"Sync Next Month Actuals"| S1

    %% ── BRAND STYLING ──
    classDef process fill:#0F172A,stroke:#6366F1,stroke-width:2px,color:#F8FAFC;
    classDef purpleHighlight fill:#6366F1,stroke:#A5B4FC,stroke-width:2px,color:#FFFFFF,font-weight:bold;

    style TOP_LANE fill:transparent,stroke:none;
    style BOTTOM_LANE fill:transparent,stroke:none;
```

---

## 3. Product Architecture Mapping Reference

| Component in Diagrams | Source of Truth in Codebase | Purpose in Application |
| :--- | :--- | :--- |
| **Business Setup & Snapshot** | `src/features/business-profile/` | Ingests business profile, operations, inventory, and monthly financial snapshots with data quality confidence tags. |
| **Dashboard Cockpit** | `src/features/dashboard/` | Displays real-time Business Pulse status, 4 top KPIs *(Revenue, Runway, Margin, Burn)*, 6-month trends, and prioritized alerts. |
| **Health Diagnostics & Risk Center** | `src/features/business-health/` | Evaluates 6 health dimensions *(Profitability, Liquidity, Solvency, Working Capital, Efficiency, Growth)* and 5 rule-based risk triggers with Baht exposure. |
| **Deterministic Simulation Engine** | `src/features/simulations/engine/` | Calculates multi-case projections *(Expected, Optimistic, Conservative)*, 12-month cash timeline, break-even month, ROI %, and safety guardrails. |
| **Scenario Comparison** | `src/features/simulations/components/compare-simulations-view.tsx` | Aligns multiple scenario outcomes side-by-side *(e.g., Bank Loan vs. Outright Cash vs. Lease)* to evaluate trade-offs. |
| **Automation Workflow Builder** | `src/features/automation/` | Interactive node canvas *(React Flow / XYFlow)* for creating custom automated workflows with triggers, threshold checks, Capybot AI synthesis, auto-simulations, and notification alerts. |
| **Capybot AI Advisor** | `src/features/advisor/` & `src/lib/liquiflow-ai.ts` | Context-aware AI companion powered by Google Gemini 2.5 Flash providing plain-language verdicts, evidence attribution, and action checklists. |
| **Strategic Advisor Workspace** | `src/features/advisor/components/strategic-advisor-workspace.tsx` | Full-page strategic planning center with multi-agent workflow orchestration for 30/60/90-day organizational roadmaps. |
| **Report Center & Decision Memos** | `src/features/reports/` | Compiles verified metrics, multi-case simulations, and AI action roadmaps into 4 executive report blueprints with print-ready PDF export. |
