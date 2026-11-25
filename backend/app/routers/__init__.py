from app.routers.auth import router as auth_router
from app.routers.applications import router as applications_router
from app.routers.dashboard import router as dashboard_router
from app.routers.interviews import router as interviews_router
from app.routers.reminders import router as reminders_router
from app.routers.notes import router as notes_router
from app.routers.profile import router as profile_router

__all__ = [
    "auth_router",
    "applications_router",
    "dashboard_router",
    "interviews_router",
    "reminders_router",
    "notes_router",
    "profile_router"
]
