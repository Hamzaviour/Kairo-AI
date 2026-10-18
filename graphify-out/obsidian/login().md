---
source_file: "backend/app/api/endpoints/auth.py"
type: "code"
community: "Admin Governance API"
location: "L22"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Admin_Governance_API
---

# login()

## Connections
- [[Authenticate user with email and password, returning access and refresh tokens.]] - `rationale_for` [EXTRACTED]
- [[LoginRequest]] - `uses` [INFERRED]
- [[RefreshToken]] - `uses` [INFERRED]
- [[ResponseEnvelope]] - `uses` [INFERRED]
- [[Session_9]] - `references` [EXTRACTED]
- [[TokenResponse]] - `uses` [INFERRED]
- [[User_1]] - `uses` [INFERRED]
- [[UserResponse]] - `uses` [INFERRED]
- [[auth.py]] - `contains` [EXTRACTED]
- [[create_access_token()]] - `calls` [EXTRACTED]
- [[create_refresh_token()]] - `calls` [EXTRACTED]
- [[decode_token()]] - `calls` [EXTRACTED]
- [[hash_token()]] - `calls` [EXTRACTED]
- [[post_5]] - `references` [EXTRACTED]
- [[verify_password()]] - `calls` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Admin_Governance_API