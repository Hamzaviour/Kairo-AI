---
type: community
members: 12
---

# Excel Export

**Members:** 12 nodes

## Members
- [[dot-export_tasks_to_excel()]] - code - backend/app/services/excel_service.py
- [[BytesIO]] - code
- [[Excel Data Pipeline Endpoints (apiexcel)]] - concept - docs/14_API_REFERENCE.md
- [[Excel Onboarding Flow (preview-import  commit-import  export)]] - concept - docs/11_WORKFLOWS.md
- [[Excel Round-Trip (Import Preview  Export)]] - rationale - docs/10_PRODUCT_PROPOSAL.md
- [[Excel StatusPriority Mapping Rules]] - rationale - docs/11_WORKFLOWS.md
- [[ExcelService]] - code - backend/app/services/excel_service.py
- [[Exports all permitted tasks for the authenticated user as a styled Excel…]] - rationale - backend/app/api/endpoints/excel.py
- [[Exports all permitted tasks for the current user into a professionally styled…]] - rationale - backend/app/services/excel_service.py
- [[Session_3]] - code
- [[export_tasks()]] - code - backend/app/api/endpoints/excel.py
- [[get_1]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Excel_Export
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_API Wiring & Vercel Entrypoint]]
- 3 edges to [[_COMMUNITY_Excel Schemas]]
- 3 edges to [[_COMMUNITY_AI Copilot Endpoints]]
- 2 edges to [[_COMMUNITY_Task & Subtask API]]
- 2 edges to [[_COMMUNITY_Excel Import API]]
- 1 edge to [[_COMMUNITY_Product Capabilities]]
- 1 edge to [[_COMMUNITY_API Reference & AI Specs]]
- 1 edge to [[_COMMUNITY_Proposal Scope & Risks]]

## Top bridge nodes
- [[ExcelService]] - degree 12, connects to 5 communities
- [[export_tasks()]] - degree 7, connects to 3 communities
- [[dot-export_tasks_to_excel()]] - degree 7, connects to 2 communities
- [[Excel Onboarding Flow (preview-import  commit-import  export)]] - degree 4, connects to 1 community
- [[Excel Data Pipeline Endpoints (apiexcel)]] - degree 3, connects to 1 community