---
type: community
members: 12
---

# UI/UX Design Spec

**Members:** 12 nodes

## Members
- [[srcmain.tsx module entry]] - code - frontend/index.html
- [[Application Layout (SidebarTopbarDrawer)]] - concept - docs/05_UI_UX_DESIGN_SPEC.md
- [[Design System Tokens (LinearNotion inspired)]] - rationale - docs/05_UI_UX_DESIGN_SPEC.md
- [[Excel Data Center UI (ExcelImportModal  ExportButton)]] - concept - docs/05_UI_UX_DESIGN_SPEC.md
- [[Excel Two-Way Synchronization with Import Preview]] - concept - docs/01_PRD.md
- [[Frontend index.html SPA Entry]] - code - frontend/index.html
- [[Inter font (Google Fonts)]] - concept - frontend/index.html
- [[PostgreSQL Native Enums (user_role, task_status, task_priority, ...)]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Priority Tokens]] - concept - docs/05_UI_UX_DESIGN_SPEC.md
- [[Semantic Status Tokens]] - concept - docs/05_UI_UX_DESIGN_SPEC.md
- [[UIUX Design Specification]] - document - docs/05_UI_UX_DESIGN_SPEC.md
- [[WCAG 2.1 AA Accessibility]] - concept - docs/05_UI_UX_DESIGN_SPEC.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/UI/UX_Design_Spec
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_Database Schema Dictionary]]
- 2 edges to [[_COMMUNITY_Product Requirements (PRD)]]
- 2 edges to [[_COMMUNITY_Technical Requirements (TRD)]]
- 1 edge to [[_COMMUNITY_Excel Onboarding Workflow]]
- 1 edge to [[_COMMUNITY_API Reference & AI Specs]]

## Top bridge nodes
- [[UIUX Design Specification]] - degree 10, connects to 3 communities
- [[Excel Two-Way Synchronization with Import Preview]] - degree 3, connects to 2 communities
- [[PostgreSQL Native Enums (user_role, task_status, task_priority, ...)]] - degree 3, connects to 1 community
- [[WCAG 2.1 AA Accessibility]] - degree 2, connects to 1 community