---
type: community
members: 7
---

# Auth Tests

**Members:** 7 nodes

## Members
- [[test_admin_login()]] - code - backend/tests/test_auth.py
- [[test_auth.py]] - code - backend/tests/test_auth.py
- [[test_get_me()]] - code - backend/tests/test_auth.py
- [[test_healthcheck()]] - code - backend/tests/test_auth.py
- [[test_invalid_login()]] - code - backend/tests/test_auth.py
- [[test_refresh_token_rotation()]] - code - backend/tests/test_auth.py
- [[test_user_login()]] - code - backend/tests/test_auth.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Auth_Tests
SORT file.name ASC
```
