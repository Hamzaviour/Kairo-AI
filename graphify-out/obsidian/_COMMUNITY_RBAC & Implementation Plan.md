---
type: community
members: 9
---

# RBAC & Implementation Plan

**Members:** 9 nodes

## Members
- [[Implementation Plan & WBS]] - document - docs/06_IMPLEMENTATION_PLAN.md
- [[OWASP Top 10 Threat Model]] - concept - docs/02_TRD.md
- [[Phase 1 Database Schema & Excel Migration]] - concept - docs/06_IMPLEMENTATION_PLAN.md
- [[Phase 2 FastAPI Backend Engine]] - concept - docs/06_IMPLEMENTATION_PLAN.md
- [[Phase 3 React Frontend]] - concept - docs/06_IMPLEMENTATION_PLAN.md
- [[Role-Based Access Control (Admin  User)]] - rationale - docs/01_PRD.md
- [[Work Breakdown Structure (3 phases)]] - concept - docs/06_IMPLEMENTATION_PLAN.md
- [[app.core.deps (Auth & RBAC DI)]] - code - docs/06_IMPLEMENTATION_PLAN.md
- [[app.core.security]] - code - docs/06_IMPLEMENTATION_PLAN.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/RBAC__Implementation_Plan
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_Technical Requirements (TRD)]]
- 1 edge to [[_COMMUNITY_Product Requirements (PRD)]]
- 1 edge to [[_COMMUNITY_Excel Legacy Migration]]
- 1 edge to [[_COMMUNITY_Schema Migration]]

## Top bridge nodes
- [[Phase 1 Database Schema & Excel Migration]] - degree 4, connects to 2 communities
- [[Implementation Plan & WBS]] - degree 8, connects to 1 community
- [[Phase 3 React Frontend]] - degree 3, connects to 1 community
- [[OWASP Top 10 Threat Model]] - degree 2, connects to 1 community
- [[Role-Based Access Control (Admin  User)]] - degree 2, connects to 1 community