---
name: HCCDI TaskPilot
description: A secure, AI-assisted task workspace that replaces shared Excel trackers.
colors:
  indigo-commit: "#4f46e5"
  indigo-commit-deep: "#4338ca"
  indigo-signal: "#6366f1"
  indigo-on-ink: "#818cf8"
  indigo-wash: "#eef2ff"
  indigo-selection: "#c7d2fe"
  ledger-ink: "#0f172a"
  ledger-ink-deep: "#020617"
  ink-rule: "#1e293b"
  slate-strong: "#334155"
  slate-body: "#475569"
  slate-muted: "#64748b"
  slate-quiet: "#94a3b8"
  slate-on-ink: "#cbd5e1"
  slate-hairline: "#e2e8f0"
  slate-well: "#f1f5f9"
  paper-cool: "#f8fafc"
  paper: "#ffffff"
  sheet-emerald: "#047857"
  sheet-emerald-wash: "#ecfdf5"
  flag-rose: "#be123c"
  flag-rose-wash: "#fff1f2"
  caution-amber: "#b45309"
  caution-amber-wash: "#fffbeb"
  motion-blue: "#1d4ed8"
  motion-blue-wash: "#eff6ff"
  review-violet: "#6d28d9"
  review-violet-wash: "#f5f3ff"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  body-dense:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.05em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.65625rem"
    fontWeight: 400
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "80px"
  container: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.indigo-commit}"
    textColor: "{colors.paper}"
    typography: "{typography.body-dense}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  button-primary-hover:
    backgroundColor: "{colors.indigo-commit-deep}"
  button-primary-large:
    backgroundColor: "{colors.indigo-commit}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    padding: "12px 20px"
  button-primary-large-on-ink-hover:
    backgroundColor: "{colors.indigo-signal}"
  button-copilot:
    backgroundColor: "{colors.indigo-wash}"
    textColor: "{colors.indigo-commit-deep}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  button-excel:
    backgroundColor: "{colors.sheet-emerald-wash}"
    textColor: "{colors.sheet-emerald}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  input:
    backgroundColor: "{colors.paper-cool}"
    textColor: "{colors.ledger-ink}"
    typography: "{typography.body-dense}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  input-focus:
    backgroundColor: "{colors.paper}"
  nav-item:
    textColor: "{colors.slate-on-ink}"
    typography: "{typography.body-dense}"
    rounded: "{rounded.lg}"
    padding: "8px 10px"
  nav-item-active:
    backgroundColor: "{colors.indigo-commit}"
    textColor: "{colors.paper}"
  sidebar:
    backgroundColor: "{colors.ledger-ink}"
    width: "240px"
  panel:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    padding: "12px"
  pill-status-in-progress:
    backgroundColor: "{colors.motion-blue-wash}"
    textColor: "{colors.motion-blue}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
  pill-status-blocked:
    backgroundColor: "{colors.flag-rose-wash}"
    textColor: "{colors.flag-rose}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
  pill-priority-high:
    backgroundColor: "{colors.caution-amber-wash}"
    textColor: "{colors.caution-amber}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
  viewer-switch:
    backgroundColor: "{colors.slate-well}"
    rounded: "{rounded.xl}"
    padding: "4px"
  viewer-switch-option-active:
    backgroundColor: "{colors.indigo-commit}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "6px 14px"
---

# Design System: HCCDI TaskPilot

## Overview

**Creative North Star: "The Scoped Ledger"**

TaskPilot looks like the operational ledger it replaces, cleaned up and given a lock. A slate-900 ink column (the sidebar, and on the landing page the whole hero stage) holds white task tables whose meaning is carried by small tinted pills: status, priority, scope. One indigo carries every commitment the user can make: the active nav item, the primary button, the selected viewer, the focus ring. Everything else is slate.

Density is high and calm. Working surfaces run on 12px text, 10–11px uppercase column labels and tabular numerals so dates, counts and IDs line up like a spreadsheet. The marketing surface is the same world at page scale: the real shell (sidebar, top bar, task table) becomes the hero instead of a screenshot, with display type in tight-tracked Inter bold above it. Depth comes from hairline borders and the ink/paper contrast, not from shadows; only things that float above the workspace (drawer, modal card, the hero stage) lift.

The world rejects gradients and glass on new surfaces. The app's earlier indigo-to-purple gradients were removed; the indigo is flat.

