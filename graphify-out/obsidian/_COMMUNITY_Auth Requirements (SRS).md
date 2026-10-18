---
type: community
members: 10
---

# Auth Requirements (SRS)

**Members:** 10 nodes

## Members
- [[Authentication & Token Rotation Sequence]] - concept - docs/04_SYSTEM_DESIGN_ARCHITECTURE.md
- [[IEEE Std 830-1998]] - concept - docs/03_SRS.md
- [[SRS-AI-001 Natural Language Task Extraction]] - concept - docs/03_SRS.md
- [[SRS-AUTH-001 User Login]] - concept - docs/03_SRS.md
- [[SRS-AUTH-002 Token Refresh & Rotation]] - concept - docs/03_SRS.md
- [[SRS-EXC-002 Filtered Excel Export]] - concept - docs/03_SRS.md
- [[SRS-TASK-003 Kanban Status Drag-and-Drop]] - concept - docs/03_SRS.md
- [[Software Requirements Specification (SRS)]] - document - docs/03_SRS.md
- [[Table refresh_tokens]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Token Lifecycle (login  refresh  logout)]] - concept - docs/02_TRD.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Auth_Requirements_SRS
SORT file.name ASC
```

## Connections to other communities
- 7 edges to [[_COMMUNITY_Technical Requirements (TRD)]]
- 2 edges to [[_COMMUNITY_Database Schema Dictionary]]
- 1 edge to [[_COMMUNITY_Product Requirements (PRD)]]
- 1 edge to [[_COMMUNITY_User Manual]]
- 1 edge to [[_COMMUNITY_API Reference & AI Specs]]
- 1 edge to [[_COMMUNITY_Priority Scoring]]
- 1 edge to [[_COMMUNITY_Excel Legacy Migration]]

## Top bridge nodes
- [[Software Requirements Specification (SRS)]] - degree 14, connects to 5 communities
- [[Token Lifecycle (login  refresh  logout)]] - degree 5, connects to 1 community
- [[Table refresh_tokens]] - degree 5, connects to 1 community
- [[Authentication & Token Rotation Sequence]] - degree 3, connects to 1 community
- [[SRS-TASK-003 Kanban Status Drag-and-Drop]] - degree 2, connects to 1 community