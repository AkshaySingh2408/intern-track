import logging
from datetime import datetime
from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings
from app.database import engine, Base, get_db
import app.models  # Ensure all models are registered
from app.routers import (
    auth_router,
    applications_router,
    dashboard_router,
    interviews_router,
    reminders_router,
    notes_router,
    profile_router
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables if not existing
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
except Exception as e:
    logger.warning(f"Could not initialize tables automatically on startup: {e}")

app = FastAPI(
    title="InternTrack API",
    description="High-performance REST API for InternTrack — Internship Application Management System",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for robust development and deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under API prefix (/api)
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(applications_router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_PREFIX)
app.include_router(interviews_router, prefix=settings.API_PREFIX)
app.include_router(reminders_router, prefix=settings.API_PREFIX)
app.include_router(notes_router, prefix=settings.API_PREFIX)
app.include_router(profile_router, prefix=settings.API_PREFIX)

@app.get("/api/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to InternTrack API",
        "docs": "/docs",
        "status": "running"
    }
