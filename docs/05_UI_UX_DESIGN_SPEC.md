# UI/UX Design Specification
## Project: AI-Powered Task Management & To-Do Platform
**Design Standard:** Enterprise Productivity (Linear & Notion Inspired)  
**Document Version:** 1.0.0  
**Status:** Approved  
**Date:** October 2026  

---

## 1. Design Philosophy & Aesthetic Core

The user experience follows a **restrained, light-first, information-dense aesthetic**. Every pixel serves focus and clarity:
- **Zero Decorative Clutter**: No heavy gradient cards, cartoonish illustrations, or oversized margins.
- **Micro-Delight & Velocity**: Ultra-fast keyboard navigation, fluid transitions (<200ms), optimistic UI updates, and clear visual hierarchies.
- **Calm, Focused Tone**: Off-white canvases (`#f8fafc` / `#ffffff`), deep slate typography (`#0f172a`), and purposeful indigo/violet action accents (`#6366f1` / `#4f46e5`).

---

## 2. Design System Tokens & Foundations

### 2.1 Color Palette

#### Canvas & Neutrals
| Token | Hex Code | Usage |
|---|---|---|
| `bg-app` | `#f8fafc` | Main application background |
| `bg-surface` | `#ffffff` | Cards, task drawers, modal dialogues |
| `bg-sidebar` | `#f1f5f9` | Left navigation sidebar |
| `border-subtle` | `#e2e8f0` | Card borders, dividers, table rows |
| `border-focus` | `#6366f1` | Active input border, focused task |
| `text-primary` | `#0f172a` | Headers, titles, primary copy |
| `text-secondary` | `#64748b` | Descriptions, metadata, timestamps |
| `text-muted` | `#94a3b8` | Placeholders, inactive icons |

#### Primary Brand & Accent
| Token | Hex Code | Usage |
|---|---|---|
| `brand-50` | `#eef2ff` | Active sidebar item, subtle badge fill |
| `brand-500` | `#6366f1` | Primary buttons, active tabs, progress bars |
| `brand-600` | `#4f46e5` | Primary button hover state |

#### Semantic Status Tokens
| Status | Background | Text / Border |
|---|---|---|
| **Backlog** | `#f1f5f9` (Slate 100) | `#475569` (Slate 600) |
| **To Do** | `#f3f4f6` (Gray 100) | `#374151` (Gray 700) |
| **In Progress** | `#eff6ff` (Blue 50) | `#2563eb` (Blue 600) |
| **In Review** | `#faf5ff` (Purple 50) | `#9333ea` (Purple 600) |
| **Blocked** | `#fef2f2` (Red 50) | `#dc2626` (Red 600) |
| **Completed** | `#f0fdf4` (Green 50) | `#16a34a` (Green 600) |

#### Priority Tokens
| Priority | Visual Indicator |
|---|---|
| **Low** | Blue dot (`#3b82f6`) |
| **Medium** | Slate indicator (`#64748b`) |
| **High** | Amber flame / badge (`#d97706`) |
| **Urgent** | Crimson exclamation badge (`#dc2626`) |

---

### 2.2 Typography Scale (Inter / Sans-Serif)

| Level | Size | Weight | Line Height | Tracking |
|---|---|---|---|---|
| **Display Heading (H1)** | 24px (1.5rem) | 700 (Bold) | 32px | -0.025em |
| **Section Heading (H2)** | 18px (1.125rem) | 600 (Semibold) | 24px | -0.015em |
| **Component Title (H3)** | 14px (0.875rem) | 600 (Semibold) | 20px | 0em |
| **Body Regular** | 14px (0.875rem) | 400 (Regular) | 20px | 0em |
| **Caption / Meta** | 12px (0.75rem) | 500 (Medium) | 16px | 0.01em |
| **Code / UUID** | 12px (0.75rem) | 400 (Consolas/Mono) | 16px | 0em |

---

## 3. Application Layout Structure

