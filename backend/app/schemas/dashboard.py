from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.schemas.application import ApplicationResponse
from app.schemas.interview import InterviewResponse

class DashboardSummary(BaseModel):
    total: int
    wishlist: int
    applied: int
    under_review: int
    online_assessment: int
    interview: int
    offer: int
    rejected: int
    withdrawn: int
    interview_conversion_rate: float
    offer_conversion_rate: float

class StatusDistributionItem(BaseModel):
    name: str
    value: int
    color: str

class TimelineItem(BaseModel):
    date: str
    count: int

class MonthlyStatItem(BaseModel):
    month: str
    applications: int
    interviews: int
    offers: int

class LocationStatItem(BaseModel):
    name: str
    value: int

class WorkModeStatItem(BaseModel):
    name: str
    value: int

class DeadlineItem(BaseModel):
    id: int
    company_name: str
    job_title: str
    deadline: str
    status: str

class DashboardAnalytics(BaseModel):
    status_distribution: List[StatusDistributionItem]
    applications_over_time: List[TimelineItem]
    monthly_stats: List[MonthlyStatItem]
    location_stats: List[LocationStatItem]
    work_mode_stats: List[WorkModeStatItem]
    interview_conversion_rate: float
    offer_conversion_rate: float
    total_applications: int
    total_interviews: int
    total_offers: int
    insights: List[str]

class DashboardRecentApplications(BaseModel):
    recent_applications: List[ApplicationResponse]
    upcoming_interviews: List[InterviewResponse]
    upcoming_deadlines: List[DeadlineItem]
