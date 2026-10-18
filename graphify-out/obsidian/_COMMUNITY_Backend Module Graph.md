---
type: community
members: 14
---

# Backend Module Graph

**Members:** 14 nodes

## Members
- [[Demo Accounts (Alexander Wright admin, Sarah Jenkins user)]] - concept - docs/12_USER_MANUAL.md
- [[Demo Database Bootstrap & Seed Script ===================================== -…]] - rationale - scripts/seed_demo.py
- [[app_core_database]] - concept
- [[app_core_security]] - concept
- [[app_models]] - concept
- [[app_models_collaboration]] - concept
- [[app_models_project]] - concept
- [[app_models_task]] - concept
- [[app_models_user]] - concept
- [[ensure_schema()]] - code - scripts/seed_demo.py
- [[load_excel()]] - code - scripts/seed_demo.py
- [[pathlib]] - concept
- [[seed()]] - code - scripts/seed_demo.py
- [[seed_demo.py]] - code - scripts/seed_demo.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Backend_Module_Graph
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_API Wiring & Vercel Entrypoint]]
- 3 edges to [[_COMMUNITY_Task & Subtask API]]
- 2 edges to [[_COMMUNITY_Admin Governance API]]
- 2 edges to [[_COMMUNITY_Projects API]]
- 2 edges to [[_COMMUNITY_Deployment Guide]]
- 2 edges to [[_COMMUNITY_User Manual]]
- 1 edge to [[_COMMUNITY_AI Copilot Endpoints]]
- 1 edge to [[_COMMUNITY_Excel Onboarding Workflow]]
- 1 edge to [[_COMMUNITY_Test Fixtures & Video Synth]]
- 1 edge to [[_COMMUNITY_Excel Tests]]

## Top bridge nodes
- [[seed()]] - degree 15, connects to 7 communities
- [[seed_demo.py]] - degree 18, connects to 3 communities
- [[ensure_schema()]] - degree 3, connects to 1 community
- [[Demo Accounts (Alexander Wright admin, Sarah Jenkins user)]] - degree 2, connects to 1 community