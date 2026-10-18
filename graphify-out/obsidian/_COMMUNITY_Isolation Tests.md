---
type: community
members: 7
---

# Isolation Tests

**Members:** 7 nodes

## Members
- [[test_admin_audit_logs_and_user_denied()]] - code - backend/tests/test_tasks_isolation.py
- [[test_admin_sees_all_tasks()]] - code - backend/tests/test_tasks_isolation.py
- [[test_idor_immunity_on_direct_task_id()]] - code - backend/tests/test_tasks_isolation.py
- [[test_regular_user_isolation()]] - code - backend/tests/test_tasks_isolation.py
- [[test_task_activity_log_is_scoped()]] - code - backend/tests/test_tasks_isolation.py
- [[test_task_creation_and_subtasks()]] - code - backend/tests/test_tasks_isolation.py
- [[test_tasks_isolation.py]] - code - backend/tests/test_tasks_isolation.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Isolation_Tests
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_Schema Migration]]

## Top bridge nodes
- [[test_tasks_isolation.py]] - degree 7, connects to 1 community