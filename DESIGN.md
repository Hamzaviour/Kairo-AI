---
name: Kairo
description: A calm, secure, AI-assisted task workspace that replaces shared Excel trackers. Do the right work at the right moment.
colors:
  ink-950: "#0b0c10"
  ink-900: "#13151a"
  ink-800: "#1f2229"
  ink-700: "#343841"
  ink-600: "#4a505b"
  ink-500: "#646b78"
  ink-400: "#9097a3"
  ink-300: "#c9cdd5"
  ink-200: "#e3e5ea"
  ink-100: "#f0f1f4"
  ink-50: "#f7f8fa"
  paper: "#ffffff"
  saffron-50: "#fff8eb"
  saffron-100: "#ffefcc"
  saffron-200: "#ffdd94"
  saffron-300: "#ffc95c"
  saffron-400: "#ffb224"
  saffron-500: "#f29a00"
  saffron-600: "#c97c00"
  saffron-700: "#9a5d00"
  state-sky: "#0284c7"
  state-violet: "#7c3aed"
  state-orange: "#c2410c"
  state-rose: "#e11d48"
  state-emerald: "#059669"
typography:
  display:
    fontFamily: "Funnel Display, Geist, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 7vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Funnel Display, Geist, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Funnel Display, Geist, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  ui:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
  meta:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "112px"
  container: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.paper}"
    typography: "{typography.ui}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-primary-hover:
    backgroundColor: "{colors.ink-800}"
  button-primary-on-ink:
    backgroundColor: "{colors.saffron-400}"
    textColor: "{colors.ink-950}"
    rounded: "{rounded.xl}"
    padding: "12px 20px"
  button-primary-on-ink-hover:
    backgroundColor: "{colors.saffron-300}"
  button-ghost:
    textColor: "{colors.ink-700}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.xl}"
    padding: "10px 14px"
  nav-rail:
    backgroundColor: "{colors.ink-100}"
    width: "240px"
  nav-item-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.md}"
  panel:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.2xl}"
  assistant-launcher-user:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.paper}"
    rounded: "{rounded.2xl}"
  assistant-launcher-admin:
    backgroundColor: "{colors.saffron-400}"
    textColor: "{colors.ink-950}"
    rounded: "{rounded.2xl}"
---

# Design System: Kairo

## Overview

**Creative North Star: "The Right Moment"**

Kairo takes its name from *kairos*, the opportune moment, and the whole system is built to show it. Deep ink carries the interface. Generous white space lets work breathe. One saffron dot marks **now**: the current place in the navigation, the AI, focus, and the logo itself. Where saffron appears, something is happening; everywhere else is calm.

The working app is light (people scan tasks at desks under office light for hours). The marketing surface and brand moments sit on an ink stage (`ink-950`), where the light workspace appears as the hero, lifted by a deep stage shadow. The register is Linear and Things: quiet, precise, no decoration.

**Key Characteristics:**
- Ink neutrals replace Tailwind's slate and gray scales, so every neutral utility is on-brand.
- One saffron accent with a fixed job: *the moment*. Never a section colour, never a fill behind white text.
- Funnel Display for headlines, Geist for the interface, Geist Mono only for data.
- Hairline borders at rest; soft `float` shadows for things that float; a deep `stage` shadow for the hero.
- Priority reads as signal-strength bars, status as a dot and a word.

## Logo

The mark is an open ring (the cycle of work) with a saffron dot in its gap (the moment the right task arrives), on an ink tile with 8px corner radius at 32px. The wordmark `kairo` is drawn monoline in the same 3px stroke; the dot of its **i** is the same saffron moment. On ink grounds the tile is dropped and the bare white ring is used. Source: `frontend/src/components/brand/KairoLogo.tsx`; files: `frontend/public/brand/`. Full usage rules live on the `/brand` route and in `docs/15_BRAND_KIT.md`.

## Colors

