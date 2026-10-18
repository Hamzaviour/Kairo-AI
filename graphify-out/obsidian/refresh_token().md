---
source_file: "backend/app/api/endpoints/auth.py"
type: "code"
community: "Admin Governance API"
location: "L105"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Admin_Governance_API
---

# refresh_token()

## Connections
- [[RefreshToken]] - `uses` [INFERRED]
- [[RefreshTokenRequest]] - `uses` [INFERRED]
- [[ResponseEnvelope]] - `uses` [INFERRED]
- [[Rotates refresh token and returns new access & refresh token pair.]] - `rationale_for` [EXTRACTED]
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

#graphify/code #graphify/EXTRACTED #community/Admin_Governance_API