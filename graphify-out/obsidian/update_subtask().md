---
source_file: "backend/app/api/endpoints/subtasks.py"
type: "code"
community: "Task & Subtask API"
location: "L38"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Task__Subtask_API
---

# update_subtask()

## Connections
- [[ResponseEnvelope]] - `uses` [INFERRED]
- [[Session]] - `references` [EXTRACTED]
- [[Subtask_1]] - `uses` [INFERRED]
- [[SubtaskResponse]] - `uses` [INFERRED]
- [[SubtaskUpdate]] - `uses` [INFERRED]
- [[Toggle subtask completion or update its title.]] - `rationale_for` [EXTRACTED]
- [[UUID]] - `references` [EXTRACTED]
- [[User_1]] - `uses` [INFERRED]
- [[get_task_or_404()]] - `calls` [EXTRACTED]
- [[log_task_activity()]] - `calls` [EXTRACTED]
- [[patch]] - `references` [EXTRACTED]
- [[subtasks.py]] - `contains` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Task__Subtask_API