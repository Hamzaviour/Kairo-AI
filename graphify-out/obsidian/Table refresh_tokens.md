---
source_file: "docs/09_BACKEND_SCHEMA_SPEC.md"
type: "concept"
community: "Auth Requirements (SRS)"
location: "4"
tags:
  - graphify/concept
  - graphify/EXTRACTED
  - community/Auth_Requirements_SRS
---

# Table: refresh_tokens

## Connections
- [[Authentication & Token Rotation Sequence]] - `shares_data_with` [EXTRACTED]
- [[Backend Database Schema & Data Dictionary]] - `references` [EXTRACTED]
- [[SRS-AUTH-001 User Login]] - `shares_data_with` [EXTRACTED]
- [[Table users]] - `shares_data_with` [EXTRACTED]
- [[Token Lifecycle (login  refresh  logout)]] - `shares_data_with` [EXTRACTED]

#graphify/concept #graphify/EXTRACTED #community/Auth_Requirements_SRS