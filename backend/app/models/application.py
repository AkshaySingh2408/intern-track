from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    company_name = Column(String(100), nullable=False, index=True)
    job_title = Column(String(100), nullable=False, index=True)
    job_description = Column(Text, nullable=True)
    company_website = Column(String(255), nullable=True)
    application_url = Column(String(255), nullable=True)
    location = Column(String(100), nullable=True)
    work_mode = Column(String(50), default="Remote", nullable=False)  # Remote, Hybrid, On-site
    employment_type = Column(String(50), default="Internship", nullable=False)  # Internship, Full-time, Co-op, Contract
    salary = Column(String(100), nullable=True)
    
    application_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    deadline = Column(DateTime, nullable=True)
    status = Column(String(50), default="Applied", nullable=False, index=True) 
    # Wishlist, Applied, Under Review, Online Assessment, Interview, Offer, Rejected, Withdrawn
    
    recruiter_name = Column(String(100), nullable=True)
    recruiter_email = Column(String(100), nullable=True)
    interview_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    resume_version = Column(String(100), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="applications")
    interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")
    reminders = relationship("Reminder", back_populates="application", cascade="all, delete-orphan")
    app_notes = relationship("Note", back_populates="application", cascade="all, delete-orphan")
