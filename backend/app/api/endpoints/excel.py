from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.models.task import Task
from app.schemas.excel import (
    ExcelImportPreviewResponse, ExcelImportCommitRequest, ExcelImportResultResponse
)
from app.schemas.common import ResponseEnvelope
from app.services.excel_service import ExcelService
from app.services.task_service import log_task_activity

router = APIRouter()

@router.get("/export")
def export_tasks(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Exports all permitted tasks for the authenticated user as a styled Excel workbook.
    Returns streaming application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.
    """
    buffer = ExcelService.export_tasks_to_excel(db, current_user)
    filename = f"Tasks_Export_{current_user.name.replace(' ', '_')}.xlsx"
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.post("/preview-import", response_model=ResponseEnvelope[ExcelImportPreviewResponse])
async def preview_import(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """
    Upload an Excel (.xlsx) file to validate schema headers and data rows.
    Returns preview without committing any changes to database.
    """
    if not file.filename.endswith((".xlsx", ".xlsm")):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only Excel (.xlsx) files are supported")

    contents = await file.read()
    preview = ExcelService.preview_excel_import(contents, file.filename)
    return ResponseEnvelope(data=preview, message="Import file validated successfully")

@router.post("/commit-import", response_model=ResponseEnvelope[ExcelImportResultResponse])
def commit_import(
    req: ExcelImportCommitRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Imports validated rows from the preview into the live database.
    Assigns tasks to current user or matched email/name if found.
    """
    imported_count = 0
    failed_count = 0
    created_ids = []
    messages = []

    # Map existing users by email and name for assignment
    all_users = db.query(User).all()
    user_email_map = {u.email.lower(): u.id for u in all_users}
    user_name_map = {u.name.lower(): u.id for u in all_users}

    for row in req.items:
        if not row.is_valid:
            failed_count += 1
            continue

        # Determine assignee
        target_assignee_id = current_user.id
        if row.user_email_or_name and current_user.role == "admin":
            ref = row.user_email_or_name.lower().strip()
            if ref in user_email_map:
                target_assignee_id = user_email_map[ref]
            elif ref in user_name_map:
                target_assignee_id = user_name_map[ref]

        task = Task(
            title=row.title,
            description=row.description,
            url=row.url,
            image_url=row.image_url,
            status=row.status or "todo",
            priority=row.priority or "medium",
            creator_id=current_user.id,
            assignee_id=target_assignee_id
        )
        db.add(task)
        db.flush()
        created_ids.append(str(task.id))
        imported_count += 1
        log_task_activity(db, task.id, current_user.id, "imported_from_excel", new_value=task.title)

    db.commit()
    messages.append(f"Successfully imported {imported_count} task(s)")
    if failed_count > 0:
        messages.append(f"Skipped {failed_count} invalid row(s)")

    result = ExcelImportResultResponse(
        imported_tasks_count=imported_count,
        failed_count=failed_count,
        created_task_ids=created_ids,
        messages=messages
    )
    return ResponseEnvelope(data=result, message="Import completed")
