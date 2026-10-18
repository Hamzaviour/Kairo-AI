---
version: 1
slug: "frontend-src-pages-landingpage-tsx"
primary_target: "frontend/src/pages/LandingPage.tsx"
related_targets: []
---

# Landing page (/)

Scope: public marketing route `/` for HCCDI TaskPilot. Visitor mode: **Persuade**.
Audience: enterprise team leads and ops managers still running work in shared Excel trackers.
Action: open the live demo (sign in with a demo account); secondary: watch the launch video, read the docs.
Proof on hand: the real app UI, the seeded demo workbook, 19 passing backend tests, IDOR 404 behaviour. No customers, metrics or testimonials exist — never invent them.

## Direction contract

THESIS: One database, two scopes. The page proves isolation by letting the visitor *be* each user, instead of the category default (headline + screenshot + three feature cards).

OWN-WORLD: The app's own world, lifted to page scale: slate-900 sidebar ink as the hero ground, indigo-600 as the single committed accent, white task-table surfaces with real status/priority pills, Inter throughout, tabular numerals, the check-circle mark. No gradients, no glass.

STORY: Visitor sees their spreadsheet's mess solved → believes one workspace can be shared without leaking → watches the 20s video → clicks "Try the live demo".

FIRST VIEWPORT: Slate-900 stage. Top: headline "Your spreadsheet, rebuilt as a secure AI workspace", one subline, primary "Try the live demo" and secondary "Watch the 20s tour". Below, full width and dominant: the TaskPilot shell itself (sidebar + task table from the seed data). Its own top bar holds the viewer switch "Viewing as Alexander · Admin / Sarah · User"; switching collapses the rows that viewer cannot see and the table footer prints the 404 probe. No side-by-side copy/screenshot split.

FORM: Two scopes, one database — rank 3 of 7, dealt lead. seed:7d8e09e51d0bea5d

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