**Key Characteristics:**
- Slate-900 ink ground against white and cool-paper task surfaces.
- One committed accent (indigo-600); semantic tints for state, never for decoration.
- Inter throughout, tabular numerals for every count, date and ID.
- Hairline-bordered panels at 12px radius; pills at 6px.
- Product truth as imagery: the real shell, real seed rows, real API responses in mono.

## Colors

A cool slate ledger with a single indigo commitment and four quiet semantic tints.

### Primary
- **Indigo Commit** (indigo-commit): the only accent that means "act" or "selected". Primary buttons, active sidebar item, active viewer option, the check-circle mark tile, normalised values in the import preview.
- **Indigo Commit Deep** (indigo-commit-deep): hover/pressed state of primary buttons on paper; text of the Copilot tinted button.
- **Indigo Signal** (indigo-signal): focus ring (2px outline, 2px offset) and the favicon stroke; also the hover of primary buttons sitting on ledger ink, where lighter reads as "lit".
- **Indigo on Ink** (indigo-on-ink): icons and small accents placed on slate-900 (proof-list icons, Copilot icon in the sidebar).
- **Indigo Wash** (indigo-wash) and **Indigo Selection** (indigo-selection): AI surfaces (Copilot header, AI insight cards, bulk-selection bar) and the `::selection` highlight.

### Secondary
- **Sheet Emerald** (sheet-emerald) on **Sheet Emerald Wash** (sheet-emerald-wash): everything Excel. The Excel Hub button, the import-preview header, the upload/preview/round-trip step tiles, the 200 OK probe, "Completed" status, healthy database dot. Emerald means "the spreadsheet side" or "done", never generic success decoration.

### Tertiary
Semantic state tints, always as a 50-wash background with 700 text:
- **Flag Rose** (flag-rose / flag-rose-wash): Blocked status, Urgent priority, errors, the 404 probe, destructive hover.
- **Caution Amber** (caution-amber / caution-amber-wash): High priority, rows held back by import validation, the Admin Center group label on ink.
- **Motion Blue** (motion-blue / motion-blue-wash): In Progress status, Medium priority.
- **Review Violet** (review-violet / review-violet-wash): In Review status only.

### Neutral
- **Ledger Ink** (ledger-ink): body text colour on paper; sidebar and landing hero/proof ground.
- **Ledger Ink Deep** (ledger-ink-deep): sidebar status footer, video well.
- **Ink Rule** (ink-rule): borders and dividers on ledger ink.
- **Slate Strong / Body / Muted / Quiet** (slate-strong, slate-body, slate-muted, slate-quiet): secondary text in descending emphasis; slate-body for paragraphs on paper, slate-muted for meta and column labels, slate-quiet for placeholders, row numbers and paragraphs on ink.
- **Slate on Ink** (slate-on-ink): default text and links on ledger ink (sidebar items, landing nav); also the scrollbar thumb.
- **Slate Hairline** (slate-hairline): the global default border colour; every panel, table rule and input stroke.
- **Slate Well** (slate-well): Backlog/To Do/Low pills, segmented-control track, search trigger.
- **Cool Paper** (paper-cool): app canvas, input fill, table header band, footers of demo panels.
- **Paper** (paper): panels, tables, drawer, cards.

### Named Rules
**The One Commitment Rule.** Indigo appears only where the user commits or is located: a primary action, the current nav item, the selected scope, focus. If an element is not clickable-and-primary or currently selected, it is not indigo-600.

**The Tint-Means-State Rule.** Emerald, rose, amber, blue and violet appear as 50-wash + 700-text pairs bound to a fixed meaning (Excel/done, blocked/urgent/error, high/held back, in progress/medium, in review). They are never used as section colour or ornament.

## Typography

**Display Font:** Inter (with system-ui, -apple-system, sans-serif)
**Body Font:** Inter
**Label/Mono Font:** Inter for labels; the platform monospace for IDs, file paths, API probes and version strings.

**Character:** One sans family doing everything, with weight and tracking for hierarchy. Display sizes are bold and tightly tracked so a headline reads like a confident ledger heading; working text is small, medium-weight and dense. Inter is loaded at 300–800 with character variants `cv02 cv03 cv04 cv11` enabled globally.

