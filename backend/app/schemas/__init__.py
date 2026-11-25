from app.schemas.user import (
    UserRegister, UserLogin, UserProfileUpdate, UserResponse, Token, TokenData
)
from app.schemas.application import (
    ApplicationCreate, ApplicationUpdate, ApplicationStatusUpdate, ApplicationResponse, ApplicationListResponse
)
from app.schemas.interview import (
    InterviewCreate, InterviewUpdate, InterviewResponse
)
from app.schemas.reminder import (
    ReminderCreate, ReminderUpdate, ReminderResponse
)
from app.schemas.note import (
    NoteCreate, NoteUpdate, NoteResponse
)
from app.schemas.dashboard import (
    DashboardSummary, DashboardAnalytics, DashboardRecentApplications
)

__all__ = [
    "UserRegister", "UserLogin", "UserProfileUpdate", "UserResponse", "Token", "TokenData",
    "ApplicationCreate", "ApplicationUpdate", "ApplicationStatusUpdate", "ApplicationResponse", "ApplicationListResponse",
    "InterviewCreate", "InterviewUpdate", "InterviewResponse",
    "ReminderCreate", "ReminderUpdate", "ReminderResponse",
    "NoteCreate", "NoteUpdate", "NoteResponse",
    "DashboardSummary", "DashboardAnalytics", "DashboardRecentApplications"
]