```
┌──────────────┬────────────────────────────────────────────────────────┐
│  Sidebar     │ Topbar: Search [⌘K], Quick Create [+], Notifications, Avatar│
│  (Collapsible│────────────────────────────────────────────────────────┤
│   240px)     │ Page Header: Title, Breadcrumbs, View Switcher [List|Kanban]
│              │ Filter Bar: Status, Priority, Assignee, Date Range     │
│  - Logo      ├──────────────────────────────────┬─────────────────────┤
│  - Inbox     │ Main Content Area:               │ Right Side Detail   │
│  - Today     │                                  │ Drawer (Slide-over) │
│  - My Tasks  │ - List Table /                   │                     │
│  - Kanban    │ - Kanban Columns /               │ - Title & Status    │
│  - Calendar  │ - Analytics Grid                 │ - Subtasks Checklist│
│  - Projects  │                                  │ - Comments Feed     │
│  - AI Copilot│                                  │ - Time Tracker      │
│  - Admin Ops │                                  │ - Activity History  │
└──────────────┴──────────────────────────────────┴─────────────────────┘
```

---

## 4. Detailed Specification of the 20 Core Screens

1. **Authentication (Login & Registration)**: Split-screen minimalist layout. Left: Crisp brand proposition. Right: Input card with validation feedback and demo credentials quick-fill button.
2. **Password Recovery**: Clean two-step email dispatch and token validation interface.
3. **User Dashboard (My Day)**:
   - Greeting with dynamic date and daily progress ring.
   - Four quick-stat pills: *Due Today*, *Overdue*, *In Progress*, *Streak Count*.
   - **AI Morning Briefing**: Summarizes today's 3 most crucial objectives.
4. **Admin Executive Dashboard**:
   - Organization-wide task volume, completion velocities, and overdue heatmaps.
   - Team Workload Distribution bar chart showing task density per team member.
   - Live audit stream of organizational activity.
5. **My Tasks View**: Personal focused cockpit partitioned into *Today*, *Upcoming*, and *Later*.
6. **Task List View**: Dense, customizable table with sorting, bulk selection bar, column reordering, and inline status dropdowns.
7. **Kanban Board**: Multi-column board with smooth HTML5 drag-and-drop, card count badges, WIP limits, and "+ Add card" button in every column.
8. **Calendar & Timeline View**: Interactive monthly calendar with draggable task chips and timeline view showing task dependencies.
9. **Task Creation Modal**: Comprehensive modal with markdown description, assignee selector, project picker, priority flags, and hero image upload.
10. **Task Detail Panel (Slide-over Drawer)**:
    - Sticky top controls: Status, Priority, Assignee, Close.
    - Editable title and auto-saving rich description.
    - Interactive subtasks checklist with progress bar (`X of Y completed`).
    - Threaded comments with user avatars and timestamping.
    - Activity timeline recording exact field changes.
11. **Projects & Categories Hub**: Project cards displaying health metrics, progress bars, and assigned members.
12. **Notification Center**: Bell dropdown with unread badge count, filterable tabs (*All*, *Mentions*, *Assignments*), and *"Mark all read"* action.
13. **AI Task Copilot Drawer**:
    - Natural language input bar: *"Plan my day"*, *"Add task: Deploy staging server by 4pm"*.
    - Interactive suggestions: breakdown tasks, suggest realistic priorities, identify schedule bottlenecks.
14. **Productivity Analytics**: Recharts visualizations for task completion velocity, time tracking breakdown by category, and weekly focus metrics.
15. **User Profile & Preferences**: Avatar upload, theme toggle (Light / Dark), timezone selector, notification preferences, working hour boundaries.
16. **User Management (Admin)**: User roster table with role badges (`Admin`, `User`), active toggles, and account provisioning modal.
17. **Administrative Task Overseer**: Master view allowing administrators to reassign orphaned tasks across team members.
18. **Audit Log Explorer (Admin)**: Filterable chronological log of all changes, deletions, reassignments, and logins with actor attribution.
19. **Excel Data Center**:
    - **Export**: Filterable one-click download for `.xlsx` or `.csv`.
    - **Import**: Drag-and-drop file uploader with schema verification preview modal before committing to database.
20. **System Settings**: Platform-wide configuration, AI engine status indicator, and API key management.

---

## 5. Interaction Quality & Edge Case States

