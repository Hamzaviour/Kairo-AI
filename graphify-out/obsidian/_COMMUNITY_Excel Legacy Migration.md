---
type: community
members: 8
---

# Excel Legacy Migration

**Members:** 8 nodes

## Members
- [[Initial Seed Data (2 users, 3 tasks)]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Legacy Task Sheet]] - concept - graphify-out/converted/Tasks_and_Users_3be845f5.md
- [[Legacy Users Sheet]] - concept - graphify-out/converted/Tasks_and_Users_3be845f5.md
- [[Normalized Task Sheet (with ID, User ID)]] - concept - graphify-out/converted/Tasks_and_Users_Updated_1499d685.md
- [[Normalized Users Sheet (with ID, Role, Task IDs)]] - concept - graphify-out/converted/Tasks_and_Users_Updated_1499d685.md
- [[SRS-EXC-001 Validated Excel Import]] - concept - docs/03_SRS.md
- [[Tasks_and_Users.xlsx (Legacy Workbook)]] - document - graphify-out/converted/Tasks_and_Users_3be845f5.md
- [[Tasks_and_Users_Updated.xlsx (Normalized Workbook)]] - document - graphify-out/converted/Tasks_and_Users_Updated_1499d685.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Excel_Legacy_Migration
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_Database Schema Dictionary]]
- 2 edges to [[_COMMUNITY_Excel Tests]]
- 1 edge to [[_COMMUNITY_Excel Onboarding Workflow]]
- 1 edge to [[_COMMUNITY_Auth Requirements (SRS)]]
- 1 edge to [[_COMMUNITY_RBAC & Implementation Plan]]

## Top bridge nodes
- [[Tasks_and_Users.xlsx (Legacy Workbook)]] - degree 4, connects to 2 communities
- [[Tasks_and_Users_Updated.xlsx (Normalized Workbook)]] - degree 4, connects to 2 communities
- [[Normalized Task Sheet (with ID, User ID)]] - degree 5, connects to 1 community
- [[Normalized Users Sheet (with ID, Role, Task IDs)]] - degree 5, connects to 1 community
- [[SRS-EXC-001 Validated Excel Import]] - degree 3, connects to 1 community