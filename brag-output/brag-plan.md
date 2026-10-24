# /brag plan — Kairo

**What it is:** a task workspace that imports your team's Excel tracker, turns plain sentences into planned tasks with an AI Copilot, and scopes every person to only their own work.
**For:** enterprise team leads still running work out of a shared spreadsheet.
**What sets it apart:** the Excel round-trip on-ramp + a Copilot that works offline + per-user isolation that returns 404 for other people's tasks.
**Most impressive claim:** switch the viewer and the other person's tasks don't just hide, they *don't exist* (404).
**Visual hook:** a messy spreadsheet ("Pending", "Under Review?", an empty title) snapping into a clean workspace.
**Share caption:** see `share-copy.txt`.

## Angle
Spreadsheet → AI workspace. Lead with the pain everyone recognises (the team spreadsheet), reveal the product, prove two things it does that a sheet can't.

## Tone
`default` — punchy, playful, clean. 5 scenes, soft transitions (old content out, then new in — no muddy crossfades).

## Visual identity (from the code)
- Ground: ink-950 `#0b0c10` for stage scenes; white `#ffffff` / ink-50 `#f7f8fa` app surfaces.
- Accent: saffron `#ffb224` (the moment); Excel green `#059669`; pill colours from the app (`rose`, `orange`, `sky`, `violet`, `emerald` 50/700).
- Type: Funnel Display for headlines, Geist for UI, Geist Mono only for the API line.
- Mark: the Kairo open ring with its saffron dot, and the drawn `kairo` wordmark.

## Storyboard (20.0 s, 1920×1080, 30 fps)

| # | Time | Scene | On screen |
|---|------|-------|-----------|
| 1 | 0.0–3.2 | **Hook** | An Excel grid (`Tasks_and_Users.xlsx`) with the real legacy rows. Cells pop in; "Pending", "Under Review", an empty title are circled. Line: *"Your team's to-do list still lives in a spreadsheet."* |
| 2 | 3.2–6.6 | **Reveal** | The grid rows lift and re-set as Kairo task rows with status/priority pills; the logo and *"Kairo"* land; subline *"Your spreadsheet, rebuilt as a secure AI workspace."* |
| 3 | 6.6–11.6 | **Highlight: Copilot** | The Copilot panel. The sentence *"Submit Q4 budget report to Alex by next Thursday with urgent priority"* types in, then the parsed task assembles: title, Urgent, Thursday 5:00 PM, five checklist items tick in. Caption *"Type it the way you'd say it."* |
| 4 | 11.6–16.4 | **Highlight: Scopes** | The task table as Alexander · Admin (9 tasks). A click flips to Sarah · Member: five rows collapse, footer reads `GET /api/tasks/5647ef57… → 404 Not Found`. Caption *"Everyone sees only their own work."* |
| 5 | 16.4–20.0 | **Punchline / outro** | Dark stage, mark + name, *"Spreadsheet in. Secure AI workspace out."*, button *"Try the live demo"*, repo path `github.com/Hamzaviour/AI-Based-To-Do-App`. |

## Sound
Original synthesized track (no third-party audio): 112 BPM, A minor-ish pop progression (Am–F–C–G), soft kick + closed hat + plucked bass + warm pad. SFX in the same key and room: soft tick for typing (sparse, -20 dB under music), a muted "pop" on the reveal downbeat, a low "thunk" when rows collapse. Light reverb on everything; fade out last 1.2 s; loudness-normalised to about -16 LUFS.

## Privacy
Only the fictional demo accounts that already ship in the repo (Alexander Wright, Sarah Jenkins, `enterprise.com`) appear. No secrets, emails beyond the demo ones, or internal hosts.
