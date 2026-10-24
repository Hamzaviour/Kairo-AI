# Kairo Brand Kit

> The live, interactive version of this kit is at **`/brand`** in the running app (click a swatch to copy it, download logo files).

## Name

**Kairo**, from the Greek *kairos*: not clock time (*chronos*) but the right, opportune moment. The product tells each person what deserves their attention now, inside a workspace that only contains their own work.

**Tagline:** Do the right work at the right moment.

Write it as **Kairo** in sentences (capital K). The drawn wordmark is lowercase `kairo`.

## Logo

| File | Use |
|---|---|
| [`kairo-lockup.svg`](../frontend/public/brand/kairo-lockup.svg) | Primary lockup on light backgrounds |
| [`kairo-lockup-dark.svg`](../frontend/public/brand/kairo-lockup-dark.svg) | Lockup on ink backgrounds |
| [`kairo-mark.svg`](../frontend/public/brand/kairo-mark.svg) | App icon, avatar, favicon (ink tile) |
| [`kairo-mark-ring.svg`](../frontend/public/brand/kairo-mark-ring.svg) | Mark alone on dark or photographic backgrounds |
| [`kairo-wordmark.svg`](../frontend/public/brand/kairo-wordmark.svg) | Wordmark alone |

**The idea.** An open ring is the cycle of work. The saffron dot sitting in its gap is the moment the right task arrives. The wordmark is drawn from the same 3px monoline stroke, and the dot of its **i** is the same saffron moment.

**Rules**
- Clear space: half the mark's width on every side of the lockup.
- Minimum size: mark 16px, lockup 20px tall on screen. Smaller than that, use the mark alone.
- The dot is always saffron `#ffb224`. Only one-colour print turns the whole logo, dot included, to ink.
- Don't recolour the ring, close the gap, rotate the mark, add effects, or retype the wordmark in a font.
- In code, use `KairoMark`, `KairoWordmark` and `KairoLockup` from `frontend/src/components/brand/KairoLogo.tsx`.

## Colour

Restrained: ink carries the interface, saffron marks *now*.

| Token | Hex | Role |
|---|---|---|
| Ink 950 | `#0b0c10` | Stage backgrounds |
| Ink 900 | `#13151a` | Text, primary buttons |
| Ink 500 | `#646b78` | Secondary text |
| Ink 200 | `#e3e5ea` | Hairline borders |
| Ink 100 | `#f0f1f4` | Navigation rail |
| Ink 50 | `#f7f8fa` | App canvas |
| **Saffron 400** | **`#ffb224`** | **The moment: logo dot, current place, AI, focus, CTA on ink** |
| Saffron 100 | `#ffefcc` | AI wash, highlights |
| Saffron 700 | `#9a5d00` | Accent text on white |

State colours keep one meaning each: Sky (in progress / medium), Violet (in review), Orange (high), Rose (blocked / urgent / error), Emerald (done / Excel).

**Never** put white text on saffron. Primary buttons on white are ink; saffron buttons appear only on ink, with ink text.

## Typography

| Face | Use | Source |
|---|---|---|
| **Funnel Display** 600 | Headlines, panel titles | Google Fonts |
| **Geist** 400 / 500 | Interface and body | Google Fonts |
| **Geist Mono** 400 | IDs, paths, API responses only | Google Fonts |

Headlines are tight (-0.025em to -0.03em) and balanced. Interface text is 13px medium. Counts and dates use tabular numerals.

## Voice

Calm, direct, specific, like a colleague who has already read the spreadsheet.

| Say | Don't say |
|---|---|
| Three tasks are overdue. Start with the Q4 report, it blocks two others. | Supercharge your productivity with AI-powered insights! |
| Sarah can't see this task. It belongs to Alexander. | Error 403: Access to resource denied. |

- Name the thing: tasks, sheets, scopes. Never "items" or "resources".
- Explain the why in one line.
- No hype words and no exclamation marks.
