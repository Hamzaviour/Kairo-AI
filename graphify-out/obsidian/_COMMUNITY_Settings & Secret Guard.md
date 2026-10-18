---
type: community
members: 7
---

# Settings & Secret Guard

**Members:** 7 nodes

## Members
- [[dot-cors_origin_list()]] - code - backend/app/core/config.py
- [[Authentication & Profiles Endpoints (apiauth)]] - concept - docs/14_API_REFERENCE.md
- [[BaseSettings]] - code
- [[JWT Secret Startup Guard]] - concept - docs/13_DEPLOYMENT_GUIDE.md
- [[PyJWT]] - code - backend/requirements.txt
- [[Settings]] - code - backend/app/core/config.py
- [[Stateless JWT with Refresh Token Rotation]] - concept - README.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Settings__Secret_Guard
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_API Wiring & Vercel Entrypoint]]
- 1 edge to [[_COMMUNITY_User Manual]]
- 1 edge to [[_COMMUNITY_API Reference & AI Specs]]
- 1 edge to [[_COMMUNITY_Backend Dependencies]]
- 1 edge to [[_COMMUNITY_Deployment Guide]]

## Top bridge nodes
- [[Settings]] - degree 4, connects to 1 community
- [[Stateless JWT with Refresh Token Rotation]] - degree 4, connects to 1 community
- [[JWT Secret Startup Guard]] - degree 3, connects to 1 community
- [[PyJWT]] - degree 2, connects to 1 community
- [[Authentication & Profiles Endpoints (apiauth)]] - degree 2, connects to 1 community