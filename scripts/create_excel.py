from pathlib import Path

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

def create_excel():
    wb = openpyxl.Workbook()

    # Define color scheme and styles
    primary_header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
    secondary_header_fill = PatternFill(start_color="2E75B6", end_color="2E75B6", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    data_font = Font(name="Calibri", size=10)
    
    thin_border = Border(
        left=Side(style='thin', color='D9D9D9'),
        right=Side(style='thin', color='D9D9D9'),
        top=Side(style='thin', color='D9D9D9'),
        bottom=Side(style='thin', color='D9D9D9')
    )

    # -------------------------------------------------------------
    # 1. TASK SHEET
    # -------------------------------------------------------------
    ws_task = wb.active
    ws_task.title = "Task"
    ws_task.views.sheetView[0].showGridLines = True

    task_headers = [
        "Task Heading",
        "Task Description",
        "Task URL",
        "Task Image",
        "Task Status",
        "Task Priority"
    ]

    ws_task.append(task_headers)

    task_data = [
        [
            "Implement User Authentication",
            "Set up JWT authentication, registration, login, and password recovery workflows.",
            "https://app.example.com/tasks/101",
            "https://cdn.example.com/images/auth-mockup.png",
            "In Progress",
            "High"
        ],
        [
            "Design Database Schema",
            "Create ER diagrams and migration scripts for PostgreSQL users and tasks tables.",
            "https://app.example.com/tasks/102",
            "https://cdn.example.com/images/schema-diagram.png",
            "Completed",
            "Medium"
        ],
        [
            "Setup CI/CD Pipeline",
            "Configure GitHub Actions workflow for automated testing, linting, and Docker deployment.",
            "https://app.example.com/tasks/103",
            "https://cdn.example.com/images/pipeline-architecture.png",
            "Pending",
            "Urgent"
        ]
    ]

    for row in task_data:
        ws_task.append(row)

    # Format headers for Task
    for col_num in range(1, len(task_headers) + 1):
        cell = ws_task.cell(row=1, column=col_num)
        cell.fill = primary_header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = thin_border

    # Format data rows for Task
    for row_idx in range(2, len(task_data) + 2):
        for col_idx in range(1, len(task_headers) + 1):
            cell = ws_task.cell(row=row_idx, column=col_idx)
            cell.font = data_font
            cell.border = thin_border
            if col_idx in [5, 6]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx in [3, 4]:
                cell.alignment = Alignment(horizontal="left", vertical="center")
                cell.font = Font(name="Calibri", size=10, color="0563C1", underline="single")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")

    # Add Dropdowns for Task Sheet
    # Task Status Dropdown
    status_dv = DataValidation(
        type="list",
        formula1='"Pending,In Progress,Completed,Blocked,Under Review"',
        allow_blank=True
    )
    status_dv.error = "Please select a valid status from the list."
    status_dv.errorTitle = "Invalid Status"
    status_dv.prompt = "Select task status"
    status_dv.promptTitle = "Task Status"
    ws_task.add_data_validation(status_dv)
    status_dv.add("E2:E1000")

    # Task Priority Dropdown
    priority_dv = DataValidation(
        type="list",
        formula1='"Low,Medium,High,Urgent"',
        allow_blank=True
    )
    priority_dv.error = "Please select a valid priority from the list."
    priority_dv.errorTitle = "Invalid Priority"
    priority_dv.prompt = "Select task priority"
    priority_dv.promptTitle = "Task Priority"
    ws_task.add_data_validation(priority_dv)
    priority_dv.add("F2:F1000")

    # Adjust column widths
    ws_task.row_dimensions[1].height = 28
    for row_idx in range(2, len(task_data) + 2):
        ws_task.row_dimensions[row_idx].height = 22

    for col in ws_task.columns:
        col_letter = get_column_letter(col[0].column)
        max_len = max(len(str(cell.value or '')) for cell in col)
        ws_task.column_dimensions[col_letter].width = max(max_len + 4, 16)
    ws_task.column_dimensions['B'].width = 40  # Description wider

    # -------------------------------------------------------------
    # 2. USERS SHEET
    # -------------------------------------------------------------
    ws_users = wb.create_sheet(title="Users")
    ws_users.views.sheetView[0].showGridLines = True

    users_headers = [
        "User Name",
        "User Email",
        "User Password",
        "Profile Pic"
    ]

    ws_users.append(users_headers)

    users_data = [
        [
            "Alexander Wright",
            "alexander.wright@enterprise.com",
            "P@ssw0rd!2026",
            "https://cdn.example.com/avatars/user-alexander.jpg"
        ],
        [
            "Sarah Jenkins",
            "sarah.jenkins@enterprise.com",
            "Secur3_Token#88",
            "https://cdn.example.com/avatars/user-sarah.jpg"
        ]
    ]

    for row in users_data:
        ws_users.append(row)

    # Format headers for Users
    for col_num in range(1, len(users_headers) + 1):
        cell = ws_users.cell(row=1, column=col_num)
        cell.fill = secondary_header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = thin_border

    # Format data rows for Users
    for row_idx in range(2, len(users_data) + 2):
        for col_idx in range(1, len(users_headers) + 1):
            cell = ws_users.cell(row=row_idx, column=col_idx)
            cell.font = data_font
            cell.border = thin_border
            if col_idx == 4:
                cell.alignment = Alignment(horizontal="left", vertical="center")
                cell.font = Font(name="Calibri", size=10, color="0563C1", underline="single")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")

    # Adjust row & column widths for Users
    ws_users.row_dimensions[1].height = 28
    for row_idx in range(2, len(users_data) + 2):
        ws_users.row_dimensions[row_idx].height = 22

    for col in ws_users.columns:
        col_letter = get_column_letter(col[0].column)
        max_len = max(len(str(cell.value or '')) for cell in col)
        ws_users.column_dimensions[col_letter].width = max(max_len + 5, 20)

    # Save to file
    file_path = str(Path(__file__).resolve().parent.parent / "data" / "Tasks_and_Users.xlsx")
    wb.save(file_path)
    print(f"Successfully generated Excel workbook at: {file_path}")

if __name__ == "__main__":
    create_excel()
