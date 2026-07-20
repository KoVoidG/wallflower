# 05 — Motion System

## Purpose

Motion should explain hierarchy and state change. It must not decorate serious financial content.

Use Motion for React where motion materially improves understanding.

## Motion principles

Motion should:

- connect simulator input to resulting impact
- show calculation stages
- establish route and panel hierarchy
- reduce perceived loading time
- make the marketing product demonstration memorable
- clarify expanded and collapsed evidence

Motion should not:

- delay task completion
- animate every hover target
- bounce warnings
- continuously move financial values
- imply certainty or success
- cause motion sickness

## Timing

| Interaction | Duration |
|---|---:|
| Hover and press | 120–160ms |
| Tooltip or popover | 140–180ms |
| Card or panel transition | 180–240ms |
| Drawer or dialog | 220–300ms |
| Page content reveal | 280–420ms |
| Simulation result sequence | 400–650ms |

Preferred easing:

```ts
[0.22, 1, 0.36, 1]
```

Restrained spring:

```ts
{
  stiffness: 260,
  damping: 28,
  mass: 0.8
}
```

## Route transitions

- preserve application shell
- fade and translate page content by no more than 8–12px
- do not animate sidebar width on every navigation
- active indicator may move between routes
- focus must move to the new page heading after navigation when appropriate

## Simulator input feedback

When a user changes an assumption:

1. highlight the changed field briefly
2. update the affected metric in the live preview
3. show the delta from the previous value
4. update confidence when data quality changes
5. avoid animating unrelated metrics

Recommended transition: 180–240ms cross-fade or number replacement. Do not count through every intermediate value.

## Simulation run sequence

Required sequence:

1. Lock editable assumptions.
2. Summarize the decision in plain language.
3. Show calculation stages:
   - Reading baseline
   - Applying assumptions
   - Calculating scenarios
   - Testing sensitivity
   - Preparing recommendation
4. Transition to results.
5. Reveal verdict first.
6. Reveal primary consequence and sensitivity second.
7. Reveal scenario and detailed analysis last.

Do not show fake percentages unless the backend exposes meaningful progress.

## Result transitions

When switching scenarios:

- cross-fade lines or bars
- preserve axes and scale
- update labels and values together
- keep baseline stable
- duration 180–300ms

When comparing saved simulations, animate only changed rows or marks.

## Expand and collapse

Risk evidence and assumption detail may expand using height and opacity.

- duration: 180–240ms
- keep trigger in place
- preserve focus
- do not collapse critical summary information

## Landing motion

Allowed:

- Wallflower mark forming from data points
- headline reveal by line, not letter
- product preview responding subtly to scroll or pointer
- workflow demonstrating diagnosis → simulation → action
- scenario lines changing after a visible assumption changes

Forbidden:

- continuous background particles
- endless floating cards
- parallax that harms reading
- dramatic 3D effects unrelated to the product

## Loading states

Use skeletons only when content shape is known and waiting is brief.

For analytical operations, prefer meaningful progress labels. A simulation loader should look different from a report loader.

## Error motion

- do not shake entire forms
- move focus to the error summary
- use subtle local emphasis on the affected field
- serious failures should appear immediately, not after an animation delay

## Reduced motion

When `prefers-reduced-motion: reduce` is active:

- replace movement with instant state changes or short fades
- disable pointer parallax
- disable count-up effects
- preserve progress text
- preserve focus transitions
- do not remove meaningful state feedback

## Framer Motion implementation guardrails

- use shared variants for repeated transition types
- avoid per-component arbitrary easing and timing
- do not animate layout for large data tables
- do not use spring animation for financial values
- stop animation after first reveal
- test route changes with keyboard and screen readers

## Motion QA

Every animation must answer one of these:

- What changed?
- Where did this content come from?
- What is happening now?
- What should the user notice first?

Remove any animation that cannot answer one.
