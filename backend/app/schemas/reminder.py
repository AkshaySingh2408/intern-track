from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class ReminderBase(BaseModel):
    application_id: Optional[int] = None
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    due_date: datetime
    is_completed: bool = False
    priority: str = Field(default="Medium", description="Low, Medium, High")

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    application_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    is_completed: Optional[bool] = None
    priority: Optional[str] = None

class ReminderResponse(ReminderBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    company_name: Optional[str] = None

    class Config:
        from_attributes = True
