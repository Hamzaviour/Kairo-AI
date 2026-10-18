---
source_file: "docs/09_BACKEND_SCHEMA_SPEC.md"
type: "concept"
community: "Excel Legacy Migration"
location: "7"
tags:
  - graphify/concept
  - graphify/INFERRED
  - community/Excel_Legacy_Migration
---

# Initial Seed Data (2 users, 3 tasks)

## Connections
- [[Backend Database Schema & Data Dictionary]] - `references` [EXTRACTED]
- [[Normalized Task Sheet (with ID, User ID)]] - `shares_data_with` [INFERRED]
- [[Normalized Users Sheet (with ID, Role, Task IDs)]] - `shares_data_with` [INFERRED]

#graphify/concept #graphify/INFERRED #community/Excel_Legacy_Migration