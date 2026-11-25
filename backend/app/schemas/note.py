from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class NoteBase(BaseModel):
    application_id: Optional[int] = None
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    application_id: Optional[int] = None
    title: Optional[str] = None
    content: Optional[str] = None

class NoteResponse(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    company_name: Optional[str] = None

    class Config:
        from_attributes = True
