"""
Excel Workbook Migration Script
================================
- Backs up original data
- Adds UUID 'id' column to Tasks and Users sheets
- Adds 'user_id' column to Tasks sheet
- Adds 'role' column to Users sheet
- Normalizes status values
- Adds computed 'task_ids' column to Users sheet
- Generates a migration report
"""

import uuid
import json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter
from datetime import datetime
from pathlib import Path

# ------------------------------------------------------------------
# Configuration: workbooks live in the repository's data/ folder
# ------------------------------------------------------------------
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
INPUT_FILE = str(DATA_DIR / "Tasks_and_Users.xlsx")
OUTPUT_FILE = str(DATA_DIR / "Tasks_and_Users_Updated.xlsx")
REPORT_FILE = str(DATA_DIR / "migration_report.json")

# Status mapping: old -> new
STATUS_MAP = {
    "Pending": "To Do",
    "In Progress": "In Progress",
    "Completed": "Completed",
    "Blocked": "Blocked",
    "Under Review": "In Review",
}

# Priority values (unchanged, already valid)
VALID_PRIORITIES = ["Low", "Medium", "High", "Urgent"]

# Styles
header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
header_fill_users = PatternFill(start_color="2E75B6", end_color="2E75B6", fill_type="solid")
header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
data_font = Font(name="Calibri", size=10)
id_font = Font(name="Consolas", size=9, color="666666")
thin_border = Border(
    left=Side(style='thin', color='D9D9D9'),
    right=Side(style='thin', color='D9D9D9'),
    top=Side(style='thin', color='D9D9D9'),
    bottom=Side(style='thin', color='D9D9D9')
)

# ------------------------------------------------------------------
# Read existing data
# ------------------------------------------------------------------
wb = openpyxl.load_workbook(INPUT_FILE)

report = {
    "migration_timestamp": datetime.now().isoformat(),
    "source_file": INPUT_FILE,
    "output_file": OUTPUT_FILE,
    "changes": [],
    "warnings": [],
    "users": [],
    "tasks": [],
    "relationships": [],
}

# --- Read Users ---
ws_users = wb["Users"]
users_raw = []
for row in ws_users.iter_rows(min_row=2, max_row=ws_users.max_row, values_only=True):
    users_raw.append({
        "name": row[0],
        "email": row[1],
        "password": row[2],
        "profile_pic": row[3],
    })

# --- Read Tasks ---
ws_tasks = wb["Task"]
tasks_raw = []
for row in ws_tasks.iter_rows(min_row=2, max_row=ws_tasks.max_row, values_only=True):
    tasks_raw.append({
        "heading": row[0],
        "description": row[1],
        "url": row[2],
        "image": row[3],
        "status": row[4],
        "priority": row[5],
    })

report["changes"].append(f"Read {len(users_raw)} users from 'Users' sheet")
report["changes"].append(f"Read {len(tasks_raw)} tasks from 'Task' sheet")

# ------------------------------------------------------------------
# Generate IDs
# ------------------------------------------------------------------
user_ids = []
for u in users_raw:
    uid = str(uuid.uuid4())
    u["id"] = uid
    user_ids.append(uid)
    report["users"].append({"id": uid, "name": u["name"], "email": u["email"]})

task_ids = []
for t in tasks_raw:
    tid = str(uuid.uuid4())
    t["id"] = tid
    task_ids.append(tid)

report["changes"].append(f"Generated {len(user_ids)} user UUIDs")
report["changes"].append(f"Generated {len(task_ids)} task UUIDs")

# ------------------------------------------------------------------
# Assign roles
# ------------------------------------------------------------------
# First user -> admin, rest -> user
for i, u in enumerate(users_raw):
    u["role"] = "admin" if i == 0 else "user"
    report["changes"].append(f"Assigned role '{u['role']}' to user '{u['name']}'")