### Saffron (the moment)
- **saffron-400** `#ffb224`: logo dot, active-nav dot, admin badge dot, primary CTA on ink, admin assistant launcher, focus halo.
- **saffron-300**: hover of saffron buttons on ink.
- **saffron-100 / 200**: AI washes, selection highlight, normalised values in the import preview.
- **saffron-600 / 700**: accent icons and text on paper (contrast-safe); Copilot sparkle.

### Ink (everything else)
- **ink-950**: stage ground (landing hero, proof section, login brand panel, assistant headers).
- **ink-900**: body text, primary buttons, selected segmented option, avatar.
- **ink-500 / 600**: secondary text. **ink-400**: placeholders and meta on paper, body text on ink.
- **ink-200**: the hairline (global default border). **ink-100**: navigation rail. **ink-50**: app canvas.

### State (fixed meanings)
Sky = in progress / medium. Violet = in review. Orange = high / held back. Rose = blocked / urgent / error. Emerald = done / Excel. Rendered as 50-wash + 700-text pills or as the colour of the priority bars. Saffron is never a state colour, which is why "High" moved from amber to orange.

### Named Rules
**The One Moment Rule.** Saffron appears only where something is current or alive. If it is not the current place, the AI, focus, or the logo, it is not saffron.

**The Ink Commit Rule.** Primary actions on paper are ink, not colour. Saffron fills appear only on ink grounds, with ink text.

## Typography

- **Display** (Funnel Display 600, 2.6rem to 4.5rem, line-height 1.02, -0.03em): hero and closing headlines, one per surface.
- **Headline** (Funnel Display 600, 2.25rem to 3rem): section headings. In the app, panel titles use Funnel Display at 15px.
- **Body** (Geist 400, 16 to 18px, 1.625): marketing paragraphs, capped at 65ch.
- **UI** (Geist 500, 13px): nav items, buttons, inputs, table cells.
- **Meta** (Geist 500, 11px): counts, group labels (sentence case, not uppercase), helper text.
- **Mono** (Geist Mono, 11px): IDs, paths, API probes. Never decorative.

**The Tabular Rule.** Every count, date and ID uses `tabular-nums`.

## Layout

The app is a fixed shell: a 240px `ink-100` rail (overlay below `lg`) beside a 56px translucent top bar and an `ink-50` canvas. The active nav item is a white sheet lifted off the rail with a saffron dot at the rail's edge. The landing page uses a 72rem container, 80 to 112px section padding, and alternates ink stage, paper, ink-50 band, ink, paper. The Stable Stage Rule from the previous system still holds: interactive demos reserve their full height.

## Elevation & Depth

- **Hairline** (1px ink-200): every panel in flow.
- **xs** (`0 1px 2px rgb(11 12 16 / .06)`): active nav sheet, primary buttons, selected segment.
- **float** (`0 1px 2px …, 0 12px 32px -12px rgb(11 12 16 / .18)`): demo panels, the assistant launcher.
- **stage** (`0 40px 100px -30px rgb(0 0 0 / .7)`): the hero workspace on ink.

## Motion

Exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`) from an already-visible state. The one authored moment is `animate-moment`: the saffron dot breathes twice when a surface first appears (loader, hero stage nav). Colour-only hover transitions. `prefers-reduced-motion` collapses all of it.

## Do's and Don'ts

### Do
- **Do** keep saffron for the moment only, and keep the logo's dot saffron on every ground except one-colour print.
- **Do** make primary actions ink on paper and saffron-with-ink-text on ink.
- **Do** show priority as signal bars and status as a dot plus a word.
- **Do** use Funnel Display for headings, Geist for everything you operate, Geist Mono for data.

### Don't
- **Don't** put white text on saffron, or use saffron as a section background in the app.
- **Don't** reintroduce indigo, purple gradients, or glass beyond the sticky top bar.
- **Don't** put eyebrow labels above headings, or invent metrics, customers or testimonials.
- **Don't** set the wordmark in a typeface; use the drawn SVG.
