---
type: community
members: 4
---

# Priority Scoring

**Members:** 4 nodes

## Members
- [[Explainable Prioritization]] - concept - README.md
- [[Principle AI explains itself]] - concept - PRODUCT.md
- [[Priority Score = w1ProximityToDue + w2BlockerWeight + w3EffortRatio]] - rationale - docs/03_SRS.md
- [[SRS-AI-003 Explainable Priority Recommendation]] - concept - docs/03_SRS.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Priority_Scoring
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_Excel Onboarding Workflow]]
- 1 edge to [[_COMMUNITY_Auth Requirements (SRS)]]
- 1 edge to [[_COMMUNITY_API Reference & AI Specs]]

## Top bridge nodes
- [[SRS-AI-003 Explainable Priority Recommendation]] - degree 3, connects to 1 community
- [[Explainable Prioritization]] - degree 3, connects to 1 community
- [[Principle AI explains itself]] - degree 2, connects to 1 community