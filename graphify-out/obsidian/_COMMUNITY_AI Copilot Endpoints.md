---
type: community
members: 48
---

# AI Copilot Endpoints

**Members:** 48 nodes

## Members
- [[dot-_extract_due_date()]] - code - backend/app/services/ai_service.py
- [[dot-_generate_heuristic_subtasks()]] - code - backend/app/services/ai_service.py
- [[dot-answer_chat()]] - code - backend/app/services/ai_service.py
- [[dot-breakdown_subtasks()]] - code - backend/app/services/ai_service.py
- [[dot-generate_smart_schedule()]] - code - backend/app/services/ai_service.py
- [[dot-log_interaction()]] - code - backend/app/services/ai_service.py
- [[dot-parse_task_nlp()]] - code - backend/app/services/ai_service.py
- [[dot-prioritize_task()]] - code - backend/app/services/ai_service.py
- [[AIChatRequest]] - code - backend/app/schemas/ai.py
- [[AIChatResponse]] - code - backend/app/schemas/ai.py
- [[AIService]] - code - backend/app/services/ai_service.py
- [[Answers natural language questions strictly scoped to the user's permitted…]] - rationale - backend/app/services/ai_service.py
- [[Audit log the AI interaction scoped to the user.]] - rationale - backend/app/services/ai_service.py
- [[BaseModel_7]] - code
- [[Calculates explainable priority score based on - Due date proximity - Effort -…]] - rationale - backend/app/services/ai_service.py
- [[Constructs an optimized daily schedule for the authenticated user,…]] - rationale - backend/app/services/ai_service.py
- [[DailyScheduleItem]] - code - backend/app/schemas/ai.py
- [[Decomposes a broad task into actionable subtask checklist items.]] - rationale - backend/app/api/endpoints/ai.py
- [[Deconstructs high-level task into 3-6 actionable subtasks.]] - rationale - backend/app/services/ai_service.py
- [[Generates an optimized daily schedule incorporating strictly the authenticated…]] - rationale - backend/app/api/endpoints/ai.py
- [[Generates realistic structured subtasks based on verbs and intent.]] - rationale - backend/app/services/ai_service.py
- [[Natural-language task assistant strictly scoped to the requesting user's…]] - rationale - backend/app/api/endpoints/ai.py
- [[ParseTaskRequest]] - code - backend/app/schemas/ai.py
- [[ParsedTaskResponse]] - code - backend/app/schemas/ai.py
- [[Parses natural language into a structured task with priority, due date, and…]] - rationale - backend/app/services/ai_service.py
- [[Parses natural language notes into structured task parameters (title, priority,…]] - rationale - backend/app/api/endpoints/ai.py
- [[PrioritizeRequest]] - code - backend/app/schemas/ai.py
- [[PrioritizeResponse]] - code - backend/app/schemas/ai.py
- [[Recommends explainable priority scoring considering due date proximity,…]] - rationale - backend/app/api/endpoints/ai.py
- [[Resolve relative date phrases (next thursday, in 3 days, tomorrow) to a…]] - rationale - backend/app/services/ai_service.py
- [[Session_12]] - code
- [[Session_13]] - code
- [[SmartScheduleResponse]] - code - backend/app/schemas/ai.py
- [[SubtaskBreakdownRequest]] - code - backend/app/schemas/ai.py
- [[SubtaskBreakdownResponse]] - code - backend/app/schemas/ai.py
- [[UUID_7]] - code
- [[User_1]] - code - backend/app/models/user.py
- [[ai_service.py]] - code - backend/app/services/ai_service.py
- [[at()]] - code - backend/app/services/ai_service.py
- [[breakdown_task_route()]] - code - backend/app/api/endpoints/ai.py
- [[chat_copilot_route()]] - code - backend/app/api/endpoints/ai.py
- [[endpointsai.py]] - code - backend/app/api/endpoints/ai.py
- [[parse_task_route()]] - code - backend/app/api/endpoints/ai.py
- [[post_7]] - code
- [[prioritize_task_route()]] - code - backend/app/api/endpoints/ai.py
- [[re]] - concept
- [[schemasai.py]] - code - backend/app/schemas/ai.py
- [[smart_schedule_route()]] - code - backend/app/api/endpoints/ai.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/AI_Copilot_Endpoints
SORT file.name ASC
```

## Connections to other communities
- 51 edges to [[_COMMUNITY_Task & Subtask API]]
- 44 edges to [[_COMMUNITY_API Wiring & Vercel Entrypoint]]
- 16 edges to [[_COMMUNITY_Admin Governance API]]
- 9 edges to [[_COMMUNITY_Projects API]]
- 3 edges to [[_COMMUNITY_Excel Export]]
- 2 edges to [[_COMMUNITY_Excel Import API]]
- 1 edge to [[_COMMUNITY_Backend Module Graph]]
- 1 edge to [[_COMMUNITY_API Reference & AI Specs]]
- 1 edge to [[_COMMUNITY_Excel Tests]]
- 1 edge to [[_COMMUNITY_Schema Migration]]
- 1 edge to [[_COMMUNITY_Technical Requirements (TRD)]]

## Top bridge nodes
- [[User_1]] - degree 87, connects to 7 communities
- [[ai_service.py]] - degree 26, connects to 5 communities
- [[AIService]] - degree 25, connects to 3 communities
- [[schemasai.py]] - degree 17, connects to 3 communities
- [[endpointsai.py]] - degree 31, connects to 2 communities