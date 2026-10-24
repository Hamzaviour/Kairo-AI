---
type: community
members: 8
---

# Schema Migration

**Members:** 8 nodes

## Members
- [[001_initial_schema.sql]] - code - docs/08_PROJECT_TRACKING_TRACEABILITY.md
- [[19 Tables  6 Enums  20 Indexes  7 Triggers]] - concept - docs/02_TRD.md
- [[Deployment Topology (Nginx + FastAPI instances)]] - concept - docs/04_SYSTEM_DESIGN_ARCHITECTURE.md
- [[Neon Project orange-snow-72696664 (Kairo)]] - concept - docs/08_PROJECT_TRACKING_TRACEABILITY.md
- [[Neon Serverless PostgreSQL]] - concept - README.md
- [[Requirements Traceability Matrix (REQ-01..12)]] - concept - docs/08_PROJECT_TRACKING_TRACEABILITY.md
- [[System Architecture (React SPA - FastAPI - SQLAlchemy - Neon)]] - concept - README.md
- [[verify_migration.py]] - code - docs/08_PROJECT_TRACKING_TRACEABILITY.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Schema_Migration
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_Technical Requirements (TRD)]]
- 1 edge to [[_COMMUNITY_Task & Subtask API]]
- 1 edge to [[_COMMUNITY_Excel Tests]]
- 1 edge to [[_COMMUNITY_API Wiring & Vercel Entrypoint]]
- 1 edge to [[_COMMUNITY_Isolation Tests]]
- 1 edge to [[_COMMUNITY_AI Copilot Endpoints]]
- 1 edge to [[_COMMUNITY_Database Schema Dictionary]]
- 1 edge to [[_COMMUNITY_Product Requirements (PRD)]]
- 1 edge to [[_COMMUNITY_User Manual]]
- 1 edge to [[_COMMUNITY_RBAC & Implementation Plan]]
- 1 edge to [[_COMMUNITY_Deployment Guide]]

## Top bridge nodes
- [[Requirements Traceability Matrix (REQ-01..12)]] - degree 10, connects to 7 communities
- [[19 Tables  6 Enums  20 Indexes  7 Triggers]] - degree 3, connects to 2 communities
- [[Neon Serverless PostgreSQL]] - degree 4, connects to 1 community
- [[Neon Project orange-snow-72696664 (Kairo)]] - degree 3, connects to 1 community
- [[Deployment Topology (Nginx + FastAPI instances)]] - degree 2, connects to 1 community