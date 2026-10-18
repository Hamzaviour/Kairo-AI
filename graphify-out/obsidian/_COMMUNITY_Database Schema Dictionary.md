---
type: community
members: 20
---

# Database Schema Dictionary

**Members:** 20 nodes

## Members
- [[3NF Schema with UUIDv4 Keys]] - rationale - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Backend Database Schema & Data Dictionary]] - document - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Performance Indexing Matrix (20 indexes)]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table ai_interactions]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table focus_sessions]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table project_members]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table projects]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table recurring_task_rules]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table subtasks]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table task_attachments]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table task_categories]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table task_comments]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table task_dependencies]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table task_tags  task_tag_assignments]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table tasks]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table time_entries]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table user_preferences]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[Table users]] - concept - docs/09_BACKEND_SCHEMA_SPEC.md
- [[TaskDetailDrawer (Slide-over)]] - concept - docs/05_UI_UX_DESIGN_SPEC.md
- [[update_updated_at_column() Trigger Function]] - code - docs/09_BACKEND_SCHEMA_SPEC.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Database_Schema_Dictionary
SORT file.name ASC
```

## Connections to other communities
- 6 edges to [[_COMMUNITY_Product Requirements (PRD)]]
- 5 edges to [[_COMMUNITY_Technical Requirements (TRD)]]
- 3 edges to [[_COMMUNITY_Excel Legacy Migration]]
- 2 edges to [[_COMMUNITY_UIUX Design Spec]]
- 2 edges to [[_COMMUNITY_Auth Requirements (SRS)]]
- 1 edge to [[_COMMUNITY_Schema Migration]]

## Top bridge nodes
- [[Backend Database Schema & Data Dictionary]] - degree 25, connects to 6 communities
- [[Table tasks]] - degree 16, connects to 3 communities
- [[Table users]] - degree 14, connects to 3 communities
- [[Table subtasks]] - degree 5, connects to 1 community
- [[Table project_members]] - degree 4, connects to 1 community