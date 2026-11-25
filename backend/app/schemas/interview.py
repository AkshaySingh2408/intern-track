from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class InterviewBase(BaseModel):
    application_id: int
    interview_type: str = Field(default="Technical", description="Technical, HR, Behavioral, Other")
    interview_date: datetime
    meeting_link: Optional[str] = None
    status: str = Field(default="Scheduled", description="Scheduled, Completed, Cancelled")
    preparation_notes: Optional[str] = None

class InterviewCreate(InterviewBase):
    pass

class InterviewUpdate(BaseModel):
    application_id: Optional[int] = None
    interview_type: Optional[str] = None
    interview_date: Optional[datetime] = None
    meeting_link: Optional[str] = None
    status: Optional[str] = None
    preparation_notes: Optional[str] = None

class InterviewResponse(InterviewBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    company_name: Optional[str] = None
    job_title: Optional[str] = None

    class Config:
        from_attributes = True
