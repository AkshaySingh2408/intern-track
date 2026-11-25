from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import asc
from app.database import get_db
from app.models.user import User
from app.models.application import Application
from app.models.reminder import Reminder
from app.schemas.reminder import (
    ReminderCreate,
    ReminderUpdate,
    ReminderResponse
)
from app.utils.security import get_current_user

router = APIRouter(prefix="/reminders", tags=["Reminders"])

@router.get("", response_model=List[ReminderResponse])
def get_reminders(
    is_completed: Optional[bool] = Query(None, description="Filter by completion status"),
    priority: Optional[str] = Query(None, description="Filter by priority: Low, Medium, High"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Reminder).filter(Reminder.user_id == current_user.id)
    if is_completed is not None:
        query = query.filter(Reminder.is_completed == is_completed)
    if priority and priority != "All":
        query = query.filter(Reminder.priority == priority)

    reminders = query.order_by(asc(Reminder.is_completed), asc(Reminder.due_date)).all()
    results = []
    for rem in reminders:
        res = ReminderResponse.model_validate(rem)
        if rem.application_id:
            app = db.query(Application).filter(Application.id == rem.application_id).first()
            if app:
                res.company_name = app.company_name
        results.append(res)
    return results

@router.post("", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
def create_reminder(
    rem_in: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if rem_in.application_id:
        app = db.query(Application).filter(
            Application.id == rem_in.application_id,
            Application.user_id == current_user.id
        ).first()
        if not app:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    reminder = Reminder(
        user_id=current_user.id,
        **rem_in.model_dump()
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)

    res = ReminderResponse.model_validate(reminder)
    if reminder.application_id:
        app = db.query(Application).filter(Application.id == reminder.application_id).first()
        if app:
            res.company_name = app.company_name
    return res

@router.put("/{id}", response_model=ReminderResponse)
def update_reminder(
    id: int,
    rem_in: ReminderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rem = db.query(Reminder).filter(Reminder.id == id, Reminder.user_id == current_user.id).first()
    if not rem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")

    update_data = rem_in.model_dump(exclude_unset=True)
    if "application_id" in update_data and update_data["application_id"]:
        app = db.query(Application).filter(
            Application.id == update_data["application_id"],
            Application.user_id == current_user.id
        ).first()
        if not app:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    for field, value in update_data.items():
        setattr(rem, field, value)

    rem.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(rem)

    res = ReminderResponse.model_validate(rem)
    if rem.application_id:
        app = db.query(Application).filter(Application.id == rem.application_id).first()
        if app:
            res.company_name = app.company_name
    return res

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rem = db.query(Reminder).filter(Reminder.id == id, Reminder.user_id == current_user.id).first()
    if not rem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")

    db.delete(rem)
    db.commit()
    return None
