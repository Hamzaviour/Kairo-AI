---
type: community
members: 15
---

# Product Requirements (PRD)

**Members:** 15 nodes

## Members
- [[Integrated Focus & Pomodoro Timer]] - concept - docs/01_PRD.md
- [[Inter-Task Dependencies (blocks  blocked_by  relates_to)]] - concept - docs/01_PRD.md
- [[NFR-1 Security & Data Isolation]] - concept - docs/01_PRD.md
- [[NFR-2 Performance (p95  150ms)]] - concept - docs/01_PRD.md
- [[Notification Center]] - concept - docs/01_PRD.md
- [[Omnichannel Task Views (List, Kanban, Calendar, Timeline)]] - concept - docs/01_PRD.md
- [[Private Retrieval-Augmented Q&A]] - concept - docs/01_PRD.md
- [[Product Requirements Document (PRD)]] - document - docs/01_PRD.md
- [[Real-Time Activity & Audit Logs]] - concept - docs/01_PRD.md
- [[SRS-TASK-001 Task Creation]] - concept - docs/03_SRS.md
- [[Smart Daily Scheduler]] - concept - docs/01_PRD.md
- [[Success Metrics & KPIs]] - concept - docs/01_PRD.md
- [[Table notifications]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table task_activity_logs]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[User Personas (Executive Admin, Core Contributor, Project Lead)]] - concept - docs/01_PRD.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Product_Requirements_PRD
SORT file.name ASC
```

## Connections to other communities
- 6 edges to [[_COMMUNITY_Database Schema Dictionary]]
- 3 edges to [[_COMMUNITY_Technical Requirements (TRD)]]
- 2 edges to [[_COMMUNITY_UIUX Design Spec]]
- 1 edge to [[_COMMUNITY_User Manual]]
- 1 edge to [[_COMMUNITY_Auth Requirements (SRS)]]
- 1 edge to [[_COMMUNITY_Schema Migration]]
- 1 edge to [[_COMMUNITY_Excel Onboarding Workflow]]
- 1 edge to [[_COMMUNITY_RBAC & Implementation Plan]]

## Top bridge nodes
- [[Product Requirements Document (PRD)]] - degree 18, connects to 5 communities
- [[Table task_activity_logs]] - degree 5, connects to 2 communities
- [[Table notifications]] - degree 4, connects to 1 community
- [[SRS-TASK-001 Task Creation]] - degree 3, connects to 1 community
- [[Inter-Task Dependencies (blocks  blocked_by  relates_to)]] - degree 2, connects to 1 community