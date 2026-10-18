---
type: community
members: 86
---

# Admin Governance API

**Members:** 86 nodes

## Members
- [[dot-from_log()]] - code - backend/app/schemas/collaboration.py
- [[ActivityLogResponse]] - code - backend/app/schemas/collaboration.py
- [[Admin provisions a new user account with specified role.]] - rationale - backend/app/api/endpoints/admin.py
- [[Admin updates user profile, changes role, or activatesdeactivates account.]] - rationale - backend/app/api/endpoints/admin.py
- [[Any]] - code
- [[Any_1]] - code
- [[AttachmentResponse]] - code - backend/app/schemas/collaboration.py
- [[Authenticate user with email and password, returning access and refresh tokens.]] - rationale - backend/app/api/endpoints/auth.py
- [[Base_3]] - code
- [[BaseModel_4]] - code
- [[BaseModel_5]] - code
- [[BaseModel_6]] - code
- [[Change current user password.]] - rationale - backend/app/api/endpoints/auth.py
- [[CommentCreate]] - code - backend/app/schemas/collaboration.py
- [[CommentResponse]] - code - backend/app/schemas/collaboration.py
- [[Decode and validate a JWT token.]] - rationale - backend/app/core/security.py
- [[FocusSessionCreate]] - code - backend/app/schemas/productivity.py
- [[FocusSessionResponse]] - code - backend/app/schemas/productivity.py
- [[Generate JWT access token.]] - rationale - backend/app/core/security.py
- [[Generate JWT refresh token.]] - rationale - backend/app/core/security.py
- [[Get authenticated user profile, preferences, and task statistics.]] - rationale - backend/app/api/endpoints/auth.py
- [[Global organization-wide activity logs (Admin only).]] - rationale - backend/app/api/endpoints/admin.py
- [[HTTPAuthorizationCredentials]] - code
- [[Hash a token string (e.g., refresh token) for safe storage in the database.]] - rationale - backend/app/core/security.py
- [[Hash password using bcrypt.]] - rationale - backend/app/core/security.py
- [[List all user accounts in the system with task counts (Admin only).]] - rationale - backend/app/api/endpoints/admin.py
- [[LoginRequest]] - code - backend/app/schemas/user.py
- [[NotificationResponse]] - code - backend/app/schemas/productivity.py
- [[PasswordChangeRequest]] - code - backend/app/schemas/user.py
- [[RefreshToken]] - code - backend/app/models/user.py
- [[RefreshTokenRequest]] - code - backend/app/schemas/user.py
- [[Register a new user account.]] - rationale - backend/app/api/endpoints/auth.py
- [[Revokes the current refresh token.]] - rationale - backend/app/api/endpoints/auth.py
- [[Rotates refresh token and returns new access & refresh token pair.]] - rationale - backend/app/api/endpoints/auth.py
- [[Session_8]] - code
- [[Session_9]] - code
- [[Session_10]] - code
- [[TimeEntryCreate]] - code - backend/app/schemas/productivity.py
- [[TimeEntryResponse]] - code - backend/app/schemas/productivity.py
- [[TokenResponse]] - code - backend/app/schemas/user.py
- [[UUID_6]] - code
- [[Update profile details of the current user.]] - rationale - backend/app/api/endpoints/auth.py
- [[Update user UIUX and notification preferences.]] - rationale - backend/app/api/endpoints/auth.py
- [[UserCreate]] - code - backend/app/schemas/user.py
- [[UserDetailResponse]] - code - backend/app/schemas/user.py
- [[UserPreferences_1]] - code - backend/app/models/user.py
- [[UserPreferencesResponse]] - code - backend/app/schemas/user.py
- [[UserPreferencesUpdate]] - code - backend/app/schemas/user.py
- [[UserResponse]] - code - backend/app/schemas/user.py
- [[UserUpdate]] - code - backend/app/schemas/user.py
- [[Verify password against bcrypt or blowfish hash.]] - rationale - backend/app/core/security.py
- [[admin_create_user()]] - code - backend/app/api/endpoints/admin.py
- [[admin_update_user()]] - code - backend/app/api/endpoints/admin.py
- [[auth.py]] - code - backend/app/api/endpoints/auth.py
- [[bcrypt_1]] - concept
- [[change_password()]] - code - backend/app/api/endpoints/auth.py
- [[create_access_token()]] - code - backend/app/core/security.py
- [[create_refresh_token()]] - code - backend/app/core/security.py
- [[decode_token()]] - code - backend/app/core/security.py
- [[get_5]] - code
- [[get_6]] - code
- [[get_current_user()]] - code - backend/app/core/deps.py
- [[get_current_user_profile()]] - code - backend/app/api/endpoints/auth.py
- [[get_system_audit_logs()]] - code - backend/app/api/endpoints/admin.py
- [[hash_password()]] - code - backend/app/core/security.py
- [[hash_token()]] - code - backend/app/core/security.py
- [[hashlib]] - concept
- [[jwt]] - concept
- [[list_all_users()]] - code - backend/app/api/endpoints/admin.py
- [[login()]] - code - backend/app/api/endpoints/auth.py
- [[logout()]] - code - backend/app/api/endpoints/auth.py
- [[post_4]] - code
- [[post_5]] - code
- [[put_1]] - code
- [[put_2]] - code
- [[pydantic]] - concept
- [[refresh_token()]] - code - backend/app/api/endpoints/auth.py
- [[register()]] - code - backend/app/api/endpoints/auth.py
- [[schemascollaboration.py]] - code - backend/app/schemas/collaboration.py
- [[schemasproductivity.py]] - code - backend/app/schemas/productivity.py
- [[schemasuser.py]] - code - backend/app/schemas/user.py
- [[security.py]] - code - backend/app/core/security.py
- [[timedelta]] - code
- [[update_preferences()]] - code - backend/app/api/endpoints/auth.py
- [[update_profile()]] - code - backend/app/api/endpoints/auth.py
- [[verify_password()]] - code - backend/app/core/security.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Admin_Governance_API
SORT file.name ASC
```

## Connections to other communities
- 58 edges to [[_COMMUNITY_API Wiring & Vercel Entrypoint]]
- 44 edges to [[_COMMUNITY_Task & Subtask API]]
- 16 edges to [[_COMMUNITY_AI Copilot Endpoints]]
- 5 edges to [[_COMMUNITY_Projects API]]
- 2 edges to [[_COMMUNITY_Backend Module Graph]]
- 1 edge to [[_COMMUNITY_Excel Schemas]]

## Top bridge nodes
- [[pydantic]] - degree 10, connects to 5 communities
- [[auth.py]] - degree 41, connects to 3 communities
- [[UserResponse]] - degree 24, connects to 3 communities
- [[schemasuser.py]] - degree 21, connects to 3 communities
- [[admin_create_user()]] - degree 10, connects to 3 communities