### Hierarchy
- **Display** (700, 2.25rem → 3.75rem, line-height 1.05, -0.035em): the landing hero headline and the closing call, balanced (`text-wrap: balance`). One per surface.
- **Headline** (700, 1.875rem → 2.25rem, -0.03em): landing section headings; in the app, page titles step down to 1.5rem bold with -0.025em.
- **Title** (600, 1.125rem): proof-list items, demo-account cards, drawer task title (700).
- **Body** (400, 1rem → 1.125rem on the hero, line-height 1.625): marketing paragraphs, capped at `max-w-prose` (65ch).
- **Body Dense** (500, 0.75rem): all app working text: table cells, nav items, buttons, inputs, filters.
- **Label** (600, 0.625–0.6875rem, 0.05em tracking, uppercase): table column headers, sidebar group headings, field labels in the drawer.
- **Mono** (400, 0.65625rem): task IDs, user IDs, file paths in proof lists, the `GET /api/tasks/… → 404` probe.

### Named Rules
**The Tabular Rule.** Every count, date, row number and ID uses tabular numerals (the `.tabular` utility, `font-variant-numeric: tabular-nums`). Columns of numbers must align like the spreadsheet they replace.

**The Uppercase-Is-Structure Rule.** Uppercase tracked labels are reserved for structural captions (column headers, nav group headings, form field labels). Section headings on marketing surfaces carry no eyebrow above them.

## Layout

The app is a fixed shell: a 240px slate-900 sidebar (256px overlay below `lg`, dismissed by picking a destination) beside a 56px sticky top bar and a cool-paper canvas with 24px gutters (12px on phones). Content is tables and panels stacked with 16px gaps; panels pad 12–20px.

The landing page uses a `72rem` container with 16px gutters (24px from `sm`). Sections breathe at 64px vertical padding, 80px from `sm`, 96px for the proof list and close. Text-plus-demo sections use an asymmetric two-column grid (0.85fr / 1.25fr) from `lg`, stacking below it with the copy first. Grounds alternate ink → paper → cool-paper band → ink → paper, so the workspace's own colours pace the scroll.

Responsive tables shed columns rather than scroll where possible: the hero task table shows title + priority on phones, adds status and assignee at `sm` and due date at `lg`. Real spreadsheets (import preview) scroll horizontally with a minimum width.

Spacing follows the Tailwind 4px base; reused steps are 4, 8, 12, 16, 24px.

**The Stable Stage Rule.** Interactive demos reserve their full height. When content collapses (the viewer switch hiding rows), the frame keeps its size and the vacated space carries an explanatory note, so the page never shifts under the reader.

## Elevation & Depth

Flat by default. Resting panels separate by a 1px slate-hairline border and the ink/paper contrast; table rows divide with slate-100 rules. Shadows exist only for surfaces that float above the workspace.

### Shadow Vocabulary
- **Drawer lift** (`box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)`): the right-hand task drawer and modals, paired with a slate-900/20 scrim.
- **Card lift** (`box-shadow: 0 20px 25px -5px rgba(226,232,240,0.6), 0 8px 10px -6px rgba(226,232,240,0.6)`): the login card on cool paper.
- **Stage lift** (`box-shadow: 0 30px 80px -20px rgba(2,6,23,0.6)`): the hero workspace and the video frame sitting on ledger ink, with a 1px white/10 ring.
- **Control nudge** (`box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05)`): the selected option of a segmented control and small demo panels.

### Named Rules
**The Border-First Rule.** A panel that sits in the page flow gets a hairline border, not a shadow. Lift is earned by floating (drawer, modal, stage).

## Shapes

Gently rounded, never pill-shaped buttons. Radius scales with the size of the thing: 6px for pills and small tiles, 8px for buttons, nav items, inputs and icon buttons, 12px for panels, toolbars, filter bars and landing CTAs, 16px for the outermost frames (hero stage, demo cards, login card, demo-account choices). Full rounding is reserved for count badges, status dots and progress bars. The brand mark is the lucide check-circle in white on an indigo rounded square (6–8px radius).

## Components

