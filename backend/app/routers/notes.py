from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.user import User
from app.models.application import Application
from app.models.note import Note
from app.schemas.note import (
    NoteCreate,
    NoteUpdate,
    NoteResponse
)
from app.utils.security import get_current_user

router = APIRouter(prefix="/notes", tags=["Notes"])

@router.get("", response_model=List[NoteResponse])
def get_notes(
    application_id: Optional[int] = Query(None, description="Filter by application id"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Note).filter(Note.user_id == current_user.id)
    if application_id is not None:
        query = query.filter(Note.application_id == application_id)

    notes = query.order_by(desc(Note.updated_at)).all()
    results = []
    for note in notes:
        res = NoteResponse.model_validate(note)
        if note.application_id:
            app = db.query(Application).filter(Application.id == note.application_id).first()
            if app:
                res.company_name = app.company_name
        results.append(res)
    return results

@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note_in: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if note_in.application_id:
        app = db.query(Application).filter(
            Application.id == note_in.application_id,
            Application.user_id == current_user.id
        ).first()
        if not app:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    note = Note(
        user_id=current_user.id,
        **note_in.model_dump()
    )
    db.add(note)
    db.commit()
    db.refresh(note)

    res = NoteResponse.model_validate(note)
    if note.application_id:
        app = db.query(Application).filter(Application.id == note.application_id).first()
        if app:
            res.company_name = app.company_name
    return res

@router.put("/{id}", response_model=NoteResponse)
def update_note(
    id: int,
    note_in: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.id == id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    update_data = note_in.model_dump(exclude_unset=True)
    if "application_id" in update_data and update_data["application_id"]:
        app = db.query(Application).filter(
            Application.id == update_data["application_id"],
            Application.user_id == current_user.id
        ).first()
        if not app:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    for field, value in update_data.items():
        setattr(note, field, value)

    note.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(note)

    res = NoteResponse.model_validate(note)
    if note.application_id:
        app = db.query(Application).filter(Application.id == note.application_id).first()
        if app:
            res.company_name = app.company_name
    return res

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.id == id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    db.delete(note)
    db.commit()
    return None
