from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    college: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[int] = None
    target_role: Optional[str] = None
    preferred_locations: Optional[str] = None
    preferred_work_mode: Optional[str] = None

class UserRegister(UserBase):
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    college: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[int] = None
    target_role: Optional[str] = None
    preferred_locations: Optional[str] = None
    preferred_work_mode: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
