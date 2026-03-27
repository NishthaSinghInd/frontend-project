from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.dialects.postgresql import JSONB
import datetime
from database import Base

class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(Integer, primary_key=True, index=True)
    borrower_name = Column(String, index=True)
    loan_amnt = Column(Float)
    term = Column(String)
    
    # We use JSONB here to dynamically store the full request payload
    # which allows for changing datasets without running migrations constantly.
    raw_data = Column(JSONB)
    
    # Storing AI predictions logic
    ai_results = Column(JSONB)
    
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
