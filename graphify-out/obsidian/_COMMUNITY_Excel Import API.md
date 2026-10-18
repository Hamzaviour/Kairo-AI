---
type: community
members: 7
---

# Excel Import API

**Members:** 7 nodes

## Members
- [[Imports validated rows from the preview into the live database. Assigns tasks…]] - rationale - backend/app/api/endpoints/excel.py
- [[Session_11]] - code
- [[Upload an Excel (.xlsx) file to validate schema headers and data rows. Returns…]] - rationale - backend/app/api/endpoints/excel.py
- [[UploadFile]] - code
- [[commit_import()]] - code - backend/app/api/endpoints/excel.py
- [[post_6]] - code
- [[preview_import()]] - code - backend/app/api/endpoints/excel.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Excel_Import_API
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_Task & Subtask API]]
- 3 edges to [[_COMMUNITY_Excel Schemas]]
- 2 edges to [[_COMMUNITY_Excel Export]]
- 2 edges to [[_COMMUNITY_AI Copilot Endpoints]]
- 2 edges to [[_COMMUNITY_API Wiring & Vercel Entrypoint]]

## Top bridge nodes
- [[preview_import()]] - degree 8, connects to 5 communities
- [[commit_import()]] - degree 10, connects to 4 communities
- [[Session_11]] - degree 2, connects to 1 community