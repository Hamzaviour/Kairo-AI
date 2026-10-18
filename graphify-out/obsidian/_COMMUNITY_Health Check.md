---
type: community
members: 5
---

# Health Check

**Members:** 5 nodes

## Members
- [[GET apihealth]] - concept - docs/14_API_REFERENCE.md
- [[Verify backend and live database connectivity.]] - rationale - backend/app/main.py
- [[get_7]] - code
- [[health_check()]] - code - backend/app/main.py
- [[time]] - concept

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Health_Check
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_API Wiring & Vercel Entrypoint]]
- 1 edge to [[_COMMUNITY_API Reference & AI Specs]]
- 1 edge to [[_COMMUNITY_Proposal Architecture & Cost]]

## Top bridge nodes
- [[GET apihealth]] - degree 3, connects to 2 communities
- [[health_check()]] - degree 5, connects to 1 community
- [[time]] - degree 2, connects to 1 community