# ------------------------------------------------------------------
# Assign tasks to users (round-robin since no existing relationship)
# ------------------------------------------------------------------
for i, t in enumerate(tasks_raw):
    assigned_user = users_raw[i % len(users_raw)]
    t["user_id"] = assigned_user["id"]
    report["relationships"].append({
        "task_id": t["id"],
        "task_heading": t["heading"],
        "user_id": assigned_user["id"],
        "user_name": assigned_user["name"],
        "assignment_method": "round_robin (no existing relationship found)",
    })

report["changes"].append("Assigned tasks to users using round-robin (no existing user_id column)")

# ------------------------------------------------------------------
# Normalize status values
# ------------------------------------------------------------------
for t in tasks_raw:
    old_status = t["status"]
    new_status = STATUS_MAP.get(old_status, old_status)
    if old_status != new_status:
        report["changes"].append(f"Status normalized: '{old_status}' -> '{new_status}' for task '{t['heading']}'")
    t["status"] = new_status

# ------------------------------------------------------------------
# Validate priorities
# ------------------------------------------------------------------
for t in tasks_raw:
    if t["priority"] not in VALID_PRIORITIES:
        report["warnings"].append(f"Invalid priority '{t['priority']}' on task '{t['heading']}' — kept as-is")

# ------------------------------------------------------------------
# Compute task_ids for users
# ------------------------------------------------------------------
user_task_map = {}
for t in tasks_raw:
    uid = t["user_id"]
    if uid not in user_task_map:
        user_task_map[uid] = []
    user_task_map[uid].append(t["id"])

for u in users_raw:
    u["task_ids"] = ",".join(user_task_map.get(u["id"], []))

# ------------------------------------------------------------------
# Build updated workbook
# ------------------------------------------------------------------
wb_new = openpyxl.Workbook()

# --- TASK SHEET ---
ws_task = wb_new.active
ws_task.title = "Task"

task_headers = [
    "ID", "Task Heading", "Task Description", "Task URL",
    "Task Image", "Task Status", "Task Priority", "User ID"
]
ws_task.append(task_headers)

for t in tasks_raw:
    ws_task.append([
        t["id"], t["heading"], t["description"], t["url"],
        t["image"], t["status"], t["priority"], t["user_id"]
    ])
    report["tasks"].append({
        "id": t["id"],
        "heading": t["heading"],
        "status": t["status"],
        "priority": t["priority"],
        "user_id": t["user_id"],
    })

# Format Task headers
for col_num in range(1, len(task_headers) + 1):
    cell = ws_task.cell(row=1, column=col_num)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = thin_border

# Format Task data rows
for row_idx in range(2, len(tasks_raw) + 2):
    for col_idx in range(1, len(task_headers) + 1):
        cell = ws_task.cell(row=row_idx, column=col_idx)
        cell.border = thin_border
        if col_idx in [1, 8]:  # ID and User ID
            cell.font = id_font
            cell.alignment = Alignment(horizontal="left", vertical="center")
        elif col_idx in [6, 7]:  # Status, Priority
            cell.font = data_font
            cell.alignment = Alignment(horizontal="center", vertical="center")
        elif col_idx in [4, 5]:  # URL, Image
            cell.font = Font(name="Calibri", size=10, color="0563C1", underline="single")
            cell.alignment = Alignment(horizontal="left", vertical="center")
        else:
            cell.font = data_font
            cell.alignment = Alignment(horizontal="left", vertical="center")

# Data validations
status_dv = DataValidation(
    type="list",
    formula1='"Backlog,To Do,In Progress,In Review,Blocked,Completed"',
    allow_blank=True
)
status_dv.error = "Please select a valid status."
status_dv.errorTitle = "Invalid Status"
ws_task.add_data_validation(status_dv)
status_dv.add("F2:F1000")

priority_dv = DataValidation(
    type="list",
    formula1='"Low,Medium,High,Urgent"',
    allow_blank=True
)
priority_dv.error = "Please select a valid priority."
priority_dv.errorTitle = "Invalid Priority"
ws_task.add_data_validation(priority_dv)
priority_dv.add("G2:G1000")

