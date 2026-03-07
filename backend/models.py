from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class LoanRecord(Base):
    __tablename__ = "loan_records"

    id = Column(Integer, primary_key=True, index=True)
    borrower_name = Column(String, index=True)
    loan_amnt = Column(Float)
    term = Column(String)
    int_rate = Column(Float)
    installment = Column(Float)
    grade = Column(String)
    annual_inc = Column(Float)
    dti = Column(Float)
    emp_length = Column(String)
    home_ownership = Column(String)
    
    # AI Results
    risk_score = Column(Float)
    estimated_roi = Column(Float)
    recommendation = Column(String)
    flag = Column(String, nullable=True) # E.g., Business Override
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
