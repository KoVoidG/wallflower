# Wallflower — Simulation Architecture Plan

## 1. Purpose

The Simulation workspace is Wallflower's **decision laboratory**.

It should allow users to:

1. View previous simulations
2. Create and run What-If scenarios
3. Identify and analyze operational bottlenecks
4. Compare multiple possible decisions
5. Move from simulation → recommendation → report → automation

The existing simulation logic, calculations, and functionality should be preserved.

This plan focuses on organizing and presenting the existing functionality into a coherent product architecture.

---

# 2. Simulation Navigation

Simulation should be one main section in the sidebar.

Inside the Simulation workspace, use four tabs:

```text
SIMULATIONS

[ Library ] [ What-If Scenario ] [ Bottleneck ] [ Comparison ]

These are the only four primary simulation tabs.

Tab responsibilities
Tab	Purpose
Library	Simulation history and saved simulations
What-If Scenario	Simulate business decisions
Bottleneck	Analyze operational constraints
Comparison	Compare simulation outcomes

Do not create separate top-level tabs for individual algorithms or technical simulation engines.

3. Simulation Workspace Layout

All four tabs should share the same general shell:

┌─────────────────────────────────────────────────────────┐
│ Simulations                                             │
│ Short description                                       │
│                                                         │
│ Library | What-If | Bottleneck | Comparison             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    ACTIVE TAB                           │
│                                                         │
└─────────────────────────────────────────────────────────┘

The tab navigation stays consistent while the content changes.

4. Library
Purpose

The Library is the user's simulation history.

It contains previously created:

What-If simulations
Bottleneck analyses
Comparisons
Saved/draft simulations
Structure
Library


Search simulations
Filter by type
Filter by status
Sort by recent / oldest / impact


Recent Simulations

Each simulation should show:

Simulation Name
Simulation Type


Short description


Key Result
Risk / Status


Created date
Last updated


[ Open ]

Example:

Increase Prices by 5%
WHAT-IF


Pricing strategy simulation


Projected Profit     +10.2%
Risk                 Moderate


Aug 15, 2026
[ Open Simulation ]
Library actions

Users should be able to:

Open
Duplicate
Rename
Delete/archive
Continue editing a draft
Compare with another simulation
Empty state

If there are no simulations:

No simulations yet.


Explore a business decision or analyze an operational
bottleneck to begin.


[ Create What-If Scenario ]
[ Analyze Bottleneck ]
5. What-If Scenario
Purpose

What-If is the main financial/business decision simulator.

It answers:

"What happens to my business if I make this decision?"

Examples:

Increase prices
Hire employee
Increase marketing
Reduce expenses
Increase inventory
Reduce inventory
Take a loan
Change operating costs
What-If Page Structure
Scenario Header
        ↓
Scenario Inputs
        ↓
Projected Business Impact
        ↓
Financial Impact
        ↓
Operational Impact
        ↓
Scenario Outcomes
        ↓
Risk & Assumptions
        ↓
Wallflower Recommendation
        ↓
Next Actions
5.1 Scenario Header

Show:

Increase Prices by 5%


Pricing Strategy
What happens if average selling price increases by 5%?


[ Edit Scenario ]     [ Run Simulation ]

Also show:

Scenario type
Status
Last run
Saved/draft state
6. What-If Inputs

The user should define the variables that control the simulation.

Example:

Decision Parameters


Price Change
[-5% ───────●──────── +20%]


Expected Demand Change
[-20% ──●──────────── +20%]


Effective Date
[ September 1 ]

Inputs should be grouped logically.

Do not scatter controls across the page.

7. What-If Results

The most important result should appear immediately after the inputs.

Projected Business Impact

Show a small number of high-value metrics.

Projected Business Impact


Revenue       Profit       Cash Flow       Runway


+4.1%         +10.0%       +12.4%          +0.5 mo


฿1.34M        ฿212K        ฿154K            10.1 mo

The purpose is to immediately answer:

"Is this decision good or bad for my business?"

8. Financial Impact

Show how the decision changes the business financially.

Use:

Current vs projected revenue
Current vs projected profit
Cash flow
Margin
Runway

Prefer visual comparisons:

Current ─────────────→ Projected


Revenue
฿1.24M                ฿1.34M


Profit
฿192K                 ฿212K


Margin
31%                   34%

The visualization should emphasize change, not just the final number.

9. Operational Impact

Show how the scenario affects operations.

Example:

Operational Impact


Processing       64% → 69%
Fulfillment      72% → 81%
Capacity         78% → 86%


Operational Risk
Moderate

If the scenario changes workflow/headcount/capacity, provide:

[ View Workflow Impact ]

This opens the more detailed workflow/3D visualization.

10. 3D Simulation

Existing 3D simulation functionality should be preserved.

However:

3D should not be the primary way users understand the simulation.

Default:

Financial Impact
Operational Impact
Current → Projected

Advanced:

[ View Advanced 3D Simulation ]

The 3D visualization is for exploration and deeper understanding.

It should not dominate the page.

11. Scenario Outcomes

Show:

Best Case       Expected       Worst Case


+18%            +10%           -2%
Profit          Profit         Profit

The user should quickly understand the range of possible outcomes.

12. Risk & Assumptions

Show important assumptions and risks.

Example:

Decision Risk


MODERATE


Main Risk
Demand may decrease after the price increase.


Key Assumption
Demand elasticity = -2%


Potential Impact
Revenue growth may be lower than expected.

Technical calculations should not dominate this section.

13. Wallflower Recommendation

Every completed simulation should end with a recommendation.

Example:

WALLFLOWER RECOMMENDATION


✓ Recommended


Increase prices by 5%.


The simulation projects improved margins and cash
generation while keeping estimated demand risk
within an acceptable range.


[ Generate Report ]
[ Save Scenario ]
[ Compare Alternatives ]

If not recommended:

NOT RECOMMENDED


The projected improvement does not justify the
increase in risk.


[ Compare Alternatives ]
14. Bottleneck
Purpose

Bottleneck is the operational analysis workspace.

It answers:

"Where is my business constrained, why is it happening, and what can I do about it?"

15. Bottleneck Page Structure
Bottleneck Summary
        ↓
Bottleneck Ranking
        ↓
Workflow
        ↓
Bottleneck Impact
        ↓
Possible Improvements
        ↓
Simulation
        ↓
Recommendation
16. Bottleneck Summary

Immediately show the primary constraint.

Example:

Primary Bottleneck


Vendor Invoice Processing


Utilization
51.6%


WIP
273


Severity
HIGH


[ Simulate Improvement ]

The user should know the problem immediately.

17. Bottleneck Ranking

Show the most important bottlenecks in order.

01  Vendor Invoice Processing
    Utilization: 51.6%
    HIGH


02  Finance Approval
    Pending: 23
    MEDIUM


03  IT Support
    Cycle Time: 9.3h
    MEDIUM

Clicking an item should display its detailed analysis.

18. Bottleneck Workflow

Show the operational process visually.

Example:

Orders
   ↓
Processing
   ↓
Fulfillment
   ↓
Delivery

Each stage can show:

Utilization
Throughput
Queue/WIP
Cycle time
Severity

The bottleneck should be visually obvious.

19. Bottleneck 3D

Existing Bottleneck3D functionality should remain available.

Use:

[ Overview ] [ Workflow ] [ Advanced 3D ]

The default should be the simple workflow.

3D is an advanced exploration mode.

20. Bottleneck Impact

Show the business consequence of the bottleneck.

Example:

Current Throughput
29 / week


Potential Throughput
47 / week


Potential Recovery
+62%

Then show:

Cycle Time       -18%
WIP              -31%
Throughput       +62%

The user should understand why fixing the bottleneck matters.

21. Bottleneck Improvements

Show possible solutions.

Possible Improvements


01
Add input validation


Expected Impact
↓ Defects


[ Simulate ]




02
Delegate approval authority


Expected Impact
↓ Queue Time


[ Simulate ]




03
Reduce low-value meetings


Expected Impact
+7 hrs/week


[ Simulate ]

Clicking Simulate should create/open a What-If scenario based on that improvement.

This connects Bottleneck → What-If.

22. Bottleneck Methodology

Technical methodology should be available but secondary.

Use:

Analysis Details ▾

Inside:

Little's Law
M/M/1
Theory of Constraints
Lean Six Sigma
Benchmarking

The user sees the business conclusion first.

Technical calculations are available for transparency.

23. Comparison
Purpose

Comparison answers:

"Which decision should I choose?"

It combines results from multiple simulations.

24. Comparison Structure
Scenario Selection
        ↓
Overall Comparison
        ↓
Financial Comparison
        ↓
Operational Comparison
        ↓
Risk Comparison
        ↓
Trade-offs
        ↓
Wallflower Pick
25. Scenario Selection

Allow users to select existing simulations.

Example:

Compare


☑ Hire 1 Employee
☑ Increase Prices +5%
☑ Do Nothing


[ Compare ]

The simulations should come from the Library/current simulation history.

26. Comparison Results

Use the most important metrics.

Example:

                Hire Employee   Raise Price   Do Nothing


Revenue             +9.8%          +4.1%          0%


Profit             +14.6%         +10.0%          0%


Cash Flow            +8.2%         +12.4%          0%


Risk                 Medium        Moderate       Low

Use visual bars/deltas where appropriate.

Avoid making the entire page feel like a spreadsheet.

27. Decision Score

If an overall score exists, show the components behind it.

Example:

Overall Decision Score


Hire Employee       89
Increase Prices     85
Do Nothing          78

Then:

Financial     Risk     Operations


92            72          88

The user should understand why one scenario wins.

28. Trade-offs

Make trade-offs explicit.

Example:

Hire Employee


✓ Higher capacity
✓ Higher revenue potential
✕ Additional monthly cost




Increase Prices


✓ Higher margin
✓ Low implementation cost
✕ Demand risk

This makes comparison useful for actual decision-making.

29. Wallflower Pick

The comparison should end with the recommended option.

WALLFLOWER PICK


✓ Hire 1 Employee


Best balance of financial improvement,
operational capacity, and risk.


[ View Scenario ]
[ Generate Report ]
30. Cross-Tab Connections

The four tabs must work together rather than feeling like separate features.

Business Health → Bottleneck

If Business Health detects an operational issue:

Operational Risk Detected


Fulfillment bottleneck detected.


[ Analyze Bottleneck ]
Bottleneck → What-If

When a bottleneck is found:

Primary Bottleneck
Fulfillment


Possible Solutions


[ Hire Employee ]
[ Increase Capacity ]
[ Automate Processing ]

Selecting a solution opens a What-If simulation.

What-If → Comparison

After running a scenario:

[ Compare Alternatives ]

opens Comparison with the current scenario selected.

Comparison → Report
[ Generate Report ]

creates a decision report based on the comparison.

Report → Automation

If the decision can be operationalized:

[ Create Automation ]

moves the user into Automation.

31. Overall Simulation Flow

The complete system should feel like:

                 BUSINESS HEALTH
                       ↓
                Problem detected
                       ↓
                 BOTTLENECK
                       ↓
                Find solutions
                       ↓
                 WHAT-IF
                       ↓
              Simulate each option
                       ↓
                 COMPARISON
                       ↓
                Choose decision
                       ↓
                   REPORT
                       ↓
                 AUTOMATION
32. Architecture Principle

Simulation is not just a collection of calculators.

It is Wallflower's decision-making workflow.

The user journey should always move toward:

Problem
  ↓
Analysis
  ↓
Simulation
  ↓
Comparison
  ↓
Decision
  ↓
Action
33. What NOT to Do

Do not:

Create more simulation categories unless genuinely necessary
Put Automation inside Simulation
Create separate tabs for individual algorithms
Make 3D visualizations the main UI
Duplicate simulation logic between What-If and Bottleneck
Create isolated features that cannot connect to the rest of Wallflower
Replace working calculation logic just for UI changes
Add fake metrics or fake data
Make every result a separate card
34. Final Simulation Architecture
SIMULATIONS
│
├── Library
│   ├── What-If History
│   ├── Bottleneck History
│   ├── Comparison History
│   └── Saved / Draft Simulations
│
├── What-If Scenario
│   ├── Inputs
│   ├── Business Impact
│   ├── Financial Impact
│   ├── Operational Impact
│   ├── Scenario Outcomes
│   ├── Risk & Assumptions
│   └── Recommendation
│
├── Bottleneck
│   ├── Bottleneck Summary
│   ├── Bottleneck Ranking
│   ├── Workflow
│   ├── Advanced 3D View
│   ├── Bottleneck Impact
│   ├── Improvements
│   └── Simulation
│
└── Comparison
    ├── Scenario Selection
    ├── Overall Results
    ├── Financial Comparison
    ├── Operational Comparison
    ├── Risk Comparison
    ├── Trade-offs
    └── Wallflower Pick
Core rule

Keep the existing simulation intelligence. Reorganize the experience around the user's decision journey.

The four tabs should feel like four stages of the same system:

Library = Remember

What-If = Explore

Bottleneck = Diagnose

Comparison = Decide
```
