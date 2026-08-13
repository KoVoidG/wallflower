---
version: beta
name: Executive Decision Intelligence
description: Premium enterprise interface for AI-assisted business planning and deterministic financial analysis.

colors:
  primary: '#F2F4F7'
  secondary: '#98A2B3'
  tertiary: '#00D395'

  neutral: '#0B0E13'
  surface: '#141820'
  surface-hover: '#1B202A'
  surface-active: '#232A36'

  border: '#2A3240'

  success: '#00D395'
  warning: '#F5B942'
  danger: '#FF5C5C'
  info: '#4FA8FF'

  on-primary: '#0B0E13'

typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 3.25rem
    fontWeight: 700
    letterSpacing: '-0.035em'

  h1:
    fontFamily: Space Grotesk
    fontSize: 2rem
    fontWeight: 600

  h2:
    fontFamily: Space Grotesk
    fontSize: 1.4rem
    fontWeight: 600

  h3:
    fontFamily: Space Grotesk
    fontSize: 1.1rem
    fontWeight: 600

  body:
    fontFamily: Inter
    fontSize: 0.95rem
    lineHeight: 1.6

  caption:
    fontFamily: Inter
    fontSize: 0.8rem
    color: '{colors.secondary}'

  metric:
    fontFamily: JetBrains Mono
    fontSize: 1rem
    fontWeight: 600

  label:
    fontFamily: JetBrains Mono
    fontSize: 0.72rem
    letterSpacing: '0.05em'

rounded:
  sm: 4px
  md: 8px
  lg: 14px
  xl: 20px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px

elevation:
  level1:
    background: '{colors.surface}'

  level2:
    background: '{colors.surface-hover}'

  level3:
    background: '{colors.surface-active}'

components:
  button-primary:
    backgroundColor: '{colors.tertiary}'
    textColor: '{colors.on-primary}'
    rounded: '{rounded.md}'
    padding: 12px 22px"

  button-secondary:
    backgroundColor: transparent
    borderColor: '{colors.border}'
    textColor: '{colors.primary}'

  card:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.lg}'
    padding: 24px

  metric-card:
    emphasizeValue: true
    valueFont: metric
    titleFont: caption

  ai-panel:
    backgroundColor: '{colors.surface-hover}'
    borderLeft: '4px solid {colors.info}'

  risk-card:
    success: '{colors.success}'
    warning: '{colors.warning}'
    danger: '{colors.danger}'

  table:
    striped: false
    dense: true
    borderColor: '{colors.border}'

  sidebar:
    width: 280px
    activeIndicator: '{colors.tertiary}'
---