- **Loading States**: Fine-grained skeleton loaders matching the exact geometry of cards and table rows. Never use full-screen blank spinners.
- **Empty States**: Encouraging illustrations, contextual text, and direct primary action buttons (e.g., *"No tasks due today — Enjoy your afternoon or create a new task"*).
- **Toast Notifications**: Crisp floating toast cards (top-right) indicating success, error, or undo actions with 4000ms auto-dismiss.
- **Keyboard Shortcuts**:
  - `⌘ + K` or `Ctrl + K`: Global search and command palette.
  - `C`: Quick create task.
  - `Esc`: Close open modal, drawer, or search palette.

---

## 6. Phase 3 Component Hierarchy & Modular Structure

```text
frontend/src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx         # Responsive frame (Sidebar + Topbar + Content)
│   │   ├── Sidebar.tsx            # Navigation, project list, user badge
│   │   ├── Topbar.tsx             # Search trigger, Quick Create (+), Notifications
│   │   ├── CommandPalette.tsx     # Ctrl+K modal with instant filter & shortcuts
│   │   └── NotificationDropdown.tsx # Bell menu with unread badges & click-through
│   ├── tasks/
│   │   ├── TaskListView.tsx       # Dense tabular task view with sort & multi-select
│   │   ├── TaskKanbanView.tsx     # 6-column HTML5 drag-and-drop board
│   │   ├── TaskCalendarView.tsx   # Monthly calendar grid with date chip events
│   │   ├── TaskCard.tsx           # Reusable task card with badges & indicators
│   │   ├── TaskDetailDrawer.tsx   # Slide-over panel (checklist, comments, audit logs)
│   │   ├── TaskCreateModal.tsx    # Modal with priority flags, URL, image, & NLP
│   │   └── SubtaskChecklist.tsx   # Inline checklist with progress calculation
│   ├── ai/
│   │   ├── AICopilotDrawer.tsx    # Natural language chat, smart planner & breakdown
│   │   ├── AIPrioritizeModal.tsx  # Explainable prioritization rationale display
│   │   └── AISmartScheduleModal.tsx # Daily time-blocking recommendation view
│   ├── excel/
│   │   ├── ExcelExportButton.tsx  # Dynamic stream export trigger
│   │   └── ExcelImportModal.tsx   # Drag-and-drop file upload with preview diff
│   ├── analytics/
│   │   ├── UserAnalyticsView.tsx  # Velocity, streak & category breakdown charts
│   │   └── AdminAnalyticsView.tsx # Team workload distribution & completion heatmap
│   └── common/
│       ├── Badge.tsx              # Semantic status and priority tokens
│       ├── Button.tsx             # Enterprise button variants (primary, subtle, ghost)
│       ├── Modal.tsx              # Backdrop overlay with Esc dismissal
│       ├── ToastContainer.tsx     # Floating notification toast stack
│       └── SkeletonLoader.tsx     # Geometry-matched skeleton loaders
├── store/
│   ├── authStore.ts               # Zustand store for user session and tokens
│   └── uiStore.ts                 # View toggles, active drawers, theme preference
├── services/
│   ├── api.ts                     # Axios client with JWT refresh interceptor
│   ├── taskService.ts             # CRUD & filter API bindings
│   ├── aiService.ts               # AI natural language & chat bindings
│   └── excelService.ts            # Import preview & export bindings
└── types/
    └── index.ts                   # TypeScript interfaces matching backend DTOs
```

---

## 7. Accessibility (WCAG 2.1 AA) & Micro-Interactions

- **Focus Rings**: All interactive controls (`button`, `input`, `select`, `a`) use high-contrast 2px focus rings (`ring-2 ring-indigo-500 ring-offset-2`).
- **Color Contrast**: All typography adheres to minimum 4.5:1 contrast ratio against surface backgrounds (`#0f172a` on `#ffffff`, `#64748b` on `#f8fafc`).
- **Screen Reader Semantics**: Modals and drawers leverage `aria-modal="true"`, `role="dialog"`, and `aria-labelledby`.
- **Fluid Micro-Transitions**: Status badge hover, Kanban card drag elevation (`shadow-md` $\rightarrow$ `shadow-xl`), and drawer slide-in transitions are clamped to 150ms–200ms cubic-bezier easing.

