from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    
    interview_type = Column(String(50), default="Technical", nullable=False) # Technical, HR, Behavioral, Other
    interview_date = Column(DateTime, nullable=False, index=True)
    meeting_link = Column(String(255), nullable=True)
    status = Column(String(50), default="Scheduled", nullable=False) # Scheduled, Completed, Cancelled
    preparation_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="interviews")
    application = relationship("Application", back_populates="interviews")
