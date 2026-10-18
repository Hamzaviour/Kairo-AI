---
type: community
members: 12
---

# Product Capabilities

**Members:** 12 nodes

## Members
- [[AccessRefresh Token Rotation]] - concept - docs/11_WORKFLOWS.md
- [[Administration Workflow]] - concept - docs/11_WORKFLOWS.md
- [[CtrlCmd K Command Palette]] - concept - docs/10_PRODUCT_PROPOSAL.md
- [[Daily Work Flow (Individual Contributor)]] - concept - docs/11_WORKFLOWS.md
- [[Engineering Workflow (Branch, PR, Vercel Deploy)]] - concept - docs/11_WORKFLOWS.md
- [[Four Ways to Work (List, Kanban, Calendar, Drawer)]] - concept - docs/10_PRODUCT_PROPOSAL.md
- [[Governance (Provisioning, Audit Trail, Analytics)]] - concept - docs/10_PRODUCT_PROPOSAL.md
- [[Knowledge Graph Refresh (graphify update)]] - concept - docs/11_WORKFLOWS.md
- [[Task Archiving (is_archived soft delete)]] - concept - docs/11_WORKFLOWS.md
- [[Task Lifecycle (Status State Machine)]] - concept - docs/11_WORKFLOWS.md
- [[Workflows]] - document - docs/11_WORKFLOWS.md
- [[task_activity_logs (Immutable Activity Log)]] - concept - docs/11_WORKFLOWS.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Product_Capabilities
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_Task & Subtask API]]
- 2 edges to [[_COMMUNITY_Proposal Scope & Risks]]
- 2 edges to [[_COMMUNITY_Proposal Architecture & Cost]]
- 1 edge to [[_COMMUNITY_Excel Export]]

## Top bridge nodes
- [[Workflows]] - degree 9, connects to 3 communities
- [[Engineering Workflow (Branch, PR, Vercel Deploy)]] - degree 3, connects to 1 community
- [[Four Ways to Work (List, Kanban, Calendar, Drawer)]] - degree 2, connects to 1 community
- [[Governance (Provisioning, Audit Trail, Analytics)]] - degree 2, connects to 1 community
- [[task_activity_logs (Immutable Activity Log)]] - degree 2, connects to 1 community