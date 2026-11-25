from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class ApplicationBase(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=100)
    job_title: str = Field(..., min_length=1, max_length=100)
    job_description: Optional[str] = None
    company_website: Optional[str] = None
    application_url: Optional[str] = None
    location: Optional[str] = None
    work_mode: str = Field(default="Remote", description="Remote, Hybrid, On-site")
    employment_type: str = Field(default="Internship", description="Internship, Full-time, Co-op, Contract")
    salary: Optional[str] = None
    application_date: Optional[datetime] = None
    deadline: Optional[datetime] = None
    status: str = Field(default="Applied", description="Wishlist, Applied, Under Review, Online Assessment, Interview, Offer, Rejected, Withdrawn")
    recruiter_name: Optional[str] = None
    recruiter_email: Optional[str] = None
    interview_date: Optional[datetime] = None
    notes: Optional[str] = None
    resume_version: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    company_website: Optional[str] = None
    application_url: Optional[str] = None
    location: Optional[str] = None
    work_mode: Optional[str] = None
    employment_type: Optional[str] = None
    salary: Optional[str] = None
    application_date: Optional[datetime] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None
    recruiter_name: Optional[str] = None
    recruiter_email: Optional[str] = None
    interview_date: Optional[datetime] = None
    notes: Optional[str] = None
    resume_version: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str

class ApplicationResponse(ApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ApplicationListResponse(BaseModel):
    items: List[ApplicationResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