# Column widths
ws_task.column_dimensions['A'].width = 38  # ID
ws_task.column_dimensions['B'].width = 30  # Heading
ws_task.column_dimensions['C'].width = 50  # Description
ws_task.column_dimensions['D'].width = 35  # URL
ws_task.column_dimensions['E'].width = 35  # Image
ws_task.column_dimensions['F'].width = 14  # Status
ws_task.column_dimensions['G'].width = 14  # Priority
ws_task.column_dimensions['H'].width = 38  # User ID

ws_task.row_dimensions[1].height = 28
for row_idx in range(2, len(tasks_raw) + 2):
    ws_task.row_dimensions[row_idx].height = 22

# --- USERS SHEET ---
ws_users_new = wb_new.create_sheet(title="Users")

users_headers = [
    "ID", "User Name", "User Email", "User Password",
    "Profile Pic", "Role", "Task IDs"
]
ws_users_new.append(users_headers)

for u in users_raw:
    ws_users_new.append([
        u["id"], u["name"], u["email"], u["password"],
        u["profile_pic"], u["role"], u["task_ids"]
    ])

# Format Users headers
for col_num in range(1, len(users_headers) + 1):
    cell = ws_users_new.cell(row=1, column=col_num)
    cell.fill = header_fill_users
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = thin_border

# Format Users data
for row_idx in range(2, len(users_raw) + 2):
    for col_idx in range(1, len(users_headers) + 1):
        cell = ws_users_new.cell(row=row_idx, column=col_idx)
        cell.border = thin_border
        if col_idx in [1, 7]:  # ID and Task IDs
            cell.font = id_font
            cell.alignment = Alignment(horizontal="left", vertical="center")
        elif col_idx == 5:  # Profile Pic
            cell.font = Font(name="Calibri", size=10, color="0563C1", underline="single")
            cell.alignment = Alignment(horizontal="left", vertical="center")
        elif col_idx == 6:  # Role
            cell.font = data_font
            cell.alignment = Alignment(horizontal="center", vertical="center")
        else:
            cell.font = data_font
            cell.alignment = Alignment(horizontal="left", vertical="center")

# Role validation
role_dv = DataValidation(
    type="list",
    formula1='"admin,user"',
    allow_blank=False
)
role_dv.error = "Must be admin or user."
ws_users_new.add_data_validation(role_dv)
role_dv.add("F2:F1000")

# Column widths
ws_users_new.column_dimensions['A'].width = 38
ws_users_new.column_dimensions['B'].width = 22
ws_users_new.column_dimensions['C'].width = 35
ws_users_new.column_dimensions['D'].width = 20
ws_users_new.column_dimensions['E'].width = 45
ws_users_new.column_dimensions['F'].width = 10
ws_users_new.column_dimensions['G'].width = 80

ws_users_new.row_dimensions[1].height = 28
for row_idx in range(2, len(users_raw) + 2):
    ws_users_new.row_dimensions[row_idx].height = 22

# ------------------------------------------------------------------
# Save
# ------------------------------------------------------------------
wb_new.save(OUTPUT_FILE)
print(f"Updated workbook saved: {OUTPUT_FILE}")

# Save report
with open(REPORT_FILE, "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)
print(f"Migration report saved: {REPORT_FILE}")

# Print summary
print(f"\n{'='*60}")
print(f"MIGRATION SUMMARY")
print(f"{'='*60}")
print(f"Users migrated: {len(users_raw)}")
print(f"Tasks migrated: {len(tasks_raw)}")
print(f"Changes made: {len(report['changes'])}")
print(f"Warnings: {len(report['warnings'])}")
print(f"Relationships created: {len(report['relationships'])}")
print()
for c in report["changes"]:
    print(f"  ✓ {c}")
for w in report["warnings"]:
    print(f"  ⚠ {w}")
print()
print("User → Task assignments:")
for r in report["relationships"]:
    print(f"  {r['user_name']} <- {r['task_heading']}")
