---
type: community
members: 8
---

# Excel Schemas

**Members:** 8 nodes

## Members
- [[dot-preview_excel_import()]] - code - backend/app/services/excel_service.py
- [[BaseModel_3]] - code
- [[ExcelImportCommitRequest]] - code - backend/app/schemas/excel.py
- [[ExcelImportPreviewResponse]] - code - backend/app/schemas/excel.py
- [[ExcelImportResultResponse]] - code - backend/app/schemas/excel.py
- [[ExcelTaskPreviewRow]] - code - backend/app/schemas/excel.py
- [[Parses an uploaded Excel file, validates headers and rows, and returns a…]] - rationale - backend/app/services/excel_service.py
- [[schemasexcel.py]] - code - backend/app/schemas/excel.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Excel_Schemas
SORT file.name ASC
```

## Connections to other communities
- 8 edges to [[_COMMUNITY_API Wiring & Vercel Entrypoint]]
- 5 edges to [[_COMMUNITY_Task & Subtask API]]
- 3 edges to [[_COMMUNITY_Excel Export]]
- 3 edges to [[_COMMUNITY_Excel Import API]]
- 1 edge to [[_COMMUNITY_Admin Governance API]]

## Top bridge nodes
- [[schemasexcel.py]] - degree 9, connects to 3 communities
- [[ExcelImportPreviewResponse]] - degree 7, connects to 3 communities
- [[ExcelTaskPreviewRow]] - degree 6, connects to 3 communities
- [[ExcelImportCommitRequest]] - degree 5, connects to 3 communities
- [[ExcelImportResultResponse]] - degree 5, connects to 3 communities