from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func
from loan_engine import LoanAssessmentEngine

import models
import database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Loaner AI API", version="1.0.0")

# Instantiate our calibrated models once on startup
print("Loading AI Models into memory...")
engine = LoanAssessmentEngine()

# Define strict input constraints to guarantee our models don't crash
class LoanApplicationSchema(BaseModel):
    borrower_name: str = Field(..., description="Name of the applicant")
    loan_amnt: float = Field(..., gt=0, le=500000)
    int_rate: float = Field(...)
    installment: float = Field(...)
    annual_inc: float = Field(..., gt=0)
    term: str = Field(..., description="Either ' 36 months' or ' 60 months'")
    emp_length: str = Field(..., description="e.g. '10+ years'")
    home_ownership: str = Field(..., description="RENT, MORTGAGE, or OWN")
    dti: float = Field(...)
    delinq_2yrs: float = Field(default=0.0)
    pub_rec: float = Field(default=0.0)
    collections_12_mths_ex_med: float = Field(default=0.0)
    tot_coll_amt: float = Field(default=0.0)
    open_acc: float = Field(default=5.0)
    total_acc: float = Field(default=10.0)
    revol_bal: float = Field(default=0.0)
    revol_util: float = Field(default=0.0)
    grade: str = Field(..., description="A, B, C, D, E, F, or G")
    sub_grade: str = Field(..., description="e.g. A1, C4")

# Configure CORS for local development with Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Loaner AI Backend is running"}

@app.get("/api/portfolio/stats")
def get_portfolio_stats(db: Session = Depends(database.get_db)):
    """Dynamic endpoint serving the main dashboard stats from DB"""
    total_loans = db.query(func.count(models.LoanRecord.id)).scalar() or 0
    if total_loans == 0:
        return {
            "avg_credit_score": 742,
            "total_loan_value": 0,
            "predicted_roi": 0.0,
            "overall_risk": "N/A"
        }
    
    total_value = db.query(func.sum(models.LoanRecord.loan_amnt)).scalar() or 0
    avg_roi = db.query(func.avg(models.LoanRecord.estimated_roi)).scalar() or 0
    avg_risk = db.query(func.avg(models.LoanRecord.risk_score)).scalar() or 0
    
    overall_risk = "Low" if avg_risk < 30 else "Moderate" if avg_risk < 70 else "High"
    
    return {
        "avg_credit_score": 742,
        "total_loan_value": total_value,
        "predicted_roi": round(avg_roi, 2),
        "overall_risk": overall_risk
    }

@app.get("/api/loans/recent")
def get_recent_loans(db: Session = Depends(database.get_db)):
    """Returns the 5 most recent loan applications"""
    recent = db.query(models.LoanRecord).order_by(models.LoanRecord.created_at.desc()).limit(5).all()
    result = []
    for r in recent:
        color = 'primary' if r.risk_score < 30 else 'orange' if r.risk_score < 70 else 'red'
        risk = "Low" if r.risk_score < 30 else "Medium" if r.risk_score < 70 else "High"
        init = "".join([n[0] for n in r.borrower_name.split() if n])[:2].upper() if r.borrower_name else "XX"
        
        result.append({
            "init": init,
            "name": r.borrower_name,
            "id": f"#{r.id + 10000}",
            "type": r.home_ownership.capitalize(),
            "amt": f"${r.loan_amnt:,.0f}",
            "score": round(r.risk_score),
            "color": color,
            "grade": r.grade,
            "risk": risk,
            "status": "Approved" if r.recommendation == "Approve" else "Manual Review"
        })
    return result

@app.get("/api/risk-models")
def get_risk_models():
    """Mock endpoint serving risk model status"""
    return [
       {"id": "prepayment", "name": "Prepayment Model", "accuracy": 94.2, "status": "STABLE"},
       {"id": "safe-loan", "name": "Safe Loan Model", "accuracy": 96.8, "status": "OPTIMIZED"},
       {"id": "credit-risk", "name": "Credit Risk Model", "accuracy": 89.4, "status": "RECALIBRATING"}
    ]

@app.post("/api/assess-loan")
def assess_loan(application: LoanApplicationSchema, db: Session = Depends(database.get_db)):
    """
    Receives a strict JSON payload from the React frontend, processes it
    through our calibrated LoanAssessmentEngine, and returns the risk score,
    estimated ROI, and automated recommendation constraint.
    """
    raw_data = application.dict()
    report = engine.get_full_report(raw_data)
    
    # Save to SQLite Database
    db_record = models.LoanRecord(
        borrower_name=application.borrower_name,
        loan_amnt=application.loan_amnt,
        term=application.term,
        int_rate=application.int_rate,
        installment=application.installment,
        grade=application.grade,
        annual_inc=application.annual_inc,
        dti=application.dti,
        emp_length=application.emp_length,
        home_ownership=application.home_ownership,
        risk_score=report["risk_score"],
        estimated_roi=report["estimated_roi"],
        recommendation=report["recommendation"],
        flag=report.get("flag")
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return report

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
