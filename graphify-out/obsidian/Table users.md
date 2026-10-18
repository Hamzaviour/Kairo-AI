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

# Table: users

## Connections
- [[Backend Database Schema & Data Dictionary]] - `references` [EXTRACTED]
- [[Normalized Users Sheet (with ID, Role, Task IDs)]] - `shares_data_with` [INFERRED]
- [[Table ai_interactions]] - `shares_data_with` [EXTRACTED]
- [[Table focus_sessions]] - `shares_data_with` [EXTRACTED]
- [[Table notifications]] - `shares_data_with` [EXTRACTED]
- [[Table project_members]] - `shares_data_with` [EXTRACTED]
- [[Table projects]] - `shares_data_with` [EXTRACTED]
- [[Table refresh_tokens]] - `shares_data_with` [EXTRACTED]
- [[Table task_attachments]] - `shares_data_with` [EXTRACTED]
- [[Table task_comments]] - `shares_data_with` [EXTRACTED]
- [[Table tasks]] - `shares_data_with` [EXTRACTED]
- [[Table time_entries]] - `shares_data_with` [EXTRACTED]
- [[Table user_preferences]] - `shares_data_with` [EXTRACTED]
- [[update_updated_at_column() Trigger Function]] - `references` [EXTRACTED]

#graphify/concept #graphify/EXTRACTED #community/Database_Schema_Dictionary