### Buttons
Compact and decisive; colour does the talking, not size.
- **Shape:** gently curved (8px) in the app; 12px for landing CTAs.
- **Primary:** indigo-commit fill, white semibold 12px text, 6px 12px padding in the app; 12px 20px at 14px on the landing.
- **Hover / Focus:** colour-only transition (`transition-colors`); hover deepens to indigo-commit-deep on paper, lightens to indigo-signal on ink. Focus is the global 2px indigo-signal outline at 2px offset.
- **Secondary on ink:** transparent with a 1px white/20 ring, white text, white/5 fill on hover.
- **Tinted feature buttons:** AI Copilot (indigo wash, indigo-200 border, deep indigo text) and Excel Hub (emerald wash, emerald-200 border, emerald text). The sidebar repeats them as dark-wash variants (indigo-950/40, emerald-950/30 with 800/40 borders).
- **Icon buttons:** 6px padding, slate-400 icon, slate-100 hover fill; destructive ones hover to rose.

### Chips (status and priority pills)
- **Style:** 50-wash background, 700 text, semibold 10–12px, 6px radius, 2px 8px padding. App badges add a 6px leading dot in the 500 tone.
- **State:** meaning is fixed per the Tint-Means-State Rule; Backlog, To Do and Low stay slate.

### Cards / Containers
- **Corner Style:** 12px (panels, toolbars), 16px (outer frames).
- **Background:** paper on a cool-paper canvas; cool-paper header and footer bands inside demo panels.
- **Shadow Strategy:** none at rest (see Border-First Rule).
- **Border:** 1px slate-hairline.
- **Internal Padding:** 12px toolbars, 16–24px content, 20px drawer body.
- **Feature-tinted headers:** a 44px header band tinted indigo-50/70 (Copilot) or emerald-50/70 (Excel) identifies which half of the product a panel demonstrates.

### Inputs / Fields
- **Style:** cool-paper fill, 1px slate-hairline stroke, 8px radius (12px on the login form), 12px text.
- **Focus:** fill turns white and the border turns indigo-500; outline offset drops to 0.
- **Error / Disabled:** errors render as a rose-50 panel with rose-200 border and rose-700 text above the form; disabled buttons drop to 50% opacity.

### Navigation
- **Sidebar:** ledger ink, 12px medium items with 16px slate-400 icons; active item is an indigo-commit fill with white text and icon; hover is slate-800/80. Counts sit right in full-round tabular badges. Groups are headed by uppercase 11px slate-400 labels; the admin group label is amber-400.
- **Top bar:** 56px, white, hairline bottom border; holds the ⌘K search trigger, the tinted Copilot and Excel buttons, the primary New Task button and the user block.
- **Landing nav:** 64px on ledger ink, slate-300 links brightening to white, one primary "Try the live demo" button.
- **Drawer tabs:** 12px semibold labels with a 2px bottom border marking the active tab.

### Viewer Switch (signature)
A segmented radio group on a slate-well track (4px padding, 12px radius, hairline border). Options are 14px semibold names with a muted role suffix ("Alexander · Admin"); the selected option takes the indigo-commit fill with an indigo-200 role suffix. Arrow keys move between options. Switching collapses rows the viewer cannot see and updates a cool-paper scope footer: a tabular count ("4 of 9 tasks visible · own tasks only") and a mono API probe tinted emerald (200 OK) or rose (404 Not Found).

## Do's and Don'ts

### Do:
- **Do** keep indigo-600 for primary actions, current location, selected scope and focus only.
- **Do** express task state with 50-wash + 700-text pills using the fixed mapping: blue in progress, violet in review, rose blocked/urgent, amber high, emerald completed, slate backlog/to do/low.
- **Do** set every count, date and ID in tabular numerals, and IDs, paths and API responses in mono.
- **Do** separate in-flow panels with a 1px slate-200 border at 12px radius; reserve shadows for drawers, modals and the hero stage.
- **Do** show the real product (shell, seed rows, import preview, API probe) as imagery on marketing surfaces.
- **Do** transition colour only (`transition-colors`, 150–200ms) on hover; use `cubic-bezier(0.16, 1, 0.3, 1)` for entrances, and honour `prefers-reduced-motion`.
- **Do** reserve the full height of interactive demos so toggling never shifts the page.

### Don't:
- **Don't** use gradients anywhere; the indigo-to-purple gradients were removed and stay removed.
- **Don't** add glass (translucent blurred) panels to new surfaces; the sticky top bar's white/90 blur is the only incumbent case.
- **Don't** introduce a second accent or use purple for roles or emphasis; indigo is the brand and violet means "In Review" only.
- **Don't** put eyebrow labels above section headings or invent metrics, customers or testimonials as decoration.
- **Don't** use `transition-all` for hover or press feedback; transition colour, and name the properties when a collapse animates several.
