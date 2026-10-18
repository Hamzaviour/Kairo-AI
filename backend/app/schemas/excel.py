from typing import List, Optional, Any
from pydantic import BaseModel

class ExcelTaskPreviewRow(BaseModel):
    row_number: int
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    status: str
    priority: str
    user_email_or_name: Optional[str] = None
    is_valid: bool = True
    validation_error: Optional[str] = None

class ExcelImportPreviewResponse(BaseModel):
    filename: str
    total_rows_detected: int
    valid_rows_count: int
    invalid_rows_count: int
    users_sheet_found: bool
    tasks_sheet_found: bool
    preview_items: List[ExcelTaskPreviewRow]
    warnings: List[str] = []

class ExcelImportCommitRequest(BaseModel):
    items: List[ExcelTaskPreviewRow]
    assign_unknown_to_me: bool = True

class ExcelImportResultResponse(BaseModel):
    imported_tasks_count: int
    failed_count: int
    created_task_ids: List[str] = []
    messages: List[str] = []
