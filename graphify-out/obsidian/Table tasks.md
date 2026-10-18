---
source_file: "docs/09_BACKEND_SCHEMA_SPEC.md"
type: "concept"
community: "Database Schema Dictionary"
location: "4"
tags:
  - graphify/concept
  - graphify/EXTRACTED
  - community/Database_Schema_Dictionary
---

# Table: tasks

## Connections
- [[Backend Database Schema & Data Dictionary]] - `references` [EXTRACTED]
- [[Normalized Task Sheet (with ID, User ID)]] - `shares_data_with` [INFERRED]
- [[Performance Indexing Matrix (20 indexes)]] - `references` [EXTRACTED]
- [[Table projects]] - `shares_data_with` [EXTRACTED]
- [[Table recurring_task_rules]] - `shares_data_with` [EXTRACTED]
- [[Table subtasks]] - `shares_data_with` [EXTRACTED]
- [[Table task_activity_logs]] - `shares_data_with` [EXTRACTED]
- [[Table task_attachments]] - `shares_data_with` [EXTRACTED]
- [[Table task_categories]] - `shares_data_with` [EXTRACTED]
- [[Table task_comments]] - `shares_data_with` [EXTRACTED]
- [[Table task_dependencies]] - `shares_data_with` [EXTRACTED]
- [[Table task_tags  task_tag_assignments]] - `shares_data_with` [EXTRACTED]
- [[Table time_entries]] - `shares_data_with` [EXTRACTED]
- [[Table users]] - `shares_data_with` [EXTRACTED]
- [[apply_task_scope() Authorization Filter]] - `shares_data_with` [EXTRACTED]
- [[update_updated_at_column() Trigger Function]] - `references` [EXTRACTED]

#graphify/concept #graphify/EXTRACTED #community/Database_Schema_Dictionary