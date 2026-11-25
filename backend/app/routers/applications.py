from datetime import datetime
import math
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.database import get_db
from app.models.user import User
from app.models.application import Application
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationStatusUpdate,
    ApplicationResponse,
    ApplicationListResponse
)
from app.utils.security import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("", response_model=ApplicationListResponse)
def get_applications(
    status: Optional[str] = Query(None, description="Filter by application status"),
    search: Optional[str] = Query(None, description="Search by company or job title"),
    location: Optional[str] = Query(None, description="Filter by location"),
    work_mode: Optional[str] = Query(None, description="Filter by work mode (Remote, Hybrid, On-site)"),
    sort_by: str = Query("application_date", description="Field to sort by (application_date, company_name, deadline)"),
    order: str = Query("desc", description="Sort order: asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(100, ge=1, le=500, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Application).filter(Application.user_id == current_user.id)

    if status and status != "All":
        query = query.filter(Application.status == status)
    
    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Application.company_name.ilike(search_filter),
                Application.job_title.ilike(search_filter),
                Application.location.ilike(search_filter)
            )
        )

    if location and location != "All":
        query = query.filter(Application.location.ilike(f"%{location.strip()}%"))

    if work_mode and work_mode != "All":
        query = query.filter(Application.work_mode == work_mode)

    # Sorting
    sort_column = getattr(Application, sort_by, Application.application_date)
    if order.lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return ApplicationListResponse(
        items=[ApplicationResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    app_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app_data = app_in.model_dump()
    if not app_data.get("application_date"):
        app_data["application_date"] = datetime.utcnow()
        
    application = Application(
        user_id=current_user.id,
        **app_data
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.get("/{id}", response_model=ApplicationResponse)
def get_application(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return app

@router.put("/{id}", response_model=ApplicationResponse)
def update_application(
    id: int,
    app_in: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
    update_data = app_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(app, field, value)
    
    app.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(app)
    return app

@router.patch("/{id}/status", response_model=ApplicationResponse)
def update_application_status(
    id: int,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
    app.status = status_update.status
    app.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(app)
    return app

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
    db.delete(app)
    db.commit()
    return None
