# User Manual
## Project: HCCDI TaskPilot
**Document Version:** 1.0.0  
**Status:** Current  
**Audience:** Everyone who uses TaskPilot — users and admins  
**Date:** October 2026  

---

## 1. Getting started

### 1.1 Open TaskPilot
Go to the deployment's home page (`/`). The landing page explains the product and plays a 20-second tour. Click **Try the live demo** or **Sign in**.

### 1.2 Sign in
Enter your email and password on `/login` and choose **Sign In to Workspace**. Your access renews itself quietly in the background, so you stay signed in for up to 7 days on that device. Signing out ends the session immediately.

**Demo accounts** (from the original Excel workbook):

| Person | Email | Password | Sees |
|---|---|---|---|
| Alexander Wright (Admin) | `alexander.wright@enterprise.com` | `P@ssw0rd!2026` | Everything in the organisation |
| Sarah Jenkins (User) | `sarah.jenkins@enterprise.com` | `Secur3_Token#88` | Only her own tasks |

The **Quick-fill** buttons under the form enter these for you. Links from the landing page (`/login?demo=admin`, `/login?demo=user`) pre-fill them too.

> These demo credentials are public. On a shared deployment, anyone can sign in with them; reset the data with `scripts/seed_demo.py` (see the [Deployment Guide](./13_DEPLOYMENT_GUIDE.md)).

### 1.3 Find your way around

| Area | What it's for |
|---|---|
| **Sidebar → Workspaces** | Task List, Kanban Board, Calendar & Deadlines, Projects, Productivity Analytics |
| **Sidebar → Intelligence & Data** | AI Copilot Chat, Excel Sync & Export |
| **Sidebar → Admin Center** *(admins only)* | Team & Roles, Audit Trail |
| **Top bar** | Search (`Ctrl/⌘ K`), AI Copilot, Excel Hub, **New Task**, your profile, sign out |
| **Sidebar footer** | Live database status ("Database connected") and version |

On a phone or narrow window, open the sidebar with the **☰** button in the top-left; tapping a destination closes it again.

---

## 2. Working with tasks

### 2.1 Create a task
1. Click **New Task** (or `Ctrl/⌘ K` → **New Task**).
2. Fill in **Task Heading** (required), description, status, priority, optional link and image URL, and due date.
3. Add checklist items one by one, or click **AI Breakdown** to have the Copilot draft 3–7 steps from the heading.
4. Click **Create Task**.

### 2.2 Task List
- Filter by text, status and priority from the bar at the top; the counter shows how many tasks match.
- Change status inline from the status dropdown in each row.
- Select several rows with the checkboxes to **Mark Completed** or **Mark In Progress** in bulk.
- Click a row to open the task drawer.

### 2.3 Kanban Board
Six columns: Backlog, To Do, In Progress, In Review, Blocked, Completed. Drag a card to another column to change its status — dropping on **Completed** celebrates with confetti. The **+** at the top of a column creates a task directly in that status. On a phone, swipe sideways; each swipe snaps to a column.

### 2.4 Calendar & Deadlines
A month grid with each task on its due date. Use the arrows to change month and **Today** to come back. Click a task chip to open it.

### 2.5 The task drawer
Opens on the right when you click a task. Close it with **×**, **Esc**, or by clicking outside it.

| Part | What you can do |
|---|---|
| Top bar | Change status and priority; **Duplicate**; **Archive** (removes it from every view) |
| **Details** | Edit description; tick checklist items (progress bar updates); add steps; **Explain Priority** for the AI's score and reasoning |
| **Comments** | Discuss the task; newest first |
| **Audit Log** | Every change to the task: who, what, when |

### 2.6 Projects
Group related tasks under a project and watch completion roll up (*n of m tasks completed*). Click **New Project**, give it a name and an optional description. Admins see all projects; users see projects they own or belong to.

### 2.7 Search and shortcuts
Press `Ctrl K` (Windows/Linux) or `⌘ K` (macOS) anywhere in the workspace to open the command palette: search tasks by title or description, or jump to **New Task**, **Ask AI Copilot**, **Excel Export**. Press `Esc` to close.

---

## 3. AI Task Copilot

Open it from the top bar or the sidebar. The Copilot only ever reads tasks you are allowed to see.

| Ask | You get |
|---|---|
| **Plan my day** | Today's tasks ordered into a focus schedule |
| **Overdue items** | Tasks past their due date that aren't completed |
| A sentence describing work, e.g. *"Submit Q4 budget report to Alex by next Thursday with urgent priority"* | A draft task: title, priority, due date and checklist. Click **Create Task** to add it |
| A question about your tasks | A short answer with suggested next actions |

Tips for sentences: say the priority (*urgent*, *high*, *low*), and the deadline as *today*, *tomorrow*, a weekday (*by Thursday*, *next Monday*), *in 3 days* or *end of week*. The Copilot works without any AI subscription; if your administrator connects an LLM provider, drafts become richer.

---

## 4. Excel Hub

Open **Excel Hub** from the top bar or **Excel Sync & Export** in the sidebar.

### 4.1 Export
**Export to Excel → Download .XLSX File** downloads every task you can see, with styled headers and dropdowns for status and priority so edits stay valid.

### 4.2 Import with preview
1. **Import with Validation Preview** → choose an `.xlsx` file. The first sheet named like *Task* is used; columns are matched by header (heading/title, description, status, priority, URL, image, user/assignee).
2. Review the preview: each row shows the status and priority it will get. Legacy labels are normalised (*Pending* → To Do, *Under Review* → In Review). Rows **missing a title** are flagged and will be skipped.
3. Confirm to commit the valid rows. Nothing is written before you confirm.

---

## 5. Productivity Analytics
Your totals (assigned, completed, streak, focus time) and sprint completion rate. Admins also see the **organisation workload distribution** across people.

---

## 6. For admins

### 6.1 Team & Roles
Lists everyone with role and status. **Provision User** creates an account (name, email, temporary password, role *user* or *admin*). Share the password securely and ask the person to change it.

Changing a role or deactivating someone is currently done through the API (`PUT /api/admin/users/{id}`; try it from the interactive docs at `/docs`).

### 6.2 Audit Trail
The latest 100 changes across the organisation — task creation, edits, status changes, reassignments, archives, duplicates — newest first.

### 6.3 What users can and can't see
Users see tasks they created, tasks assigned to them, and tasks in projects they belong to. Opening any other task — even with its exact link — shows *not found*. Adding someone to a project gives them access to that project's tasks.

---

## 7. Troubleshooting

| Symptom | What to do |
|---|---|
| "Invalid email or password" | Check caps lock; passwords are case-sensitive. Ask an admin to re-provision you |
| Sent back to sign in | Your session expired or was signed out elsewhere; sign in again |
| Sidebar says **Database unreachable** | The server can't reach the database; tell your administrator |
| A task link says not found | It belongs to someone else's scope, or it was archived |
| Import preview flags rows | Fill in the missing titles in Excel and import again |
| AI answers feel generic | Use concrete words for priority and deadline (see §3); an admin can connect an LLM key |
