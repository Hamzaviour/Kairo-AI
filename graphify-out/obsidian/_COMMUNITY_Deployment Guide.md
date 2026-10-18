---
type: community
members: 8
---

# Deployment Guide

**Members:** 8 nodes

## Members
- [[001_initial_schema.sql Migration]] - concept - docs/13_DEPLOYMENT_GUIDE.md
- [[Day-Two Operations (rollback, schema change, secret rotation)]] - concept - docs/13_DEPLOYMENT_GUIDE.md
- [[Deployment Guide (Vercel + Neon)]] - document - docs/13_DEPLOYMENT_GUIDE.md
- [[Environment Variables (DATABASE_URL, JWT_SECRET_KEY, AI_)]] - concept - docs/13_DEPLOYMENT_GUIDE.md
- [[Function Limits (30s maxDuration, in-memory Excel)]] - concept - docs/13_DEPLOYMENT_GUIDE.md
- [[Root Requirements (Vercel function)]] - code - requirements.txt
- [[Vercel Deployment (static CDN + Python function)]] - concept - docs/13_DEPLOYMENT_GUIDE.md
- [[vercel.json Routing (api, docs - function; SPA fallback)]] - concept - docs/13_DEPLOYMENT_GUIDE.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Deployment_Guide
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_Backend Module Graph]]
- 1 edge to [[_COMMUNITY_API Wiring & Vercel Entrypoint]]
- 1 edge to [[_COMMUNITY_User Manual]]
- 1 edge to [[_COMMUNITY_Proposal Architecture & Cost]]
- 1 edge to [[_COMMUNITY_Backend Dependencies]]
- 1 edge to [[_COMMUNITY_Schema Migration]]
- 1 edge to [[_COMMUNITY_Settings & Secret Guard]]

## Top bridge nodes
- [[Deployment Guide (Vercel + Neon)]] - degree 10, connects to 3 communities
- [[Vercel Deployment (static CDN + Python function)]] - degree 6, connects to 3 communities
- [[Root Requirements (Vercel function)]] - degree 2, connects to 1 community