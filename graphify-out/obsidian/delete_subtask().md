---
source_file: "backend/app/api/endpoints/subtasks.py"
type: "code"
community: "Task & Subtask API"
location: "L67"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Task__Subtask_API
---

# delete_subtask()

## Connections
- [[ResponseEnvelope]] - `uses` [INFERRED]
- [[Session]] - `references` [EXTRACTED]
- [[Subtask_1]] - `uses` [INFERRED]
- [[UUID]] - `references` [EXTRACTED]
- [[User_1]] - `uses` [INFERRED]
- [[delete]] - `references` [EXTRACTED]
- [[get_task_or_404()]] - `calls` [EXTRACTED]
- [[log_task_activity()]] - `calls` [EXTRACTED]
- [[subtasks.py]] - `contains` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Task__Subtask_API