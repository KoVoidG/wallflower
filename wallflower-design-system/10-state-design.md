# 10 — State Design

Every data-driven feature must define states before implementation. Do not design only the ideal populated screen.

## State anatomy

Each state should specify:

- title
- explanation
- impact on current analysis
- primary action
- secondary action when useful
- visual treatment
- accessibility announcement where needed

## Loading states

### Page loading

Use skeletons only for stable content structure. Preserve page header and navigation.

### Simulation loading

Use `CalculationSequence`:

1. Reading baseline
2. Applying assumptions
3. Calculating scenarios
4. Testing sensitivity
5. Preparing recommendation

Announce completion or failure.

### Report generation

Explain which sections are being prepared. Do not imply a report is complete before export succeeds.

## Empty business data

Title:

> Add business data to create your baseline

Explanation:

> Wallflower needs revenue, operating expenses, and available cash before it can calculate runway or test decisions.

Primary action: `Add business data`

Optional secondary action: `Use sample business`

## Partial business data

Show:

- what can be calculated
- what cannot be calculated
- confidence impact
- missing fields

Example:

> Runway can be estimated, but working-capital risk is incomplete because receivables and payables are missing.

Primary action: `Complete missing data`

## Stale data

Show a visible freshness warning near outputs.

Example:

> Results use data through 30 May 2026. Revenue and expense data may no longer represent the current business.

Actions:

- `Update data`
- `Continue with stale data` when safe, with visible disclaimer

## Mixed data freshness

Identify which source is stale. Do not label the entire dataset current because one source updated.

## No risks detected

Avoid implying guaranteed safety.

Title:

> No material risks detected in the available data

Explanation:

> Current checks did not identify a risk above the alert threshold. Continue monitoring data freshness and upcoming obligations.

Primary action: `Review health details`

## No simulations

Title:

> Test a decision before acting

Explanation:

> Compare expected, best, and worst outcomes for hiring, pricing, inventory, financing, or another business change.

Primary action: `Test a decision`

Provide one realistic sample.

## Simulation draft

Show incomplete stage, last saved time, missing assumptions, and `Continue setup`.

## Simulation failure

State:

- what prevented calculation
- whether assumptions were saved
- whether partial results exist
- exact recovery action

Example:

> The simulation could not calculate cash runway because monthly expense data is missing. Your decision assumptions were saved.

Actions:

- `Add expense data`
- `Use an estimate`

## Low-confidence result

Keep the result visible but label limitations prominently.

Show:

- missing or estimated inputs
- which conclusion may change
- action to improve confidence

Do not hide the result behind a generic warning modal.

## No reports

Explain report value and available types. Primary action: `Generate first report`.

## Outdated report

Show:

- original data-through date
- newer data availability
- whether report conclusions may have changed
- `Regenerate report`

## AI unavailable

The financial engine and historical calculated evidence should remain accessible.

Title:

> AI explanation is temporarily unavailable

Explanation:

> Calculated results remain available. Wallflower could not generate the plain-language interpretation.

Action: `Try explanation again`

Do not block the entire result page.

## Integration disconnected

Show:

- affected source
- last successful sync
- affected calculations
- reconnect action

## Permission denied

Explain required role and safe next action. Do not reveal hidden business data.

## Error states

### Inline field error

- appears near field
- specific correction
- preserve value

### Section error

- keep unaffected sections available
- show retry action

### Page error

- preserve shell
- explain whether data is safe
- provide retry and navigation action

## Success states

Success messages should confirm what changed and where to go next.

Weak:

> Success!

Better:

> Business data updated through 18 July 2026. Runway and risk calculations have been refreshed.

## Destructive confirmation

Name the object and consequence.

Example:

> Delete “Hire two sales staff” simulation? This removes the saved assumptions and result comparison. It will not change business data.

Use red only on the final destructive action.

## Offline or network interruption

When supported:

- preserve local form values
- show save status
- disable actions requiring server calculation
- retry automatically only when safe
- never claim a simulation was saved without confirmation
