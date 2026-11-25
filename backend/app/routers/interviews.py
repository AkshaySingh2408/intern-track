from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from app.database import get_db
from app.models.user import User
from app.models.application import Application
from app.models.interview import Interview
from app.schemas.interview import (
    InterviewCreate,
    InterviewUpdate,
    InterviewResponse
)
from app.utils.security import get_current_user

router = APIRouter(prefix="/interviews", tags=["Interviews"])

@router.get("", response_model=List[InterviewResponse])
def get_interviews(
    status: Optional[str] = Query(None, description="Scheduled, Completed, Cancelled"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Interview).filter(Interview.user_id == current_user.id)
    if status and status != "All":
        query = query.filter(Interview.status == status)

    interviews = query.order_by(asc(Interview.interview_date)).all()
    results = []
    for inv in interviews:
        app = db.query(Application).filter(Application.id == inv.application_id).first()
        res = InterviewResponse.model_validate(inv)
        if app:
            res.company_name = app.company_name
            res.job_title = app.job_title
        results.append(res)
    return results

@router.post("", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
def create_interview(
    inv_in: InterviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify application belongs to user
    app = db.query(Application).filter(
        Application.id == inv_in.application_id,
        Application.user_id == current_user.id
    ).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    interview = Interview(
        user_id=current_user.id,
        **inv_in.model_dump()
    )
    db.add(interview)
    
    # Also update application status to 'Interview' if it was Applied or Under Review
    if app.status in ["Wishlist", "Applied", "Under Review", "Online Assessment"]:
        app.status = "Interview"
        app.interview_date = inv_in.interview_date
    
    db.commit()
    db.refresh(interview)
    
    res = InterviewResponse.model_validate(interview)
    res.company_name = app.company_name
    res.job_title = app.job_title
    return res

@router.put("/{id}", response_model=InterviewResponse)
def update_interview(
    id: int,
    inv_in: InterviewUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    inv = db.query(Interview).filter(Interview.id == id, Interview.user_id == current_user.id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview not found")

    update_data = inv_in.model_dump(exclude_unset=True)
    if "application_id" in update_data and update_data["application_id"]:
        app = db.query(Application).filter(
            Application.id == update_data["application_id"],
            Application.user_id == current_user.id
        ).first()
        if not app:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    for field, value in update_data.items():
        setattr(inv, field, value)

    inv.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(inv)

    app = db.query(Application).filter(Application.id == inv.application_id).first()
    res = InterviewResponse.model_validate(inv)
    if app:
        res.company_name = app.company_name
        res.job_title = app.job_title
    return res

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    inv = db.query(Interview).filter(Interview.id == id, Interview.user_id == current_user.id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview not found")

    db.delete(inv)
    db.commit()
    return None
